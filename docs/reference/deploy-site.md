# 部署官网

官网使用 VitePress 构建，目标域名是：

```text
https://spec.xyun.dev
```

## 本地开发

```bash
npm run docs:dev
```

## 构建

```bash
npm run docs:build
```

构建产物在：

```text
docs/.vitepress/dist
```

## GitHub Pages

仓库包含 GitHub Pages workflow。推送到 `main` 后会自动构建并部署官网。

自定义域名由这个文件声明：

```text
docs/public/CNAME
```

文件内容是：

```text
spec.xyun.dev
```

DNS 侧需要把 `spec.xyun.dev` 指向 GitHub Pages。常见做法是配置 CNAME 到：

```text
xy200303.github.io
```
