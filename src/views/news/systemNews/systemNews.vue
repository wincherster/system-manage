<style lang="less" scoped>
  @import "./systemNews.less";
</style>
<template>
  <div class="systemnews" id="systemnews">
    <div class="empty" v-if="dataList.length==0">
      <el-table empty-text=" " style="width: 100%;height: 100%"></el-table>
    </div>
    <div class="content" v-else>
            <el-row>
              <el-col :span="8" v-for="item in dataList" :key="item.id">
                <div class="box">
                  <div class="title">{{ item.noticeTitle }}
                    <span v-if="item.isRecall == '1'" class="recall">已撤回</span>
                  </div>
                  <div class="newMessage" v-if="item.clickRecords != '1'">new</div>
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
                      <a @click="check(item.id)">查看全部</a>
                      <a @click="del(item.id)">删除</a>
                    </div>
                  </div>
                </div>
              </el-col>
            </el-row>
    </div>
    <div class="pagination tzx-pagination-container">
      <el-pagination
        background
        prev-text='上一页'
        next-text='下一页'
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="currentPage"
        :page-sizes="[9,12,15,18]"
        :page-size="pageSize"
        layout="prev, pager, next, total, jumper, sizes"
        :total="totalcount">
      </el-pagination>
    </div>
  </div>
</template>
<script>
  import { mapGetters, mapMutations } from 'vuex'
  export default {
    data () {
      return {
        dataList: [],
        currentPage: 1,
        pageSize: 9,
        id: '',
        totalcount: 0,
        status: 0
      }
    },
    created () {
      this.getNews()
    },
    computed: {
      ...mapGetters(['isCollapse', 'getNewsCount'])
    },
    methods: {
      ...mapMutations(['setNewsCount']),
      check: function (id) {
        this.$http.post('/api/system/messager/loadSingleRecord', {
          'form': {'id': id}
        }).then(res => {
          if (res.data.code === '0') {
            this.$store.state.cacheData = res.data
            this.$http.post('/api/system/messager/saveClickRecord', {
              'form': {
                'id': id,
                'type': 2,
                'clickRecord': 1
              }
            }).then(res => {
              if (res.data.code === '0') {
                this.getNews()
                this.$router.push('/systemNewsDetail')
              } else {
                this.$message({
                  type: 'info',
                  message: res.data.msg
                })
              }
            })
          } else {
            this.$message({
              type: 'error',
              message: res.data.msg
            })
          }
        }).catch(function (err) {
          self.$message({
            message: err.msg,
            type: 'error'
          })
        })
      },
      del: function (id) {
        let self = this
        this.$http.post('/api/system/messager/delSystemByUser', {'form': {'id': id}}).then(function (res) {
          if (res.data.code === '0') {
            self.$message({
              message: '删除成功',
              type: 'success'
            })
            self.getNews()
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
      handleSizeChange (val) {
        this.pageSize = val
        this.getNews()
      },
      handleCurrentChange (val) {
        this.currentPage = val
        this.getNews()
      },
      getNews () {
        this.$http.post('/api/system/messager/channelLoad', {
          logogramName: 'sys',
          pagination: {
            page: this.currentPage,
            pageSize: this.pageSize
          }
        }).then(res => {
          if (res.data.code === '0') {
            this.setNewsCount(res.data.data.noticeNum)
            this.dataList = res.data.data.data
            this.totalcount = res.data.data.totalCount
          } else if (res.data.msg) {
            this.$message({type: 'error', message: res.data.msg})
          }
        }).catch(err => {
          if (err) { this.$message({type: 'error', message: err.msg}) }
        })
      }
    }
  }
</script>
