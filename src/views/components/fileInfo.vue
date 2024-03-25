<template>
    <div class="info-container">
        <div class="title">{{ name }}</div>
        <!-- <el-divider></el-divider> -->
        <div class="info-detail">
            <span>{{content}}</span>
            <i :class="className"></i>
            <!-- <SvgIcon v-bind="this.$attrs"></SvgIcon> -->
        </div>
    </div>
</template>
<script>
import SvgIcon from '@/components/SvgIcon/index.vue'

export default{

    data(){
        return{
            
        }
    },
    props:{
        name:{
            type:String,
            default:'未知'
        },
        content:{
            type:String,
            default:'未知'
        },
        icon:{
            type:String,
            default:''
        },
        load:{
            type:Boolean,
            default:false
        },
        className:{
            type:String,
            default:'el-icon-s-order'
        }
    },
    components:{
        SvgIcon
    },
    mounted(){
        // console.log(this.$attrs,this.content)
    },
}

</script>

<style scoped>
    .info-container{
        border-radius: 5px;
        background-color: white;
        height: 100%;
        box-shadow: rgba(99, 99, 99, 0.2) 0px 2px 8px 0px;
        padding-top: 20px;
    }
    .title{
        margin-left: 20px;
        font-weight: bold;
    }

    .info-detail{
        width: 85%;
        margin: 10px auto;
        padding-top: 20px;
        display: flex;
        border-top: 1px solid rgb(240, 240, 240);
        justify-content: space-between;
        align-items: center;
    }

    i,span{
        font-size: 25px;
    }
</style>