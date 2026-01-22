

import React from "react";
import { notFound } from "next/navigation";
import Link from "next/link";
import { prisma } from "@/lib/prisma"; // Prismaクライアントをインポート
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";

type Props = {
  params: {
    id: string;
  };
};

const PostDetailPage = async ({ params }: Props) => {
  try {
    // データベースから直接データを取得
    const postData = await prisma.post.findUnique({
      where: {
        id: params.id,
      },
      include: {
        categories: {
          include: {
            category: true,
          },
        },
      },
    });

    if (!postData) {
      notFound();
    }

    // 型変換処理 (PrismaのDate型をstringに変換し、Post型に合わせる)
    const post = {
      ...postData,
      createdAt: postData.createdAt.toISOString(),
      updatedAt: postData.updatedAt.toISOString(),
      categories: postData.categories.map((pc) => ({
        ...pc.category,
        createdAt: pc.category.createdAt.toISOString(),
        updatedAt: pc.category.updatedAt.toISOString(),
      })),
    };

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
  } catch (error) {
    console.error("Failed to fetch post:", error);
    return <div>データの取得に失敗しました。</div>;
  }
};

export default PostDetailPage;
