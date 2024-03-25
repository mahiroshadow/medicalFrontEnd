import cookie from "js-cookie"

const TokenKey = 'competition'

function getToken() {
  return cookie.get(TokenKey)
}

function setToken(token) {
  cookie.set(TokenKey, token)
}

function removeToken() {
  return cookie.remove(TokenKey)
}


export {
  getToken,
  setToken,
  removeToken
}