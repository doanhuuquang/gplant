"use client";
import { useParams } from "next/navigation";

export default function ShopPage() {
  const { tags } = useParams<{ tags: string }>();
  return <>{tags}</>;
}
