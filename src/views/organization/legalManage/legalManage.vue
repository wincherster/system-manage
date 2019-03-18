<template>
  <div class="main-container" id="iegalManage">
    <div class="main-header">
      <div class="search-box">
        <el-input v-model="search" class="input-with-select" @keyup.enter.native="searchClick">
          <el-select v-model="select" slot="prepend" popper-class="search-select">
            <el-option label="代码" value="legalPerCode"></el-option>
            <el-option label="名称" value="legalPerName"></el-option>
            <el-option label="识别码" value="cnpj"></el-option>
          </el-select>
          <el-button slot="suffix" icon="el-icon-search" @click="searchClick"></el-button>
        </el-input>
      </div>
      <legalDetails v-if="showLegalDetails" v-on:close="closeLegalDetails" :id="id"></legalDetails>
      <legalStore v-if="showLegalStore" v-on:close="closeLegalStore" :id="id" :count="count" :name="name"
                  :showLegalStore="showLegalStore"></legalStore>
      <allot v-if="showAllot" v-on:close="closeAllot" :id="id" :name="name" :showAllot="showAllot"></allot>
      <div class="add-box" v-if="hasAuthoritys.indexOf('101002003000001') > -1">
        <button type="button" @click="edit(0)" class="saasbtn saasbtn-newadd newadd">
          <span class="saas saas-button-add saasbtn-icon-newadd"></span>新增法人
        </button>
      </div>
    </div>
    <div class="main-body">
      <div class="body-table">
        <el-table
          :data="dataList"
          style="width: 100%;min-height: 360px;"
          current-row-key="id"
          empty-text=" "
          tooltip-effect="islight"
          @row-dblclick="checkData"
          @sort-change="sort"
          @filter-change="filterchange"
          max-height="100%"
        >
          <el-table-column
            prop="legal_per_name"
            label="法人名称"
            class="legalpername"
            min-width="110"
            show-overflow-tooltip
            sortable="custom"
            align="left">
            <template slot-scope="scope">
              <div slot="reference" class="name-wrapper">
                <div class="showTip" style="overflow: hidden" @click="checkData(scope.row)">
                  {{scope.row.legal_per_name}}
                </div>
              </div>
            </template>
          </el-table-column>
          <el-table-column
            prop="legal_per_code"
            label="法人代码"
            width="140"
            show-overflow-tooltip
            align="left">
          </el-table-column>
          <el-table-column
            prop="storecount"
            label="所含机构"
            width="120"
            align="center">
            <template slot-scope="scope">
              <el-popover trigger="hover" v-if="scope.row.storecount>0">
                点击查看机构列表
                <div slot="reference" class="name-wrapper">
                  <div class="showTip" style="text-align: center" @click="lookStore(scope.row)">
                    {{ scope.row.storecount + '家'}}
                  </div>
                </div>
              </el-popover>
              <div v-else> {{ scope.row.storecount}}</div>
            </template>
          </el-table-column>
          <el-table-column
            label="销售方信息"
            align="center"
          >
            <el-table-column
              prop="cnpj"
              label="销售方纳税人识别号"
              min-width="200"
              show-overflow-tooltip
              align="left">
            </el-table-column>
            <el-table-column
              prop="seller_name"
              label="销售方名称"
              min-width="240"
              show-overflow-tooltip
              align="left">
            </el-table-column>
            <el-table-column
              prop="seller_number"
              label="销售方电话"
              width="140"
              show-overflow-tooltip
              label-class-name="thirdPhone"
              align="left">
            </el-table-column>
          </el-table-column>
          <el-table-column
            prop="tag"
            column-key='state'
            label="状态"
            align="center"
            width="100"
            :filters="[{ text: '有效', value: '1' }, { text: '停用', value: '0' }]"
            :filter-method="filterValidState"
            :filter-multiple="false"
            filter-placement="bottom-start"
          >
            <template slot-scope="scope">
              <el-tag v-if='scope.row.valid_state === "1"' type="success">有效</el-tag>
              <el-tag v-else-if='scope.row.valid_state === "0"' type="danger">停用</el-tag>
            </template>
          </el-table-column>
          <el-table-column
            fixed="right"
            label="操作"
            width="134"
            v-if="hasAuthoritys.indexOf('101002003000003') > -1 || hasAuthoritys.indexOf('101002003000004') > -1 || hasAuthoritys.indexOf('101002003000006') > -1"
            align="center">
            <template slot-scope="scope">
              <el-button @click="edit(scope.row.id)" type="text" size="small"
                         v-if="hasAuthoritys.indexOf('101002003000002') > -1">编辑
              </el-button>
              <el-button style="margin-left: 6px" type="text" size="small" @click="disable(scope.row.id)"
                         v-if="scope.row.valid_state === '0' && hasAuthoritys.indexOf('101002003000003') > -1">
                启用
              </el-button>
              <el-button style="margin-left: 6px" type="text" size="small"
                         v-if="scope.row.valid_state === '1' && hasAuthoritys.indexOf('101002003000003') > -1"
                         @click="enable(scope.row.id)">
                停用
              </el-button>
              <el-button style="margin-left: 6px" type="text" size="small" @click="del(scope.row.id)"
                         v-if="scope.row.valid_state === '0' && hasAuthoritys.indexOf('101002003000004') > -1">删除
              </el-button>
              <el-button style="margin-left: 6px" type="text" size="small" @click="allot(scope.row)"
                         v-if="scope.row.valid_state === '1' && hasAuthoritys.indexOf('101002003000006') > -1">分配
              </el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </div>
    <div class="pagination tzx-pagination-container">
      <el-pagination
        background
        prev-text='上一页'
        next-text='下一页'
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="pagination.page"
        :page-sizes="[10, 20, 30, 40, 50]"
        :page-size="pagination.pageSize"
        layout="prev, pager, next, total, jumper, sizes"
        :total="pagination.total">
      </el-pagination>
    </div>
  </div>
</template>
<script>
  import legalDetails from './children/legalDetails.vue'
  import legalStore from './children/legalStore.vue'
  import allot from './children/allot.vue'
  export default {
    props: [],
    data () {
      return {
        pagination: {page: 1, pageSize: 10, total: 0, sort: 'legal_per_name', order: 'desc'},
        dataList: [],
        search: '',
        select: 'legalPerCode',
        showLegalDetails: false,
        showLegalStore: false,
        showAllot: false,
        id: '',
        state: '',
        count: 0,
        name: ''
      }
    },
    computed: {
      authority () {
        return this.$store.getters.getAuthority
      },
      hasAuthoritys () {
        let arr = []
        this.authority.forEach(item => {
          if (item.fatherModulId === '101002003') {
            arr.push(item.modulId)
          }
        })
        return arr
      }
    },
    components: {
      legalDetails, legalStore, allot
    },
    methods: {
      filterchange (filters) {
        for (let k in filters) {
          this[k] = filters[k][0]
        }
        this.getTableInfo()
        return true
      },
      getTableInfo: function () {
        let self = this
        this.$http.post('/api/organization/legalPerson/load', {
          pagination: self.pagination,
          form: {validState: self.state, [self.select]: self.search}
        }).then(function (res) {
          if (res.data.code === '0') {
            self.dataList = res.data.data.rows
            self.pagination.total = res.data.data.total
          } else {
            self.$message({
              message: res.data.msg,
              type: 'error'
            })
          }
        }).catch(function (err) {
          self.$message({
            message: err.msg,
            type: 'error'
          })
        })
      },
      sort (item) {
        if (item.order) {
          this.pagination.order = item.order.replace('ending', '')
        } else {
          this.pagination.order = ''
        }
        this.getTableInfo()
      },
      getStart () {
        let self = this
        this.$http.post('/api/organization/legalPerson/start', {id: this.id}).then(function (res) {
          if (res.data.code === '0') {
            self.getTableInfo()
            self.$message({
              message: '启用成功',
              type: 'success'
            })
          } else {
            self.$message({
              message: res.data.msg,
              type: 'error'
            })
          }
        }).catch(function (err) {
          self.$message({
            message: err.msg,
            type: 'error'
          })
        })
      },
      getStop () {
        let self = this
        this.$http.post('/api/organization/legalPerson/stop', {id: this.id}).then(function (res) {
          if (res.data.code === '0') {
            self.getTableInfo()
            self.$message({
              message: '停用成功',
              type: 'success'
            })
          } else {
            self.$message({
              message: res.data.msg,
              type: 'error'
            })
          }
        }).catch(function (err) {
          self.$message({
            message: err.msg,
            type: 'error'
          })
        })
      },
      getDel () {
        const h = this.$createElement
        this.$http
          .post('/api/organization/legalPerson/deleteLegalPer', {id: this.id, ok: 0})
          .then(res => {
            if (res.data.code === '1003') {
              this.$msgbox({
                title: '',
                type: 'warning',
                message: h('div', null, [h('span', null, '您确认要删除此法人信息？')]),
                showCancelButton: true,
                cancelButtonText: '取消',
                confirmButtonText: '确定'
              })
                .then(action => {
                  this.$http
                    .post('/api/organization/legalPerson/deleteLegalPer', {id: this.id, ok: 1})
                    .then(res => {
                      if (res.data.code === '0') {
                        this.$message({type: 'success', message: res.data.msg})
                        this.getTableInfo()
                      } else {
                        this.$message({type: 'error', message: res.data.msg})
                      }
                    })
                    .catch(err => {
                      this.$message({type: 'error', message: err.msg})
                    })
                })
                .catch(cancel => {})
            } else {
              this.$msgbox({
                title: '',
                type: 'info',
                message: h('div', null, [
                  h('p', null, '此法人被以下机构引用，不能删除'),
                  h('p', {style: 'text-align: center;margin-left: -34px;font-size: 14px;color: #758896;line-height: 20px;'}, res.data.data[0].storename),
                  h('p', {style: 'text-align: center;margin-left: -34px;font-size: 14px;color: #758896;line-height: 20px;'}, res.data.data[1] ? res.data.data[1].storename : ''),
                  h('p', {style: 'text-align: center;margin-left: -34px;font-size: 14px;color: #758896;line-height: 20px;'}, res.data.data[2] ? res.data.data[2].storename : ''),
                  h('p', {style: 'text-align: center;margin-left: -34px;font-size: 14px;color: #758896;line-height: 20px;'}, res.data.data.length > 3 ? '……' : '')
                ]),
                confirmButtonText: '知道了',
                confirmButtonClass: 'saasbtn saasbtn-default',
                showClose: false
              })
            }
          })
          .catch(err => {
            this.$message({type: 'error', message: err.msg})
          })
      },
      handleSizeChange (val) {
        this.pagination.pageSize = val
        this.getTableInfo()
      },
      handleCurrentChange (val) {
        this.pagination.page = val
        this.getTableInfo()
      },
      checkData: function (row) {
        if (this.hasAuthoritys.indexOf('101002003000005') > -1) {
          this.id = row.id
          this.count = row.storecount
          this.name = row.legal_per_name
          this.showLegalDetails = true
        } else {
          this.$message({
            type: 'warning',
            message: '未获得查看权限'
          })
        }
      },
      searchClick: function () {
        this.getTableInfo()
      },
      closeLegalDetails: function (...args) {
        this.showLegalDetails = false
        if (args.length > 0) {
          this.id = args[0].id
          this.showLegalStore = args[0].istrue
          this.name = args[0].name
          this.count = args[0].count
        }
      },
      lookStore (row) {
        this.id = row.id
        this.name = row.legal_per_name
        this.count = row.storecount
        this.showLegalStore = true
      },
      closeLegalStore () {
        this.showLegalStore = false
      },
      closeAllot () {
        this.showAllot = false
      },
      allot (row) {
        this.name = row.legal_per_name
        this.id = row.id
        this.showAllot = true
      },
      del (id) {
        this.id = id
        this.getDel()
      },
      disable (id) {
        this.id = id
        this.getStart()
      },
      enable (id) {
        this.id = id
        this.getStop()
      },
      edit (id) {
        this.$store.state.cacheData = {}
        this.$store.state.cacheData = {id: id}
        this.$router.push('/editLegalManage')
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
      },
      filterValidState (value, row) {
        return row.valid_state === value
      }
    },
    created () {
      if (this.$store.state.cacheData.sort) {
        this.pagination.sort = this.$store.state.cacheData.sort
        this.$store.state.cacheData = ''
      }
      this.getTableInfo()
    }
  }
</script>
<style type='text/less' lang='less' scoped>
  @import "./legalManage.less";
</style>
