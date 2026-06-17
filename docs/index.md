---
layout: home

hero:
  name: Spec Coding MCP
  text: 让 AI 先读 spec，再改代码
  tagline: 一个轻量的本地 MCP 服务：从源码反推规格，给用户审查和修改，再把最新 spec 交给 Codex、Claude Code、OpenCode 等 AI 编程工具实现代码和测试。
  actions:
    - theme: brand
      text: 快速开始
      link: /guide/getting-started
    - theme: alt
      text: 查看 MCP 工具
      link: /guide/mcp-tools

features:
  - title: 从旧项目反推 spec
    details: 扫描现有源码，生成 review specs，让用户先看懂系统事实，再决定下一步需求。
  - title: 每次开发都有 active spec
    details: 新功能、修复、删除都先进入 specs/active，AI 按最新规格改代码。
  - title: 完成后归档
    details: 验证通过后把 spec 移到 done，保留清楚的需求和实现记录。
---

<section class="home-section">
  <h2>面向 AI 编程的最小规格系统</h2>
  <p>
    Spec Coding MCP 不追求把整个系统永久文档化，也不维护复杂的功能点状态图。
    它把每次开发收敛成一份可审查、可实现、可归档的 spec，让用户的自然语言修改真正成为代码修改的入口。
  </p>

  <div class="workflow-grid">
    <div class="workflow-step">
      <strong>1. 反推</strong>
      <span>从源码生成 review specs，帮助用户审查已有系统。</span>
    </div>
    <div class="workflow-step">
      <strong>2. 修改</strong>
      <span>用户直接编辑 spec，明确新增、变更或删除的业务行为。</span>
    </div>
    <div class="workflow-step">
      <strong>3. 实现</strong>
      <span>AI 调用 spec_context，按最新 spec 修改代码和测试。</span>
    </div>
    <div class="workflow-step">
      <strong>4. 归档</strong>
      <span>验证通过后调用 spec_done，把规格移入 done。</span>
    </div>
  </div>

  <div class="install-panel">
    <code>npm install -g @dev_xiaoyun/spec-coding-mcp</code><br />
    <code>specc init</code>
  </div>
</section>
