export const askStream = async (
  question: string,
  onChunk: (chunk: string) => void,
  onDone: () => void,
  signal?: AbortSignal,
) => {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/chatbot/ask/stream`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ question }),
      signal,
      credentials: "include",
    },
  );

  if (!response.ok) throw new Error("Chatbot request failed");

  const reader = response.body?.getReader();
  const decoder = new TextDecoder();
  if (!reader) return;

  while (true) {
    const { done, value } = await reader.read();
    if (done) {
      onDone();
      break;
    }

    const text = decoder.decode(value);
    for (const line of text.split("\n")) {
      if (line.startsWith("data: ")) {
        onChunk(line.slice(6));
      }
    }
  }
};
