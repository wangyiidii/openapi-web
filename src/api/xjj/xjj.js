/**** 小奶猫 ****/
import http from '@/utils/http'

export function getSingleVipRoom (params) {
  return http.get('/xjj/singleVipRoom', params)
}

export function getVipRoomList (params) {
  return http.get('/xjj/vipRoomList', params)
}

export function cdkInvite (params) {
  return http.get('/xjj/cdk/generate', params)
}

export function getCdkInfo (params) {
  return http.get('/xjj/cdk/info', params)
}

export function getXjjUsage (params) {
  return http.get('/xjj/cdk/usage', params)
}

export function getxjjLatestNews (params) {
  return http.get('/xjj/news', params)
}

export function free (id, params) {
  return http.get('/free/' + id, params)
}

