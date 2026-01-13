"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Category } from "@/generated/prisma/client";

const NewPostPage: React.FC = () => {
  const router = useRouter();
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

  useEffect(() => {
    // カテゴリ一覧を取得
    const fetchCategories = async () => {
      try {
        const res = await fetch("/api/categories");
        if (!res.ok) throw new Error("カテゴリの取得に失敗しました");
        const data = await res.json();
        setCategories(data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchCategories();
  }, []);

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
      const response = await fetch("/api/admin/posts", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...formData,
          categoryIds: selectedCategoryIds,
        }),
      });

      if (!response.ok) {
        throw new Error("投稿に失敗しました");
      }

      // 成功したらトップページへリダイレクト
      router.push("/");
      router.refresh(); // データ更新を反映
    } catch (err) {
      setError("エラーが発生しました。もう一度お試しください。");
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="main-container">
      <h1 className="page-title" style={{ marginBottom: "2rem" }}>
        新規記事投稿
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
              placeholder="記事のタイトルを入力"
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
              placeholder="記事の本文を入力してください..."
            />
          </div>

          <button
            type="submit"
            className="form-btn"
            disabled={isSubmitting}
          >
            {isSubmitting ? "送信中..." : "投稿する"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default NewPostPage;
