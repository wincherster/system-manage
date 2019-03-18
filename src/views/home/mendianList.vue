<template>
  <div class="mendianList">
    <div class="shade"></div>
    <div class="list-box">
      <div class="list-header">
        <h3>
          门店列表
          <i class="el-icon-close" @click="slideShow" style="cursor:pointer;"></i>
        </h3>
      </div>
      <div class="list-body">
        <div class="list-main">
          <div class="form-container">
            <div class="brand">
              <el-tabs v-model="activeName" @tab-click="handleClick">
                <el-tab-pane :label="tab.orgFullName" :name="tab.orgFullName" v-for="(tab) in brandTabs"
                             :key="tab.id"></el-tab-pane>
              </el-tabs>
            </div>
            <div class="content">
              <el-table
                :data="shopListForBrand"
                header-cell-class-name="table-header"
                empty-text=" "
                tooltip-effect="islight"
                style="width: 100%;height: 100%;overflow: auto">
                <el-table-column
                  label="门店名称"
                  prop="orgFullName"
                  show-overflow-tooltip
                  align="left"
                  width="134">
                </el-table-column>
                <el-table-column
                  prop="organCode"
                  label="编号"
                  align="left"
                  show-overflow-tooltip
                  width="84">
                </el-table-column>
                <el-table-column
                  prop="upOrgName"
                  label="上级机构"
                  align="left"
                  show-overflow-tooltip
                  width="112">
                </el-table-column>
                <el-table-column
                  label="联系人"
                  align="left"
                  show-overflow-tooltip
                  prop="creatPerson"
                  width="85">
                </el-table-column>
                <el-table-column
                  prop="phone"
                  label="电话"
                  align="left"
                  show-overflow-tooltip
                  width="85">
                </el-table-column>
              </el-table>
            </div>
          </div>
        </div>
      </div>
      <div class="list-footer">
        <p>总条目：{{total}}条</p>
      </div>
    </div>
  </div>
</template>
<script>
  import { mapGetters, mapMutations } from 'vuex'
  export default {
    created () {
      this.flag = this.storeTypeFlag
      this.getDataList()
    },
    data () {
      return {
        brandTabs: [],
        shopListForBrand: [],
        activeName: '',
        index: 0,
        total: 0,
        brandId: '',
        //
        // testList: null, // 用于测试的字段
        //
        flag: '0' // 默认是'0'门店总数
      }
    },
    methods: {
      ...mapMutations([
        'slideShow'
      ]),
      handleClick (tab, event) {
        this.index = tab.index
        this.activeName = tab.name
        this.brandId = this.brandTabs[this.index].id
        this.getDataList()
      },
      close: function () {
        this.$emit('close')
      },
      getDataList: function () {
        this.$http.post('/api/homepage/hp/getStoreInfoByBrand', {
          brandId: this.brandId,
          flag: this.flag
        }).then(res => {
          this.brandTabs = res.data.data.brandInfo
          if (this.activeName === '0') {
            this.activeName = this.brandTabs[0].orgFullName
          }
          this.shopListForBrand = res.data.data.brandToStore
          this.total = res.data.data.totalNum
          //
          // 测试代码（测试数量是否对应）
          // if (process.env.NODE_ENV === 'development') {
          //   if (this.testList !== null && res.data.data.totalNum !== 0) {
          //     console.log(res.data.data)
          //   }
          //   this.testTotal += this.total
          //   if (this.testList === null) {
          //     this.testList = this.brandTabs
          //     this.testList.forEach(item => {
          //       this.brandId = item.id
          //       this.getDataList()
          //     })
          //   }
          // }
          //
        })
      }
    },
    computed: {
      ...mapGetters([
        'show',
        'storeTypeFlag'
      ])
    }
  }
</script>
<style lang="less" scoped>
  @import "mendianList.less";
</style>
<style lang="less">
  .mendianList {
    .list-box {
      .list-body {
        .list-main {
          .form-container {
            .brand {
              .el-tabs.el-tabs--top {
                .el-tabs__header {
                  height: 37px;
                  width: 100%;
                  padding: 0;
                  margin: 0;
                  .el-tabs__nav-wrap {
                    height: 100%;
                    padding: 0 20px;
                    .el-tabs__nav-prev, .el-tabs__nav-next {
                      height: 100%;
                    }
                    .el-tabs__nav-scroll {
                      height: 100%;
                      .el-tabs__nav {
                        height: 100%;
                        &:nth-last-child {
                          margin: 0;
                        }
                        .el-tabs__active-bar {
                          display: none;
                        }
                        .el-tabs__item {
                          height: 100%;
                          padding: 0 10px;
                          margin-right: 10px;
                          &.is-active {
                            border-bottom: 1px solid #4CA6F8;
                          }
                        }
                      }
                    }
                    &::after {
                      height: 1px;
                      background: #E4ECF1;
                    }
                  }
                }
              }
            }
            .content {
              .el-table {
                .el-table__header-wrapper {
                  .el-table__header {
                    .has-gutter {
                      tr {
                        > th.table-header {
                          padding: 10px 0;
                          background: #F7F9FB;
                          line-height: 18px;
                          > .cell {
                            font-family: PingFangSC-Medium;
                            font-size: 12px;
                            color: #243546;
                            line-height: 18px;
                            box-sizing: border-box;
                            padding: 0;
                          }
                          &:first-child {
                            > .cell {
                              padding: 0 20px 0 34px;
                            }
                          }
                        }
                      }
                    }
                  }
                }
                .el-table__body-wrapper {
                  .el-table__body {
                    tbody {
                      tr.el-table__row {
                        td {
                          padding: 8px 0;
                          > .cell {
                            font-family: PingFangSC-Medium;
                            font-size: 12px;
                            color: #34495E;
                            line-height: 16px;
                            box-sizing: border-box;
                            padding: 0;
                            overflow: hidden;
                            text-overflow: ellipsis;
                            p {
                              font-family: PingFangSC-Regular;
                              font-size: 12px;
                              color: #34495E;
                              line-height: 16px;
                              white-space: nowrap;
                              overflow: hidden;
                              text-overflow: ellipsis;
                            }
                          }
                          &:first-child {
                            > .cell {
                              padding: 0 20px 0 34px;
                            }
                          }
                        }
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
  }
</style>

