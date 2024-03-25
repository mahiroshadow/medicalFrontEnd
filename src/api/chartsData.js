import request from '@/utils/request'
import { baseFlaskUrl } from '@/env'


/**
* 获取某一个特征的分布
* @param
**/
const getOneFeatureDistribution=(data)=>{
    return request({
        method:'POST',
        baseURL:baseFlaskUrl,
        url:'/nuistp/getOneFeatureDistribution',
        data:data
    })
}

/**
* 获取文件表头
* @param
**/
const getFileHead=(data)=>{
    return request({
        method:'POST',
        baseURL:baseFlaskUrl,
        url:'/nuistp/getFileHead',
        data:data
    })
}

/**
* 获取样本类别分布
* @param
**/
const getOccupytion=(data)=>{
    return request({
        baseURL:baseFlaskUrl,
        url:'/nuistp/getOccupytion',
        method:'POST',
        data:data
    })
}

/**
* 获取pca降维后的数据
* @param
**/
const pca=(data)=>{
    return request({
        method:'POST',
        baseURL:baseFlaskUrl,
        url:'/nuistp/pca',
        data:data
    })
}


export {
    getOneFeatureDistribution,
    getFileHead,
    getOccupytion,
    pca
}   