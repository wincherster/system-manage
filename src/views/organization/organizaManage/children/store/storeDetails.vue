<style lang="less" scoped>
  @import "./storeDetails.less";
</style>
<template>
  <div class="store-details-container">

    <div class="head">
      <h3 class="title">门店详情</h3>
      <i class="saas iconfont saas-nav-closehover" @click="close"></i>
    </div>
    
    <div class="jb-line"></div>

    <div class="main">
      <div class="tzx-detail-container">

          <div class="group">
            <h4 class="title">基本信息</h4>
            <div class="content">
              <div class="row">
                <div class="col">
                  <label class="label">机构名称:</label>
                  <div class="value nowrap">
                    {{organiza.orgFullName}}
                  </div>
                </div>
                <div class="col ml244">
                  <label class="label">机构简称:</label><div class="value nowrap">{{ organiza.orgShortName }}</div>
                </div>
              </div>
              <div class="row">
                <div class="col">
                  <label class="label">上级机构:</label><div class="value nowrap">{{ organiza.fatherName }}</div>
                </div>
                <div class="col ml244">
                  <label class="label">机构编码:</label><div class="value nowrap">{{ organiza.organCode }}</div>
                </div>
              </div>
              <div class="row">
                <div class="col">
                  <label class="label">价格体系:</label><div class="value nowrap">{{ organiza.priceSystemName }}</div>
                </div>
                <div class="col ml244">
                  <label class="label">业态:</label><div class="value nowrap">{{ organiza.formatStateName }}</div>
                </div>
              </div>
              <div class="row">
                <div class="col">
                  <label class="label">城市地区:</label><div class="value nowrap">{{ organiza.regionName }}</div>
                </div>
                <div class="col ml244">
                  <label class="label">地区级别:</label><div class="value nowrap">{{ organiza.areaLevelName }}</div>
                </div>
              </div>
              <div class="row">
                <div class="col">
                  <label class="label">门店类型:</label><div class="value nowrap">{{ organiza.storeTypeName }}</div>
                </div>
                <div class="col ml244">
                  <label class="label">上级门店:</label><div class="value nowrap">{{ organiza.fatherStoreName }}</div>
                </div>
              </div>
            </div>
          </div>
          
          <div class="split-line"></div>
          
          <div class="group">
            <h4 class="title">详细信息</h4>
            <div class="content">
              <div class="row">
                <div class="col">
                  <label class="label">经营方式:</label><div class="value nowrap">{{ organiza.manageTypeName }}</div>
                </div>
                <div class="col ml244">
                  <label class="label">店面级别:</label><div class="value nowrap">{{ organiza.storeLevelName }}</div>
                </div>
              </div>
              <div class="row">
                <div class="col">
                  <label class="label">新美大POI_ID:</label><div class="value nowrap">{{ organiza.poiId }}</div>
                </div>
                <div class="col ml244">
                  <label class="label">隶属法人:</label><div class="value nowrap">{{ organiza.legalPerName }}</div>
                </div>
              </div>
              <div class="row">
                <div class="col">
                  <label class="label">店长工号:</label><div class="value nowrap">{{ organiza.storeManagerNo }}</div>
                </div>
                <div class="col ml244">
                  <label class="label">店长姓名:</label><div class="value nowrap">{{ organiza.storeManagerName }}</div>
                </div>
              </div>
              <div class="row">
                <div class="col">
                  <label class="label">联系电话:</label><div class="value nowrap">{{ organiza.phone }}</div>
                </div>
                <div class="col ml244">
                  <label class="label">投诉电话:</label><div class="value nowrap">{{ organiza.complainPhone }}</div>
                </div>
              </div>
              <div class="row">
                <div class="col">
                  <label class="label">开业日期:</label><div class="value nowrap">{{ organiza.setupDate }}</div>
                </div>
                <div class="col ml244">
                  <label class="label">合同终止日期:</label><div class="value nowrap">{{ organiza.contractCloseDate }}</div>
                </div>
              </div>
              <div class="row">
                <div class="col">
                  <label class="label">网址:</label><div class="value nowrap">{{ organiza.website }}</div>
                </div>
                <div class="col ml244">
                  <label class="label">EMAIL:</label><div class="value nowrap">{{ organiza.email }}</div>
                </div>
              </div>
              <div class="row">
                <div class="col">
                  <label class="label">营业面积:</label><div class="value nowrap">{{ organiza.bussinessArea }}</div>
                </div>
                <div class="col ml244">
                  <label class="label">营业时间:</label><div class="value nowrap">{{ organiza.businessHours }}</div>
                </div>
              </div>
              <div class="row">
                <div class="col">
                  <label class="label">门店标签:</label>
                  <div class="value">
                    <el-tag size="small" v-for="(item, index) in (organiza.labelValue != null ? organiza.labelValue.split(',') : [])" :key="index">
                      {{item}}
                    </el-tag>
                  </div>
                </div>
                <div class="col ml244">
                  <label class="label">菜系:</label>
                  <div class="value">
                    <el-tag size="small" v-for="(item, index) in (organiza.cuisine !=null ? organiza.cuisine.split(',') : [])" :key="index">
                      {{item}}
                    </el-tag>
                  </div>
                </div>
              </div>
              <div class="row">
                <div class="col col2">
                  <label class="label">门店属性:</label>
                  <div class="value nowrap">
                    <el-checkbox readonly label="24小时营业" :value="organiza.is24time" true-label='1' false-label='0'></el-checkbox>
                    <el-checkbox readonly label="可提供外卖" :value="organiza.isDelivery" true-label='1' false-label='0'></el-checkbox>
                    <el-checkbox readonly label="可提供CC"   :value="organiza.isPhonebook" true-label='1' false-label='0'></el-checkbox>
                    <el-checkbox readonly label="可提供网订" :value="organiza.isWebbook" true-label='1' false-label='0'></el-checkbox>
                  </div>
                </div>
              </div>
              <div class="row">
                <div class="col col2">
                  <label class="label">备注:</label><div class="value remark">{{ organiza.remark }}</div>
                </div>
              </div>
            </div>
          </div>

          <div class="split-line"></div>

          <div class="group">
            <h4 class="title">微信相关信息</h4>
            <div class="content">
              <div class="row">
                <div class="col">
                  <label class="label">二维码编号:</label><div class="value nowrap">{{ organiza.thirdCode }}</div>
                </div>
                <div class="col ml244">
                  <label class="label">微信收款账号:</label><div class="value nowrap">{{ organiza.wechat }}</div>
                </div>
              </div>
              <div class="row">
                <div class="col">
                  <label class="label">订餐电话:</label><div class="value nowrap">{{ organiza.bookFoodPhone }}</div>
                </div>
                <div class="col ml244">
                  <label class="label">人均消费:</label><div class="value nowrap">{{ organiza.avgprice }}</div>
                </div>
              </div>
              <div class="row">
                <div class="col">
                  <label class="label">店面地址:</label><div class="value nowrap">{{ organiza.address }}</div>
                </div>
                <div class="col ml244">
                  <label class="label">公交线路:</label><div class="value nowrap">{{ organiza.busRoute }}</div>
                </div>
              </div>
              <div class="row">
                <div class="col col2">
                  <label class="label">经纬度:</label>
                  <div class="value nowrap">
                    <span class="cell">{{ organiza.longitude }}</span>
                    <span class="cell">{{ organiza.latitude }}</span>
                  </div>
                </div>
              </div>
              <div class="row">
                <div class="col col2">
                  <label class="label">LOGO:</label>
                  <div class="value nowrap">
                     <div class="logo" :style='"background-image: url("+organiza.image1+")"'></div>
                  </div>
                </div>
              </div>
              <div class="row">
                <div class="col col2">
                  <label class="label">点餐轮播图:</label>
                  <div class="value nowrap">
                      <div class="carousel">
                        <el-carousel height="85px" ref="carouselPreview">
                          <el-carousel-item v-for="item in (organiza.image2 !=null ? organiza.image2.split(',') : [])" :key="item">
                            <div class="preview" :style='"background-image: url("+item+")"'></div>
                          </el-carousel-item>
                        </el-carousel>
                      </div>
                  </div>
                </div>
              </div>
              <div class="row">
                <div class="col col2">
                  <label class="label">微信背景图:</label>
                  <div class="value nowrap">
                      <div class="wxbg" :style='"background-image: url("+organiza.image3+")"'></div>
                  </div>
                </div>
              </div>
              <div class="row">
                <div class="col col2">
                  <label class="label">门店属性:</label>
                  <div class="value nowrap">
                    <el-checkbox readonly label="可提供微信预定餐位" :value="organiza.isWechatydzw" true-label='1' false-label='0'></el-checkbox>
                    <el-checkbox readonly label="可提供微信到店点餐" :value="organiza.isWechatdddc" true-label='1' false-label='0'></el-checkbox>
                    <el-checkbox readonly label="可提供微信外卖自提" :value="organiza.isWechatwmzt" true-label='1' false-label='0'></el-checkbox>
                    <el-checkbox readonly label="可提供微信排号等号" :value="organiza.isWechatpddh" true-label='1' false-label='0'></el-checkbox>
                  </div>
                </div>
              </div>
              <div class="row">
                <div class="col col2">
                  <label class="label">微信设置:</label>
                  <div class="rich" v-html="organiza.summary"></div>
                </div>
              </div>
            </div>
          </div>

      </div>
    </div>

    <div class="opt">
      <el-button class="kxBtn" @click="close">取消</el-button>
      <el-button type="primary" class="sxBtn" @click="edit">编辑</el-button>
    </div>

  </div>
</template>
<script>
  import '../../../../../assets/less/tzx-details.css'
  export default {
    created () {
      this.initData() // 初始化数据
    },
    data () {
      return {
        orgId: null,
        orgType: null,
        organiza: {},
        brandId: null,
        selectedOrg: null
      }
    },
    methods: {
      initData () {
        // 获取路由参数
        this.orgId = this.$route.query.orgId
        this.orgType = this.$route.query.orgType
        // 获取机构详情
        this.getOrgDetailByOrgId(this.orgId, this.orgType)
      },
      getOrgDetailByOrgId (id, type) { // 根据机构ID和机构类型查询机构详细信息
        this.$http
          .post('/api/organization/organ/getDetail', { id: id, orgType: type })
          .then(res => {
            if (res.data.code === '0') {
              this.organiza = res.data.data
              console.log('机构详情：', this.organiza)
            } else {
              this.$message({ type: 'error', message: res.data.msg })
            }
          })
          .catch(err => {
            this.$message({ type: 'error', message: err.msg })
          })
      },
      getBrandIdByOrgId (id, callback) { // 根据机构ID查出机构所在的品牌ID
        this.$http
          .post('/api/organization/organ/getBrandIdById', { id: id })
          .then(res => {
            if (res.data.code === '0') {
              this.brandId = res.data.data
              callback()
            } else {
              this.$message({ type: 'error', message: res.data.msg })
            }
          })
          .catch(err => {
            this.$message({ type: 'error', message: err.msg })
          })
      },
      buildTopOrg (org) { // 构建上级机构：id、level、orgFullName、organCode
        this.selectedOrg = { id: org.fatherId, orgFullName: org.fatherName, level: org.fatherLevel, organCode: org.fatherOrganCode }
      },
      edit () {
        this.getBrandIdByOrgId(this.orgId, () => { // 3. 设置品牌ID
          if (this.brandId && this.organiza) {
            this.buildTopOrg(this.organiza) // 1. 构建上级
            //
            this.orgType = this.organiza.orgType // 2. 设置当前编辑的机构的机构类型
            //
            this.$store.dispatch('setStoreParams', { // 4. 分发action
              orgType: this.orgType,
              organiza: this.organiza,
              topOrg: this.selectedOrg,
              brandId: this.brandId
            })
            this.$router.push({name: 'editStore'})
          }
        })
      },
      close () {
        this.$router.go(-1)
      }
    }
    // computed: {
    //   getStoreParams () {
    //     return this.$store.getters.getStoreParams
    //   }
    // }
  }
</script>
