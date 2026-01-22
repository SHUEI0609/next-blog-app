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

// 開発環境ならlocalhost、本番なら実際のURLを使う
const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

export default async function Home({ searchParams }: Props) {
  // エラー処理を含めるのがベスト
  try {
    const res = await fetch(`${apiUrl}/api/posts`, { cache: 'no-store' });
    if (!res.ok) throw new Error('Failed to fetch data');
    const posts: Post[] = await res.json();

    // クエリパラメータからソート順を取得 (デフォルトはdesc:新しい順)
    const sortOrder = searchParams.sort === "asc" ? "asc" : "desc";

    // 指定された順序で並び替え
    const sortedPosts = [...posts].sort((a, b) => {
      const timeA = new Date(a.createdAt).getTime();
      const timeB = new Date(b.createdAt).getTime();

      if (sortOrder === "asc") {
        return timeA - timeB; // 古い順 (昇順)
      } else {
        return timeB - timeA; // 新しい順 (降順)
      }
    });

    // 投稿記事の一覧を出力
    return (
      <div className="home-layout">
        <div className="main-content">
          <div className="page-header">
            <h1 className="page-title">投稿一覧</h1>
            <SortControl />
          </div>
          <div className="post-list">
            {sortedPosts.map((post) => (
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
    console.error(error);
    return <div>エラーが発生しました</div>;
  }
}