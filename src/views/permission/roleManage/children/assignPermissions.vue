<style lang="less" scoped>
@import "./assignPermissions.less";
</style>
<template>
    <div class="assign-permissions-container">
        <div class="head">
          <div class="title">正在为 <span>{{roleName}}</span> 分配权限</div>
          <i class="saas iconfont saas-nav-closehover" @click="cancle"></i>
        </div>
        
        <div class="moduleTabs">
          <el-tabs @tab-click="toLinkHash">
            <el-tab-pane v-for='(modTab) in modules' 
                :key='modTab.id'
                :name='"ID-" + modTab.id'
                :label='modTab.moduleName'
                ref="mTabs">
            </el-tab-pane>
          </el-tabs>
        </div>

        <div class="main">
          <div class="custom-table-container">
            <div :id="'ID-'+mod.module.id" v-for="(mod) in modulesProcess" :key='mod.module.id'>
              <table :data-moudleid='mod.module.id' class="module-table"  :data-max-opts-count="mod.maxOptsCount" >
                <caption>{{mod.module.moduleName}}</caption>

                <thead>
                  <tr><th colspan="3">系统管理菜单名称</th><th :colspan="mod.maxOptsCount+1">操作功能</th></tr>
                  <tr>
                    <th class="lv lv-th">
                      <label>
                        <input type="checkbox" class="lv1-cb-all" /><span class="my-checkbox-span el-icon-check" />一级菜单
                      </label>
                    </th>
                    <th class="lv lv-th">
                      <label>
                        <input type="checkbox" class="lv2-cb-all" /><span class="my-checkbox-span el-icon-check" />二级菜单
                      </label>
                    </th>
                    <th class="lv lv-th">
                      <label>
                        <input type="checkbox" class="lv3-cb-all" /><span class="my-checkbox-span el-icon-check" />三级菜单
                      </label>
                    </th>
                    <th>
                      <label>
                        <input type="checkbox" class="opt0-cb-all" /><span class="my-checkbox-span el-icon-check" />全选
                      </label>
                    </th>
                    <th v-for="(col, index) in mod.maxOptsCount" :key="index">
                      <label>
                        <input type="checkbox" :class="'opt' + col + '-cb-all'" class="action-opt-all" /><span class="my-checkbox-span el-icon-check" />全选
                      </label>
                    </th>
                  </tr>
                </thead>

                <tbody>
                  <tr v-for="(menu, index) in mod.menu" :key="index">
                    <!-- 1级 -->
                    <td :data-id='menu.lv1.id' v-if="menu.lv1" class="lv lv-td lv1">
                      <label>
                        <input type="checkbox" :checked="menu.lv1.auth === 1" :value="menu.lv1.id" class="lv1-cb" :class="'lv1-cb-'+menu.lv1.id" :data-cb-id='menu.lv1.id' />
                        <span class="my-checkbox-span el-icon-check" />
                        {{menu.lv1.moduleName}}
                      </label>
                    </td>
                    <td v-else class='lv'></td>
                    <!-- 2级 -->
                    <td :data-id='menu.lv2.id' v-if="menu.lv2" class="lv lv-td lv2">
                      <label>
                        <input type="checkbox" :checked="menu.lv2.auth === 1" :value="menu.lv2.id" class="lv2-cb" :class="'lv2-cb-'+menu.lv2.id" :name='"lv1-cb-child-" + menu.lv1.id' :data-cb-id='menu.lv2.id' />
                        <span class="my-checkbox-span el-icon-check" />
                        {{menu.lv2.moduleName}}
                      </label>
                    </td>
                    <td v-else class='lv'></td>
                    <!-- 3级 -->
                    <td :data-id='menu.lv3.id' v-if="menu.lv3" class="lv lv-td lv3">
                      <label>
                        <input type="checkbox" :checked="menu.lv3.auth === 1" :value="menu.lv3.id" class="lv3-cb" :class="'lv3-cb-'+menu.lv3.id" :name='"lv2-cb-child-" + menu.lv2.id' :data-cb-id='menu.lv3.id' />
                        <span class="my-checkbox-span el-icon-check" />
                        {{menu.lv3.moduleName}}
                      </label>
                    </td>
                    <td v-else class='lv'></td>

                    <!-- 查看 -->
                    <td>
                      <label>
                        <input type="checkbox" :checked="menu.lv3?menu.lv3.auth:menu.lv2?menu.lv2.auth:menu.lv1?menu.lv1.auth:false"
                               :class="'opt0-cb ' + getOpt0Class(menu)"
                               :name="getOpt0Name(menu)"
                               :data-cb-id="menu.lv3?menu.lv3.id:menu.lv2?menu.lv2.id:menu.lv1?menu.lv1.id:''" />
                        <span class="my-checkbox-span el-icon-check" />
                        查看
                      </label>
                    </td>

                    <!-- 操作项 -->
                    <td v-for="(opt, index) in getOptsArr(menu, mod.maxOptsCount)" :key="opt.id">
                      <label v-if="opt.id">
                        <input type="checkbox" :checked='opt.auth === 1' :value="opt.id" 
                               :class="'opt'+(index+1)+'-cb'+' '+'opt'+(index+1)+'-cb-'+opt.id" 
                               class='action-opt' 
                               :name="getOptxName(menu)" 
                               :data-cb-id="menu.lv3?menu.lv3.id:menu.lv2?menu.lv2.id:menu.lv1?menu.lv1.id:''"/>
                        <span class="my-checkbox-span el-icon-check" />
                        {{opt.moduleName}}
                      </label>
                    </td>

                  </tr>
                </tbody>
                
              </table>
            </div>
          </div>
        </div>

        <div class="opt">
          <el-button class="cancle" @click="cancle">取消</el-button>
          <el-button type="primary" class="submitBtn" @click="submit">确定</el-button>
        </div>

    </div>
</template>
<script>
export default {
  created () {
    /*
    // 获取系统管理模块的数据
    var result = [
      {
        auth: 1,
        children: [
          {
            auth: 1,
            children: [
              {
                auth: 1,
                children: [
                  {
                    auth: 1,
                    children: [],
                    fatherModuleId: 800070,
                    id: 800270,
                    moduleLevel: 4,
                    moduleName: '制卡',
                    operation: [],
                    orderNum: null,
                    target: 0
                  },
                  {
                    auth: 1,
                    children: [],
                    fatherModuleId: 800070,
                    id: 800271,
                    moduleLevel: 4,
                    moduleName: '发卡',
                    operation: [],
                    orderNum: null,
                    target: 0
                  },
                  {
                    auth: 1,
                    children: [],
                    fatherModuleId: 800070,
                    id: 800272,
                    moduleLevel: 4,
                    moduleName: '充值',
                    operation: [],
                    target: 0
                  },
                  {
                    auth: 0,
                    children: [],
                    fatherModuleId: 800070,
                    id: 804083,
                    moduleLevel: 4,
                    moduleName: '重置密码',
                    operation: [],
                    target: 0
                  },
                  {
                    auth: 0,
                    children: [],
                    fatherModuleId: 800070,
                    id: 804085,
                    moduleLevel: 4,
                    moduleName: '购买会籍',
                    operation: [],
                    target: 0
                  }
                ],
                fatherModuleId: 800017,
                id: 800070,
                moduleLevel: 3,
                moduleName: '会员卡,券管理',
                operation: [],
                target: 1
              }
            ],
            fatherModuleId: 800001,
            id: 800017,
            moduleLevel: 2,
            moduleName: '会员',
            operation: [],
            orderNum: null,
            target: 1
          }
        ],
        fatherModuleId: 0,
        id: 800001,
        moduleLevel: 1,
        moduleName: '前台主界面',
        operation: [],
        orderNum: null,
        target: 1
      },
      {
        auth: 1,
        children: [
          {
            auth: 1,
            children: [
              {
                auth: 1,
                children: [
                  {
                    auth: 0,
                    operation: [
                      {
                        auth: 0,
                        children: [],
                        fatherModuleId: 40301,
                        id: 650014,
                        moduleLevel: 5,
                        moduleName: '新增',
                        operation: [],
                        orderNum: 1,
                        target: 0
                      },
                      {
                        auth: 0,
                        children: [],
                        fatherModuleId: 40301,
                        id: 650015,
                        moduleLevel: 5,
                        moduleName: '编辑',
                        operation: [],
                        orderNum: 2,
                        target: 0
                      },
                      {
                        auth: 0,
                        children: [],
                        fatherModuleId: 40301,
                        id: 650016,
                        moduleLevel: 5,
                        moduleName: '查看详情',
                        operation: [],
                        orderNum: 5,
                        target: 0
                      },
                      {
                        auth: 0,
                        children: [],
                        fatherModuleId: 40301,
                        id: 650017,
                        moduleLevel: 5,
                        moduleName: 'SAAS车辆停用权限',
                        operation: [],
                        orderNum: 6,
                        target: 0
                      }
                    ],
                    fatherModuleId: 40201,
                    id: 40301,
                    moduleLevel: 4,
                    moduleName: '车辆管理',
                    target: 1
                  },
                  {
                    auth: 1,
                    operation: [
                      {
                        auth: 1,
                        children: [],
                        fatherModuleId: 40302,
                        id: 650018,
                        moduleLevel: 5,
                        moduleName: '新增',
                        operation: [],
                        orderNum: 1,
                        target: 0
                      },
                      {
                        auth: 1,
                        children: [],
                        fatherModuleId: 40302,
                        id: 650019,
                        moduleLevel: 5,
                        moduleName: '编辑',
                        operation: [],
                        orderNum: 2,
                        target: 0
                      },
                      {
                        auth: 1,
                        children: [],
                        fatherModuleId: 40302,
                        id: 650020,
                        moduleLevel: 5,
                        moduleName: '删除',
                        operation: [],
                        orderNum: 4,
                        target: 0
                      },
                      {
                        auth: 1,
                        children: [],
                        fatherModuleId: 40302,
                        id: 650021,
                        moduleLevel: 5,
                        moduleName: 'SAAS线路审核权限',
                        operation: [],
                        orderNum: 8,
                        target: 0
                      },
                      {
                        auth: 1,
                        children: [],
                        fatherModuleId: 40302,
                        id: 650022,
                        moduleLevel: 5,
                        moduleName: 'SAAS线路反审核权限',
                        operation: [],
                        orderNum: 9,
                        target: 0
                      },
                      {
                        auth: 1,
                        children: [],
                        fatherModuleId: 40302,
                        id: 650023,
                        moduleLevel: 5,
                        moduleName: 'SAAS线路导出excel权限',
                        operation: [],
                        orderNum: 10,
                        target: 0
                      }
                    ],
                    fatherModuleId: 40201,
                    id: 40302,
                    moduleLevel: 4,
                    moduleName: '线路管理',
                    target: 1
                  },
                  {
                    auth: 1,
                    children: [],
                    fatherModuleId: 40201,
                    id: 40303,
                    moduleLevel: 4,
                    moduleName: '配送单据打印模板',
                    operation: [],
                    target: 0
                  }
                ],
                fatherModuleId: 40101,
                id: 40201,
                moduleLevel: 3,
                moduleName: '配送设置',
                operation: [],
                target: 1
              },
              {
                auth: 0,
                children: [
                  {
                    auth: 0,
                    operation: [
                      {
                        auth: 0,
                        children: [],
                        fatherModuleId: 40321,
                        id: 40401,
                        moduleLevel: 5,
                        moduleName: '新增',
                        operation: [],
                        orderNum: 1,
                        target: 0
                      },
                      {
                        auth: 0,
                        children: [],
                        fatherModuleId: 40321,
                        id: 40404,
                        moduleLevel: 5,
                        moduleName: '编辑',
                        orderNum: 2,
                        operation: [],
                        target: 0
                      },
                      {
                        auth: 0,
                        children: [],
                        fatherModuleId: 40321,
                        id: 40410,
                        moduleLevel: 5,
                        moduleName: '删除',
                        operation: [],
                        orderNum: 4,
                        target: 0
                      },
                      {
                        auth: 0,
                        children: [],
                        fatherModuleId: 40321,
                        id: 40407,
                        moduleLevel: 5,
                        moduleName: '审核',
                        operation: [],
                        orderNum: 7,
                        target: 0
                      },
                      {
                        auth: 0,
                        children: [],
                        fatherModuleId: 40321,
                        id: 40413,
                        moduleLevel: 5,
                        moduleName: '终止',
                        operation: [],
                        orderNum: 8,
                        target: 0
                      },
                      {
                        auth: 0,
                        children: [],
                        fatherModuleId: 40321,
                        id: 40416,
                        moduleLevel: 5,
                        moduleName: '复制',
                        operation: [],
                        orderNum: 9,
                        target: 0
                      }
                    ],
                    fatherModuleId: 40203,
                    id: 40321,
                    moduleLevel: 4,
                    moduleName: '编制配送调价单',
                    target: 1
                  },
                  {
                    auth: 0,
                    children: [],
                    fatherModuleId: 40203,
                    id: 40322,
                    moduleLevel: 4,
                    moduleName: '查询配送调价单',
                    operation: [],
                    target: 0
                  }
                ],
                fatherModuleId: 40101,
                id: 40203,
                moduleLevel: 3,
                moduleName: '调价管理',
                operation: [],
                target: 1
              }
            ],
            fatherModuleId: 40001,
            id: 40101,
            moduleLevel: 2,
            moduleName: '配送管理',
            operation: [],
            target: 1
          },
          {
            auth: 0,
            children: [
              {
                auth: 0,
                children: [],
                fatherModuleId: 41101,
                id: 41201,
                moduleLevel: 3,
                moduleName: '配送往来报表',
                operation: [],
                target: 1
              }
            ],
            fatherModuleId: 40001,
            id: 41101,
            moduleLevel: 2,
            moduleName: '配送报表',
            operation: [],
            target: 1
          },
          {
            auth: 1,
            children: [],
            fatherModuleId: 0,
            id: 90222,
            moduleLevel: 4,
            moduleName: '测试数据',
            operation: [],
            target: 1
          }
        ],
        fatherModuleId: 0,
        id: 40001,
        moduleLevel: 1,
        moduleName: '配送中心',
        operation: [],
        orderNum: null,
        target: 1
      },
      {
        auth: 1,
        children: [
          {
            auth: 1,
            children: [],
            fatherModuleId: 90001,
            id: 67,
            moduleLevel: 2,
            moduleName: '付款实际收入查询',
            operation: [],
            target: 0
          },
          {
            auth: 1,
            children: [],
            fatherModuleId: 90001,
            id: 90101,
            moduleLevel: 2,
            moduleName: '菜品类别销售查询',
            operation: [],
            target: 0
          }
        ],
        fatherModuleId: 0,
        id: 90001,
        moduleLevel: 1,
        moduleName: 'POS报表',
        operation: [],
        orderNum: null,
        target: 1
      }
    ]
    // 数据加工
    this.modules = result
    this.dataFactory(result)
    */
    //
    //
    // 获取路由参数
    this.roleId = this.$route.query.roleId
    this.roleName = this.$route.query.roleName

    // 初始化
    this.initAjax()
  },
  mounted () {
    // 这里的处理时机应该是在异步请求之后//使用假数据时使用
    // 处理rowspan
    this.handleRowspan(1)
    this.handleRowspan(2)
    this.handleRowspan(3)
    // 初始化表头状态
    this.initState()
    //
    // 处理复选框
    this.handleCheckBox()
  },
  data () {
    return {
      roleId: '',
      roleName: '',
      modules: [], // 模块数据
      modulesProcess: [], // 模块处理数据
      allPermissionIds: [] // 最后需要提交的权限ID数组
    }
  },
  methods: {
    initAjax () { // 数据初始化
      this.$http
        .post('/api/role/roles/getRoleAuth', {roleId: this.roleId})
        .then(res => {
          // console.log(res)
          if (res.data.code === '0') { // 数据响应成功
            // 数据加工
            this.modules = res.data.data
            this.dataFactory(this.modules)

            this.$nextTick(() => { // 渲染完毕
              // 处理rowspan
              this.handleRowspan(1)
              this.handleRowspan(2)
              this.handleRowspan(3)
              //
              // 处理复选框
              this.handleCheckBox()
            })
          } else { // 数据响应失败
            this.$message({ type: 'error', message: res.data.msg })
          }
        })
        .catch(err => { // 响应错误
          this.$message({ type: 'error', message: err.msg })
        })
    },
    saveAjax () { // 保存
      this.$http
        .post('/api/role/roles/updateRoles', {m_ids: this.allPermissionIds.join(','), roleId: this.roleId, type: 2})
        .then(res => {
          // console.log(res)
          this.$message({ type: 'success', message: res.data.msg })
          this.cancle()
        })
        .catch(err => { // 响应错误
          this.$message({ type: 'error', message: err.msg })
        })
    },
    dataFactory (data) { // 数据工厂，用于数据初始化处理 // 初始化前3级菜单
      if (data && data.length > 0) {
        for (let i = 0; i < data.length; i++) {
          let module = data[i] // 每个模块数据
          this.modulesProcess[i] = { 'module': module, menu: [], maxOptsCount: 0 }
          //
          for (let j = 0; j < module.children.length; j++) { // 1. 处理1级菜单
            let lv1 = module.children[j]
            //
            if (lv1.children && lv1.children.length > 0) {
              for (let k = 0; k < lv1.children.length; k++) { // 2. 处理2级菜单
                let lv2 = lv1.children[k]
                //
                if (lv2.children && lv2.children.length > 0) {
                  for (let n = 0; n < lv2.children.length; n++) { // 3. 处理3级菜单
                    let lv3 = lv2.children[n]
                    this.modulesProcess[i].menu.push({'lv1': lv1, 'lv2': lv2, 'lv3': lv3})
                    //
                    if (lv3.operation && lv3.operation.length > 0) { // 计算最大值
                      for (let z = 0; z < lv3.operation.length; z++) {
                        let opt = lv3.operation[z]
                        if (opt.orderNum && opt.orderNum > this.modulesProcess[i].maxOptsCount) {
                          this.modulesProcess[i].maxOptsCount = opt.orderNum
                        }
                      }
                    }
                  }
                } else {
                  this.modulesProcess[i].menu.push({'lv1': lv1, 'lv2': lv2})
                  //
                  if (lv2.operation && lv2.operation.length > 0) { // 计算最大值
                    for (let y = 0; y < lv2.operation.length; y++) {
                      let opt = lv2.operation[y]
                      if (opt.orderNum && opt.orderNum > this.modulesProcess[i].maxOptsCount) {
                        this.modulesProcess[i].maxOptsCount = opt.orderNum
                      }
                    }
                  }
                }
              }
            } else {
              this.modulesProcess[i].menu.push({'lv1': lv1})
              //
              if (lv1.operation && lv1.operation.length > 0) { // 计算最大值
                for (let x = 0; x < lv1.operation.length; x++) {
                  let opt = lv1.operation[x]
                  if (opt.orderNum && opt.orderNum > this.modulesProcess[i].maxOptsCount) {
                    this.modulesProcess[i].maxOptsCount = opt.orderNum
                  }
                }
              }
            }
          }
        }
      }
    },
    handleRowspan (menuLevel) {  // 处理跨列合并问题，传入菜单级别1级菜单传入1（1、2、3）
      // 1. 拿到所有的模块表格
      let moduleTables = document.querySelectorAll('.module-table')
      for (let i = 0; i < moduleTables.length; i++) {
        let mt = moduleTables[i]
        // 2. 拿到该表格下所有1级菜单单元格
        let lvTds = mt.querySelectorAll('.lv' + menuLevel)
        // 3. 拿到该表格下所有1级菜单单元格的自定义ID属性
        let lvTdIds = []
        for (let j = 0; j < lvTds.length; j++) {
          lvTdIds.push(lvTds[j].dataset.id)
        }
        // 4. 数组去重
        lvTdIds = Array.from(new Set(lvTdIds))
        // console.log(lvTdIds)
        // 5. 把该表格下所有1级菜单单元格按照ID进行分组
        let lvGroups = []
        for (let l = 0; l < lvTdIds.length; l++) { // 遍历所有不重复的id数组
          let k = lvTdIds[l] // 使用id作为键
          let v = [] // 该表格下所有1级菜单单元格的自定义id属性和该id相同，就都放到该数组中，表示是同一个组
          for (let n = 0; n < lvTds.length; n++) { // 遍历该表格下所有1级菜单单元格
            if (lvTds[n].dataset.id === k) {
              v.push(lvTds[n])
            }
          }
          let g = {}
          g[k] = v
          lvGroups.push(g)
        }
        // console.log(lvGroups)
        // 6. 把组里面第一个单元格的rowspan设置成该组的大小，其余的删除
        for (let m = 0; m < lvGroups.length; m++) { // 组结构：键：id，值：[tds, ...] // [{40101: Array(12)},{41101: Array(2)}]
          let v = lvGroups[m]
          for (let k in v) {
            let tmpLvTds = v[k]
            for (let x = 0; x < tmpLvTds.length; x++) {
              if (x === 0) {
                tmpLvTds[x].setAttribute('rowspan', tmpLvTds.length)
              } else {
                tmpLvTds[x].parentNode.removeChild(tmpLvTds[x].parentNode.children[0])
              }
            }
          }
        }
      }
    },
    // 初始化表头
    initState () {
      let moduleTables = document.querySelectorAll('.module-table')
      for (let i = 0; i < moduleTables.length; i++) {
        let tb = moduleTables[i]
        this.setAllCheckedState(tb, 'lv1')
        this.setAllCheckedState(tb, 'lv2')
        this.setAllCheckedState(tb, 'lv3')
        let maxOptsCount = tb.dataset.maxOptsCount // max-opts-count
        let allOptsCount = +maxOptsCount + 1 // 包含查看操作（注意要转换成数字再运算）
        for (let j = 0; j < allOptsCount; j++) {
          this.setAllCheckedState(tb, 'opt' + j)
        }
      }
    },
    setAllCheckedState (tb, lv) {
      let state = true
      let cbs = tb.querySelectorAll(`.${lv}-cb`)
      if (cbs && cbs.length > 0) {
        /*
        cbs.forEach(item => {
          state = state && item.checked
        })
        */
        // IE 不支持forEach
        for (let q = 0; q < cbs.length; q++) {
          state = state && cbs[q].checked
        }
      } else {
        state = false
      }
      tb.querySelector(`.${lv}-cb-all`).checked = state
    },
    toLinkHash (tab) { // 锚点跳转
      document.querySelector(`#${tab.name}`).scrollIntoView({ behavior: 'smooth', block: 'start', inline: 'nearest' })
    },
    getOptsArr (menu, maxOptsCount) { // 获取需要进行遍历的操作按钮的数组（需要根据该模块最大跨列数进行拼接数组）
      function handle (targetArr, maxLen) {
        if (targetArr.length < maxLen) {
          let tmpArr = new Array(maxOptsCount)
          for (let i = 0; i < maxOptsCount; i++) {
            tmpArr[i] = ''
          }
          for (let i = 0; i < targetArr.length; i++) {
            tmpArr.splice(targetArr[i].orderNum - 1, 1, targetArr[i])
          }
          targetArr = tmpArr
        }
        return targetArr
      }
      return menu.lv3 ? handle(menu.lv3.operation, maxOptsCount) : menu.lv2 ? handle(menu.lv2.operation, maxOptsCount) : menu.lv1 ? handle(menu.lv1.operation, maxOptsCount) : handle([], maxOptsCount)
    },
    handleCheckBox () {
      // 拿到所有模块的Table
      let moduleTables = document.querySelectorAll('.module-table')
      for (let i = 0; i < moduleTables.length; i++) {
        let tb = moduleTables[i]
        tb.onclick = e => {
          let target = e.target
          if (target.nodeName.toUpperCase() === 'INPUT') {
            // 0. 获取事件源的级别
            let targetLv = this.getTargetLv(target, /-cb-all|-cb$/) // lv1-cb-all lv1-cb
            // console.log(targetLv) // lv1 lv2 lv3 opt0 opt1 ...
            //
            // 1. 处理全选，点击表头全选按钮，选中下面相应的子按钮
            this.handleAllChecked(tb, target, targetLv)
            // 2. 处理非全选，点击表头下面的子按钮，如果全部选中，就把上面相应的表头选中
            this.handleNoAllChecked(tb, target, targetLv)
            // 3. 处理纵向级联
            this.handleCascade(tb, target, targetLv)
          }
        }
      }
    },
    // 通过传入的正则，获取事件源的级别，lv1、lv2、lv3、opt0、opt1...
    getTargetLv (target, reg) {
      let targetLv
      let classes = target.classList // 获取事件源所有类名
      /*
      classes.forEach(clazz => {
        if (reg.test(clazz)) {
          targetLv = clazz.replace(reg, '')
          return false
        }
      })
      */
      // IE 不支持forEach
      for (let p = 0; p < classes.length; p++) {
        let clazz = classes[p]
        if (reg.test(clazz)) {
          targetLv = clazz.replace(reg, '')
          break
        }
      }
      return targetLv
    },
    // 处理全选
    handleAllChecked (tb, target, targetLv) {
      if (!target) return
      // 如果点击是表头的全选按钮
      if (target.classList.contains(`${targetLv}-cb-all`)) { // lv1 -cb-all // lv2 -cb-all // lv3 -cb-all // opt0 -cb-all // opt1 -cb-all
        // 获取该表头下所有的子按钮，全部选中或不选中
        let cbs = tb.querySelectorAll(`.${targetLv}-cb`)
        for (let b = 0; b < cbs.length; b++) {
          cbs[b].checked = target.checked
        }
      }
    },
    // 处理不全选
    handleNoAllChecked (tb, target, targetLv) {
      if (!target) return
      if (target.classList.contains(`${targetLv}-cb`)) {
        // 获取该级别所有兄弟，如果有一个没选中，表头全选按钮不选中，否则表头全选
        let allChecked = true
        let cbs = tb.querySelectorAll(`.${targetLv}-cb`)
        for (let c = 0; c < cbs.length; c++) {
          if (!cbs[c].checked) {
            allChecked = false
            break
          }
        }
        tb.querySelector(`.${targetLv}-cb-all`).checked = allChecked
      }
    },
    // 处理纵向级联
    handleCascade (tb, target, targetLv) {
      if (target.classList.contains(`${targetLv}-cb-all`)) {
        // （前->后）父级向子级级联，选择父级，子级自动级联
        if (target.classList.contains('opt0-cb-all') && target.checked) {
          // console.log('选中状态，查看不参与父向子级联')
        } else {
          this.cascadeBottomLvV(tb, tb.querySelectorAll(`.${targetLv}-cb`), target.checked)
        }
        // （后->前）子级向父级级联，选择子级，父级自动级联
        if (target.classList.contains('action-opt-all') && !target.checked) {
          // console.log('非选中状态，操作不参与子向父级联')
        } else {
          let cbs = tb.querySelectorAll(`.${targetLv}-cb`)
          for (let a = 0; a < cbs.length; a++) {
            // （后->前）
            this.cascadeTopLv(tb, cbs[a])
          }
        }
      }
      if (target.classList.contains(`${targetLv}-cb`)) {
        // （前->后）
        if (target.classList.contains('opt0-cb') && target.checked) {
          // console.log('选中状态，查看不参与父向子级联')
        } else {
          this.cascadeBottomLvH(tb, target)
        }
        // （后->前）
        if (target.classList.contains('action-opt') && !target.checked) {
          // console.log('非选中状态，操作不参与子向父级联')
        } else {
          this.cascadeTopLv(tb, target)
        }
      }
    },
    // 父向子级联（V）
    cascadeBottomLvV (tb, cbs, checked) { // cbs是下级复选框列表，checked是上级的状态
      for (let i = 0; i < cbs.length; i++) { // 遍历所有下级复选框
        cbs[i].checked = checked // 所有下级和上级状态保持一致
        let lv = this.getTargetLv(cbs[i], /-cb$/) // 下级级别
        // let id = cbs[i].value // 下级id
        let id = cbs[i].dataset.cbId
        //
        // 非全选
        this.handleNoAllChecked(tb, cbs[i], lv)
        //
        let nextCbs = document.getElementsByName(`${lv}-cb-child-${id}`) // 找到所有下下级
        if (nextCbs.length > 0) { // 如果下下级存在，说明当前下级是菜单，继续
          this.cascadeBottomLvV(tb, nextCbs, cbs[i].checked)
        } else {
          // console.log('操作，无下级')
        }
      }
    },
    // 子向父级联（V）子向父级联（H）
    cascadeTopLv (tb, cb) {
      let name = cb.name
      if (name && name.length > 0) {
        //
        if (!cb.checked) { // 如果是取消，判断有没有同组的兄弟选择，如果有不参与子向父级联
          // 更新bug
          let flag = false
          let groupSibling = tb.querySelectorAll(`[name=${name}]`) // 找到同组兄弟
          if (groupSibling && groupSibling.length > 0) {
            for (let x = 0; x < groupSibling.length; x++) {
              let tmpCb = groupSibling[x]
              if (tmpCb.checked) {
                flag = true
                break
              }
            }
          }
          if (!flag) { // 同组的没有任何兄弟是选中的，该cb就参与子向父级联
            // console.log('我有上级', cb.name.replace(/-child-/, '-'))  // 下级name：lv1-cb-child-{lv1.id} // 上级类：lv1-cb{lv1.id}
            let upLvClass = cb.name.replace(/-child-/, '-')
            let upLv = document.querySelector(`.${upLvClass}`)
            upLv.checked = cb.checked
            //
            // 非全选
            this.handleNoAllChecked(tb, upLv, upLvClass.split('-')[0])
            //
            //
            this.cascadeTopLv(tb, upLv)
          }
        } else {
          // console.log('我有上级', cb.name.replace(/-child-/, '-'))  // 下级name：lv1-cb-child-{lv1.id} // 上级类：lv1-cb{lv1.id}
          let upLvClass = cb.name.replace(/-child-/, '-')
          let upLv = document.querySelector(`.${upLvClass}`)
          upLv.checked = cb.checked
          //
          // 非全选
          this.handleNoAllChecked(tb, upLv, upLvClass.split('-')[0])
          //
          //
          this.cascadeTopLv(tb, upLv)
        }
      } else {
        // console.log('我是1级没有上级')
      }
    },
    // 父向子级联（H）
    cascadeBottomLvH (tb, cb) {
      let lv = this.getTargetLv(cb, /-cb$/)
      // let id = cb.value
      let id = cb.dataset.cbId
      // console.log(lv, id)
      let nextCbs = document.getElementsByName(`${lv}-cb-child-${id}`) // 找到所有下级
      if (nextCbs.length > 0) { // 如果下级存在，说明当前是菜单，继续
        for (let a = 0; a < nextCbs.length; a++) {
          nextCbs[a].checked = cb.checked
          let lv = this.getTargetLv(nextCbs[a], /-cb$/) // 下级级别
          //
          // 非全选
          this.handleNoAllChecked(tb, nextCbs[a], lv)
          //
          this.cascadeBottomLvH(tb, nextCbs[a])
        }
      } else {
        // console.log('操作，无下级')
      }
    },
    submit () { // 提交 // 需要把模块id也一并带过去
      this.allPermissionIds = []
      let tbs = document.querySelectorAll('.module-table')
      for (let x = 0; x < tbs.length; x++) { // data-moudleid
        let moudleid = tbs[x].dataset.moudleid
        let currentMoudleAllCheckedCbs = tbs[x].querySelectorAll('[type=checkbox]:checked') // 当前模块勾选的所有复选框（含标题和查看，提交时要排除）
        let checkedCbCount = 0
        for (let y = 0; y < currentMoudleAllCheckedCbs.length; y++) {
          if (currentMoudleAllCheckedCbs[y].value !== 'on') {
            checkedCbCount++
            this.allPermissionIds.push(currentMoudleAllCheckedCbs[y].value)
          }
        }
        if (checkedCbCount > 0) { // 如果当前模块中有勾选的复选框，就把该模块id也提交过去，如果该模块没有任何勾选的复选框，该模块的id也不需要提交过去
          this.allPermissionIds.push(moudleid)
        }
      }
      // console.log(this.allPermissionIds)
      // 发送请求保存权限
      this.saveAjax()
    },
    cancle () { // 取消，关闭窗口
      this.$router.go(-1)
    },
    getOpt0Class (menu) { // 获取查看按钮的类
      if (menu.lv3) {
        return 'opt0-cb-' + menu.lv3.id
      } else if (menu.lv2) {
        return 'opt0-cb-' + menu.lv2.id
      } else if (menu.lv1) {
        return 'opt0-cb-' + menu.lv1.id
      } else {
        return ''
      }
    },
    getOpt0Name (menu) { // 获取查看按钮的name属性的值
      if (menu.lv3) {
        return 'lv3-cb-child-' + menu.lv3.id
      } else if (menu.lv2) {
        return 'lv2-cb-child-' + menu.lv2.id
      } else if (menu.lv1) {
        return 'lv1-cb-child-' + menu.lv1.id
      } else {
        return ''
      }
    },
    getOptxName (menu) {
      if (menu.lv3) {
        return 'opt0-cb-child-' + menu.lv3.id
      } else if (menu.lv2) {
        return 'opt0-cb-child-' + menu.lv2.id
      } else if (menu.lv1) {
        return 'opt0-cb-child-' + menu.lv1.id
      } else {
        return ''
      }
    }
  }
}
</script>
<style lang="less">
  .assign-permissions-container {
    .moduleTabs {
      .el-tabs {
        .el-tabs__header {
          margin: 0;
          .el-tabs__nav-wrap {
            padding: 0 20px;
            &.is-scrollable {
              padding: 0 50px;
              .el-tabs__nav-prev {
                height: 31px;
                width: 18px;
                text-align: center;
                margin-left: 20px;
                display: flex;
                align-items: center;
                justify-content: center;
                box-shadow: 8px 0 20px #f5f5f5;
              }
              .el-tabs__nav-next {
                height: 31px;
                width: 18px;
                text-align: center;
                margin-right: 20px;
                display: flex;
                align-items: center;
                justify-content: center;
                box-shadow: -8px 0 20px #f5f5f5;
              }
            }
            .el-tabs__nav-scroll {
              .el-tabs__nav {
                .el-tabs__active-bar {
                  width: 100px;
                }
                .el-tabs__item {
                  height: 31px;
                  line-height: 31px;
                }
              }
            }
            &::after {
              height: 1px;
            }
          }
        }
      }
    }
  }
</style>
