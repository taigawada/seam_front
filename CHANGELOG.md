eils_front の package.json からの変更点

vue-cli から vite に変更に伴い、下記を変更

```
/devDependencies
- "@vue/cli-plugin-babel": "~4.5.0",
- "@vue/cli-plugin-eslint": "~4.5.0",
- "@vue/cli-plugin-typescript": "^4.5.13",
- "@vue/cli-service": "~4.5.0",
+ "vite": "^3.0.9",
+ "vite-plugin-vue2": "^2.0.2",
+ "eslint-config-prettier": "^6.15.0",
+ "prettier": "^2.7.1",
```
