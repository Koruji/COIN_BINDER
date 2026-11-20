#[derive(sqlx::FromRow, serde::Serialize)]
pub struct Category {
    pub id: i64,
    pub user_id: i64,
    pub label: String,
    pub amount: f64,
    pub created_at: String,
}

#[derive(serde::Deserialize)]
pub struct NewCategory {
    pub label: String
}

#[derive(serde::Deserialize)]
pub struct UpdateCategory {
    pub label: String
}