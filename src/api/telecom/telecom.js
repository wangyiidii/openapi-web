/**** 运营商 ****/
import http from '@/utils/http'

export function sendRandom (params) {
  return http.get('/chinaUnicom/sendRandomNum', params)
}

export function randomLogin (params) {
  return http.postJson('/chinaUnicom/randomLogin', params)
}

export function queryUserInfo4HomePage (params) {
  return http.postJson('/chinaUnicom/queryUserInfo4HomePage', params)
}

export function queryUserInfo (params) {
  return http.postJson('/chinaUnicom/queryUserInfo', params)
}


