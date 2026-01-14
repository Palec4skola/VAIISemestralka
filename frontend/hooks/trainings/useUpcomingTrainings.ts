import { useEffect, useState } from "react";
import { TrainingListItem } from "../../types/training";
import { apiClient } from "../../lib/apiClient";

export function useUpcomingTrainings() {
  const [trainings, setTrainings] = useState<TrainingListItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const load = async () => {
      try {
        const res = await apiClient("/trainings/upcoming");

        if (!res.ok) {
          setError(await res.text());
          return;
        }

        setTrainings(await res.json());
      } catch {
        setError("Server nie je dostupný");
      } finally {
        setLoading(false);
      }
    };

    load();
  }, []);

  return { trainings, loading, error };
}
