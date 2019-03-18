<style lang="less" scoped>
  @import "./priceDetails.less";
</style>
<template>
  <div class="pricedetails">
    <div class="shade"></div>
    <div class="check-box">
      <div class="check-header">
        <h3 class="clearfix">
          <span>{{rowdata.price_system_name}}</span>价格体系所含门店
          <i class="iconfont saas saas-nav-closehover" @click="close" style="cursor:pointer;"></i>
        </h3>
      </div>
      <div class="check-body">
        <div class="check-main">
          <div class="content">
            <el-tree :data="dataList" :props="defaultProps" @node-click="handleNodeClick" default-expand-all></el-tree>
          </div>
          <div class="button-box">
            <div class="btn-box">
              所含门店合计：<span>{{rowdata.storeCount}}</span>家
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
        dataList: [],
        defaultProps: {
          children: 'children',
          label: function (data, node) {
            console.log(data)
            if (data.org_type === '3') {
              return data.orgfullname
            } else {
              return data.orgfullname + '  ( ' + data.priceSystemStoreCount + '/' + data.total + ' )'
            }
          }
        },
        total: 0
      }
    },
    created () {
      this.getTreeList()
    },
    props: ['rowdata'],
    methods: {
      handleNodeClick (data) {
        console.log(data)
      },
      edit: function () {
        this.$emit('close')
      },
      cancel: function () {
        this.$emit('close')
      },
      close: function () {
        this.$emit('close')
      },
      getTreeList () {
        const self = this
        this.$http.post('/api/organization/priceSystem/getStoreTree', {
          id: this.rowdata.id,
          brand_id: this.rowdata.brand_id
        }).then(function (res) {
          if (res.data.code === '0') {
            console.log(res.data)
            self.dataList = [
              res.data.data
            ]
          }
        })
      }
    }
  }
</script>


