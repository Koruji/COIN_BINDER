-- Utilisateur factice en attendant l'authentification (voir src/auth.rs).
-- À supprimer quand l'auth sera en place.
INSERT INTO users (id, email, password_hash) VALUES (1, 'mock@coinbinder.local', 'mock');
