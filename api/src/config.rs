use std::env;

pub struct Config {
    pub database_url: String,
}

impl Config {
    pub fn from_env() -> Self {
        dotenvy::dotenv().ok();
        let database_url = env::var("DATABASE_URL")
            .unwrap_or_else(|_| "sqlite://coin_binder.db".to_string());

        Config { database_url }
    }
}
