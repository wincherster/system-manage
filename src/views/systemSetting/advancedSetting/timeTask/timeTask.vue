<template>
  <div class="timetask-outer">
    <!-- 头部 -->
    <div class="top clearfix">
      <!-- 查询 -->
      <div class="search">
        <el-date-picker
          v-model="sureTime"
          type="daterange"
          :picker-options="pickerOptions"
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          @change="getTime"
          align="left">
        </el-date-picker>
      </div>
      <!-- 查询按钮 -->
      <button type="button" class="saasbtn saasbtn-default saasbtn-sm inquire-btn" @click="onSubmit">查询</button>
      <!-- 新增 -->
      <button type="button" class="saasbtn saasbtn-newadd newadd" @click="addData" v-if="hasAuthoritys.indexOf('101004004005001') > -1">
        <i class="saas saas-button-add saasbtn-icon-newadd"></i>新增
      </button>
    </div>
    <!-- 下边 -->
    <div class="bottom">
      <!-- 表格 -->
      <div class="table" >
        <div class="table-inner tzx-table-container">
          <el-table :data="tableData" style="width: 100%" ref="multipleTable" empty-text=" "
          tooltip-effect="light" highlight-current-row>
            <el-table-column prop="job_name" label="任务名称" show-overflow-tooltip></el-table-column>
            <el-table-column prop='job_type' label="任务类型" min-width='80' show-overflow-tooltip
            :formatter="fomatJobType">
            </el-table-column>
            <el-table-column prop="remark" label="备注" show-overflow-tooltip></el-table-column>
            <el-table-column prop="last_operator" label="操作人" show-overflow-tooltip></el-table-column>
            <el-table-column prop="last_updatetime" label="操作时间" width="120">
              <template slot-scope="scope">
                <div>{{scope.row.last_updatetime.time | dateFilter('2', 'YYYY-MM-DD')}}</div>
                <div>{{scope.row.last_updatetime.time | dateFilter('2', 'HH:mm:ss')}}</div>
              </template>
            </el-table-column>
            <el-table-column prop="valid_state" label="任务状态" align="center" width='120'>
              <template slot-scope="scope">
                <el-tag :type="scope.row.valid_state === '1' ? 'success' : 'danger'" close-transition>
                  {{scope.row.valid_state==='1'?"执行中":"终止"}}
                </el-tag>
              </template>
            </el-table-column>
            <el-table-column label="操作" align="center" width='150' fixed="right" v-if="hasAuthoritys.indexOf('101004004005002') > -1 || hasAuthoritys.indexOf('101004004005003') > -1">
              <template slot-scope="scope">
                <el-button size="small" type="text" @click="handleEdit(scope.row)" v-if="hasAuthoritys.indexOf('101004004005002') > -1">编辑</el-button>
                <el-button size="small" type="text" @click="handleStart(scope.row)" v-if="hasAuthoritys.indexOf('101004004005003') > -1">{{scope.row.valid_state==='1'?"停用":"启用"}}</el-button>
              </template>
            </el-table-column>
          </el-table>
          <!-- 分页 -->
          <div class="tzx-pagination-container pagination-block clearfix">
            <el-pagination class="fl-right" @size-change="handleSizeChange" @current-change="handleCurrentChange"
            :current-page="listCurrentPage" :page-sizes="[10, 20, 30, 50, 100]" :page-size="listPageSize"
            layout="prev, pager, next, total, jumper, sizes" :total="listTotal" prev-text="上一页" next-text="下一页"
            :background="true"></el-pagination>
          </div>
        </div>
      </div>
    </div>
    <!-- 新增/编辑模态框 -->
    <editTimeTask v-if="showTimeTask" :addEdit="timeTaskData" v-on:close="closeEditTimeTask"></editTimeTask>
  </div>
</template>
<script>
import '../../../../assets/less/tzx-table-pagination.css'
import editTimeTask from './children/editTimeTask.vue'
export default {
  data () {
    return {
      showTimeTask: false,
      timeTaskData: '',
      sureTime: [],
      pickerOptions: {
        shortcuts: [
          {
            text: '最近一周',
            onClick (picker) {
              const end = new Date()
              const start = new Date()
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 7)
              picker.$emit('pick', [start, end])
            }
          },
          {
            text: '最近一个月',
            onClick (picker) {
              const end = new Date()
              const start = new Date()
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 30)
              picker.$emit('pick', [start, end])
            }
          },
          {
            text: '最近三个月',
            onClick (picker) {
              const end = new Date()
              const start = new Date()
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 90)
              picker.$emit('pick', [start, end])
            }
          }
        ]
      },
      tableData: [],
      listCurrentPage: 1,
      listPageSize: 10,
      listTotal: 0,
      order: '',
      beginTime: '',
      endTime: ''
    }
  },
  created () {
    this.fetchData()
  },
  methods: {
    // 过滤任务类型
    fomatJobType (row) {
      let typeNme = null
      switch (row.job_type) {
        case '1':
          typeNme = '生日营销定时任务'
          break
        case '2':
          typeNme = '菜品变价生效定时任务'
          break
        case '3':
          typeNme = '供应商采购变价定时任务'
          break
        case '4':
          typeNme = '过期积分失效定时任务'
          break
        case '5':
          typeNme = '过期优惠券作废定时任务'
          break
        case '6':
          typeNme = '卡过期定时任务'
          break
      }
      return typeNme
    },
    // 添加操作
    addData: function () {
      this.timeTaskData = ''
      this.showTimeTask = true
    },
    /* 编辑操作 */
    handleEdit (row) {
      this.timeTaskData = {
        job_name: row.job_name,
        job_type: row.job_type,
        remark: row.remark,
        id: row.id
      }
      this.showTimeTask = true
    },
    // 关闭模态框
    closeEditTimeTask (isRefresh) {
      this.showTimeTask = false
      if (isRefresh && isRefresh === '新增') {
        this.listCurrentPage = 1
        this.fetchData()
      } else if (isRefresh && isRefresh === '编辑') {
        this.fetchData()
      }
    },
    // 停用/启用操作
    handleStart (row) {
      let self = this
      this.$http.post('/api/task/setting/updateState', {
        id: row.id,
        state: row.valid_state
      })
        .then(function (res) {
          if (res.data.code === '0') {
            self.fetchData()
            self.$message({
              message: res.data.msg,
              type: 'success'
            })
          } else {
            self.$message({
              message: res.data.msg,
              type: 'error'
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
    // 过滤时间
    formatDate (time) {
      var now = new Date(time)
      var year = now.getFullYear()
      var month = now.getMonth() + 1
      var date = now.getDate()
      return year + '-' + month + '-' + date
    },
    // 日期变化
    getTime () {
      if (this.sureTime && this.sureTime[0] !== null && this.sureTime[1] !== null) {
        this.beginTime = this.formatDate(this.sureTime[0])
        this.endTime = this.formatDate(this.sureTime[1])
      } else {
        this.beginTime = ''
        this.endTime = ''
      }
    },
    /* 查询 */
    onSubmit () {
      this.listCurrentPage = 1
      this.fetchData()
    },
    // 请求数据方法
    fetchData () {
      let self = this
      this.$http
        .post('/api/task/setting/queryAll', {
          beginTime: this.beginTime,
          endTime: this.endTime,
          order: this.order,
          pageSize: this.listPageSize,
          currentPage: this.listCurrentPage
        })
        .then(function (res) {
          console.info(JSON.stringify(res.data))
          if (res.data.code === '0') {
            self.listTotal = res.data.data.count
            self.tableData = res.data.data.data
          } else {
            self.$message({
              message: res.data.msg,
              type: 'error'
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
    /* 分页方法 */
    handleSizeChange (val) {
      this.listPageSize = val
      this.listCurrentPage = 1
      this.fetchData()
    },
    handleCurrentChange (val) {
      this.listCurrentPage = val
      this.fetchData()
    }
  },
  components: {
    editTimeTask: editTimeTask
  },
  computed: {
    authority () {
      return this.$store.getters.getAuthority
    },
    hasAuthoritys () {
      let arr = []
      this.authority.forEach(item => {
        if (item.fatherModulId === '101004004005') {
          arr.push(item.modulId)
        }
      })
      return arr
    }
  }
}
</script>
<style lang="less">
// 修改element组件样式
.timetask-outer {
  /* -------------日期外框-------------------------- */
  .el-range-editor.el-input__inner {
    padding: 0;
    width: 230px;
    height: 28px;
    box-sizing: border-box;
    background: #FFFFFF;
    border: 1px solid #D8E5EC;
    border-radius: 3px;
    position: relative;
  }
  .el-range-editor.is-active, .el-range-editor.is-active:hover {
    border-color: #409EFF;
  }
  // 日期 右侧图标
  .el-date-editor .el-range__icon {
    width: 26px;
    float: right;
    line-height: 26px;
    margin-left: -5px;
    color: #c0c4cc;
    font-size: 14px;
  }
  // 日期
  .el-date-editor .el-range-input {
    width: 40%;
    height: 22px;
    font-size: 12px;
    color: #34495E;
    line-height: 22px;
  }
  // 日期 中间字体'至'
  .el-date-editor .el-range-separator {
    width: 10%;
    padding: 0 3px;
    line-height: 26px;
    font-size: 12px;
  }
  // 右上角删除图标
  .el-date-editor .el-range__close-icon {
    position: absolute;
    top: 0;
    right: 0;
    line-height: 26px;
  }
  .el-date-editor:hover .el-icon-circle-close {
    background-color: #fff;
  }

}
</style>

<style lang="less" scoped>
@import "./timeTask.less";
</style>
