import React from "react";
import { notFound } from "next/navigation";
import Link from "next/link";
import type { Post } from "@/app/_types/Post";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";

type Props = {
  params: {
    id: string;
  };
};

const PostDetailPage = async ({ params }: Props) => {
  // APIからデータを取得
  const response = await fetch(`http://localhost:3000/api/posts/${params.id}`, {
    cache: "no-store",
  });

  if (response.status === 404) {
    notFound();
  }

  if (!response.ok) {
    throw new Error("Failed to fetch post");
  }

  const post: Post = await response.json();

  const date = new Date(post.createdAt).toLocaleDateString("ja-JP", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <div className="post-detail-container">
      <Link href="/" className="back-link">
        <FontAwesomeIcon icon={faArrowLeft} className="back-icon" />
        記事一覧に戻る
      </Link>
      
      <article className="post-article">
        <header className="article-header">
          <div className="flex items-center gap-4 mb-4">
            <div className="post-date">{date}</div>
            {post.categories && post.categories.length > 0 && (
              <div style={{ display: "flex", gap: "6px", flexWrap: "wrap" }}>
                {post.categories.map((category) => (
                  <span
                    key={category.id}
                    style={{
                      backgroundColor: "#f1f5f9",
                      color: "#475569",
                      border: "1px solid #e2e8f0",
                      borderRadius: "9999px",
                      padding: "3px 10px",
                      fontSize: "11px",
                      fontWeight: "600",
                      display: "inline-flex",
                      alignItems: "center",
                      gap: "5px",
                      lineHeight: "1",
                    }}
                  >
                    <span style={{ width: "5px", height: "5px", borderRadius: "50%", backgroundColor: "#94a3b8" }}></span>
                    {category.name}
                  </span>
                ))}
              </div>
            )}
          </div>
          <h1 className="article-title">{post.title}</h1>
        </header>
        
        <div className="article-content" dangerouslySetInnerHTML={{ __html: post.content }} />
      </article>
    </div>
  );
};

export default PostDetailPage;
