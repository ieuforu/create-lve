# Vue 模板 TODO

维护备忘，不进 npm 包，也不会复制到生成的项目。

## 切到 TypeScript 7

现状：继续用 TS ~6.0 + vue-tsc 3.x。2026-11-04 用 TS 7.1.0-beta + `@vue/content-mapper` 4.0.0-alpha.3 实测过：类型检查能用，`vite build` 失败。

三个条件都满足后再切：

- [ ] TS 7.1 正式发布（npm `latest` 指向 7.1）
- [ ] `@vue/compiler-sfc` 支持 TS 7（当前阻碍）
- [ ] Vue (Official) 编辑器扩展支持 Language Tools v4

阻碍原因：compiler-sfc（3.5.44、3.6.0-rc.14）靠 `ts.sys` 和 `ts.resolveModuleName` 解析 `extends PrimitiveProps` 这类导入类型，而 TS 7 的 `typescript` 包没有这两个 API。不要用 `/* @vue-ignore */` 绕过，`as`、`asChild` 在运行时会变成普通透传属性。

迁移要改的：

- 删 `vue-tsc`，加 `@vue/content-mapper`，`typescript` 写精确版本（`~7.1.0-beta` 这种范围会装上 nightly）
- `type-check` 改成 `tsc --build --runExternalCode`
- `tsconfig.app.json` 加：

  ```jsonc
  "contentMappers": [
    {
      "package": "@vue/content-mapper",
      "extensions": [".vue"],
      "options": { "dataAttributes": ["data-*"], "fallthroughAttributes": true }
    }
  ]
  ```

- 原 `vueCompilerOptions` 的内容挪到 `options`
- 首页的 `<Button as="a" href>` 改成 `as-child` 写法
- v4 会检查组件上未声明的属性，`<Button type="submit">` 也会报错，到时再确认这条是否仍然存在
- 更新 `AGENTS.md`、`README.md` 里的 vue-tsc 说明

## 小问题，碰到再改

- [ ] `e2e/tsconfig.json` 没被根 `tsconfig.json` 引用，e2e 没做类型检查
- [ ] `tsconfig.node.json` 里残留 `cypress.config.*`、`eslint.config.*`
