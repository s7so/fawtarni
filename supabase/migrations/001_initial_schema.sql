-- Fawtarni Database Schema
-- This file contains the SQL to set up the Supabase database.
-- Run this in the Supabase SQL Editor.

-- ============================================================
-- 1. Profiles table (extends auth.users)
-- ============================================================
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  seller_name text not null default '',
  seller_name_en text not null default '',
  seller_address text not null default '',
  seller_tax_number text not null default '',
  seller_phone text not null default '',
  seller_email text not null default '',
  seller_logo text not null default '',
  plan text not null default 'free' check (plan in ('free', 'pro', 'business')),
  plan_started_at timestamptz not null default now(),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.profiles enable row level security;

create policy "Users can view own profile"
  on public.profiles for select
  using (auth.uid() = id);

create policy "Users can update own profile"
  on public.profiles for update
  using (auth.uid() = id);

create policy "Users can insert own profile"
  on public.profiles for insert
  with check (auth.uid() = id);

-- Auto-create profile on signup
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id)
  values (new.id);
  return new;
end;
$$ language plpgsql security definer;

create or replace trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- ============================================================
-- 2. Clients table
-- ============================================================
create table if not exists public.clients (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  name text not null default '',
  name_en text not null default '',
  address text not null default '',
  tax_number text not null default '',
  phone text not null default '',
  email text not null default '',
  created_at timestamptz not null default now()
);

create index idx_clients_user_id on public.clients(user_id);

alter table public.clients enable row level security;

create policy "Users can view own clients"
  on public.clients for select
  using (auth.uid() = user_id);

create policy "Users can insert own clients"
  on public.clients for insert
  with check (auth.uid() = user_id);

create policy "Users can update own clients"
  on public.clients for update
  using (auth.uid() = user_id);

create policy "Users can delete own clients"
  on public.clients for delete
  using (auth.uid() = user_id);

-- ============================================================
-- 3. Invoices table
-- ============================================================
create table if not exists public.invoices (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  invoice_number text not null,
  issue_date date not null default current_date,
  due_date date not null default (current_date + interval '30 days'),
  buyer_name text not null default '',
  buyer_name_en text not null default '',
  total_amount numeric(12,2) not null default 0,
  currency text not null default 'SAR',
  status text not null default 'draft' check (status in ('draft', 'sent', 'paid', 'overdue')),
  data jsonb not null default '{}',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index idx_invoices_user_id on public.invoices(user_id);
create index idx_invoices_status on public.invoices(user_id, status);
create index idx_invoices_created on public.invoices(user_id, created_at);

alter table public.invoices enable row level security;

create policy "Users can view own invoices"
  on public.invoices for select
  using (auth.uid() = user_id);

create policy "Users can insert own invoices"
  on public.invoices for insert
  with check (auth.uid() = user_id);

create policy "Users can update own invoices"
  on public.invoices for update
  using (auth.uid() = user_id);

create policy "Users can delete own invoices"
  on public.invoices for delete
  using (auth.uid() = user_id);

-- ============================================================
-- 4. Helper: count invoices this month (for plan enforcement)
-- ============================================================
create or replace function public.get_monthly_invoice_count(p_user_id uuid)
returns integer as $$
  select count(*)::integer
  from public.invoices
  where user_id = p_user_id
    and created_at >= date_trunc('month', now())
    and created_at < date_trunc('month', now()) + interval '1 month';
$$ language sql security definer;

-- ============================================================
-- 5. Updated_at trigger
-- ============================================================
create or replace function public.update_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger profiles_updated_at
  before update on public.profiles
  for each row execute function public.update_updated_at();

create trigger invoices_updated_at
  before update on public.invoices
  for each row execute function public.update_updated_at();
