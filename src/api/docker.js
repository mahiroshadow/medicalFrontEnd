import { prodBaseFlaskUrl,baseFlaskUrl } from '@/env'
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
        baseURL:prodBaseFlaskUrl,
        url:'/nuistp/buildImage',
        data:payload,
        timeout:1000*60
    })
}


export{
    getContainerStatus,
    getImageList,
    buildDockerImage
}