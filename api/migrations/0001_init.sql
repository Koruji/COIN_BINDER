-- Version 1 du schéma, alignée sur openapi.yaml
-- Convention : dates stockées en TEXT ISO 8601 UTC (ex: 2026-10-01T09:30:00Z)

CREATE TABLE users (
    id            INTEGER PRIMARY KEY AUTOINCREMENT,
    email         TEXT NOT NULL UNIQUE,
    password_hash TEXT NOT NULL,
    created_at    TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%SZ', 'now'))
);

CREATE TABLE category (
    id         INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id    INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    label      TEXT NOT NULL CHECK (length(trim(label)) > 0),
    amount     REAL NOT NULL DEFAULT 0,
    created_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%SZ', 'now'))
);

CREATE TABLE expense (
    id          INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id     INTEGER NOT NULL REFERENCES users(id)    ON DELETE CASCADE,
    category_id INTEGER NOT NULL REFERENCES category(id) ON DELETE CASCADE,
    month       TEXT NOT NULL,  -- premier jour du mois, ex: 2026-10-01T00:00:00Z
    label       TEXT NOT NULL CHECK (length(trim(label)) > 0),
    amount      REAL NOT NULL,
    created_at  TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%SZ', 'now'))
);

CREATE INDEX idx_category_user          ON category(user_id);
CREATE INDEX idx_expense_category_month ON expense(category_id, month);
CREATE INDEX idx_expense_user           ON expense(user_id);

-- Maintien du total (category.amount) quand les dépenses changent
CREATE TRIGGER expense_insert AFTER INSERT ON expense
BEGIN
    UPDATE category SET amount = amount + NEW.amount WHERE id = NEW.category_id;
END;

CREATE TRIGGER expense_update AFTER UPDATE ON expense
BEGIN
    UPDATE category SET amount = amount - OLD.amount WHERE id = OLD.category_id;
    UPDATE category SET amount = amount + NEW.amount WHERE id = NEW.category_id;
END;

CREATE TRIGGER expense_delete AFTER DELETE ON expense
BEGIN
    UPDATE category SET amount = amount - OLD.amount WHERE id = OLD.category_id;
END;
