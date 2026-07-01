-- Sazón Local RD MVP schema
create extension if not exists "pgcrypto";

create type public.app_role as enum ('admin', 'comercio');

create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text,
  role public.app_role not null default 'comercio',
  business_id uuid,
  created_at timestamptz not null default now()
);

create table public.businesses (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null references auth.users(id) on delete cascade,
  name text not null,
  slug text not null unique,
  logo_url text,
  description text,
  zone text not null,
  hours text,
  whatsapp text not null,
  category text not null default 'Comida',
  is_open boolean not null default false,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.profiles add constraint profiles_business_id_fkey foreign key (business_id) references public.businesses(id) on delete set null;

create table public.categories (
  id uuid primary key default gen_random_uuid(),
  business_id uuid references public.businesses(id) on delete cascade,
  name text not null,
  slug text not null,
  created_at timestamptz not null default now(),
  unique (business_id, slug)
);

create table public.products (
  id uuid primary key default gen_random_uuid(),
  business_id uuid not null references public.businesses(id) on delete cascade,
  category_id uuid references public.categories(id) on delete set null,
  name text not null,
  description text,
  price numeric(10,2) not null check (price >= 0),
  image_url text,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.orders (
  id uuid primary key default gen_random_uuid(),
  business_id uuid not null references public.businesses(id) on delete cascade,
  customer_name text not null,
  fulfillment_note text not null,
  note text,
  items jsonb not null,
  total numeric(10,2) not null,
  sent_to_whatsapp boolean not null default true,
  created_at timestamptz not null default now()
);

create or replace function public.is_admin() returns boolean language sql stable security definer set search_path = public as $$
  select exists(select 1 from public.profiles where id = auth.uid() and role = 'admin');
$$;

alter table public.profiles enable row level security;
alter table public.businesses enable row level security;
alter table public.categories enable row level security;
alter table public.products enable row level security;
alter table public.orders enable row level security;

create policy "profiles own or admin select" on public.profiles for select using (id = auth.uid() or public.is_admin());
create policy "profiles own update" on public.profiles for update using (id = auth.uid() or public.is_admin()) with check (id = auth.uid() or public.is_admin());

create policy "public active businesses" on public.businesses for select using (is_active = true or owner_id = auth.uid() or public.is_admin());
create policy "business owner insert" on public.businesses for insert with check (owner_id = auth.uid() or public.is_admin());
create policy "business owner update" on public.businesses for update using (owner_id = auth.uid() or public.is_admin()) with check (owner_id = auth.uid() or public.is_admin());

create policy "public categories" on public.categories for select using (true);
create policy "owner categories" on public.categories for all using (public.is_admin() or exists(select 1 from public.businesses b where b.id = business_id and b.owner_id = auth.uid())) with check (public.is_admin() or exists(select 1 from public.businesses b where b.id = business_id and b.owner_id = auth.uid()));

create policy "public active products" on public.products for select using (is_active = true and exists(select 1 from public.businesses b where b.id = business_id and b.is_active) or public.is_admin() or exists(select 1 from public.businesses b where b.id = business_id and b.owner_id = auth.uid()));
create policy "owner products" on public.products for all using (public.is_admin() or exists(select 1 from public.businesses b where b.id = business_id and b.owner_id = auth.uid())) with check (public.is_admin() or exists(select 1 from public.businesses b where b.id = business_id and b.owner_id = auth.uid()));

create policy "owner orders" on public.orders for select using (public.is_admin() or exists(select 1 from public.businesses b where b.id = business_id and b.owner_id = auth.uid()));
create policy "public create orders" on public.orders for insert with check (exists(select 1 from public.businesses b where b.id = business_id and b.is_active));
