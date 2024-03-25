import request from '@/utils/request'

const login=(payload)=>{
  return request({
    method:'POST',
    url:'/login/userLogin',
    data:payload
  })
}

const getUserInfo=()=>{
  return request({
    method:'POST',
    url:'/user/getUserInfo',    
  })
}


export{
  login,
  getUserInfo
}
