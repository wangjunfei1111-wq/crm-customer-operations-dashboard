const drawer = document.getElementById("detailDrawer");
const drawerBackdrop = document.getElementById("drawerBackdrop");
const toast = document.getElementById("toast");
const toastText = document.getElementById("toastText");
const focusTitle = document.getElementById("focusTitle");
const focusRule = document.getElementById("focusRule");
const focusList = document.getElementById("focusList");
const focusAllButton = document.getElementById("focusAllButton");
const taskBoard = document.querySelector(".task-board");
const taskTabs = document.getElementById("taskTabs");
const taskCardStrip = document.getElementById("taskCardStrip");
const drawerPrimaryAction = document.getElementById("drawerPrimaryAction");
let activeDrawerKey = "handoverToday";
let activeFocusKey = "handoverToday";
let activeTaskView = "today";
let activeTaskType = "handover";
let toastTimer;

const alertDetails = {
  handoverToday: {
    category: "客户管理预警",
    title: "当日必清交接",
    count: 6,
    countLabel: "今日待清",
    deadlineLabel: "最近截止",
    deadline: "今天 11:30",
    status: "当日必清",
    tone: "critical",
    criteria: "统计当日交接审批通过后，剩余交接天数为 0（已满 90 天交接周期）且尚未完成的交接任务。",
    display: "数值标红，并展示“当日必清”标签。",
    interaction: "进入客户交接系统待办页，自动筛选当前人员的今日待交接清单。",
    special: "无数据时显示 0；清单展示“暂无当日必清交接任务”。",
    source: "客户交接系统",
    actionLabel: "进入今日待交接清单",
    actionKind: "navigate",
    actionToast: "已带入“当前人员 + 今日必清”条件打开客户交接待办",
    emptyText: "暂无当日必清交接任务",
    itemAction: "去交接",
    items: [
      { title: "上海明锐科技", description: "原客户经理已离岗，待完成资料确认、关系转接和客户告知。", time: "剩余 48 分钟", tag: "当日必清", tagTone: "critical", fields: [["交接周期", "2026-06-25 至 09-23"], ["剩余天数", "0 天"], ["责任人", "王晨"]] },
      { title: "远景智造", description: "待确认历史商机、联系人关系及未结服务事项。", time: "今天 13:00", tag: "重点客户", fields: [["交接周期", "2026-06-25 至 09-23"], ["剩余天数", "0 天"], ["责任人", "王晨"]] },
      { title: "启明医药", description: "待完成客户资料交接和首次联系记录。", time: "今天 16:00", tag: "待处理", fields: [["交接周期", "2026-06-25 至 09-23"], ["剩余天数", "0 天"], ["责任人", "王晨"]] }
    ]
  },
  handoverOvertime: {
    category: "客户管理预警",
    title: "超时自动交接",
    count: 3,
    countLabel: "超时任务",
    deadlineLabel: "最长超时",
    deadline: "18 天",
    status: "已超时",
    tone: "overdue",
    criteria: "交接审批通过后，交接时长超过 90 天仍未完成，并已触发超时规则的任务。",
    display: "数值深红，并展示“已超时”标签。",
    interaction: "弹出明细，展示客户名称、交接起止时间、超时天数及责任人，支持查看详情或驳回重提。",
    special: "超时任务永久保留，直至闭环，不自动清零。",
    source: "客户交接系统",
    actionLabel: "进入超时交接明细",
    actionKind: "navigate",
    actionToast: "正在打开超时自动交接明细",
    emptyText: "暂无超时自动交接任务",
    itemAction: "查看详情",
    secondaryItemAction: "驳回重提",
    items: [
      { title: "嘉辰物流", description: "交接周期已结束，客户关系确认仍未完成。", time: "超时 18 天", tag: "已超时", tagTone: "overdue", fields: [["交接起始", "2026-06-07"], ["超时天数", "18 天"], ["责任人", "王晨"]] },
      { title: "数联科技", description: "原负责人遗留商机尚未完成归属确认。", time: "超时 7 天", tag: "已超时", tagTone: "overdue", fields: [["交接起始", "2026-06-18"], ["超时天数", "7 天"], ["责任人", "王晨"]] },
      { title: "华信零售", description: "客户关键联系人信息尚未补齐。", time: "超时 3 天", tag: "已超时", tagTone: "overdue", fields: [["交接起始", "2026-06-22"], ["超时天数", "3 天"], ["责任人", "王晨"]] }
    ]
  },
  handoverLater: {
    category: "客户管理预警",
    title: "后续待交接",
    count: 8,
    countLabel: "正常待办",
    deadlineLabel: "最近到期",
    deadline: "明天",
    status: "正常待办",
    tone: "neutral",
    criteria: "交接审批通过后，剩余交接天数大于 0 且小于 90 天的正常待交接任务。",
    display: "数值按黑色常规样式展示。",
    interaction: "进入客户交接待办列表，并保留当前人员筛选条件。",
    special: "无数据时显示 0，并展示默认空状态。",
    source: "客户交接系统",
    actionLabel: "查看后续交接清单",
    actionKind: "navigate",
    actionToast: "正在打开后续待交接清单",
    emptyText: "暂无后续待交接任务",
    itemAction: "查看任务",
    items: [
      { title: "博源制造", description: "已进入交接周期，需提前核对联系人和未结服务事项。", time: "剩余 1 天", tag: "待安排", fields: [["交接起始", "2026-06-27"], ["剩余天数", "1 天"], ["责任人", "王晨"]] },
      { title: "海越食品", description: "待核对合同、历史沟通和服务记录。", time: "剩余 12 天", tag: "待准备", fields: [["交接起始", "2026-07-07"], ["剩余天数", "12 天"], ["责任人", "王晨"]] },
      { title: "星辰教育", description: "等待组织调整生效后继续交接。", time: "剩余 28 天", tag: "待交接", fields: [["交接起始", "2026-07-23"], ["剩余天数", "28 天"], ["责任人", "王晨"]] }
    ]
  },
  renewToday: {
    category: "客户管理预警",
    title: "当日必清待续签",
    count: 4,
    countLabel: "今日待续签",
    deadlineLabel: "合同到期日",
    deadline: "今天",
    status: "当日必清",
    tone: "critical",
    criteria: "统计合同到期日为今日且尚未完成续签的主合同；京麦合同、引凤、BBCC、加收类合同不计入。",
    display: "红色高亮，作为当日最高优先级任务。",
    interaction: "弹出到期合同明细，支持一键通过企微和站内信提醒销售。",
    special: "已续签合同实时剔除统计。",
    source: "销售 ERP",
    actionLabel: "一键提醒全部销售",
    actionKind: "remind",
    actionToast: "已通过企微和站内信提醒相关销售",
    emptyText: "暂无当日必清待续签合同",
    itemAction: "提醒销售",
    items: [
      { title: "恒达能源｜年度服务主合同", description: "续签方案已发送，待确认最终商务条款。", time: "今日到期", tag: "当日必清", tagTone: "critical", fields: [["合同编号", "HT20250923018"], ["合同金额", "21.8 万"], ["跟进销售", "李晓楠"]] },
      { title: "启明医药｜平台服务主合同", description: "需确认增购模块并更新续签报价。", time: "今日到期", tag: "待续签", tagTone: "critical", fields: [["合同编号", "HT20250923024"], ["合同金额", "16.2 万"], ["跟进销售", "周远"]] },
      { title: "新锐互动｜客户服务主合同", description: "客户续签意向不明确，需再次沟通。", time: "今日到期", tag: "有风险", tagTone: "overdue", fields: [["合同编号", "HT20250923031"], ["合同金额", "14.8 万"], ["跟进销售", "陈露"]] }
    ]
  },
  renewOvertime: {
    category: "客户管理预警",
    title: "超时待续签",
    count: 2,
    countLabel: "过期待续签",
    deadlineLabel: "最长过期",
    deadline: "5 天",
    status: "已超时",
    tone: "orange-red",
    criteria: "统计合同已过期、过期天数不超过 60 天且尚未续签的主合同；京麦和加收类合同不计入。",
    display: "橙红色预警展示。",
    interaction: "查看合同明细，并支持一键提醒当前跟进人。",
    special: "过期超过 60 天的合同不纳入本指标。",
    source: "销售 ERP",
    actionLabel: "提醒全部跟进人",
    actionKind: "remind",
    actionToast: "已提醒全部超时合同跟进人",
    emptyText: "暂无超时待续签合同",
    itemAction: "提醒跟进人",
    items: [
      { title: "上海明锐科技｜年度服务主合同", description: "尚未确认续签意向，需销售尽快完成客户触达。", time: "过期 5 天", tag: "高风险", tagTone: "overdue", fields: [["到期日期", "2026-09-18"], ["合同金额", "26.5 万"], ["跟进销售", "李晓楠"]] },
      { title: "盛科信息｜平台服务主合同", description: "续签合同审批尚未发起。", time: "过期 2 天", tag: "已超时", tagTone: "overdue", fields: [["到期日期", "2026-09-21"], ["合同金额", "18.4 万"], ["跟进销售", "周远"]] }
    ]
  },
  renewLater: {
    category: "客户管理预警",
    title: "后续待清续签",
    count: 5,
    countLabel: "即将到期",
    deadlineLabel: "最近到期",
    deadline: "2 天后",
    status: "即将到期",
    tone: "warning",
    criteria: "统计合同到期日距离当日 1–31 天且尚未续签的主合同，并过滤特殊合同。",
    display: "黄色常规预警展示。",
    interaction: "查看合同明细，并支持批量提醒相关销售。",
    special: "已终止、已作废合同自动从指标中剔除。",
    source: "销售 ERP",
    actionLabel: "批量提醒相关销售",
    actionKind: "remind",
    actionToast: "已批量提醒即将到期合同的相关销售",
    emptyText: "暂无后续待清续签合同",
    itemAction: "提醒销售",
    items: [
      { title: "宏远集团｜数字化平台主合同", description: "建议提前锁定下一年度增购范围。", time: "2 天后到期", tag: "即将到期", tagTone: "warning", fields: [["到期日期", "2026-09-25"], ["合同金额", "32.5 万"], ["跟进销售", "陈露"]] },
      { title: "华辰数据｜年度服务主合同", description: "需准备下一年度服务方案。", time: "5 天后到期", tag: "待准备", fields: [["到期日期", "2026-09-28"], ["合同金额", "24.8 万"], ["跟进销售", "李晓楠"]] },
      { title: "远景智造｜营销平台主合同", description: "待完成客户健康度复盘。", time: "9 天后到期", tag: "待跟进", fields: [["到期日期", "2026-10-02"], ["合同金额", "18.6 万"], ["跟进销售", "周远"]] }
    ]
  },
  visitToday: {
    category: "拜访及跟进预警",
    title: "今日需拜访",
    count: 5,
    countLabel: "今日待拜访",
    deadlineLabel: "统一截止",
    deadline: "今天 17:00",
    status: "常规",
    tone: "neutral",
    criteria: "统计截止时间为任务创建后第 1 个工作日 17:00 的待拜访任务。",
    display: "常规黑色展示。",
    interaction: "进入拜访任务待办页，自动筛选未反馈清单。",
    special: "周末下发的任务周一统一清零补做。",
    source: "拜访任务系统",
    actionLabel: "进入今日拜访待办",
    actionKind: "navigate",
    actionToast: "已带入“今日需拜访 + 未反馈”条件打开待办页",
    emptyText: "暂无今日需拜访任务",
    itemAction: "去反馈",
    items: [
      { title: "宏远集团", description: "线下拜访，推进数字化营销平台升级项目。", time: "今天 14:00", tag: "待反馈", fields: [["任务创建", "09-22 10:20"], ["截止时间", "09-23 17:00"], ["负责人", "王晨"]] },
      { title: "华辰数据", description: "线上回访，确认报价和采购排期。", time: "今天 15:30", tag: "商机跟进", fields: [["任务创建", "09-22 11:15"], ["截止时间", "09-23 17:00"], ["负责人", "王晨"]] },
      { title: "启明医药", description: "客户成功回访，核对产品使用情况。", time: "今天 17:00", tag: "服务回访", fields: [["任务创建", "09-22 15:40"], ["截止时间", "09-23 17:00"], ["负责人", "王晨"]] }
    ]
  },
  visitOvertime: {
    category: "拜访及跟进预警",
    title: "超时未拜访",
    count: 2,
    countLabel: "超时任务",
    deadlineLabel: "最长超时",
    deadline: "3 天",
    status: "已超时",
    tone: "overdue",
    criteria: "统计当前时间晚于任务创建后第 1 个工作日 17:00，且仍未反馈的拜访任务。",
    display: "红色数值，并展示“已超时”标签。",
    interaction: "进入超时拜访明细并展示精确超时时长。",
    special: "已作废任务不纳入统计。",
    source: "拜访任务系统",
    actionLabel: "进入超时拜访明细",
    actionKind: "navigate",
    actionToast: "正在打开超时未拜访明细",
    emptyText: "暂无超时未拜访任务",
    itemAction: "去反馈",
    items: [
      { title: "远景智造", description: "原定拜访未执行，尚未补充反馈或重新排期。", time: "超时 3 天 2 小时", tag: "已超时", tagTone: "overdue", fields: [["任务创建", "09-17 09:10"], ["应完成", "09-18 17:00"], ["负责人", "王晨"]] },
      { title: "嘉辰物流", description: "关键联系人变更后的首次拜访仍未完成。", time: "超时 1 天 4 小时", tag: "已超时", tagTone: "overdue", fields: [["任务创建", "09-18 14:30"], ["应完成", "09-21 17:00"], ["负责人", "王晨"]] }
    ]
  },
  approvalToday: {
    category: "拜访及跟进预警",
    title: "今日需审批",
    count: 3,
    countLabel: "待审批",
    deadlineLabel: "最早到期",
    deadline: "今天 11:20",
    status: "待审批",
    tone: "neutral",
    criteria: "统计用户已提交拜访反馈、提交时长在 24 小时内且上级尚未审批通过的任务。",
    display: "常规展示。",
    interaction: "展示审批节点、审批人和提交时间，支持一键催办。",
    special: "仅统计待审批任务；已驳回、已通过任务实时剔除。",
    source: "拜访审批系统",
    actionLabel: "一键催办全部审批人",
    actionKind: "remind",
    actionToast: "已向待审批节点发送催办消息",
    emptyText: "暂无今日需审批任务",
    itemAction: "催办审批人",
    items: [
      { title: "宏远集团拜访反馈", description: "客户需求与下一步计划已提交，等待直属主管审批。", time: "剩余 38 分钟", tag: "即将到期", tagTone: "warning", fields: [["提交时间", "09-22 11:20"], ["审批节点", "直属主管"], ["审批人", "赵明"]] },
      { title: "华辰数据拜访纪要", description: "拜访纪要和现场照片已提交。", time: "已等待 6 小时", tag: "待审批", fields: [["提交时间", "09-23 05:40"], ["审批节点", "区域负责人"], ["审批人", "孙倩"]] },
      { title: "启明医药拜访反馈", description: "客户健康度复盘结果等待确认。", time: "已等待 2 小时", tag: "待审批", fields: [["提交时间", "09-23 09:05"], ["审批节点", "直属主管"], ["审批人", "赵明"]] }
    ]
  },
  approvalOvertime: {
    category: "拜访及跟进预警",
    title: "超时未审批",
    count: 2,
    countLabel: "超时审批",
    deadlineLabel: "最长超时",
    deadline: "9 小时",
    status: "已超时",
    tone: "overdue",
    criteria: "统计拜访反馈提交时长超过 24 小时且审批仍未完成的任务。",
    display: "红色预警展示。",
    interaction: "查看审批明细，并支持一键催办当前审批人。",
    special: "超时时长精确到小时。",
    source: "拜访审批系统",
    actionLabel: "催办全部超时审批",
    actionKind: "remind",
    actionToast: "已向全部超时任务审批人发送催办",
    emptyText: "暂无超时未审批任务",
    itemAction: "催办审批人",
    items: [
      { title: "远景智造拜访纪要", description: "审批超时，后续跟进任务尚未自动生成。", time: "超时 9 小时", tag: "已超时", tagTone: "overdue", fields: [["提交时间", "09-22 02:10"], ["审批节点", "区域负责人"], ["审批人", "孙倩"]] },
      { title: "嘉辰物流拜访纪要", description: "直属主管尚未处理，已自动提醒一次。", time: "超时 4 小时", tag: "已催办", tagTone: "warning", fields: [["提交时间", "09-22 07:15"], ["审批节点", "直属主管"], ["审批人", "赵明"]] }
    ]
  },
  rejectedCorrection: {
    category: "拜访及跟进预警",
    title: "驳回待更正",
    count: 3,
    countLabel: "待更正",
    deadlineLabel: "最早驳回",
    deadline: "昨天 15:20",
    status: "待更正",
    tone: "warning",
    criteria: "累计所有历史被审批驳回、需要销售或客经修改后重新提交的拜访任务，不限制时间范围。",
    display: "橙色提醒展示。",
    interaction: "展示驳回原因、驳回时间和待整改状态。",
    special: "整改完成并重新提交后自动清零。",
    source: "拜访审批系统",
    actionLabel: "进入待更正任务",
    actionKind: "navigate",
    actionToast: "正在打开驳回待更正任务清单",
    emptyText: "暂无驳回待更正任务",
    itemAction: "去更正",
    items: [
      { title: "博源制造拜访纪要", description: "缺少现场照片，请补充后重新提交。", time: "昨天 15:20 驳回", tag: "缺少照片", tagTone: "warning", fields: [["驳回原因", "缺少现场照片"], ["驳回人", "赵明"], ["整改状态", "待更正"]] },
      { title: "海越食品拜访记录", description: "客户需求描述不完整，需补充业务场景。", time: "昨天 17:45 驳回", tag: "内容不全", tagTone: "warning", fields: [["驳回原因", "需求描述不完整"], ["驳回人", "孙倩"], ["整改状态", "待更正"]] },
      { title: "星辰教育拜访反馈", description: "费用附件与反馈内容不一致。", time: "今天 09:08 驳回", tag: "附件有误", tagTone: "warning", fields: [["驳回原因", "附件不一致"], ["驳回人", "赵明"], ["整改状态", "修改中"]] }
    ]
  },
  exceptionLoop: {
    category: "拜访及跟进预警",
    title: "待闭环异常",
    count: 2,
    countLabel: "待闭环",
    deadlineLabel: "最长未闭环",
    deadline: "36 天",
    status: "高风险",
    tone: "high-risk",
    criteria: "统计超过 30 天责任人已确认，但仍未完成闭环的客户异常反馈任务。",
    display: "深红色高风险展示。",
    interaction: "进入异常工单页面，并支持一键催办跟进人。",
    special: "永久累计，直至异常完成闭环。",
    source: "客户异常反馈系统",
    actionLabel: "进入异常工单",
    actionKind: "navigate",
    actionToast: "正在打开待闭环异常工单",
    emptyText: "暂无待闭环异常任务",
    itemAction: "查看工单",
    secondaryItemAction: "催办跟进人",
    items: [
      { title: "上海明锐科技｜服务响应异常", description: "责任人已确认，改进措施尚未完成客户侧验证。", time: "未闭环 36 天", tag: "高风险", tagTone: "high-risk", fields: [["确认日期", "2026-08-18"], ["责任人", "王晨"], ["当前节点", "客户验证"]] },
      { title: "华辰数据｜方案交付异常", description: "承诺交付的方案文档仍未通过客户验收。", time: "未闭环 32 天", tag: "高风险", tagTone: "high-risk", fields: [["确认日期", "2026-08-22"], ["责任人", "王晨"], ["当前节点", "方案整改"]] }
    ]
  },
  warehouseTask: {
    category: "常规任务跟进预警",
    title: "搬仓未完成任务",
    count: 4,
    countLabel: "我的未完成",
    deadlineLabel: "最近截止",
    deadline: "今天 18:00",
    status: "我的任务",
    tone: "neutral",
    criteria: "统计近 30 天创建、尚未完结且未作废的搬仓任务总数，仅包含我的任务。",
    display: "常规样式展示。",
    interaction: "进入搬仓任务明细页，查看待处理清单。",
    special: "只统计当前人员名下的有效任务。",
    source: "搬仓任务系统",
    actionLabel: "进入搬仓任务明细",
    actionKind: "navigate",
    actionToast: "正在打开我的搬仓未完成任务",
    emptyText: "暂无搬仓未完成任务",
    itemAction: "查看任务",
    items: [
      { title: "宏远集团资料迁移", description: "历史沟通记录尚未全部迁移至新客户空间。", time: "今天 18:00", tag: "资料迁移", fields: [["创建日期", "2026-09-16"], ["当前阶段", "资料校验"], ["责任人", "王晨"]] },
      { title: "华辰数据权限确认", description: "新负责人暂未获得合同查看权限。", time: "明天 10:00", tag: "权限确认", fields: [["创建日期", "2026-09-18"], ["当前阶段", "权限开通"], ["责任人", "王晨"]] },
      { title: "启明医药客户告知", description: "客户尚未确认收到负责人变更通知。", time: "明天 12:00", tag: "客户告知", fields: [["创建日期", "2026-09-20"], ["当前阶段", "客户确认"], ["责任人", "王晨"]] }
    ]
  },
  blockedTask: {
    category: "常规任务跟进预警",
    title: "异常卡单任务数",
    count: 2,
    countLabel: "我的异常工单",
    deadlineLabel: "最长卡单",
    deadline: "26 小时",
    status: "橙色预警",
    tone: "warning",
    criteria: "统计近 15 天生成、尚未处理且未关闭的业务卡单异常工单，仅包含我的任务。",
    display: "橙色预警展示。",
    interaction: "进入异常卡单明细，支持查看当前处理进度。",
    special: "关闭后实时从指标中剔除。",
    source: "业务工单系统",
    actionLabel: "进入异常卡单明细",
    actionKind: "navigate",
    actionToast: "正在打开异常卡单处理进度",
    emptyText: "暂无异常卡单任务",
    itemAction: "查看进度",
    items: [
      { title: "嘉辰物流数据校验", description: "客户主数据校验失败，等待数据管理员处理。", time: "卡单 26 小时", tag: "系统异常", tagTone: "warning", fields: [["生成时间", "09-22 09:10"], ["阻塞节点", "主数据校验"], ["处理进度", "待数据组"]] },
      { title: "数联科技跨区转交", description: "跨区域归属存在争议，等待业务主管确认。", time: "卡单 11 小时", tag: "协同阻塞", tagTone: "warning", fields: [["生成时间", "09-23 00:20"], ["阻塞节点", "归属确认"], ["处理进度", "协同中"]] }
    ]
  }
};

const taskViews = {
  today: [
    { type: "handover", key: "handoverToday", label: "交接", sourceClass: "source-customer", sourceLabel: "客户管理", cardClass: "critical", statusClass: "critical", status: "当日必清", formula: "剩余交接天数 = 0", foot: "2 项即将到期", action: "去处理", urgency: "需今日处理", focusTone: "danger", statusMode: "today" },
    { type: "renew", key: "renewToday", label: "续签", sourceClass: "source-customer", sourceLabel: "客户管理", cardClass: "critical", statusClass: "critical", status: "当日必清", formula: "主合同到期日 = 今日", foot: "已续签实时剔除", action: "提醒销售", urgency: "需今日处理", focusTone: "danger", statusMode: "today" },
    { type: "visit", key: "visitToday", label: "拜访", sourceClass: "source-visit", sourceLabel: "拜访跟进", cardClass: "", statusClass: "neutral", status: "今日待办", formula: "创建 + 1 个工作日 17:00", foot: "周末任务周一补做", action: "去反馈", urgency: "需今日处理", focusTone: "danger", statusMode: "today" },
    { type: "approval", key: "approvalToday", label: "审批", sourceClass: "source-visit", sourceLabel: "拜访跟进", cardClass: "", statusClass: "neutral", status: "待审批", formula: "提交后 24 小时内未审批", foot: "通过或驳回后剔除", action: "去审批", urgency: "需今日处理", focusTone: "danger", statusMode: "today" }
  ],
  overdue: [
    { type: "handover", key: "handoverOvertime", label: "交接", sourceClass: "source-customer", sourceLabel: "客户管理", cardClass: "overdue", statusClass: "overdue", status: "已超时", formula: "交接时长 > 90 天", foot: "永久保留至闭环", action: "查看明细", urgency: "需立即处理", focusTone: "danger" },
    { type: "renew", key: "renewOvertime", label: "续签", sourceClass: "source-customer", sourceLabel: "客户管理", cardClass: "overdue renew-overdue", statusClass: "orange-red", status: "已超时", formula: "已过期且过期天数 ≤ 60", foot: "超过 60 天不计入", action: "立即跟进", urgency: "需立即处理", focusTone: "danger" },
    { type: "visit", key: "visitOvertime", label: "拜访", sourceClass: "source-visit", sourceLabel: "拜访跟进", cardClass: "overdue", statusClass: "overdue", status: "已超时", formula: "晚于创建 + 1 个工作日 17:00", foot: "已作废任务不统计", action: "立即处理", urgency: "需立即处理", focusTone: "danger" },
    { type: "approval", key: "approvalOvertime", label: "审批", sourceClass: "source-visit", sourceLabel: "拜访跟进", cardClass: "overdue", statusClass: "overdue", status: "已超时", formula: "反馈提交时长 > 24 小时", foot: "超时时长精确到小时", action: "立即催办", urgency: "需立即处理", focusTone: "danger" }
  ],
  later: [
    { type: "handover", key: "handoverLater", label: "交接", sourceClass: "source-customer", sourceLabel: "客户管理", cardClass: "", statusClass: "neutral", status: "正常待办", formula: "0 < 剩余天数 < 90", foot: "明日 3 项", action: "查看清单", urgency: "按计划处理", focusTone: "warning" },
    { type: "renew", key: "renewLater", label: "续签", sourceClass: "source-customer", sourceLabel: "客户管理", cardClass: "warning", statusClass: "warning", status: "即将到期", formula: "距到期日 1–31 天", foot: "终止、作废合同剔除", action: "批量提醒", urgency: "按计划处理", focusTone: "warning" }
  ],
  exception: [
    { type: "correction", key: "rejectedCorrection", label: "更正", sourceClass: "source-visit", sourceLabel: "拜访跟进", cardClass: "warning", statusClass: "warning", status: "待更正", formula: "历史驳回且待重新提交", foot: "整改完成后自动清零", action: "去更正", urgency: "需尽快处理", focusTone: "warning" },
    { type: "loop", key: "exceptionLoop", label: "闭环", sourceClass: "source-visit", sourceLabel: "拜访跟进", cardClass: "overdue", statusClass: "high-risk", status: "高风险", formula: "确认后超过 30 天未闭环", foot: "永久累计直至闭环", action: "查看工单", urgency: "需立即处理", focusTone: "danger" }
  ],
  warehouse: [
    { type: "warehouse", key: "warehouseTask", label: "搬仓", sourceClass: "source-routine", sourceLabel: "常规任务", cardClass: "routine-alert", statusClass: "neutral", status: "我的任务", formula: "近 30 天创建 · 未完结 · 未作废", foot: "仅统计我的有效任务", action: "查看任务", urgency: "按计划处理", focusTone: "warning", statusMode: "deadline" }
  ],
  blocked: [
    { type: "blocked", key: "blockedTask", label: "卡单", sourceClass: "source-routine", sourceLabel: "常规任务", cardClass: "warning", statusClass: "warning", status: "橙色预警", formula: "近 15 天生成 · 未处理 · 未关闭", foot: "关闭后实时剔除", action: "查看进度", urgency: "需尽快处理", focusTone: "warning" }
  ]
};

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function showToast(message) {
  toastText.textContent = message;
  toast.classList.add("show");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(function () { toast.classList.remove("show"); }, 2300);
}

function syncTaskTabCounts() {
  taskTabs.querySelectorAll("[data-view]").forEach(function (button) {
    const configs = taskViews[button.dataset.view] || [];
    const total = configs.reduce(function (sum, config) {
      return sum + (alertDetails[config.key] ? alertDetails[config.key].count : 0);
    }, 0);
    const count = button.querySelector("b");
    if (count) count.textContent = total;
  });

  const priorityCount = document.getElementById("priorityCount");
  if (priorityCount) {
    const priorityViews = ["overdue", "exception"];
    const total = priorityViews.reduce(function (sum, view) {
      return sum + taskViews[view].reduce(function (viewSum, config) {
        return viewSum + alertDetails[config.key].count;
      }, 0);
    }, 0);
    priorityCount.textContent = total + " 项";
  }
}

function formatFocusStatus(time, mode) {
  if (mode === "today") {
    if (time.indexOf("剩余 ") === 0) return time.replace("剩余 ", "") + "后超时";
    if (time.indexOf("今天 ") === 0) return time.replace("今天 ", "") + " 后超时";
  }
  if (mode === "deadline" && time.indexOf("今天 ") === 0) return time.replace("今天 ", "") + " 前完成";
  return time;
}

function renderFocusPanel(key, elements, options) {
  const detail = options.detail || alertDetails[key];
  if (!detail) return;

  elements.title.textContent = detail.title + "：当前有 " + detail.count + " 项待处理";
  elements.rule.textContent = "统计口径：" + detail.criteria;
  elements.allButton.textContent = detail.count ? "查看全部 " + detail.count + " 项 ›" : "查看空状态 ›";

  if (!detail.items.length) {
    elements.list.innerHTML = '<div class="drawer-empty focus-empty"><div><span>✓</span><strong>' + escapeHtml(detail.emptyText) + '</strong><p>当前没有符合该统计口径的待处理数据。</p></div></div>';
    return;
  }

  const rows = detail.items.slice(0, options.limit || 3).map(function (item, index) {
    const tone = typeof options.tone === "function" ? options.tone(item) : (options.tone || "danger");
    const urgency = typeof options.urgency === "function" ? options.urgency(item) : options.urgency;
    const statusMode = typeof options.statusMode === "function" ? options.statusMode(item) : options.statusMode;
    const itemKey = typeof options.itemKey === "function" ? options.itemKey(item) : key;
    const prefix = typeof options.prefix === "function" ? options.prefix(item) : (options.prefix || "自动");
    return '<article class="focus-row" role="row">' +
      '<span class="focus-index" role="cell">' + (index + 1) + '</span>' +
      '<div class="focus-summary" role="cell"><strong><i>【' + escapeHtml(prefix) + '】</i>' + escapeHtml(item.title) + '，' + escapeHtml(item.description) + '</strong></div>' +
      '<span class="focus-sla ' + tone + '" role="cell">' + escapeHtml(urgency) + '</span>' +
      '<span class="focus-status ' + tone + '" role="cell">' + escapeHtml(formatFocusStatus(item.time, statusMode)) + '</span>' +
      '<button class="focus-action" type="button" data-focus-key="' + escapeHtml(itemKey) + '" role="cell">去处理</button>' +
      '</article>';
  }).join("");

  elements.list.innerHTML = '<div class="focus-table" role="table" aria-label="' + escapeHtml(detail.title) + '待处理任务">' +
    '<div class="focus-table-head" role="row"><span role="columnheader">序号</span><span role="columnheader">摘要</span><span role="columnheader">处理时效</span><span class="sortable" role="columnheader">状态<i></i></span><span role="columnheader">操作</span></div>' +
    '<div class="focus-table-body" role="rowgroup">' + rows + '</div></div>';

  elements.list.querySelectorAll("[data-focus-key]").forEach(function (button) {
    button.addEventListener("click", function () { openDrawer(button.dataset.focusKey); });
  });
}

function buildStageCardMarkup(config, isActive) {
  const detail = alertDetails[config.key];
  const cardClasses = ["stage-card", config.sourceClass, config.cardClass, isActive ? "active" : ""].filter(Boolean).join(" ");
  return '<article class="' + cardClasses + '" data-key="' + escapeHtml(config.key) + '" data-type="' + escapeHtml(config.type) + '" tabindex="0" role="option" aria-selected="' + (isActive ? "true" : "false") + '">' +
    '<div class="stage-ribbon">' + escapeHtml(config.label) + '</div>' +
    '<span class="metric-status ' + escapeHtml(config.statusClass) + '">' + escapeHtml(config.status) + '</span>' +
    '<div class="stage-metric"><span>' + escapeHtml(detail.title) + ' <svg><use href="#i-info"></use></svg></span><strong class="metric-count">' + detail.count + '</strong></div>' +
    '<p class="metric-formula">' + escapeHtml(config.formula) + '</p>' +
    '<div class="metric-card-foot"><span class="metric-source"><i></i>' + escapeHtml(config.sourceLabel) + '<em>·</em>' + escapeHtml(config.foot) + '</span><button class="open-detail" type="button">' + escapeHtml(config.action) + '</button></div>' +
    '</article>';
}

function renderTaskFocus(config) {
  activeFocusKey = config.key;
  taskBoard.classList.remove("active-source-customer", "active-source-visit", "active-source-routine");
  taskBoard.classList.add("active-" + config.sourceClass);
  renderFocusPanel(config.key, { title: focusTitle, rule: focusRule, list: focusList, allButton: focusAllButton }, {
    urgency: config.urgency,
    tone: config.focusTone,
    statusMode: config.statusMode || "",
    prefix: config.label
  });
}

function bindTaskCardEvents(configs) {
  taskCardStrip.querySelectorAll(".stage-card").forEach(function (card) {
    const config = configs.find(function (item) { return item.key === card.dataset.key; });

    function selectCard() {
      activeTaskType = config.type;
      taskCardStrip.querySelectorAll(".stage-card").forEach(function (item) {
        item.classList.toggle("active", item === card);
        item.setAttribute("aria-selected", item === card ? "true" : "false");
      });
      renderTaskFocus(config);
    }

    card.addEventListener("click", selectCard);
    card.addEventListener("keydown", function (event) {
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        selectCard();
      }
    });

    card.querySelector(".open-detail").addEventListener("click", function (event) {
      event.stopPropagation();
      openDrawer(config.key);
    });
  });
}

function renderTaskCards(view, preferredType) {
  const configs = taskViews[view];
  if (!configs || !configs.length) return;
  activeTaskView = view;

  const requestedType = preferredType || activeTaskType;
  let selected = configs.find(function (config) {
    return config.type === requestedType || config.key === requestedType;
  });
  if (!selected) {
    selected = configs[0];
  }
  activeTaskType = selected.type;

  taskCardStrip.classList.remove("card-count-1", "card-count-2", "card-count-4");
  taskCardStrip.classList.add("card-count-" + configs.length);
  taskCardStrip.innerHTML = configs.map(function (config) {
    return buildStageCardMarkup(config, config.key === selected.key);
  }).join("");

  bindTaskCardEvents(configs);
  renderTaskFocus(selected);
}

function makeCompletedItems(detail) {
  return [
    { title: detail.title + "｜已完成事项 01", description: "已按规则完成处理，系统已从待办指标中实时剔除。", time: "今天 09:26", tag: "已处理", tagTone: "success", fields: [["处理人", "王晨"], ["完成时间", "09:26"], ["处理结果", "已闭环"]] },
    { title: detail.title + "｜已完成事项 02", description: "相关资料已补齐并完成流程提交。", time: "今天 08:45", tag: "已处理", tagTone: "success", fields: [["处理人", "王晨"], ["完成时间", "08:45"], ["处理结果", "已闭环"]] }
  ];
}

function renderItemFields(fields) {
  if (!fields || !fields.length) return "";
  return '<div class="drawer-item-fields">' + fields.map(function (field) {
    return '<div><span>' + escapeHtml(field[0]) + '</span><strong>' + escapeHtml(field[1]) + '</strong></div>';
  }).join("") + '</div>';
}

function renderDrawer(key, completed) {
  const detail = alertDetails[key];
  if (!detail) return;
  const list = completed ? makeCompletedItems(detail) : detail.items;

  document.getElementById("drawerCategory").textContent = detail.category;
  document.getElementById("drawerTitle").textContent = detail.title;
  document.getElementById("drawerCountLabel").textContent = completed ? "今日已处理" : detail.countLabel;
  document.getElementById("drawerCount").textContent = completed ? list.length : detail.count;
  document.getElementById("drawerDeadlineLabel").textContent = completed ? "最近完成" : detail.deadlineLabel;
  document.getElementById("drawerDeadline").textContent = completed ? "今天 09:26" : detail.deadline;
  document.getElementById("drawerRule").textContent = detail.criteria;
  document.getElementById("drawerDisplay").textContent = detail.display;
  document.getElementById("drawerInteraction").textContent = detail.interaction;
  document.getElementById("drawerSpecial").textContent = detail.special;
  document.getElementById("drawerSource").textContent = "数据来源：" + detail.source;

  const status = document.getElementById("drawerStatus");
  status.textContent = detail.status;
  status.className = detail.tone;

  drawerPrimaryAction.querySelector("span").textContent = detail.actionLabel;
  drawerPrimaryAction.querySelector("use").setAttribute("href", detail.actionKind === "remind" ? "#i-message" : "#i-link");
  drawerPrimaryAction.dataset.key = key;

  if (!list.length) {
    document.getElementById("drawerList").innerHTML = '<div class="drawer-empty"><div><span>✓</span><strong>' + escapeHtml(detail.emptyText) + '</strong><p>当前没有符合该指标统计口径的任务。</p></div></div>';
    return;
  }

  document.getElementById("drawerList").innerHTML = list.map(function (item, index) {
    const toneClass = completed ? "success" : (item.tagTone || "neutral");
    const itemButtons = '<div class="drawer-item-actions">' + (detail.secondaryItemAction ? '<button class="secondary" type="button" data-item-secondary="' + index + '">' + escapeHtml(detail.secondaryItemAction) + '</button>' : '') + '<button type="button" data-item-action="' + index + '">' + escapeHtml(detail.itemAction) + '</button></div>';
    const action = completed ? '<span>处理人：王晨</span>' : itemButtons;
    return '<article class="drawer-item"><div class="drawer-item-head"><strong>' + escapeHtml(item.title) + '</strong><em class="' + toneClass + '">' + escapeHtml(item.tag) + '</em></div><p>' + escapeHtml(item.description) + '</p>' + renderItemFields(item.fields) + '<div class="drawer-item-meta"><span><svg><use href="#i-clock"></use></svg>' + escapeHtml(item.time) + '</span>' + action + '</div></article>';
  }).join("");

  document.querySelectorAll("[data-item-action]").forEach(function (button) {
    button.addEventListener("click", function () {
      if (detail.actionKind === "remind") {
        button.textContent = "已提醒";
        button.disabled = true;
        button.classList.add("secondary");
        showToast("已提醒对应销售或审批人");
        return;
      }
      showToast("正在打开“" + detail.title + "”对应业务明细");
    });
  });

  document.querySelectorAll("[data-item-secondary]").forEach(function (button) {
    button.addEventListener("click", function () {
      if (detail.secondaryItemAction === "驳回重提") showToast("已进入驳回重提确认流程");
      else showToast("已向当前跟进人发送催办提醒");
    });
  });
}

function openDrawer(key) {
  activeDrawerKey = key;
  document.querySelectorAll(".drawer-tabs button").forEach(function (button, index) { button.classList.toggle("active", index === 0); });
  renderDrawer(key, false);
  drawer.classList.add("open");
  drawerBackdrop.classList.add("open");
  drawer.setAttribute("aria-hidden", "false");
  document.body.classList.add("drawer-open");
}

function closeDrawer() {
  drawer.classList.remove("open");
  drawerBackdrop.classList.remove("open");
  drawer.setAttribute("aria-hidden", "true");
  document.body.classList.remove("drawer-open");
}

function syncMetricCounts() {
  document.querySelectorAll("[data-key]").forEach(function (card) {
    const detail = alertDetails[card.dataset.key];
    const count = card.querySelector(".metric-count");
    if (detail && count) count.textContent = detail.count;
  });
}

const pageParams = new URLSearchParams(window.location.search);
const emptyDemoKey = pageParams.get("empty");
if (emptyDemoKey && alertDetails[emptyDemoKey]) {
  alertDetails[emptyDemoKey].count = 0;
  alertDetails[emptyDemoKey].items = [];
  alertDetails[emptyDemoKey].deadline = "暂无";
}

document.querySelectorAll(".mode-tabs button").forEach(function (button) {
  button.addEventListener("click", function () {
    document.querySelectorAll(".mode-tabs button").forEach(function (item) { item.classList.remove("active"); });
    button.classList.add("active");
    showToast(button.textContent.trim() === "看团队" ? "已切换至团队视图" : "已切换至个人概览");
  });
});

document.getElementById("refreshButton").addEventListener("click", function () {
  const button = this;
  button.classList.add("spinning");
  setTimeout(function () { button.classList.remove("spinning"); }, 700);
  document.getElementById("updateTime").textContent = "2026-09-23 " + new Date().toLocaleTimeString("zh-CN", { hour: "2-digit", minute: "2-digit", hour12: false });
  showToast("数据已刷新");
});

document.querySelectorAll("[data-toast]").forEach(function (button) {
  button.addEventListener("click", function () { showToast(button.dataset.toast); });
});

taskTabs.querySelectorAll("[data-view]").forEach(function (button) {
  button.addEventListener("click", function () {
    taskTabs.querySelectorAll("[data-view]").forEach(function (item) { item.classList.remove("active"); });
    button.classList.add("active");
    renderTaskCards(button.dataset.view);
    showToast("已切换至“" + button.querySelector("span").textContent + "”视图");
  });
});

focusAllButton.addEventListener("click", function () { openDrawer(activeFocusKey); });

document.querySelectorAll(".drawer-tabs button").forEach(function (button, index) {
  button.addEventListener("click", function () {
    document.querySelectorAll(".drawer-tabs button").forEach(function (item) { item.classList.remove("active"); });
    button.classList.add("active");
    renderDrawer(activeDrawerKey, index === 1);
  });
});

drawerPrimaryAction.addEventListener("click", function () {
  const detail = alertDetails[drawerPrimaryAction.dataset.key || activeDrawerKey];
  if (detail) showToast(detail.actionToast);
});

document.getElementById("closeDrawer").addEventListener("click", closeDrawer);
drawerBackdrop.addEventListener("click", closeDrawer);
document.addEventListener("keydown", function (event) { if (event.key === "Escape") closeDrawer(); });

const requestedTaskView = pageParams.get("view");
const initialTaskView = taskViews[requestedTaskView] ? requestedTaskView : "today";
const typeAliases = { primary: "visit", secondary: "approval" };
const rawTaskType = pageParams.get("type") || pageParams.get("taskType") || "";
const requestedTaskType = typeAliases[rawTaskType] || rawTaskType;
if (requestedTaskType) activeTaskType = requestedTaskType;

taskTabs.querySelectorAll("[data-view]").forEach(function (button) {
  button.classList.toggle("active", button.dataset.view === initialTaskView);
});

syncTaskTabCounts();
renderTaskCards(initialTaskView, requestedTaskType);
syncMetricCounts();

const drawerDemoKey = pageParams.get("drawer");
if (drawerDemoKey && alertDetails[drawerDemoKey]) openDrawer(drawerDemoKey);
