import React from "react";
import type { Post } from "@/app/_types/Post";
import PostSummary from "@/app/_components/PostSummary";
import SortControl from "@/app/_components/SortControl";
import ProfileCard from "@/app/_components/ProfileCard";

type Props = {
  searchParams: {
    sort?: string;
  };
};

import { prisma } from "@/lib/prisma";

export const dynamic = 'force-dynamic'; // 常に最新のデータを取得

export default async function Home({ searchParams }: Props) {
  try {
    // クエリパラメータからソート順を取得 (デフォルトはdesc:新しい順)
    const sortOrder = searchParams.sort === "asc" ? "asc" : "desc";

    // データベースから直接データを取得
    const postsData = await prisma.post.findMany({
      orderBy: {
        createdAt: sortOrder,
      },
      include: {
        categories: {
          include: {
            category: true,
          },
        },
      },
    });

    const posts = postsData.map((post) => ({
      ...post,
      createdAt: post.createdAt.toISOString(),
      updatedAt: post.updatedAt.toISOString(),
      categories: post.categories.map((pc) => ({
        ...pc.category,
        createdAt: pc.category.createdAt.toISOString(),
        updatedAt: pc.category.updatedAt.toISOString(),
      })),
    }));

    // 投稿記事の一覧を出力
    return (
      <div className="home-layout">
        <div className="main-content">
          <div className="page-header">
            <h1 className="page-title">投稿一覧</h1>
            <SortControl />
          </div>
          <div className="post-list">
            {posts.map((post) => (
              <PostSummary key={post.id} post={post} />
            ))}
          </div>
        </div>

        <aside className="sidebar">
          <ProfileCard />
        </aside>
      </div>
    );
  } catch (error) {
    console.error("Failed to fetch posts:", error);
    return <div>データの取得に失敗しました。</div>;
  }
}