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
const activeVisitSegments = {};
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
    count: 8,
    countLabel: "今日待拜访",
    deadlineLabel: "最近截止",
    deadline: "今天 15:30",
    status: "今日待办",
    tone: "neutral",
    criteria: "汇总今日待处理的流失减量拜访与常规拜访；前者须在今日 17:00 前完成，后者须在各自计划拜访时间前完成。",
    display: "总数聚合展示，并按“流失减量拜访 / 常规拜访”拆分数量。",
    interaction: "可按拜访类型筛选任务，并进入对应拜访待办页完成反馈。",
    special: "流失减量拜访取前一工作日创建的 AI 推荐任务，周一包含上周五；常规拜访按计划拜访时间判断。",
    source: "拜访任务系统",
    actionLabel: "进入今日拜访待办",
    actionKind: "navigate",
    actionToast: "已带入“今日需拜访 + 未反馈”条件打开待办页",
    emptyText: "暂无今日需拜访任务",
    itemAction: "去反馈",
    items: []
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
    criteria: "汇总已超时的流失减量拜访与常规拜访；分别按今日 17:00 和计划拜访时间判断是否超时。",
    display: "红色数值聚合展示，并按两类拜访拆分超时数量。",
    interaction: "可按拜访类型筛选超时任务，并进入对应明细立即处理。",
    special: "已完成或已作废任务不纳入统计；超时状态显示已过期天数。",
    source: "拜访任务系统",
    actionLabel: "进入超时拜访明细",
    actionKind: "navigate",
    actionToast: "正在打开超时未拜访明细",
    emptyText: "暂无超时未拜访任务",
    itemAction: "去反馈",
    items: []
  },
  visitLossToday: {
    category: "拜访及跟进预警",
    title: "今日流失减量拜访",
    count: 3,
    countLabel: "今日待拜访",
    deadlineLabel: "统一截止",
    deadline: "今天 17:00",
    status: "今日待办",
    tone: "neutral",
    criteria: "统计 AI 推荐、创建时间为前一工作日（周一包含上周五）、当前时间不晚于 17:00 且尚未拜访的流失减量任务。",
    display: "在今日需拜访中标记为“流失减量拜访”，不足 1 小时显示剩余分钟。",
    interaction: "进入流失减量拜访待办页，并自动筛选今日未完成任务。",
    special: "今日 17:00 后仍未完成时转入超时未拜访。",
    source: "AI 推荐拜访任务",
    actionLabel: "进入流失减量拜访待办",
    actionKind: "navigate",
    actionToast: "正在打开今日流失减量拜访待办",
    emptyText: "暂无今日流失减量拜访任务",
    itemAction: "去拜访",
    items: [
      { visitKind: "流失减量拜访", detailKey: "visitLossToday", title: "宏远集团", description: "线下拜访，推进客户流失挽回。", time: "剩余 45 分钟", tag: "AI 推荐", tagTone: "warning", fields: [["推荐来源", "AI 流失预警"], ["截止时间", "10-27 17:00"], ["负责人", "王晨"]] },
      { visitKind: "流失减量拜访", detailKey: "visitLossToday", title: "启明医药", description: "线上拜访，核实近期减量原因与恢复计划。", time: "今天 17:00", tag: "AI 推荐", fields: [["推荐来源", "AI 减量预警"], ["截止时间", "10-27 17:00"], ["负责人", "王晨"]] },
      { visitKind: "流失减量拜访", detailKey: "visitLossToday", title: "海越食品", description: "线下拜访，确认订单下降原因与客户挽回方案。", time: "今天 17:00", tag: "AI 推荐", fields: [["推荐来源", "AI 流失预警"], ["截止时间", "10-27 17:00"], ["负责人", "王晨"]] }
    ]
  },
  visitRegularToday: {
    category: "拜访及跟进预警",
    title: "今日常规拜访",
    count: 5,
    countLabel: "今日待拜访",
    deadlineLabel: "最近计划时间",
    deadline: "今天 15:30",
    status: "今日待办",
    tone: "neutral",
    criteria: "统计省区、总部手动下发等其他拜访任务，当前时间不晚于计划拜访时间且尚未拜访。",
    display: "在今日需拜访中标记为“常规拜访”，并展示计划拜访时间。",
    interaction: "进入常规拜访待办页，并保留计划时间与未完成筛选条件。",
    special: "超过计划拜访时间仍未完成时转入超时未拜访。",
    source: "拜访任务系统",
    actionLabel: "进入常规拜访待办",
    actionKind: "navigate",
    actionToast: "正在打开今日常规拜访待办",
    emptyText: "暂无今日常规拜访任务",
    itemAction: "去拜访",
    items: [
      { visitKind: "常规拜访", detailKey: "visitRegularToday", title: "华辰数据", description: "线上拜访，确认报价与采购排期。", time: "今天 15:30", tag: "省区下发", fields: [["下发来源", "华东省区"], ["计划拜访", "10-27 15:30"], ["负责人", "王晨"]] },
      { visitKind: "常规拜访", detailKey: "visitRegularToday", title: "嘉辰物流", description: "线下拜访，确认关键联系人变更后的合作安排。", time: "今天 16:20", tag: "总部下发", fields: [["下发来源", "总部客户组"], ["计划拜访", "10-27 16:20"], ["负责人", "王晨"]] },
      { visitKind: "常规拜访", detailKey: "visitRegularToday", title: "博源制造", description: "线上拜访，沟通年度服务方案与增购需求。", time: "今天 16:40", tag: "省区下发", fields: [["下发来源", "华北省区"], ["计划拜访", "10-27 16:40"], ["负责人", "王晨"]] },
      { visitKind: "常规拜访", detailKey: "visitRegularToday", title: "星辰教育", description: "线下拜访，复盘产品使用情况与后续培训计划。", time: "今天 17:10", tag: "手动创建", fields: [["下发来源", "客户经理"], ["计划拜访", "10-27 17:10"], ["负责人", "王晨"]] },
      { visitKind: "常规拜访", detailKey: "visitRegularToday", title: "恒达能源", description: "线上拜访，确认续签前的服务改进事项。", time: "今天 18:00", tag: "总部下发", fields: [["下发来源", "总部客户组"], ["计划拜访", "10-27 18:00"], ["负责人", "王晨"]] }
    ]
  },
  visitLossOvertime: {
    category: "拜访及跟进预警",
    title: "超时流失减量拜访",
    count: 1,
    countLabel: "超时任务",
    deadlineLabel: "最长过期",
    deadline: "3 天",
    status: "已超时",
    tone: "overdue",
    criteria: "统计 AI 推荐且已超过任务应完成日 17:00、仍未拜访的流失减量任务。",
    display: "红色预警，摘要标记“流失减量拜访”，状态显示已过期天数。",
    interaction: "进入超时流失减量拜访明细并立即补充拜访反馈。",
    special: "已完成或已作废任务实时剔除。",
    source: "AI 推荐拜访任务",
    actionLabel: "进入超时流失减量拜访",
    actionKind: "navigate",
    actionToast: "正在打开超时流失减量拜访明细",
    emptyText: "暂无超时流失减量拜访任务",
    itemAction: "立即处理",
    items: [
      { visitKind: "流失减量拜访", detailKey: "visitLossOvertime", title: "远景智造", description: "线下拜访，核实客户持续减量原因与挽回动作。", time: "已过期3天", tag: "AI 推荐", tagTone: "overdue", fields: [["推荐来源", "AI 减量预警"], ["应完成", "10-24 17:00"], ["负责人", "王晨"]] }
    ]
  },
  visitRegularOvertime: {
    category: "拜访及跟进预警",
    title: "超时常规拜访",
    count: 1,
    countLabel: "超时任务",
    deadlineLabel: "最长过期",
    deadline: "1 天",
    status: "已超时",
    tone: "overdue",
    criteria: "统计当前时间已超过计划拜访时间、仍未完成的省区或总部手动下发等常规拜访任务。",
    display: "红色预警，摘要标记“常规拜访”，状态显示已过期天数。",
    interaction: "进入超时常规拜访明细并立即补充拜访反馈。",
    special: "已完成或已作废任务实时剔除。",
    source: "拜访任务系统",
    actionLabel: "进入超时常规拜访",
    actionKind: "navigate",
    actionToast: "正在打开超时常规拜访明细",
    emptyText: "暂无超时常规拜访任务",
    itemAction: "立即处理",
    items: [
      { visitKind: "常规拜访", detailKey: "visitRegularOvertime", title: "嘉辰物流", description: "线下拜访，完成关键联系人变更后的首次沟通。", time: "已过期1天", tag: "总部下发", tagTone: "overdue", fields: [["下发来源", "总部客户组"], ["计划拜访", "10-26 14:30"], ["负责人", "王晨"]] }
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
  },
  tcExceptionToday: {
    category: "常规任务跟进预警",
    title: "当日必清 TC 入库异常",
    count: 3,
    countLabel: "今日待清",
    deadlineLabel: "最近截止",
    deadline: "今天 15:20",
    status: "当日必清",
    tone: "warning",
    criteria: "统计创建时间在 7 天内、尚未完成的 TC 入库异常任务。",
    display: "按今日处理时限展示，完成后实时从指标中剔除。",
    interaction: "进入 TC 入库异常任务清单并自动筛选当前客户经理。",
    special: "仅统计有效且未关闭的任务。",
    source: "TC 入库异常任务系统",
    actionLabel: "进入 TC 异常清单",
    actionKind: "navigate",
    actionToast: "正在打开 TC 入库异常任务清单",
    emptyText: "暂无 TC 入库异常任务",
    itemAction: "去处理",
    items: [
      { title: "华东云仓入库资料异常", description: "入库单与客户合同信息不一致，待补充核验。", time: "今天 15:20", tag: "资料异常", tagTone: "warning", fields: [["创建时间", "10-25 14:10"], ["异常类型", "资料不一致"], ["责任人", "王晨"]] },
      { title: "盛达供应链入库编码缺失", description: "客户商品编码未同步，待完成基础信息维护。", time: "今天 16:00", tag: "编码缺失", tagTone: "warning", fields: [["创建时间", "10-26 09:30"], ["异常类型", "编码缺失"], ["责任人", "王晨"]] },
      { title: "远洋商贸入库状态异常", description: "系统状态未回传，需协同仓配团队确认。", time: "今天 17:00", tag: "状态异常", tagTone: "warning", fields: [["创建时间", "10-26 11:12"], ["异常类型", "状态未回传"], ["责任人", "王晨"]] }
    ]
  },
  accidentWarningToday: {
    category: "常规任务跟进预警",
    title: "当日必清一级事故预警",
    count: 2,
    countLabel: "今日待清",
    deadlineLabel: "处理时限",
    deadline: "48 小时内",
    status: "高优先级",
    tone: "critical",
    criteria: "统计体验事故预警系统推送后 48 小时内，需要客户经理完成跟进的一级事故预警。",
    display: "使用红色高优先级标识，并置于今日必清业务中。",
    interaction: "进入事故预警详情查看损伤原因、客户影响及跟进记录。",
    special: "预警解除或完成闭环后实时剔除。",
    source: "体验事故预警系统",
    actionLabel: "进入事故预警清单",
    actionKind: "navigate",
    actionToast: "正在打开一级事故预警清单",
    emptyText: "暂无一级事故预警任务",
    itemAction: "去跟进",
    items: [
      { title: "恒远科技履约体验预警", description: "客户履约体验出现重度损伤，待确认影响范围并制定恢复方案。", time: "剩余 6 小时", tag: "一级事故", tagTone: "critical", fields: [["推送时间", "10-26 16:20"], ["损伤等级", "重度损伤"], ["责任人", "王晨"]] },
      { title: "新创零售服务异常预警", description: "连续两周服务指标下降，需完成客户沟通与事故跟进。", time: "剩余 19 小时", tag: "一级事故", tagTone: "critical", fields: [["推送时间", "10-27 05:40"], ["损伤等级", "重度损伤"], ["责任人", "王晨"]] }
    ]
  }
};

function syncVisitAggregates() {
  alertDetails.visitToday.items = alertDetails.visitLossToday.items.concat(alertDetails.visitRegularToday.items);
  alertDetails.visitOvertime.items = alertDetails.visitLossOvertime.items.concat(alertDetails.visitRegularOvertime.items);
  alertDetails.visitToday.count = alertDetails.visitLossToday.count + alertDetails.visitRegularToday.count;
  alertDetails.visitOvertime.count = alertDetails.visitLossOvertime.count + alertDetails.visitRegularOvertime.count;
  alertDetails.visitToday.deadline = alertDetails.visitRegularToday.count ? "今天 15:30" : (alertDetails.visitLossToday.count ? "今天 17:00" : "暂无");
}

syncVisitAggregates();

const taskViews = {
  today: [
    { type: "handover", key: "handoverToday", label: "交接", sourceClass: "source-customer", sourceLabel: "客户管理", cardClass: "critical", statusClass: "critical", status: "当日必清", formula: "剩余交接天数 = 0", foot: "2 项即将到期", action: "去处理", urgency: "需今日处理", focusTone: "danger", statusMode: "today" },
    { type: "renew", key: "renewToday", label: "续签", sourceClass: "source-customer", sourceLabel: "客户管理", cardClass: "critical", statusClass: "critical", status: "当日必清", formula: "主合同到期日 = 今日", foot: "已续签实时剔除", action: "提醒销售", urgency: "需今日处理", focusTone: "danger", statusMode: "today" },
    { type: "visit", key: "visitToday", label: "拜访", sourceClass: "source-visit", sourceLabel: "拜访跟进", cardClass: "", statusClass: "neutral", status: "今日待办", formula: "流失减量 17:00 · 常规按计划时间", foot: "两类拜访分别判断时效", action: "去反馈", urgency: "需今日处理", focusTone: "danger", statusMode: "today", segments: [{ key: "visitLossToday", label: "流失减量" }, { key: "visitRegularToday", label: "常规拜访" }] },
    { type: "warehouse", key: "warehouseTask", label: "搬仓", sourceClass: "source-routine", sourceLabel: "常规任务", cardClass: "routine-alert", statusClass: "neutral", status: "今日待办", formula: "任务接收后 7 天内", foot: "仅统计未完成任务", action: "查看任务", urgency: "需今日处理", focusTone: "warning", statusMode: "deadline" },
    { type: "tc-exception", key: "tcExceptionToday", label: "TC 入库异常", sourceClass: "source-routine", sourceLabel: "常规任务", cardClass: "warning", statusClass: "warning", status: "异常待清", formula: "创建后 7 天内", foot: "完成后实时剔除", action: "去处理", urgency: "需今日处理", focusTone: "warning", statusMode: "deadline" },
    { type: "blocked", key: "blockedTask", label: "异常卡单", sourceClass: "source-routine", sourceLabel: "常规任务", cardClass: "warning", statusClass: "warning", status: "异常待清", formula: "创建后 1 天内", foot: "关闭后实时剔除", action: "查看进度", urgency: "需今日处理", focusTone: "warning" },
    { type: "accident", key: "accidentWarningToday", label: "一级事故预警", sourceClass: "source-routine", sourceLabel: "体验预警", cardClass: "overdue", statusClass: "high-risk", status: "高优先级", formula: "系统推送后 48 小时内", foot: "闭环后实时剔除", action: "去跟进", urgency: "需立即处理", focusTone: "danger", statusMode: "today" }
  ],
  overdue: [
    { type: "handover", key: "handoverOvertime", label: "交接", sourceClass: "source-customer", sourceLabel: "客户管理", cardClass: "overdue", statusClass: "overdue", status: "已超时", formula: "交接时长 > 90 天", foot: "永久保留至闭环", action: "查看明细", urgency: "需立即处理", focusTone: "danger" },
    { type: "renew", key: "renewOvertime", label: "续签", sourceClass: "source-customer", sourceLabel: "客户管理", cardClass: "overdue renew-overdue", statusClass: "orange-red", status: "已超时", formula: "已过期且过期天数 ≤ 60", foot: "超过 60 天不计入", action: "立即跟进", urgency: "需立即处理", focusTone: "danger" },
    { type: "visit", key: "visitOvertime", label: "拜访", sourceClass: "source-visit", sourceLabel: "拜访跟进", cardClass: "overdue", statusClass: "overdue", status: "已超时", formula: "超过 17:00 / 计划拜访时间", foot: "已完成、已作废任务剔除", action: "立即处理", urgency: "需立即处理", focusTone: "danger", segments: [{ key: "visitLossOvertime", label: "流失减量" }, { key: "visitRegularOvertime", label: "常规拜访" }] },
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
    const total = taskViews.today.reduce(function (sum, config) {
      return sum + alertDetails[config.key].count;
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
  const cardClasses = ["stage-card", config.sourceClass, config.cardClass, config.segments ? "has-segments" : "", isActive ? "active" : ""].filter(Boolean).join(" ");
  const segmentMarkup = config.segments ? '<div class="stage-breakdown" aria-label="拜访类型拆分">' + config.segments.map(function (segment) {
    const segmentDetail = alertDetails[segment.key];
    return '<span><i>' + escapeHtml(segment.label) + '</i><b>' + segmentDetail.count + '</b></span>';
  }).join("") + '</div>' : "";
  return '<article class="' + cardClasses + '" data-key="' + escapeHtml(config.key) + '" data-type="' + escapeHtml(config.type) + '" tabindex="0" role="option" aria-selected="' + (isActive ? "true" : "false") + '">' +
    '<div class="stage-ribbon">' + escapeHtml(config.label) + '</div>' +
    '<span class="metric-status ' + escapeHtml(config.statusClass) + '">' + escapeHtml(config.status) + '</span>' +
    '<div class="stage-metric"><span>' + escapeHtml(detail.title) + ' <svg><use href="#i-info"></use></svg></span><strong class="metric-count">' + detail.count + '</strong></div>' +
    '<p class="metric-formula">' + escapeHtml(config.formula) + '</p>' +
    segmentMarkup +
    '<div class="metric-card-foot"><span class="metric-source"><i></i>' + escapeHtml(config.sourceLabel) + '<em>·</em>' + escapeHtml(config.foot) + '</span><button class="open-detail" type="button">' + escapeHtml(config.action) + '</button></div>' +
    '</article>';
}

function renderVisitFocus(config, selectedKey) {
  const aggregateDetail = alertDetails[config.key];
  const activeKey = selectedKey || activeVisitSegments[config.key] || config.key;
  const selectedDetail = alertDetails[activeKey] || aggregateDetail;
  activeVisitSegments[config.key] = activeKey;
  activeFocusKey = activeKey;

  renderFocusPanel(activeKey, { title: focusTitle, rule: focusRule, list: focusList, allButton: focusAllButton }, {
    detail: selectedDetail,
    urgency: config.urgency,
    tone: config.focusTone,
    statusMode: config.statusMode || "",
    prefix: function (item) { return item.visitKind || "拜访"; },
    itemKey: function (item) { return item.detailKey || activeKey; }
  });

  const segmentButtons = [{ key: config.key, label: "全部", count: aggregateDetail.count }].concat(config.segments.map(function (segment) {
    return { key: segment.key, label: segment.label, count: alertDetails[segment.key].count };
  }));
  focusList.insertAdjacentHTML("afterbegin", '<div class="focus-segments" role="tablist" aria-label="拜访类型筛选">' + segmentButtons.map(function (segment) {
    return '<button class="' + (segment.key === activeKey ? "active" : "") + '" type="button" role="tab" aria-selected="' + (segment.key === activeKey ? "true" : "false") + '" data-visit-segment="' + escapeHtml(segment.key) + '"><span>' + escapeHtml(segment.label) + '</span><b>' + segment.count + '</b></button>';
  }).join("") + '</div>');

  focusList.querySelectorAll("[data-visit-segment]").forEach(function (button) {
    button.addEventListener("click", function () { renderVisitFocus(config, button.dataset.visitSegment); });
  });
}

function renderTaskFocus(config) {
  taskBoard.classList.remove("active-source-customer", "active-source-visit", "active-source-routine");
  taskBoard.classList.add("active-" + config.sourceClass);
  if (config.segments) {
    renderVisitFocus(config, config.key);
    return;
  }
  activeFocusKey = config.key;
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

  taskCardStrip.classList.remove("card-count-1", "card-count-2", "card-count-4", "card-count-7");
  taskCardStrip.classList.add("card-count-" + configs.length);
  taskCardStrip.innerHTML = configs.map(function (config) {
    return buildStageCardMarkup(config, config.key === selected.key);
  }).join("");

  bindTaskCardEvents(configs);
  renderTaskFocus(selected);
  requestAnimationFrame(function () {
    const selectedCard = taskCardStrip.querySelector('[data-key="' + selected.key + '"]');
    if (!selectedCard || taskCardStrip.scrollWidth <= taskCardStrip.clientWidth) return;
    taskCardStrip.scrollLeft = Math.max(0, selectedCard.offsetLeft - (taskCardStrip.clientWidth - selectedCard.offsetWidth) / 2);
  });
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
    const itemTitle = item.visitKind ? "【" + item.visitKind + "】" + item.title : item.title;
    return '<article class="drawer-item"><div class="drawer-item-head"><strong>' + escapeHtml(itemTitle) + '</strong><em class="' + toneClass + '">' + escapeHtml(item.tag) + '</em></div><p>' + escapeHtml(item.description) + '</p>' + renderItemFields(item.fields) + '<div class="drawer-item-meta"><span><svg><use href="#i-clock"></use></svg>' + escapeHtml(item.time) + '</span>' + action + '</div></article>';
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
  const emptyKeys = emptyDemoKey === "visitToday"
    ? ["visitLossToday", "visitRegularToday"]
    : (emptyDemoKey === "visitOvertime" ? ["visitLossOvertime", "visitRegularOvertime"] : [emptyDemoKey]);
  emptyKeys.forEach(function (key) {
    alertDetails[key].count = 0;
    alertDetails[key].items = [];
    alertDetails[key].deadline = "暂无";
  });
  if (emptyKeys.some(function (key) { return key.indexOf("visit") === 0; })) syncVisitAggregates();
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
  const now = new Date();
  const date = now.toLocaleDateString("zh-CN", { year: "numeric", month: "2-digit", day: "2-digit" }).replaceAll("/", "-");
  const time = now.toLocaleTimeString("zh-CN", { hour: "2-digit", minute: "2-digit", hour12: false });
  document.getElementById("updateTime").textContent = date + " " + time;
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
