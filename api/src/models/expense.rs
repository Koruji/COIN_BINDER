#[derive(sqlx::FromRow, serde::Serialize)]
pub struct Expense {
    pub id: i64,
    pub user_id: i64,
    pub category_id: i64,
    pub month: String,
    pub label: String,
    pub amount: f64,
    pub created_at: String,
}

#[derive(serde::Deserialize)]
pub struct NewExpenseForCategory {
    pub category_id: i64,
    pub month: String,
    pub label: String,
    pub amount: f64,
}

#[derive(serde::Deserialize)]
pub struct UpdateExpense {
    pub label: String,
    pub category_id: Option<i64>,
    pub amount: f64,
}
