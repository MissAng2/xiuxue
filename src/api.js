/**
 * WEBPACK_CONIFG_HOST的值，在webpack.config.js中更改
 * 开发环境时 = "http://amptest.wisedu.com/xsfwfw/"
 * 发布环境时 = location.origin + location.pathname.substring(0, location.pathname.indexOf("/", 1)) + "/"
 */

export default {
    getWechatSign: 'http://res.wisedu.com:9090/checkSign',

    queryUserTasks: WEBPACK_CONFIG_HOST + '/sys/emapflow/*default/index/queryUserTasks.do',//列表
    queryDetailFormModel: WEBPACK_CONFIG_HOST + '/sys/pubdzxxsqapp/modules/common/queryDetailFormModel.do',//详情
    queryDetailFjModel: WEBPACK_CONFIG_HOST + '/sys/pubdzxxsqapp/modules/common/queryDetailFjModel.do',//附件
    queryFlowState: WEBPACK_CONFIG_HOST + '/sys/emapflow/tasks/queryFlowState.do',//流程
    getCurrentStudentInfo: WEBPACK_CONFIG_HOST + '/sys/pubdzxxsqapp/api/getCurrentStudentInfo.do',//个人信息
    getDic: WEBPACK_CONFIG_HOST + '/sys/pubdzxxsqapp/api/getDic.do',//查询字典接口
    startFlow: WEBPACK_CONFIG_HOST + '/sys/emapflow/tasks/startFlow.do',//保存 草稿/提交
    execute: WEBPACK_CONFIG_HOST + '/sys/emapflow/tasks/execute.do',//草稿状态后的提交
    terminateInstance: WEBPACK_CONFIG_HOST + '/sys/emapflow/tasks/terminateInstance.do',//不通过
}
