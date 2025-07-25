-- Initialize database schema for Gift List Manager

-- Users table
CREATE TABLE IF NOT EXISTS users
(
    id         SERIAL PRIMARY KEY,
    firstname  VARCHAR(255)        NOT NULL,
    lastname   VARCHAR(255)        NOT NULL,
    username   VARCHAR(255) UNIQUE NOT NULL,
    email      VARCHAR(255) UNIQUE NOT NULL,
    password   VARCHAR(255)        NOT NULL,
    avatar     VARCHAR(1024),
    is_admin   BOOLEAN                  DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Groups table
CREATE TABLE IF NOT EXISTS groups
(
    id         SERIAL PRIMARY KEY,
    name       VARCHAR(255) NOT NULL,
    background VARCHAR(1024),
    created_by INTEGER      NOT NULL REFERENCES users (id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Group members junction table
CREATE TABLE IF NOT EXISTS group_members
(
    group_id INTEGER NOT NULL REFERENCES groups (id) ON DELETE CASCADE,
    user_id  INTEGER NOT NULL REFERENCES users (id) ON DELETE CASCADE,
    PRIMARY KEY (group_id, user_id)
);

-- Events table
CREATE TABLE IF NOT EXISTS events
(
    id         SERIAL PRIMARY KEY,
    name       VARCHAR(255) NOT NULL,
    date       DATE         NOT NULL,
    group_id   INTEGER      NOT NULL REFERENCES groups (id) ON DELETE CASCADE,
    created_by INTEGER      NOT NULL REFERENCES users (id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Gifts table
CREATE TABLE IF NOT EXISTS gifts
(
    id          SERIAL PRIMARY KEY,
    title       VARCHAR(255) NOT NULL,
    link        VARCHAR(1024),
    image       VARCHAR(1024),
    price       DECIMAL(10, 2),
    reserved_by VARCHAR(255),
    event_id    INTEGER      NOT NULL REFERENCES events (id) ON DELETE CASCADE,
    created_by  INTEGER      NOT NULL REFERENCES users (id) ON DELETE CASCADE,
    created_at  TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Reservations table
CREATE TABLE IF NOT EXISTS reservations
(
    id          SERIAL PRIMARY KEY,
    gift_id     INTEGER      NOT NULL REFERENCES gifts (id) ON DELETE CASCADE,
    reserved_by VARCHAR(255) NOT NULL,
    reserved_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Insert some sample data
INSERT INTO users (firstname, lastname, username, email, password, is_admin)
VALUES ('John', 'Doe', 'johndoe', 'john@example.com', 'password_hash_placeholder'),
       ('Jane', 'Doe', 'janedoe', 'jane@example.com', 'password_hash_placeholder'),
       ('Bob', 'Smith', 'bobsmith', 'bob@example.com', 'password_hash_placeholder'),
       ('Alice', 'Johnson', 'alicejohnson', 'alice@example.com', 'password_hash_placeholder')
ON CONFLICT (username) DO NOTHING;

-- Insert sample groups
INSERT INTO groups (name, created_by)
VALUES ('Family', 1),
       ('Friends', 2),
       ('Work', 3)
ON CONFLICT (name) DO NOTHING;