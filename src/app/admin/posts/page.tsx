"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { Post } from "@/app/_types/Post";

const AdminPostListPage: React.FC = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchPosts = async () => {
    try {
      const res = await fetch("/api/posts");
      if (!res.ok) throw new Error("Failed to fetch posts");
      const data = await res.json();
      setPosts(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  const handleDelete = async (id: string) => {
    if (!window.confirm("本当に削除してもよろしいですか？")) return;

    try {
      const res = await fetch(`/api/admin/posts/${id}`, {
        method: "DELETE",
      });

      if (!res.ok) throw new Error("Failed to delete post");

      // 一覧から削除された記事を除外
      setPosts(posts.filter((post) => post.id !== id));
    } catch (error) {
      console.error(error);
      alert("削除に失敗しました");
    }
  };

  if (loading) {
    return <div className="loading-container">読み込み中...</div>;
  }

  return (
    <div className="main-container">
      <div className="admin-header">
        <h1 className="page-title">記事管理</h1>
        <Link href="/admin/posts/new">
          <button className="form-btn" style={{ width: "auto" }}>
            新規作成
          </button>
        </Link>
      </div>

      <div className="admin-table-container">
        <table className="admin-table">
          <thead>
            <tr>
              <th>タイトル</th>
              <th style={{ textAlign: "center" }}>作成日時</th>
              <th style={{ textAlign: "right" }}>操作</th>
            </tr>
          </thead>
          <tbody>
            {posts.map((post) => {
              const dateObj = new Date(post.createdAt);
              const year = dateObj.getFullYear();
              const monthDay = `${dateObj.getMonth() + 1}/${dateObj.getDate()}`;

              return (
                <tr key={post.id}>
                  <td style={{ padding: "0.5rem 0.25rem" }}>
                    <Link href={`/posts/${post.id}`} className="info-link" style={{ fontSize: "0.875rem", display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" }}>
                      {post.title}
                    </Link>
                  </td>
                  <td style={{ fontSize: "0.8125rem", color: "var(--text-muted)", padding: "0.5rem 0.25rem", textAlign: "center", lineHeight: "1.2" }}>
                    <span>{year}</span>
                    <span className="hide-mobile">/</span>
                    <br className="br-mobile" />
                    <span>{monthDay}</span>
                  </td>
                  <td style={{ padding: "0.5rem 0.25rem" }}>
                    <div style={{ display: "flex", gap: "0.25rem", justifyContent: "flex-end" }}>
                      <Link href={`/admin/posts/${post.id}`}>
                        <button className="action-btn edit-btn" style={{ padding: "0.4rem 0.5rem", fontSize: "0.75rem" }}>編集</button>
                      </Link>
                      <button
                        className="action-btn delete-btn"
                        style={{ padding: "0.4rem 0.5rem", fontSize: "0.75rem" }}
                        onClick={() => handleDelete(post.id)}
                      >
                        削除
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminPostListPage;
