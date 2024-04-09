<template>
<div class="card">
      <div class="card__title">
        <div class="icon">
          <a href="#"><i class="fa fa-arrow-left"></i></a>
        </div>
        <h3>我的模型</h3>
      </div>
      <div class="card__body">
        <div class="half">
          <div class="featured_text">
            <h1>{{title}}</h1>
          </div>
          <div class="image">
            <img src="@/assets/images/model.png" alt="">
          </div>
        </div>
        <div class="half">
          <div class="description">
            <div class="description-item">
                <SvgIcon iconClass="train">开始时间：{{ beginTime }}</SvgIcon>
            </div>
            <div class="description-item">
                结束时间：{{endTime  }}
            </div>
            <div class="description-item">
                训练时长：{{  trainTime}}
            </div>
            <div class="description-item">
                训练状态：{{statusTrue  }}
            </div>
          </div>
          <div class="reviews">
          </div>
        </div>
      </div>
      <div class="card__footer">
        <div class="recommend">
          <p>All models will be</p>
          <h3>trained here</h3>
        </div>
        <div class="action">
            <el-button type="primary" round @click="evalModel">模型评估</el-button>
        </div>
      </div>
    </div>
</template>


<script>
import SvgIcon from '@/components/SvgIcon/index.vue'

export default{
    name:'CradView',
    mounted(){
    
    },
    comments:{
        SvgIcon
    }, 
    data(){
        return{

        }
    },
    props:{
        title:{
            type:String,
            default:''
        },
        beginTime:{
          type:String,
          default:''
        },
        endTime:{
          type:String,
          default:''
        },
        trainTime:{
          type:String,
          default:''
        },
        status:{
          type:Number,
          default:0
        },
        type:{
          type:Number,
          default:0,
          require:true
        },
        containerId:{
          type:String,
          default:'',
          require:true
        },
        savePth:{
          type:String,
          default:'',
          require:true
        },
        testPth:{
          type:String,
          default:'',
          require:true
        }
    },
    computed:{
      statusTrue(){
         return this.status==0?'训练中':'训练完成'
      }
    },
    methods:{
      /**
      * 模型评估
      * @param
      **/
      evalModel(){
        if(this.status==0||this.type==1){
            this.$message.success('error:未训练完或无测试')
            return
        }
        this.$router.push({
          name:'modelEvlPage',
          params:{
              savePth:this.savePth,
              testPth:this.testPth
          }
        })
      }
    }
}
</script>


<style lang="scss" scoped>
@import url('https://fonts.googleapis.com/css?family=Fjalla+One|Montserrat:300,400,700,800|Open+Sans:300');


.card{
  box-shadow: 0 6px 6px rgba(#000, 0.3);
  transition: 200ms;
  background: #fff;
  
  .card__title{
    display: flex;
    align-items: center;
    padding: 30px 40px;
    
    h3{
      flex: 0 1 200px;
      text-align: right;
      margin: 0;
      color: #252525;
      font-family: sans-serif;
      font-weight: 600;
      font-size: 20px;
      text-transform: uppercase;
    }
    
    .icon{
      flex: 1 0 10px;
      background: #115dd8;
      color: #fff;
      padding: 10px 10px;
      transition: 200ms;
      
      > a{
        color: #fff;
      }
      
      &:hover{
        background: #252525;
      }
    }
  }
  
  .card__body{
    padding: 0 40px;
    display: flex;
    flex-flow: row no-wrap;
    margin-bottom: 25px;
    
    > .half{
      box-sizing: border-box;
      padding: 0 15px;
      flex: 1 0 50%;
    }
    
    .featured_text{
      h1{
        margin: 0;
        padding: 0;
        font-weight: 800;
        font-family: "Montserrat", sans-serif;
        font-size: 64px;
        line-height: 50px;
        color: #181e28;
      }
      
      p{
        margin: 0;
        padding: 0;
        
        &.sub{
          font-family: "Montserrat", sans-serif;
          font-size: 26px;
          text-transform: uppercase;
          color: #686e77;
          font-weight: 300;
          margin-bottom: 5px;
        }
        
        &.price{
          font-family: "Fjalla One", sans-serif;
          color: #252525;
          font-size: 26px;
        }
      }
    }
    
    .image{
      padding-top: 15px;
      width: 100%;
      
      img{
        display: block;
        max-width: 100%;
        height: auto;
      }
    }
    
    .description{
      margin-bottom: 25px;
      
      .description-item{
        list-style: none;
        margin: 0;
        font-family: "Open Sans", sans-serif;
        font-weight: 300;
        line-height: 27px;
        font-size: 16px;
        color: #555;
        &:not(:first-child){
            margin-top: 10px;
        }
      }
    }
    
    span.stock{
      font-family: "Montserrat", sans-serif;
      font-weight: 600;
      color: #a1cc16;
    }
    
    .reviews{
      .stars{
        display: inline-block;
        list-style: none;
        padding: 0;
        
        > li{
          display: inline-block;
          
          .fa{
            color: #f7c01b;
          }
        }
      }
      
      > span{
        font-family: "Open Sans", sans-serif;
        font-size: 14px;
        margin-left: 5px;
        color: #555;
      }
    }
  }
  
  .card__footer{
    padding: 30px 40px;
    display: flex;
    flex-flow: row no-wrap;
    align-items: center;
    position: relative;
    
    &::before{
      content: "";
      position: absolute;
      display: block;
      top: 0;
      left: 40px;
      width: calc(100% - 40px);
      height: 3px;
      background: #115dd8;
      background: linear-gradient(to right, #115dd8 0%,#115dd8 20%,#ddd 20%,#ddd 100%);
    }
    
    .recommend{
      flex: 1 0 10px;
      
      p{
        margin: 0;
        font-family: "Montserrat", sans-serif;
        text-transform: uppercase;
        font-weight: 600;
        font-size: 14px;
        color: #555;
      }
     
      h3{
        margin: 0;
        font-size: 20px;
        font-family: "Montserrat", sans-serif;
        font-weight: 600;
        text-transform: uppercase;
        color: #115dd8;
      }
    }
    
    .action{
      button{
        cursor: pointer;
        border: 1px solid #115dd8;
        padding: 14px 30px;
        border-radius: 200px;
        color: #fff;
        background: #115dd8;
        font-family: "Open Sans", sans-serif;
        font-size: 16px;
        transition: 200ms;
        
        &:hover{
          background: #fff;
          color: #115dd8;
        }
      }
    }
  }
}
</style>