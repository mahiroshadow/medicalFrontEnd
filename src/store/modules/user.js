import { login, getUserInfo } from '@/api/user'
import { getToken, setToken, removeToken } from '@/utils/auth'
import { resetRouter } from '@/router'

const getDefaultState = () => {
  return {
    token: getToken(),
    username: '',
    avatar_url: '',
  }
}

const state = getDefaultState()

const mutations = {
  RESET_STATE: (state) => {
    Object.assign(state, getDefaultState())
  },
  SET_TOKEN: (state, token) => {
    state.token = token
  },
  SET_USERNAME: (state, username) => {
    state.username = username
  },
  SET_AVATARURL: (state, avatar_url) => {
    state.avatar_url = avatar_url
  }
}

const actions = {
  // 用户登录
  login({ commit }, user) {
    //对user中所有对象进行去除空格
    Object.keys(user).forEach(key=>user[key].trim())
    //返回一个promise对象
    return new Promise((resolve, reject) => {
      login(user).then(res => {
        const { data:{token,user:{username,avatar_url}}} = res
        if(!token){
            return reject('无效Token')
        }
            //登录成功设置token
            commit('SET_TOKEN', token)
            //设置用户头像
            // this.getInfo() 如果你不想登陆的时候直接返回用户信息那就再做一层
            commit('SET_USERNAME',username)
            commit('SET_AVATARURL', avatar_url)
            setToken(token)
            resolve()
      }).catch(err => {
            reject(err)
      })
    })
  },

  // 获取用户信息
  getInfo({ commit, state }) {
    return new Promise((resolve, reject) => {
      getUserInfo().then(res => {
          const { data:{status,user:{username,avatar_url}} } = res
          if(status==600)
              return reject('Token已过期，请重新登陆')
            commit('SET_USERNAME',username)
            commit('SET_AVATARURL', avatar_url)
            resolve()
      }).catch(error => {
        reject(error)
      })
    })
  },

  //用户登出
  logout({ commit }) {
    return new Promise((resolve, reject) => {
        //重置路由 返回登录界面
        resetRouter()
        //清除token
        removeToken()
        //清除登陆状态
        commit('RESET_STATE')
        resolve()
    })
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}

