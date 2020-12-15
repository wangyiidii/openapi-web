<template>
  <div>
    <el-container>
      <el-header>
        XNM
      </el-header>
      <div>
        <el-row>
          <el-col :md="8">&nbsp;</el-col>
          <el-col :md="8">
            <!-- 白嫖警告 -->
            <div class="row-space"
                 style="display:none">
              <el-alert title="防止白嫖客"
                        type="error"
                        :closable="false"
                        center>
                <el-link type="primary"
                         :underline="false"
                         @click=" dialogVisibe.memberClub= true">点击查看</el-link>
              </el-alert>
            </div>

            <!-- 教程轮播 -->
            <div class="block text-center"
                 style="display:none">
              <el-carousel type="card"
                           height="220px">
                <el-carousel-item v-for="(img, index) in carouselImgList"
                                  :key="index">
                  <h3 class="small">第{{ index + 1 }}步</h3>
                  <el-image :src=img.url></el-image>
                </el-carousel-item>
              </el-carousel>
            </div>

            <!-- 最新动态 -->
            <el-card class="box-card row-space"
                     shadow="hover"
                     style="display:none">
              <div slot="header"
                   class="clearfix">
                <span>最新动态</span>
                <!-- <el-button style="float: right; padding: 3px 0"
                           type="text">操作按钮</el-button> -->
              </div>
              <div class="item"
                   v-for="(item,index) in latestNews"
                   :key='index'>
                <p style="color:#909399;font-size:12px">{{dataFormat(item.createTime) + ' - ' + item.content+'...'}}</p>
              </div>
            </el-card>

            <!-- 获取房间tab -->
            <el-tabs v-model="activeName"
                     @tab-click="handleClick"
                     class="text-center">
              <!--单个获取-->
              <el-tab-pane label="单个"
                           name="tab_singleAcquire">
                <el-form :model="xjjForm"
                         :rules="rules"
                         ref="form_singleAcquire"
                         label-width="100px">
                  <el-form-item label="id或房间号"
                                prop="roomId">
                    <el-input placeholder="id或房间号"
                              v-model="xjjForm.roomId"
                              size="medium"
                              clearable></el-input>
                  </el-form-item>
                  <el-form-item prop="token"
                                label="token">
                    <el-input placeholder="token"
                              v-model="xjjForm.token"
                              size="medium"
                              clearable>
                      <el-switch slot="append"
                                 v-model="isUseDefalutToken"
                                 active-color="#13ce66">
                      </el-switch>
                    </el-input>
                  </el-form-item>

                  <el-form-item prop="cdk"
                                label="cdk">
                    <el-input placeholder="cdk（联系qq: 3087233411）"
                              v-model="xjjForm.cdk"
                              size="medium"
                              clearable />
                  </el-form-item>
                </el-form>
                <div class="row-space">
                  <el-alert :title="addr"
                            type="info"
                            :closable="false"
                            center>
                  </el-alert>
                </div>

                <div class="row-space">
                  <el-alert title="个人推广链接"
                            type="warning"
                            :closable="false"
                            center
                            v-if="alertVisiable.myInviteUrl">
                    {{myInviteUrl}}
                  </el-alert>
                </div>

                <el-button class="row-space"
                           type="primary"
                           @click="_getXjjVipRoom('form_singleAcquire')"
                           :loading=btnLoading.singleAcquire>获取直播地址</el-button>
                <div>
                  <el-link class="row-space"
                           type="info"
                           :href="'https://api.sdylba.com/OpenAPI/v1/anchor/vip?page=1&size=50&order=time&token='+xjjForm.token"
                           target="_blank">房间列表</el-link>
                </div>

              </el-tab-pane>
              <!-- 批量获取 -->
              <el-tab-pane label="批量"
                           name="tab_batchAcquire">
                <el-form :model="xjjForm"
                         :rules="rules"
                         ref="form_batchAcquire"
                         label-width="80px">
                  <el-form-item prop="token"
                                label="token">
                    <el-input placeholder="token"
                              v-model="xjjForm.token"
                              size="medium"
                              clearable>
                      <el-switch slot="append"
                                 v-model="isUseDefalutToken"
                                 active-color="#13ce66">
                      </el-switch>
                    </el-input>
                  </el-form-item>
                  <el-form-item prop="cdk"
                                label="cdk">
                    <el-input placeholder="cdk（联系qq: 3087233411）"
                              v-model="xjjForm.cdk"
                              size="medium"
                              clearable />
                  </el-form-item>
                </el-form>
                <div class="row-space">
                  <el-alert title="个人推广链接"
                            type="warning"
                            :closable="false"
                            center
                            v-if="alertVisiable.myInviteUrl">
                    {{myInviteUrl}}
                  </el-alert>
                </div>
                <el-row class="row-space">
                  <el-button type="primary"
                             @click="_getXjjVipRoomList('form_batchAcquire')"
                             :loading=btnLoading.batchAcquire>获取收费房列表</el-button>
                </el-row>

                <el-table :data="vipRoomList"
                          border
                          style="width: 100%">
                  <el-table-column prop="id"
                                   label="id"
                                   align="center"
                                   width="100">
                  </el-table-column>
                  <el-table-column prop="currRoomNum"
                                   label="房间号"
                                   align="center"
                                   width="80">
                  </el-table-column>
                  <el-table-column prop="nickname"
                                   label="昵称"
                                   align="center"
                                   width="100">
                  </el-table-column>
                  <el-table-column prop="prerequisite"
                                   label="金币"
                                   align="center"
                                   width="50">
                  </el-table-column>
                  <el-table-column prop="txTime"
                                   label="txTime"
                                   align="center"
                                   :formatter="dataFormat4table"
                                   sortable
                                   @sort-change="sortByTxTime"
                                   width="100">
                  </el-table-column>
                  <el-table-column prop="city"
                                   label="城市"
                                   align="center"
                                   width="50">
                  </el-table-column>
                  <el-table-column prop="ptname"
                                   label="描述"
                                   align="center"
                                   width="200">
                  </el-table-column>
                  <el-table-column prop="addr"
                                   label="播放地址"
                                   align="center"
                                   width="500">
                  </el-table-column>
                  <el-table-column fixed="right"
                                   label="操作"
                                   align="center"
                                   width="100">
                    <template slot-scope="scope">
                      <el-button @click="copyAddr(scope.row)"
                                 type="text"
                                 icon="el-icon-document-copy"
                                 size="medium"></el-button>
                    </template>
                  </el-table-column>
                </el-table>
              </el-tab-pane>
              <!-- 推广生成cdk -->
              <el-tab-pane label="cdk推广"
                           name="tab_cdkInvite">
                <el-form :model="xjjForm"
                         ref="xjjForm">
                  <el-form-item prop="ckdId">
                    <el-input placeholder="被推广的cdkId (推广链接在上方cdk推广公告处生成)"
                              v-model="xjjForm.cdkId"
                              size="medium"
                              disabled />
                  </el-form-item>
                </el-form>
                <div class="row-space">
                  <el-alert title="cdk仅可通过推广或管理员生成, 且生成的cdk默认为0小时，如需体验请联系QQ: 3087233411."
                            type="warning"
                            :closable="false"
                            description="系统会定时清除无效的cdk，请不要重复生成"
                            center>
                  </el-alert>
                </div>
                <div class="row-space">
                  <el-alert :title="xjjForm.newCdk"
                            type="info"
                            :closable="false"
                            v-if="alertVisiable.newCdk"
                            center>
                  </el-alert>
                </div>
                <el-button class="row-space"
                           type="primary"
                           @click="_cdkInvite()"
                           :loading="btnLoading.cdkInvite"
                           :disabled=btnDisabled.cdkInvite>生成cdk</el-button>
              </el-tab-pane>

              <!-- 数据分析区 -->
              <el-tab-pane label="卫生纸使用情况"
                           name="tab_dataAnalyze">
                <div ref="ref_dataAnalysisChart"
                     style="width:100%;height: 320px;"></div>
              </el-tab-pane>
              <el-tab-pane label="热门福利"
                           name="tab_free_hot">
                <div v-for="(item, index) in freeData"
                     :key="index">
                  <el-col :xs="12"
                          :sm="12"
                          :md="6"
                          class="text-center"
                          style="margin-bottom:20px;">
                    <el-image style="width: 100px; height: 100px"
                              :src="defaultImg"
                              fit='cover'
                              @click="showRealImg(index,$event)"></el-image>
                    <br>
                    <span class="img-title"
                          @click='copyToClipboard(item.address)'>{{item.title}}</span>
                    <!--:src='item.img'-->
                    <!--src="https://fuss10.elemecdn.com/e/5d/4a731a90594a4af544c0c25941171jpeg.jpeg"-->
                  </el-col>
                </div>

              </el-tab-pane>
              <el-tab-pane label="热门VIP"
                           name="tab_free_vip">
                <div v-for="(item, index) in freeData"
                     :key="index">
                  <el-col :xs="12"
                          :sm="12"
                          :md="6"
                          class="text-center"
                          style="margin-bottom:20px;">
                    <el-image style="width: 100px; height: 100px"
                              :src="defaultImg"
                              fit='cover'
                              @click="showRealImg(index,$event)"></el-image>

                    <span class="img-title"
                          @click='copyToClipboard(item.address)'>{{item.title}}</span>
                    <!--:src='item.img'-->
                    <!--src="https://fuss10.elemecdn.com/e/5d/4a731a90594a4af544c0c25941171jpeg.jpeg"-->
                  </el-col>
                </div>
              </el-tab-pane>
            </el-tabs>

            <el-collapse accordion
                         style="margin-top:50px">
              <el-collapse-item>
                <template slot="title">
                  注意事项（必读）
                </template>
                <el-collapse accordion
                             class="firstLine-indent">
                  <el-collapse-item>
                    <template slot="title">
                      名词解释
                    </template>
                    <el-table :data="attentionTableData"
                              style="width: 90%;margin: 0 auto">
                      <el-table-column prop="column"
                                       label="名词"
                                       min-width="50%">
                      </el-table-column>
                      <el-table-column prop="desc"
                                       label="说明">
                      </el-table-column>
                    </el-table>
                  </el-collapse-item>
                  <el-collapse-item>
                    <template slot="title">
                      抓包
                    </template>
                    <div class="firstLine-indent">
                      <p>使用过程中能够可能会涉及到抓包，抓取xnm的token（当然提供了拿来即用的token），如果想用自己的token的还请自行抓包。</p>
                    </div>

                  </el-collapse-item>
                  <el-collapse-item>
                    <template slot="title">
                      房间号播放失败
                    </template>
                    <div class="firstLine-indent">txTime:
                      <p>何时该URL会过期，格式是十六进制的UNIX时间戳，txTime理论上是无限制的，但过期过长 容易造成泄露推流地址，造成被盗流。建议往后推12或者24小时为宜。可更好的保证安全性和良好的用户体验。</p>
                      <br />
                      <p>xnm的直播地址同理也会在txTime的一段时间后过期，测试大概是5-8分钟后失效。与当前时间相差太多的<span style="color:#F56C6C">建议再在单个那里根据id获取一次</span>，不行就是不能看了，看别的</p>
                    </div>

                  </el-collapse-item>
                </el-collapse>

              </el-collapse-item>

              <el-collapse-item>
                <template slot="title">
                  步骤教程
                </template>
                <div style="height: 300px;margin-top:50px"
                     class="firstLine-indent">
                  <el-steps direction="vertical">
                    <el-step title="抓包获取token"
                             description="登陆软件, 抓包获取token.(不退出软件token应该是一直可用的)"></el-step>
                    <el-step title="通过接口获取房间号"
                             description="接口地址: https://api.fdagfb.com/OpenAPI/v1/anchor/vip?page=1&size=50&order=time&token=你的token"></el-step>
                    <el-step title="在本页面获取流媒体播放地址"
                             description="填写id或者房间号和token即可获取直接播放的流媒体播放地址"></el-step>
                    <el-step title="播放"
                             description="安卓推荐QQ浏览器, 苹果推荐sPlayer"></el-step>
                  </el-steps>
                </div>
              </el-collapse-item>

              <el-collapse-item>
                <template slot="title">
                  图片教程
                </template>
                <div class="firstLine-indent">见页面上方走马灯轮播图</div>
              </el-collapse-item>
              <el-collapse-item>
                <template slot="title">
                  视频教程
                </template>
                <div class="firstLine-indent">
                  <template>
                    <video-player class="video-player vjs-custom-skin"
                                  ref="videoPlayer"
                                  :playsinline="true"
                                  :options="playerOptions"></video-player>
                  </template>
                </div>
              </el-collapse-item>

              <el-collapse-item>
                <template slot="title">
                  推广机制
                </template>
                <div class="firstLine-indent">
                  在页面输入正确的cdk后生成自己的邀请链接，通过该链接生成的cdk成为会员之后，推广cdk奖励 <span style="color:#F56C6C;font-size:24px">10</span> 天时长奖励! </div>
              </el-collapse-item>
            </el-collapse>
            <!----------------------------------------------->
            <div style="margin-bottom:50px"></div>
            <!-- 会员中心dialog -->
            <el-dialog title="会员中心"
                       :visible.sync="dialogVisibe.memberClub"
                       width="80%"
                       align="center">
              <el-table :data="memberSalePrice">
                <el-table-column property="time"
                                 label="时间"
                                 min-width="50%">
                </el-table-column>
                <el-table-column property="price"
                                 label="价格(￥)">
                </el-table-column>
              </el-table>
              <div style="margin: 20px 0 50px 0">
                <div class="row-space">推广cdk奖励 <span style="color:#F56C6C;font-size:24px;font-weight:bold">10</span> 天时长奖励! </div>
                <el-button type="primary"
                           @click="openContactDialog()"
                           size="mini">了解一下</el-button>
              </div>

              <span slot="footer"
                    class="dialog-footer">
                <el-button @click="dialogVisibe.memberClub = false"
                           size="mini">关闭</el-button>
              </span>
            </el-dialog>
          </el-col>
        </el-row>
      </div>
    </el-container>
    <el-backtop></el-backtop>
  </div>

</template>

<script>

import { getSingleVipRoom, getVipRoomList, cdkInvite, getCdkInfo, getXjjUsage, getxjjLatestNews, free } from '@/api/xjj/xjj.js'
import { handleClipboard } from '@/utils/clipboard'

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
      activeName: "tab_singleAcquire",
      lastActiveName: "tab_singleAcquire",
      myInviteUrl: "",
      isUseDefalutToken: false,
      latestNews: ['暂无最新动态'],
      xjjForm: {
        roomId: "",
        token: "",
        cdk: "",
        cdkId: "",
        newCdk: "等待生成cdk...(默认生成的为0小时)",
      },
      btnLoading: {
        singleAcquire: false,
        batchAcquire: false,
        cdkInvite: false,
      },
      btnDisabled: {
        cdkInvite: true,
      },
      dialogVisibe: {
        memberClub: false,
      },
      alertVisiable: {
        myInviteUrl: false,
        newCdk: false,
      },
      addr: "等待获取播放地址...",
      vipRoomList: [],
      carouselImgList: [{ url: require('../../assets/imgs/xjj/step1.png') }, { url: require('../../assets/imgs/xjj/step2.png') }, { url: require('../../assets/imgs/xjj/step3.png') }],

      memberSalePrice: [{ "time": "8小时", "price": "0.00" }, { "time": "一个月", "price": "10.00" }, { "time": "三个月", "price": "20.00" }, { "time": "半年", "price": "35.00" }],
      attentionTableData: [{ "column": "id或房间号", "desc": "收费房间列表接口地址的 id 和 curroomnum 字段，在批量那里获取的直播地址失效的话可以使用id咋单个那里获取播放地址" },
      { "column": "token", "desc": "xnm用户登陆后的token，抓包获取到(当然也可以用页面提供的token)" },
      { "column": "cdk", "desc": "cdk仅可通过推广或管理员生成, 默认注册为0小时, 如需体验请联系3087233411" },],
      rules: {
        roomId: [
          { required: true, message: '请输入id或房间号', trigger: 'blur' },
          { validator: validateNumber, message: 'id或房间号格式不正确', trigger: 'blur' }
        ],
        token: [
          { required: true, message: '请输入token', trigger: 'blur' },
        ],
        cdk: [
          { required: true, message: '请输入cdk', trigger: 'blur' },
        ],
      },
      dataAnalysisOption: {
        title: {
          text: '卫生纸使用趋势一览图',
          textStyle: {
            color: 'black',
          },
          left: 'center'
        },
        legend: {
          show: true,
          y: "top",
          x: "center",
          type: "scroll",
          top: "10%"
        },
        xAxis: {
          name: '时间(时)',
          type: 'category',
          boundaryGap: false,
          data: [],
        },
        yAxis: {
          name: '次数',
          type: 'value'
        },
        series: [{
          data: [],
          type: 'line',
          name: '次数',
          // smooth: true,//线条平滑
          areaStyle: {}
        }],
      },
      // 视频播放
      playerOptions: {
        playbackRates: [0.7, 1.0, 1.5, 2.0], //播放速度
        autoplay: false, //如果true,浏览器准备好时开始回放。
        muted: false, // 默认情况下将会消除任何音频。
        loop: false, // 导致视频一结束就重新开始。
        preload: 'auto', // 建议浏览器在<video>加载元素后是否应该开始下载视频数据。auto浏览器选择最佳行为,立即开始加载视频（如果浏览器支持）
        language: 'zh-CN',
        aspectRatio: '16:9', // 将播放器置于流畅模式，并在计算播放器的动态大小时使用该值。值应该代表一个比例 - 用冒号分隔的两个数字（例如"16:9"或"4:3"）
        fluid: true, // 当true时，Video.js player将拥有流体大小。换句话说，它将按比例缩放以适应其容器。
        sources: [{
          type: "",
          src: require('../../assets/xjj/xnm_shipin.mp4')//url地址          
          // src: "" //url地址
        }],
        poster: "https://blog-bucket.yiidii.cn/xjj/Screenshot_20200912-134954__01.jpg", //你的封面地址
        // width: document.documentElement.clientWidth,
        notSupportedMessage: '此视频暂无法播放，请稍后再试', //允许覆盖Video.js无法播放媒体源时显示的默认信息。
        controlBar: {
          timeDivider: true,
          durationDisplay: true,
          remainingTimeDisplay: false,
          fullscreenToggle: true  //全屏按钮
        }
      },
      freeData: [],
      freeImgData: [],
      defaultImg: require('../../assets/imgs/common/view.svg')
    }
  },
  methods: {
    _getXjjVipRoom (formName) {
      this.$refs[formName].validate((valid) => {
        if (!valid) {
          this.$message.error("缺少必要参数 ")
        } else {
          this.btnLoading.singleAcquire = true;
          this.addr = "等待获取播放地址...";
          // const params = { 'roomId': this.loginForm.username, 'token': this.loginForm.password }
          let params = new URLSearchParams()
          params.append("roomId", this.xjjForm.roomId)
          params.append("token", this.xjjForm.token)
          params.append("cdk", this.xjjForm.cdk)
          getSingleVipRoom(params).then(resp => {
            let addr = resp.data.data.addr;
            let message = resp.data.message;
            if (addr) {
              this.$message.success("注意身体哦~" + (message ? '【' + message + '】' : ''))
              this.btnLoading.singleAcquire = false;
              this.addr = addr;
              return;
            }
            this.$message.error("换个房间试试看~")
            this.btnLoading.singleAcquire = false;
          }).catch(err => {
            this.btnLoading.singleAcquire = false;
          })
        }
      });

    },
    _getXjjVipRoomList (formName) {
      this.$refs[formName].validate((valid) => {
        if (!valid) {
          this.$message.error("缺少必要参数")
        } else {
          this.vipRoomList = [];
          this.btnLoading.batchAcquire = true;
          // const params = { 'roomId': this.loginForm.username, 'token': this.loginForm.password }
          let params = new URLSearchParams()
          params.append("token", this.xjjForm.token)
          params.append("cdk", this.xjjForm.cdk)
          getVipRoomList(params).then(resp => {
            this.vipRoomList = resp.data.data
            let message = resp.data.message;
            this.$message.success("注意身体哦~" + (message ? '【' + message + '】' : ''))
            this.btnLoading.batchAcquire = false;
          }).catch(err => {
            this.btnLoading.batchAcquire = false;
          })

        }
      })

    },
    _cdkInvite () {
      this.btnLoading.cdkInvite = true;
      this.xjjForm.newCdk = "等待生成cdk...";
      // const params = { 'roomId': this.loginForm.username, 'token': this.loginForm.password }
      let params = new URLSearchParams()
      params.append("cdkId", this.xjjForm.cdkId)
      cdkInvite(params).then(resp => {
        let newCdk = resp.data.data.cdk;
        let message = resp.data.message;
        if (newCdk) {
          this.$message.success("生成cdk成功")
          this.btnDisabled.cdkInvite = true
          this.btnLoading.generateCdk = false;
          this.xjjForm.newCdk = newCdk
          this.btnLoading.cdkInvite = false;
          this.alertVisiable.newCdk = true
          return;
        }
        this.$message.error("生成cdk发生错误，请联系QQ: 3087233411")
        this.btnLoading.cdkInvite = false;
        this.alertVisiable.newCdk = false
      }).catch(err => {
        this.btnLoading.cdkInvite = false;
        this.alertVisiable.newCdk = false
      })
    },
    _getCdkInfo (cdk) {
      let params = new URLSearchParams()
      params.append("cdkId", cdk)
      getCdkInfo(params).then(resp => {
        let id = resp.data.data.id;
        if (id) {

          let inviteUrl = location.protocol + "//" + location.host + "?cdkId=" + id
          this.myInviteUrl = inviteUrl
          this.alertVisiable.myInviteUrl = true
        } else {
          this.alertVisiable.myInviteUrl = false
        }
      }).catch(err => {
        this.alertVisiable.myInviteUrl = false
      })
    },
    _getxjjLatestNews () {
      let params = new URLSearchParams()
      params.append("topN", 10)
      getxjjLatestNews(params).then(resp => {
        this.latestNews = resp.data.data;
      }).catch(err => {
      })
    },
    drawDataAnalysisTable () {
      let dataAnalysischart = this.$refs.ref_dataAnalysisChart
      let params = new URLSearchParams()
      params.append("cdk", this.xjjForm.cdk)
      getXjjUsage(params).then(resp => {
        let data = resp.data.data;
        this.dataAnalysisOption.xAxis.data = data.x
        this.dataAnalysisOption.series[0].data = data.y
        setTimeout(() => {
          let demo = this.$echarts.init(dataAnalysischart)
          demo.setOption(this.dataAnalysisOption)
        }, 500)
      }).catch(err => {

      })


    },
    init () {
      let cdkId = this.$route.query.cdkId;
      this.xjjForm.cdkId = Boolean(cdkId) ? cdkId : "";
      if (Boolean(cdkId)) {
        this.btnDisabled.cdkInvite = false;
        this.activeName = "tab_cdkInvite"
      }

      // this.drawDataAnalysisTable()
    },
    free (id) {
      let params = new URLSearchParams()
      params.append("ignoreKey", "room_id,watch_number,city")
      params.append("ignoreTitle", "葡京,金华,炸金花,娱乐,娱乐城,澳门,赌场,水果机,水果,爆分,柬埔寨")
      free(id, params).then(resp => {
        let data = resp.data.data;
        this.freeData = data
        let imgData = [];
        for (let i = 0; i < data.length; i++) {
          imgData.push(data[i].img)
        };
        this.freeImgData = imgData
      }).catch(err => {
        console.log(err);
        this.$message.error("获取失败")
      })
      this.$notify.notifyHtml("提示", '<strong>1. 点击小眼睛预览图片</strong><br><strong>2. 点击名称复制播放地址 </strong>')
    },
    showRealImg (index, e) {
      e.currentTarget.src = this.freeImgData[index];
    },
    copyToClipboard (content) {
      handleClipboard(content, event, () => {
        this.$message.success("复制成功")
      }, () => {
        this.$message.success('复制失败！')
      })
    },
    handleClick (tab, event) {
      if (tab.name === 'tab_dataAnalyze') {
        if (!Boolean(this.xjjForm.cdk)) {
          this.$message.error("输入cdk后查看!")
          setTimeout(() => {
            this.activeName = this.lastActiveName
          }, 1);
          return
        }
        // this.$nextTick(() => {
        this.drawDataAnalysisTable()
        // })
      } else if (tab.name === 'tab_free_hot') {
        this.free(1)
      } else if (tab.name === 'tab_free_vip') {
        this.free(4)
      }
      this.lastActiveName = tab.name
    },
    openContactDialog () {
      this.$alert('<strong>QQ: <i></i> 3087233411</strong><br/><div class="demo-image__placeholder"> <div class="block"> <el-image :src="require(\'../../assets/imgs/xjj/weixin_pay.jpg\')"><div slot="error" class="image-slot"> <i class="el-icon-picture-outline"></i></div></el-image></div></div>', '请联系', {
        dangerouslyUseHTMLString: true
      });
    },

    copyAddr (row) {
      let copyedAddr = row.addr;
      let hiddenInput = document.createElement('input'); //创建一个隐藏input（重要!）
      hiddenInput.value = copyedAddr; //赋值
      document.body.appendChild(hiddenInput);
      hiddenInput.select(); // 选择对象
      document.execCommand("Copy"); // 执行浏览器复制命令
      hiddenInput.className = 'hiddenInput';
      hiddenInput.style.display = 'none';
      this.$message.success("复制成功，嘿咻嘿咻~")
    },
    dataFormat4table (row, column) {
      let date = new Date(row.txTime * 1000);
      let Y = date.getFullYear() + '-';
      let M = date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) + '-' : date.getMonth() + 1 + '-';
      let D = date.getDate() < 10 ? '0' + date.getDate() + ' ' : date.getDate() + ' ';
      let h = date.getHours() < 10 ? '0' + date.getHours() + ':' : date.getHours() + ':';
      let m = date.getMinutes() < 10 ? '0' + date.getMinutes() + ':' : date.getMinutes() + ':';
      let s = date.getSeconds() < 10 ? '0' + date.getSeconds() : date.getSeconds();
      return Y + M + D + h + m + s;
    },
    dataFormat (timestamp) {
      let date = new Date(timestamp);
      let Y = date.getFullYear() + '-';
      let M = date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) + '-' : date.getMonth() + 1 + '-';
      let D = date.getDate() < 10 ? '0' + date.getDate() + ' ' : date.getDate() + ' ';
      let h = date.getHours() < 10 ? '0' + date.getHours() + ':' : date.getHours() + ':';
      let m = date.getMinutes() < 10 ? '0' + date.getMinutes() + ':' : date.getMinutes() + ':';
      let s = date.getSeconds() < 10 ? '0' + date.getSeconds() : date.getSeconds();
      return Y + M + D + h + m + s;
    },
    sortByTxTime (time1, time2) {
      return tme1 - time2 > 0
    }
  },
  mounted: function () {
    this.init();
    this._getxjjLatestNews();
    // this.$nextTick(() => {
    //   setInterval(this._getxjjLatestNews, 10000);
    // })
  },
  created () {

  },
  watch: {
    'xjjForm.cdk': function (newVal, oldVal) {
      this._getCdkInfo(newVal)
    },
    isUseDefalutToken: function (newVal) {
      if (newVal) {
        this.xjjForm.token = '9f6a6dce91b720438bf941f2672d9a02'
      } else {
        this.xjjForm.token = ''
      }
    }
  }
}
</script>
<style scoped>
.row-space {
  margin: 10px 0;
}
.text-center {
  text-align: center;
}
.firstLine-indent {
  margin-left: 20px;
}
img {
  width: 100%;
}
@media screen and (max-width: 750px) {
  .el-message-box {
    width: 60% !important;
  }
}
.el-header,
.el-footer {
  text-align: center;
  line-height: 60px;
  font-size: 30px;
  font-weight: bold;
}
.img-title {
  display: block;
  color: #8492a6;
  font-size: 14px;
  margin-bottom: 8px;
}
</style>
