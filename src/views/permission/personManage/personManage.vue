<template>
  <div class="main-container" id="personmanage">
    <div class="main-header">
      <div class="left-box">
        <div class="tree-retract" v-if="!showTreeContainer" @mouseleave="showRetractTree=false">
          <span @click="handleRetractTree">全部门店 <i :class="{'el-icon-arrow-down':!showRetractTree,'el-icon-arrow-up':showRetractTree}
"></i></span>
          <div class="saas-tree" v-if="showRetractTree">
            <div class="header-tool">
              <i class='iconfont icomoon-shrink open' @click="shrinkAll"></i>
              <i class='iconfont icomoon-expand close' @click="expandAll"></i>
              <input type="text" placeholder="输入关键字进行过滤"
                     v-model="filterText" class="input__inner">
              <i class='iconfont icomoon-pull-down collapse' @click="showTreeContainer=true"></i>
            </div>
            <div class="tree-container">
              <el-tree
                class="filter-tree"
                :data="tree"
                :props="defaultProps"
                node-key="id"
                default-expand-all
                :filter-node-method="filterNode"
                @node-click="clickNode"
                ref="treeDom">
              </el-tree>
            </div>
            <div class="line"></div>
          </div>
        </div>
        <div class="search-box">
          <el-input v-model="search" class="input-with-select" @keyup.enter.native="getDataList">
            <el-select v-model="select" slot="prepend" popper-class="search-select">
              <el-option label="姓名" value="empName"></el-option>
              <el-option label="账号" value="empAccount"></el-option>
            </el-select>
            <el-button @click="searchbox" slot="suffix" icon="el-icon-search"></el-button>
          </el-input>
        </div>
      </div>
      <div class="add-box" v-if="hasAuthoritys.indexOf('101003002000001') > -1">
        <button type="button" @click="addData()" class="saasbtn saasbtn-newadd newadd">
          <span class="saas saas-button-add saasbtn-icon-newadd"></span>新增
        </button>
      </div>
    </div>
    <div class="main-body">
      <div class="saas-tree" v-if="showTreeContainer">
        <div class="header-tool">
          <i class='iconfont icomoon-shrink open' @click="shrinkAll"></i>
          <i class='iconfont icomoon-expand close' @click="expandAll"></i>
          <input type="text" placeholder="输入关键字进行过滤"
                 v-model="filterText" class="input__inner">
          <i class='iconfont icomoon-pull-up collapse' @click="showTreeContainer=false"></i>
        </div>
        <div class="tree-container">
          <el-tree
            class="filter-tree"
            :data="tree"
            :props="defaultProps"
            node-key="id"
            default-expand-all
            :filter-node-method="filterNode"
            @node-click="clickNode"
            ref="treeDom">
          </el-tree>
        </div>
        <div class="line"></div>
      </div>
      <div class="body-table">
        <div class="container">
          <div class="table-container">
            <el-table
              :data="dataList"
              style="width: 100%;min-height: 360px;"
              height
              current-row-key="id"
              @row-dblclick="dblCheckData"
              @sort-change="sort"
              empty-text=" "
              tooltip-effect="islight"
              @filter-change="filterchange"
            >
              <el-table-column
                type="index"
                width="60"
                align="center">
              </el-table-column>
              <el-table-column
                prop="empName"
                label="姓名"
                min-width="100"
                show-overflow-tooltip
                align="left"
                sortable="custom">
              </el-table-column>
              <el-table-column
                prop="empAccount"
                label="账号"
                min-width="100"
                align="left"
                sortable>
                <template slot-scope="scope">
                  <div slot="reference" class="name-wrapper">
                    <div class="showTip" style="overflow: hidden" @click="dblCheckData(scope.row)">
                      {{scope.row.empAccount}}
                    </div>
                  </div>
                </template>
              </el-table-column>
              <el-table-column
                prop="jobTitle"
                label="职位"
                min-width="100"
                align="left"
                show-overflow-tooltip
                :filter-multiple="false"
                column-key="jobTitle"
                filter-placement="bottom-start"
                :filters="company"
              >
              </el-table-column>
              <el-table-column
                prop="empJobState"
                label="状态"
                width="100"
                align="center"
                :filter-multiple="false"
                column-key="empJobState"
                filter-placement="bottom-start"
                :filters="[{ text: '在职', value: '1' }, { text: '离职', value: '0' }]"
              >
                <template slot-scope="scope">
                  <span>
                    {{scope.row.stateName}}
                  </span>
                </template>
              </el-table-column>
              <el-table-column
                prop="rolesName"
                label="角色"
                min-width="100"
                align="left"
              >
                <template slot-scope="scope">
                  <el-popover trigger="hover" popper-class="tipPop" placement="bottom">
                    点击查看角色列表
                    <div slot="reference" class="name-wrapper">
                      <div class="showTip" @click="roleDetail(scope.row)">{{ scope.row.rolesName}}</div>
                    </div>
                  </el-popover>
                </template>
              </el-table-column>
              <el-table-column
                prop="empCode"
                label="员工编号"
                width="100"
                align="center"
                show-overflow-tooltip
              >
              </el-table-column>
              <el-table-column
                prop="phone"
                label="手机号"
                min-width="120"
                align="center"
                show-overflow-tooltip
              >
              </el-table-column>
              <el-table-column
                prop="createDate"
                label="创建时间"
                width="140"
                align="center"
                :formatter="DateFormatter"
                sortable="custom">
              </el-table-column>
              <el-table-column
                prop="createPerson"
                label="创建人"
                min-width="100"
                show-overflow-tooltip
                align="left"
              >
              </el-table-column>
              <el-table-column
                fixed="right"
                label="操作"
                v-if="hasAuthoritys.indexOf('101003002000002') > -1 || hasAuthoritys.indexOf('101003002000003') > -1"
                width="134"
                align="center">
                <template slot-scope="scope">
                  <el-button @click="addData(scope.row.empId)" type="text" size="small"
                             v-if="hasAuthoritys.indexOf('101003002000002') > -1">编辑
                  </el-button>
                  <el-button type="text" size="small"
                             v-if="scope.row.empJobState==1 && hasAuthoritys.indexOf('101003002000003') > -1"
                             @click="leaveCompany(scope.row.empId)">离职
                  </el-button>
                  <el-button type="text" size="small"
                             v-if="scope.row.empJobState==0 && hasAuthoritys.indexOf('101003002000003') > -1"
                             @click="joinCompany(scope.row.empId)">入职
                  </el-button>
                </template>
              </el-table-column>
            </el-table>
          </div>
        </div>
        <div class="pagination tzx-pagination-container footer">
          <el-pagination
            background
            prev-text='上一页'
            next-text='下一页'
            @size-change="changeSizeChange"
            @current-change="currentPageChange"
            :current-page="currentPage"
            :page-sizes="pageSizes"
            :page-size="pageSize"
            layout="prev, pager, next, total,  jumper, sizes"
            :total="total">
          </el-pagination>
        </div>
      </div>
    </div>
    <personAuthority v-if="showPersonAuthority" v-on:close="closePersonAuthority" :rolesId="rolesId"
                     :empId="empId"></personAuthority>
  </div>
</template>
<script>
  import '../../../assets/icomoon/style.css'
  import '../../../assets/less/tzx-table-pagination.css'
  import personAuthority from './children/personAuthority.vue'
  export default {
    name: 'personmanage',
    props: [],
    watch: {
      filterText (val) {
        this.$refs.treeDom.filter(val)
      }
    },
    data () {
      return {
        showPersonAuthority: false,
        tree: [],
        defaultProps: {
          children: 'children',
          label: 'text'
        },
        filterText: '',
        orgCode: '',
        search: '',
        select: 'empName',
        currentPage: 1,
        pageSize: 10,
        pageSizes: [10, 20, 30, 40, 50],
        company: [],
        showPriceDetails: false,
        total: 0,
        dataList: [],
        rowData: {},
        sortName: '',
        sortOrder: '',
        jobs: [{text: '有效', value: '1'}, {text: '无效', value: '0'}],
        empJobState: '',
        jobTitle: '',
        rolesId: '',
        type: '1',
        empId: '',
        showTreeContainer: true,
        showRetractTree: false
      }
    },
    computed: {
      authority () {
        return this.$store.getters.getAuthority
      },
      hasAuthoritys () {
        let arr = []
        this.authority.forEach(item => {
          if (item.fatherModulId === '101003002') {
            arr.push(item.modulId)
          }
        })
        return arr
      }
    },
    components: {
      personAuthority
    },
    methods: {
      roleDetail: function (row) {
        if (this.hasAuthoritys.indexOf('101003002000005') > -1) {
          this.empId = row.empId
          this.rolesId = row.rolesId
          this.showPersonAuthority = true
        } else {
          this.$message({
            type: 'warning',
            message: '未获得查看权限'
          })
        }
      },
      closePersonAuthority: function () {
        this.showPersonAuthority = false
      },
      getTree () {
        let self = this
        this.$http.post('/api/organization/organ/getOrganTree', {})
          .then(function (res) {
            if (res.data.code === '0') {
              self.tree = res.data.data
            } else {
              self.$message({type: 'info', message: res.data.msg})
            }
          })
          .catch(function (err) {
            self.$message({type: 'error', message: err.msg})
          })
      },
      filterNode (value, data) {
        if (!value) return true
        return data.orgfullname.indexOf(value) !== -1
      },
      clickNode (node, item, elm) {
        this.orgCode = node.organCode
        this.getDataList()
      },
      getDataList () {
        let self = this
        this.$http.post('/api/employee/employeeContraller/getEmployeeList', {
          page: this.currentPage,
          sort: this.sortName,
          order: this.sortOrder,
          rows: this.pageSize,
          jobTitle: this.jobTitle,
          empJobState: this.empJobState,
          organCode: this.orgCode,
          [this.select]: this.search
        }).then(function (res) {
          if (res.data.code === '0') {
            self.dataList = res.data.data.rows
            self.total = res.data.data.total
          } else {
            self.$message({
              message: res.data.msg,
              type: 'error'
            })
          }
        }).catch(function (err) {
          self.$message({type: 'error', message: err.msg})
        })
      },
      currentPageChange (val) {
        this.currentPage = val
        this.getDataList()
      },
      changeSizeChange (val) {
        this.pageSize = val
        this.getDataList()
      },
      searchbox () {
        this.getDataList()
      },
      getCompany () {
        let self = this
        this.$http.post('/api/employee/employeeContraller/getComboboxByClassIdentifierCode', {class_identifier_code: 'position'})
          .then(function (res) {
            if (res.data.code === '0') {
              res.data.data.forEach(function (item) {
                item.value = parseInt(item.id)
                delete item.id
              })
              self.company = res.data.data
            } else {
              self.$message({type: 'error', message: res.data.msg})
            }
          })
          .catch(function (err) {
            self.$message({type: 'error', message: err.msg})
          })
      },
      filterchange (filters) {
        if (filters['jobTitle']) {
          this.jobTitle = filters['jobTitle'][0]
        } else if (filters['empJobState']) {
          this.empJobState = filters['empJobState'][0]
        }
        this.getDataList()
      },
      dblCheckData (row) {
        if (this.hasAuthoritys.indexOf('101003002000005') > -1) {
          this.empId = row.empId
          this.$store.state.cacheData = {empId: row.empId}
          this.$router.push('/personDetails')
        } else {
          this.$message({
            type: 'warning',
            message: '未获得查看权限'
          })
        }
      },
      leaveCompany (id) {
        let self = this
        this.$http.post('/api/employee/employeeContraller/leaveCompany', {
          states: 0, id: id
        }).then(function (res) {
          if (res.data.code === '0') {
            self.$message({type: 'success', message: '离职成功'})
            self.getDataList()
          } else {
            self.$message({type: 'error', message: res.data.msg})
            self.getDataList()
          }
        }).catch(function (err) {
          console.info(err)
        })
      },
      filterTag (value, row) {
        return row.validState === value
      },
      addData (id) {
        if (id) {
          this.$store.state.cacheData = {empId: id}
          this.$router.push('/editPersonManage')
        } else {
          this.$store.state.cacheData = {empId: 0}
          this.$router.push('/editPersonManage')
        }
      },
      DateFormatter (row, column, cellValue) {
        var d = new Date(cellValue)
        var year = d.getFullYear()
        var month = d.getMonth() - 0 + 1 < 10 ? '0' + (d.getMonth() + 1) : '' + (d.getMonth() + 1)
        var day = d.getDate() < 10 ? '0' + d.getDate() : '' + d.getDate()
        return year + '-' + month + '-' + day
      },
      joinCompany (id) {
        let self = this
        this.$http.post('/api/employee/employeeContraller/leaveCompany', {
          states: 1,
          id: id
        }).then(function (res) {
          self.getDataList()
          if (res.data.code === '0') {
            self.$message({type: 'success', message: '入职成功'})
            self.getDataList()
          } else {
            self.$message({type: 'error', message: res.data.msg})
            self.getDataList()
          }
        })
          .catch(err => {
            self.$message({type: 'error', message: err.msg})
          })
      },
      sort (item) {
        this.sortName = item.prop
        if (item.order) {
          this.sortOrder = item.order.replace('ending', '')
        } else {
          this.sortOrder = ''
        }
        this.getDataList()
      },
      shrinkAll () {
        this.handleExpandOrShrinkTree(false)
      },
      expandAll () {
        this.handleExpandOrShrinkTree(true)
      },
      handleExpandOrShrinkTree (isExpandAll) {
        let allNodes = this.$refs.treeDom.store._getAllNodes()
        for (let i = 0; i < allNodes.length; i++) {
          allNodes[i].expanded = isExpandAll
        }
      },
      handleRetractTree () {
        this.showRetractTree = !this.showRetractTree
      }
    },
    created () {
      this.getTree()
      this.getDataList()
      this.getCompany()
    }
  }
</script>
<style type='text/less' lang='less' scoped>
  @import "./personManage.less";
</style>
