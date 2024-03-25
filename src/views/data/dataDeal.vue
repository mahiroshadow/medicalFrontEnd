<template>
    <div class="app-container">
        <el-dialog
            :title="dialogTitle"
            :visible.sync="dialogVisible"
            :width="dialogWidth"
            :before-close="handleClose"
            label-width="80px">
            <el-form label-width="80px" v-if="switcher">
                <el-form-item label="填充方式:">
                    <el-radio-group v-model="fillType">
                        <el-radio label="zero">0填充</el-radio>
                        <el-radio label="mean">均值填充</el-radio>
                        <el-radio label="max">最大值填充</el-radio>
                        <el-radio label="min">最小值填充</el-radio>
                    </el-radio-group>
                </el-form-item>
            </el-form>
            <Distribution v-else>

            </Distribution>
          <span slot="footer" class="dialog-footer">
          <el-button @click="dialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="fillFileData">确 定</el-button>
          </span>
        </el-dialog>
        <el-card>
        <el-row :gutter="20">
            <el-col :span="6" v-for="item in infoList">
                <fileInfo style="height: 120px;" 
                            :name="item.name" 
                            :content="item.content"
                            >
                </fileInfo>
            </el-col>
        </el-row>
        <div style="margin-top: 20px;">
        <span style="margin:10px 0px 10px 10px">选择数据集：</span>
        <el-select v-model="selected" placeholder="请选择" @change="switchFile">
            <el-option
                v-for="item in options"
                :key="item.id"
                :label="item.file_name"
                :value="item.id">
            </el-option>
        </el-select>
        <el-button type="primary" @click="dealFile" style="margin-left: 10px;">处理</el-button>
        <!-- <el-button type="primary" @click="showDataDistribution" style="margin-left: 10px;">查看分布</el-button> -->
        </div>
            <div style="margin-top:10px;">
            </div>
            <el-table :data="csvData" style="margin-top:10px;">
                <el-table-column v-for="(item, index) in dataColumn" width="120">
                    <template slot="header">
                        <span>
                            <el-tooltip class="item" effect="dark" placement="top">
                                <template slot="content">
                                    最大值:{{ max[index] }}<br />
                                    最小值:{{ min[index] }}<br />
                                    均值:{{ avg[index] }}<br/>
                                    方差:{{ std[index] }}
                                </template>
                                <span>{{ item }}</span>
                            </el-tooltip>
                        </span>
                    </template>
                    <template slot-scope="scope">
                        {{ scope.row[index] }}
                    </template>
                </el-table-column>
            </el-table>
        </el-card>
    </div>
</template>
<script>
import { readCsv,getTrainData,getFileDetialInfo,fillFile} from '@/api/data'
import fileInfo from '../components/fileInfo.vue'
import SampleImage from '@/assets/images/sample.png?url'
import Distribution from '../components/dataDistribution.vue'


export default {
    mounted() {
        if (this.$route.params.id||this.$route.params.save_pth){
            this.fileId=this.$route.params.id
            this.fileSavePth=this.$route.params.save_pth
        }
        this.csvShow()
    },
    watch: {
        'load':(newVal,oldVal)=>{
            console.log(newVal,oldVal)
        },
        'fillType':(val)=>{
            console.log(val)
        }
    },
    data() {
        return {
            fileId:'',
            fileSavePth:'',
            csvData: [],
            dataColumn: [],
            options:[],
            cols: 0,
            rows: 0,
            imageList:[SampleImage],
            infoList:[],
            selected:'',
            load:false,
            max:[],
            min:[],
            avg:[],
            std:[],
            hasNone:false,
            dialogVisible:false,
            fillType:'mean',
            dialogWidth:'34%',
            dialogTitle:'文件处理',
            switcher:false
        }
    },
    components:{
        fileInfo,
        Distribution
    },
    methods: {
        //返回上一级
        backToLastPage() {

        },
        /**
        * 切换数据集
        * @param
        **/
        switchFile(){
            this.csvShow()
        },
        /**
        * 查看数据分布
        * @param
        **/
        showDataDistribution(){
            this.dialogVisible=true
            this.dialogTitle="查看数据信息"
            this.switcher=false
        },

        dealFile(){
            if(this.infoList[2].content=='含有'){
                this.$message.warning('文件已经填充')
                return
            }
            this.dialogVisible=true
            this.switcher=true
        },
        /**
        * 选择填充方式
        * @param
        **/
        async fillFileData(){
            this.dialogVisible=false

            const data={
                fillType:this.fillType,
                filePth:this.fileSavePth
            }
            console.log(data)
            const {status}=await (await fillFile(data)).data
            if(status!=200){
                this.$message.error('接口异常')
                return
            }
            this.csvShow()
        },
        /**
        * 显示csv中的数据
        * @param
        **/
        async csvShow() {
            if(this.fileSavePth==''){
                const res=await (await getTrainData()).data
                console.log(res)
                const {status,trainList}=res
                if(status==200)
                {
                    this.options=trainList
                    this.fileSavePth=this.options[0].save_pth
                }
                else{
                    this.$message.error('接口异常')
                    return
                }
            }
            const data={filePth:this.fileSavePth,begin:0,end:20}
            const res1=await (await getFileDetialInfo(data)).data
            const res2=await (await readCsv(data)).data
            if(res1.status==200){
                this.max=res1.max
                this.min=res1.min
                this.std=res1.std
                this.avg=res1.avg
            }
            else{
                this.$message.error('文件未填充') 
            }
            this.infoList=res1.basic
            if(res2.status==200){
                this.dataColumn=res2.lines[0]
                this.csvData=res2.lines.slice(1)
            }
        }
    }
}

</script>

<style scoped>
.el-card {
    min-height: 700px;
}
.setInfo{
    width: 25%;
    height: 50px;
    text-align: center;
    /* border-radius: 15px;
    box-shadow: 10px 10px; */
}
.el-row{
    height: 120px;
}
</style>