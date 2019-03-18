<template>
  <div class="main-container" id="cuisinemaitnt">
    <div class="main-header">
      <div class="search-box">
        <el-input v-model="search" class="input-with-select" @keyup.enter.native="getDataList">
          <el-select v-model="select" slot="prepend" popper-class="search-select">
            <el-option label="菜系" value="name"></el-option>
            <el-option label="编号" value="code"></el-option>
          </el-select>
          <el-button slot="suffix" icon="el-icon-search" @click="getDataList"></el-button>
        </el-input>
      </div>
      <cuisineMaintDetails v-if="showCuisineMaintDetails" v-on:close="closeCuisineMaintDetails"
                           :rowdata="rowdata"></cuisineMaintDetails>
      <div class="add-box" v-if="hasAuthoritys.indexOf('101004002000001') > -1">
        <button type="button" @click="addData()" class="saasbtn saasbtn-newadd newadd">
          <span class="saas saas-button-add saasbtn-icon-newadd"></span>新增
        </button>
        <editCuisineMaint v-if="showCuisineMaint" v-on:close="closeEditCuisineMaint"
                          :rowdata="rowdata"></editCuisineMaint>
      </div>
    </div>
    <div class="main-body">
      <div class="body-table">
        <el-table
          :data="dataList"
          style="width: 100%;min-height: 360px"
          @row-dblclick="checkData"
          @filter-change="stateChange"
          empty-text=" "
          tooltip-effect="islight"
          height>
          <el-table-column
            label="序号"
            type="index"
            width="70"
            align="center">
          </el-table-column>
          <el-table-column
            prop="code"
            label="菜系编码"
            min-width="100"
            show-overflow-tooltip
            align="center">
          </el-table-column>
          <el-table-column
            prop="name"
            label="菜系名称"
            min-width="120"
            align="left">
            <template slot-scope="scope">
              <div slot="reference" class="name-wrapper">
                <div @click="checkData(scope.row)" class="showTip">{{ scope.row.name}}</div>
              </div>
            </template>
          </el-table-column>
          <el-table-column
            label="状态"
            prop='state'
            width="100"
            :filters="[{ text: '有效', value: '1' }, { text: '无效', value: '0' }]"
            :filter-multiple="false"
            column-key="state"
            filter-placement="bottom-start">
            <template slot-scope="scope">
              <el-tag v-if='scope.row.state === 1' type="success">有效</el-tag>
              <el-tag v-else type="danger">无效</el-tag>
            </template>
          </el-table-column>
          <el-table-column
            prop="remark"
            label="备注"
            min-width="120"
            show-overflow-tooltip
            align="left">
          </el-table-column>
          <el-table-column
            label="操作"
            v-if="hasAuthoritys.indexOf('101004002000002') > -1 || hasAuthoritys.indexOf('101004002000003') > -1 || hasAuthoritys.indexOf('101004002000004') > -1"
            width="134"
            align="center">
            <template slot-scope="scope">
              <el-button @click="addData(scope.row)" type="text" size="small"
                         v-if="hasAuthoritys.indexOf('101004002000002') > -1">编辑
              </el-button>
              <el-button type="text" size="small"
                         v-if="scope.row.state==1 && hasAuthoritys.indexOf('101004002000003') > -1"
                         @click="stop(scope.row.id)">停用
              </el-button>
              <el-button type="text" size="small"
                         v-if="scope.row.state==0 && hasAuthoritys.indexOf('101004002000003') > -1"
                         @click="start(scope.row.id)">启用
              </el-button>
              <el-button type="text" size="small" @click="delCuisine(scope.row)"
                         v-if="scope.row.state==0 && hasAuthoritys.indexOf('101004002000004') > -1">删除
              </el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </div>
    <div class="pagination tzx-pagination-container" style="min-height: 70px">
      <el-pagination
        background
        prev-text='上一页'
        next-text='下一页'
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page.sync="currentPage"
        :page-sizes="[10, 20, 30, 40,50]"
        :page-size="pageSize"
        layout="prev, pager, next, total,  jumper, sizes"
        :total="total">
      </el-pagination>
    </div>
  </div>
</template>
<script>
  import editCuisineMaint from './children/editCuisineMaint.vue'
  import cuisineMaintDetails from './children/cuisineMaintDetails.vue'
  export default {
    name: 'cuisinemaitnt',
    props: [],
    data () {
      return {
        showCuisineMaint: false,
        showCuisineMaintDetails: false,
        search: '',
        select: 'name',
        currentPage: 1,
        pageSize: 10,
        dataList: [],
        rowdata: '',
        total: 0,
        state: ''
      }
    },
    computed: {
      authority () {
        return this.$store.getters.getAuthority
      },
      hasAuthoritys () {
        let arr = []
        this.authority.forEach(item => {
          if (item.fatherModulId === '101004002') {
            arr.push(item.modulId)
          }
        })
        return arr
      }
    },
    components: {
      editCuisineMaint, cuisineMaintDetails
    },
    methods: {
      checkData: function (row) {
        if (this.hasAuthoritys.indexOf('101004002000005') > -1) {
          let self = this
          this.$http.post('/api/cuisine/maintain/details', {
            id: row.id,
            code: row.code
          }).then(function (res) {
            if (res.data.code) {
              self.rowdata = res.data
              self.showCuisineMaintDetails = true
            }
          }).catch(function (err) {
            self.$message({type: 'error', message: err.msg})
          })
        } else {
          this.$message({
            type: 'warning',
            message: '未获得查看权限'
          })
        }
      },
      closeCuisineMaintDetails: function (...arg) {
        this.showCuisineMaintDetails = false
        if (arg.length > 0) {
          this.showCuisineMaint = arg[0]
          this.rowdata = arg[1]
        } else {
          this.rowdata = {}
        }
      },
      handleSizeChange (val) {
        this.pageSize = val
        this.getDataList()
      },
      handleCurrentChange (val) {
        this.currentPage = val
        this.getDataList()
      },
      addData: function (row) {
        if (row) {
          this.rowdata = row
        } else {
          this.rowdata = {}
        }
        this.showCuisineMaint = true
      },
      closeEditCuisineMaint: function () {
        this.showCuisineMaint = false
        this.getDataList()
        this.$store.state.cacheData = {}
      },
      getDataList () {
        let self = this
        this.$http.post('/api/cuisine/maintain/load',
          {
            pagination: {
              page: this.currentPage,
              pageSize: this.pageSize
            },
            form: {
              [this.select]: this.search,
              state: this.state
            }
          }
        ).then(function (res) {
          self.dataList = res.data.data.data
          self.total = res.data.data.totalCount
        }).catch(function (err) {
          self.$message({type: 'error', message: err.msg})
        })
      },
      stop (id) {
        let self = this
        this.$http.post('/api/cuisine/maintain/stop', {
          id: id
        }).then(function (res) {
          if (res.data.code === '0') {
            self.getDataList()
            self.$message({
              type: 'success',
              message: '停用成功'
            })
          } else {
            self.$message({
              type: 'info',
              message: res.data.msg
            })
          }
        }).catch(function (err) {
          self.$message({type: 'error', message: err.msg})
        })
      },
      start (id) {
        let self = this
        this.$http.post('/api/cuisine/maintain/start', {
          id: id
        }).then(function (res) {
          if (res.data.code === '0') {
            self.getDataList()
            self.$message({
              type: 'success',
              message: '启用成功'
            })
          } else {
            self.$message({
              type: 'info',
              message: res.data.msg
            })
          }
        }).catch(function (err) {
          self.$message({type: 'error', message: err.msg})
        })
      },
      delCuisine (row) {
        const self = this
        self.$http.post('/api/cuisine/maintain/delCuisine', {
          code: row.code,
          id: row.id
        }).then(function (res) {
          if (res.data.code === '1') {
            self.$confirm('您确认要删除此菜系？', '', {
              confirmButtonText: '确定',
              cancelButtonText: '取消',
              type: 'warning',
              showClose: false,
              beforeClose: (action, instance, done) => {
                if (action === 'confirm') {
                  instance.confirmButtonLoading = true
                  instance.confirmButtonText = '执行中...'
                  self.$http.post('/api/cuisine/maintain/delCuisine', {'code': row.code, type: 'T'})
                    .then(function (res) {
                      done()
                      instance.confirmButtonLoading = false
                      self.$message({
                        message: '此菜系已删除',
                        type: 'success',
                        duration: 2000
                      })
                      self.getDataList()
                    })
                    .catch(function (err) {
                      done()
                      self.$message({
                        message: err.msg,
                        type: 'error',
                        duration: 2000
                      })
                    })
                } else {
                  done()
                }
              }
            }).catch(() => {
              self.$message({
                message: '已取消删除',
                type: 'info',
                duration: 1000
              })
            })
          } else if (res.data.code === '3') {
            const h = self.$createElement
            self.$msgbox({
              title: '',
              confirmButtonText: '知道了',
              confirmButtonClass: 'saasbtn saasbtn-default',
              message: h('div', null, [
                h('p', null, '此菜系已被引用,不能删除！')
              ]),
              type: 'error',
              showClose: false
            })
          }
        })
          .catch(function (err) {
            self.$message({
              message: err.msg,
              type: 'error'
            })
          })
      },
      stateChange (filters) {
        this.state = filters.state[0]
        this.getDataList()
      }
    },
    created () {
      this.getDataList()
    }
  }
</script>
<style type='text/less' lang='less' scoped>
  @import "./cuisineMaint.less";
</style>

