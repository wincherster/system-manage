<template>
  <div class="main-container" id="personPosition">
    <div class="main-header">
      <div class="search-box">
        <el-input v-model="search" class="input-with-select" @keyup.enter.native="getDataList">
          <el-select v-model="select" slot="prepend" popper-class="search-select">
            <el-option label="职位" value="classItem"></el-option>
            <el-option label="编号" value="classItemCode"></el-option>
          </el-select>
          <el-button slot="suffix" icon="el-icon-search" @click='getDataList'></el-button>
        </el-input>
      </div>
      <personPositionDetails v-if="showPersonPositionDetails"
                             v-on:close="closePersonPositionDetails" v-on:list="toList"
                             :rowdata="rowdata"></personPositionDetails>
      <positionList v-if="showpositionList"
                    @close="closepositionList" :rowdata="rowdata"></positionList>
      <div class="add-box" v-if="hasAuthoritys.indexOf('101004003000001') > -1">
        <button type="button" @click="addData" class="saasbtn saasbtn-newadd newadd">
          <span class="saas saas-button-add saasbtn-icon-newadd"></span>新增
        </button>
        <editPersonPosition v-if="showPersonPosition" v-on:close="closeEditPersonPosition"
                            :rowdata="rowdata"></editPersonPosition>
      </div>
    </div>
    <div class="main-body">
      <div class="body-table">
        <el-table
          :data="dataList"
          style="width: 100%;min-height: 360px"
          @row-dblclick="checkData"
          empty-text=" "
          tooltip-effect="islight"
          @filter-change="stateChange"
          height
          >
          <el-table-column
            label="序号"
            type="index"
            width="70"
            align="center">
          </el-table-column>
          <el-table-column
            prop="class_item_code"
            label="职业编号"
            min-width="80"
            show-overflow-tooltip
            align="center">
          </el-table-column>
          <el-table-column
            prop="class_item"
            label="职位名称"
            min-width="100"
            show-overflow-tooltip
            align="left">
          </el-table-column>
          <el-table-column
            label="状态"
            prop='valid_state'
            :filters="[{ text: '有效', value: '1' }, { text: '无效', value: '0' }]"
            :filter-multiple="false"
            column-key="state"
            width="100"
            align="center"
            filter-placement="bottom-start">
            <template slot-scope="scope">
              <el-tag v-if='scope.row.valid_state == 1' type="success">有效</el-tag>
              <el-tag v-else type="danger">无效</el-tag>
            </template>
          </el-table-column>
          <el-table-column
            prop="employeeCount"
            label="人员"
            min-width="100"
            align="center">
            <template slot-scope="scope">
              <el-popover trigger="hover" v-if="scope.row.employeeCount>0" popper-class="tipPop" placement="bottom">
                点击查看人员列表
                <div slot="reference" class="name-wrapper">
                  <div @click="checkpositionList(scope.row)" class="showTip" style="text-align: center">
                    {{ scope.row.employeeCount + '人'}}
                  </div>
                </div>
              </el-popover>
              <div v-else> {{ scope.row.employeeCount}}</div>
            </template>
          </el-table-column>
          <el-table-column
            prop="remark"
            label="备注"
            min-width="260"
            show-overflow-tooltip
            align="left">
          </el-table-column>
          <el-table-column
            label="操作"
            width="134"
            v-if="hasAuthoritys.indexOf('101004003000002') > -1 || hasAuthoritys.indexOf('101004003000003') > -1 || hasAuthoritys.indexOf('101004003000004') > -1"
            align="center">
            <template slot-scope="scope">
              <el-button @click="addData(scope.row)" type="text" size="small"
                         v-if="hasAuthoritys.indexOf('101004003000002') > -1">编辑
              </el-button>
              <el-button type="text" size="small"
                         v-if="scope.row.valid_state==1 && hasAuthoritys.indexOf('101004003000003') > -1"
                         @click="stop(scope.row.id)">停用
              </el-button>
              <el-button type="text" size="small"
                         v-if="scope.row.valid_state==0 && hasAuthoritys.indexOf('101004003000004') > -1"
                         @click="start(scope.row.id)">启用
              </el-button>
              <el-button type="text" size="small" @click="deletePersonnelPos(scope.row.id)"
                         v-if="scope.row.valid_state==0 && hasAuthoritys.indexOf('101004003000004') > -1">删除
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
  import editPersonPosition from './children/editPersonPosition.vue'
  import personPositionDetails from './children/personPositionDetails.vue'
  import positionList from './children/postionList.vue'
  export default {
    name: 'personPosition',
    props: [],
    data () {
      return {
        showPersonPosition: false,
        showPersonPositionDetails: false,
        showpositionList: false,
        search: '',
        select: 'classItem',
        currentPage: 1,
        pageSize: 10,
        dataList: [],
        total: 0,
        rowdata: '',
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
          if (item.fatherModulId === '101004003') {
            arr.push(item.modulId)
          }
        })
        return arr
      }
    },
    components: {
      editPersonPosition, personPositionDetails, positionList
    },
    methods: {
      checkData: function (row) {
        if (this.hasAuthoritys.indexOf('101004003000005') > -1) {
          this.rowdata = row
          this.showPersonPositionDetails = true
        } else {
          this.$message({
            type: 'warning',
            message: '未获得查看权限'
          })
        }
      },
      closePersonPositionDetails: function (...args) {
        this.showPersonPositionDetails = false
        if (args.length > 0) {
          this.rowdata = args[1]
          this.showPersonPosition = args[0]
        } else {
          this.rowdata = {}
        }
      },
      checkpositionList: function (row) {
        if (this.hasAuthoritys.indexOf('101004003000005') > -1) {
          this.rowdata = row
          this.showpositionList = true
        } else {
          this.$message({
            type: 'warning',
            message: '未获得查看权限'
          })
        }
      },
      toList: function (...arg) {
        this.showPersonPositionDetails = false
        this.rowdata = arg[1]
        this.showpositionList = arg[0]
      },
      closepositionList: function () {
        this.showpositionList = false
        this.rowdata = {}
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
          this.showPersonPosition = false
        } else {
          this.rowdata = {}
        }
        this.showPersonPosition = true
      },
      closeEditPersonPosition: function (...arg) {
        if (arg.length > 0) {
          this.getDataList()
        }
        this.showPersonPosition = false
      },
      getDataList () {
        let self = this
        this.$http.post('/api/system/personnel/load', {
          pagination: {
            page: this.currentPage,
            pageSize: this.pageSize,
            order: 'asc',
            sort: 'class_item'
          },
          form: {
            [this.select]: this.search,
            validState: this.state
          }
        }).then(function (res) {
          if (res.data.code === '0') {
            self.dataList = res.data.data.data
            self.total = res.data.data.totalCount
          } else {
            self.$message({type: 'info', message: res.data.msg})
          }
        }).catch(function (err) {
          self.$message({type: 'error', message: err.msg})
        })
      },
      stateChange (filters) {
        this.state = filters.state[0]
        this.getDataList()
      },
      stop (id) {
        let self = this
        this.$http.post('/api/system/personnel/stop', {
          id: id
        }).then(function (res) {
          if (res.data.code === '0') {
            self.getDataList()
            self.$message({type: 'success', message: '停用成功'})
          } else if (res.data.code === '3') {
            self.$message({type: 'warning', message: res.data.msg})
          }
        })
          .catch(err => {
            self.$message({type: 'error', message: err.msg})
          })
      },
      start (id) {
        let self = this
        this.$http.post('/api/system/personnel/start', {
          id: id
        }).then(function (res) {
          if (res.data.code === '0') {
            self.getDataList()
            self.$message({type: 'success', message: '启用成功'})
          } else {
            self.$message({type: 'warning', message: res.data.msg})
          }
        })
          .catch(err => {
            self.$message({type: 'error', message: err.msg})
          })
      },
      deletePersonnelPos (id) {
        const self = this
        self.$http.post('/api/system/personnel/deletePersonnelPos', {'id': id})
          .then(function (res) {
            if (res.data.code === '0') {
              self.$confirm('您确认要删除此职位？', '', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning',
                showClose: false,
                beforeClose: (action, instance, done) => {
                  if (action === 'confirm') {
                    instance.confirmButtonLoading = true
                    instance.confirmButtonText = '执行中...'
                    self.$http.post('/api/system/personnel/deletePersonnelPos', {'id': id, type: 'T'})
                      .then(function (res) {
                        done()
                        instance.confirmButtonLoading = false
                        self.$message({
                          message: '此职位已删除',
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
                  h('p', null, '此职位被一下人员引用,不能删除！'),
                  h('p', {style: 'text-align: center;margin-left: -34px;font-size: 14px;color: #758896;line-height: 20px;'}, res.data.data.employeeName[0]),
                  h('p', {style: 'text-align: center;margin-left: -34px;font-size: 14px;color: #758896;line-height: 20px;'}, res.data.data.employeeName[1] ? res.data.data.employeeName[1] : ''),
                  h('p', {style: 'text-align: center;margin-left: -34px;font-size: 14px;color: #758896;line-height: 20px;'}, res.data.data.employeeName[2] ? res.data.data.employeeName[2] : ''),
                  h('p', {style: 'text-align: center;margin-left: -34px;font-size: 14px;color: #758896;line-height: 20px;'}, res.data.data.employeeName.length >= 3 ? '……' : '')
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
      }
    },
    created () {
      this.getDataList()
    }
  }
</script>
<style type='text/less' lang='less' scoped>
  @import "./personPosition.less";
</style>
