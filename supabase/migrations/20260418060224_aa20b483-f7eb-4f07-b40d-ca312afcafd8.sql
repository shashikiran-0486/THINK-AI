-- profiles
create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text,
  display_name text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.profiles enable row level security;

create policy "profiles_select_own" on public.profiles
  for select to authenticated using (auth.uid() = id);
create policy "profiles_update_own" on public.profiles
  for update to authenticated using (auth.uid() = id);
create policy "profiles_insert_own" on public.profiles
  for insert to authenticated with check (auth.uid() = id);

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, email, display_name)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data->>'display_name', split_part(new.email, '@', 1))
  )
  on conflict (id) do nothing;
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

create or replace function public.set_updated_at()
returns trigger
language plpgsql
set search_path = public
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger profiles_updated_at
  before update on public.profiles
  for each row execute function public.set_updated_at();

-- products (publicly readable catalog)
create table public.products (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  name text not null,
  description text not null,
  price_cents integer not null check (price_cents >= 0),
  category text not null check (category in ('men','women','accessories')),
  image_url text not null,
  sizes text[] not null default '{}',
  badge text,
  trending boolean not null default false,
  featured boolean not null default false,
  created_at timestamptz not null default now()
);

alter table public.products enable row level security;

create policy "products_public_read" on public.products
  for select to anon, authenticated using (true);

-- cart_items
create table public.cart_items (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  product_id uuid not null references public.products(id) on delete cascade,
  size text not null,
  quantity integer not null default 1 check (quantity > 0),
  created_at timestamptz not null default now(),
  unique (user_id, product_id, size)
);

alter table public.cart_items enable row level security;

create policy "cart_select_own" on public.cart_items
  for select to authenticated using (auth.uid() = user_id);
create policy "cart_insert_own" on public.cart_items
  for insert to authenticated with check (auth.uid() = user_id);
create policy "cart_update_own" on public.cart_items
  for update to authenticated using (auth.uid() = user_id);
create policy "cart_delete_own" on public.cart_items
  for delete to authenticated using (auth.uid() = user_id);

-- orders + order_items
create table public.orders (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  total_cents integer not null,
  status text not null default 'paid' check (status in ('paid','shipped','delivered','cancelled')),
  created_at timestamptz not null default now()
);

alter table public.orders enable row level security;

create policy "orders_select_own" on public.orders
  for select to authenticated using (auth.uid() = user_id);
create policy "orders_insert_own" on public.orders
  for insert to authenticated with check (auth.uid() = user_id);

create table public.order_items (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references public.orders(id) on delete cascade,
  product_id uuid not null references public.products(id),
  product_name text not null,
  size text not null,
  quantity integer not null,
  price_cents integer not null
);

alter table public.order_items enable row level security;

create policy "order_items_select_own" on public.order_items
  for select to authenticated using (
    exists (select 1 from public.orders o where o.id = order_id and o.user_id = auth.uid())
  );
create policy "order_items_insert_own" on public.order_items
  for insert to authenticated with check (
    exists (select 1 from public.orders o where o.id = order_id and o.user_id = auth.uid())
  );

-- chat_conversations + chat_messages
create table public.chat_conversations (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade,
  guest_session_id text,
  title text default 'New chat',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  check (user_id is not null or guest_session_id is not null)
);

alter table public.chat_conversations enable row level security;

create policy "convo_select_own" on public.chat_conversations
  for select to authenticated using (auth.uid() = user_id);
create policy "convo_insert_own" on public.chat_conversations
  for insert to authenticated with check (auth.uid() = user_id);
create policy "convo_update_own" on public.chat_conversations
  for update to authenticated using (auth.uid() = user_id);

create table public.chat_messages (
  id uuid primary key default gen_random_uuid(),
  conversation_id uuid not null references public.chat_conversations(id) on delete cascade,
  role text not null check (role in ('user','assistant','system')),
  content text not null,
  product_refs jsonb,
  created_at timestamptz not null default now()
);

alter table public.chat_messages enable row level security;

create policy "msg_select_own" on public.chat_messages
  for select to authenticated using (
    exists (select 1 from public.chat_conversations c
            where c.id = conversation_id and c.user_id = auth.uid())
  );
create policy "msg_insert_own" on public.chat_messages
  for insert to authenticated with check (
    exists (select 1 from public.chat_conversations c
            where c.id = conversation_id and c.user_id = auth.uid())
  );
-- ─────────────────────────────────────────────
-- Seed: expanded product catalog (24 items)
-- ─────────────────────────────────────────────
insert into public.products (slug, name, description, price_cents, category, image_url, sizes, badge, trending, featured) values

-- existing 12 --------------------------------------------------------
('hoodie-lime','Lime Oversized Hoodie','Heavyweight 400gsm cotton hoodie. Dropped shoulders, kangaroo pocket, ribbed cuffs.',8900,'men','hoodie-lime','{XS,S,M,L,XL}','New',true,true),
('puffer-magenta','Magenta Puffer Jacket','Recycled polyester puffer with quilted finish. Oversized silhouette, water-resistant.',13900,'women','puffer-magenta','{XS,S,M,L}','Hot',true,false),
('cargo-black','Black Cargo Pants','Multi-pocket cargo with adjustable waist. Straight leg, utility loops.',7900,'men','cargo-black','{28,30,32,34,36}',null,true,true),
('tee-white','Heavy White Tee','240gsm unisex tee. Boxy fit with reinforced collar and double-stitched hem.',3900,'men','tee-white','{XS,S,M,L,XL,XXL}',null,false,false),
('sneakers-chunky','Chunky Platform Sneakers','Platform sole with premium leather upper. Bold laces, padded ankle collar.',15900,'accessories','sneakers-chunky','{36,37,38,39,40,41,42,43,44}','🔥',true,true),
('vest-mesh','Mesh Layering Vest','Breathable mesh vest. Perfect for layering. Unisex sizing runs true.',4500,'women','vest-mesh','{XS,S,M,L}',null,false,false),
('skirt-check','Check Mini Skirt','Bold oversized check print. A-line silhouette with adjustable waistband.',5900,'women','skirt-check','{XS,S,M,L,XL}','Drop 04',true,false),
('crop-pink','Pink Crop Hoodie','Crop-length hoodie with split kangaroo pocket. Soft-feel fleece lining.',6900,'women','crop-pink','{XS,S,M,L}',null,false,false),
('jeans-wide','Wide Leg Denim','Raw-edge wide-leg jeans. High-rise waist, relaxed through the thigh.',9900,'women','jeans-wide','{26,28,30,32,34}','Bestseller',true,true),
('cap-trucker','Trucker Cap','5-panel foam trucker with ThinkBold woven patch. Snapback closure.',2900,'accessories','cap-trucker','{One Size}',null,false,false),
('bag-sling','Sling Bag','Vegan leather sling in matte finish. Main compartment + front zip pocket.',5500,'accessories','bag-sling','{One Size}',null,false,false),
('sunglasses-chrome','Chrome Shield Shades','Shield-lens sunglasses with chrome mirror finish. UV400 protection.',4900,'accessories','sunglasses-chrome','{One Size}','Limited',true,false),

-- NEW 12 products -----------------------------------------------------
('bomber-olive','Olive Satin Bomber','Satin bomber with contrast ribbing and an embroidered ThinkBold chest logo. Unisex fit.',11900,'men','hoodie-lime','{XS,S,M,L,XL}','New',true,true),
('shorts-tech','Tech Running Shorts','4-way stretch shell with reflective piping and a moisture-wicking liner. Side pockets.',5500,'men','cargo-black','{XS,S,M,L,XL}',null,false,false),
('dress-jersey','Jersey Maxi Dress','Ribbed jersey maxi with a side-slit hem. Minimal neck, oversized shoulder drop.',8500,'women','crop-pink','{XS,S,M,L,XL}','New',true,false),
('hoodie-washed-black','Washed Black Hoodie','Acid-washed 380gsm fleece hoodie. Raw hem, faded finish — wears better every wash.',8200,'men','hoodie-lime','{S,M,L,XL,XXL}',null,false,false),
('crossbody-neon','Neon Crossbody Bag','Compact PU-leather crossbody in electric lime. Adjustable strap, zip organiser pocket.',4200,'accessories','bag-sling','{One Size}','Hot',true,false),
('joggers-cream','Cream Tapered Joggers','Brushed-back fleece with tapered leg and an adjustable drawstring. Ankle-cuff finish.',6500,'men','tee-white','{XS,S,M,L,XL}',null,false,true),
('tank-ribbed','Ribbed Tank Top','Slim-fit ribbed 220gsm tank. Works solo or as a base layer under outerwear.',2800,'women','vest-mesh','{XS,S,M,L}',null,false,false),
('beanie-knit','Oversized Knit Beanie','Chunky 100% wool beanie. Slouchy fit with a woven ThinkBold badge.',2400,'accessories','cap-trucker','{One Size}',null,false,false),
('jacket-leather-vegan','Vegan Leather Moto Jacket','Soft vegan leather with silver-tone hardware, asymmetric zip, and quilted lining.',18900,'women','puffer-magenta','{XS,S,M,L}','Drop 04',true,true),
('pants-plaid','Plaid Wide Trousers','Relaxed-fit plaid trousers. High-rise, wide leg. Statement piece for any drop.',10500,'women','skirt-check','{XS,S,M,L,XL}','New',true,false),
('hoodie-zip-grey','Grey Zip-Up Hoodie','Essential zip-front hoodie in mid-weight grey marl. Embroidered logo on chest.',7200,'men','hoodie-lime','{S,M,L,XL,XXL}',null,false,false),
('sandals-platform','Platform Slide Sandals','Chunky EVA platform slides with a padded strap. Wear poolside or off-duty.',6800,'accessories','sneakers-chunky','{36,37,38,39,40,41,42,43,44}','Hot',true,false);
