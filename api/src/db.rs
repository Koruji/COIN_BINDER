use std::str::FromStr;
use sqlx::sqlite::{SqliteConnectOptions, SqlitePool};

pub async fn create_pool(database_url: &str) -> SqlitePool {
    let options = SqliteConnectOptions::from_str(database_url)
        .expect("DATABASE_URL invalide")
        .create_if_missing(true)
        .foreign_keys(true);

    let pool = SqlitePool::connect_with(options)
        .await
        .expect("Can't connect to the database");

    sqlx::migrate!("./migrations")
        .run(&pool)
        .await
        .expect("Can't run migrations");

    pool
}
