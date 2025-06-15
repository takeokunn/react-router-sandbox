# React Router v7 + React プロジェクト設計・実装規約ドキュメント

このドキュメントは、提供されたファイル情報および過去の対話履歴に基づいて、プロジェクトのコードベースから推測される設計方針、コーディング規約、およびアーキテクチャパターンをまとめたものです。

## アプリケーションコーディング規約（app/）

### 1 命名規則

-   **コンポーネント名（PascalCase / suffixなど）：**
    -   Reactコンポーネントは `PascalCase` で命名されています (例: `ContactNavList`, `SidebarHeader`, `NewContactButton`)。
    -   特定の機能やUI要素を表す明確な名前が使用されています。
    -   一般的なUI要素（例：Button）以外には、特定のsuffix（例：`Component`, `Page`）は一貫して使用されていないようです。
-   **フォルダ名・ファイル名の方針：**
    -   機能ごと、または関連性の高いモジュール群をまとめるために、`kebab-case` のフォルダ名が使用されています (例: `edit-contact`, `contact`, `sidebar`, `root`)。
    -   コンポーネントのファイル名は `PascalCase.tsx` (例: `ContactNavList.tsx`)。
    -   TypeScriptの型定義やロジックのみのファイルは `camelCase.ts` または `PascalCase.ts` (例: `data.ts`, `loader.ts`)。
    -   テストファイルは `*.spec.tsx` または `*.spec.ts` というsuffixで命名されています (例: `ContactNavList.spec.tsx`, `action.spec.ts`)。
-   **ルーティング関連のファイル名規則（`app/routes/`など）：**
    -   ルート定義は `app/routes/` ディレクトリ以下に配置されます。
    -   各ルートまたはルートグループは専用のディレクトリを持ちます (例: `app/routes/contact/`, `app/routes/edit-contact/`)。
    -   各ルートディレクトリ内には、以下のファイルが標準的に配置されます：
        -   `route.tsx`: ルートのUIコンポーネント（デフォルトエクスポート）。
        -   `loader.ts`: データローディングロジック (`loader`関数をエクスポート)。
        -   `action.ts`: データミューテーションロジック (`action`関数をエクスポート)。
        -   `index.ts`: 上記モジュール（`route`, `loader`, `action`）を再エクスポートするバレルファイル。
    -   ルートコンポーネント内で使用される子コンポーネントは、そのルートディレクトリ内の `components/` サブディレクトリに配置される傾向があります (例: `app/routes/contact/components/`)。
-   **カスタムフック・ユーティリティ関数の命名規約：**
    -   カスタムフックは `use` プレフィックスで `camelCase` (例: `useLoaderData`, `useNavigation`, `useSubmit`, `useFetcher`, `useNavigate`)。これはReactの標準規約に準拠しています。
    -   ユーティリティ関数は `camelCase` で命名されていると推測されます (例: `getContacts`, `updateContact` in `app/data.ts`)。

### 2 コンポーネント設計と責務分離

-   **ページコンポーネントとUIコンポーネントの責務：**
    -   `app/routes/**/route.tsx` に定義されるコンポーネントがページレベルのコンポーネントとして機能し、データの取得（`useLoaderData`経由）、アクションのトリガー、およびUIコンポーネントのレイアウトと調整を担当します。
    -   `components/` サブディレクトリ内のコンポーネント（例: `app/layouts/sidebar/components/ContactAvatar.tsx`, `app/routes/contact/components/Favorite.tsx`）は、より小さく再利用可能なUIパーツとしての責務を持ち、主にpropsを通じてデータを受け取り、表示やユーザーインタラクションの一部を担当します。
-   **Presentational vs Container の分離有無と基準：**
    -   明確な Presentational / Container パターンの採用は見られます。特に `Favorite` コンポーネントのリファクタリングでは、`useFetcher` を親コンポーネントに移動し、`Favorite` を純粋なPresentational Componentとする変更が行われました。
    -   ルートコンポーネント (`route.tsx`) が Container Component の役割を担い、`components/` 以下のコンポーネントが Presentational Component として機能する傾向があります。
-   **useEffect / useLoaderDataなど副作用の責任範囲：**
    -   `loader` 関数 (React Router): ルートがレンダリングされる前のデータフェッチという副作用を担当します。結果は `useLoaderData` フックを通じてコンポーネントに提供されます。
    -   `action` 関数 (React Router): フォーム送信やその他のデータミューテーションという副作用を担当します。
    -   `useEffect`: コンポーネントのライフサイクルや特定の値の変更に応じた副作用（例: `app/layouts/sidebar/layout.tsx` での `q` の変更に応じた `setQuery`）に使用されます。副作用は、それが最も関連性の高いコンポーネントまたはルートレベルの関数（loader/action）に配置される傾向があります。
    -   `useFetcher`: 完全なナビゲーションを伴わないデータ送信やバックグラウンドでのデータ更新といった副作用に使用されます。
-   **Form処理・バリデーションの責任分離（例：useForm系カスタムフック）：**
    -   React Router の `<Form>` コンポーネントがフォームの宣言と送信に使用されます。
    -   フォームデータの処理とバリデーションは、主にサーバーサイド（または `action` 関数内）で行われると推測されます。`action` 関数が `request.formData()` を使用してデータを取得し、`Object.fromEntries` でオブジェクトに変換後、`updateContact` などのデータ更新関数に渡しています。
    -   `invariant` が `action` 内で使用されており、特定の前提条件（例: `params.contactId` の存在）を検証しています。
    -   複雑なクライアントサイドバリデーションライブラリ（例: `react-hook-form`, `Formik`）の使用は現時点では確認されていません。

### 3 ルーティング設計（React Router v7）

-   **ルート構造の粒度とファイル構成の紐づけ：**
    -   ルートは機能単位で `app/routes/` 以下にディレクトリとして分割されています。各ディレクトリが1つの主要なルートまたは関連するネストされたルート群を表します。
    -   ファイル構成は非常に規律があり、各ルートディレクトリ内に `route.tsx`, `loader.ts`, `action.ts`, `index.ts` が一貫して配置され、ルートの定義、データ処理、UIコンポーネントが明確に分離・関連付けられています。
-   **`loader` / `action` / `errorElement`の使い分け：**
    -   `loader`: ルートコンポーネントが必要とするデータを事前に取得するために使用されます (例: `getContacts`, `getContact`)。データ取得に失敗した場合やデータが存在しない場合は、`Response` オブジェクト (例: 404) をスローすることがあります。
    -   `action`: データの作成、更新、削除 (CUD操作) のために使用されます (例: `createEmptyContact`, `updateContact`, `deleteContact`)。処理後、`redirect` を用いて適切なページに遷移させることが一般的です。
    -   `errorElement`: `app/root/components/ErrorBoundary.tsx` が存在し、これがルートレベルまたは特定のルートで `errorElement` として設定されていると推測されます。Reactのレンダリングエラーや、`loader`/`action` からスローされた `Response` オブジェクトを処理し、ユーザーフレンドリーなエラーUIを表示します。
-   **レイアウトルート / ネストルートの利用傾向：**
    -   `app/root/components/Layout.tsx` が全体的なHTML構造（`<html>`, `<head>`, `<body>`）を提供し、`app/root/components/App.tsx` が `<Outlet />` を使用して子ルートをレンダリングすることから、基本的なレイアウト構造が存在します。
    -   `app/layouts/sidebar/layout.tsx` (現在は `route.tsx`) は、サイドバーを持つ特定のセクションのレイアウトを提供し、`<Outlet />` を介してネストされたコンタクト関連のルートを表示します。これはレイアウトルートの典型的な使用例です。
    -   ファイル構造 (`app/routes/contact/:contactId/edit` など) もネストルートの活用を示唆しています。
-   **認可・ガード（例：RequireAuth）のパターンと共通化：**
    -   現時点のファイル情報からは、明示的な `RequireAuth` コンポーネントやルートガードのパターンは確認されていません。
    -   認可が必要な場合、各 `loader` や `action` の内部で認証状態を確認し、未認証であれば `redirect` でログインページに遷移させる、といった対応が取られる可能性があります。

### 4 状態管理と依存性の注入

-   **状態管理ライブラリの選定と役割（例：Zustand / Redux / useContext）：**
    -   Redux, Zustand, MobX といった外部のグローバル状態管理ライブラリの使用は確認されていません。
    -   状態管理は主に以下の方法で行われています：
        -   React Router の `loader` データと `useLoaderData` によるルートレベルの状態。
        -   コンポーネント内のローカル状態 (`useState`, `useReducer`)。
        -   URLパラメータや検索クエリを通じた状態の保持。
        -   `useFetcher` を利用したUIと非同期アクションの状態管理。
    -   React Context (`useContext`) の使用も限定的であるか、特定のUIテーマや小規模な状態共有に留まっている可能性があります。
-   **非同期ロジック（fetch・mutation）の整理方針（例：RTK Query / React Query）：**
    -   React Query や RTK Query のような専用の非同期状態管理ライブラリは使用されていません。
    -   非同期ロジックは、React Router の `loader` および `action` 関数に集約されています。これらの関数が `app/data.ts` 内のデータ操作関数（例: `getContacts`, `updateContact`）を呼び出しています。
    -   `app/data.ts` がデータ層として機能し、実際のデータソース（現在はモックデータ）とのやり取りを抽象化しています。
-   **外部依存の抽象化とDIパターン（例：APIクライアント、設定値）：**
    -   `app/data.ts` がデータソース（APIクライアントに相当）を抽象化しています。これにより、将来的に実際のバックエンドAPIに切り替える際に、変更箇所を `app/data.ts` に限定しやすくなります。これは一種の依存性の注入 (DI) と言えます。
    -   設定値などの外部依存については、`import.meta.env` を介して環境変数として注入される可能性があります (テストコードで `import.meta.env.DEV` のモックが見られるため)。

### 5 ディレクトリ構成と意味づけ

-   **`components/` `features/` `pages/` `routes/` `hooks/` `lib/` などの意味づけ：**
    -   `app/`: アプリケーションの主要なソースコードが格納されるルートディレクトリ。
    -   `app/root/`: アプリケーション全体のエントリーポイント、全体レイアウト、ルートレベルのローダー/アクション、エラー境界などを配置。
        -   `app/root/components/`: `App.tsx`, `Layout.tsx`, `ErrorBoundary.tsx` など、アプリケーションの骨格となるコンポーネント群。
    -   `app/layouts/`: 特定のレイアウト構造を持つコンポーネント群 (例: `sidebar`)。
        -   `app/layouts/sidebar/components/`: サイドバーレイアウト内で使用される具体的なUIコンポーネント群。
    -   `app/routes/`: ルーティング定義と各ルートに対応するコンポーネント、ローダー、アクションを機能単位で格納。これが実質的な「ページ」または「フィーチャー」の単位となっています。
        -   `app/routes/<feature>/components/`: 特定のルートフィーチャー内で使用されるUIコンポーネント群。
    -   `app/data.ts`: データアクセスロジック、APIクライアントのモック（または実体）を配置する場所。`lib/` や `services/` に相当する役割。
    -   `features/`, `pages/`, `hooks/` (トップレベルの) といったディレクトリは現時点では明確には使用されていません。カスタムフックは関連するコンポーネントやルートの近くに配置されるか、将来的に `app/hooks/` が作成される可能性があります。
-   **ビジネスロジックとUIの分離方針：**
    -   ビジネスロジック（データ取得・更新処理）は `app/data.ts` に集約され、React Router の `loader` / `action` 関数がこれを利用してUIとデータ層を繋ぐ役割を担っています。
    -   UIコンポーネント (`*.tsx`) は、主にデータの表示とユーザーインタラクションに責任を持ち、ビジネスロジックを直接含まないように分離されています。

### 6 コーディングスタイル

-   **TypeScriptの型定義とnullableの扱い：**
    -   TypeScriptが全面的に採用されており、コンポーネントのProps (`type Props = { ... }`)、関数の引数・戻り値、データ構造 (`ContactMutation`, `ContactRecord`) に型定義がなされています。
    -   `TLoader` のような型エイリアス (`export type TLoader = typeof loader;`) を使用して、`loader` 関数の戻り値の型をコンポーネント側で安全に利用しています。
    -   Nullableな値の扱いとして、オプショナルプロパティ (`avatar?: string`) や、`null` または `undefined` を許容する型 (`string | null`, `string | undefined`) が使用されています。
-   **null / undefined の防御方針（例：Optional Chaining / null assertion）：**
    -   Optional Chaining (`?.`) や Nullish Coalescing (`??`) が使用されていると推測されます (例: `contact.avatar ?? undefined`, `contact.first || contact.last ? ...`)。
    -   `invariant` 関数 (例: `tiny-invariant`) が、特定の変数が期待される値を持つこと（null/undefinedでないこと）を表明するために使用されています。
    -   `if (!contact)` のような明示的なnullチェックも行われています。
    -   Null assertion (`!`) の使用頻度は不明ですが、型安全性を重視する観点からは限定的であると望ましいです。
-   **エラーハンドリングの共通化傾向（boundary / toast など）：**
    -   Reactコンポーネントツリー内でのエラーは `app/root/components/ErrorBoundary.tsx` でキャッチされ、一元的に処理される傾向があります。
    -   `loader` や `action` からは、エラー状態に応じて `Response` オブジェクトがスローされ、React Router のエラー処理機構（`errorElement`）によって処理されます。
    -   `window.confirm` が削除操作のような破壊的アクションの前にユーザー確認のために使用されています。
    -   トースト通知のようなUIフィードバック機構の共通化については、現時点では確認されていません。

## 観察された設計思想の傾向（任意）

-   **Atomic DesignなどのUI設計思想の適用有無：**
    -   厳密な Atomic Design の採用は明言されていませんが、UIコンポーネントを `components/` ディレクトリに細かく分割し、それらを組み合わせてページやレイアウトを構築するアプローチは、Atomic Design の「アトム」「モレキュール」「オーガニズム」といった要素の合成によるUI構築の思想と親和性があります。特に `ContactAvatar`, `Favorite`, `NewContactButton` などはアトムやモレキュールに相当すると考えられます。
-   **Fat Componentの回避方法（分割・責務移譲）：**
    -   プロジェクトの進化の過程（過去の対話履歴）で、大きなコンポーネント（例: `Sidebar`, `Root`)をより小さな、責務の明確なコンポーネントや関数（`loader`, `action`）に分割するリファクタリングが積極的に行われています。これは Fat Component を避け、関心の分離 (SoC) を高める明確な傾向を示しています。
    -   Presentational Component と Container Component の分離も、この回避策の一環です。
-   **コンポーネント間通信の最小化戦略（props drilling 回避・context利用など）：**
    -   Propsによるデータ伝達が基本です。
    -   React Router の機能（`useLoaderData`, `useParams`, `Outlet` context）が、親子間や兄弟ルート間のデータ共有・状態伝達に活用されており、過度な props drilling を避けるのに役立っています。
    -   `useFetcher` は、子コンポーネントから親ルートの `action` をトリガーし、UIを更新するための手段として利用され、コンポーネント間の疎結合な通信を実現しています。
    -   広範囲な状態共有のための React Context の積極的な利用は現時点では確認されていませんが、テーマや認証情報など、真にグローバルな状態に対しては将来的に採用される可能性があります。
-   **UI以外のロジック抽象の傾向（例：service layer, adapter pattern）：**
    -   `app/data.ts` がデータ永続化層（Service Layer や Repository Pattern の一部）を抽象化しています。現在はモックデータ (`fakeContacts`) ですが、実際のAPI通信ロジックに置き換える際のアダプターとしての役割も担うことができます。
    -   React Router の `loader` と `action` は、アプリケーションのユースケースやコマンドを処理するサービスレイヤに近い役割を果たしています。

## 注意点と補足

-   **React公式やReact Router公式の標準との違いがある場合は、あえてそうしている意図や利点を考察してください。**
    -   全体として、React Router の推奨するパターン（`loader`, `action` によるデータフロー、ルートベースのコード分割）に忠実に従っているように見えます。
    -   状態管理に外部ライブラリを導入せず、React Router と React の標準機能で構築しようとする姿勢は、依存関係を最小限に抑え、バンドルサイズを小さく保つ意図があるかもしれません。また、React Router のデータ管理能力を最大限に活用する設計と言えます。
-   **複数のスタイルが混在している場合はその旨を明記し、チームでの統一の必要性を記載してください。**
    -   現時点では、大きなスタイルの混在は見受けられません。ファイル構成や命名規則は一貫しているように見えます。
    -   テストコンポーネントのラップ方法として、初期には `MemoryRouter` が直接使われ、後に `createMemoryRouter` と `RouterProvider` を使用する形に移行した箇所がありました。後者のアプローチが React Router のより新しいテストパターンに整合するため、統一することが推奨されます。
-   **可能な限り **再現可能なパターン・明文化できる規約** として表現してください。**
    -   上記の各項目は、コードベースから観察されるパターンを基に、可能な限り再現可能な規約として記述するよう努めました。特にルーティング関連のファイル構成や `loader`/`action` の利用方法は、明確なパターンとして確立されています。

このドキュメントが、プロジェクトの理解と今後の開発の一助となれば幸いです。
