import { OrderResponse } from "@/types/order";
import { PlantResponse } from "@/types/plant";

export type MessagePart =
  | { type: "text"; content: string }
  | { type: "plant_list"; data: { plants: PlantResponse[] } }
  | { type: "order_list"; data: { orders: OrderResponse[] } }
  | { type: "order_card"; data: { order: OrderResponse } };

const COMPONENT_REGEX = /\[\[(\w+):(\{.*?\})\]\]/gs;

export function parseMessageParts(raw: string): MessagePart[] {
  const parts: MessagePart[] = [];
  let lastIndex = 0;

  for (const match of raw.matchAll(COMPONENT_REGEX)) {
    const [fullMatch, type, json] = match;
    const matchIndex = match.index!;

    if (matchIndex > lastIndex) {
      const text = raw.slice(lastIndex, matchIndex).trim();
      if (text) parts.push({ type: "text", content: text });
    }

    try {
      const data = JSON.parse(json);
      parts.push({ type: type.toLowerCase() as unknown, data });
    } catch {
      parts.push({ type: "text", content: fullMatch });
    }

    lastIndex = matchIndex + fullMatch.length;
  }

  const remaining = raw.slice(lastIndex).trim();
  if (remaining) parts.push({ type: "text", content: remaining });

  return parts;
}
