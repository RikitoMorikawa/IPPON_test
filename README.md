# IPPON Sales Brokerage

不動産仲介業務管理システムのフロントエンドアプリケーション

## 🚀 開発環境セットアップ

### 前提条件

- Node.js (v18 以上推奨)
- npm または yarn
- Git

### インストール

1. **リポジトリのクローン**

   ```bash
   git clone <repository-url>
   cd sales/ippon-sales-brokerage
   ```

2. **依存関係のインストール**

   ```bash
   npm install
   # または
   yarn install
   ```

3. **環境変数の設定**

   ```bash
   # .env.local ファイルを作成
   VITE_API_URL=http://localhost:3000
   ```

4. **開発サーバーの起動**

   ```bash
   npm run dev
   # または
   yarn dev
   ```

   アプリケーションは `http://localhost:5173` で起動します。

## 🎨 UI 開発・確認モード

認証を通さずに UI コンポーネントやページデザインを確認したい場合は、以下の手順で認証をバイパスできます。

### アクセス可能なページ

認証バイパス後、以下のページに直接アクセス可能：

- `/dashboard` - ダッシュボード
- `/inquiry` - 問い合わせ管理
- `/properties` - 物件管理
- `/setting/employees` - 従業員設定
- `/setting/client-profile` - クライアントプロフィール
- `/reports` - レポート管理

### 注意事項

⚠️ **重要**: UI 確認完了後は、必ずコメントアウトした認証処理を元に戻してください。

## 📁 プロジェクト構成

```
src/
├── components/          # 再利用可能なUIコンポーネント
│   ├── CustomInput/     # カスタム入力フィールド
│   ├── CustomButton/    # カスタムボタン
│   ├── CustomModal/     # カスタムモーダル
│   └── ...
├── pages/              # ページコンポーネント
│   ├── Auths/          # 認証関連ページ
│   ├── Dashboard/      # ダッシュボード
│   ├── Properties/     # 物件管理
│   ├── Inquiry/        # 問い合わせ管理
│   └── ...
├── layout/             # レイアウトコンポーネント
│   ├── DashboardLayout/
│   ├── AuthLayout/
│   └── ...
├── store/              # Redux状態管理
├── route/              # ルーティング設定
├── config/             # 設定ファイル
├── utils/              # ユーティリティ関数
└── types/              # TypeScript型定義
```

## 🛠️ 利用技術

### フロントエンド

- **React** (v19) - UI ライブラリ
- **TypeScript** - 型安全性
- **Material-UI** (v6) - UI コンポーネントライブラリ
- **React Router** (v7) - ルーティング
- **Redux Toolkit** - 状態管理
- **React Hook Form** - フォーム管理
- **Axios** - HTTP クライアント
- **Day.js** - 日付操作

### 開発ツール

- **Vite** - ビルドツール
- **ESLint** - コード品質チェック
- **TypeScript** - 型チェック

## 📝 開発ガイドライン

### コンポーネント作成

1. **フォルダ構成**

   ```
   components/ComponentName/
   ├── index.tsx
   └── ComponentName.css (必要に応じて)
   ```

2. **命名規則**

   - コンポーネント名: PascalCase (`CustomButton`)
   - ファイル名: PascalCase (`CustomButton.tsx`)
   - CSS クラス名: camelCase (`.customButton`)

3. **TypeScript 型定義**
   ```typescript
   interface ComponentProps {
     title: string;
     onClick?: () => void;
     disabled?: boolean;
   }
   ```

### ページ作成

1. **フォルダ構成**
   ```
   pages/FeatureName/
   ├── index.tsx
   ├── FeatureName.css
   ├── Create/
   │   └── index.tsx
   └── Update/
       └── index.tsx
   ```

### 状態管理

- Redux Toolkit を使用
- `createSlice` でスライスを作成
- 非同期処理は `createAsyncThunk` を使用

## 🚨 トラブルシューティング

### よくある問題

1. **ポート番号の競合**

   ```bash
   # 別のポートで起動
   npm run dev -- --port 3001
   ```

2. **依存関係のエラー**

   ```bash
   # node_modules を削除して再インストール
   rm -rf node_modules package-lock.json
   npm install
   ```

3. **型エラー**
   ```bash
   # TypeScript の型チェック
   npm run build
   ```

## 📋 利用可能なスクリプト

```bash
npm run dev      # 開発サーバー起動
npm run build    # プロダクションビルド
npm run preview  # ビルド結果のプレビュー
npm run lint     # ESLint実行
```

## 🔗 関連リンク

- [React Documentation](https://react.dev/)
- [Material-UI Documentation](https://mui.com/)
- [Redux Toolkit Documentation](https://redux-toolkit.js.org/)
- [React Router Documentation](https://reactrouter.com/)

## 📞 サポート

開発に関する質問や issue がある場合は、プロジェクトの担当者までお問い合わせください。
