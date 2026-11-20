use crate::auth::AuthUser;
use crate::error::AppError;
use crate::json::AppJson;
use crate::models::category::{Category, NewCategory, UpdateCategory};
use crate::state::AppState;
use axum::Json;
use axum::extract::{Path, State};
use axum::http::StatusCode;

pub async fn list_category(
    State(state): State<AppState>,
    auth_user: AuthUser,
) -> Result<Json<Vec<Category>>, AppError> {
    let categories = sqlx::query_as::<_, Category>("SELECT * FROM category WHERE user_id = ?")
        .bind(auth_user.user_id)
        .fetch_all(&state.pool)
        .await?;

    Ok(Json(categories))
}

pub async fn create_category(
    State(state): State<AppState>,
    auth_user: AuthUser,
    AppJson(payload): AppJson<NewCategory>,
) -> Result<(StatusCode, Json<Category>), AppError> {
    if payload.label.trim().is_empty() {
        return Err(AppError::Validation(
            "le label ne peut pas être vide".to_string(),
        ));
    }

    let category = sqlx::query_as::<_, Category>(
        "INSERT INTO category (user_id, label) VALUES (?, ?) RETURNING *",
    )
    .bind(auth_user.user_id)
    .bind(payload.label)
    .fetch_one(&state.pool)
    .await?;

    Ok((StatusCode::CREATED, Json(category)))
}

pub async fn get_category_by_id(
    Path(id): Path<i64>,
    auth_user: AuthUser,
    State(state): State<AppState>,
) -> Result<Json<Category>, AppError> {
    let category =
        sqlx::query_as::<_, Category>("SELECT * FROM category WHERE id = ? AND user_id = ?")
            .bind(id)
            .bind(auth_user.user_id)
            .fetch_optional(&state.pool)
            .await?
            .ok_or(AppError::NotFound)?;

    Ok(Json(category))
}

pub async fn modify_category(
    Path(id): Path<i64>,
    auth_user: AuthUser,
    State(state): State<AppState>,
    AppJson(payload): AppJson<UpdateCategory>,
) -> Result<Json<Category>, AppError> {
    if payload.label.trim().is_empty() {
        return Err(AppError::Validation(
            "le label ne peut pas être vide".to_string(),
        ));
    }

    let category = sqlx::query_as::<_, Category>(
        "UPDATE category SET label = ? WHERE id = ? AND user_id = ? RETURNING *",
    )
    .bind(payload.label)
    .bind(id)
    .bind(auth_user.user_id)
    .fetch_optional(&state.pool)
    .await?
    .ok_or(AppError::NotFound)?;

    Ok(Json(category))
}

pub async fn delete_category(
    Path(id): Path<i64>,
    auth_user: AuthUser,
    State(state): State<AppState>,
) -> Result<StatusCode, AppError> {
    let result = sqlx::query("DELETE FROM category WHERE id = ? AND user_id = ?")
        .bind(id)
        .bind(auth_user.user_id)
        .execute(&state.pool)
        .await?;

    if result.rows_affected() == 0 {
        return Err(AppError::NotFound);
    }

    Ok(StatusCode::NO_CONTENT)
}
