<template>
    <div>
        <mt-cell-group>
            <mt-field label="姓名" placeholder v-model="userobj.XM" readonly></mt-field>
            <mt-field label="学号" placeholder v-model="userobj.XH" readonly></mt-field>
            <mt-field label="班级名称" placeholder v-model="userobj.BJMC" readonly></mt-field>
            <mt-field label="学院名称" placeholder v-model="userobj.DWMC" readonly></mt-field>
            <mt-cell title="休学学年" :required="true" is-link v-model="XXXNType" @click.native="XXXN()"></mt-cell>
            <mt-cell title="休学学期" :required="true" is-link v-model="XXXQType" @click.native="XXXQ()"></mt-cell>
            <mt-field label="本人电话" placeholder="请输入本人电话" v-model="BRDH" required></mt-field>
            <mt-field label="父母姓名" placeholder="请输入父母姓名" v-model="FMXM" required></mt-field>
            <mt-field label="父母电话" placeholder="请输入父母电话" v-model="FMDH" required></mt-field>
            <mt-cell title="休学原因" :required="true" is-link v-model="XXYYType" @click.native="XXYY()"></mt-cell>
            <mt-field label="邮寄地址" placeholder v-model="YJDZ" type="textarea" rows="4" required></mt-field>
            <div>
                <div class="fj">
                    上传附件：
                </div>
                <emapm-upload-imgs :host="host" :host-pathname="hostPathname" :read-only="false" :token="token" :size="1000000" :max-number="5" @on-token-change="onTokenChange"></emapm-upload-imgs>
            </div>
        </mt-cell-group>

        <!-- 保存草稿 提交 -->
        <div class="bottomBtn">
            <mt-button type="default" size="large" @click="Savedrafts(zt1)">保存草稿</mt-button>
            <mt-button class="anniu" type="primary" size="large" @click="Savedrafts(zt2)">提交</mt-button>
        </div>

        <!-- 下侧弹出休学学年popup -->
        <mt-popup v-model="showpopupXXXN" position="bottom">
            <mt-picker :columns="XXXNList" showToolbar @confirm="QDXXXN" @cancel="QXXXXN" />
        </mt-popup>

        <!-- 下侧弹出休学学期popup -->
        <mt-popup v-model="showpopupXXXQ" position="bottom">
            <mt-picker :columns="XXXQList" showToolbar @confirm="QDXXXQ" @cancel="QXXXXQ" />
        </mt-popup>

        <!-- 下侧弹出休学原因popup -->
        <mt-popup v-model="showpopupXXYY" position="bottom">
            <mt-picker :columns="XXYYList" showToolbar @confirm="QDXXYY" @cancel="QXXXYY" />
        </mt-popup>
    </div>
</template>

<script>
import { Toast } from "bh-mint-ui2";
import { Get, Post } from "../../utils";
import api from "../../api";
// 导入moment.js
import moment from 'moment'
export default {
    data(){
        return {
            userobj: {},

            // 休学学年
            XXXNType: '',
            showpopupXXXN: false,
            XXXNList: [],
            XXXNId: '',

            // 休学学期
            XXXQType: '',
            showpopupXXXQ: false,
            XXXQList: [],
            XXXQId: '',

            // 本人电话、父母姓名、父母电话
            BRDH: '',
            FMXM: '',
            FMDH: '',

            // 休学原因
            XXYYType: '',
            showpopupXXYY: false,
            XXYYList: [],
            XXYYId: '',

            // 邮寄地址
            YJDZ: '',

            // 上传附件
            token: '',
            host: location.origin,
            // 图片显示域名
            hostPathname: location.origin+location.pathname.substring(0,location.pathname.indexOf("/",1)),

            // 按钮
            zt1: '保存草稿',
            zt2: '提交',
            commandType: '',
            execute: '',
            id: ''
        }
    },
    created(){
        // 获取当前申请人基本信息
        Get(api.getCurrentStudentInfo,{}).then(res=>{
            // console.log(res.data);
            this.userobj=res.data;
        })
    },
    methods:{
        // 休学学年
        XXXN(){
            this.showpopupXXXN=true;
            // 查询字典接口
            Get(api.getDic,{
                type: "XN"
            }).then(res=>{
                // console.log(res.datas.code.rows);
                if(this.XXXNList!=''){
                    return;
                }else{
                    res.datas.code.rows.forEach((value,index)=>{
                        this.XXXNList.push({
                            text: value.name,
                            stepid: value.id
                        })
                    })
                    // console.log(this.XXXNList);
                }
            })
        },
        QDXXXN(value,index){
            this.XXXNType=value.text;
            this.XXXNId=value.stepid;
            this.showpopupXXXN=false;
        },
        QXXXXN(){
            this.showpopupXXXN=false;
        },

        // 休学学期
        XXXQ(){
            this.showpopupXXXQ=true;
            // 查询字典接口
            Get(api.getDic,{
                type: "XQ"
            }).then(res=>{
                // console.log(res.datas.code.rows);
                if(this.XXXQList!=''){
                    return;
                }else{
                    res.datas.code.rows.forEach((value,index)=>{
                        this.XXXQList.push({
                            text: value.name,
                            stepid: value.id
                        })
                    })
                }
            })
        },
        QDXXXQ(value,index){
            this.XXXQType=value.text;
            this.XXXQId=value.stepid;
            this.showpopupXXXQ=false;
        },
        QXXXXQ(){
            this.showpopupXXXQ=false;
        },

        // 休学原因
        XXYY(){
            this.showpopupXXYY=true;
            // 查询字典接口
            Get(api.getDic,{
                type: "XXYY"
            }).then(res=>{
                // console.log(res.datas.code.rows);
                if(this.XXYYList!=''){
                    return;
                }else{
                    res.datas.code.rows.forEach((value,index)=>{
                        this.XXYYList.push({
                            text: value.name,
                            stepid: value.id
                        })
                    })
                }
            })
        },
        QDXXYY(value,index){
            this.XXYYType=value.text;
            this.XXYYId=value.stepid;
            this.showpopupXXYY=false;
        },
        QXXXYY(){
            this.showpopupXXYY=false;
        },

        // 上传附件内token值发生变化时触发
        onTokenChange(val){
            this.token=val;
            // console.log(this.token);
        },

        // 保存草稿
        Savedrafts(i){
            // 为空的校验提醒
            if (this.XXXNType == "") {
                Toast("休学学年不可为空！");
                return;
            }
            if (this.XXXQType == "") {
                Toast("休学学期不可为空！");
                return;
            }
            if (this.BRDH == "") {
                Toast("本人电话不可为空");
                return;
            }
            if (this.FMXM == "") {
                Toast("父母姓名");
                return;
            }
            if (this.FMDH == "") {
                Toast("父母电话");
                return;
            }
            if (this.XXYYType == "") {
                Toast("休学原因不可为空！");
                return;
            }
            if (this.YJDZ == "") {
                Toast("邮寄地址不可为空！");
                return;
            }
            // 存储数据 对应保存草稿接口的字段
            let newobj={
                WID: '',
                CZZ: '',
                CZZXM: '',
                CZRQ: '',
                XM: this.userobj.XM,
                XH: this.userobj.XH,
                XYDM: this.userobj.DWDM,
                XY: this.userobj.DWMC,
                BJDM: this.userobj.BH,
                BJ: this.userobj.BJMC,
                XXXN_DISPLAY: this.XXXNType,
                XXXN: this.XXXNId,
                XXXQ_DISPLAY: this.XXXQType,
                XXXQ: this.XXXQId,
                BRDH: this.BRDH,
                FMXM: this.FMXM,
                FMDH: this.FMDH,
                XXYY_DISPLAY: this.XXYYType,
                XXYY: this.XXYYId,
                SQSJ: moment().format("YYYY-MM-DD HH:mm:ss"),
                YJDZ: this.YJDZ,
                FJSC: this.token
            };
            if(i=="提交"){
                this.commandType="start";
                this.execute="do_start";
                this.id="start";
            }else{
                this.commandType="draft";
                this.execute="do_draft";
                this.id="draft";
            }
            // 保存草稿接口
            Get(api.startFlow,{
                formData: newobj,
                id: this.id,
                commandType: this.commandType,
                execute: this.execute,
                name: i,
                action: "model:DZ_T_XFTXSQ_XXSQ.SAVE",
                commandEvent:
                    "com.wisedu.emap.pubdzxxsqapp.service.BtnClickEventListener",
                url: "/sys/emapflow/tasks/startFlow.do",
                disabled: true,
                taskId: "",
                defKey: "pubdzxxsqapp.xxFlow"
            }).then(res=>{
                if (res.succeed == true) {
                    Toast(i + "成功!");
                    history.back(-1);
                } else {
                    Toast(i + "失败!");
                }
            })
        }
    }
}
</script>

<style scoped>
    .fj{
        padding: 12px 0;
    }
    .bottomBtn{
        position: relative;
        margin-top: 10px;
    }
    .mint-button--large {
        width: 50%;
    }
    .anniu {
        position: absolute;
        right: 0;
        top: 0;
    }
</style>