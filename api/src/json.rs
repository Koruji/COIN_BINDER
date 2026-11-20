use axum::extract::FromRequest;
use crate::error::AppError;

// Comme `axum::Json`, mais une erreur de désérialisation passe par AppError
// (400 + { "message": ... }) au lieu du 422 en texte brut d'axum.
#[derive(FromRequest)]
#[from_request(via(axum::Json), rejection(AppError))]
pub struct AppJson<T>(pub T);
