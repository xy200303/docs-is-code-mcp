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
    "## 默认角色与风格",
    "",
    "- 以 Senior UI/UX Designer 的标准工作，参考 Linear / Vercel 的克制、精确、工程化审美。",
    "- 默认使用 8pt grid、Inter 字体和 Dark Mode 基底 `#0B0E14`。",
    "- 品牌气质采用 “Aether Vector”：minimal、precise、vector-inspired，少装饰，重结构、线条、对齐和清晰状态。",
    "",
    "## 视觉系统",
    "",
    "- 色彩比例遵循 60/30/10：约 60% 深色背景、30% 灰色 surfaces、10% 蓝色 accent。",
    "- CTA 必须高对比，主操作清晰可见；次要操作降低视觉重量但保持可发现。",
    "- 使用 CRAP 原则：Contrast、Repetition、Alignment、Proximity；间距、半径、边框、阴影和字体层级要一致。",
    "- 使用 Gestalt 原则组织界面：相关项目视觉上成组，跨组内容用背景、边界、留白或层级清楚分离。",
    "- 组件应贴合 dark surface：避免脏灰、低对比文字和无意义渐变；用边框、微妙背景差和蓝色 accent 建立层级。",
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
    "- 交互控件要符合直觉：图标按钮、开关、分段控件、菜单、标签页和输入组件各司其职。",
    "- 避免文字重叠、按钮挤压、卡片套卡片和只靠单一色相堆叠层次。",
    "- 固定格式元素要有稳定尺寸和响应式约束，避免 hover、加载和动态文本造成布局跳动。",
    "- 移动端和桌面都要检查信息层级、触控目标、可读性和空/加载/错误状态。",
    "- 优先使用已有设计系统和图标库；新增视觉风格要服务用户任务，不做无意义装饰。",
    "- 完成后用截图或实际运行检查关键视口，确认没有遮挡、空白、错位和不可读文本。"
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
    "- 记录触发入口：用户、接口、命令、事件、定时任务或内部调用从哪里进入。",
    "- 记录输入与前置状态：请求参数、配置、已有数据、权限、状态和环境条件。",
    "- 记录执行步骤：按真实代码路径写出关键判断、调用、读写和返回过程。",
    "- 记录输出结果：响应、页面状态、文件、日志、事件或可观察行为。",
    "- 记录副作用：数据库、文件、网络请求、缓存、队列、外部服务或无副作用。",
    "- 记录分支条件：正常、失败、边界、权限、状态、异常和空值分支。",
    "- 记录默认行为：默认参数、配置来源、覆盖规则以及未传参数时的完整流程。",
    "- 记录验证结果：命令、覆盖的流程分支、关联文件和已知风险。",
    "- 禁止把猜测、常识或静态线索写成实际行为；只能记录已读代码、已跑测试或用户确认的事实。"
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
  }
];

export function guidanceTemplateByName(name: string): GuidanceTemplate | undefined {
  return guidanceTemplates.find((item) => item.name === name);
}
