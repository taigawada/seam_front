eils_front の package.json からの変更点

vue-cli から vite に変更に伴い、下記を変更

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
```

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
```

/ ts-config.json
// 追加
"resolveJsonModule": true,
