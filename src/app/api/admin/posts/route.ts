import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

interface CreatePostRequestBody {
  title: string;
  content: string;
  coverImageURL: string;
  categoryIds?: string[];
}

export const POST = async (request: NextRequest) => {
  try {
    const body: CreatePostRequestBody = await request.json();

    const { title, content, coverImageURL, categoryIds } = body;

    // バリデーション (簡易)
    if (!title || !content) {
      return NextResponse.json(
        { error: "必須項目が不足しています" },
        { status: 400 }
      );
    }

    const post = await prisma.post.create({
      data: {
        title,
        content,
        coverImageURL: coverImageURL || "https://placehold.jp/150x150.png",
        // カテゴリとの関連付け
        categories: {
          create: categoryIds?.map((categoryId) => ({
            category: {
              connect: { id: categoryId },
            },
          })),
        },
      },
    });

    return NextResponse.json(post, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "投稿記事の作成に失敗しました" },
      { status: 500 }
    );
  }
};
