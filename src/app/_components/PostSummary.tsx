"use client";
import React from "react";
import Link from "next/link";
import type { Post } from "@/app/_types/Post";

type Props = {
  post: Post;
};

const PostSummary: React.FC<Props> = (props) => {
  const { post } = props;
  const date = new Date(post.createdAt).toLocaleDateString("ja-JP", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <Link href={`/posts/${post.id}`} className="post-link">
      <div className="post-card">
        <div className="flex items-center gap-2 mb-2">
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
                    padding: "2px 8px",
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
        <div className="post-card-title">{post.title}</div>
        <div className="post-content-preview" dangerouslySetInnerHTML={{ __html: post.content }} />
      </div>
    </Link>
  );
};

export default PostSummary;
