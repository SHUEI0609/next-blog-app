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

const Page = async ({ searchParams }: Props) => {
  // APIからデータを取得
  const response = await fetch("http://localhost:3000/api/posts", {
    cache: "no-store", // 常に最新のデータを取得
  });
  
  if (!response.ok) {
    throw new Error("Failed to fetch posts");
  }

  const posts: Post[] = await response.json();

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
};

export default Page;