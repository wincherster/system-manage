<template>
  <div class="index">
    <div class="system-fastset">
      <div class="title">
        系统快速设置
      </div>
      <div class='split-line'></div>
      <div class="bigbox">
        <div class="box ppsz" @click.prevent="toLink(codes[0])" :class="!codes[0].has?'a-no':''">
          <img src="../../assets/images/img/img_brand_n@2x.png">
          <p>品牌管理</p>
        </div>
        <div class="box jgtxsz" @click.prevent="toLink(codes[1])" :class="!codes[1].has?'a-no':''">
          <img src="../../assets/images/img/img_price_d@2x.png" v-if="!codes[0].has">
          <img src="../../assets/images/img/img_price_n@2x.png" v-else>
          <p>价格体系管理</p>
        </div>
        <div class="box zcfrsz" @click.prevent="toLink(codes[2])" :class="!codes[2].has?'a-no':''">
          <img src="../../assets/images/img/img_ legal person_n@2x.png">
          <p>注册法人管理</p>
        </div>
        <div class="box jggl" @click.prevent="toLink(codes[3])" :class="!codes[3].has?'a-no':''">
          <img src="../../assets/images/img/img_organization_d@2x.png" v-if="!codes[3].has">
          <img src="../../assets/images/img/img_organization_n@2x.png" v-else>
          <p>机构管理</p>
        </div>
        <div class="box jsfp" @click.prevent="toLink(codes[4])" :class="!codes[4].has?'a-no':''">
          <img src="../../assets/images/img/img_role_d@2x.png" v-if="!codes[4].has">
          <img src="../../assets/images/img/img_role_n@2x.png" v-else>
          <p>角色管理</p>
        </div>
        <div class="box rygl" @click.prevent="toLink(codes[5])" :class="!codes[5].has?'a-no':''">
          <img src="../../assets/images/img/img_people_d@2x.png" v-if='!codes[5].has'>
          <img src="../../assets/images/img/img_people_n@2x.png" v-else>
          <p>人员管理</p>
        </div>
        <div class="line1 line">
          <img src="../../assets/images/img/img_line1@2x.png" alt="" width="168" height="54.2">
        </div>
        <div class="line2 line">
          <img src="../../assets/images/img/img_line2@2x.png" alt="" width="168" height="107.2">
        </div>
        <div class="line3 line">
          <img src="../../assets/images/img/img_line3@2x.png" alt="" width="168" height="107.2">
        </div>
      </div>
    </div>
    <transition
      name="custom-classes-transition"
      enter-active-class="animated slideInRight"
      leave-active-class="animated slideOutRight">
      <mendianList v-if="show"></mendianList>
    </transition>
    <div class="bottom" v-if="codes[6].has">
      <div class="one">
        <shop-data></shop-data>
      </div>
      <div class="two">
        <version-status></version-status>
      </div>
    </div>
  </div>
</template>
<script>
  import { mapGetters, mapMutations } from 'vuex'
  import ShopData from './ShopData.vue'
  import VersionStatus from './VersionStatus.vue'
  import mendianList from './mendianList.vue'
  export default {
    data () {
      return {
        systemfast: [],
        codes: [
          {
            modulId: '101002001',
            title: '品牌管理',
            has: false,
            router: '/brandManage',
            code: '101002001'
          },
          {
            modulId: '101002004',
            title: '价格体系管理',
            has: false,
            router: '/priceManage',
            code: '101002004'
          },
          {
            modulId: '101002003',
            title: '注册法人管理',
            has: false,
            router: '/legalManage',
            code: '101002003'
          },
          {
            modulId: '101002005',
            title: '机构管理',
            has: false,
            router: '/organizaManage',
            code: '101002005'
          },
          {
            modulId: '101003001',
            title: '角色管理',
            has: false,
            router: '/roleManage',
            code: '101003001'
          },
          {
            modulId: '101003002',
            title: '人员管理',
            has: false,
            router: '/personManage',
            code: '101003002'
          },
          {modulId: '101001', title: '首页数据统计', has: false}
        ]
      }
    },
    created () {
      if (this.authority && this.authority.length > 0) {
        this.getAuthority()
      }
    },
    computed: {
      ...mapGetters([
        'show'
      ]),
      authority () {
        return this.$store.getters.getAuthority
      }
    },
    watch: {
      authority () {
        this.getAuthority()
      }
    },
    methods: {
      ...mapMutations([
        'slideShow'
      ]),
      getAuthority () {
        this.systemfast = this.authority
        for (let i = 0; i < this.codes.length; i++) {
          let code = this.codes[i]
          for (let j = 0; j < this.systemfast.length; j++) {
            let item = this.systemfast[j]
            if (item.modulId === code.modulId) {
              code.has = true
            }
          }
        }
      },
      toLink (item) {
        if (item.has) {
          this.$store.dispatch('addNavTab', item)
          this.$router.push({path: item.router})
        } else {
          return false
        }
      }
    },
    components: {
      'shop-data': ShopData,
      'version-status': VersionStatus,
      mendianList
    }
  }
</script>
<style scoped>
  .index {
    overflow: auto;
    height: 100%;
    width: 100%;
    background: #F4F9FC;
  }
  .system-fastset {
    width: 1244px;
    height: 401px;
    background: #FFFFFF;
    border: 1px solid #EAF1F6;
  }
  el-row {
    width: 1244px;
  }
  .title {
    height: 42px;
    font-family: PingFangSC-Regular;
    font-size: 14px;
    color: #34495E;
    letter-spacing: 0;
    line-height: 42px;
    margin-left: 12px;
  }
  .system-fastset .split-line {
    height: 9.8px;
    width: 100%;
    opacity: 0.03;
    background-image: linear-gradient(-180deg, #434c94 0%, #ffffff 100%);
  }
  .system-fastset .bigbox {
    position: relative;
    height: 100%;
    top: -65px;
  }
  .system-fastset .box {
    width: 90px;
    height: 90px;
    position: absolute;
    padding: 9px 18px 27px 18px;
    margin-bottom: 3px;
    cursor: pointer;
    transition: all .4s;
  }
  .system-fastset .box p {
    font-family: PingFangSC-Regular;
    font-size: 12px;
    color: #FFFFFF;
    letter-spacing: 0;
    line-height: 12px;
    height: 12px;
    width: 72px;
    text-align: center;
    margin-left: -9px;
  }
  .system-fastset .box img {
    width: 54px;
    height: 54px;
  }
  .system-fastset .box.a-no {
    background: url("../../assets/images/img/bg_d@2x.png");
    background-size: 90px 90px;
    cursor: auto;
  }
  .system-fastset .box:hover {
    -webkit-transform: scale(1.1, 1.1);
    -moz-transform: scale(1.1, 1.1);
    -transform: scale(1.1, 1.1);
  }
  .system-fastset .ppsz {
    background-image: linear-gradient(45deg, #FF8C98 0%, #FF1D35 100%);
    border-radius: 5.45px;
    left: 176px;
    top: 144px;
  }
  .system-fastset .jgtxsz {
    background-image: linear-gradient(45deg, #FFCE62 0%, #FFAF00 100%);
    border-radius: 5.45px;
    left: 444px;
    top: 88px;
  }
  .system-fastset .zcfrsz {
    background-image: linear-gradient(45deg, #FF9A62 0%, #FF5B00 100%);
    border-radius: 5.45px;
    left: 444px;
    top: 217px;
  }
  .system-fastset .jsfp {
    background-image: linear-gradient(-45deg, #7F28EC 0%, #C0AAFE 100%);
    border: 1px solid #EAF1F6;
    left: 711px;
    top: 289px;
    border-radius: 5.45px;
  }
  .system-fastset .jggl {
    background-image: linear-gradient(45deg, #62B4FF 0%, #0084FF 100%);
    border-radius: 5.45px;
    left: 711px;
    top: 152px;
  }
  .system-fastset .rygl {
    background-image: linear-gradient(45deg, #63DD76 0%, #00C71E 100%);
    border-radius: 5.45px;
    right: 182px;
    top: 214px;
  }
  .line {
    position: absolute;
  }
  .line1 {
    left: 266px;
    top: 136.8px;
  }
  .line2 {
    left: 534px;
    top: 143px;
  }
  .line3 {
    left: 801px;
    top: 208px;
  }
  .bottom {
    width: 1244px;
    height: 370px;
    padding-top: 10px;
    box-sizing: border-box;
    background: #F4F9FC;
    display: flex;
  }
  .one {
    min-width: 650px;
    width: 650px;
    height: 360px;
    box-sizing: border-box;
    background-color: yellow;
  }
  .two {
    min-width: 584px;
    width: 584px;
    height: 360px;
    box-sizing: border-box;
    margin-left: 10px;
  }
</style>
