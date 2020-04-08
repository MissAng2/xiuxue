<template>
    <div class="XXSQ">
        <div class="page-loadmore-wrapper" id="s" ref="wrapper" :style="{ height: wrapperHeight + 'px'}">
            <mt-loadmore :bottom-method="loadBottom" :top-method="loadTop" @bottom-status-change="handleBottomChange" :bottom-all-loaded="allLoaded" ref="loadmore" :autoFill="false">
                <div class="item_wrap">
                    <div class="list" @click="godetail(item.WID,item.TASKID,item.SHZT)" v-for="(item,index) in datalist" :key="index">
                        <p>
                            {{item.XM}}&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{{item.SQSJ}}&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                            <span class="zt">{{item.SHZT_DISPLAY}}</span>
                        </p>
                        <p>休学学年：{{item.XXXN_DISPLAY}}</p>
                        <p>休学学期：{{item.XXXQ_DISPLAY}}</p>
                        <p>休学原因：{{item.XXYY_DISPLAY}}</p>
                        <p>邮寄地址：{{item.YJDZ}}</p>
                    </div>
                </div>
                <div slot="bottom" class="mint-loadmore-bottom">
                    <span v-show="bottomStatus !== 'loading'" :class="{ 'is-rotate': bottomStatus === 'drop' }">↑</span>
                    <span v-show="bottomStatus === 'loading'">
                        <mt-spinner type="snake"></mt-spinner>
                    </span>
                </div>
            </mt-loadmore>
        </div>
        <mt-fixed-button position="bottom-right" @click="add()">+</mt-fixed-button>
    </div>
</template>

<script>
import { Get, Post } from "../../utils";
import api from "../../api";
export default {
    data(){
        return{
            pageNum: 1,
            datalist: [],
            allLoaded: false,
            bottomStatus: "",
            wrapperHeight: 0,
            dispatchid: ""
        }
    },
    created(){
        this.getdata();
    },
    methods:{
        getdata(){
            Get(api.queryUserTasks,{
                taskType: "ALL_TASK",
                nodeId: "usertask1,usertask5",
                appName: "pubdzxxsqapp",
                module: "modules",
                page: "sq",
                action: "queryApplyListModel",
                pageSize: 10,
                pageNumber: this.pageNum
            }).then(res=>{
                let data=res.datas.queryUserTasks.rows;
                // console.log(data);
                if (!data.length || data.length < 10) {
                    this.allLoaded = true;
                }
                if (data.length) {
                    data.forEach(item => {
                        this.datalist.push(item);
                    });
                }
            })
        },
        add(){
            this.$router.push({
                path: '/add'
            })
        },
        loadTop() {
            this.pageNum = 1;
            this.datalist = [];
            this.getdata();
            this.$refs.loadmore.onTopLoaded();
        },
        loadBottom() {
            setTimeout(() => {
                this.pageNum++;
                this.getdata();
                this.$refs.loadmore.onBottomLoaded();
            }, 1000);
        },
        handleBottomChange(status) {
            this.bottomStatus = status;
        },
        // 详情
        godetail(WID, TASKID, SHZT) {
            // console.log(WID)
            //  console.log(TASKID)
            //   console.log(SHZT)
            if (SHZT == "draft") {
                this.$router.push({
                    path: "/draft",
                    query: {
                        WID: WID,
                        TASKID: TASKID
                    }
                });
            } else {
                this.$router.push({
                    path: "/sqdetail",
                    query: {
                        WID: WID,
                        TASKID: TASKID
                    }
                });
            }
        },
    }
}
</script>

<style scoped>
    .list {
        font-size: 14px;
        border-bottom: 1px dashed #bfbfbf;
        margin: 5px 0px 10px 0px;
        padding-bottom: 10px;
        background: #fff;
        position: relative;
    }
    .list > p {
        margin-top: 10px;
        margin-left: 10px;
        margin-right: 10px;
    }
    .zt {
    position: absolute;
    right: 10px;
    top: 2px;
    display: inline-block;
    width: 90px;
    overflow: hidden; /*超出部分隐藏*/
    white-space: nowrap; /*不换行*/
    text-overflow: ellipsis; /*超出部分文字以...显示*/
    text-align: right;
}
</style>