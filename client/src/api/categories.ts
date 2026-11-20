import type { Category } from "@/types/categories";

export async function getCategories(
  baseUrl: string | undefined = process.env.EXPO_PUBLIC_API_URL,
): Promise<Category[]> {
  if (!baseUrl) {
    throw new Error("API base URL is not defined (EXPO_PUBLIC_API_URL)");
  }

  const response = await fetch(`${baseUrl}/categories`);

  if (!response.ok) {
    throw new Error(`GET /categories failed with status ${response.status}`);
  }

  return response.json();
}
