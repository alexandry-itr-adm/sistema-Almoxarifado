create table if not exists employees (
  id uuid primary key default gen_random_uuid(),
  name text,
  role text
);

create table if not exists materials (
  id uuid primary key default gen_random_uuid(),
  name text,
  quantity integer
);

create table if not exists tools (
  id uuid primary key default gen_random_uuid(),
  name text,
  status text,
  employee text
);