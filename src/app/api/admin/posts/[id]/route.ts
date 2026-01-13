import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

type Params = {
  params: {
    id: string;
  };
};

// 更新
export const PUT = async (request: NextRequest, { params }: Params) => {
  const { id } = params;
  try {
    const body = await request.json();
    const { title, content, coverImageURL, categoryIds } = body;

    const updatedPost = await prisma.post.update({
      where: { id },
      data: {
        title,
        content,
        coverImageURL: coverImageURL || "https://placehold.jp/150x150.png",
        categories: {
          deleteMany: {}, // 既存の関連をすべて削除
          create: categoryIds?.map((categoryId: string) => ({
            category: {
              connect: { id: categoryId },
            },
          })),
        },
      },
    });

    return NextResponse.json(updatedPost);
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "記事の更新に失敗しました" },
      { status: 500 }
    );
  }
};

// 削除
export const DELETE = async (request: NextRequest, { params }: Params) => {
  const { id } = params;
  try {
    await prisma.post.delete({
      where: { id },
    });

    return NextResponse.json({ message: "削除しました" });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "記事の削除に失敗しました" },
      { status: 500 }
    );
  }
};
