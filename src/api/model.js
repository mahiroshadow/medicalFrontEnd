import request from '@/utils/request'
import { prodBaseFlaskUrl,baseFlaskUrl} from '@/env'

/**
* 
* @param `data:{name,createTime}`
**/
const createModel=(payload)=>{
    return request({
        method:'POST',
        url:'/model/createEmptyModel',
        data:payload
    })
}

/**
* 查询模型
* @param
**/
const queryModel=()=>{
    return request({
        method:'POST',
        url:'/model/getModelList'
    })
}

/**
* 算法创建
* @param
**/
const algorithmUpload=(payload)=>{
    return request({
        method:'POST',
        url:'/algorithm/uploadAlgorithm',
        data:payload
    })
}   

/**
* 查询算法列表
* @param
**/

const getAlgorithm=()=>{
    return request({
        method:'POST',
        url:'/algorithm/getAlgorithmList',
    })
}
/**
* 测试模型
* @param
**/
const evalModel=(payload)=>{
    return request({
        baseURL:prodBaseFlaskUrl,
        method:'POST',
        url:'/nuistp/modelEvaluate',
        data:payload
    })
}
const modelTrain=(data)=>{
    return request({
        baseURL:prodBaseFlaskUrl,
        method:'POST',
        data:data,
        url:'/nuistp/train',
        timeout:1000*60
    })
}


export{
    createModel,
    queryModel,
    algorithmUpload,
    getAlgorithm,
    modelTrain,
    evalModel
}