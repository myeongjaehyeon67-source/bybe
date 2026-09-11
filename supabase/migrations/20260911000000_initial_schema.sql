-- Project OS initial schema: projects, features, tasks + RLS.
-- See PROJECT_OS_REQUIREMENTS.md section 13 for the field list this mirrors.

create table if not exists public.projects (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  name text not null,
  description text not null default '',
  original_idea text not null,
  problem text,
  target_user text,
  value_proposition text,
  mvp_summary text,
  platform text,
  experience_level text,
  status text not null default 'planning'
    check (status in ('planning', 'building', 'completed', 'archived')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists projects_user_id_idx on public.projects(user_id);

create table if not exists public.features (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references public.projects(id) on delete cascade,
  title text not null,
  description text not null default '',
  priority text not null default 'medium'
    check (priority in ('high', 'medium', 'low')),
  included_in_mvp boolean not null default true,
  status text not null default 'todo'
    check (status in ('todo', 'doing', 'done')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists features_project_id_idx on public.features(project_id);

create table if not exists public.tasks (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references public.projects(id) on delete cascade,
  feature_id uuid references public.features(id) on delete set null,
  title text not null,
  description text not null default '',
  priority text not null default 'medium'
    check (priority in ('high', 'medium', 'low')),
  status text not null default 'todo'
    check (status in ('todo', 'doing', 'done')),
  acceptance_criteria jsonb not null default '[]'::jsonb,
  ai_coding_prompt text,
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists tasks_project_id_idx on public.tasks(project_id);
create index if not exists tasks_feature_id_idx on public.tasks(feature_id);

-- Keep updated_at current on every row update.
create or replace function public.set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger set_projects_updated_at
  before update on public.projects
  for each row execute function public.set_updated_at();

create trigger set_features_updated_at
  before update on public.features
  for each row execute function public.set_updated_at();

create trigger set_tasks_updated_at
  before update on public.tasks
  for each row execute function public.set_updated_at();

-- Row Level Security: a user may only see/change their own projects,
-- and features/tasks that belong to their own projects.
alter table public.projects enable row level security;
alter table public.features enable row level security;
alter table public.tasks enable row level security;

create policy "Users can view their own projects"
  on public.projects for select
  using (auth.uid() = user_id);

create policy "Users can insert their own projects"
  on public.projects for insert
  with check (auth.uid() = user_id);

create policy "Users can update their own projects"
  on public.projects for update
  using (auth.uid() = user_id);

create policy "Users can delete their own projects"
  on public.projects for delete
  using (auth.uid() = user_id);

create policy "Users can view features of their own projects"
  on public.features for select
  using (exists (
    select 1 from public.projects p
    where p.id = features.project_id and p.user_id = auth.uid()
  ));

create policy "Users can insert features into their own projects"
  on public.features for insert
  with check (exists (
    select 1 from public.projects p
    where p.id = features.project_id and p.user_id = auth.uid()
  ));

create policy "Users can update features of their own projects"
  on public.features for update
  using (exists (
    select 1 from public.projects p
    where p.id = features.project_id and p.user_id = auth.uid()
  ));

create policy "Users can delete features of their own projects"
  on public.features for delete
  using (exists (
    select 1 from public.projects p
    where p.id = features.project_id and p.user_id = auth.uid()
  ));

create policy "Users can view tasks of their own projects"
  on public.tasks for select
  using (exists (
    select 1 from public.projects p
    where p.id = tasks.project_id and p.user_id = auth.uid()
  ));

create policy "Users can insert tasks into their own projects"
  on public.tasks for insert
  with check (exists (
    select 1 from public.projects p
    where p.id = tasks.project_id and p.user_id = auth.uid()
  ));

create policy "Users can update tasks of their own projects"
  on public.tasks for update
  using (exists (
    select 1 from public.projects p
    where p.id = tasks.project_id and p.user_id = auth.uid()
  ));

create policy "Users can delete tasks of their own projects"
  on public.tasks for delete
  using (exists (
    select 1 from public.projects p
    where p.id = tasks.project_id and p.user_id = auth.uid()
  ));
