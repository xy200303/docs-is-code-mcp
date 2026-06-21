/* Built-in editable guidance prompt templates for on-demand model reminders. */
import { businessConfirmationBullets, currentTaskInstructionBullets, engineeringRuleSections } from "./markdown.js";

export interface GuidanceTemplate {
  name: string;
  title: string;
  purpose: string;
  fileName: string;
  content: string;
}

function guidanceDocument(title: string, purpose: string, bodyLines: string[]): string {
  return [
    `# ${title}`,
    "",
    "## 用途",
    "",
    purpose,
    "",
    "## 使用方式",
    "",
    "- 当模型不确定相关原则、开始偏离约束或需要校准输出质量时，读取本文件。",
    "- 本文件是指导性提示词，不替代当前 spec、TODO、用户要求或代码事实。",
    "- 用户可以直接编辑本文件；工具会读取项目里的当前内容。",
    "",
    ...bodyLines
  ].join("\n");
}

function engineeringGuidance(): string {
  return guidanceDocument("工程与代码风格原则", "用于提醒模型保持简单、可维护、可测试、边界清晰的工程实现。", [
    "## 工程原则",
    "",
    "这些规则是强制约束，不是建议。",
    "",
    ...engineeringRuleSections(),
    "",
    "## 业务确认规则",
    "",
    "这些规则是硬性约束，不是建议。",
    "",
    ...businessConfirmationBullets()
  ]);
}

function uiUxGuidance(): string {
  return guidanceDocument("UI/UX 设计美学原则", "用于提醒模型在前端、页面、组件和交互任务中保持清晰、克制、可用的体验质量。", [
    "## 默认角色与方法",
    "",
    "- 以 Senior UI/UX Designer 的标准工作：先确认真实产品语境、真实用户、真实内容和真实下一步，再选择视觉风格。",
    "- Linear / Vercel、暗色、蓝色 accent、8pt grid、Inter 字体和 Aether Vector 气质只能作为可选参考，不是所有项目的默认外观。",
    "- 视觉方向必须服务项目身份：企业官网、产品官网、个人作品集、开源组织和工具文档应使用不同信息架构；工具型产品优先效率和状态；展示型页面才使用更强叙事。",
    "",
    "## 事实优先",
    "",
    "- 不要编造指标、客户、性能数据、融资、商业定位、邮箱、路线图承诺或社区规模。",
    "- 文案、CTA 和信息结构必须来自用户输入、仓库内容、项目文档、可验证源码或明确搜索结果；来源不明时先确认或标记待确认。",
    "- 品牌/组织/产品含义不明确时，先向用户确认或搜索验证，再写首屏文案、导航结构和视觉隐喻。",
    "- 高级感不能替代真实性；页面可以精致，但必须先做对。",
    "",
    "## 视觉系统",
    "",
    "- 先沿用项目现有设计系统、品牌色、字体、组件库和图标库；没有现成系统时再建立轻量规则。",
    "- 色彩、圆角、网格、字体和动效应由项目类型决定，不要把所有页面推成同一种 dark SaaS 风格。",
    "- CTA 必须高对比，主操作清晰可见；次要操作降低视觉重量但保持可发现。",
    "- 使用 CRAP 原则：Contrast、Repetition、Alignment、Proximity；间距、半径、边框、阴影和字体层级要一致。",
    "- 使用 Gestalt 原则组织界面：相关项目视觉上成组，跨组内容用背景、边界、留白或层级清楚分离。",
    "- 避免脏灰、低对比文字、无意义渐变和单一色相堆叠；用对比、层级、留白和真实内容建立秩序。",
    "",
    "## 交互与状态",
    "",
    "- 所有异步操作要有 loading / pending 状态，避免用户误以为无响应。",
    "- 允许 undo 或可恢复路径；危险操作需要预防误触、确认或清晰后悔药。",
    "- 优先预防错误：禁用无效提交、即时校验输入、明确错误文案和恢复动作。",
    "- 交互反馈要及时但克制：hover、focus、active、disabled、empty、error、success 状态都要完整。",
    "",
    "## 原则",
    "",
    "- 先判断产品语境：工具型界面应信息密度高、导航清晰、视觉克制；展示型页面才需要更强叙事。",
    "- 首屏应直接承载真实体验或核心对象，不用空泛营销和装饰性布局替代功能。",
    "- 首屏检查：这个项目真实是什么；首屏是否出现 repo、产品截图、项目矩阵、demo、核心交互或真实对象；是否只是抽象视觉和营销文案；CTA 是否对应真实下一步。",
    "- 只有明确是 OSS 或开源组织官网时，才默认优先 GitHub 入口、featured repos、research tracks、contribution guide、docs/roadmap、license/community links 和项目状态；避免把普通企业官网误套开源结构。",
    "- 交互控件要符合直觉：图标按钮、开关、分段控件、菜单、标签页和输入组件各司其职。",
    "- 避免文字重叠、按钮挤压、卡片套卡片和只靠单一色相堆叠层次。",
    "- 固定格式元素要有稳定尺寸和响应式约束，避免 hover、加载和动态文本造成布局跳动。",
    "- 移动端和桌面都要检查信息层级、触控目标、可读性和空/加载/错误状态。",
    "- 优先使用已有设计系统和图标库；新增视觉风格要服务用户任务，不做无意义装饰。",
    "- 完成后用截图或实际运行检查关键视口，确认没有遮挡、空白、错位和不可读文本。",
    "- 官网/应用验收必须确认当前端口服务的是当前项目，检查页面 title/app root 内容，桌面和移动端截图，并确认首屏没有错位、遮挡、空白或串项目。"
  ]);
}

function specWritingGuidance(): string {
  return guidanceDocument("Spec 与行为记录原则", "用于提醒模型写清楚 spec、TODO、checkpoint 和最终行为契约。", [
    "## 当前任务协议",
    "",
    ...currentTaskInstructionBullets(),
    "",
    "## 行为记录要求",
    "",
    "- 行为记录必须描述功能全过程，不只写一句结果。",
    "- `spec_done` 的 `## 最终行为契约` 是给用户审查的完整功能全景，不是模型内部摘要。",
    "- 最终行为契约必须覆盖所有已知情况：正常、失败、边界、权限、状态、异常、空值、默认参数和配置回退。",
    "- 模型自己采用的默认行为也必须写清楚，例如未传参数时怎么处理、缺字段时怎么回退、未覆盖配置时使用什么默认值、未改变的旧行为是什么。",
    "- 记录触发入口：用户、接口、命令、事件、定时任务或内部调用从哪里进入。",
    "- 记录输入与前置状态：请求参数、配置、已有数据、权限、状态和环境条件。",
    "- 记录执行步骤：按真实代码路径写出关键判断、调用、读写和返回过程。",
    "- 记录输出结果：响应、页面状态、文件、日志、事件或可观察行为。",
    "- 记录副作用：数据库、文件、网络请求、缓存、队列、外部服务或无副作用。",
    "- 记录分支条件：正常、失败、边界、权限、状态、异常和空值分支。",
    "- 记录默认行为：默认参数、配置来源、覆盖规则、模型选择的默认策略以及未传参数时的完整流程。",
    "- 记录验证结果：命令、覆盖的流程分支、关联文件和已知风险。",
    "- 禁止把猜测、常识或静态线索写成实际行为；只能记录已读代码、已跑测试或用户确认的事实。"
  ]);
}

function gitCommitGuidance(): string {
  return guidanceDocument("Git 提交工作流原则", "用于提醒模型在用户要求提交代码时安全地验证、暂存、提交并汇报结果。", [
    "## 触发条件",
    "",
    "- 只有用户明确要求提交、帮我提交、commit、自动提交或等价表达时才使用本指导。",
    "- 不要因为完成了代码修改就自行提交；提交必须是用户意图或当前任务明确要求。",
    "- 提交前先完成用户要求的代码或文档工作，并确认没有未处理的阻塞。",
    "",
    "## 工作流",
    "",
    "1. 运行与本次变更风险匹配的验证；优先跑触达区域的测试，实际可行时同时跑 `git diff --check`。",
    "2. 查看 `git status --short` 和 `git diff --name-status`，确认工作区里哪些文件属于本次任务。",
    "3. 只暂存本次任务相关文件；无关脏文件保持未暂存，并在最终报告里说明。",
    "4. 如果用户要求继续提交剩余工作，可以提交所有确认属于当前任务的剩余变更，但跳过没有真实内容差异的文件。",
    "5. 提交信息语言遵循用户最新明确要求；没有指定时默认中文。用户给了精确提交信息时原样使用。",
    "6. 使用简洁、动作导向、具体的提交信息，避免 `更新代码` 这类空泛描述。",
    "7. 提交后报告短 hash、提交信息、验证命令与结果，以及工作区是否干净。",
    "",
    "## 安全规则",
    "",
    "- 禁止使用 `git reset --hard`、`git checkout --` 等破坏性命令准备提交，除非用户明确要求。",
    "- 不要把无关用户改动混进提交；如果相关性不清楚，先问一个简短问题。",
    "- 暂存未跟踪文件前必须看文件名和用途，跳过缓存、密钥、日志、构建产物和临时文件。",
    "- 如果文件里疑似包含 secret，不要在回复中引用；提交风险不清楚时先停止并询问。",
    "- 优先使用非交互式 git 命令，避免进入交互控制台。",
    "- 重要命令输出要在最终回复中总结，因为用户不一定能看到工具输出。",
    "",
    "## 暂存模式",
    "",
    "```powershell",
    "git add -- \"path/to/file\" \"path/to/other-file\"",
    "```",
    "",
    "删除已跟踪文件且属于本次任务时：",
    "",
    "```powershell",
    "git add -- \"path/to/deleted-file\"",
    "```",
    "",
    "提交前检查暂存快照：",
    "",
    "```powershell",
    "git diff --cached --name-status",
    "git diff --cached --check",
    "```",
    "",
    "## 提交信息",
    "",
    "- 默认中文提交信息使用“动作 + 主要对象”的短句，例如 `完善 guidance 提交工作流`。",
    "- 英文提交信息也保持短、具体、动作导向，例如 `Add guidance commit workflow`。",
    "- 不要把多个不相关主题塞进同一个提交信息。",
    "",
    "## 最终报告",
    "",
    "- 说明提交已完成。",
    "- 给出短 hash 和提交信息。",
    "- 列出实际通过的验证。",
    "- 只有存在剩余未暂存变更时才说明。"
  ]);
}

function prSubmitGuidance(): string {
  return guidanceDocument("PR 提交工作流原则", "用于提醒模型在用户要求准备、创建或提交 PR 时安全地发现模板、提交变更、推送分支并生成 PR 内容。", [
    "## 触发条件",
    "",
    "- 只有用户明确要求准备 PR、生成 PR、创建 Pull Request、提交 PR 或等价表达时才使用本指导。",
    "- 不要在没有用户授权时提交、amend、reset、rebase、force-push 或创建 PR。",
    "",
    "## 工作流",
    "",
    "1. 检查仓库状态：运行 `git status --short --branch`，识别当前分支、上游、remote URL 和可能的 base branch。",
    "2. 写 PR 正文或补交 commit 前，先查找项目 PR 模板。",
    "3. 同步决定 PR 语言和 commit 语言：用户指定优先；模板语言明显时跟随模板；否则默认英文。",
    "4. 如果当前 PR 工作还没提交，先按 Git 提交工作流安全提交；只提交属于该 PR 的变更。",
    "5. 检查分支是否已推送：没有 upstream 时用 `git push -u origin <branch>`；已有 upstream 且本地 ahead 时用 `git push`。",
    "6. 按发现的模板生成 PR 标题和正文；没有模板时使用默认英文格式。",
    "7. 工具可用时优先用 `gh pr create --title ... --body-file ...` 创建 PR，避免 shell 引号问题。",
    "8. 如果 `gh` 缺失或未认证，推送分支后提供 GitHub compare URL、标题和正文，供用户手动创建。",
    "",
    "## PR 模板发现顺序",
    "",
    "1. `.github/pull_request_template.md`",
    "2. `.github/PULL_REQUEST_TEMPLATE.md`",
    "3. `.github/PULL_REQUEST_TEMPLATE/*.md`",
    "4. `PULL_REQUEST_TEMPLATE.md`",
    "5. `pull_request_template.md`",
    "6. `docs/pull_request_template.md`",
    "7. `docs/PULL_REQUEST_TEMPLATE.md`",
    "",
    "可用搜索命令：",
    "",
    "```powershell",
    "rg --files | rg -i '(^|[\\\\/])(\\.github[\\\\/])?(pull_request_template|PULL_REQUEST_TEMPLATE)([\\\\/].*\\.md|\\.md)$'",
    "```",
    "",
    "- 如果找到多个模板，选与任务或分支最匹配的；没有明确选择时按上面的顺序取第一个确定路径并说明。",
    "- 保留模板标题、必需 checkbox 和必需措辞；占位符要替换成具体内容。",
    "",
    "## 默认 PR 格式",
    "",
    "没有项目模板时使用：",
    "",
    "```md",
    "## Summary",
    "-",
    "",
    "## Verification",
    "-",
    "",
    "## Notes",
    "-",
    "```",
    "",
    "- 默认英文，除非用户明确要求其他语言。",
    "- 标题要简洁、动作导向。",
    "- 只写实际运行过的验证；不要编造测试结果。",
    "- 没有 caveat、后续事项或手动步骤时省略 `Notes`。",
    "",
    "## Base Branch 与 Compare URL",
    "",
    "- base branch 推断顺序：用户指定、remote 默认分支、`main`、`master`。",
    "- GitHub remote 且不能创建 PR 时，提供 `https://github.com/<owner>/<repo>/compare/<base>...<branch>?expand=1`。",
    "- 非 GitHub remote 时，提供已推送分支、base branch、标题、正文，并说明需要在对应代码托管平台创建。",
    "",
    "## 安全规则",
    "",
    "- 不要在 PR 正文中包含 `.env`、日志、配置或命令输出里的 secret。",
    "- 工作区脏时，只提交属于当前 PR 的改动；无关文件保持未暂存并说明。",
    "- commit message 语言和 PR 语言保持一致。",
    "- 如果当前分支已有 open PR，能检测到时更新或报告已有 PR，不创建重复 PR。",
    "- 不要使用 `--force` 或 `--force-with-lease`，除非用户明确要求。",
    "- base branch 或 remote 无法安全推断时，先问一个简短问题。",
    "",
    "## 最终报告",
    "",
    "- 说明 PR 已创建还是仅准备好。",
    "- 给出 PR URL 或 compare URL。",
    "- 给出 PR 标题。",
    "- 如果本流程创建了 commit，给出 commit hash。",
    "- 说明使用的模板来源，或说明使用默认英文格式。",
    "- 列出实际运行的验证和剩余阻塞。"
  ]);
}

function qualityReviewGuidance(): string {
  return guidanceDocument("质量审查原则", "用于提醒模型在实现后自查代码质量、测试覆盖、架构边界、UI/交互状态和交付风险。", [
    "## 使用时机",
    "",
    "- 完成一段实现、准备 checkpoint、准备 done、提交前或 PR 前读取本文件。",
    "- 复杂项目、跨模块改动、UI/交互改动、状态/权限/数据流变更必须做质量审查。",
    "- 小改动也应快速扫一遍相关项，避免把低质量实现归档或提交。",
    "",
    "## 代码质量自查",
    "",
    "- 代码是否符合现有项目结构和命名风格，是否避免无意义抽象和过度设计。",
    "- 模块边界是否清楚，UI、业务、数据访问和基础设施逻辑是否分离。",
    "- 错误、空值、异常、权限、状态和依赖失败是否 fail fast 且可理解。",
    "- 是否保持向后兼容，没有破坏已有 API、数据结构、行为契约或用户流程。",
    "- 是否存在重复逻辑、隐藏副作用、资源泄漏、阻塞主线程或不必要复杂度。",
    "",
    "## 测试与验证",
    "",
    "- 是否运行了与改动风险匹配的 build、unit、smoke、lint 或手工验证。",
    "- 正常、失败、边界、权限、状态、默认行为和回归风险是否至少有一种验证证据。",
    "- 未运行的验证必须说明原因；禁止编造测试结果。",
    "",
    "## UI 与交互质量",
    "",
    "- 设计前是否确认真实项目定位、用户、核心对象、事实来源和 CTA；不明确时是否先确认或搜索。",
    "- 是否避免编造指标、客户、性能数据、邮箱、商业定位、社区规模和路线图承诺。",
    "- 首屏是否呈现真实对象或核心体验，而不是只呈现抽象视觉和营销文案。",
    "- 若明确是 OSS 或开源组织官网，是否优先 GitHub、featured repos、research tracks、贡献路径、docs/roadmap、license/community 和项目状态；否则是否使用匹配企业/产品/作品集/文档站的结构。",
    "- loading、empty、error、success、disabled、hover、focus、active 等状态是否完整。",
    "- 表单校验、危险操作、防误触、undo/recovery 和错误恢复是否清楚。",
    "- 移动端和桌面是否检查布局、可读性、触控目标、遮挡、溢出和文本换行。",
    "- Web 页面是否确认当前端口服务的是当前项目、页面 title/app root 正确、桌面和移动端截图无串项目、空白、遮挡或错位。",
    "- 视觉层级、间距、对齐、对比度、组件选择和交互反馈是否符合 ui-ux guidance。",
    "",
    "## 交付前审查",
    "",
    "- checkpoint/done 是否记录真实行为、默认行为、边界处理和验证结果。",
    "- 是否还有未确认业务规则、残留 TODO、风险、阻塞或需要用户审查的问题。",
    "- 提交或 PR 前是否只包含相关改动，并且最终报告能让用户快速理解结果。"
  ]);
}

export const guidanceTemplates: GuidanceTemplate[] = [
  {
    name: "engineering",
    title: "工程与代码风格原则",
    purpose: "用于提醒模型保持简单、可维护、可测试、边界清晰的工程实现。",
    fileName: "engineering.md",
    content: engineeringGuidance()
  },
  {
    name: "ui-ux",
    title: "UI/UX 设计美学原则",
    purpose: "用于提醒模型在前端、页面、组件和交互任务中保持清晰、克制、可用的体验质量。",
    fileName: "ui-ux.md",
    content: uiUxGuidance()
  },
  {
    name: "spec-writing",
    title: "Spec 与行为记录原则",
    purpose: "用于提醒模型写清楚 spec、TODO、checkpoint 和最终行为契约。",
    fileName: "spec-writing.md",
    content: specWritingGuidance()
  },
  {
    name: "git-commit",
    title: "Git 提交工作流原则",
    purpose: "用于提醒模型在用户要求提交代码时安全地验证、暂存、提交并汇报结果。",
    fileName: "git-commit.md",
    content: gitCommitGuidance()
  },
  {
    name: "pr-submit",
    title: "PR 提交工作流原则",
    purpose: "用于提醒模型在用户要求准备、创建或提交 PR 时安全地发现模板、提交变更、推送分支并生成 PR 内容。",
    fileName: "pr-submit.md",
    content: prSubmitGuidance()
  },
  {
    name: "quality-review",
    title: "质量审查原则",
    purpose: "用于提醒模型在实现后自查代码质量、测试覆盖、架构边界、UI/交互状态和交付风险。",
    fileName: "quality-review.md",
    content: qualityReviewGuidance()
  }
];

export function guidanceTemplateByName(name: string): GuidanceTemplate | undefined {
  return guidanceTemplates.find((item) => item.name === name);
}
