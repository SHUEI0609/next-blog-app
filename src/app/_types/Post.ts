import { Category } from "@/generated/prisma/client";

export type Post = {
  id: string;
  title: string;
  content: string;
  coverImageURL: string;
  createdAt: string; // ISO 8601 date string
  updatedAt: string; // ISO 8601 date string
  categories: Category[]; // 追加
};
