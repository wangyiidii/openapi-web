<template>
  <div>
    <el-container>
      <el-header>
        运营商Cookie获取
      </el-header>
      <div>
        <el-row>
          <el-col :md="8">&nbsp;</el-col>
          <el-col :md="8">
            <el-tabs v-model="activeName"
                     @tab-click="handleClick">
              <el-tab-pane label="移动"
                           name="tab_chinaMobile"></el-tab-pane>
              <el-tab-pane label="联通"
                           name="tab_chinaUnicom">
                <el-form :model="form"
                         :rules="rules"
                         ref="form_chinaUnicom"
                         label-width="100px"
                         :inline="true">
                  <el-form-item label="手机号">
                    <el-input v-model="form.mobile"
                              prop="mobile"
                              size="medium"
                              clearable></el-input>
                  </el-form-item>
                </el-form>
                <el-form :inline="true"
                         label-width="100px">
                  <el-form-item label="验证码">
                    <el-input v-model="form.password"
                              style="width:120px"
                              prop="password"
                              size="medium"
                              clearable>
                    </el-input>
                  </el-form-item>
                  <el-form-item>
                    <span v-show="show.timeCounter">{{timeCounter}}</span>
                    <el-button type="primary"
                               v-show="!show.timeCounter"
                               size="mini"
                               @click="sendRandom('form_chinaUnicom')">获取验证码</el-button>
                  </el-form-item>
                </el-form>
                <el-form label-width="100px"
                         :inline="true"
                         v-show="show.img_code">
                  <el-form-item label="图片验证码">
                    <el-input v-model="form.userContent"
                              style="width:120px"
                              prop="password"
                              size="medium"
                              clearable>
                    </el-input>
                  </el-form-item>
                  <el-form-item>
                    <img style="height:30px;position:relative;top:2px"
                         :src='"data:image/png;base64,"+ imageCodeBase64' />
                  </el-form-item>
                </el-form>

                <div class="row-space text-center">
                  <el-button type="primary"
                             :loading='btnLoading.chinaUnicomLoadingBtn'
                             @click="randomLogin('form_chinaUnicom')">登陆并获取</el-button>
                </div>
              </el-tab-pane>
              <el-tab-pane label="电信"
                           name="tab_chinaTelecom"></el-tab-pane>
            </el-tabs>

            <el-tabs type="border-card"
                     class="row-space"
                     v-show="show.chinaUnicomInfoCard">
              <el-tab-pane label="Cookie">
                <p><strong>手机号: </strong>
                  <el-tag>{{chinaUnicomInfo.num}} </el-tag>
                </p>
                <p><strong>归属地: </strong>
                  <el-tag type="warning">{{chinaUnicomInfo.proName}} {{chinaUnicomInfo.cityName}}</el-tag>
                </p>
                <p><strong>Cookie: </strong>
                  <el-input type="textarea"
                            class="row-space"
                            size="medium"
                            :rows="8"
                            v-model="chinaUnicomInfo.cookie"></el-input>
                </p>
              </el-tab-pane>

              <el-tab-pane label="套餐及使用情况"
                           v-if="show.tab_packageUsage">
                <p><strong>{{chinaUnicomInfo.packageUsage.flushDateTime}}</strong></p>
                <div v-for="(item,index) in chinaUnicomInfo.packageUsage.dataList"
                     :key='index + "1"'>
                  <p><strong>{{item.remainTitle}}: </strong>
                    <el-tag>{{item.number}}{{item.unit}} </el-tag>&nbsp;&nbsp;
                    <el-tag type="warning"
                            v-show="Boolean(item.usedTitle)">{{item.usedTitle}}</el-tag>
                  </p>
                </div>
              </el-tab-pane>

              <el-tab-pane label="我的信息"
                           v-if="show.tab_myInfo">
                <h2>个人基本信息</h2>
                <p><b>用户姓名: </b>{{chinaUnicomInfo.myInfo.userBase.customerName}}</p>
                <p><b>当前套餐: </b>{{chinaUnicomInfo.myInfo.userBase.currentPackageName}}</p>
                <p><b>用户级别: </b><img width="48px"
                       :src='chinaUnicomInfo.myInfo.userBase.userLevel[0]' /></p>
                <p><b>证件类型: </b>{{chinaUnicomInfo.myInfo.userBase.certtype}}</p>
                <p><b>证件号码: </b>{{chinaUnicomInfo.myInfo.userBase.certnum}}</p>
                <p><b>付费方式: </b>{{chinaUnicomInfo.myInfo.userBase.paytype}}</p>
                <h2>号码信息</h2>
                <p><b>当前状态: </b>{{chinaUnicomInfo.myInfo.numberDetail.subscrbstat}}</p>
                <p><b>号码类型: </b>{{chinaUnicomInfo.myInfo.numberDetail.subscrbType}}</p>
                <p><b>入网时间: </b>{{chinaUnicomInfo.myInfo.numberDetail.opendate}}</p>
                <p><b>通话级别: </b>{{chinaUnicomInfo.myInfo.numberDetail.landlvl}}</p>
                <p><b></b></p>
                <p><b></b></p>
              </el-tab-pane>

              <el-tab-pane label="其他">
                <div v-for="(item,index) in chinaUnicomInfo.member"
                     :key="index + 'onluy'">
                  <el-badge :value="item.service_class_code_name"
                            class="row-space">
                    <el-button size="small">{{item.num}}</el-button>
                  </el-badge>
                </div>
              </el-tab-pane>
            </el-tabs>
          </el-col>
        </el-row>
      </div>
    </el-container>
    <el-backtop></el-backtop>
  </div>

</template>

<script>
import { sendRandom, randomLogin, queryUserInfo, queryUserInfo4HomePage } from '@/api/telecom/telecom.js'

// 纯数字校验
const validateNumber = (rule, value, callback) => {
  let numberReg = /^\d+$|^\d+[.]?\d+$/
  if (value !== '') {
    if (!numberReg.test(value)) {
      callback(new Error('请输入数字'))
    } else {
      callback()
    }
  } else {
    callback(new Error('请输入值'))
  }
}

export default {
  data () {
    return {
      activeName: 'tab_chinaUnicom',
      lastActiveName: 'tab_chinaUnicom',
      timeCounter: 0,// 倒计时计数器
      imageCodeBase64: '',
      show: {
        chinaUnicomInfoCard: false,
        tab_packageUsage: false,
        timeCounter: false,
        tab_myInfo: false,
        img_code: false,
      },
      btnLoading: {
        chinaUnicomLoadingBtn: false,
      },
      btnEnabled: {
        //chinaUnicomBtn: false,
      },

      form: {
        mobile: '',
        password: '',
        userContent: '',
        imageId: '',
      },
      chinaUnicomInfo: {
        num: '',
        proName: '',
        cityName: '',
        cookie: '',
        member: [],
        packageUsage: {},
        myInfo: {},
      },
      rules: {
        mobile: [
          { required: true, message: '请输入手机号', trigger: 'blur' },
          { validator: validateNumber, message: '手机号格式不正确', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '请输入验证码', trigger: 'blur' },
        ],

      },

    }
  },
  methods: {
    handleClick (tab, event) {
      if (tab.name === 'tab_dataAnalyze') {
        if (!Boolean(this.xjjForm.cdk)) {
          this.$message.error("输入cdk后查看!")
          setTimeout(() => {
            this.activeName = this.lastActiveName
          }, 1);
          return
        }
      } else if (tab.name === 'tab_chinaMobile' || tab.name === 'tab_chinaTelecom') {
        this.$message.warning("暂未支持，敬请期待");
        setTimeout(() => {
          this.activeName = this.lastActiveName
        }, 1);
        return
      }
      this.lastActiveName = tab.name
    },
    sendRandom (formName) {
      this.$refs[formName].validate((valid) => {
        if (!valid) {
          this.$message.error("缺少必要参数")
        } else {
          this.show.chinaUnicomInfoCard = false;
          let params = new URLSearchParams()
          params.append("mobile", this.form.mobile)
          sendRandom(params).then(resp => {
            //this.btnEnabled.chinaUnicomBtn = true
            let message = resp.data.message;
            this.$message.success(message)
            this.timeCounter = 60;
            this.show.timeCounter = true;
            var auth_timetimer = setInterval(() => {
              this.timeCounter--;
              if (this.timeCounter <= 0) {
                this.show.timeCounter = false;
                clearInterval(auth_timetimer);
              }
            }, 1000);
          }).catch(err => {
            console.log(err)
          })
        }
      });

    },
    randomLogin (formName) {
      this.$refs[formName].validate((valid) => {
        if (!valid) {
          this.$message.error("缺少必要参数")
        } else {
          // 加载动画
          this.btnLoading.chinaUnicomLoadingBtn = true;
          let params = {}
          params.mobile = this.form.mobile
          params.password = this.form.password
          // params.type = "1"
          if (Boolean(this.form.imageId)) {
            params.userContent = this.form.userContent
            params.imageId = this.form.imageId
          }
          randomLogin(params).then(resp => {
            // 按钮加载停止
            this.btnLoading.chinaUnicomLoadingBtn = false
            // 倒计时定时器停止并隐藏
            this.show.timeCounter = false;

            let message = resp.data.message;
            let data = resp.data.data;
            if ("请输入图片验证码" == message) {
              this.form.imageId = data.imageID
              this.imageCodeBase64 = data.imageContent
              this.show.img_code = true
              this.$message.error(message)
              return
            } else {
              this.$message.success(message)
            }

            this.chinaUnicomInfo = data.chinaUnicomResp.list[0];
            let cookieStr = data.cookieStr
            this.chinaUnicomInfo.cookie = cookieStr
            this.chinaUnicomInfo.member = data.chinaUnicomResp.member;
            localStorage.setItem("mobile", this.chinaUnicomInfo.num);
            localStorage.setItem("cookieStr", cookieStr);
            localStorage.setItem("chinaUnicomResp", JSON.stringify(data.chinaUnicomResp));

            this.show.chinaUnicomInfoCard = true;
            this.btnLoading.chinaUnicomLoadingBtn = false;
            this.show.timeCounter = false;
            this.handleUserData()
          }).catch(err => {
            this.btnLoading.chinaUnicomLoadingBtn = false;
            this.show.timeCounter = false;
            console.log(err)
          })
        }
      });
    },
    async handleUserData () {
      this.queryUserInfo4HomePage()
      this.queryUserInfo()
    },
    queryUserInfo4HomePage () {
      if (!Boolean(this.form.mobile)) {
        return;
      }
      let cookieStr = localStorage.getItem("cookieStr")
      if (!Boolean(cookieStr)) {
        return
      }
      let param = {};
      param.mobile = this.form.mobile;
      param.cookie = cookieStr;
      queryUserInfo4HomePage(param).then(resp => {
        if (resp == undefined) {
          return
        }
        this.chinaUnicomInfo.packageUsage = resp.data.data
        this.show.tab_packageUsage = true;
      }).catch(err => {
        console.log(err)
      })
    },
    queryUserInfo () {
      if (!Boolean(this.form.mobile)) {
        return;
      }
      let cookieStr = localStorage.getItem("cookieStr")
      if (!Boolean(cookieStr)) {
        return
      }
      let param = {};
      param.mobile = this.form.mobile;
      param.cookie = cookieStr;
      queryUserInfo(param).then(resp => {
        if (resp == undefined) {
          return
        }
        this.chinaUnicomInfo.myInfo = resp.data.data
        this.show.tab_myInfo = true
      }).catch(err => {
        console.log(err)
      })
    }
  },
  watch: {
  },
  mounted: function () {
    let mobile = localStorage.getItem("mobile")
    let cookieStr = localStorage.getItem("cookieStr")
    let chinaUnicomResp = localStorage.getItem("chinaUnicomResp")
    if (!Boolean(mobile)) {
      return;
    }
    this.form.mobile = mobile

    if (Boolean(chinaUnicomResp)) {
      chinaUnicomResp = JSON.parse(chinaUnicomResp)

      this.chinaUnicomInfo = chinaUnicomResp.list[0];
      this.chinaUnicomInfo.cookie = cookieStr
      this.chinaUnicomInfo.member = chinaUnicomResp.member;

      this.show.chinaUnicomInfoCard = true;
    }
    if (Boolean(cookieStr)) {
      this.handleUserData()
    }
  }
}
</script>
<style>
.row-space {
  margin: 10px 0;
}
.el-header,
.el-footer {
  text-align: center;
  line-height: 60px;
  font-size: 30px;
  font-weight: bold;
}
.text-center {
  text-align: center;
}
</style>