-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- Create Tasks table
create table tasks (
  id uuid default uuid_generate_v4() primary key,
  title text not null,
  description text,
  status text not null default 'todo', -- todo, in_progress, review, done
  priority text default 'medium', -- low, medium, high, urgent
  project_id uuid references projects(id) on delete cascade,
  assignee_id uuid references auth.users(id),
  due_date timestamp with time zone,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

-- Create Project Updates table
create table project_updates (
  id uuid default uuid_generate_v4() primary key,
  project_id uuid references projects(id) on delete cascade,
  author_id uuid references auth.users(id),
  content text not null,
  health text not null, -- on_track, at_risk, off_track
  created_at timestamp with time zone default now()
);

-- Enhance Team Members (Profiles)
-- Assuming a profiles table exists or creating a new one linked to auth.users
create table if not exists profiles (
  id uuid references auth.users(id) primary key,
  full_name text,
  avatar_url text,
  role text default 'member', -- admin, member
  department text, -- engineering, design, product, sales, marketing
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

-- Add RLS policies (examples)
alter table tasks enable row level security;
alter table project_updates enable row level security;
alter table profiles enable row level security;

-- Policies would go here (e.g., Admin sees all, Members see assigned)
