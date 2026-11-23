<p align="center">
  <picture>
    <source media="(prefers-color-scheme: dark)" srcset="shared/logo_light.svg">
    <source media="(prefers-color-scheme: light)" srcset="shared/logo_dark.svg">
    <img alt="Coin Binder" src="shared/logo_light.svg" width="351">
  </picture>
</p>

**COIN BINDER** est la solution de gestion de dépense par excellence. Elle combine portefeuille en solo ou bien en duo, et vous permet de saisir vos dépenses par catégories avec des statistiques de suivi.

Auteur : [@Koruji](https://github.com/Koruji)

## Stack

| Partie | Technologies |
|---|---|
| [`client/`](client) | Expo, React Native, expo-router, TypeScript, Jest |
| [`api/`](api) | Rust, axum, sqlx, SQLite |
| [`openapi.yaml`](openapi.yaml) | Contrat d'API partagé entre le client et l'API |
| [`shared/`](shared) | Ressources communes (logos) |

## Structure

```
.
├── api/            API REST en Rust
│   ├── migrations/ Schéma SQL (appliqué au démarrage)
│   └── src/        routes, modèles, erreurs, auth
├── client/         Application Expo / React Native
├── shared/         Logos
├── openapi.yaml    Contrat d'API
└── docker-compose.yml   Swagger UI sur le contrat
```

## Lancer le projet

### API

Prérequis : [Rust](https://rustup.rs).

```bash
cd api
cargo run
```

L'API écoute sur `http://localhost:3000`. La base SQLite et ses migrations sont créées automatiquement au premier démarrage.

Variable optionnelle (voir [`api/.env.example`](api/.env.example)) :

| Variable | Défaut |
|---|---|
| `DATABASE_URL` | `sqlite://coin_binder.db` |

> L'authentification n'est pas encore implémentée : toutes les requêtes sont faites avec un utilisateur factice (id `1`).

### Client

Prérequis : [Node.js](https://nodejs.org).

```bash
cd client
npm install
npx expo start
```

Crée un fichier `client/.env` avec l'URL de l'API :

```
EXPO_PUBLIC_API_URL=http://localhost:3000
```

Selon la cible : `http://10.0.2.2:3000` sur un émulateur Android, l'IP locale de ta machine sur un téléphone physique.

### Documentation de l'API

```bash
docker compose up
```

Swagger UI est alors disponible sur [http://localhost:8080](http://localhost:8080).

## Endpoints

| Méthode | Route | Description |
|---|---|---|
| `GET` | `/categories` | Liste des catégories (avec le total de leurs dépenses) |
| `POST` | `/categories` | Crée une catégorie |
| `GET` `PUT` `DELETE` | `/categories/{id}` | Lit, modifie, supprime une catégorie |
| `GET` | `/categories/{id}/expenses` | Dépenses d'une catégorie |
| `POST` | `/categories/expenses` | Crée une dépense |
| `GET` `PUT` `DELETE` | `/categories/expenses/{id}` | Lit, modifie, supprime une dépense |

Les erreurs ont toutes la forme `{ "message": "..." }`. Le détail complet est dans [`openapi.yaml`](openapi.yaml).

## Tests

```bash
# API
cd api
cargo fmt --check
cargo clippy -- -D warnings
cargo test

# Client
cd client
npm test              # tests unitaires
npm run test:int      # tests d'intégration
npm run test:coverage # couverture
```

La CI ([`.github/workflows`](.github/workflows)) exécute ces vérifications sur chaque pull request.
