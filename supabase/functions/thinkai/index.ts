// ThinkAi edge function — streams chat with tool calling for product lookup.
// Endpoint: POST { messages: [{role, content}], productCatalog: [{slug,name,...}] }
// Returns SSE stream proxied from Lovable AI Gateway.

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

const SYSTEM_PROMPT = `You are ThinkAi — the fast, friendly AI customer service assistant for ThinkBold, a bold gen-z streetwear brand. You help shoppers with:

1. PRODUCT RECOMMENDATIONS — When a user describes an occasion, vibe, or style ("summer party", "rainy day fit", "something loud"), recommend 1-3 matching products from the catalog provided in the system context. Use the recommend_products tool to surface them as cards.

2. FAQs — Use this knowledge:
   • Shipping: 3–5 business days domestic, free over $75. International 7–14 days.
   • Returns: 30-day return window. Items must be unworn with tags. Free return label.
   • Sizing: We run oversized — size DOWN one if you want a regular fit. Models wear M.
   • Payment: All major cards, Apple/Google Pay. Mock checkout in this demo.
   • Materials: Heavyweight cotton, recycled polyester puffers, vegan leather.

3. ORDER LOOKUP — If a user asks about an order, ask for their order ID and use the lookup_order tool.

4. CONVERSATION — Be warm, concise, gen-z energy but professional. Use emojis sparingly. Keep replies short (2-4 sentences) unless they ask for detail. Format with markdown when useful.

If a question is outside ThinkBold scope, politely steer back to fashion/orders.`;

const tools = [
  {
    type: "function",
    function: {
      name: "recommend_products",
      description: "Recommend 1 to 3 products from the catalog by their exact slug. Use when the user asks for outfit ideas, recommendations, or 'what should I wear'.",
      parameters: {
        type: "object",
        properties: {
          slugs: {
            type: "array",
            items: { type: "string" },
            minItems: 1,
            maxItems: 3,
            description: "Product slugs from the provided catalog.",
          },
          reason: {
            type: "string",
            description: "Short one-sentence reason these match the user's request.",
          },
        },
        required: ["slugs", "reason"],
        additionalProperties: false,
      },
    },
  },
  {
    type: "function",
    function: {
      name: "lookup_order",
      description: "Look up an order by its short ID (or last 8 chars). Use only if user provides an ID.",
      parameters: {
        type: "object",
        properties: {
          order_id: { type: "string", description: "The order ID provided by the user." },
        },
        required: ["order_id"],
        additionalProperties: false,
      },
    },
  },
];

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const { messages, productCatalog } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY missing");

    const catalogStr = Array.isArray(productCatalog)
      ? productCatalog
          .slice(0, 30)
          .map(
            (p: any) =>
              `- ${p.slug}: ${p.name} (${p.category}, $${(p.price_cents / 100).toFixed(0)}) — ${p.description.slice(0, 80)}`,
          )
          .join("\n")
      : "(no catalog provided)";

    const fullMessages = [
      { role: "system", content: `${SYSTEM_PROMPT}\n\nCURRENT CATALOG:\n${catalogStr}` },
      ...(Array.isArray(messages) ? messages : []),
    ];

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-3-flash-preview",
        messages: fullMessages,
        stream: true,
        tools,
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(
          JSON.stringify({ error: "Whoa, slow down — we're rate-limited. Try again in a moment." }),
          { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } },
        );
      }
      if (response.status === 402) {
        return new Response(
          JSON.stringify({
            error: "AI credits exhausted. Add funds in Settings → Workspace → Usage.",
          }),
          { status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" } },
        );
      }
      const t = await response.text();
      console.error("AI gateway error:", response.status, t);
      return new Response(JSON.stringify({ error: "ThinkAi is offline right now." }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    return new Response(response.body, {
      headers: { ...corsHeaders, "Content-Type": "text/event-stream" },
    });
  } catch (e) {
    console.error("thinkai error:", e);
    return new Response(
      JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  }
});
