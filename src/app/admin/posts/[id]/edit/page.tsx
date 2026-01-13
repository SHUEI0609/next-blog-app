"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Post } from "@/app/_types/Post";
import { Category } from "@/generated/prisma/client";

type Props = {
  params: {
    id: string;
  };
};

const EditPostPage: React.FC<Props> = ({ params }) => {
  const router = useRouter();
  const { id } = params;

  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // カテゴリ関連
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategoryIds, setSelectedCategoryIds] = useState<string[]>([]);

  const [formData, setFormData] = useState({
    title: "",
    content: "",
    coverImageURL: "",
  });

  // データ取得
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [postRes, categoriesRes] = await Promise.all([
          fetch(`/api/posts/${id}`),
          fetch("/api/categories"),
        ]);

        if (!postRes.ok) throw new Error("Failed to fetch post");
        if (!categoriesRes.ok) throw new Error("Failed to fetch categories");

        const post: Post = await postRes.json();
        const categoriesData: Category[] = await categoriesRes.json();

        setFormData({
          title: post.title,
          content: post.content,
          coverImageURL: post.coverImageURL || "",
        });

        setCategories(categoriesData);
        // 既存のカテゴリを設定
        setSelectedCategoryIds(post.categories.map((c) => c.id));
      } catch (err) {
        console.error(err);
        setError("データの取得に失敗しました");
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [id]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const toggleCategory = (id: string) => {
    setSelectedCategoryIds((prev) =>
      prev.includes(id) ? prev.filter((cid) => cid !== id) : [...prev, id]
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      const response = await fetch(`/api/admin/posts/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...formData,
          categoryIds: selectedCategoryIds,
        }),
      });

      if (!response.ok) {
        throw new Error("更新に失敗しました");
      }

      // 成功したら一覧へリダイレクト
      router.push("/admin/posts");
      router.refresh();
    } catch (err) {
      setError("エラーが発生しました。もう一度お試しください。");
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return <div className="loading-container">読み込み中...</div>;
  }

  return (
    <div className="main-container">
      <h1 className="page-title" style={{ marginBottom: "2rem" }}>
        記事編集
      </h1>

      <div className="form-container">
        {error && (
          <div style={{ color: "red", marginBottom: "1rem" }}>{error}</div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label font-bold">カテゴリ</label>
            <div className="flex flex-wrap gap-2">
              {categories.map((category) => (
                <label
                  key={category.id}
                  className="flex items-center gap-1 border px-2 py-1 rounded cursor-pointer hover:bg-gray-50"
                >
                  <input
                    type="checkbox"
                    checked={selectedCategoryIds.includes(category.id)}
                    onChange={() => toggleCategory(category.id)}
                  />
                  {category.name}
                </label>
              ))}
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="title" className="form-label">
              タイトル
            </label>
            <input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              className="form-input"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="coverImageURL" className="form-label">
              カバー画像URL (任意)
            </label>
            <input
              type="url"
              id="coverImageURL"
              name="coverImageURL"
              value={formData.coverImageURL}
              onChange={handleChange}
              className="form-input"
              placeholder="未入力の場合はデフォルト画像が設定されます"
            />
          </div>

          <div className="form-group">
            <label htmlFor="content" className="form-label">
              本文 (HTML可)
            </label>
            <textarea
              id="content"
              name="content"
              value={formData.content}
              onChange={handleChange}
              className="form-textarea"
              required
            />
          </div>

          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <button
              type="button"
              className="form-btn"
              style={{ backgroundColor: "#ef4444", width: "auto" }}
              onClick={async () => {
                if (!confirm("本当に削除しますか？")) return;
                try {
                  const res = await fetch(`/api/admin/posts/${id}`, {
                    method: "DELETE",
                  });
                  if (!res.ok) throw new Error("削除に失敗しました");
                  router.push("/admin/posts");
                  router.refresh();
                } catch (err) {
                  alert("削除に失敗しました");
                  console.error(err);
                }
              }}
              disabled={isSubmitting}
            >
              削除する
            </button>
            
            <div style={{ display: "flex", gap: "1rem" }}>
              <button
                type="button"
                className="form-btn"
                style={{ backgroundColor: "var(--text-muted)", width: "auto" }}
                onClick={() => router.back()}
                disabled={isSubmitting}
              >
                キャンセル
              </button>
              <button
                type="submit"
                className="form-btn"
                style={{ width: "auto" }}
                disabled={isSubmitting}
              >
                {isSubmitting ? "更新中..." : "更新する"}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditPostPage;
