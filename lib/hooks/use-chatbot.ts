import { askStream } from "@/lib/api/chatbot";
import { useCallback, useRef, useState } from "react";

export const useAskChatBot = () => {
  const [isStreaming, setIsStreaming] = useState(false);
  const abortRef = useRef<AbortController | null>(null);

  const ask = useCallback(
    async (
      question: string,
      onChunk: (chunk: string) => void,
      onDone: () => void,
    ) => {
      abortRef.current?.abort();
      abortRef.current = new AbortController();

      setIsStreaming(true);
      try {
        await askStream(
          question,
          onChunk,
          () => {
            setIsStreaming(false);
            onDone();
          },
          abortRef.current.signal,
        );
      } catch {
        setIsStreaming(false);
      }
    },
    [],
  );

  const abort = useCallback(() => {
    abortRef.current?.abort();
    setIsStreaming(false);
  }, []);

  return { ask, isStreaming, abort };
};
