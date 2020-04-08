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
                    <mt-field label="编号" v-model="detail.BH" readonly></mt-field>
                    <mt-field label="院部确认学生成绩" v-model="detail.XSCJ_DISPLAY" readonly></mt-field>
                    <mt-field label="学籍卡是否打印留存" v-model="detail.XJK_DISPLAY" readonly></mt-field>
                    <mt-field label="备注" v-model="detail.BZ" readonly type="textarea" rows="4"></mt-field>
                </mt-cell-group>
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
            host: "WEBPACK_CONFIG_HOST",
            fjobj: [],
            fileToken:'',
            lc:[],
            status: '',
            arr:[],
        }
    },
    created(){
        this.getdetail();
        this.getFJ();
        this.getLC();
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
                    this.fileToken=res.fileToken;
                })
            })
        },

        // 获取流程信息
        getLC(){
            Get(api.queryFlowState,{
                taskId: this.$route.query.TASKID,
                responseType: "JSON"
            }).then(res=>{
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
    }
}
</script>

<style scoped>
    .list1 {
        margin: 12px;
    }
</style>