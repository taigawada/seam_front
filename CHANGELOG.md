eils_front の package.json からの変更点
開発環境の変更に伴う変更

```
/devDependencies
// 削除
"@vue/cli-plugin-babel": "~4.5.0",
"@vue/cli-plugin-eslint": "~4.5.0",
"@vue/cli-plugin-typescript": "^4.5.13",
"@vue/cli-service": "~4.5.0",

// 追加
"vite": "^3.0.9",
"vite-plugin-vue2": "^2.0.2",
"eslint-config-prettier": "^6.15.0",
"prettier": "^2.7.1",
"@types/node": "^18.7.16",
```

依存モジュールの追加

```
/dependencies
"@vue/composition-api": "^1.7.0",
"@tiptap/extension-color": "^2.0.0-beta.12",
"@tiptap/extension-link": "^2.0.0-beta.43",
"@tiptap/extension-placeholder": "^2.0.0-beta.53",
"@tiptap/extension-text-style": "^2.0.0-beta.26",
"@tiptap/starter-kit": "^2.0.0-beta.191",
"@tiptap/vue-2": "^2.0.0-beta.84",
"vue-i18n": "^8.27.2",
"vue-i18n-bridge": "^9.2.2",
"vuex-persist": "^3.1.3"

// devDependencies
"msw": "^0.47.2",
```

アップデート

```
"typescript": "^4.8.3", // nodeJSのビルドインモジュールの型を正しく認識しなかったため
```

JSON を import するため、以下を変更

```
/ tsconfig.json
// 追加
"resolveJsonModule": true,
```

### バックエンドの方にお願いしたいこと

祝日の記載された CSV を更新する処理を実装してほしい。
URL: (https://www8.cao.go.jp/chosei/shukujitsu/syukujitsu.csv)

参考: https://www8.cao.go.jp/chosei/shukujitsu/gaiyou.html

毎年 2 月に更新されるようです。

### CBT フロントエンドの方にお願いしたいこと

祝日データを LocalStrage に保管していて、ログイン時に祝日データを更新する処理を実装してほしい

```
store.dispach('getHolidays')
```

ページ遷移の警告モーダルを開くために、CBT 側で提出物管理から移動するとき、以下の関数を噛ませてほしい

```
// before
const handleClick = () => {
  ページ移動
}
// after
import { useTransitionWarning } from '~/useTransitionWarning'

const handleClick = () => {
    useTransitionWarning(this.$store, () => {
        ページ移動
    })
}
```

(composition api での記述です。options api, vue-property-decorator だとどう書くかわかりませんでした。動くとは思います。)
