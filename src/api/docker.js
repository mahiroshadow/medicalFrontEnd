import baseURL, { prodBaseFlaskUrl,baseFlaskUrl } from '@/env'
import requset from '@/utils/request'

/**
* 获取容器列表状态
* @param
**/
const getContainerStatus=()=>{
    return requset({
        method:'POST',
        baseURL:prodBaseFlaskUrl,
        url:'/nuistp/getContainerStatus',
    })
}

/**
* 获取用户镜像列表
* @param
**/
const getImageList=()=>{
    return requset({
        method:'POST',
        url:'/docker/getDockerImageList'
    })
}

/**
* 使用Dockerfile构建docker镜像
* @param
**/
const buildDockerImage=(payload)=>{
    return requset({
        method:'POST',
        baseURL:baseFlaskUrl,
        url:'/nuistp/buildImage',
        data:payload,
        timeout:1000*60
    })
}
/**
* 删除容器
* @param
**/
const deleteContainer=(payload)=>{
    return requset({
        baseURL:prodBaseFlaskUrl,
        url:'/nuistp/deleteContainer',
        method:'POST',
        data:payload
    })
}
/**
*  获取日志
* @param
**/
const getContainerLogsById=(payload)=>{
    return requset({
        baseURL:prodBaseFlaskUrl,
        url:'/nuistp/containerLogs',
        method:'POST',
        data:payload
    })
}

export{
    getContainerStatus,
    getImageList,
    buildDockerImage,
    deleteContainer,
    getContainerLogsById
}