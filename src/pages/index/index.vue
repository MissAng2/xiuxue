<template>
    <div>
        <div class="btn">
            <mt-button class="anniu" type="primary" size="large" @click="goSQ()">休学申请</mt-button>
            <mt-button class="anniu" type="primary" size="large" @click="goSH()">休学审核</mt-button>
        </div>
    </div>
</template>
<style scoped>
.anniu {
    margin-bottom: 50px;
}
.btn {
    margin: 100px auto;
    width: 75%;
}
</style>
<script type="text/javascript">
    export default {
        data(){
            return {
                page: 'about'
            }
        },
        methods:{
            goSQ(){
                this.$router.push('/SQ');
            },
            goSH(){
                this.$router.push('/SH');
            }
        }
    }
</script>
