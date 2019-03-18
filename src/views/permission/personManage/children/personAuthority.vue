<style lang="less" scoped>
  @import "./personAuthority.less";
</style>
<template>
  <div class="rolemanage">
    <div class="shade"></div>
    <div class="add-box">
      <div class="add-header">
        <h3>
          角色详情
          <i class="iconfont saas saas-nav-closehover" @click="close" style="cursor:pointer;"></i>
        </h3>
      </div>
      <div class="add-body">
        <div class="add-main">
          <div class="form-container">
            <el-tabs v-model="activeName4">
              <el-tab-pane label="角色权限" name="first" key='first'>
                <el-tabs v-model="activeName">
                  <el-tab-pane :label="item.moduleName" :name="item.id + ''" v-for="item in data" :v-text="item.moduleName"
                               :key="item.id">
                    <el-tree
                      :data="[item]"
                      node-key="id"
                      default-expand-all
                      show-checkbox
                      :default-checked-keys="ids"
                      :props="defaultProps">
                    </el-tree>
                  </el-tab-pane>
                </el-tabs>
              </el-tab-pane>
              <el-tab-pane label="角色适用机构" name="second" key='second'>
                <el-tree
                  :data="tree"
                  show-checkbox
                  node-key="id"
                  ref="tree"
                  default-expand-all
                  highlight-current
                  :props="defaultPropss">
                </el-tree>
              </el-tab-pane>
            </el-tabs>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
  export default {
    created () {
      this.getRoleDetail()
      this.getData()
    },
    data () {
      return {
        activeName4: 'first',
        activeName: '',
        ids: [],
        data: [],
        defaultProps: {
          children: 'children',
          label: 'moduleName'
        },
        defaultPropss: {
          children: 'children',
          label: 'text'
        },
        tree: [],
        idss: []
      }
    },
    props: ['rolesId', 'empId'],
    methods: {
      getData: function () {
        let self = this
        this.$http.post('/api/employee/employeeContraller/queryEmployeeById', {
          empId: this.empId
        }).then(function (res) {
          if (res.data.code === '0') {
            self.tree = res.data.data.empOrg
            self.idss = res.data.data.empCheckedOrgIds
            self.$refs.tree.setCheckedKeys(self.idss)
          } else {
            self.$message({type: 'error', message: res.data.msg})
          }
        }).catch(function (err) {
          console.info(err)
          self.$message({type: 'error', message: '网络异常,请刷新重试'})
        })
      },
      getRoleDetail: function () {
        let self = this
        this.$http.post('/api/role/roles/queryRoleModuleById', {
          roleId: this.rolesId
        }).then(function (res) {
          if (res.data.code === '0') {
            self.ids = res.data.data[0]
            self.data = res.data.data[1]
            self.activeName = self.data[0].id + ''
          } else {
            self.$message({
              message: res.data.msg,
              type: 'error'
            })
          }
        }).catch(function (err) {
          console.log(err)
        })
      },
      cancel: function () {
        this.$emit('close')
      },
      close: function () {
        this.$emit('close')
      }
    }
  }
</script>
<style lang="less">
  .rolemanage {
    .el-form.el-form--label-left {
      width: 100%;
      .el-form-item {
        width: 100%;
        margin: 0;
        .el-form-item__label {
          position: relative;
          font-family: PingFangSC-Regular, "Microsoft YaHei";
          font-size: 14px;
          color: #576D7A;
          line-height: 20px;
          padding: 14px 0;
        }
        .el-form-item__content {
          line-height: normal;
          padding: 8px 0;
          height: 48px;
          .el-input {
            .el-input__inner {
              height: 32px;
              width: 230px;
              font-size: 14px;
              color: #9AABB8;
              line-height: 14px;
              padding: 0 0 0 8px;
              border-radius: 3px;
            }
          }
          .el-textarea {
            .el-textarea__inner {
              resize: none;
              height: 70px;
              width: 100%;
              padding: 8px;
            }
          }
          .el-select {
            .el-input.el-input--suffix {
              width: 100%;
            }
          }
        }
      }
      .el-form-item.Remarks {
        .el-form-item__label {
          padding: 47px 0;
        }
        .el-form-item__content {
          height: 114px;
          padding: 8px 0;
          .el-textarea {
            .el-textarea__inner {
              height: 98px;
              resize: none;
              width: 230px;
              font-size: 14px;
              color: #9AABB8;
              letter-spacing: 0;
              line-height: 22px;
            }
          }
        }
      }
      .el-form-item.is-required {
        .el-form-item__label::before {
          position: absolute;
          top: 17px;
          left: -9px;
        }
      }
      .el-form-item.is-error.is-required {
        .el-form-item__content {
          .el-form-item__error {
            padding: 0;
            top: auto;
            bottom: -5px;
          }
        }
      }
    }
  }
</style>
