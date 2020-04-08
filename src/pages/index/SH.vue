<template>
    <div class="xxsh">
        <div class="page-loadmore-wrapper" id="s" ref="wrapper" :style="{ height: wrapperHeight + 'px'}">
            <mt-loadmore :bottom-method="loadBottom" :top-method="loadTop" @bottom-status-change="handleBottomChange" :bottom-all-loaded="allLoaded" ref="loadmore" :autoFill="false">
                <div class="item_wrap">
                    <div v-show="this.datalist.length==0" class="empty-page">
                        <img src="../../../static/assets/nonebody.jpg" />
                        <span>暂无需要审核数据哦</span>
                    </div>
                    <div class="list" @click="godetail(item.WID,item.TASKID)" v-for="(item,index) in datalist" :key="index">
                        <p>
                            {{item.XM}}&nbsp;&nbsp;&nbsp;&nbsp;{{item.SQSJ}}&nbsp;&nbsp;&nbsp;&nbsp;
                            <span class="zt" v-if="item.SHZT=='termination'" style="color:red">{{item.SHZT_DISPLAY}}</span>
                            <span class="zt" v-else-if="item.SHZT=='end'" style="color:#52C7CA">{{item.SHZT_DISPLAY}}</span>
                            <span class="zt" v-else-if="item.SHZT=='draft'">{{item.SHZT_DISPLAY}}</span>
                            <span class="zt" v-else style="color:#ffc107">{{item.SHZT_DISPLAY}}</span>
                        </p>
                        <p>休学学年/学期：{{item.XXXN_DISPLAY}}/{{item.XXXQ_DISPLAY}}</p>
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
    </div>
</template>

<script>
import { Get, Post } from "../../utils";
import api from "../../api";
export default {
    data() {
        return {
            pageNum: 1,
            datalist: [],
            allLoaded: false,
            bottomStatus: "",
            wrapperHeight: 0,
            dispatchid: ""
        };
    },
    created(){
        this.getdata();
    },
    methods:{
        getdata() {
            Get(api.queryUserTasks, {
                taskType: "NOTEND",
                nodeId:
                    "usertask2,usertask3,usertask4,usertask6,usertask7,usertask8,usertask9,usertask10,usertask11,usertask12",
                appName: "pubdzxxsqapp",
                module: "modules",
                page: "sh",
                action: "queryAuditListModel",
                pageSize: 10,
                pageNumber: this.pageNum
            }).then(res => {
                let data = res.datas.queryUserTasks.rows;
                if (!data.length || data.length < 10) {
                    this.allLoaded = true;
                }
                if (data.length) {
                    data.forEach(item => {
                        this.datalist.push(item);
                    });
                }
            });
        },
        handleBottomChange(status) {
            this.bottomStatus = status;
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
        godetail(WID, TASKID) {
            this.$router.push({
                path: "/shdetail",
                query: {
                    WID: WID,
                    TASKID: TASKID
                }
            });
        }
    }
}
</script>

<style scoped>
    .mint-spinner {
        display: inline-block;
        vertical-align: middle;
    }
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
    .empty-page {
        min-height: 80vh;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
    }
    .empty-page > img {
        width: 200px;
    }
    .empty-page > span {
        margin-top: 20px;
    }
</style>