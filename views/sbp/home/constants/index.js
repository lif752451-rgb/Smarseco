export const URLS = {
  alarm: '/menaceManege/all', // 告警闭环
  loophole: '/vuln/closeloop/all',// 漏洞闭环
  risk: '/riskAssessment/riskClosed/all',// 风险闭环
  asset_modify: '/asset/assist/assetInfo',// 资产变更
}
export const TODO_URLS = Object.assign(URLS, {
  risk_delay: '/riskAssessment/delayManage/apply',// 延期申请
  alarm_whitelist: '/alarm/whitelist/all',// 告警白名单
  loophole_whitelist: '/riskAssessment/whiteList/all'// 漏洞白名单
})

export const DONE_URLS = Object.assign(URLS, {
  risk_delay: '/riskAssessment/delayManage/myAudit',// 延期申请
  alarm_whitelist: '/alarm/whitelist/approve',// 告警白名单
  loophole_whitelist: '/riskAssessment/whiteList/myApprove'// 漏洞白名单
})

export const COMMON_ICON =[
  "asset_panoramic_menu",
  "menace_alarm_menu",
  "asset_assist_menu",
  "overall_situation",
  "asset_assist_menu",
  "knowledage_vuln_info",
  "risk_vlundiscover_menu",
  "risk_delay_menu",
  "visual_content",
  "overall_situation",
  "asset_panoramic_menu",
  "knowledage_vuln_case",
];

export const  COMMON_FONT = ['流程管理','表单管理','节点用户管理','运行日志', '威胁情报-IOC情报库','漏洞库-漏洞修复案例','漏洞订阅-全部订阅'];

export const  COMMON_FONT_ICON =['coo_workflow', 'coo_form', 'coo_node_user', 'admin_operationlog', 'intelligence_vuln_col','knowledage_vuln_case','risk_vlunsubscribe_all'];

