use axum::{Router, routing::get, routing::post};

mod auth;
mod config;
mod db;
mod error;
mod json;
mod models;
mod routes;
mod state;

use state::AppState;

#[tokio::main]
async fn main() {
    tracing_subscriber::fmt::init();

    let config = config::Config::from_env();
    let pool = db::create_pool(config.database_url.as_str()).await;

    let app_state = AppState { pool };

    let app = Router::new()
        .route("/health", get(health_check))
        .route(
            "/categories",
            get(routes::category::list_category).post(routes::category::create_category),
        )
        .route(
            "/categories/{id}",
            get(routes::category::get_category_by_id)
                .put(routes::category::modify_category)
                .delete(routes::category::delete_category),
        )
        .route(
            "/categories/{category_id}/expenses",
            get(routes::expense::list_category_expense),
        )
        .route(
            "/categories/expenses",
            post(routes::expense::create_category_expense),
        )
        .route(
            "/categories/expenses/{id}",
            get(routes::expense::get_expense_by_id)
                .put(routes::expense::modify_expense)
                .delete(routes::expense::delete_expense),
        )
        .with_state(app_state);

    let listener = tokio::net::TcpListener::bind("0.0.0.0:3000").await.unwrap();
    axum::serve(listener, app).await.unwrap();
}

async fn health_check() -> &'static str {
    "ok"
}
