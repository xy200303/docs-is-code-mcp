---
layout: home
---

<main class="home-shell">
<section class="home-hero" aria-labelledby="hero-title">
<div class="hero-main">
<p class="eyebrow">Local MCP workflow for spec coding</p>
<h1 id="hero-title">Spec Coding MCP</h1>
<p class="hero-lede">给 Codex、Claude Code、OpenCode、Cursor、Continue 和 Windsurf 使用的本地 MCP 服务：先读取项目 spec，再按执行清单改代码，最后把验证结果和实际行为写回项目。</p>
<div class="hero-actions" aria-label="主要入口">
<a class="action action-primary" href="/guide/getting-started">开始接入</a>
<a class="action action-secondary" href="/guide/mcp-tools">MCP 工具</a>
<a class="action action-secondary" href="https://github.com/xy200303/spec-coding-mcp">GitHub</a>
</div>
</div>
<div class="command-panel" aria-label="安装命令">
<div class="command-title">
<span>install</span>
<a href="https://www.npmjs.com/package/@dev_xiaoyun/spec-coding-mcp">npm package</a>
</div>
<div class="command-line"><span>npm</span><span>install</span><span>-g</span><span>@dev_xiaoyun/spec-coding-mcp</span></div>
<div class="command-line"><span>specc</span><span>init</span></div>
</div>
</section>

<section class="flow-strip" aria-label="Spec Coding MCP 工作流">
<article><span>01</span><strong>bootstrap</strong><p>生成 AGENTS、CLAUDE 和 specs/。</p></article>
<article><span>02</span><strong>spec_context</strong><p>读取当前 spec、TODO、guidance 和源码线索。</p></article>
<article><span>03</span><strong>checkpoint</strong><p>写回完成项、验证命令、风险和行为记录。</p></article>
<article><span>04</span><strong>done</strong><p>归档最终行为契约，下一轮继续接上。</p></article>
</section>

<section class="home-section two-column" aria-labelledby="structure-title">
<div>
<p class="eyebrow">项目文件</p>
<h2 id="structure-title">把需求、进度和验证结果留在项目里。</h2>
<p>Spec Coding MCP 围绕 `specs/` 工作：从 review 线索开始，进入 active 或 todo 执行，完成后归档到 done，并让 guidance 跟随项目一起保存。</p>
</div>
<div class="file-list" aria-label="specs directory">
<span>specs/</span>
<span>review/source-inventory.md</span>
<span>active/*.md</span>
<span>todo/*.md</span>
<span>done/*.md</span>
<span>guidance/ui-ux.md</span>
</div>
</section>

<section class="tool-links" aria-label="常用入口">
<a href="/guide/workflow"><span>Workflow</span><strong>从旧项目审查到 done 归档</strong></a>
<a href="/reference/spec-structure"><span>Spec structure</span><strong>review、active、todo、done 的目录边界</strong></a>
<a href="/guide/mcp-tools"><span>MCP tools</span><strong>spec_context、checkpoint、skills、done</strong></a>
</section>

<section class="home-section two-column" aria-labelledby="guidance-title">
<div>
<p class="eyebrow">Guidance and skills</p>
<h2 id="guidance-title">原则是项目文件，UI/UX 判断交给指定 skill。</h2>
</div>
<p>默认 guidance 存在 `specs/guidance/*.md`，顶部带 YAML 元信息，方便工具和模型检索。UI/UX 工作读取 `ui-ux` guidance，并路由到 `ui-ux-pro-max` skill。</p>
</section>
</main>
