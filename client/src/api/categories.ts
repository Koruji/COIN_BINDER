import { request } from "@/api/request";
import type { Category, NewCategory, UpdateCategory } from "@/types/categories";

export function getCategories(): Promise<Category[]> {
  return request<Category[]>("GET", "/categories");
}

export function getCategoryById(id: number): Promise<Category> {
  return request<Category>("GET", `/categories/${id}`);
}

export function createCategory(category: NewCategory): Promise<Category> {
  return request<Category>("POST", "/categories", category);
}

export function updateCategory(
  id: number,
  category: UpdateCategory,
): Promise<Category> {
  return request<Category>("PUT", `/categories/${id}`, category);
}

export function deleteCategory(id: number): Promise<void> {
  return request<void>("DELETE", `/categories/${id}`);
}
