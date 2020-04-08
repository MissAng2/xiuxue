<template>
    <div>
        <mt-navbar v-model="selected">
            <mt-tab-item id="1" componentname="navber">申请信息</mt-tab-item>
            <mt-tab-item id="2" componentname="navber">附件列表</mt-tab-item>
            <mt-tab-item id="3" componentname="navber">流程信息</mt-tab-item>
        </mt-navbar>
        <mt-tab-container v-model="selected">
            <mt-tab-container-item id="1">
                <mt-cell-group>
                    <mt-field label="姓名" v-model="detail.XM" readonly></mt-field>
                    <mt-field label="学号" v-model="detail.XH" readonly></mt-field>
                    <mt-field label="学院名称" v-model="detail.XY" readonly></mt-field>
                    <mt-field label="班级名称" v-model="detail.BJ" readonly></mt-field>
                    <mt-field label="休学学年" v-model="detail.XXXN_DISPLAY" readonly></mt-field>
                    <mt-field label="休学学期" v-model="detail.XXXQ_DISPLAY" readonly></mt-field>
                    <mt-field label="本人电话" v-model="detail.BRDH" readonly></mt-field>
                    <mt-field label="父母姓名" v-model="detail.FMXM" readonly></mt-field>
                    <mt-field label="父母电话" v-model="detail.FMDH" readonly></mt-field>
                    <mt-field label="休学原因" v-model="detail.XXYY_DISPLAY" readonly></mt-field>
                    <mt-field label="申请时间" v-model="detail.SQSJ" readonly></mt-field>
                    <mt-field label="邮寄地址" v-model="detail.YJDZ" readonly></mt-field>
                </mt-cell-group>
                
                <div class="tittle">
                    <span style="color:red">*</span>&nbsp;院部确认学生成绩
                </div>
                <mt-box-group v-model="value">
                    <mt-cell-group>
                        <mt-radiobox :name="item.value" v-for="item in options" :key="item.value" :disabled="item.disabled" @radiobox-click="blank" required>{{item.label}}</mt-radiobox>
                    </mt-cell-group>
                </mt-box-group>

                <div class="tittle">
                    <span style="color:red">*</span>&nbsp;学籍卡是否打印留存
                </div>
                <mt-box-group v-model="value1">
                    <mt-cell-group>
                        <mt-radiobox :name="item.value" v-for="item in options1" :key="item.value" :disabled="item.disabled" @radiobox-click="blank1" required>{{item.label}}</mt-radiobox>
                    </mt-cell-group>
                </mt-box-group>

                <mt-cell-group>
                    <mt-field label="备注" v-model="BZ" placeholder="请填写" type="textarea" rows="4"></mt-field>
                    <mt-field label="审核意见" v-model="SHYJ" placeholder="请填写" required type="textarea" rows="4"></mt-field>
                    <div class="bh-clearfix cell">
                        <div class="fj">审核附件：</div>
                        <emapm-upload-imgs :host="host" :host-pathname="hostPathname" :read-only="false" :token="token" :size="1000000" :max-number="5" @on-token-change="onTokenChange"
                        ></emapm-upload-imgs>
                    </div>
                </mt-cell-group>

                <div style="height:50px;"></div>
                <div style="position: relative;">
                    <mt-button type="default" class="anniu1" size="large" @click="shjg(zt1)">不通过</mt-button>
                    <mt-button class="anniu" type="primary" size="large" @click="shjg(zt2)">通过</mt-button>
                </div>
            </mt-tab-container-item>
            <mt-tab-container-item id="2">
                <p style="text-align:center;margin-top:50px;" v-if="this.fileToken=='null'">暂无附件查看</p>
                <div v-else class="list1" @click="downfujian(item)" v-for="(item,index) in fjobj" :key="index">
                    <span style="font-size:14px;display: inline-block;margin-top:2px;width:70%">附件名称：{{item.name}}</span>
                    <span style="color:#52C7CA;font-size:12px;">点击下载查看</span>
                </div>
            </mt-tab-container-item>
            <mt-tab-container-item id="3">
                <p style="text-align:center;margin-top:50px;" v-if="lc=='null'">暂无流程</p>
                <mt-steps direction="vertical" title="审核流程">
                    <!-- <mt-step v-for="(i,index) in lc" :key="index" :status=" i.type=='终止' ? 'finish' : ( i.type=='完成' ? 'process' : ( index==0 ? 'finish' : '' ) )"> -->
                        <mt-step v-for="(i,index) in lc" :key="index" :status=" i.type=='终止'||i.type=='完成' ? 'finish' : ( index==0 ? 'finish' : '' )">
                         {{i.name}}
                    </mt-step>
                </mt-steps>
            </mt-tab-container-item>
        </mt-tab-container>
    </div>
</template>

<script>
import { Toast } from "bh-mint-ui2";
import { Get, Post } from "../../utils";
import api from "../../api";

export default {
    data(){
        return {
            detail: {},
            selected: "1",

            // 院部确认学生成绩
            value: '',
            options:[],
            id1: '',

            // 学籍卡是否留存
            value1: '',
            options1: [],
            id2: '',

            // 备注
            BZ: '',

            // 审核意见
            SHYJ: '',

            // 审核附件
            token: '',
            host: location.origin,
            hostPathname: location.origin + location.pathname.substring( 0, location.pathname.indexOf("/", 1) ),
            fileToken: "",
            fjobj: [],

            // 审核结果
            zt1: "NO",
            zt2: "YES",

            // 流程
            lc: []
        }
    },
    created(){
        this.getdetail();
        this.getFJ();
        this.getLC();
        // 学生成绩
        Get(api.getDic, {
            type: "SFXSCJ"
        }).then(res => {
            res.datas.code.rows.forEach((val, index) => {
                this.options.push({
                    label: val.name,
                    value: val.id
                });
            });
        });
        // 学籍卡
        Get(api.getDic, {
            type: "SFXJK"
        }).then(res => {
            res.datas.code.rows.forEach((val, index) => {
                this.options1.push({
                    label: val.name,
                    value: val.id
                });
            });
        });
    },
    methods:{
        // 获取表单详情
        getdetail(){
            // 表单详情接口
            Get(api.queryDetailFormModel,{
                WID: this.$route.query.WID
            }).then(res=>{
                this.detail=res.datas.queryDetailFormModel.rows[0];
                // console.log(this.detail)
            })
        },

        // 获取附件详情
        getFJ(){
            Get(api.queryDetailFjModel,{
                WID: this.$route.query.WID
            }).then(res=>{
                var url = WEBPACK_CONFIG_HOST + "/sys/emapcomponent/file/getUploadedAttachment/" + res.datas.queryDetailFjModel.rows[0].FJSC + ".do";
                // console.log(url);
                Get(url,{}).then(res=>{
                    // console.log(res);
                    this.fjobj=res.items;
                    this.fileToken = res.fileToken;
                })
            })
        },

        // 获取流程信息
        getLC(){
            Get(api.queryFlowState,{
                taskId: this.$route.query.TASKID,
                responseType: "JSON"
            }).then(res=>{
                // console.log(res);
                this.lc=res;
            })
        },

        // 下载附件
        downfujian(item){
            if(BH_MIXIN_SDK.bh && BH_MIXIN_SDK.bh.file && BH_MIXIN_SDK.bh.file.filePreview){
                BH_MIXIN_SDK.bh.file.filePreview(
                    encodeURI(item.fileUrl),
                    item.name.split("."[1]),
                    item.name
                );
            }else{
                window.location.href="http://amptest.wisedu.com"+item.fileUrl;
            }
        },

        onTokenChange(val) {
            //监听上传组件内token的变化
            this.token = val;
            // console.log(this.token);
        },

        blank(e, val) {
            (this.id = val);
        },
        blank1(e, val) {
            (this.id1 = val);
        },

        // 审核结果
        shjg(i) {
            if (this.value == "") {
                Toast("请确认学生成绩");
                return;
            }
            if (this.value1 == "") {
                Toast("请选择学籍卡是否打印留存");
                return;
            }
            if (this.SHYJ == "") {
                Toast("请填写审核意见");
                return;
            }
            let newobj = {
                WID: this.detail.WID,
                CZZ: this.detail.CZZ,
                CZZXM: this.detail.CZZXM,
                CZRQ: this.detail.CZRQ,
                XM: this.detail.XM,
                XH: this.detail.XH,
                XYDM: this.detail.DWDM,
                XY: this.detail.DWMC,
                BJDM: this.detail.BH,
                BJ: this.detail.BJMC,
                XXXN_DISPLAY: this.detail.BJMC,
                XXXN: this.detail.BJMC,
                XXXQ_DISPLAY: this.detail.XXXN_DISPLAY,
                XXXQ: this.detail.XXXQ,
                BRDH: this.detail.BRDH,
                FMXM: this.detail.FMXM,
                FMDH: this.detail.FMDH,
                XXYY_DISPLAY: this.detail.XXYY_DISPLAY,
                XXYY: this.detail.XXYY,
                SQSJ: this.detail.SQSJ,
                YJDZ: this.detail.YJDZ,
                FJSC: this.fileToken ? this.fileToken : "",
                XSCJ_DISPLAY: this.value,
                XSCJ: this.id,
                XJK_DISPLAY: this.value1,
                XJK: this.id1,
                BZ: this.BZ,
                BH: this.detail.BH,
                FJ: this.token,
                SHYJ: this.SHYJ
            };
            if (i == "YES") {
                Get(api.execute, {
                    formData: newobj,
                    id: "submit",
                    commandType: "submit",
                    execute: "do_submit",
                    name: "通过",
                    action: "model:DZ_T_XFTXSQ_XXSQ.SAVE",
                    commandEvent:
                        "com.wisedu.emap.pubdzxxsqapp.service.BtnClickEventListener",
                    url: "/sys/emapflow/tasks/execute.do",
                    buttonType: "primary",
                    disabled: true,
                    taskId: this.$route.query.TASKID,
                    defKey: "pubdzxxsqapp.xxFlow",
                    flowComment: this.SHYJ
                }).then(res => {
                    if (res.succeed == true) {
                        Toast("审核通过成功!");
                        history.back(-1);
                    } else {
                        Toast("审核通过失败!");
                    }
                });
            } else if (i == "NO") {
                Get(api.terminateInstance, {
                    formData: newobj,
                    id: "termination",
                    commandType: "termination",
                    execute: "do_termination",
                    name: "否决",
                    action: "model:DZ_T_XFTXSQ_XXSQ.SAVE",
                    commandEvent:
                        "com.wisedu.emap.pubdzxxsqapp.service.BtnClickEventListener",
                    url: "/sys/emapflow/tasks/terminateInstance.do",
                    taskId: this.$route.query.TASKID,
                    defKey: "pubdzxxsqapp.xxFlow",
                    flowComment: this.SHYJ
                }).then(res => {
                    if (res.succeed == true) {
                        Toast("审核不通过成功!");
                        history.back(-1);
                    } else {
                        Toast("审核不通过失败!");
                    }
                });
            } else {
            }
        },
    }
}
</script>

<style scoped>
    .mint-button--large {
        width: 50%;
    }
    .anniu1 {
        position: fixed;
        left: 0;
        bottom: 0;
    }
    .anniu {
        position: fixed;
        right: 0;
        bottom: 0;
    }
    .list > p > span {
        color: #52c7ca;
    }
    .list > p {
        padding: 8px 10px;
        font-size: 14px;
    }
    .list {
        margin: 10px;
        border: 1px solid #b0b0b2;
        border-radius: 5px;
    }
    .tittle {
        background: #fff;
        padding: 10px 12px;
    }
    .list1 {
        margin: 12px;
    }
</style>