# Next.js Blog App ✍️

![License](https://img.shields.io/github/license/shuei0609/next-blog-app)
![Next.js](https://img.shields.io/badge/Next.js-14.0-black)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.0-38bdf8)

モダンなWeb技術スタック（Next.js App Router, TypeScript, Tailwind CSS）を用いて構築された、SEO最適化済みのブログアプリケーションです。
パフォーマンス（Core Web Vitals）と開発者体験（DX）を重視して設計しました。

## ✨ 主な機能 (Features)

### ユーザー向け機能
* **記事閲覧**: 高速なページ遷移による快適な読書体験
* **カテゴリ/タグ検索**: 興味のある記事を素早くフィルタリング
* **レスポンシブデザイン**: スマートフォン、タブレット、PCに対応
* **ダークモード**: 端末設定に合わせたテーマ切り替え `[実装していれば記述]`

### 技術的な特徴
* **SSG / ISR**: `[コンテンツ管理方法: microCMS / Markdown files / Notion API]` をデータソースとし、ビルド時に静的生成（またはISR）を行うことで高速な表示を実現。
* **SEO対策**: `Metadata API` を用いた動的なOGP生成、セマンティックなHTML構造。
* **パフォーマンス最適化**: `next/image` による画像最適化、フォントの最適化。

## 🛠 使用技術 (Tech Stack)

このプロジェクトでは、以下の技術を選定・採用しました。

| Category | Technology | Reason for Selection |
| --- | --- | --- |
| **Frontend** | **Next.js (App Router)** | React Server Componentsによるバンドルサイズ削減と、SEOに強いSSR/SSG構成のため。 |
| **Language** | **TypeScript** | 型安全性によるバグの早期発見と、保守性の向上のため。 |
| **Styling** | **Tailwind CSS** | ユーティリティファーストによる開発速度の向上と、CSS設計コストの削減。 |
| **CMS / Data** | **[microCMS / Contentlayer]** | `[例: APIベースで柔軟なコンテンツ管理を行うため / 型安全にMarkdownを扱うため]` |
| **Deployment** | **Vercel** | CI/CDの自動化と、Next.jsの機能を最大限活かすエッジネットワーク利用のため。 |

## 🏗 ディレクトリ構成 (Architecture)

保守性を意識し、関心ごとの分離を行っています。

```bash
.
├── app/                # App Router (Pages & Layouts)
│   ├── components/     # UI Components (Atomic Designを意識)
│   ├── lib/            # Utility functions & API clients
│   └── [slug]/         # Dynamic Routing
├── public/             # Static assets
├── types/              # TypeScript definitions
└── ...
