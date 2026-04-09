## Description

NCDC フロント課題のバックエンドリポジトリ
![](./Design/画面/20220615/03_title_edit.png)

## Installation & exec

```bash
# install
$ npm install
# migration
$ npm run migration:run
# start build
$ npm run build
# 実行
$ npm run start
```

## API

API の Document は、
アプリを起動後、`http://localhost:3000/api` にて Swagger で確認できる。
![](./doc/images/swagger.png)

## DB を初期状態に戻す

```bash
$ cp ./data/bk-dev.sqlite ./data/dev.sqlite
```

---

# フロントエンド課題 — Pages App

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

## フロントエンドのセットアップ

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

Vite の開発サーバーが `/content` へのリクエストを `http://localhost:3000` にプロキシします。

## テストの実行

```bash
cd frontend
npm run test
```

単一ファイルのテスト：

```bash
cd frontend
npx vitest run src/__tests__/PageEditor.test.tsx
```

## 設計方針

### コンポーネント構成

```
App
├── Sidebar        # ページ一覧・追加・削除（編集モード切替あり）
└── PageEditor     # タイトル・本文の表示・編集（各セクション独立）
```

- **関心の分離**: API 呼び出しはすべて `src/api/content.ts` に集約し、コンポーネントは UI ロジックのみを持つ
- **状態の最小化**: 選択中のページは `selectedPage` 一つで管理し、不要な重複状態を避けた
- **独立した編集セクション**: タイトルと本文はそれぞれ独立した Edit/Cancel/Save を持ち、片方の編集中でも他方は影響を受けない
- **サーバー応答で更新**: 保存後にサーバーからの応答データで状態を更新し、整合性を保証する

### バリデーション

| フィールド | 制約 |
|-----------|------|
| タイトル | 1〜50文字 |
| 本文 | 10〜2000文字 |

入力中にリアルタイムでエラーを表示し、バリデーションが通らない限り API を呼ばない。`validateTitle` と `validateBody` は純粋関数として実装し、単体テストでカバーしている。

### テストについて

- **バリデーション単体テスト（8件）**: `validateTitle`/`validateBody` の境界値テスト
- **コンポーネント統合テスト（11件）**: 表示・編集・キャンセル・保存・独立編集のテスト
- 計 **19 件**のテストケースで主要機能をカバー

### 追加実装した機能

- サイドバー編集モード（Edit/Done 切替で削除アイコンの表示を制御）
- リアルタイム文字数カウント表示
- エラー通知バナー（取得・保存失敗時）
- ページ削除後に次のページを自動選択
- 編集キャンセル時に元の値に戻す

## ディレクトリ構成

```
frontend/
├── public/icons/          # SVG アイコン
├── src/
│   ├── api/content.ts     # API ラッパー（fetch ベース）
│   ├── components/
│   │   ├── Sidebar/       # サイドバー（CSS Module 含む）
│   │   └── PageEditor/    # ページ編集エリア（CSS Module 含む）
│   ├── __tests__/         # テスト
│   ├── App.tsx            # トップレベル状態管理・API コールバック
│   ├── App.module.css     # レイアウト
│   └── main.tsx
├── index.html
└── vite.config.ts         # プロキシ・テスト設定
```
