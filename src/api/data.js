import request from '@/utils/request'
import { baseFlaskUrl ,prodBaseFlaskUrl} from '@/env'



const getTrainData=()=>{
    return request({
        method:'GET',
        url:'/train/getTrainList',
    })
}

const uploadData=(data)=>{
    return request({
        method:'POST',
        url:'/train/uploadTrainData',
        timeout:5*1000,
        data:data
    })
}

const queryData=(data)=>{
    return request({    
        method:'POST',
        url:'/train/queryFile',
        data:data
    })
}

const deleteFile=(data)=>{
    return request({
        method:'DELETE',
        url:'/train/deleteFile',
        data:data
    })
}

const readCsv=(data)=>{
    return request({
        method:'POST',
        url:'/csv/csvReader',
        data:data
    })
}

const getFileDetialInfo=(data)=>{
    return request({
        baseURL:prodBaseFlaskUrl,
        method:'POST',
        url:'/nuistp/fileInfo',
        data:data
    })
}

const fillFile=(data)=>{
    return request({    
        baseURL:prodBaseFlaskUrl,
        method:'POST',
        url:'/nuistp/fill',
        data:data
    })
}


export{
    getTrainData,
    uploadData,
    queryData,
    deleteFile,
    readCsv,
    getFileDetialInfo,
    fillFile
}