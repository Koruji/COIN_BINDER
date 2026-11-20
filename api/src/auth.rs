use crate::error::AppError;
use crate::state::AppState;
use axum::extract::FromRequestParts;
use axum::http::request::Parts;

/// Utilisateur factice (cf. migrations/0002_mock_user.sql) en attendant l'authentification.
pub const MOCK_USER_ID: i64 = 1;

pub struct AuthUser {
    pub user_id: i64,
}

// TODO(auth): remplacer par la vraie extraction du JWT (header Authorization: Bearer ...)
impl FromRequestParts<AppState> for AuthUser {
    type Rejection = AppError;

    async fn from_request_parts(
        _parts: &mut Parts,
        _state: &AppState,
    ) -> Result<Self, Self::Rejection> {
        Ok(AuthUser {
            user_id: MOCK_USER_ID,
        })
    }
}
