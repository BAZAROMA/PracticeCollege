CREATE TYPE task_status AS ENUM ('new', 'in_progress', 'done');

CREATE TABLE IF NOT EXISTS tasks (
    id          SERIAL PRIMARY KEY,
    title       VARCHAR(255) NOT NULL,
    description TEXT,
    status      task_status NOT NULL DEFAULT 'new',
    created_at  TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
