<style lang="less" scoped>
  @import "./positionList.less";
</style>
<template>
  <div class="positionList">
    <div class="shade"></div>
    <div class="list-box">
      <div class="list-header">
        <h3>
          {{class_item}}职位人员列表
          <i class="el-icon-close" @click="close" style="cursor:pointer;"></i>
        </h3>
      </div>
      <div class="list-body">
        <div class="list-main">
          <div class="search-box">
            <el-input type="text" placeholder="输入姓名或账号快速查找"
                   v-model="search" class="search-input"
                   v-on:keyup.enter.native="quicksearch">
            </el-input>
            <el-button type="primary" icon="el-icon-search" @click="quicksearch"></el-button>
          </div>
          <div class="form-container">
            <el-table
              :data="dataList"
              style="width: 100%;min-height: 360px"
              empty-text=" "
              tooltip-effect="islight"
              @filter-change="filterchange"
              height>
              <el-table-column
                label="序号"
                type="index"
                width="70"
                align="center">
              </el-table-column>
              <el-table-column
                prop="empname"
                label="姓名"
                width="100"
                show-overflow-tooltip
                align="center">
              </el-table-column>
              <el-table-column
                prop="username"
                label="账号"
                width="100"
                show-overflow-tooltip
                align="center">
              </el-table-column>
              <el-table-column
                prop="rolename"
                label="角色"
                min-width="80"
                show-overflow-tooltip
                column-key="rolename"
                :filter-multiple="false"
                :filters="roleNameList"
                align="center">
              </el-table-column>
              <el-table-column
                label="状态"
                prop='empstates'
                :filters="[{ text: '有效', value: '1' }, { text: '无效', value: '0' }]"
                :filter-multiple="false"
                column-key="empstates"
                align="center"
                filter-placement="bottom-start"
                width="80">
                <template slot-scope="scope">
                  <el-tag v-if='scope.row.empstates == 1' type="success">有效</el-tag>
                  <el-tag v-else type="danger">无效</el-tag>
                </template>
              </el-table-column>
              <el-table-column
                prop="empphone"
                label="手机号"
                min-width="120"
                show-overflow-tooltip
                align="center">
              </el-table-column>
            </el-table>
          </div>
          <div class="footer">
            <p>{{class_item}}职位人员合计：{{total}}人</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
  export default {
    created () {
      this.total = this.rowdata.employeeCount
      this.class_item = this.rowdata.class_item
      this.getDataList()
    },
    data () {
      return {
        dataList: [],
        filterText: '',
        search: '',
        empStates: '',
        roleName: '',
        states: '',
        roleNameList: [],
        total: 0,
        class_item: ''
      }
    },
    methods: {
      close: function () {
        this.$emit('close')
      },
      filterchange (filters) {
        if (filters['empstates']) {
          this.states = filters['empstates'][0]
        } else if (filters['rolename']) {
          this.roleName = filters['rolename'][0]
        }
        this.getDataList()
      },
      getDataList () {
        let self = this
        this.$http.post('/api/system/personnel/getPersonnelPosDetail', {
          form: {
            id: this.rowdata.id,
            search: this.search,
            roleName: this.roleName,
            states: this.states
          }
        }).then(function (res) {
          self.dataList = res.data.data.data
          self.roleNameList = res.data.data.roleName
          for (var i = 0; i < res.data.data.roleName.length; i++) {
            var item = res.data.data.roleName[i]
            self.roleNameList[i] = {'value': item, 'text': item}
          }
        }).catch(function (err) {
          if (err) {
            self.$message({type: 'error', message: err.msg})
          }
        })
      },
      quicksearch () {
        this.getDataList()
      }
    },
    props: ['rowdata']
  }
</script>
<style lang="less">
  .positionList {
    .search-box {
      .el-input {
        .el-input__inner {
          height: 100%;
          width: 100%;
          padding: 0 8px;
          border-radius: 3px 0 0 3px;
          font-size: 14px;
          color: #34495E;
          line-height: 14px;
          float: left;
        }
      }
    }
  }
</style>
