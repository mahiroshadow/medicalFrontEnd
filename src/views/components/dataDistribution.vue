<template>
    <el-tabs v-model="activeName" type="card" @tab-click="handleClick">
        <el-tab-pane label="数据分布" name="first">
            <div>
                <span>特征选择：</span><el-select v-model="feature" placeholder="请选择特征">
                    <el-option 
                        v-for="item in option"
                        :label="item.name"
                        :value="item.value">
                    </el-option>
                </el-select>
                <div ref="echartsDom" id="echartsDom">

                </div>
            </div>
        </el-tab-pane>
        <el-tab-pane label="PCA" name="fourth">

        </el-tab-pane>
  </el-tabs>
</template>

<script>
import useCharts from '@/views/components/echarts/chartsUse'
import {lineOption} from '@/views/components/echarts/data/echartsOption.d'


const {chartsInit,setOption }=useCharts()

export default{
    name:'Distribution',
    mounted(){
        this.$nextTick(()=>{
            chartsInit(this.$echarts,this.$refs.echartsDom,lineOption)
        })
    },
    data(){
        return{
            activeName: 'first',
            feature:'',
            option:[
                {name:'feature1',value:'feature1'},
                {name:'feature2',value:'feature2'}
            ]
        }
    },
    props:{
        options:{
            type:Object,
            default:{}
        }
    },
    methods:{
        handleClick(tab, event) {

        }
    }
}


</script>
<style scoped>
#echartsDom{
    margin: 0 auto;
    width: 400px;
    height: 300px;
}


</style>