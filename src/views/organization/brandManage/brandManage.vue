<template>
  <div class="ppgl">
    <div class="brand-container">
      <el-row>
        <el-col :span="8" v-for="(item,index) in dataList" :key="item.id">
          <div class="box" @dblclick="checkData(item)" :class="{'stop' : item.valid_state==0}">
            <div class="left">
              <div class="pic">
                <img :src="item.logoimage" alt="" v-if="item.logoimage">
                <img src="../../../assets/images/img/branddefault.png" v-else>
              </div>
              <p class="num">
                <span>{{ item.storeCount }}</span><b>家店铺</b>
              </p>
            </div>
            <div class="right">
              <div class="btn">
                  <span v-if="item.valid_state==1 && hasAuthoritys.indexOf('101002001000003') > -1" class="saas saas-stop" @click="close(item.id)"><span><i>禁用</i></span></span>
                  <span v-if="item.valid_state==0 && hasAuthoritys.indexOf('101002001000003') > -1" class="saas saas-start" @click="open(item.id)"><span><i>启用</i></span></span>
                  <span v-if="hasAuthoritys.indexOf('101002001000002') > -1" class="saas saas-edit" @click="addData(item)"><span><i>编辑</i></span></span>
              </div>
              <div class="title">
                {{ item.org_full_name }}
              </div>
              <div class="topic">
  <span
    :class="{[item.format_state == 1 ? 'zc' : 'fast']:true, 'stop': item.valid_state==0}">{{ item.format_state_name
    }}</span>
                <span class="fire" v-if="item.name">{{ item.name }}</span>
              </div>
              <div class="info">
                {{ item.remark }}
              </div>
            </div>
          </div>
        </el-col>
        <el-col :span="8" v-if="hasAuthoritys.indexOf('101002001000001') > -1">
          <div class="box last" @click="addData()">
            <div class="add">
              <i class="saas saas-button-add"></i>
              <p>新增品牌</p>
            </div>
          </div>
        </el-col>
      </el-row>
    </div>
    <editBrandManage v-if="showEditBrandManage" v-on:close="closeEditBrandManage"
                     :itemdata="itemdata"></editBrandManage>
    <brandDetails v-if="showBrandDetails" v-on:close="closeBrandDetails" :itemdata="itemdata"></brandDetails>
  </div>
</template>
<style type="text/less" lang="less" scoped>
  @import "./brandManage.less";
</style>
<style lang="less">
  .el-popover.el-popper.brandIcon {
    position: absolute;
    background: #fff;
    min-width: 20px;
    border: 1px solid #e6ebf5;
    z-index: 2000;
    color: #5a5e66;
    line-height: 1.4;
    text-align: justify;
    word-break: break-all;
    font-size: 14px;
    padding: 2px 6px;
    -webkit-box-shadow: 0 2px 12px 0 rgba(0, 0, 0, .1);
    box-shadow: 0 2px 12px 0 rgba(0, 0, 0, .1);
  }
</style>
<script>
  import editBrandManage from './children/editBrandManage.vue'
  import brandDetails from './children/brandDetails.vue'
  export default {
    created () {
      this.getlist()
    },
    data () {
      return {
        dataList: [],
        showEditBrandManage: false,
        showBrandDetails: false,
        status: true,
        itemdata: {},
        defaultImg: '../../../assets/images/img/branddefault.png'
      }
    },
    methods: {
      getlist: function () {
        let self = this
        this.$http.post('/api/organization/brand/load', {
          pagination: {
            page: 1,
            pageSize: 99
          }
        }).then(function (res) {
          if (res.data.code === '0') {
            self.dataList = res.data.data.rows || []
            self.total = res.data.data.total || 0
          } else if (res.data.msg) {
            self.$message({
              message: res.data.msg,
              type: 'error'
            })
          }
        }).catch(function (err) {
          if (err) {
            self.$message({type: 'error', message: err.msg})
          }
        })
      },
      open: function (id) {
        let self = this
        this.$http.post('/api/organization/brand/start', {id: id})
          .then(function (res) {
            if (res.data.code === '0') {
              self.getlist()
              self.$message({type: 'success', message: '启用成功'})
            } else if (res.data.msg) {
              self.$message({
                message: res.data.msg,
                type: 'error'
              })
            }
          })
          .catch(function (err) {
            if (err) {
              self.$message({type: 'error', message: err.msg})
            }
          })
      },
      close: function (id) {
        let self = this
        this.$http.post('/api/organization/brand/stop', {id: id})
          .then(function (res) {
            if (res.data.code === '0') {
              self.getlist()
              self.$message({type: 'success', message: '停用成功'})
            } else if (res.data.code === '1006') {
              self.showMessageInfoBox('此品牌有正常营业的门店，请先停用门店后再操作')
            } else if (res.data.msg) {
              self.$message({
                message: res.data.msg,
                type: 'error'
              })
            }
          })
          .catch(function (err) {
            if (err) {
              self.$message({type: 'error', message: err.msg})
            }
          })
      },
      addData: function (item) {
        this.showEditBrandManage = true
        if (item) {
          this.itemdata = item
        } else {
          this.itemdata = {}
        }
      },
      closeEditBrandManage: function (flag) {
        this.showEditBrandManage = false
        if (flag) this.getlist()
      },
      checkData: function (item) {
        if (this.hasAuthoritys.indexOf('101002001000005') > -1) {
          this.showBrandDetails = true
          this.itemdata = item
        } else {
          this.$message({
            type: 'warning',
            message: '未获得查看权限'
          })
        }
      },
      closeBrandDetails: function (flag) {
        this.showBrandDetails = false
        if (flag) this.showEditBrandManage = true
        else this.itemdata = {}
      },
      showMessageInfoBox (msg) {
        const h = this.$createElement
        this.$msgbox({
          title: '',
          type: 'info',
          message: h('div', null, [h('p', null, msg)]),
          confirmButtonText: '知道了',
          confirmButtonClass: 'saasbtn saasbtn-default',
          showClose: false
        })
      }
    },
    components: {
      'editBrandManage': editBrandManage,
      'brandDetails': brandDetails
    },
    computed: {
      authority () {
        return this.$store.getters.getAuthority
      },
      hasAuthoritys () {
        let arr = []
        this.authority.forEach(item => {
          if (item.fatherModulId === '101002001') {
            arr.push(item.modulId)
          }
        })
        return arr
      }
    }
  }
</script>

