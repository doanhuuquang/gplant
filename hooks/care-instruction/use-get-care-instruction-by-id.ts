import { useCallback, useEffect, useState } from "react";
import CareInstructionResponse from "@/lib/schemas/care-instruction.ts/care-instruction-response";
import { getCareInstructionById } from "@/services/care-instruction-service";

export function useGetCareInstructionById(id: string) {
  const [data, setData] = useState<CareInstructionResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetch = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await getCareInstructionById(id);
      setData(res.data as CareInstructionResponse);
    } catch (e: any) {
      setError(e?.message || "Error loading data");
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    if (id) fetch();
  }, [id, fetch]);

  return { data, loading, error, refetch: fetch };
}
