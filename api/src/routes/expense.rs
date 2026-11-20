use axum::extract::{Path, State};
use axum::http::StatusCode;
use axum::Json;
use crate::json::AppJson;
use crate::auth::AuthUser;
use crate::error::AppError;
use crate::models::expense::{Expense, NewExpenseForCategory, UpdateExpense};
use crate::state::AppState;

pub async fn list_category_expense(Path(category_id): Path<i64>, auth_user: AuthUser, State(state): State<AppState>) -> Result<Json<Vec<Expense>>, AppError> {
    sqlx::query_scalar::<_, i64>("SELECT id FROM category WHERE id = ? AND user_id = ?")
        .bind(category_id)
        .bind(auth_user.user_id)
        .fetch_optional(&state.pool)
        .await?
        .ok_or(AppError::NotFound)?;

    let expenses = sqlx::query_as::<_, Expense>("SELECT * FROM expense WHERE category_id = ? AND user_id = ?")
        .bind(category_id)
        .bind(auth_user.user_id)
        .fetch_all(&state.pool)
        .await?;

    Ok(Json(expenses))
}

pub async fn get_expense_by_id(Path(id): Path<i64>, auth_user: AuthUser, State(state): State<AppState>) -> Result<Json<Expense>, AppError> {
    let expense = sqlx::query_as::<_, Expense>("SELECT * FROM expense WHERE id = ? AND user_id = ?")
        .bind(id)
        .bind(auth_user.user_id)
        .fetch_optional(&state.pool)
        .await?
        .ok_or(AppError::NotFound)?;

    Ok(Json(expense))
}

pub async fn create_category_expense(State(state): State<AppState>, auth_user: AuthUser, AppJson(payload): AppJson<NewExpenseForCategory>) -> Result<(StatusCode, Json<Expense>), AppError> {
    if payload.label.trim().is_empty() {
        return Err(AppError::Validation("le label ne peut pas être vide".to_string()));
    }

    sqlx::query_scalar::<_, i64>("SELECT id FROM category WHERE id = ? AND user_id = ?")
        .bind(payload.category_id)
        .bind(auth_user.user_id)
        .fetch_optional(&state.pool)
        .await?
        .ok_or(AppError::Validation("catégorie inconnue".to_string()))?;

    let expense = sqlx::query_as::<_, Expense>(
        "INSERT INTO expense (user_id, category_id, month, label, amount) VALUES (?, ?, ?, ?, ?) RETURNING *"
    )
        .bind(auth_user.user_id)
        .bind(payload.category_id)
        .bind(payload.month)
        .bind(payload.label)
        .bind(payload.amount)
        .fetch_one(&state.pool)
        .await?;

    Ok((StatusCode::CREATED, Json(expense)))
}

pub async fn modify_expense(Path(id): Path<i64>, auth_user: AuthUser, State(state): State<AppState>, AppJson(payload): AppJson<UpdateExpense>) -> Result<Json<Expense>, AppError> {
    if payload.label.trim().is_empty() {
        return Err(AppError::Validation("le label ne peut pas être vide".to_string()));
    }

    if let Some(category_id) = payload.category_id {
        sqlx::query_scalar::<_, i64>("SELECT id FROM category WHERE id = ? AND user_id = ?")
            .bind(category_id)
            .bind(auth_user.user_id)
            .fetch_optional(&state.pool)
            .await?
            .ok_or(AppError::Validation("catégorie inconnue".to_string()))?;
    }

    let expense = sqlx::query_as::<_, Expense>(
        "UPDATE expense SET label = ?, amount = ?, category_id = COALESCE(?, category_id) WHERE id = ? AND user_id = ? RETURNING *"
    )
        .bind(payload.label)
        .bind(payload.amount)
        .bind(payload.category_id)
        .bind(id)
        .bind(auth_user.user_id)
        .fetch_optional(&state.pool)
        .await?
        .ok_or(AppError::NotFound)?;

    Ok(Json(expense))
}

pub async fn delete_expense(Path(id): Path<i64>, auth_user: AuthUser, State(state): State<AppState>) -> Result<StatusCode, AppError> {
    let result = sqlx::query("DELETE FROM expense WHERE id = ? AND user_id = ?")
        .bind(id)
        .bind(auth_user.user_id)
        .execute(&state.pool)
        .await?;

    if result.rows_affected() == 0 {
        return Err(AppError::NotFound);
    }

    Ok(StatusCode::NO_CONTENT)
}
