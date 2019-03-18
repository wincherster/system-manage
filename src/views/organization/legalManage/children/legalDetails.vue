<style lang="less" scoped>
  @import "./legalDetails.less";
</style>
<template>
  <div class="legaldetails">
    <div class="shade"></div>
    <div class="check-box">
      <div class="check-header">
        <h3 class="clearfix">
          法人 {{form.legal_per_name}} 详情
        </h3>
      </div>
      <div class="check-body">
        <div class="check-main">
          <div class="content">
            <p>法人名称：<span v-text="form.legal_per_name"></span></p>
            <p>法人代码：<span v-text="form.legal_per_code"></span></p>
            <p v-if="form.is_billing === '1'">电子发票对接商：<span>{{form.docking_merchants === '1' ? '用友'
                                  : form.docking_merchants === '2' ? '百旺电子发票'
                                  : form.docking_merchants === '3' ? '瑞宏'
                                  : ''}}</span></p>
            <p v-if="form.is_billing === '1' && form.docking_merchants ==='2'">纳税人识别号证书：<span v-text="form.certificate_url"></span></p>
            <p v-if="form.is_billing === '1' && form.docking_merchants ==='2'">证书密码：<span v-text="form.certificate_pwd"></span></p>
            <p v-if="form.is_billing === '1' && form.docking_merchants ==='2'">微信开票第三方ID：<span v-text="form.wechat_party_id"></span></p>
            <p v-if="form.is_billing === '1' && form.docking_merchants ==='2'">微信开票秘钥：<span v-text="form.wechat_invoice_key"></span></p>
            <p v-if="form.is_billing === '1'">发票明细：<span v-text="form.invoice_name"></span></p>
            <p v-if="form.is_billing === '1'">纳税人属性：<span v-text="form.class_item"></span></p>
            <p v-if="form.is_billing === '1'">税率：<span v-text="form.tax_rate"></span></p>
            <p v-if="form.is_billing === '1'">销售方纳税人识别号：<span v-text="form.cnpj"></span></p>
            <p v-if="form.is_billing === '1'">销售方名称：<span v-text="form.seller_name"></span></p>
            <p v-if="form.is_billing === '1'">销售方地址：<span v-text="form.seller_address"></span></p>
            <p v-if="form.is_billing === '1'">销售方电话：<span v-text="form.seller_number"></span></p>
            <p v-if="form.is_billing === '1'">销售方银行账号：<span v-text="form.bank"></span></p>
            <p>备注：<span class="info" v-text="form.remark"></span></p>
            <p v-if="form.storeCount !=0">所含门店：<el-button style="font-family: PingFangSC-Regular;font-size: 14px;color: #0C9AFF;line-height: 14px;" slot="reference" class="item" @click="searchStore()">{{form.storeCount}}家</el-button>
            </p>
            <p v-else>所含门店：0</p>
          </div>
          <div class="button-box">
            <div class="btn-box">
              <el-button @click="cancel()">取消</el-button>
              <el-button type="primary" @click="edit" class="bj">编辑</el-button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
  export default {
    created () {
      this.getDataById()
    },
    data () {
      return {
        form: {
          legal_per_name: '',
          legal_per_code: '',
          docking_merchants: '',
          certificate_url: '',
          certificate_pwd: '',
          wechat_party_id: '',
          wechat_invoice_key: '',
          invoice_name: '',
          class_item: '',
          tax_rate: '',
          cnpj: '',
          seller_name: '',
          seller_address: '',
          seller_number: '',
          bank: '',
          remark: '--',
          id: '',
          storeCount: '',
          is_billing: ''
        }
      }
    },
    methods: {
      searchStore: function () {
        this.$emit('close', {istrue: true, id: this.id, name: this.form.legal_per_name, count: this.form.storeCount})
      },
      edit: function () {
        this.$emit('close')
        this.$store.cacheData = {}
        this.$store.cacheData = {id: this.id}
        this.$router.push('/editLegalManage')
      },
      cancel: function () {
        this.$emit('close')
      },
      close: function () {
        this.$emit('close')
      },
      getDataById: function () {
        let self = this
        this.$http.post('/api/organization/legalPerson/getLegalPerDetail', {id: self.id}).then(function (res) {
          if (res.data.code === '0') {
            console.info(JSON.stringify(res.data, null, 2))
            self.form = res.data.data
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
    },
    props: ['id']
  }
</script>

