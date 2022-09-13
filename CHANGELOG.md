eils_front の package.json からの変更点
vue-cli から vite 変更に伴い、下記を変更

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
// 追加
"@vue/composition-api": "^1.7.0",
"@tiptap/extension-color": "^2.0.0-beta.12",
"@tiptap/extension-link": "^2.0.0-beta.43",
"@tiptap/extension-placeholder": "^2.0.0-beta.53",
"@tiptap/extension-text-style": "^2.0.0-beta.26",
"@tiptap/starter-kit": "^2.0.0-beta.191",
"@tiptap/vue-2": "^2.0.0-beta.84",
"vue-i18n": "^8.27.2",
"vue-i18n-bridge": "^9.2.2",
"csv": "^6.2.0",
```

JSON を import するため、以下を変更

```
/ tsconfig.json
// 追加
"resolveJsonModule": true,
```

メモ  
祝日を取得した csv を 15 日おきくらいで更新してサーバー側に置きたい

#### 要件

- SHIFT_JIS でエンコードされているので、UTF-8 に再フォーマットする
- ヘッダーなし、データ型は[文字列<日付型>, 文字列<祝日名称>][]。
- 1955 年からのデータが入っているので、前後 1 年分にする

ページ遷移前に警告するモーダルを開くために、CBT 側で提出物管理から移動するとき、以下の関数を噛ませてほしい

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
