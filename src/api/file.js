import request from '@/utils/request'

/**@param null**/
//读取csv文件
const readCsv = (data) =>{
    return request({
        method: 'POST',
        url: '/csv/csvReader',
        data: data
    })
}

/**@param null**/
//获取用户上传的训练集列表
const getUserUploadTrainSet = (data) =>{
    return request({
        method: 'POST',
        url: '/file/getTrainSetList',
        data: data
    })
}

/**@param null**/
//查询训练集
const queryTrainSet = (data)  =>{
    return request({
        method: 'POST',
        url: '/file/queryTrainSet',
        data: data
    })
}

/**@param null**/
//删除训练集
const deleteTrainSet = (data) =>{
    return request({
        method: 'POST',
        url: '/file/deleteTrainSet',
        data: data
    })
}

/**@param null**/
//获取用户上传的测试列表
const getUserUploadTestSet = (data) =>{
    return request({
        method: 'POST',
        url: '/file/getVerifySetList',
        data: data
    })
}

/**@param null**/
//查询测试集
const queryTestSet = (data) =>{
    return request({
        method: 'POST',
        url: 'http://112.74.58.26:13390/file/queryTestSet',
        data: data
    })
}

/**@param null**/
//删除测试集
const deleteTestSet = (data) =>{
    return request({
        method: 'POST',
        url: 'http://112.74.58.26:13390/file/deleteTestSet',
        data: data
    })
}

/**@param null**/
//获取分类结果
const getClassifiedResult = (data) =>{
    return request({
        method: 'POST',
        url: 'http://112.74.58.26:13390/file/getClassifiedResult',
        data: data
    })
}


export{
    readCsv,
    getUserUploadTrainSet,
    queryTrainSet,
    deleteTrainSet,
    getUserUploadTestSet,
    queryTestSet,
    deleteTestSet,
    getClassifiedResult
}