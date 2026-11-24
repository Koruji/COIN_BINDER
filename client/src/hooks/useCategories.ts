import { useCallback, useEffect, useState } from "react";

import { getCategories } from "@/api/categories";
import { getExpensesByCategory } from "@/api/expenses";
import { toCategoryRow } from "@/mappers/categories";
import { CategoryRow } from "@/types/categories";

export function useCategories() {
  const [categories, setCategories] = useState<CategoryRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [reloadCount, setReloadCount] = useState(0);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      try {
        const apiCategories = await getCategories();
        const rows = await Promise.all(
          apiCategories.map(async (category) =>
            toCategoryRow(category, await getExpensesByCategory(category.id)),
          ),
        );

        if (!cancelled) {
          setCategories(rows);
          setError(null);
        }
      } catch (e) {
        if (!cancelled) {
          setError(e instanceof Error ? e.message : "Unknown error");
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    load();

    return () => {
      cancelled = true;
    };
  }, [reloadCount]);

  const reload = useCallback(() => {
    setLoading(true);
    setError(null);
    setReloadCount((count) => count + 1);
  }, []);

  return { categories, loading, error, reload };
}
