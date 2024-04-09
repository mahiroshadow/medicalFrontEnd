<template>
    <div class="app-container">
        <el-card>
            <el-button type="text" icon="el-icon-arrow-left" @click="backToLastPage">返回</el-button>
            <el-divider />
            <span>整体评估</span>
            <div style="width:100%;margin-top:10px;">
                <span>特征 </span><span style="color:#409EFF;">107列</span>
                <el-divider direction="vertical"></el-divider>
                <span>目标列 </span><span style="">label</span>
                <el-divider direction="vertical"></el-divider>
                <span>算法类型 </span><span style="">多分类</span>
                <el-divider direction="vertical"></el-divider>
            </div>
            <el-divider />
            <div class="evaluate">
                <div>
                    <el-progress type="circle" :percentage="accuracy" :width="60" :stroke-width="4"
                        color="#2468F2"></el-progress>
                    <div>准确率:<span style="color:#409EFF;">{{ accuracy + '%' }}</span></div>
                </div>
                <div>
                    <el-progress type="circle" :percentage="f1" :width="60" :stroke-width="4" color="#2468F2"></el-progress>
                    <div>F1-score:<span style="color:#409EFF;">{{ f1 + '%' }}</span></div>
                </div>
                <div>
                    <el-progress type="circle" :percentage="precision" :width="60" :stroke-width="4"
                        color="#2468F2"></el-progress>
                    <div>精确率:<span style="color:#409EFF;">{{ precision + '%' }}</span></div>
                </div>
                <div>
                    <el-progress type="circle" :percentage="recall" :width="60" :stroke-width="4"
                        color="#2468F2"></el-progress>
                    <div>召回率:<span style="color:#409EFF;">{{ recall + '%' }}</span></div>
                </div>
            </div>
            <el-tooltip class="item" effect="dark" placement="right">
                <div slot="content">
                    混淆矩阵每一列代表了预测类别，每一列的总数表示预测为该类别的数据的数目；每一行代表了数据的真实归属类别，每一行的数据总<br />数表示该类别的数据实例的数目。混淆矩阵对角线上的值表示一个类别被正确预测的概率，对角线上的值约接近于1，说明模型分类效<br />果越好
                </div>
                <span>混淆矩阵</span>
            </el-tooltip>
            <el-table :data="confusionMatrix" border style="width: 70%;margin-top:10px;">
                <el-table-column :resizable="false" class-name="elChgTbeClmn" prop="label"  align="center" width="120">
                    <template slot="header" slot-scope="scope">
                        <div class="elHeadCon">
                            <div class="headerCon1">预测值</div>
                            <div class="headerCon2">真实值</div>
                        </div>
                    </template>
                </el-table-column>
                <el-table-column label="0" prop="col1" align="center">
                </el-table-column>
                <el-table-column label="1" prop="col2" align="center">
                </el-table-column>
            </el-table>
            <div style="margin-top:10px;">特征重要性</div>
            <div ref="feature" style="width: 700px;height: 400px;margin-top: -50px;"></div>
        </el-card>
    </div>
</template>
<script>
import { evalModel } from '@/api/model'
import {otherOption} from '@/views/components/echarts/data/echartsOption.d'
import useCharts from '../components/echarts/chartsUse'

const {chartsInit,setChartsOption }=useCharts()
export default {
    mounted() {
        const {savePth,testPth}=this.$route.params
        this.savePth=savePth
        this.testPth=testPth
        //初始化数据
        this.$nextTick(()=>this.initData())

    },
    data() {
        return {
            savePth:'',
            testPth:'',
            accuracy: 0,
            f1: 0,
            precision: 0,
            recall: 0,
            model: {},
            feature: {},
            confusionMatrix: []
        }
    },
    methods: {
        /**
        *
        * @param
        **/
        initData(){
            const data={
                savePth:this.savePth,
                testPth:this.testPth
            }
            evalModel(data).then(res=>{
                const{acc_score,f1_score,recall_score,precision,feature_importances,confusion_matrix} =res.data
                this.accuracy=parseFloat(acc_score).toFixed(2)*100
                this.f1=parseFloat(f1_score).toFixed(2)*100
                this.recall=parseFloat(recall_score).toFixed(2)*100
                this.precision=parseFloat(precision).toFixed(2)*100
                const y_data=[]
                const s_data=[]
                Object.keys(feature_importances).forEach(key=>{
                    y_data.push(key)
                    s_data.push(parseFloat(feature_importances[key]).toFixed(2))
                })
                Object.assign(otherOption,{
                    yAxis: {
                        type: 'category',
                         data: y_data
                    },
                    series: [{
                        type: 'bar',
                        data: s_data,
                        label: {
                            show: true,
                            formatter: (params) => { return params.value + '%' },
                            position: 'right',
                        }
                    }]
                })
                chartsInit(this.$refs.feature,otherOption)
                confusion_matrix.forEach((item,index)=>{
                    this.confusionMatrix.push({
                        label:index,
                        col1:item[0],
                        col2:item[1]
                    })
                })
                console.log(this.confusionMatrix)
            })
        },
        backToLastPage() {
            this.$router.push({ path: '/model/myModel' })
        }
    }
}
</script>
<style scoped>
.evaluate {
    display: grid;
    grid-template-columns: auto auto auto auto;
    height: 100px;
}

.evaluate div {
    text-align: center;
    align-items: center;
}

/* 如果单元格的padding */
.elChgTbeClmn .cell {
    padding: 0px !important;
}

.elHeadCon {
    height: 50px;
    position: relative;
}

.headerCon1 {
    position: absolute;
    left: 0;
    bottom: 0;
}

.headerCon2 {
    position: absolute;
    right: 0;
    top: 0;
}
</style>