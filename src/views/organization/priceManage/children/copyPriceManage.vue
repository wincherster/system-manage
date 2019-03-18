<style lang="less" scoped>
  @import "./copyPriceManage.less";
</style>
<style lang="less">
  .pricedetails{
    .el-checkbox{
      background: #FEFEFE;
      .el-checkbox__input{
        .el-checkbox__inner{
          border-radius: 50%;
        }
      }
    }
    .box:hover{
      .el-checkbox{
        background: #F7F9FB;
      }
    }
  }
</style>
<template>
  <div class="pricedetails">
    <div class="shade"></div>
    <div class="check-box">
      <div class="check-header">
        <h3 class="clearfix">
          复制到以下品牌
          <i class="saas saas-nav-closehover" @click="close" style="cursor:pointer;"></i>
        </h3>
      </div>
      <div class="check-body">
        <div class="check-main">
          <div class="content">
            <el-checkbox-group v-model="checkList">
              <div class="box" v-for="(item,index) in brandList" :key="item.id">
                <div class="checkBtn">
                  <el-checkbox :label="item" style="width: 20px;height: 20px;overflow: hidden"></el-checkbox>
                </div>
                <div class="pic">
                  <img :src="item.logoimage" alt="" v-if="item.logoimage">
                  <img src="../../../../assets/images/img/branddefault.png" alt="" v-else>
                </div>
                <div class="right">
                  <p class="pinpai">{{item.org_full_name}}</p>
                  <div class="tip">
                    <span :class="{[item.format_state == 1 ? 'zc' : 'fast']:true}">{{item.format_state_name}}</span>
                    <span class="name" v-if="item.name">{{item.name}}</span>
                  </div>
                  <div class="bottom">
                    <span><i>{{item.storeCount}}</i>家店铺</span>
                  </div>
                </div>
              </div>
            </el-checkbox-group>
            <div class="button-box">
              <div class="btn-box">
                <el-button @click="cancel()">取消</el-button>
                <el-button type="primary" @click="open">确定</el-button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
  export default {
    data () {
      return {
        checked1: true,
        brandList: [],
        checkList: []
      }
    },
    created () {
      this.getDataList()
    },
    props: ['selections'],
    methods: {
      cancel: function () {
        this.$emit('close')
      },
      close: function () {
        this.$emit('close')
      },
      open () {
        const self = this
        this.$http.post('/api/organization/priceSystem/copy', {
          priceSystems: this.selections,
          brands: this.checkList
        }).then(function (res) {
          if (res.data.code === '0') {
            self.$message({
              type: 'success',
              message: '保存成功'
            })
            self.$emit('close')
          } else if (res.data.code === '1002') {
            self.$message({
              type: 'error',
              message: '该价格体系已经复制过不能再次复制！'
            })
          } else {
            self.$message({
              message: res.data.msg,
              type: 'error'
            })
          }
        }).catch(function (err) {
          console.info(err)
          self.$message({
            message: '网络错误',
            type: 'error'
          })
        })
      },
      getDataList: function () {
        let self = this
        this.$http.post('/api/organization/brand/load', {
          pagination: {
            page: 1,
            pageSize: 9999999
          }
        }).then(function (res) {
          if (res.data.code === '0') {
            self.brandList = res.data.data.rows
          } else {
            self.$message({
              message: res.data.msg,
              type: 'error'
            })
          }
        }).catch(function (err) {
          console.info(err)
          self.$message({
            message: '网络错误',
            type: 'error'
          })
        })
      }
    }
  }
</script>

