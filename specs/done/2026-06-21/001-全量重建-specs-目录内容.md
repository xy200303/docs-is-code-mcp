# 全量重建 specs 目录内容

## Meta

- status: done
- source: user-prompt

## 用户原始描述

- [x] 备份当前 specs 目录，确认可回滚
- [x] 清空旧 specs 内容并重新生成完整 specs 目录
- [x] 验证重建后的工作流状态、文件范围和生成结果
- [x] 记录 checkpoint 并归档本次重建任务

## TODO

- [x] 备份当前 specs 目录，确认可回滚
- [x] 清空旧 specs 内容并重新生成完整 specs 目录
- [x] 验证重建后的工作流状态、文件范围和生成结果
- [x] 记录 checkpoint 并归档本次重建任务

## 实际行为记录

- 记录来源：只能记录已阅读代码、已修改代码、测试结果或用户确认的事实。
- 分支条件：完成后补充实际存在的正常、失败、边界、权限和状态分支。
- 默认参数行为：完成后补充源码里的默认值、配置来源和覆盖规则。
- 边界处理结果：完成后补充异常、空值、权限、状态等处理结果。
- 验证结果：完成后记录验证命令、结果和关联文件。
- 禁止事项：不要把猜测、常识或“看起来合理”的行为写成事实。

## Done

- doneAt: 2026-06-21T08:54:46.271Z
- note: 按用户要求全量重建 specs 目录内容：旧 specs 已备份到 .tmp/specs-backup-20260621-165203，旧 done 历史已从 specs/ 移除，重新生成 README、templates 和 review 源码审查任务。

## 最终行为契约

1. 全量重建完成归档
  - 条件：当前 TODO 全部完成且验证通过
  - 结果：将本次全量重建任务归档到 done；重建后的 specs 目录包含 README、templates、review 和本次 done 记录。
  - 默认行为：spec_done 将完成的 todo spec 移入 specs/done/YYYY-MM-DD/。
  - 边界处理：旧 done 历史不在新 specs/done 中，仅保存在 .tmp/specs-backup-20260621-165203。
  - 验证：归档前 spec_context 显示 open TODOs: 0。
  - 关联文件：
    - `specs/todo/2026-06-21/001-全量重建-specs-目录内容.md`
    - `specs/review/index.md`
    - `specs/review/source-inventory.md`
    - `specs/review/mcp-data.md`
