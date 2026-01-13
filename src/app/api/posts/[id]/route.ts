import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

type Params = {
  params: {
    id: string;
  };
};

export const GET = async (request: NextRequest, { params }: Params) => {
  const { id } = params;

  try {
    const post = await prisma.post.findUnique({
      where: {
        id: id,
      },
      include: {
        categories: {
          include: {
            category: true,
          },
        },
      },
    });

    if (!post) {
      return NextResponse.json(
        { error: "記事が見つかりませんでした" },
        { status: 404 }
      );
    }

    const formattedPost = {
      ...post,
      categories: post.categories.map((pc) => pc.category),
    };

    return NextResponse.json(formattedPost);
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "記事の取得に失敗しました" },
      { status: 500 }
    );
  }
};
