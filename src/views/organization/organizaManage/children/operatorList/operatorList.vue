<style lang="less" scoped>
  @import "./operatorList.less";
</style>
<template>
  <transition name="fade">
    <div class="operator-list-container tzx-slide-right-window-container have-table-container">
      <div class="body" ref="slideRightBody">
        <div class="head">
          <h3 class="title"><div>{{ organiza.orgFullName }}</div><div>&nbsp;操作员列表</div></h3>
          <i class="saas iconfont saas-nav-closehover close-icon-btn" @click="close"></i>
        </div>
        <div class="main">
          <div class="search-container">
            <el-input placeholder="请输入姓名或账号快速查找" v-model="keyWord" clearable @blur="keyWord = keyWord.trim()">
              <template slot="append">
                <i slot="suffix" class="saas iconfont saas-seach" @click="search"></i>
              </template>
            </el-input>
          </div>
          <div class="table-container tzx-table-container">
            <el-table ref="empsTable" :data="operatorList" style="width: 100%;" highlight-current-row tooltip-effect='light' :enterable='false' empty-text=" ">
              <el-table-column prop='user_name' label="账号" min-width="80"  show-overflow-tooltip></el-table-column>
              
              <el-table-column min-width="80"
                label="职位"
                prop='tag'
                show-overflow-tooltip
                :filters="positionsList"
                :filter-method="filterPositions"
                :filter-multiple="false"
                filter-placement="bottom-start">
              </el-table-column>

              <el-table-column min-width="80"
                label="角色" 
                prop='tag'
                show-overflow-tooltip
                :filters="rolesList"
                :filter-method="filterRoles"
                :filter-multiple="false"
                filter-placement="bottom-start">
              </el-table-column>

              <el-table-column min-width="80"
                label="状态"
                prop='tag'
                :filters="[{ text: '在职', value: '1' }, { text: '离职', value: '0' }]"
                :filter-method="filterStates"
                :filter-multiple="false"
                filter-placement="bottom-start">
                <template slot-scope="scope">
                  <el-tag v-if='scope.row.states === "1"' type="success">在职</el-tag>
                  <el-tag v-else-if='scope.row.states === "0"' type="danger">离职</el-tag>
                </template>
              </el-table-column>

              <el-table-column label="姓名/手机号" min-width="110">
                <template slot-scope="scope">
                  <div>{{scope.row.name}} </div>
                  <div>{{scope.row.phone}}</div>
                </template>
              </el-table-column>
            </el-table>

          </div>
        </div>
        <div class="statistics">
            操作人员合计：{{ organiza.employeeCount }}人
        </div>
      </div>
    </div>
  </transition>
</template>
<script>
  import '../../../../../assets/less/tzx-slide-right-window.css'
  export default {
    created () {
      /*
      // 假数据
      let result = {
        code: '0',
        msg: '操作成功！',
        data: {
          positions: [
            {
              value: 3829,
              text: '平台研发'
            },
            {
              value: 650,
              text: '汉'
            },
            {
              value: 651,
              text: '中国建设银行'
            },
            {
              value: 652,
              text: '回族'
            },
            {
              value: 653,
              text: '中国工商银行'
            },
            {
              value: 654,
              text: '中国农业银行'
            },
            {
              value: 656,
              text: '中国招商银行'
            },
            {
              value: 658,
              text: '中国交通银行'
            },
            {
              value: 659,
              text: '苗族'
            },
            {
              value: 663,
              text: '彝族'
            },
            {
              value: 664,
              text: '朝鲜族'
            },
            {
              value: 665,
              text: '满族'
            },
            {
              value: 667,
              text: '蒙古族'
            },
            {
              value: 669,
              text: '全日制时薪'
            },
            {
              value: 670,
              text: '降职'
            },
            {
              value: 672,
              text: '特殊调薪'
            },
            {
              value: 673,
              text: '勤工俭学'
            },
            {
              value: 675,
              text: '劳务派遣—俊才'
            },
            {
              value: 676,
              text: '普调'
            },
            {
              value: 677,
              text: '其它兼职'
            },
            {
              value: 678,
              text: '转岗'
            },
            {
              value: 681,
              text: '网络'
            },
            {
              value: 684,
              text: '现场招聘会'
            },
            {
              value: 687,
              text: '猎头'
            },
            {
              value: 689,
              text: '内部推荐'
            },
            {
              value: 690,
              text: '招聘海报'
            },
            {
              value: 691,
              text: '校园'
            },
            {
              value: 692,
              text: '通报表扬'
            },
            {
              value: 694,
              text: '嘉奖'
            },
            {
              value: 699,
              text: '员工死亡或失踪..'
            },
            {
              value: 701,
              text: '书面警告'
            },
            {
              value: 703,
              text: '解除劳动合同'
            },
            {
              value: 710,
              text: '家中有紧急事务需要处理'
            },
            {
              value: 709,
              text: '停职检查'
            },
            {
              value: 711,
              text: '实习'
            },
            {
              value: 713,
              text: '技工'
            },
            {
              value: 717,
              text: '未能适应领导的管理方式'
            },
            {
              value: 706,
              text: '降职降薪'
            },
            {
              value: 719,
              text: '团队缺乏合作精神'
            },
            {
              value: 721,
              text: '与同事沟通不顺畅、相处不融洽'
            },
            {
              value: 712,
              text: '个人进修学习'
            },
            {
              value: 715,
              text: '身体健康状况不适应继续工作'
            },
            {
              value: 668,
              text: '晋升'
            },
            {
              value: 680,
              text: '劳务派遣'
            },
            {
              value: 661,
              text: '瑶族'
            },
            {
              value: 696,
              text: '口头警告'
            },
            {
              value: 693,
              text: '其它'
            },
            {
              value: 674,
              text: '例行调薪'
            },
            {
              value: 682,
              text: '主动离职'
            },
            {
              value: 685,
              text: '员工死亡或失踪'
            },
            {
              value: 655,
              text: '藏族'
            },
            {
              value: 688,
              text: '员工达到退休年龄'
            },
            {
              value: 695,
              text: '自行离开公司，未办理任何手续'
            },
            {
              value: 704,
              text: '员工达到退休年龄..'
            },
            {
              value: 707,
              text: '触犯国家法律'
            },
            {
              value: 716,
              text: '家人需要照顾'
            },
            {
              value: 725,
              text: '工作环境差，影响工作效率和状态'
            },
            {
              value: 727,
              text: '工作强度大、时间长'
            },
            {
              value: 732,
              text: '工作能力不适应岗位要求.'
            },
            {
              value: 736,
              text: '试用期不合格'
            },
            {
              value: 740,
              text: '违反公司规章制度'
            },
            {
              value: 745,
              text: '已找到更好工作'
            },
            {
              value: 751,
              text: '工作内容缺乏挑战性、学习性'
            },
            {
              value: 753,
              text: '缺乏晋升空间'
            },
            {
              value: 755,
              text: '欠缺系统培训，学习机会少'
            },
            {
              value: 757,
              text: '工作年限较长，转换发展环境'
            },
            {
              value: 759,
              text: '自动离职'
            },
            {
              value: 760,
              text: '未予公司办理任何离职手续'
            },
            {
              value: 748,
              text: '个人创业'
            },
            {
              value: 657,
              text: '维吾尔族'
            },
            {
              value: 683,
              text: '被动离职'
            },
            {
              value: 649,
              text: '中国银行'
            },
            {
              value: 3878,
              text: '报刊'
            },
            {
              value: 3882,
              text: '人员'
            },
            {
              value: 3876,
              text: '测试职位'
            },
            {
              value: 3872,
              text: '经理'
            },
            {
              value: 3873,
              text: '收营员'
            },
            {
              value: 3874,
              text: '服务员'
            }
          ],
          roles: [
            {
              value: 6093,
              text: '赵浩111'
            },
            {
              value: 387,
              text: 'zc'
            },
            {
              value: 6075,
              text: 'tttt'
            },
            {
              value: 6077,
              text: '服务员2'
            },
            {
              value: 6074,
              text: 'xiaokaitest'
            },
            {
              value: 6080,
              text: 'sjl1'
            },
            {
              value: 6081,
              text: '收银2'
            },
            {
              value: 6082,
              text: '收银3'
            },
            {
              value: 6083,
              text: '666'
            },
            {
              value: 6084,
              text: 'zhaohao111'
            },
            {
              value: 6086,
              text: 'scott'
            },
            {
              value: 6087,
              text: 'zzxzx'
            },
            {
              value: 353,
              text: 'y'
            },
            {
              value: 6109,
              text: '姓名'
            },
            {
              value: 6106,
              text: '账号'
            },
            {
              value: 6110,
              text: '哇哈哈'
            },
            {
              value: 6111,
              text: '211231'
            },
            {
              value: 6112,
              text: '玩死你'
            },
            {
              value: 6108,
              text: '12112'
            },
            {
              value: 39,
              text: 'scm'
            },
            {
              value: 6117,
              text: '门店后台'
            },
            {
              value: 6120,
              text: '测试666'
            },
            {
              value: 1,
              text: 'scm'
            },
            {
              value: 6020,
              text: 'rrr'
            },
            {
              value: 220,
              text: 'xinyx'
            },
            {
              value: 251,
              text: 'mobile'
            },
            {
              value: 252,
              text: 'win'
            },
            {
              value: 6002,
              text: 'lml'
            },
            {
              value: 342,
              text: '崔文杰'
            },
            {
              value: 312,
              text: 'xiaoyg'
            },
            {
              value: 6008,
              text: '0004'
            },
            {
              value: 6122,
              text: '系统设置管理员'
            },
            {
              value: 6123,
              text: '张艳丽'
            },
            {
              value: 6121,
              text: '新供应链'
            },
            {
              value: 6125,
              text: 'dedede'
            },
            {
              value: 6105,
              text: '121212'
            },
            {
              value: 6107,
              text: '12112'
            },
            {
              value: 6001,
              text: '洪佳瑞'
            },
            {
              value: 393,
              text: 'jzf'
            },
            {
              value: 6118,
              text: '配送中心'
            },
            {
              value: 6116,
              text: 'AAA'
            },
            {
              value: 6113,
              text: '不成功弄死你'
            },
            {
              value: 6124,
              text: '雷倩倩'
            },
            {
              value: 6069,
              text: '刘志成'
            },
            {
              value: 6071,
              text: 'llj'
            },
            {
              value: 6068,
              text: 'shouyin2'
            },
            {
              value: 6067,
              text: 'shouyin1'
            },
            {
              value: 6013,
              text: '杨文彦二号'
            },
            {
              value: 6012,
              text: '杨文彦一号'
            },
            {
              value: 349,
              text: '总部'
            },
            {
              value: 6016,
              text: '111111'
            },
            {
              value: 359,
              text: '杜雅文'
            },
            {
              value: 360,
              text: '芒果点菜器测试登录'
            },
            {
              value: 352,
              text: '高健'
            },
            {
              value: 392,
              text: '120'
            },
            {
              value: 344,
              text: '李永峰'
            },
            {
              value: 375,
              text: '崔点菜器2'
            },
            {
              value: 376,
              text: '崔点菜器3'
            },
            {
              value: 6005,
              text: 'sssss'
            },
            {
              value: 366,
              text: '崔点菜器'
            },
            {
              value: 6014,
              text: '柳慧'
            },
            {
              value: 346,
              text: '疯子'
            },
            {
              value: 378,
              text: 'y'
            },
            {
              value: 371,
              text: '高点菜器'
            },
            {
              value: 350,
              text: 'crm'
            },
            {
              value: 372,
              text: '报表01'
            },
            {
              value: 357,
              text: '吕布'
            },
            {
              value: 356,
              text: 'liyuguo'
            },
            {
              value: 354,
              text: 'g'
            },
            {
              value: 364,
              text: '孔3'
            },
            {
              value: 365,
              text: '崔文杰'
            },
            {
              value: 377,
              text: '星星'
            },
            {
              value: 374,
              text: '报表02'
            },
            {
              value: 6018,
              text: 'qwe'
            },
            {
              value: 6019,
              text: 'zxc'
            },
            {
              value: 381,
              text: 'gxj'
            },
            {
              value: 6025,
              text: '测试818'
            },
            {
              value: 363,
              text: '孔2'
            },
            {
              value: 379,
              text: '11'
            },
            {
              value: 367,
              text: 'pad机器人'
            },
            {
              value: 6021,
              text: 'yz'
            },
            {
              value: 6026,
              text: 'cccc'
            },
            {
              value: 6006,
              text: '姜哥'
            },
            {
              value: 6029,
              text: 'scottyz'
            },
            {
              value: 6031,
              text: 'yang'
            },
            {
              value: 6032,
              text: '郭晓静'
            },
            {
              value: 6033,
              text: 'yang01'
            },
            {
              value: 303,
              text: '<h1>cscs</h1>'
            },
            {
              value: 6034,
              text: 'liuhui12'
            },
            {
              value: 6035,
              text: 'xue'
            },
            {
              value: 6036,
              text: '测试人员'
            },
            {
              value: 6037,
              text: '测试测试'
            },
            {
              value: 6038,
              text: 'cc'
            },
            {
              value: 6040,
              text: '柳慧'
            },
            {
              value: 6023,
              text: 'eee'
            },
            {
              value: 6024,
              text: 'ttt'
            },
            {
              value: 6015,
              text: 'liuhui'
            },
            {
              value: 6079,
              text: '收银1'
            },
            {
              value: 6078,
              text: '王伟强测试'
            },
            {
              value: 6085,
              text: '施红亮'
            },
            {
              value: 6070,
              text: '单建龙'
            },
            {
              value: 6091,
              text: 'limit'
            },
            {
              value: 6076,
              text: '服务员1'
            },
            {
              value: 6073,
              text: '肖凯'
            },
            {
              value: 345,
              text: '高健'
            },
            {
              value: 218,
              text: 'xiaoh'
            },
            {
              value: 347,
              text: '拉拉'
            },
            {
              value: 6009,
              text: '0002'
            },
            {
              value: 6017,
              text: 'qq'
            },
            {
              value: 351,
              text: 'g'
            },
            {
              value: 341,
              text: '崔文杰'
            },
            {
              value: 383,
              text: '打印'
            },
            {
              value: 384,
              text: 'lee'
            },
            {
              value: 385,
              text: 'yong'
            },
            {
              value: 6060,
              text: '芒果点菜器1'
            },
            {
              value: 6045,
              text: 'jinxinyu'
            },
            {
              value: 6062,
              text: 'dd'
            },
            {
              value: 6063,
              text: 'sasdasd'
            },
            {
              value: 6064,
              text: 'ssee'
            },
            {
              value: 6065,
              text: 'qqww'
            },
            {
              value: 6066,
              text: 'tt123'
            },
            {
              value: 6061,
              text: 'ss1'
            },
            {
              value: 368,
              text: '崔点菜器'
            },
            {
              value: 6027,
              text: '测试人员'
            },
            {
              value: 373,
              text: 'bbadmin'
            },
            {
              value: 388,
              text: '吴桐'
            },
            {
              value: 389,
              text: '高健'
            },
            {
              value: 390,
              text: '李玉国'
            },
            {
              value: 391,
              text: '点菜器1'
            },
            {
              value: 362,
              text: 'lyf01'
            },
            {
              value: 6004,
              text: 'ss'
            },
            {
              value: 6039,
              text: 'xue'
            },
            {
              value: 386,
              text: '1'
            },
            {
              value: 6003,
              text: '姜正福'
            },
            {
              value: 369,
              text: '高点菜器'
            },
            {
              value: 6041,
              text: 'jxu'
            },
            {
              value: 6042,
              text: '张三'
            },
            {
              value: 6043,
              text: '007'
            },
            {
              value: 6044,
              text: 'lee'
            },
            {
              value: 6049,
              text: 'dp服务员'
            },
            {
              value: 6010,
              text: '0003'
            },
            {
              value: 348,
              text: '洋洋'
            },
            {
              value: 6011,
              text: '孔明1'
            },
            {
              value: 358,
              text: '肖恒PAD'
            },
            {
              value: 343,
              text: '星星'
            },
            {
              value: 6055,
              text: 'wxf'
            },
            {
              value: 6056,
              text: '刘文凯'
            },
            {
              value: 6057,
              text: '王国照'
            },
            {
              value: 6058,
              text: '王国照'
            },
            {
              value: 6022,
              text: 'admin'
            },
            {
              value: 6089,
              text: 'jj'
            },
            {
              value: 6090,
              text: 'test111'
            },
            {
              value: 219,
              text: 'duyw'
            },
            {
              value: 6114,
              text: '躲不起'
            },
            {
              value: 361,
              text: 'zyl01'
            },
            {
              value: 6059,
              text: 'k'
            },
            {
              value: 6028,
              text: 'jjj'
            },
            {
              value: 380,
              text: '芒果点菜器'
            },
            {
              value: 382,
              text: '本地'
            },
            {
              value: 6054,
              text: '张三'
            },
            {
              value: 6030,
              text: '666'
            },
            {
              value: 6053,
              text: '李四'
            },
            {
              value: 6046,
              text: '大鹏'
            },
            {
              value: 6047,
              text: '鹏'
            },
            {
              value: 6048,
              text: 'jinge'
            },
            {
              value: 6050,
              text: '高健'
            },
            {
              value: 6051,
              text: 'jxyuuvalue'
            },
            {
              value: 6052,
              text: '李四1'
            },
            {
              value: 6088,
              text: 'admin11'
            },
            {
              value: 6072,
              text: '呵呵呵'
            },
            {
              value: 370,
              text: 'l'
            },
            {
              value: 6115,
              text: 'AAAAA'
            },
            {
              value: 355,
              text: 'mm'
            },
            {
              value: 6007,
              text: 'lml'
            }
          ]
        }
      }
      this.dataFactory(result.data.positions, this.positionsList)
      this.dataFactory(result.data.roles, this.rolesList)
      console.log(this.positionsList, this.rolesList)
      */
      //
      // 初始化数据
      this.initData()
    },
    mounted () {
      if (this.showSlideRightBody) {
        this.showBody()
      }
    },
    props: ['organiza', 'showOperatorList'],
    data () {
      return {
        showSlideRightBody: this.showOperatorList,
        operatorList: [], // 操作员列表
        rolesList: [], // 角色列表
        positionsList: [], // 职位列表
        keyWord: '',
        form: {
          storeId: null
        }
      }
    },
    methods: {
      initData () {
        this.form.storeId = this.organiza.id
        this.getOperatorListAjax()
        this.getPositionsListAndRolesListAjax()
      },
      getOperatorListAjax () {
        this.$http
          .post('/api/organization/organ/getEmployeeList', { form: this.form, keyWord: this.keyWord, pagination: {} })
          .then(res => {
            try {
              if (res.data.code === '0') {
                this.operatorList = res.data.data
              } else {
                this.$message({ type: 'error', message: res.data.msg })
              }
            } catch (error) {
              console.log(error)
              this.$message({ type: 'error', message: '获取操作员数据失败' })
            }
          })
          .catch(err => {
            this.$message({ type: 'error', message: err.msg })
          })
      },
      getPositionsListAndRolesListAjax () {
        this.$http
          .post('/api/system/personnel/getDetailToOrgan', {})
          .then(res => {
            try {
              if (res.data.code === '0') {
                this.dataFactory(res.data.data.positions, this.positionsList)
                this.dataFactory(res.data.data.roles, this.rolesList)
              } else {
                this.$message({ type: 'error', message: res.data.msg })
              }
            } catch (error) {
              this.$message({ type: 'error', message: '职位和角色数据加载有误' })
            }
          })
          .catch(err => {
            this.$message({ type: 'error', message: err.msg })
          })
      },
      dataFactory (srcArr, targetArr) {
        for (let i = 0; i < srcArr.length; i++) {
          targetArr[i] = { text: srcArr[i].text, value: srcArr[i].text }
        }
      },
      search () {
        this.getOperatorListAjax()
      },
      filterStates (value, row) {
        return row.states === value
      },
      filterRoles (value, row) {
        console.log(value, row.role_name)
        return row.role_name === value
      },
      filterPositions (value, row) {
        console.log(value, row.position)
        return row.position === value
      },
      showBody () { // 显示body
        this.$refs.slideRightBody.style.right = 0
        this.$refs.slideRightBody.style.opacity = 1
      },
      close: function () {
        this.$emit('close')
      }
    }
  }
</script>
