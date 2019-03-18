<style lang="less" scoped>
  @import "systemNotice.less";
</style>
<template>
  <div class="systemNotice" id="systemNotice">
    <div class="content">
      <div class="btn" v-if="hasAuthoritys.indexOf('101004001000001') > -1">
        <button type="button" @click="addData()" class="saasbtn saasbtn-newadd newadd">
          <span class="saas saas-button-add saasbtn-icon-newadd"></span>新增
        </button>
      </div>
      <div class="tab">
        <el-tabs v-model="activeName" @tab-click="handleClick">
          <el-tab-pane label="已发送" name="send">
            <div v-if="sendDataList.length ==0" class="el-table__empty-text"></div>
            <el-row v-else>
              <el-col :span="8" v-for="item in sendDataList" :key="item.id">
                <div class="box">
                  <div class="title">{{ item.noticeTitle }}
                    <span v-if="item.isRecall == '1'" class="recall">已撤回</span></div>
                  <div class="info"> {{ item.noticeInfo }}</div>
                  <div class="bottom">
                    <div class="left">
                      <i class="el-icon-time"></i>
                      <span v-if="item.sendMode === '1'">{{ item.entryTime | dateFilter(1, 'YYYY-MM-DD HH:mm:ss')
                        }}</span>
                      <span v-if="item.sendMode === '2'">{{ item.timingTime | dateFilter(1, 'YYYY-MM-DD HH:mm:ss')
                        }}</span>
                      <span class="sender">发送者:&nbsp;&nbsp;{{ item.entryPerson }}</span>
                    </div>
                    <div class="right">
                      <a @click="checkData(item)" v-if="!item.isRecall">查看全部</a>
                      <a @click="back(item.id)" v-if="handleback(item)">撤回</a>
                      <a @click="addData(item)" v-if="item.isRecall">编辑</a>
                      <a @click="del(item.id)" v-if="item.isRecall">删除</a>
                    </div>
                  </div>
                </div>
              </el-col>
            </el-row>
          </el-tab-pane>
          <el-tab-pane label="草稿箱" name="draft">
            <div v-if="draftDataList.length ==0" class="el-table__empty-text"></div>
            <el-row v-else>
              <el-col :span="8" v-for="(item, index) in draftDataList" :key="index">
                <div class="box">
                  <div class="title">{{ item.noticeTitle }}</div>
                  <div class="info">{{ item.noticeInfo }}</div>
                  <div class="bottom">
                    <div class="left">
                      <i class="el-icon-time"></i>
                      <span>{{ item.entryTime | dateFilter(1, 'YYYY-MM-DD HH:mm:ss')}}</span>
                      <span class="sender">发送者:&nbsp;&nbsp;{{ item.entryPerson }}</span>
                    </div>
                    <div class="right">
                      <a @click="addData(item)">编辑</a>
                      <a @click="send(item)">发送</a>
                      <a @click="del(item.id)">删除</a>
                    </div>
                  </div>
                </div>
              </el-col>
            </el-row>
          </el-tab-pane>
        </el-tabs>
      </div>
    </div>
    <div class="pagination tzx-pagination-container">
      <el-pagination
        background
        prev-text='上一页'
        next-text='下一页'
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="pagination[activeName].currentPage"
        :page-sizes="[9,12,15,18]"
        :page-size="pagination[activeName].pageSize"
        layout="prev, pager, next, total,  jumper, sizes"
        :total="pagination[activeName].totalcount">
      </el-pagination>
    </div>
  </div>
</template>
<script>
  import { mapMutations } from 'vuex'

  export default {
    data () {
      return {
        sendDataList: [],
        draftDataList: [],
        activeName: 'send',
        value: 0,
        pagination: {
          send: {
            currentPage: 1,
            pageSize: 9,
            totalcount: 0
          },
          draft: {
            currentPage: 1,
            pageSize: 9,
            totalcount: 0
          }
        }
      }
    },
    created () {
      this.$store.state.cacheData = {}
      this.activeName = this.$store.state.activeTabName
      if (this.activeName === 'send') this.getSendList()
      else if (this.activeName === 'draft') this.getDraftList()
      this.getNews()
    },
    methods: {
      ...mapMutations(['setNewsCount']),
      getSendList: function () {
        let self = this
        let params = {
          'pagination': {
            'page': this.pagination.send.currentPage,
            'pageSize': this.pagination.send.pageSize
          },
          'form': {'type': '1'}
        }
        this.$http.post('/api/system/messager/queryAll', params)
          .then(function (res) {
            if (res.data.code === '0') {
              self.pagination.send.totalcount = res.data.data.totalCount
              self.sendDataList = res.data.data.data
            } else if (res.data.msg) {
              self.$message({
                message: res.data.msg,
                type: 'error'
              })
            }
          })
          .catch(function (err) {
            if (err) {
              self.$message({
                message: err.msg,
                type: 'error'
              })
            }
          })
      },
      getDraftList: function () {
        let self = this
        let params = {
          'pagination': {
            'page': this.pagination.draft.currentPage,
            'pageSize': this.pagination.draft.pageSize
          },
          'form': {'type': '3'}
        }
        this.$http.post('/api/system/messager/queryAll', params)
          .then(function (res) {
            if (res.data.code === '0') {
              self.pagination.draft.totalcount = res.data.data.totalCount
              self.draftDataList = res.data.data.data
            } else if (res.data.msg) {
              self.$message({
                message: res.data.msg,
                type: 'error'
              })
            }
          })
          .catch(function (err) {
            if (err) {
              self.$message({
                message: err.msg,
                type: 'error'
              })
            }
          })
      },
      checkData: function (item) {
        this.$store.state.cacheData = item
        this.$router.push('/systemNoticeDetail')
      },
      handleback: function (item) {
        if (item.sendMode === '1') {
          return (Date.now() - item.entryTime < 300000 && item.isRecall === 0)
        } else if (item.sendMode === '2') {
          return (Date.now() - item.timingTime < 300000 && item.isRecall === 0)
        }
      },
      handleClick (tab, event) {
        this.activeName = tab.name
        this.$store.state.activeTabName = this.activeName
        if (tab.name === 'draft') {
          this.getDraftList()
        } else if (tab.name === 'send') {
          this.getSendList()
        }
      },
      send (item) {
        item.type = '1'
        const self = this
        this.$http.post('/api/system/messager/save', {
          form: item
        }).then(function (res) {
          if (res.data.code === '0') {
            self.$message({
              message: '发送成功',
              type: 'success'
            })
            self.activeName = self.$store.state.activeTabName = 'send'
            self.getSendList()
            self.getNews()
          } else if (res.data.msg) {
            self.$message({
              message: res.data.msg,
              type: 'error'
            })
          }
        }).catch(function (err) {
          if (err) {
            self.$message({
              message: err.msg,
              type: 'error'
            })
          }
        })
      },
      del: function (id) {
        let self = this
        this.$http.post('/api/system/messager/deleteSystem', {'form': {'id': id}}).then(function (res) {
          if (res.data.code === '0') {
            self.$message({
              message: '删除成功',
              type: 'success'
            })
            if (self.activeName === 'send') self.getSendList()
            else if (self.activeName === 'draft') self.getDraftList()
          } else if (res.data.code === '2') {
            self.$message({
              message: '公告已发送,不可删除',
              type: 'error'
            })
          } else if (res.data.msg) {
            self.$message({
              message: res.data.msg,
              type: 'error'
            })
          }
        })
          .catch(function (err) {
            if (err) {
              self.$message({
                message: err.msg,
                type: 'error'
              })
            }
          })
      },
      addData: function (item) {
        if (item) {
          this.$store.state.cacheData = item
        } else {
          this.$store.state.cacheData = {}
        }
        this.$router.push('/editSystemNotice')
      },
      handleSizeChange (val) {
        if (this.activeName === 'send') {
          this.pagination.send.pageSize = val
          this.getSendList()
        } else if (this.activeName === 'draft') {
          this.pagination.draft.pageSize = val
          this.getDraftList()
        }
      },
      handleCurrentChange (val) {
        if (this.activeName === 'send') {
          this.pagination.send.currentPage = val
          this.getSendList()
        } else if (this.activeName === 'draft') {
          this.pagination.draft.currentPage = val
          this.getDraftList()
        }
      },
      back (id) {
        let self = this
        this.$http.post('/api/system/messager/recall', {
          'form': {'id': id}
        }).then(function (res) {
          if (res.data.code === '0') {
            self.showMessageInfoBox('公告已撤回,目前已被' + res.data.data + '人阅读')
            self.getSendList()
            self.getNews()
          } else if (res.data.code === '2') {
            self.showMessageInfoBox('公告发布已超5分钟，无法撤回')
            self.getSendList()
            self.getNews()
          } else if (res.data.msg) {
            self.$message({
              message: res.data.msg,
              type: 'error'
            })
          }
        }).catch(function (err) {
          if (err) { self.$message({type: 'error', message: err.msg}) }
        })
      },
      getNews () {
        this.$http.post('/api/system/messager/channelLoad', {
          logogramName: 'sys',
          pagination: {
            page: 1,
            pageSize: 9
          }
        }).then(res => {
          if (res.data.code === '0') {
            this.setNewsCount(res.data.data.noticeNum)
          } else if (res.data.msg) {
            this.$message({type: 'error', message: res.data.msg})
          }
        }).catch(err => {
          if (err) { this.$message({type: 'error', message: err.msg}) }
        })
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
      }
    },
    computed: {
      authority () {
        return this.$store.getters.getAuthority
      },
      hasAuthoritys () {
        let arr = []
        this.authority.forEach(item => {
          if (item.fatherModulId === '101004001') {
            arr.push(item.modulId)
          }
        })
        return arr
      }
    }
  }
</script>
<style lang="less">
  .tab {
    .el-tabs.el-tabs--top {
      .el-tabs__header {
        .el-tabs__nav-wrap {
          .el-tabs__nav-scroll {
            margin-top: 10px;
            .el-tabs__nav {
              margin-left: 20px;
              .el-tabs__item {
                height: 44px;
                line-height: 44px;
                padding: 0 30px;
              }
              .el-tabs__item:nth-child(2) {
                padding-left: 10px;
              }
            }
          }
        }
      }
      .el-tabs__content {
        padding: 0 20px;
        .el-tab-pane {
          min-height: 360px;
        }
      }
    }
  }
</style>
