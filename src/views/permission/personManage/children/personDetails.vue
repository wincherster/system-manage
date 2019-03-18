<style lang="less" scoped>
  @import "./personDetails.less";
</style>
<template>
  <div class="people">
    <div class="title">人员详情</div>
    <div class="bg"></div>
    <div class="content">
      <div class="basicInfo">
        <el-row :gutter="30">
          <el-col :span="8">
            <p>账号：<span v-text="emp.empAccount"></span></p>
            <p>姓名：<span v-text="emp.empName"></span></p>
            <p>性别：<span v-text='emp.sex==0?"男":"女"'></span></p>
            <p>手机：<span v-text='emp.phone'></span></p>
            <p>学历：<span v-text="emp.educationName"></span></p>
            <p>职位：<span v-text='emp.jobTitle'></span></p>
          </el-col>
          <el-col :span="8">
            <p>角色:<span class="rolesName" @click="searchRole">{{emp.rolesName}}</span>
            </p>
            <p>身份证号：<span v-text='emp.paperNo'></span></p>
            <p>生日：<span v-text='emp.birthday'></span></p>
            <p>职位：<span v-text='emp.jobTitle'></span></p>
            <p>工牌号：<span v-text='emp.idCard'></span></p>
          </el-col>
          <el-col :span="8">
            <el-tree
              :data="tree"
              show-checkbox
              node-key="id"
              ref="tree"
              default-expand-all
              highlight-current
              :default-checked-keys="ids"
              :props="defaultProps">
            </el-tree>
          </el-col>
        </el-row>
      </div>
    </div>
    <div class="btns">
      <el-button @click="cancel()">返回</el-button>
      <el-button type="primary" @click="edit">编辑</el-button>
    </div>
    <personAuthority v-if="showPersonAuthority" v-on:close="closePersonAuthority" :rolesId="rolesId"
                     :empId="empId"></personAuthority>
  </div>
</template>
<script>
  import personAuthority from './personAuthority.vue'
  export default {
    created () {
      this.getData()
    },
    data () {
      return {
        rolesId: '',
        showPersonAuthority: false,
        empId: this.$store.state.cacheData.empId,
        emp: {},
        tree: [],
        defaultProps: {
          children: 'children',
          label: 'text'
        },
        nodes: [],
        ids: []
      }
    },
    methods: {
      closePersonAuthority: function () {
        this.showPersonAuthority = false
      },
      digui: function (obj) {
        if (obj.children.length < 1) {
          return false
        }
        this.ids.push(obj.id)
        return this.digui(obj.children)
      },
      searchRole: function () {
        this.showPersonAuthority = true
      },
      cancel: function () {
        this.$router.push('/personManage')
      },
      edit: function () {
        this.$router.push('/editPersonManage')
      },
      getData: function () {
        let self = this
        this.$http.post('/api/employee/employeeContraller/queryEmployeeById', {
          empId: this.empId
        }).then(function (res) {
          if (res.data.code === '0') {
            self.emp = res.data.data.empInfo
            self.empId = self.emp.empId
            self.rolesId = self.emp.rolesId
            self.tree = res.data.data.empOrg
            self.ids = res.data.data.empCheckedOrgIds
          } else if (res.data.msg) {
            self.$message({type: 'error', message: res.data.msg})
          }
        }).catch(function (err) {
          if (err) {
            self.$message({type: 'error', message: err.msg})
          }
        })
      }
    },
    components: {
      personAuthority
    }
  }
</script>

