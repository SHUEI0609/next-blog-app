"use client";

import React, { useEffect, useState } from "react";
import { Category } from "@/generated/prisma/client";

const AdminCategoryPage: React.FC = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  
  // 新規作成用state
  const [newCategoryName, setNewCategoryName] = useState("");
  const [isCreating, setIsCreating] = useState(false);

  // 編集用state
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingName, setEditingName] = useState("");
  const [isUpdating, setIsUpdating] = useState(false);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const res = await fetch("/api/categories");
      if (!res.ok) throw new Error("カテゴリの取得に失敗しました");
      const data = await res.json();
      setCategories(data);
    } catch (error) {
      console.error(error);
      alert("カテゴリの取得に失敗しました");
    } finally {
      setLoading(false);
    }
  };

  // 新規作成ハンドラ
  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCategoryName.trim()) return;

    setIsCreating(true);
    try {
      const res = await fetch("/api/admin/categories", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: newCategoryName }),
      });

      if (!res.ok) throw new Error("作成に失敗しました");

      const newCategory = await res.json();
      setCategories([newCategory, ...categories]);
      setNewCategoryName("");
    } catch (error) {
      console.error(error);
      alert("作成に失敗しました");
    } finally {
      setIsCreating(false);
    }
  };

  // 編集モード開始
  const startEdit = (category: Category) => {
    setEditingId(category.id);
    setEditingName(category.name);
  };

  // 編集キャンセル
  const cancelEdit = () => {
    setEditingId(null);
    setEditingName("");
  };

  // 更新ハンドラ
  const handleUpdate = async () => {
    if (!editingId || !editingName.trim()) return;

    setIsUpdating(true);
    try {
      const res = await fetch(`/api/admin/categories/${editingId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: editingName }),
      });

      if (!res.ok) throw new Error("更新に失敗しました");

      const updatedCategory = await res.json();
      setCategories(
        categories.map((c) => (c.id === editingId ? updatedCategory : c))
      );
      cancelEdit();
    } catch (error) {
      console.error(error);
      alert("更新に失敗しました");
    } finally {
      setIsUpdating(false);
    }
  };

  // 削除ハンドラ
  const handleDelete = async (id: string) => {
    if (!confirm("本当に削除しますか？")) return;

    try {
      const res = await fetch(`/api/admin/categories/${id}`, {
        method: "DELETE",
      });

      if (!res.ok) throw new Error("削除に失敗しました");

      setCategories(categories.filter((c) => c.id !== id));
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
        <h1 className="page-title">カテゴリ管理</h1>
      </div>

      {/* 新規作成フォーム */}
      <div className="form-container" style={{ maxWidth: "100%", marginBottom: "2rem" }}>
        <h2 className="form-label">新規カテゴリ作成</h2>
        <form onSubmit={handleCreate} style={{ display: "flex", gap: "1rem", flexWrap: "wrap" }}>
          <input
            type="text"
            value={newCategoryName}
            onChange={(e) => setNewCategoryName(e.target.value)}
            placeholder="カテゴリ名を入力"
            className="form-input"
            style={{ flex: "1 1 300px" }}
            disabled={isCreating}
          />
          <button
            type="submit"
            className="form-btn"
            style={{ width: "auto", flex: "1 1 100px", minWidth: "120px" }}
            disabled={isCreating || !newCategoryName.trim()}
          >
            {isCreating ? "作成中..." : "作成"}
          </button>
        </form>
      </div>

      {/* カテゴリ一覧 */}
      <div className="admin-table-container">
        <table className="admin-table">
          <thead>
            <tr>
              <th>カテゴリ名</th>
              <th style={{ textAlign: "right" }}>操作</th>
            </tr>
          </thead>
          <tbody>
            {categories.map((category) => (
              <tr key={category.id}>
                <td>
                  {editingId === category.id ? (
                    <input
                      type="text"
                      value={editingName}
                      onChange={(e) => setEditingName(e.target.value)}
                      className="form-input"
                      style={{ minWidth: "150px" }}
                    />
                  ) : (
                    category.name
                  )}
                </td>
                <td style={{ textAlign: "right" }}>
                  {editingId === category.id ? (
                    <div style={{ display: "flex", gap: "0.5rem", justifyContent: "flex-end", whiteSpace: "nowrap" }}>
                      <button
                        onClick={handleUpdate}
                        className="action-btn edit-btn"
                        disabled={isUpdating}
                        style={{ padding: "0.5rem 0.75rem" }}
                      >
                        保存
                      </button>
                      <button
                        onClick={cancelEdit}
                        className="action-btn"
                        style={{ backgroundColor: "var(--text-muted)", color: "white", padding: "0.5rem 0.75rem" }}
                      >
                        中止
                      </button>
                    </div>
                  ) : (
                    <div style={{ display: "flex", gap: "0.5rem", justifyContent: "flex-end", whiteSpace: "nowrap" }}>
                      <button
                        onClick={() => startEdit(category)}
                        className="action-btn edit-btn"
                        style={{ padding: "0.5rem 0.75rem" }}
                      >
                        編集
                      </button>
                      <button
                        onClick={() => handleDelete(category.id)}
                        className="action-btn delete-btn"
                        style={{ padding: "0.5rem 0.75rem" }}
                      >
                        削除
                      </button>
                    </div>
                  )}
                </td>
              </tr>
            ))}
            {categories.length === 0 && (
              <tr>
                <td colSpan={2} style={{ textAlign: "center", color: "var(--text-muted)" }}>
                  カテゴリがまだありません。
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminCategoryPage;
