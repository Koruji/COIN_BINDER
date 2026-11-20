use axum::response::{IntoResponse, Response};
use axum::http::StatusCode;
use axum::Json;
use axum::extract::rejection::JsonRejection;
use serde::Serialize;

#[derive(Debug, thiserror::Error)]
pub enum AppError {
    #[error("ressource introuvable")]
    NotFound,

    #[error("non autorisé")]
    Unauthorized,

    #[error("conflit : {0}")]
    Conflict(String),

    #[error("validation : {0}")]
    Validation(String),

    #[error("erreur base de données : {0}")]
    Database(#[from] sqlx::Error),
}

impl From<JsonRejection> for AppError {
    fn from(rejection: JsonRejection) -> Self {
        AppError::Validation(rejection.body_text())
    }
}

#[derive(Serialize)]
struct ErrorBody {
    message: String,
}

impl AppError {
    pub fn is_retryable(&self) -> bool {
        matches!(self, AppError::Database(sqlx::Error::PoolTimedOut))
    }
}

impl IntoResponse for AppError {
    fn into_response(self) -> Response {
        let status = match &self {
            AppError::NotFound => StatusCode::NOT_FOUND,
            AppError::Unauthorized => StatusCode::UNAUTHORIZED,
            AppError::Conflict(_) => StatusCode::CONFLICT,
            AppError::Validation(_) => StatusCode::BAD_REQUEST,
            AppError::Database(_) => StatusCode::INTERNAL_SERVER_ERROR,
        };

        if let AppError::Database(e) = &self {
            tracing::error!("Erreur base de données : {:?}", e);
        }

        let message = match &self {
            AppError::Database(_) => "Une erreur interne est survenue".to_string(),
            _ => self.to_string(),
        };

        (status, Json(ErrorBody { message })).into_response()
    }
}