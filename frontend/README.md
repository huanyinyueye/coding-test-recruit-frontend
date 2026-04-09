# Pages App — フロントエンド課題

## 概要

NestJS バックエンドに接続するページ管理 Web アプリです。サイドバーでページを一覧・作成・削除し、メインエリアでタイトルと本文を編集できます。

## 技術スタック

| 用途 | 選択 | 理由 |
|------|------|------|
| UI フレームワーク | React 19 + TypeScript | 最も普及しており、型安全な開発が可能 |
| ビルドツール | Vite | HMR が高速、設定が簡潔 |
| スタイリング | CSS Modules | スコープが自動で閉じており、命名衝突を防げる |
| テスト | Vitest + Testing Library | Vite とネイティブ統合、Jest 互換 API |
| フォント | Noto Sans JP | 仕様指定 |

## セットアップ

### 1. バックエンドを起動する

```bash
# プロジェクトルートで実行
npm install
npm run migration:run
npm run build
npm run start
# → http://localhost:3000 で起動
```

### 2. フロントエンドを起動する

```bash
cd frontend
npm install
npm run dev
# → http://localhost:5173 で起動
```

## テストの実行

```bash
cd frontend
npm run test
```

## 設計方針

### コンポーネント構成

```
App
├── Sidebar        # ページ一覧・追加・削除
└── PageEditor     # タイトル・本文の表示・編集
```

- **関心の分離**: API 呼び出しはすべて `src/api/content.ts` に集約し、コンポーネントは UI ロジックのみを持つ
- **状態の最小化**: 選択中のページは `selectedPage` 一つで管理し、不要な重複状態を避けた
- **サーバー応答で更新**: 保存後にサーバーからの応答データで状態を更新し、整合性を保証する

### バリデーション

| フィールド | 制約 |
|-----------|------|
| タイトル | 1〜50文字 |
| 本文 | 10〜2000文字 |

入力中にリアルタイムでエラーを表示し、バリデーションが通らない限り API を呼ばない。

### 追加実装した機能

- リアルタイム文字数カウント表示
- エラー通知バナー（取得・保存失敗時）
- ページ削除後に次のページを自動選択
- サイドバーでのホバー時に削除ボタンを表示（誤操作防止）
- 編集キャンセル時に元の値に戻す

## ディレクトリ構成

```
frontend/
├── public/icons/          # SVG アイコン
├── src/
│   ├── api/content.ts     # API ラッパー
│   ├── components/
│   │   ├── Sidebar/       # サイドバー
│   │   └── PageEditor/    # ページ編集エリア
│   ├── __tests__/         # テスト
│   ├── App.tsx
│   └── main.tsx
├── index.html
└── vite.config.ts
```
