-- Store the AI-generated list of features explicitly excluded from the MVP
-- (PROJECT_OS_REQUIREMENTS.md section 6/7). Not in the original suggested
-- schema, but required to render the "Excluded From MVP" section.
alter table public.projects
  add column if not exists excluded_features text[] not null default '{}';
