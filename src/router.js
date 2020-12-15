import Vue from "vue";
import Router from "vue-router";
import XJJ from "./views/xjj/XJJ.vue";
import TelecomOperator from "./views/telecomOperator/TelecomOperator";

Vue.use(Router);

export default new Router({
  mode: "history", // 去掉url中的#
  base: process.env.BASE_URL,
  routes: [
    {
      path: "/", component: XJJ, meta: {
        title: 'XNM'
      }
    },
    {
      path: "/xjj", component: XJJ, name: "xjj",
      meta: {
        title: 'XNM'
      }
    },
    {
      path: "/getCookies", component: TelecomOperator, name: "TelecomOperator",
      meta: {
        title: '运营商Cookie获取'
      }
    },
  ]
});

