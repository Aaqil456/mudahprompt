create table if not exists custom_prompt_builders (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users(id) on delete cascade,
  title text not null,
  fields text[] not null,
  template text not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS
alter table custom_prompt_builders enable row level security;

-- Create policies
create policy "Users can view their own prompt builders"
  on custom_prompt_builders for select
  using (auth.uid() = user_id);

create policy "Users can insert their own prompt builders"
  on custom_prompt_builders for insert
  with check (auth.uid() = user_id);

create policy "Users can update their own prompt builders"
  on custom_prompt_builders for update
  using (auth.uid() = user_id);

create policy "Users can delete their own prompt builders"
  on custom_prompt_builders for delete
  using (auth.uid() = user_id);

-- Create updated_at trigger
create or replace function handle_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger set_updated_at
  before update on custom_prompt_builders
  for each row
  execute function handle_updated_at(); 