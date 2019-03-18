<style lang='less' scoped>
  @import './organizaManage.less';
</style>
<template>
  <div class='organiza-manage-container'>

    <div v-if="auth['moduleAuth_save']" class='head'>
      <div class="opt"></div>
      <el-dropdown v-if="auth['moduleAuth_save']" size="small" @command="handleAddCommand">
        <el-button class='add-btn'>
          <span class="saas iconfont saas-button-add"></span>
          新增
        </el-button>
        <el-dropdown-menu slot="dropdown">
          <el-dropdown-item command='addCompany'>分公司</el-dropdown-item>
          <el-dropdown-item command='addStore'>门店</el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
    </div>

    <div class='main'>
      <div class='tree'>
        <div class='head'>
          <div class='shrink'>
            <i class='saas iconfont saas-shrink-all' @click="shrinkAll"></i>
          </div>
          <div class='expand'>
            <i class='saas iconfont saas-expand-all' @click="expandAll"></i>
          </div>
          <div class='search'>
            <el-input class='search-input' placeholder='请输入名称 / 编码' v-model='filterText' clearable >
              <i slot="suffix" class="saas iconfont saas-seach"></i>
            </el-input>
          </div>
        </div>
        <div class='content'>
          <el-tree
            class='organiza-tree'
            @current-change="handleTreeNodeSingleSelected"
            default-expand-all
            :expand-on-click-node="false"
            :data='organizaTreeData'
            :props='defaultProps'
            node-key="id"
            highlight-current
            :filter-node-method='filterNode'
            @node-click="handleNodeClick"
            :render-content="renderContent"
            ref='organizaTree'>
          </el-tree>
          <transition :name="inTopAnim ? 'el-zoom-in-top' : 'el-zoom-in-bottom'">
            <div class="right-menu" ref="rightMenu" id="right-menu" v-show="isShowRightMenu && rightMenuData && rightMenuData.length > 0" @mouseleave="isShowRightMenu = false">
              <ul class="lv1">
                <li v-for="(item1, index1) in rightMenuData" :key="index1" @mouseenter="popCascadeSubMenu(item1)" @mouseleave="slideCascadeSubMenu(item1)" @click="handleMenuService(item1)">
                  {{item1.title}}
                  <i v-if="item1.children" class="saas iconfont saas-right-sj"></i>
                  <transition name="slide-fade">
                    <ul class="lv2" v-if="item1.children && isShowCascadeSubMenu">
                      <li v-for="(item2, index2) in item1.children" :key="index2" @click="handleMenuService(item2)">{{item2.title}}</li>
                    </ul>
                  </transition>
                </li>
              </ul>
            </div>
          </transition>
        </div>
      </div>

      <div class='split-line'></div>

      <div class='table tzx-table-container'>
        <el-table @filter-change="filterChange" :data="organizaListData" tooltip-effect='light' :enterable='false' empty-text=" " @sort-change="handleSort" @row-dblclick="handleDbClick">
          <el-table-column min-width="90px" label="机构编码" sortable="custom" prop="organ_code">
            <template slot-scope="scope">
              {{scope.row.organCode}}
            </template>
          </el-table-column>
          <el-table-column min-width="90px" prop="orgFullName" label="机构全称" show-overflow-tooltip></el-table-column>
          <el-table-column min-width="90px" prop="orgShortName" label="机构简称" show-overflow-tooltip></el-table-column>

          <el-table-column
            min-width="90px"
            label="状态"
            prop='tag'
            column-key='validStateFilter'
            :filters="[{ text: '启用', value: '1' }, { text: '停用', value: '0' }]"
            :filter-method="filterValidState"
            :filter-multiple="false"
            filter-placement="bottom-start">
            <template slot-scope="scope">
              <el-tag v-if='scope.row.validState === "1"' type="success">启用</el-tag>
              <el-tag v-else-if='scope.row.validState === "0"' type="danger">停用</el-tag>
            </template>
          </el-table-column>

          <el-table-column
            min-width="90px"
            label="营业状态"
            prop='tag'
            column-key='operatingStatusFilter'
            :filters="[{ text: '正常', value: 'normal_business' }, { text: '暂停', value: 'suspension_business' }, { text:'关店', value:'closed' }]"
            :filter-method="filterOperatingStatus"
            :filter-multiple="false"
            filter-placement="bottom-start">
            <template slot-scope="scope">
              <el-tag v-if='scope.row.operatingStatus === "normal_business"' type="success">正常</el-tag>
              <el-tag v-else-if='scope.row.operatingStatus === "suspension_business"' type="warning">暂停</el-tag>
              <el-tag v-else-if='scope.row.operatingStatus === "closed"' type="danger">关店</el-tag>
            </template>
          </el-table-column>

          <el-table-column
            min-width="90px"
            label="在线状态"
            prop='tag'
            column-key='storeStateFilter'
            :filters="[{ text: '在线', value: 'z' }, { text: '离线', value: 'x' }]"
            :filter-method="filterOnlineState"
            :filter-multiple="false"
            filter-placement="bottom-start">
            <template slot-scope="scope">
              <span v-if='scope.row.orgType === "1" || scope.row.orgType === "5"'>--</span><!--分公司在线状态及门店IP显示为— — -->
              <el-tag v-else-if='scope.row.storeState === "z"' type="success">在线</el-tag>
              <el-tag v-else-if='scope.row.storeState === "x"' type="danger">离线</el-tag>
            </template>
          </el-table-column>

          <el-table-column min-width="90px" width="110px" prop="ipAddress" label="门店IP">
            <template slot-scope="scope">
              <span v-if='scope.row.orgType === "1" || scope.row.orgType === "5"'>--</span><!--分公司在线状态及门店IP显示为— — -->
              <span v-else>{{scope.row.ipAddress}}</span>
            </template>
          </el-table-column>

          <!-- 列表中只显示分公司1(5)、配送中心2和门店3，不显示集团0、品牌4和物流部6 -->
          <el-table-column
            min-width="90px"
            label="机构类型"
            prop='tag'
            column-key='orgTypeFilter'
            :filters="[{ text: '分公司', value: '1' }, { text: '配送中心', value: '2' }, { text: '门店', value: '3' }, { text: '物流分公司', value: '5' } ]"
            :filter-method="filterOrgType"
            :filter-multiple="false"
            filter-placement="bottom-start">
            <template slot-scope="scope">
              <span v-if='scope.row.orgType === "1"'>分公司</span>
              <span v-else-if='scope.row.orgType === "2"'>配送中心</span>
              <span v-else-if='scope.row.orgType === "3"'>门店</span>
              <span v-else-if='scope.row.orgType === "5"'>物流分公司</span>
            </template>
          </el-table-column>

          <el-table-column min-width="90px" label="创建时间" sortable="custom" prop="creat_time"><!--sortable sort-by='creatTime'-->
            <template slot-scope="scope">
              <div v-if="scope.row.creatTime">{{scope.row.creatTime | dateFilter('2', 'YYYY-MM-DD')}}</div>
              <div v-if="scope.row.creatTime">{{scope.row.creatTime | dateFilter('2', 'HH:mm:ss')}}</div>
            </template>
          </el-table-column>

          <el-table-column min-width="90px" label="所含操作员">
            <template slot-scope="scope">
              <!-- <el-popover trigger="hover" placement="top" v-if="scope.row.employeeCount > 0">
                <div>点击查看人员列表</div>
                <div slot="reference">
                  <a href="#" @click.prevent="handleOrgOperatorList(scope.row)">{{scope.row.employeeCount}}人</a>
                </div>
              </el-popover> -->
              <el-tooltip placement="top" effect="light" popper-class="common-popper" :enterable='false' v-if="scope.row.employeeCount > 0">
                <div slot="content">点击查看人员列表</div>
                <a href="#" @click.prevent="handleOrgOperatorList(scope.row)">{{scope.row.employeeCount}}人</a>
              </el-tooltip>
              <p v-else>0人</p>
            </template>
          </el-table-column>

          <el-table-column min-width="90px" prop="registerKey" label="门店注册码" show-overflow-tooltip></el-table-column>

          <el-table-column min-width="90px" fixed="right" label="操作" width="135" align='center' class-name="opt"
            v-if="auth['moduleAuth_update'] || auth['moduleAuth_stopOrstart'] || auth['moduleAuth_del'] || auth['moduleAuth_csh'] || auth['moduleAuth_tszl'] || auth['moduleAuth_jcjcsj']"
            >
            <template slot-scope="scope">
              <el-button v-if="auth['moduleAuth_update']" type="text" size="small" @click="edit(scope.row)">编辑</el-button>

              <el-button v-if="auth['moduleAuth_stopOrstart'] && scope.row.validState === '1'" type="text" size="small" @click="setValidState(scope.row, '0')">停用</el-button>
              <el-button v-else-if="auth['moduleAuth_stopOrstart'] && scope.row.validState === '0'" type="text" size="small" @click="setValidState(scope.row, '1')">启用</el-button>

              <!-- 分公司 -->
              <el-button v-if="auth['moduleAuth_del'] && scope.row.orgType === '1' && scope.row.validState === '0'" type="text" size="small" @click="deleteCommand(scope.row)">删除</el-button>
              <!-- 物流分公司 -->
              <el-button v-if="auth['moduleAuth_del'] && scope.row.orgType === '5' && scope.row.validState === '0'" type="text" size="small" @click="deleteCommand(scope.row)">删除</el-button>
              <!-- 配送中心 -->
              <el-button v-else-if="auth['moduleAuth_del'] && scope.row.orgType === '2' && scope.row.validState === '0'" type="text" size="small" @click="deleteCommand(scope.row)">删除</el-button>

              <!-- 门店 -->
              <el-dropdown size="small"  v-else-if="(auth['moduleAuth_csh'] || auth['moduleAuth_tszl'] || auth['moduleAuth_jcjcsj'] || auth['moduleAuth_del']) && scope.row.orgType === '3'">
                <el-button type="text" size="small">
                  更多<i class="el-icon-arrow-down el-icon--right"></i>
                </el-button>
                <el-dropdown-menu slot="dropdown" >
                  <el-dropdown-item v-if="auth['moduleAuth_csh']"><span @click="initStoreCommand(scope.row)">初始化</span></el-dropdown-item>
                  <el-dropdown-item v-if="auth['moduleAuth_tszl']"><span @click="specialInstructionCommand(scope.row)">特殊指令</span></el-dropdown-item>
                  <el-dropdown-item v-if="auth['moduleAuth_jcjcsj']"><span @click="detectBasicDataCommand(scope.row)">检测基础数据</span></el-dropdown-item>
                  <el-dropdown-item v-if="auth['moduleAuth_del'] && scope.row.validState === '0'"><span @click="deleteCommand(scope.row)">删除</span></el-dropdown-item>
                </el-dropdown-menu>
              </el-dropdown>
            </template>
          </el-table-column>
        </el-table>

        <div class="pagination tzx-pagination-container">
          <el-pagination
            background
            prev-text='上一页'
            next-text='下一页'
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :current-page.sync="page"
            :page-sizes="total > 30 ? [10, 20, 30] : total > 20 ? [10, 20] : [10]"
            :page-size="pageSize"
            layout="prev, pager, next, total,  jumper, sizes"
            :total="total">
          </el-pagination>
        </div>
      </div>

    </div>

    <!-- 新增分公司 -->
    <!-- 添加的时候organiza是null -->
    <!-- orgType表示添加的是什么类型 -->
    <!-- topOrg 表示选择的上级机构是什么 -->
    <editCompany v-if='showEditCompany' :orgType="orgType" :organiza='organiza' :topOrg='selectedOrg' :showEditCompany="showEditCompany" v-on:close='closeEditCompany'></editCompany>

    <!-- 新增配送中心 -->
    <editDistribution v-if='showEditDistribution' :orgType="orgType" :organiza='organiza' :topOrg='selectedOrg' :showEditDistribution="showEditDistribution" v-on:close='closeEditDistribution'></editDistribution>

    <!-- 分公司详情 -->
    <companyDetails v-if="showCompanyDetails" :organiza='organiza' :showCompanyDetails="showCompanyDetails" v-on:close="closeCompanyDetails"></companyDetails>
    <!-- 配送中心详情 -->
    <distributionDetails v-if="showDistributionDetails" :organiza='organiza' :showDistributionDetails="showDistributionDetails" v-on:close="closeDistributionDetails"></distributionDetails>
    <!-- 操作员列表 -->
    <operatorList v-if="showOperatorList" :organiza='organiza' :showOperatorList="showOperatorList" v-on:close="closeOperatorList"></operatorList>

    <!-- 新增品牌 -->
    <editBrand v-if='showEditBrand' :orgType="orgType" :organiza='organiza' :topOrg='selectedOrg' :showEditBrand="showEditBrand" v-on:close='closeEditBrand'></editBrand>
    <!-- 初始化门店 -->
    <initStore v-if='showInitStore' :organiza='organiza' :showInitStore="showInitStore" v-on:close='closeInitStore'></initStore>
    <!-- 特殊指令 -->
    <specialInstruction v-if='showSpecialInstruction' :organiza='organiza' :showSpecialInstruction="showSpecialInstruction" v-on:close='closeSpecialInstruction'></specialInstruction>

  </div>
</template>
<script>
  // import '../../../assets/icomoon/style.css'
  import '../../../assets/less/tzx-table-pagination.css'
  import EventBus from '../../../utils/EventBus.js'
  import editCompany from './children/company/editCompany.vue'
  import editDistribution from './children/distribution/editDistribution.vue'
  import companyDetails from './children/company/companyDetails.vue'
  import distributionDetails from './children/distribution/distributionDetails.vue'
  import initStore from './children/store/initStore.vue'
  import specialInstruction from './children/store/specialInstruction.vue'
  import editBrand from './children/brand/editBrand.vue'
  import operatorList from './children/operatorList/operatorList.vue'
  //
  function myClient () {
    return {
      clientW: window.innerWidth || document.body.clientWidth || document.documentElement.clientWidth,
      clientH: window.innerHeight || document.body.clientHeight || document.documentElement.clientHeight
    }
  }
  export default {
    created () {
      // 获取权限
      this.getAuth()
      if (!this.auth) return
      /*
      // 获取机构列表
      let resultX = {
        code: '0',
        msg: '操作成功！',
        data: {
          page: 1,
          total: 557,
          rows: [
            {
              registerKey: '78273839192839282934',
              fatherName: '海底捞(西北地)',
              fatherOrganCode: '226',
              fatherLevel: 1,
              creatTime: '2017-12-23 18:37:23',
              tenancyId: 0,
              id: 374,
              orgFullName: '海底捞(西北地)二二二二二二二二二二二二二二二二二二二二二二二二二二二二二二二二二二二二二二二二二二二二二二二二二二二二二二二二二二二二二',
              orgShortName: '海底捞(西北地区)',
              orgType: '3',
              topOrgId: 23,
              phone: '38112223',
              fax: null,
              email: 'hdl@qq.com',
              website: 'www.hdl.com',
              longitude: 23.556,
              avgprice: 265,
              labelValue: '好吃,不贵,牛,火,不得了中中中,哈哈哈哈哈哈哈哈哈',
              address: '望京大厦青春38号',
              postCode: null,
              bussinessArea: 34,
              setupDate: '2018-01-05',
              bookFoodPhone: '400-1234567',
              complainPhone: '400-8888-444',
              chargePerson: null,
              contractCloseDate: '2028-01-05',
              orgCreatePerson: null,
              organCode: '226',
              tenantState: null,
              orgUuid: null,
              districtName: null,
              storeType: null,
              fatherStore: 551,
              brand: null,
              priceSystem: null,
              storeManagerNo: null,
              storeManagerName: '丽丽',
              alipayId: null,
              alipsy: null,
              wechat: 'WX0077',
              operatingStatus: 'normal_business',
              airCindition: null,
              isWebbook: null,
              isPhonebook: null,
              isDelivery: '1',
              is24time: '1',
              isInterface: null,
              financialSystemCode: null,
              cuisine: '活力套餐1,热血套餐2',
              busRoute: '15号公交线路',
              remark: '我是备注注我是备注注我是备注注我是备注注我是备注注我是备注注我是备注注我是备注注我是备注注我是备注注我是备注注我是备注注我是备注注我是备注注我是备注注我是备注注我是备注注我是备注注我是备注注我是备注注',
              summary: '<h1>我是标题</h1><strong>哈哈哈</strong>',
              image1: 'http://fastdfs.meishijia.com/group1/M00/06/49/wKgoD1pMRhCAeyWiAAAH_JRI7co204.jpg',
              image2: 'http://fastdfs.meishijia.com/group1/M00/06/49/wKgoD1pMRhWAI56eAAAH_JRI7co088.jpg,http://fastdfs.meishijia.com/group1/M00/06/49/wKgoD1pMRhmAeZGbAAAZ2SHJmcM481.jpg,http://fastdfs.meishijia.com/group1/M00/06/49/wKgoD1pMRiCAOjojAAKYYKbP_Mc153.png',
              validState: '1',
              lastUpdatetime: null,
              lastOperator: null,
              thirdCode: 'QC12345678',
              wechatRegion: null,
              latitude: '163.837',
              level: null,
              regionalism: null,
              qrCodes: null,
              isWechatydzw: '1',
              isWechatdddc: '1',
              isWechatwmzt: '1',
              isWechatpddh: null,
              closeDate: null,
              organBriefCode: null,
              lineUpTime1: null,
              lineUpTime2: null,
              lineUpTime3: null,
              legalPer: null,
              manageType: 3,
              storelevel: 1,
              arealevel: 1,
              formatState: '1',
              poiId: null,
              image3: 'http://fastdfs.meishijia.com/group1/M00/06/49/wKgoD1pMRiWAEnSOAABw02UHRcs804.jpg',
              taxpayerTypeCode: null,
              thirdOrganCode: null,
              busyStarttime: null,
              busyEndtime: null,
              busyEndOffset: null,
              daycountType: null,
              deleteState: null,
              cuisineCode: null,
              registeKey: null,
              logoimage: null,
              ccBillState: null,
              roomTimes: null,
              businessHours: null,
              topOrgName: null,
              formatStateName: '正餐',
              storeTypeName: '子店',
              areaLevelName: '一级城市',
              manageTypeName: '合作',
              storeLevelName: null,
              legalPerName: '李志强',
              priceSystemName: '3333333',
              fatherStoreName: '122224测试专用',
              regionName: '北京市朝阳区望京东',
              pagination: null,
              orgTypeName: '门店',
              operatingStatusName: '正常营业',
              employeeCount: 2,
              storeState: 'x',
              fahterId: 1,
              ipAddress: '255.255.255.255',
              date1: null,
              date2: null
            },
            {
              fatherName: '海底捞(西北地)2',
              fatherOrganCode: '2261',
              fatherLevel: 1,
              tenancyId: null,
              id: 393,
              orgFullName: '海底捞(华中地区)',
              orgShortName: '海底捞(华中地区)',
              orgType: '3',
              topOrgId: null,
              phone: null,
              fax: null,
              email: null,
              website: null,
              longitude: null,
              avgprice: null,
              labelValue: null,
              address: null,
              postCode: null,
              bussinessArea: null,
              setupDate: null,
              bookFoodPhone: null,
              complainPhone: null,
              chargePerson: null,
              contractCloseDate: null,
              orgCreatePerson: null,
              organCode: '238',
              tenantState: null,
              orgUuid: null,
              districtName: null,
              storeType: null,
              fatherStore: null,
              brand: null,
              priceSystem: null,
              storeManagerNo: null,
              storeManagerName: null,
              alipayId: null,
              alipsy: null,
              wechat: null,
              operatingStatus: 'suspension_business',
              airCindition: null,
              isWebbook: null,
              isPhonebook: null,
              isDelivery: null,
              is24time: null,
              isInterface: null,
              financialSystemCode: null,
              cuisine: null,
              busRoute: null,
              remark: null,
              summary: '<h1>标题1</h1><strong>哈哈哈</strong>',
              image1: null,
              image2: null,
              validState: '0',
              lastUpdatetime: null,
              lastOperator: null,
              thirdCode: null,
              wechatRegion: null,
              latitude: null,
              level: null,
              regionalism: null,
              qrCodes: null,
              isWechatydzw: '1',
              isWechatdddc: '1',
              isWechatwmzt: '1',
              isWechatpddh: '1',
              closeDate: null,
              organBriefCode: null,
              lineUpTime1: null,
              lineUpTime2: null,
              lineUpTime3: null,
              legalPer: null,
              manageType: null,
              storelevel: null,
              arealevel: null,
              formatState: '1',
              poiId: null,
              image3: null,
              taxpayerTypeCode: null,
              thirdOrganCode: null,
              busyStarttime: null,
              busyEndtime: null,
              busyEndOffset: null,
              daycountType: null,
              deleteState: null,
              cuisineCode: null,
              registeKey: null,
              logoimage: null,
              ccBillState: null,
              roomTimes: null,
              businessHours: null,
              topOrgName: null,
              formatStateName: '正餐',
              storeTypeName: null,
              areaLevelName: null,
              manageTypeName: null,
              storeLevelName: null,
              legalPerName: null,
              priceSystemName: null,
              fatherStoreName: null,
              regionName: null,
              pagination: null,
              orgTypeName: '门店',
              operatingStatusName: '暂停营业',
              employeeCount: 32,
              storeState: 'y',
              fahterId: 2,
              ipAddress: '103.137.140.116',
              date1: null,
              date2: null
            },
            {
              fatherName: '海底捞(西北地)3',
              fatherOrganCode: '2263',
              fatherLevel: 1,
              tenancyId: null,
              id: 423,
              orgFullName: '海底捞(华南地区)',
              orgShortName: '海底捞(华南地区)',
              orgType: '3',
              topOrgId: null,
              phone: null,
              fax: null,
              email: null,
              website: null,
              longitude: 116.474081,
              avgprice: null,
              labelValue: null,
              address: null,
              postCode: null,
              bussinessArea: null,
              setupDate: null,
              bookFoodPhone: null,
              complainPhone: null,
              chargePerson: null,
              contractCloseDate: null,
              orgCreatePerson: null,
              organCode: '263',
              tenantState: null,
              orgUuid: null,
              districtName: null,
              storeType: null,
              fatherStore: null,
              brand: null,
              priceSystem: null,
              storeManagerNo: null,
              storeManagerName: null,
              alipayId: null,
              alipsy: null,
              wechat: 'WX12345678',
              operatingStatus: 'closed',
              airCindition: null,
              isWebbook: null,
              isPhonebook: null,
              isDelivery: null,
              is24time: null,
              isInterface: null,
              financialSystemCode: null,
              cuisine: null,
              busRoute: null,
              remark: null,
              summary: null,
              image1: null,
              image2: null,
              validState: '0',
              lastUpdatetime: null,
              lastOperator: null,
              thirdCode: 'QC12345678',
              wechatRegion: null,
              latitude: 40.000724,
              level: null,
              regionalism: null,
              qrCodes: null,
              isWechatydzw: null,
              isWechatdddc: null,
              isWechatwmzt: null,
              isWechatpddh: null,
              closeDate: null,
              organBriefCode: null,
              lineUpTime1: null,
              lineUpTime2: null,
              lineUpTime3: null,
              legalPer: null,
              manageType: null,
              storelevel: null,
              arealevel: null,
              formatState: '1',
              poiId: null,
              image3: null,
              taxpayerTypeCode: null,
              thirdOrganCode: null,
              busyStarttime: null,
              busyEndtime: null,
              busyEndOffset: null,
              daycountType: null,
              deleteState: null,
              cuisineCode: null,
              registeKey: null,
              logoimage: null,
              ccBillState: null,
              roomTimes: null,
              businessHours: null,
              topOrgName: null,
              formatStateName: '正餐',
              storeTypeName: null,
              areaLevelName: null,
              manageTypeName: null,
              storeLevelName: null,
              legalPerName: null,
              priceSystemName: null,
              fatherStoreName: null,
              regionName: null,
              pagination: null,
              orgTypeName: '门店',
              operatingStatusName: '关店',
              employeeCount: 1,
              storeState: null,
              fahterId: 3,
              ipAddress: '103.37.110.11',
              date1: null,
              date2: null
            },
            {
              fatherName: '海底捞(西北地)4',
              fatherOrganCode: '2264',
              fatherLevel: 1,
              creatTime: '2017-12-24 10:08:00',
              tenancyId: null,
              id: 422,
              orgFullName: '海底捞(华东地区)',
              orgShortName: '海底捞(华东地区)',
              orgType: '3',
              topOrgId: null,
              phone: null,
              fax: null,
              email: null,
              website: null,
              longitude: null,
              avgprice: null,
              labelValue: null,
              address: null,
              postCode: null,
              bussinessArea: null,
              setupDate: null,
              bookFoodPhone: null,
              complainPhone: null,
              chargePerson: null,
              contractCloseDate: null,
              orgCreatePerson: null,
              organCode: '262',
              tenantState: null,
              orgUuid: null,
              districtName: null,
              storeType: null,
              fatherStore: null,
              brand: null,
              priceSystem: null,
              storeManagerNo: null,
              storeManagerName: null,
              alipayId: null,
              alipsy: null,
              wechat: null,
              operatingStatus: 'normal_business',
              airCindition: null,
              isWebbook: null,
              isPhonebook: null,
              isDelivery: null,
              is24time: null,
              isInterface: null,
              financialSystemCode: null,
              cuisine: null,
              busRoute: null,
              remark: null,
              summary: null,
              image1: null,
              image2: null,
              validState: '0',
              lastUpdatetime: null,
              lastOperator: null,
              thirdCode: null,
              wechatRegion: null,
              latitude: null,
              level: null,
              regionalism: null,
              qrCodes: null,
              isWechatydzw: null,
              isWechatdddc: null,
              isWechatwmzt: null,
              isWechatpddh: null,
              closeDate: null,
              organBriefCode: null,
              lineUpTime1: null,
              lineUpTime2: null,
              lineUpTime3: null,
              legalPer: null,
              manageType: null,
              storelevel: null,
              arealevel: null,
              formatState: '1',
              poiId: null,
              image3: null,
              taxpayerTypeCode: null,
              thirdOrganCode: null,
              busyStarttime: null,
              busyEndtime: null,
              busyEndOffset: null,
              daycountType: null,
              deleteState: null,
              cuisineCode: null,
              registeKey: null,
              logoimage: null,
              ccBillState: null,
              roomTimes: null,
              businessHours: null,
              topOrgName: null,
              formatStateName: '正餐',
              storeTypeName: null,
              areaLevelName: null,
              manageTypeName: null,
              storeLevelName: null,
              legalPerName: null,
              priceSystemName: null,
              fatherStoreName: null,
              regionName: null,
              pagination: null,
              orgTypeName: '门店',
              operatingStatusName: '正常营业',
              employeeCount: 1,
              storeState: 'y',
              fahterId: 4,
              ipAddress: null,
              date1: null,
              date2: null
            },
            {
              fatherName: '海底捞(西北地)5',
              fatherOrganCode: '2265',
              fatherLevel: 1,
              tenancyId: null,
              id: 428,
              orgFullName: '海底捞(华北地区)配送中心',
              orgShortName: '海底捞(华北地区)',
              orgType: '2',
              topOrgId: null,
              phone: null,
              fax: null,
              email: null,
              website: null,
              longitude: null,
              avgprice: null,
              labelValue: null,
              address: null,
              postCode: null,
              bussinessArea: null,
              setupDate: null,
              bookFoodPhone: null,
              complainPhone: null,
              chargePerson: null,
              contractCloseDate: null,
              orgCreatePerson: null,
              organCode: '265',
              tenantState: null,
              orgUuid: null,
              districtName: null,
              storeType: null,
              fatherStore: null,
              brand: null,
              priceSystem: null,
              storeManagerNo: null,
              storeManagerName: null,
              alipayId: null,
              alipsy: null,
              wechat: null,
              operatingStatus: 'normal_business',
              airCindition: null,
              isWebbook: null,
              isPhonebook: null,
              isDelivery: null,
              is24time: null,
              isInterface: null,
              financialSystemCode: null,
              cuisine: null,
              busRoute: null,
              remark: null,
              summary: null,
              image1: null,
              image2: null,
              validState: '0',
              lastUpdatetime: null,
              lastOperator: null,
              thirdCode: null,
              wechatRegion: null,
              latitude: null,
              level: null,
              regionalism: null,
              qrCodes: null,
              isWechatydzw: null,
              isWechatdddc: null,
              isWechatwmzt: null,
              isWechatpddh: null,
              closeDate: null,
              organBriefCode: null,
              lineUpTime1: null,
              lineUpTime2: null,
              lineUpTime3: null,
              legalPer: null,
              manageType: null,
              storelevel: null,
              arealevel: null,
              formatState: '1',
              poiId: null,
              image3: null,
              taxpayerTypeCode: null,
              thirdOrganCode: null,
              busyStarttime: null,
              busyEndtime: null,
              busyEndOffset: null,
              daycountType: null,
              deleteState: null,
              cuisineCode: null,
              registeKey: null,
              logoimage: null,
              ccBillState: null,
              roomTimes: null,
              businessHours: null,
              topOrgName: null,
              formatStateName: '正餐',
              storeTypeName: null,
              areaLevelName: null,
              manageTypeName: null,
              storeLevelName: null,
              legalPerName: null,
              priceSystemName: null,
              fatherStoreName: null,
              regionName: null,
              pagination: null,
              orgTypeName: '配送中心',
              operatingStatusName: '正常营业',
              employeeCount: 2,
              storeState: 'x',
              fahterId: 5,
              ipAddress: '10.12.0.121',
              date1: null,
              date2: null
            },
            {
              fatherName: '海底捞(西北地)6',
              fatherOrganCode: '2266',
              fatherLevel: 1,
              tenancyId: null,
              id: 424,
              orgFullName: '海底捞(东北地区)配送中心',
              orgShortName: '海底捞(东北地区)',
              orgType: '2',
              topOrgId: null,
              phone: null,
              fax: null,
              email: null,
              website: null,
              longitude: null,
              avgprice: null,
              labelValue: null,
              address: null,
              postCode: null,
              bussinessArea: null,
              setupDate: null,
              bookFoodPhone: null,
              complainPhone: null,
              chargePerson: null,
              contractCloseDate: null,
              orgCreatePerson: null,
              organCode: '264',
              tenantState: null,
              orgUuid: null,
              districtName: null,
              storeType: null,
              fatherStore: null,
              brand: null,
              priceSystem: null,
              storeManagerNo: null,
              storeManagerName: null,
              alipayId: null,
              alipsy: null,
              wechat: null,
              operatingStatus: 'normal_business',
              airCindition: null,
              isWebbook: null,
              isPhonebook: null,
              isDelivery: null,
              is24time: null,
              isInterface: null,
              financialSystemCode: null,
              cuisine: null,
              busRoute: null,
              remark: null,
              summary: null,
              image1: null,
              image2: null,
              validState: '1',
              lastUpdatetime: null,
              lastOperator: null,
              thirdCode: null,
              wechatRegion: null,
              latitude: null,
              level: null,
              regionalism: null,
              qrCodes: null,
              isWechatydzw: null,
              isWechatdddc: null,
              isWechatwmzt: null,
              isWechatpddh: null,
              closeDate: null,
              organBriefCode: null,
              lineUpTime1: null,
              lineUpTime2: null,
              lineUpTime3: null,
              legalPer: null,
              manageType: null,
              storelevel: null,
              arealevel: null,
              formatState: '1',
              poiId: null,
              image3: null,
              taxpayerTypeCode: null,
              thirdOrganCode: null,
              busyStarttime: null,
              busyEndtime: null,
              busyEndOffset: null,
              daycountType: null,
              deleteState: null,
              cuisineCode: null,
              registeKey: null,
              logoimage: null,
              ccBillState: null,
              roomTimes: null,
              businessHours: null,
              topOrgName: null,
              formatStateName: '正餐',
              storeTypeName: null,
              areaLevelName: null,
              manageTypeName: null,
              storeLevelName: null,
              legalPerName: null,
              priceSystemName: null,
              fatherStoreName: null,
              regionName: null,
              pagination: null,
              orgTypeName: '配送中心',
              operatingStatusName: '正常营业',
              employeeCount: 1,
              storeState: 'x',
              fahterId: 6,
              ipAddress: null,
              date1: null,
              date2: null
            },
            {
              fatherName: '海底捞(西北地)7',
              fatherOrganCode: '2267',
              fatherLevel: 1,
              tenancyId: null,
              id: 468,
              orgFullName: '77',
              orgShortName: '77',
              orgType: '1',
              topOrgId: null,
              phone: null,
              fax: null,
              email: null,
              website: null,
              longitude: null,
              avgprice: null,
              labelValue: null,
              address: null,
              postCode: null,
              bussinessArea: null,
              setupDate: null,
              bookFoodPhone: null,
              complainPhone: null,
              chargePerson: null,
              contractCloseDate: null,
              orgCreatePerson: null,
              organCode: '285',
              tenantState: null,
              orgUuid: null,
              districtName: null,
              storeType: null,
              fatherStore: null,
              brand: null,
              priceSystem: null,
              storeManagerNo: null,
              storeManagerName: null,
              alipayId: null,
              alipsy: null,
              wechat: null,
              operatingStatus: 'normal_business',
              airCindition: null,
              isWebbook: null,
              isPhonebook: null,
              isDelivery: null,
              is24time: null,
              isInterface: null,
              financialSystemCode: null,
              cuisine: null,
              busRoute: null,
              remark: null,
              summary: null,
              image1: null,
              image2: null,
              validState: '1',
              lastUpdatetime: null,
              lastOperator: null,
              thirdCode: null,
              wechatRegion: null,
              latitude: null,
              level: null,
              regionalism: null,
              qrCodes: null,
              isWechatydzw: null,
              isWechatdddc: null,
              isWechatwmzt: null,
              isWechatpddh: null,
              closeDate: null,
              organBriefCode: null,
              lineUpTime1: null,
              lineUpTime2: null,
              lineUpTime3: null,
              legalPer: null,
              manageType: null,
              storelevel: null,
              arealevel: null,
              formatState: '1',
              poiId: null,
              image3: null,
              taxpayerTypeCode: null,
              thirdOrganCode: null,
              busyStarttime: null,
              busyEndtime: null,
              busyEndOffset: null,
              daycountType: null,
              deleteState: null,
              cuisineCode: null,
              registeKey: null,
              logoimage: null,
              ccBillState: null,
              roomTimes: null,
              businessHours: null,
              topOrgName: null,
              formatStateName: '正餐',
              storeTypeName: null,
              areaLevelName: null,
              manageTypeName: null,
              storeLevelName: null,
              legalPerName: null,
              priceSystemName: null,
              fatherStoreName: null,
              regionName: null,
              pagination: null,
              orgTypeName: '分公司',
              operatingStatusName: '正常营业',
              employeeCount: null,
              storeState: null,
              fahterId: 7,
              ipAddress: null,
              date1: null,
              date2: null
            },
            {
              fatherName: '海底捞(西北地)8',
              fatherOrganCode: '2268',
              fatherLevel: 1,
              tenancyId: null,
              id: 370,
              orgFullName: '5456446545464564',
              orgShortName: 'asd',
              orgType: '1',
              topOrgId: null,
              phone: null,
              fax: null,
              email: null,
              website: null,
              longitude: null,
              avgprice: null,
              labelValue: null,
              address: null,
              postCode: null,
              bussinessArea: null,
              setupDate: null,
              bookFoodPhone: null,
              complainPhone: null,
              chargePerson: null,
              contractCloseDate: null,
              orgCreatePerson: null,
              organCode: '223',
              tenantState: null,
              orgUuid: null,
              districtName: null,
              storeType: null,
              fatherStore: null,
              brand: null,
              priceSystem: null,
              storeManagerNo: null,
              storeManagerName: null,
              alipayId: null,
              alipsy: null,
              wechat: null,
              operatingStatus: 'normal_business',
              airCindition: null,
              isWebbook: null,
              isPhonebook: null,
              isDelivery: null,
              is24time: null,
              isInterface: null,
              financialSystemCode: null,
              cuisine: null,
              busRoute: null,
              remark: null,
              summary: null,
              image1: null,
              image2: null,
              validState: '0',
              lastUpdatetime: null,
              lastOperator: null,
              thirdCode: null,
              wechatRegion: null,
              latitude: null,
              level: null,
              regionalism: null,
              qrCodes: null,
              isWechatydzw: null,
              isWechatdddc: null,
              isWechatwmzt: null,
              isWechatpddh: null,
              closeDate: null,
              organBriefCode: null,
              lineUpTime1: null,
              lineUpTime2: null,
              lineUpTime3: null,
              legalPer: null,
              manageType: null,
              storelevel: null,
              arealevel: null,
              formatState: '2',
              poiId: null,
              image3: null,
              taxpayerTypeCode: null,
              thirdOrganCode: null,
              busyStarttime: null,
              busyEndtime: null,
              busyEndOffset: null,
              daycountType: null,
              deleteState: null,
              cuisineCode: null,
              registeKey: null,
              logoimage: null,
              ccBillState: null,
              roomTimes: null,
              businessHours: null,
              topOrgName: null,
              formatStateName: '快餐',
              storeTypeName: null,
              areaLevelName: null,
              manageTypeName: null,
              storeLevelName: null,
              legalPerName: null,
              priceSystemName: null,
              fatherStoreName: null,
              regionName: null,
              pagination: null,
              orgTypeName: '分公司',
              operatingStatusName: '正常营业',
              employeeCount: 2,
              storeState: 'x',
              fahterId: 8,
              ipAddress: '192.168.40.55',
              date1: null,
              date2: null
            },
            {
              fatherName: '海底捞(西北地)9',
              fatherOrganCode: '2269',
              fatherLevel: 1,
              tenancyId: null,
              id: 464,
              orgFullName: '1哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈',
              orgShortName: '哈',
              orgType: '5',
              topOrgId: 474,
              phone: null,
              fax: null,
              email: null,
              website: null,
              longitude: null,
              avgprice: null,
              labelValue: null,
              address: null,
              postCode: null,
              bussinessArea: null,
              setupDate: null,
              bookFoodPhone: null,
              complainPhone: null,
              chargePerson: null,
              contractCloseDate: null,
              orgCreatePerson: null,
              organCode: '281',
              tenantState: null,
              orgUuid: null,
              districtName: null,
              storeType: null,
              fatherStore: null,
              brand: null,
              priceSystem: null,
              storeManagerNo: null,
              storeManagerName: null,
              alipayId: null,
              alipsy: null,
              wechat: null,
              operatingStatus: 'normal_business',
              airCindition: null,
              isWebbook: null,
              isPhonebook: null,
              isDelivery: null,
              is24time: null,
              isInterface: null,
              financialSystemCode: null,
              cuisine: null,
              busRoute: null,
              remark: '我是北周官我是北周官我是北周官我是北周官我是北周官我是北周官我是北周官我是北周官我是北周官我是北周官我是北周官我是北周官我是北周官我是北周官我是北周官我是北周官我是北周官我是北周官我是北周官我是北周官',
              summary: null,
              image1: null,
              image2: null,
              validState: '1',
              lastUpdatetime: null,
              lastOperator: null,
              thirdCode: null,
              wechatRegion: null,
              latitude: null,
              level: null,
              regionalism: null,
              qrCodes: null,
              isWechatydzw: null,
              isWechatdddc: null,
              isWechatwmzt: null,
              isWechatpddh: null,
              closeDate: null,
              organBriefCode: null,
              lineUpTime1: null,
              lineUpTime2: null,
              lineUpTime3: null,
              legalPer: null,
              manageType: null,
              storelevel: null,
              arealevel: null,
              formatState: '1',
              poiId: null,
              image3: null,
              taxpayerTypeCode: null,
              thirdOrganCode: null,
              busyStarttime: null,
              busyEndtime: null,
              busyEndOffset: null,
              daycountType: null,
              deleteState: null,
              cuisineCode: null,
              registeKey: null,
              logoimage: null,
              ccBillState: null,
              roomTimes: null,
              businessHours: null,
              topOrgName: '天天吃',
              formatStateName: '正餐',
              storeTypeName: null,
              areaLevelName: null,
              manageTypeName: null,
              storeLevelName: null,
              legalPerName: null,
              priceSystemName: null,
              fatherStoreName: null,
              regionName: null,
              pagination: null,
              orgTypeName: '物流分公司',
              operatingStatusName: '正常营业',
              employeeCount: null,
              storeState: null,
              fahterId: 9,
              ipAddress: null,
              date1: null,
              date2: null
            }
          ]
        }
      }
      // 获取机构树
      let resultY = {
        code: '0',
        msg: '操作成功！',
        data: [
          {
            id: 0,
            orgType: '0',
            level: 0,
            organCode: '',
            orgFullName: '总部',
            formatState: null,
            priceSystem: null,
            fatherId: null,
            orgUuid: null,
            tenantState: null,
            text: '总部',
            validState: '1',
            fatherName: null,
            fatherOrganCode: null,
            fatherLeve: null,
            manageType: null,
            storelevel: null,
            arealevel: null,
            total: null,
            count: null,
            children: [
              {
                id: 446,
                orgType: '4',
                level: 1,
                organCode: '998',
                orgFullName: '品牌2',
                formatState: null,
                priceSystem: null,
                fatherId: 0,
                orgUuid: 'hdl_565a308dea274af899ebcb742303792bvv1',
                tenantState: '1',
                text: '998品牌2',
                validState: '1',
                fatherName: '总部',
                fatherOrganCode: '0',
                fatherLeve: 0,
                manageType: null,
                storelevel: null,
                arealevel: null,
                total: null,
                count: null,
                children: [
                  {
                    id: 422,
                    orgType: '1',
                    level: 1,
                    organCode: '262',
                    orgFullName: '海底捞(华东地区)',
                    formatState: null,
                    priceSystem: null,
                    fatherId: 446,
                    orgUuid: 'hdl_mplzaojb1yjsqkqxgtijvifzmd7wbwbx',
                    tenantState: null,
                    text: '262海底捞(华东地区)',
                    validState: '1',
                    fatherName: '品牌2',
                    fatherOrganCode: '998',
                    fatherLeve: 1,
                    manageType: null,
                    storelevel: null,
                    arealevel: null,
                    total: null,
                    count: null,
                    children: [
                      {
                        id: 400,
                        orgType: '3',
                        level: 1,
                        organCode: '245',
                        orgFullName: '福建厦门店',
                        formatState: null,
                        priceSystem: null,
                        fatherId: 422,
                        orgUuid: 'hdl_q6m0qr3bibqeeihnymhx1jxsvxi45xgu',
                        tenantState: '1',
                        text: '245福建厦门店',
                        validState: '1',
                        fatherName: '海底捞(华东地区)',
                        fatherOrganCode: '262',
                        fatherLeve: 1,
                        manageType: null,
                        storelevel: null,
                        arealevel: null,
                        total: null,
                        count: null,
                        children: []
                      },
                      {
                        id: 401,
                        orgType: '3',
                        level: 1,
                        organCode: '246',
                        orgFullName: '安徽合肥店',
                        formatState: null,
                        priceSystem: null,
                        fatherId: 422,
                        orgUuid: 'hdl_9tse2llh6h8jgyn02l0wutgfo54vzx4g',
                        tenantState: null,
                        text: '246安徽合肥店',
                        validState: '1',
                        fatherName: '海底捞(华东地区)',
                        fatherOrganCode: '262',
                        fatherLeve: 1,
                        manageType: null,
                        storelevel: null,
                        arealevel: null,
                        total: null,
                        count: null,
                        children: []
                      },
                      {
                        id: 402,
                        orgType: '3',
                        level: 1,
                        organCode: '247',
                        orgFullName: '浙江杭州店',
                        formatState: null,
                        priceSystem: null,
                        fatherId: 422,
                        orgUuid: 'hdl_k8eu26qdtjcmfjw5w3mosw6x6puu914',
                        tenantState: null,
                        text: '247浙江杭州店',
                        validState: '1',
                        fatherName: '海底捞(华东地区)',
                        fatherOrganCode: '262',
                        fatherLeve: 1,
                        manageType: null,
                        storelevel: null,
                        arealevel: null,
                        total: null,
                        count: null,
                        children: []
                      },
                      {
                        id: 403,
                        orgType: '3',
                        level: 1,
                        organCode: '250',
                        orgFullName: '江苏南京店',
                        formatState: null,
                        priceSystem: null,
                        fatherId: 422,
                        orgUuid: 'hdl_6rtlwzxgrtd5trtz6hr2rqxendaxrhdz',
                        tenantState: null,
                        text: '250江苏南京店',
                        validState: '1',
                        fatherName: '海底捞(华东地区)',
                        fatherOrganCode: '262',
                        fatherLeve: 1,
                        manageType: null,
                        storelevel: null,
                        arealevel: null,
                        total: null,
                        count: null,
                        children: []
                      },
                      {
                        id: 404,
                        orgType: '3',
                        level: 1,
                        organCode: '251',
                        orgFullName: '山东青岛店',
                        formatState: null,
                        priceSystem: null,
                        fatherId: 422,
                        orgUuid: 'hdl_awxj3f34x1cfxwjt6y0q2r8qytz0jnsz',
                        tenantState: '1',
                        text: '251山东青岛店',
                        validState: '1',
                        fatherName: '海底捞(华东地区)',
                        fatherOrganCode: '262',
                        fatherLeve: 1,
                        manageType: null,
                        storelevel: null,
                        arealevel: null,
                        total: null,
                        count: null,
                        children: []
                      },
                      {
                        id: 406,
                        orgType: '3',
                        level: 1,
                        organCode: '252',
                        orgFullName: '山东济南店',
                        formatState: null,
                        priceSystem: null,
                        fatherId: 422,
                        orgUuid: 'hdl_ch7hpers8hfrnuoo41yriqtq8iuzkp7r',
                        tenantState: '1',
                        text: '252山东济南店',
                        validState: '1',
                        fatherName: '海底捞(华东地区)',
                        fatherOrganCode: '262',
                        fatherLeve: 1,
                        manageType: null,
                        storelevel: null,
                        arealevel: null,
                        total: null,
                        count: null,
                        children: []
                      }
                    ]
                  },
                  {
                    id: 423,
                    orgType: '1',
                    level: 1,
                    organCode: '263',
                    orgFullName: '海底捞(华南地区)',
                    formatState: null,
                    priceSystem: null,
                    fatherId: 446,
                    orgUuid: 'hdl_20a03323808a4c76b64e6ceb6d56daeb',
                    tenantState: null,
                    text: '263海底捞(华南地区)',
                    validState: '1',
                    fatherName: '品牌2',
                    fatherOrganCode: '998',
                    fatherLeve: 1,
                    manageType: null,
                    storelevel: null,
                    arealevel: null,
                    total: null,
                    count: null,
                    children: [
                      {
                        id: 394,
                        orgType: '3',
                        level: 1,
                        organCode: '239',
                        orgFullName: '云南香格里拉店',
                        formatState: null,
                        priceSystem: null,
                        fatherId: 423,
                        orgUuid: 'hdl_dat8ghm07u6kqnlow2bc7qbhozanp1dj',
                        tenantState: '1',
                        text: '239云南香格里拉店',
                        validState: '1',
                        fatherName: '海底捞(华南地区)',
                        fatherOrganCode: '263',
                        fatherLeve: 1,
                        manageType: null,
                        storelevel: null,
                        arealevel: null,
                        total: null,
                        count: null,
                        children: []
                      },
                      {
                        id: 395,
                        orgType: '3',
                        level: 1,
                        organCode: '240',
                        orgFullName: '云南大理店',
                        formatState: null,
                        priceSystem: null,
                        fatherId: 423,
                        orgUuid: 'hdl_dhjtmcpnyanw0qhgxnnxm861szabyijg',
                        tenantState: '1',
                        text: '240云南大理店',
                        validState: '1',
                        fatherName: '海底捞(华南地区)',
                        fatherOrganCode: '263',
                        fatherLeve: 1,
                        manageType: null,
                        storelevel: null,
                        arealevel: null,
                        total: null,
                        count: null,
                        children: []
                      },
                      {
                        id: 396,
                        orgType: '3',
                        level: 1,
                        organCode: '241',
                        orgFullName: '云南昆明店',
                        formatState: null,
                        priceSystem: null,
                        fatherId: 423,
                        orgUuid: 'hdl_k1lfr5yosjecupfvt879gjpptl6af2u6',
                        tenantState: '1',
                        text: '241云南昆明店',
                        validState: '1',
                        fatherName: '海底捞(华南地区)',
                        fatherOrganCode: '263',
                        fatherLeve: 1,
                        manageType: null,
                        storelevel: null,
                        arealevel: null,
                        total: null,
                        count: null,
                        children: []
                      },
                      {
                        id: 397,
                        orgType: '3',
                        level: 1,
                        organCode: '242',
                        orgFullName: '广西南宁店',
                        formatState: null,
                        priceSystem: null,
                        fatherId: 423,
                        orgUuid: 'hdl_cvy615cd7i3y2zr3tetk03liaovmfkea',
                        tenantState: '1',
                        text: '242广西南宁店',
                        validState: '1',
                        fatherName: '海底捞(华南地区)',
                        fatherOrganCode: '263',
                        fatherLeve: 1,
                        manageType: null,
                        storelevel: null,
                        arealevel: null,
                        total: null,
                        count: null,
                        children: []
                      },
                      {
                        id: 398,
                        orgType: '3',
                        level: 1,
                        organCode: '243',
                        orgFullName: '广东深圳店',
                        formatState: null,
                        priceSystem: null,
                        fatherId: 423,
                        orgUuid: 'hdl_4a1omjf2pte9uu683c7vo91qb2hv9q0h',
                        tenantState: '1',
                        text: '243广东深圳店',
                        validState: '1',
                        fatherName: '海底捞(华南地区)',
                        fatherOrganCode: '263',
                        fatherLeve: 1,
                        manageType: null,
                        storelevel: null,
                        arealevel: null,
                        total: null,
                        count: null,
                        children: []
                      },
                      {
                        id: 399,
                        orgType: '3',
                        level: 1,
                        organCode: '244',
                        orgFullName: '广东广州店',
                        formatState: null,
                        priceSystem: null,
                        fatherId: 423,
                        orgUuid: 'hdl_7wyqvhebxi2sjncf8hiry2ga8ug09d06',
                        tenantState: '1',
                        text: '244广东广州店',
                        validState: '1',
                        fatherName: '海底捞(华南地区)',
                        fatherOrganCode: '263',
                        fatherLeve: 1,
                        manageType: null,
                        storelevel: null,
                        arealevel: null,
                        total: null,
                        count: null,
                        children: []
                      }
                    ]
                  },
                  {
                    id: 567,
                    orgType: '1',
                    level: 2,
                    organCode: '998010',
                    orgFullName: '天子星分公司',
                    formatState: null,
                    priceSystem: null,
                    fatherId: 446,
                    orgUuid: 'hdl_0e23a9e0886444d3b17f67573472f4c9',
                    tenantState: null,
                    text: '998010天子星分公司',
                    validState: '1',
                    fatherName: '品牌2',
                    fatherOrganCode: '998',
                    fatherLeve: 1,
                    manageType: null,
                    storelevel: null,
                    arealevel: null,
                    total: null,
                    count: null,
                    children: []
                  },
                  {
                    id: 551,
                    orgType: '3',
                    level: 3,
                    organCode: null,
                    orgFullName: '1224测试门店',
                    formatState: null,
                    priceSystem: null,
                    fatherId: 446,
                    orgUuid: 'hdl_40a5c96c086c41cbba41d2a1b8f9dfsd',
                    tenantState: '0',
                    text: '1224测试门店',
                    validState: '1',
                    fatherName: '品牌2',
                    fatherOrganCode: '998',
                    fatherLeve: 1,
                    manageType: null,
                    storelevel: null,
                    arealevel: null,
                    total: null,
                    count: null,
                    children: []
                  },
                  {
                    id: 550,
                    orgType: '3',
                    level: 3,
                    organCode: null,
                    orgFullName: '1223测试门店',
                    formatState: null,
                    priceSystem: null,
                    fatherId: 446,
                    orgUuid: 'hdl_40a5c96c086c41cbba41d2a1b8f9dfsd',
                    tenantState: '0',
                    text: '1223测试门店',
                    validState: '1',
                    fatherName: '品牌2',
                    fatherOrganCode: '998',
                    fatherLeve: 1,
                    manageType: null,
                    storelevel: null,
                    arealevel: null,
                    total: null,
                    count: null,
                    children: []
                  },
                  {
                    id: 549,
                    orgType: '3',
                    level: 3,
                    organCode: null,
                    orgFullName: '1222测试门店',
                    formatState: null,
                    priceSystem: null,
                    fatherId: 446,
                    orgUuid: 'hdl_40a5c96c086c41cbba41d2a1b8f992sd',
                    tenantState: '0',
                    text: '1222测试门店',
                    validState: '1',
                    fatherName: '品牌2',
                    fatherOrganCode: '998',
                    fatherLeve: 1,
                    manageType: null,
                    storelevel: null,
                    arealevel: null,
                    total: null,
                    count: null,
                    children: []
                  }
                ]
              },
              {
                id: 487,
                orgType: '4',
                level: 1,
                organCode: null,
                orgFullName: '1010101',
                formatState: null,
                priceSystem: null,
                fatherId: 0,
                orgUuid: null,
                tenantState: '0',
                text: '1010101',
                validState: '1',
                fatherName: '总部',
                fatherOrganCode: '0',
                fatherLeve: 0,
                manageType: null,
                storelevel: null,
                arealevel: null,
                total: null,
                count: null,
                children: [
                  {
                    id: 490,
                    orgType: '3',
                    level: 0,
                    organCode: null,
                    orgFullName: '2121212',
                    formatState: null,
                    priceSystem: null,
                    fatherId: 487,
                    orgUuid: null,
                    tenantState: '0',
                    text: '2121212',
                    validState: '1',
                    fatherName: '1010101',
                    fatherOrganCode: null,
                    fatherLeve: 1,
                    manageType: null,
                    storelevel: null,
                    arealevel: null,
                    total: null,
                    count: null,
                    children: []
                  },
                  {
                    id: 538,
                    orgType: '3',
                    level: 2,
                    organCode: null,
                    orgFullName: '今天使用',
                    formatState: null,
                    priceSystem: null,
                    fatherId: 487,
                    orgUuid: null,
                    tenantState: '1',
                    text: '今天使用',
                    validState: '1',
                    fatherName: '1010101',
                    fatherOrganCode: null,
                    fatherLeve: 1,
                    manageType: null,
                    storelevel: null,
                    arealevel: null,
                    total: null,
                    count: null,
                    children: []
                  },
                  {
                    id: 537,
                    orgType: '3',
                    level: 2,
                    organCode: null,
                    orgFullName: '测试使用1218',
                    formatState: null,
                    priceSystem: null,
                    fatherId: 487,
                    orgUuid: null,
                    tenantState: '0',
                    text: '测试使用1218',
                    validState: '1',
                    fatherName: '1010101',
                    fatherOrganCode: null,
                    fatherLeve: 1,
                    manageType: null,
                    storelevel: null,
                    arealevel: null,
                    total: null,
                    count: null,
                    children: []
                  },
                  {
                    id: 489,
                    orgType: '3',
                    level: 0,
                    organCode: null,
                    orgFullName: '0101010',
                    formatState: null,
                    priceSystem: null,
                    fatherId: 487,
                    orgUuid: null,
                    tenantState: '0',
                    text: '0101010',
                    validState: '1',
                    fatherName: '1010101',
                    fatherOrganCode: null,
                    fatherLeve: 1,
                    manageType: null,
                    storelevel: null,
                    arealevel: null,
                    total: null,
                    count: null,
                    children: []
                  }
                ]
              },
              {
                id: 501,
                orgType: '4',
                level: 1,
                organCode: null,
                orgFullName: '1212',
                formatState: null,
                priceSystem: null,
                fatherId: 0,
                orgUuid: 'hdl_9a8e3561072842bebba8b561b9213435',
                tenantState: '0',
                text: '1212',
                validState: '0',
                fatherName: '总部',
                fatherOrganCode: '0',
                fatherLeve: 0,
                manageType: null,
                storelevel: null,
                arealevel: null,
                total: null,
                count: null,
                children: []
              },
              {
                id: 445,
                orgType: '4',
                level: 1,
                organCode: '999',
                orgFullName: '品牌1',
                formatState: null,
                priceSystem: null,
                fatherId: 0,
                orgUuid: 'hdl_565a308dea274af899ebcb742303792bvv',
                tenantState: '1',
                text: '999品牌1',
                validState: '1',
                fatherName: '总部',
                fatherOrganCode: '0',
                fatherLeve: 0,
                manageType: null,
                storelevel: null,
                arealevel: null,
                total: null,
                count: null,
                children: [
                  {
                    id: 424,
                    orgType: '1',
                    level: 1,
                    organCode: '264',
                    orgFullName: '海底捞(东北地区)',
                    formatState: null,
                    priceSystem: null,
                    fatherId: 445,
                    orgUuid: 'hdl_1c9602fbf3284169872a5992f7fd41e1',
                    tenantState: null,
                    text: '264海底捞(东北地区)',
                    validState: '1',
                    fatherName: '品牌1',
                    fatherOrganCode: '999',
                    fatherLeve: 1,
                    manageType: null,
                    storelevel: null,
                    arealevel: null,
                    total: null,
                    count: null,
                    children: [
                      {
                        id: 407,
                        orgType: '3',
                        level: 1,
                        organCode: '253',
                        orgFullName: '辽宁沈阳店',
                        formatState: null,
                        priceSystem: null,
                        fatherId: 424,
                        orgUuid: 'hdl_pb790ggle8i5e9kqrwq94qdsf9jqch3u',
                        tenantState: null,
                        text: '253辽宁沈阳店',
                        validState: '1',
                        fatherName: '海底捞(东北地区)',
                        fatherOrganCode: '264',
                        fatherLeve: 1,
                        manageType: null,
                        storelevel: null,
                        arealevel: null,
                        total: null,
                        count: null,
                        children: []
                      },
                      {
                        id: 408,
                        orgType: '3',
                        level: 1,
                        organCode: '254',
                        orgFullName: '吉林长春店',
                        formatState: null,
                        priceSystem: null,
                        fatherId: 424,
                        orgUuid: 'hdl_6xdbmu7pqjwnd7qbs1qi58wnd2apuar4',
                        tenantState: null,
                        text: '254吉林长春店',
                        validState: '1',
                        fatherName: '海底捞(东北地区)',
                        fatherOrganCode: '264',
                        fatherLeve: 1,
                        manageType: null,
                        storelevel: null,
                        arealevel: null,
                        total: null,
                        count: null,
                        children: []
                      },
                      {
                        id: 409,
                        orgType: '3',
                        level: 1,
                        organCode: '255',
                        orgFullName: '哈尔滨松北店',
                        formatState: null,
                        priceSystem: null,
                        fatherId: 424,
                        orgUuid: 'hdl_apf9kob1p1u4olhltbx3b7nkq0ukx3xi',
                        tenantState: null,
                        text: '255哈尔滨松北店',
                        validState: '1',
                        fatherName: '海底捞(东北地区)',
                        fatherOrganCode: '264',
                        fatherLeve: 1,
                        manageType: null,
                        storelevel: null,
                        arealevel: null,
                        total: null,
                        count: null,
                        children: []
                      }
                    ]
                  },
                  {
                    id: 428,
                    orgType: '1',
                    level: 1,
                    organCode: '265',
                    orgFullName: '海底捞(华北地区)',
                    formatState: null,
                    priceSystem: null,
                    fatherId: 445,
                    orgUuid: 'hdl_565a308dea274af899ebcb742303792b',
                    tenantState: '1',
                    text: '265海底捞(华北地区)',
                    validState: '1',
                    fatherName: '品牌1',
                    fatherOrganCode: '999',
                    fatherLeve: 1,
                    manageType: null,
                    storelevel: null,
                    arealevel: null,
                    total: null,
                    count: null,
                    children: [
                      {
                        id: 411,
                        orgType: '3',
                        level: 1,
                        organCode: '256',
                        orgFullName: '天津津南店',
                        formatState: null,
                        priceSystem: null,
                        fatherId: 428,
                        orgUuid: 'hdl_cp2tqndmf7hycggnyo6swii6paft8vbc',
                        tenantState: null,
                        text: '256天津津南店',
                        validState: '1',
                        fatherName: '海底捞(华北地区)',
                        fatherOrganCode: '265',
                        fatherLeve: 1,
                        manageType: null,
                        storelevel: null,
                        arealevel: null,
                        total: null,
                        count: null,
                        children: []
                      },
                      {
                        id: 416,
                        orgType: '3',
                        level: 1,
                        organCode: '257',
                        orgFullName: '河北石家庄店',
                        formatState: null,
                        priceSystem: null,
                        fatherId: 428,
                        orgUuid: 'hdl_hl7ot6zg1q7xypfeno95uxwc80a68h7t',
                        tenantState: null,
                        text: '257河北石家庄店',
                        validState: '1',
                        fatherName: '海底捞(华北地区)',
                        fatherOrganCode: '265',
                        fatherLeve: 1,
                        manageType: null,
                        storelevel: null,
                        arealevel: null,
                        total: null,
                        count: null,
                        children: []
                      },
                      {
                        id: 418,
                        orgType: '3',
                        level: 1,
                        organCode: '258',
                        orgFullName: '北京东单店',
                        formatState: null,
                        priceSystem: null,
                        fatherId: 428,
                        orgUuid: 'hdl_moqmqm51klbzinpgs3nuk2t5g6c1svbc',
                        tenantState: '1',
                        text: '258北京东单店',
                        validState: '1',
                        fatherName: '海底捞(华北地区)',
                        fatherOrganCode: '265',
                        fatherLeve: 1,
                        manageType: null,
                        storelevel: null,
                        arealevel: null,
                        total: null,
                        count: null,
                        children: []
                      },
                      {
                        id: 420,
                        orgType: '3',
                        level: 1,
                        organCode: '260',
                        orgFullName: '北京望京西店',
                        formatState: null,
                        priceSystem: null,
                        fatherId: 428,
                        orgUuid: 'hdl_650vdp7ou0f4rgbxy6wp59zsuw08h88p',
                        tenantState: null,
                        text: '260北京望京西店',
                        validState: '1',
                        fatherName: '海底捞(华北地区)',
                        fatherOrganCode: '265',
                        fatherLeve: 1,
                        manageType: null,
                        storelevel: null,
                        arealevel: null,
                        total: null,
                        count: null,
                        children: []
                      },
                      {
                        id: 450,
                        orgType: '3',
                        level: 2,
                        organCode: '265001',
                        orgFullName: '二牛哥的测试门店',
                        formatState: null,
                        priceSystem: null,
                        fatherId: 428,
                        orgUuid: 'hdl_906f693d393240a7b46b87d733c156a0',
                        tenantState: null,
                        text: '265001二牛哥的测试门店',
                        validState: '1',
                        fatherName: '海底捞(华北地区)',
                        fatherOrganCode: '265',
                        fatherLeve: 1,
                        manageType: null,
                        storelevel: null,
                        arealevel: null,
                        total: null,
                        count: null,
                        children: []
                      },
                      {
                        id: 451,
                        orgType: '3',
                        level: 2,
                        organCode: '265002',
                        orgFullName: '二狗哥比二牛哥牛逼的门店1',
                        formatState: null,
                        priceSystem: null,
                        fatherId: 428,
                        orgUuid: 'hdl_aaf685fc68b24b04aa3d2aa28936bd72',
                        tenantState: null,
                        text: '265002二狗哥比二牛哥牛逼的门店1',
                        validState: '1',
                        fatherName: '海底捞(华北地区)',
                        fatherOrganCode: '265',
                        fatherLeve: 1,
                        manageType: null,
                        storelevel: null,
                        arealevel: null,
                        total: null,
                        count: null,
                        children: []
                      }
                    ]
                  },
                  {
                    id: 553,
                    orgType: '3',
                    level: 2,
                    organCode: '999008',
                    orgFullName: '啦啦门店2',
                    formatState: null,
                    priceSystem: null,
                    fatherId: 445,
                    orgUuid: 'hdl_9b2d991ce6e34391b6b6561c563d9789',
                    tenantState: null,
                    text: '999008啦啦门店2',
                    validState: '1',
                    fatherName: '品牌1',
                    fatherOrganCode: '999',
                    fatherLeve: 1,
                    manageType: null,
                    storelevel: null,
                    arealevel: null,
                    total: null,
                    count: null,
                    children: []
                  },
                  {
                    id: 554,
                    orgType: '3',
                    level: 2,
                    organCode: '999009',
                    orgFullName: '啦啦门店3',
                    formatState: null,
                    priceSystem: null,
                    fatherId: 445,
                    orgUuid: 'hdl_a2ce85b087834be6892267cb3c8df749',
                    tenantState: null,
                    text: '999009啦啦门店3',
                    validState: '1',
                    fatherName: '品牌1',
                    fatherOrganCode: '999',
                    fatherLeve: 1,
                    manageType: null,
                    storelevel: null,
                    arealevel: null,
                    total: null,
                    count: null,
                    children: []
                  },
                  {
                    id: 562,
                    orgType: '3',
                    level: 2,
                    organCode: '999012',
                    orgFullName: '啦啦门店4',
                    formatState: null,
                    priceSystem: null,
                    fatherId: 445,
                    orgUuid: 'hdl_1053e260b4954766a52d59236711da13',
                    tenantState: null,
                    text: '999012啦啦门店4',
                    validState: '1',
                    fatherName: '品牌1',
                    fatherOrganCode: '999',
                    fatherLeve: 1,
                    manageType: null,
                    storelevel: null,
                    arealevel: null,
                    total: null,
                    count: null,
                    children: []
                  },
                  {
                    id: 565,
                    orgType: '1',
                    level: 2,
                    organCode: '999013',
                    orgFullName: 'ok-bang',
                    formatState: null,
                    priceSystem: null,
                    fatherId: 445,
                    orgUuid: 'hdl_2e07d8a1b2334500873e7a12b2ebe5f5',
                    tenantState: null,
                    text: '999013ok-bang',
                    validState: '1',
                    fatherName: '品牌1',
                    fatherOrganCode: '999',
                    fatherLeve: 1,
                    manageType: null,
                    storelevel: null,
                    arealevel: null,
                    total: null,
                    count: null,
                    children: []
                  },
                  {
                    id: 566,
                    orgType: '1',
                    level: 2,
                    organCode: '999014',
                    orgFullName: '火狐分公司',
                    formatState: null,
                    priceSystem: null,
                    fatherId: 445,
                    orgUuid: 'hdl_b8ec042850114651864718445e9ea4fa',
                    tenantState: null,
                    text: '999014火狐分公司',
                    validState: '1',
                    fatherName: '品牌1',
                    fatherOrganCode: '999',
                    fatherLeve: 1,
                    manageType: null,
                    storelevel: null,
                    arealevel: null,
                    total: null,
                    count: null,
                    children: []
                  },
                  {
                    id: 545,
                    orgType: '1',
                    level: 2,
                    organCode: null,
                    orgFullName: '测试编辑分公司',
                    formatState: null,
                    priceSystem: null,
                    fatherId: 445,
                    orgUuid: null,
                    tenantState: null,
                    text: '测试编辑分公司',
                    validState: null,
                    fatherName: '品牌1',
                    fatherOrganCode: '999',
                    fatherLeve: 1,
                    manageType: null,
                    storelevel: null,
                    arealevel: null,
                    total: null,
                    count: null,
                    children: []
                  }
                ]
              },
              {
                id: 497,
                orgType: '4',
                level: 1,
                organCode: null,
                orgFullName: '大排档',
                formatState: null,
                priceSystem: null,
                fatherId: 0,
                orgUuid: null,
                tenantState: '0',
                text: '大排档',
                validState: '1',
                fatherName: '总部',
                fatherOrganCode: '0',
                fatherLeve: 0,
                manageType: null,
                storelevel: null,
                arealevel: null,
                total: null,
                count: null,
                children: [
                  {
                    id: 498,
                    orgType: '3',
                    level: 0,
                    organCode: null,
                    orgFullName: '小排档',
                    formatState: null,
                    priceSystem: null,
                    fatherId: 497,
                    orgUuid: null,
                    tenantState: '0',
                    text: '小排档',
                    validState: '0',
                    fatherName: '大排档',
                    fatherOrganCode: null,
                    fatherLeve: 1,
                    manageType: null,
                    storelevel: null,
                    arealevel: null,
                    total: null,
                    count: null,
                    children: []
                  },
                  {
                    id: 499,
                    orgType: '1',
                    level: 0,
                    organCode: null,
                    orgFullName: '大东北',
                    formatState: null,
                    priceSystem: null,
                    fatherId: 497,
                    orgUuid: null,
                    tenantState: '0',
                    text: '大东北',
                    validState: '1',
                    fatherName: '大排档',
                    fatherOrganCode: null,
                    fatherLeve: 1,
                    manageType: null,
                    storelevel: null,
                    arealevel: null,
                    total: null,
                    count: null,
                    children: [
                      {
                        id: 500,
                        orgType: '3',
                        level: 0,
                        organCode: null,
                        orgFullName: '中排档',
                        formatState: null,
                        priceSystem: null,
                        fatherId: 499,
                        orgUuid: null,
                        tenantState: '0',
                        text: '中排档',
                        validState: '1',
                        fatherName: '大东北',
                        fatherOrganCode: null,
                        fatherLeve: 0,
                        manageType: null,
                        storelevel: null,
                        arealevel: null,
                        total: null,
                        count: null,
                        children: []
                      }
                    ]
                  }
                ]
              },
              {
                id: 514,
                orgType: '4',
                level: 1,
                organCode: null,
                orgFullName: '能删除',
                formatState: null,
                priceSystem: null,
                fatherId: 0,
                orgUuid: null,
                tenantState: '0',
                text: '能删除',
                validState: '1',
                fatherName: '总部',
                fatherOrganCode: '0',
                fatherLeve: 0,
                manageType: null,
                storelevel: null,
                arealevel: null,
                total: null,
                count: null,
                children: []
              },
              {
                id: 513,
                orgType: '4',
                level: 1,
                organCode: null,
                orgFullName: '能删',
                formatState: null,
                priceSystem: null,
                fatherId: 0,
                orgUuid: null,
                tenantState: '0',
                text: '能删',
                validState: '1',
                fatherName: '总部',
                fatherOrganCode: '0',
                fatherLeve: 0,
                manageType: null,
                storelevel: null,
                arealevel: null,
                total: null,
                count: null,
                children: []
              },
              {
                id: 448,
                orgType: '4',
                level: 1,
                organCode: '996',
                orgFullName: '品牌4',
                formatState: null,
                priceSystem: null,
                fatherId: 0,
                orgUuid: 'hdl_565a308dea274af899ebcb742303792bvv3',
                tenantState: '1',
                text: '996品牌4',
                validState: '1',
                fatherName: '总部',
                fatherOrganCode: '0',
                fatherLeve: 0,
                manageType: null,
                storelevel: null,
                arealevel: null,
                total: null,
                count: null,
                children: [
                  {
                    id: 374,
                    orgType: '1',
                    level: 1,
                    organCode: '226',
                    orgFullName: '海底捞(西北地)',
                    formatState: null,
                    priceSystem: null,
                    fatherId: 448,
                    orgUuid: 'hdl_9zukjnbpkxuwzlimolqe51ief5fi3upi',
                    tenantState: '1',
                    text: '226海底捞(西北地)',
                    validState: '1',
                    fatherName: '品牌4',
                    fatherOrganCode: '996',
                    fatherLeve: 1,
                    manageType: null,
                    storelevel: null,
                    arealevel: null,
                    total: null,
                    count: null,
                    children: [
                      {
                        id: 362,
                        orgType: '3',
                        level: 1,
                        organCode: '216',
                        orgFullName: '内蒙古呼和浩特店',
                        formatState: null,
                        priceSystem: null,
                        fatherId: 374,
                        orgUuid: 'hdl_dd31kyssgn1psst8aaniz7kx94w2hs5a',
                        tenantState: '1',
                        text: '216内蒙古呼和浩特店',
                        validState: '1',
                        fatherName: '海底捞(西北地)',
                        fatherOrganCode: '226',
                        fatherLeve: 1,
                        manageType: null,
                        storelevel: null,
                        arealevel: null,
                        total: null,
                        count: null,
                        children: []
                      },
                      {
                        id: 364,
                        orgType: '3',
                        level: 1,
                        organCode: '218',
                        orgFullName: '青海西宁店',
                        formatState: null,
                        priceSystem: null,
                        fatherId: 374,
                        orgUuid: 'hdl_83xxdgaojvd1hgtsqzhp9mzvs87u5zs0',
                        tenantState: '1',
                        text: '218青海西宁店',
                        validState: '1',
                        fatherName: '海底捞(西北地)',
                        fatherOrganCode: '226',
                        fatherLeve: 1,
                        manageType: null,
                        storelevel: null,
                        arealevel: null,
                        total: null,
                        count: null,
                        children: []
                      },
                      {
                        id: 367,
                        orgType: '3',
                        level: 1,
                        organCode: '220',
                        orgFullName: '西藏拉萨店',
                        formatState: null,
                        priceSystem: null,
                        fatherId: 374,
                        orgUuid: 'hdl_47lbzj890dr0lztd1vspm20j06m3iy9z',
                        tenantState: '1',
                        text: '220西藏拉萨店',
                        validState: '1',
                        fatherName: '海底捞(西北地)',
                        fatherOrganCode: '226',
                        fatherLeve: 1,
                        manageType: null,
                        storelevel: null,
                        arealevel: null,
                        total: null,
                        count: null,
                        children: []
                      },
                      {
                        id: 368,
                        orgType: '3',
                        level: 1,
                        organCode: '221',
                        orgFullName: '新疆乌鲁木齐店',
                        formatState: null,
                        priceSystem: null,
                        fatherId: 374,
                        orgUuid: 'hdl_4to98i2x94l8kf2wx999yn554hqnmqje',
                        tenantState: '1',
                        text: '221新疆乌鲁木齐店',
                        validState: '1',
                        fatherName: '海底捞(西北地)',
                        fatherOrganCode: '226',
                        fatherLeve: 1,
                        manageType: null,
                        storelevel: null,
                        arealevel: null,
                        total: null,
                        count: null,
                        children: []
                      },
                      {
                        id: 369,
                        orgType: '3',
                        level: 1,
                        organCode: '222',
                        orgFullName: '甘肃兰州店',
                        formatState: null,
                        priceSystem: null,
                        fatherId: 374,
                        orgUuid: 'hdl_axltui68weyd8j9d9v21mgf05x11ixo6',
                        tenantState: '1',
                        text: '222甘肃兰州店',
                        validState: '1',
                        fatherName: '海底捞(西北地)',
                        fatherOrganCode: '226',
                        fatherLeve: 1,
                        manageType: null,
                        storelevel: null,
                        arealevel: null,
                        total: null,
                        count: null,
                        children: []
                      },
                      {
                        id: 373,
                        orgType: '3',
                        level: 1,
                        organCode: '225',
                        orgFullName: '陕西西安店',
                        formatState: null,
                        priceSystem: null,
                        fatherId: 374,
                        orgUuid: 'hdl_90o6l4pvrkmhm8thbau8lyepc5ehri3q',
                        tenantState: '1',
                        text: '225陕西西安店',
                        validState: '1',
                        fatherName: '海底捞(西北地)',
                        fatherOrganCode: '226',
                        fatherLeve: 1,
                        manageType: null,
                        storelevel: null,
                        arealevel: null,
                        total: null,
                        count: null,
                        children: []
                      },
                      {
                        id: 375,
                        orgType: '3',
                        level: 2,
                        organCode: '2260200',
                        orgFullName: '123',
                        formatState: null,
                        priceSystem: null,
                        fatherId: 374,
                        orgUuid: 'hdl_hbprucl2afbyf62oaas2vdsmm7eui4y7',
                        tenantState: '1',
                        text: '2260200123',
                        validState: '0',
                        fatherName: '海底捞(西北地)',
                        fatherOrganCode: '226',
                        fatherLeve: 1,
                        manageType: null,
                        storelevel: null,
                        arealevel: null,
                        total: null,
                        count: null,
                        children: []
                      }
                    ]
                  },
                  {
                    id: 449,
                    orgType: '1',
                    level: 2,
                    organCode: '226003',
                    orgFullName: '天上捞',
                    formatState: null,
                    priceSystem: null,
                    fatherId: 448,
                    orgUuid: 'hdl_fbc6cc0586bd4f2f908d19b0b79b4f48',
                    tenantState: null,
                    text: '226003天上捞',
                    validState: '1',
                    fatherName: '品牌4',
                    fatherOrganCode: '996',
                    fatherLeve: 1,
                    manageType: null,
                    storelevel: null,
                    arealevel: null,
                    total: null,
                    count: null,
                    children: [
                      {
                        id: 371,
                        orgType: '3',
                        level: 2,
                        organCode: '20012',
                        orgFullName: '测试门店222222',
                        formatState: null,
                        priceSystem: null,
                        fatherId: 449,
                        orgUuid: 'hdl_9r2lqpx9ayuios1xq0ifyj7u3mgkr71i',
                        tenantState: '1',
                        text: '20012测试门店222222',
                        validState: '1',
                        fatherName: '天上捞',
                        fatherOrganCode: '226003',
                        fatherLeve: 2,
                        manageType: null,
                        storelevel: null,
                        arealevel: null,
                        total: null,
                        count: null,
                        children: []
                      }
                    ]
                  },
                  {
                    id: 442,
                    orgType: '2',
                    level: 1,
                    organCode: '266',
                    orgFullName: '海底捞(北京)',
                    formatState: null,
                    priceSystem: null,
                    fatherId: 448,
                    orgUuid: 'hdl_010eee34a29f4fa3be10368f0d11d20b',
                    tenantState: null,
                    text: '266海底捞(北京)',
                    validState: '1',
                    fatherName: '品牌4',
                    fatherOrganCode: '996',
                    fatherLeve: 1,
                    manageType: null,
                    storelevel: null,
                    arealevel: null,
                    total: null,
                    count: null,
                    children: [
                      {
                        id: 419,
                        orgType: '3',
                        level: 1,
                        organCode: '259',
                        orgFullName: '北京王府井店',
                        formatState: null,
                        priceSystem: null,
                        fatherId: 442,
                        orgUuid: 'hdl_bz9ys2exeqwo2ek24leiqjh7j2bas393',
                        tenantState: '1',
                        text: '259北京王府井店',
                        validState: '1',
                        fatherName: '海底捞(北京)',
                        fatherOrganCode: '266',
                        fatherLeve: 1,
                        manageType: null,
                        storelevel: null,
                        arealevel: null,
                        total: null,
                        count: null,
                        children: []
                      },
                      {
                        id: 421,
                        orgType: '3',
                        level: 1,
                        organCode: '261',
                        orgFullName: '北京朝阳门店',
                        formatState: null,
                        priceSystem: null,
                        fatherId: 442,
                        orgUuid: 'hdl_q0w6scnozd4vxfdm5zp7qdy09l3t9hb5',
                        tenantState: null,
                        text: '261北京朝阳门店',
                        validState: '1',
                        fatherName: '海底捞(北京)',
                        fatherOrganCode: '266',
                        fatherLeve: 1,
                        manageType: null,
                        storelevel: null,
                        arealevel: null,
                        total: null,
                        count: null,
                        children: []
                      }
                    ]
                  },
                  {
                    id: 563,
                    orgType: '1',
                    level: 2,
                    organCode: '298',
                    orgFullName: '996',
                    formatState: null,
                    priceSystem: null,
                    fatherId: 448,
                    orgUuid: 'hdl_a2b9841a91814ae8b531973429d55c0d',
                    tenantState: null,
                    text: '298996',
                    validState: '1',
                    fatherName: '品牌4',
                    fatherOrganCode: '996',
                    fatherLeve: 1,
                    manageType: null,
                    storelevel: null,
                    arealevel: null,
                    total: null,
                    count: null,
                    children: []
                  },
                  {
                    id: 564,
                    orgType: '1',
                    level: 2,
                    organCode: '299',
                    orgFullName: '266海底捞(北京)',
                    formatState: null,
                    priceSystem: null,
                    fatherId: 448,
                    orgUuid: 'hdl_9d817269b9314b0780d2991b698f44cf',
                    tenantState: null,
                    text: '299266海底捞(北京)',
                    validState: '1',
                    fatherName: '品牌4',
                    fatherOrganCode: '996',
                    fatherLeve: 1,
                    manageType: null,
                    storelevel: null,
                    arealevel: null,
                    total: null,
                    count: null,
                    children: []
                  }
                ]
              },
              {
                id: 447,
                orgType: '4',
                level: 1,
                organCode: '997',
                orgFullName: '品牌3',
                formatState: null,
                priceSystem: null,
                fatherId: 0,
                orgUuid: 'hdl_565a308dea274af899ebcb742303792bvv2',
                tenantState: '1',
                text: '997品牌3',
                validState: '1',
                fatherName: '总部',
                fatherOrganCode: '0',
                fatherLeve: 0,
                manageType: null,
                storelevel: null,
                arealevel: null,
                total: null,
                count: null,
                children: [
                  {
                    id: 393,
                    orgType: '1',
                    level: 1,
                    organCode: '238',
                    orgFullName: '海底捞(华中地区)',
                    formatState: null,
                    priceSystem: null,
                    fatherId: 447,
                    orgUuid: 'hdl_709slk2d7hobp4dg7xwi701vi06iii2a',
                    tenantState: '1',
                    text: '238海底捞(华中地区)',
                    validState: '1',
                    fatherName: '品牌3',
                    fatherOrganCode: '997',
                    fatherLeve: 1,
                    manageType: null,
                    storelevel: null,
                    arealevel: null,
                    total: null,
                    count: null,
                    children: [
                      {
                        id: 388,
                        orgType: '3',
                        level: 1,
                        organCode: '233',
                        orgFullName: '贵州贵阳店',
                        formatState: null,
                        priceSystem: null,
                        fatherId: 393,
                        orgUuid: 'hdl_qew7n5fpi435zjdcdvfgbbzn0eqf9vb5',
                        tenantState: '1',
                        text: '233贵州贵阳店',
                        validState: '1',
                        fatherName: '海底捞(华中地区)',
                        fatherOrganCode: '238',
                        fatherLeve: 1,
                        manageType: null,
                        storelevel: null,
                        arealevel: null,
                        total: null,
                        count: null,
                        children: []
                      },
                      {
                        id: 389,
                        orgType: '3',
                        level: 1,
                        organCode: '234',
                        orgFullName: '四川成都店',
                        formatState: null,
                        priceSystem: null,
                        fatherId: 393,
                        orgUuid: 'hdl_9ibl5z2ld0rgf7f57a1a5y9ro5r751dq',
                        tenantState: '1',
                        text: '234四川成都店',
                        validState: '1',
                        fatherName: '海底捞(华中地区)',
                        fatherOrganCode: '238',
                        fatherLeve: 1,
                        manageType: null,
                        storelevel: null,
                        arealevel: null,
                        total: null,
                        count: null,
                        children: []
                      },
                      {
                        id: 390,
                        orgType: '3',
                        level: 1,
                        organCode: '235',
                        orgFullName: '江西南昌店',
                        formatState: null,
                        priceSystem: null,
                        fatherId: 393,
                        orgUuid: 'hdl_88yu6myktn84o1wka1f6neo4fx52owz4',
                        tenantState: '1',
                        text: '235江西南昌店',
                        validState: '1',
                        fatherName: '海底捞(华中地区)',
                        fatherOrganCode: '238',
                        fatherLeve: 1,
                        manageType: null,
                        storelevel: null,
                        arealevel: null,
                        total: null,
                        count: null,
                        children: []
                      },
                      {
                        id: 391,
                        orgType: '3',
                        level: 1,
                        organCode: '236',
                        orgFullName: '湖南长沙店',
                        formatState: null,
                        priceSystem: null,
                        fatherId: 393,
                        orgUuid: 'hdl_6touzwltst2lj5vzj5lwjvf2vj99riiz',
                        tenantState: '1',
                        text: '236湖南长沙店',
                        validState: '1',
                        fatherName: '海底捞(华中地区)',
                        fatherOrganCode: '238',
                        fatherLeve: 1,
                        manageType: null,
                        storelevel: null,
                        arealevel: null,
                        total: null,
                        count: null,
                        children: []
                      },
                      {
                        id: 392,
                        orgType: '3',
                        level: 1,
                        organCode: '237',
                        orgFullName: '湖北武汉店',
                        formatState: null,
                        priceSystem: null,
                        fatherId: 393,
                        orgUuid: 'hdl_abbbt0jxovsdb8pt3pej7wzpi72wyujn',
                        tenantState: '1',
                        text: '237湖北武汉店',
                        validState: '1',
                        fatherName: '海底捞(华中地区)',
                        fatherOrganCode: '238',
                        fatherLeve: 1,
                        manageType: null,
                        storelevel: null,
                        arealevel: null,
                        total: null,
                        count: null,
                        children: []
                      }
                    ]
                  }
                ]
              },
              {
                id: 505,
                orgType: '4',
                level: 1,
                organCode: null,
                orgFullName: '12',
                formatState: null,
                priceSystem: null,
                fatherId: 0,
                orgUuid: 'hdl_07eaf576c69f42549b89155063e7a902',
                tenantState: '0',
                text: '12',
                validState: '1',
                fatherName: '总部',
                fatherOrganCode: '0',
                fatherLeve: 0,
                manageType: null,
                storelevel: null,
                arealevel: null,
                total: null,
                count: null,
                children: []
              },
              {
                id: 510,
                orgType: '4',
                level: 1,
                organCode: null,
                orgFullName: '新建的品牌',
                formatState: null,
                priceSystem: null,
                fatherId: 0,
                orgUuid: null,
                tenantState: '0',
                text: '新建的品牌',
                validState: '1',
                fatherName: '总部',
                fatherOrganCode: '0',
                fatherLeve: 0,
                manageType: null,
                storelevel: null,
                arealevel: null,
                total: null,
                count: null,
                children: [
                  {
                    id: 511,
                    orgType: '1',
                    level: 2,
                    organCode: null,
                    orgFullName: '新建的分公司',
                    formatState: null,
                    priceSystem: null,
                    fatherId: 510,
                    orgUuid: null,
                    tenantState: '0',
                    text: '新建的分公司',
                    validState: '1',
                    fatherName: '新建的品牌',
                    fatherOrganCode: null,
                    fatherLeve: 1,
                    manageType: null,
                    storelevel: null,
                    arealevel: null,
                    total: null,
                    count: null,
                    children: [
                      {
                        id: 512,
                        orgType: '3',
                        level: 0,
                        organCode: null,
                        orgFullName: '新建的门店',
                        formatState: null,
                        priceSystem: null,
                        fatherId: 511,
                        orgUuid: null,
                        tenantState: '0',
                        text: '新建的门店',
                        validState: '1',
                        fatherName: '新建的分公司',
                        fatherOrganCode: null,
                        fatherLeve: 2,
                        manageType: null,
                        storelevel: null,
                        arealevel: null,
                        total: null,
                        count: null,
                        children: []
                      }
                    ]
                  }
                ]
              },
              {
                id: 482,
                orgType: '4',
                level: 1,
                organCode: null,
                orgFullName: '111',
                formatState: null,
                priceSystem: null,
                fatherId: 0,
                orgUuid: null,
                tenantState: '0',
                text: '111',
                validState: '1',
                fatherName: '总部',
                fatherOrganCode: '0',
                fatherLeve: 0,
                manageType: null,
                storelevel: null,
                arealevel: null,
                total: null,
                count: null,
                children: [
                  {
                    id: 483,
                    orgType: '1',
                    level: 0,
                    organCode: null,
                    orgFullName: '2222',
                    formatState: null,
                    priceSystem: null,
                    fatherId: 482,
                    orgUuid: null,
                    tenantState: '0',
                    text: '2222',
                    validState: '1',
                    fatherName: '111',
                    fatherOrganCode: null,
                    fatherLeve: 1,
                    manageType: null,
                    storelevel: null,
                    arealevel: null,
                    total: null,
                    count: null,
                    children: [
                      {
                        id: 484,
                        orgType: '3',
                        level: 0,
                        organCode: null,
                        orgFullName: '333',
                        formatState: null,
                        priceSystem: null,
                        fatherId: 483,
                        orgUuid: null,
                        tenantState: '0',
                        text: '333',
                        validState: '1',
                        fatherName: '2222',
                        fatherOrganCode: null,
                        fatherLeve: 0,
                        manageType: null,
                        storelevel: null,
                        arealevel: null,
                        total: null,
                        count: null,
                        children: []
                      },
                      {
                        id: 485,
                        orgType: '3',
                        level: 0,
                        organCode: null,
                        orgFullName: '3334',
                        formatState: null,
                        priceSystem: null,
                        fatherId: 483,
                        orgUuid: null,
                        tenantState: '0',
                        text: '3334',
                        validState: '1',
                        fatherName: '2222',
                        fatherOrganCode: null,
                        fatherLeve: 0,
                        manageType: null,
                        storelevel: null,
                        arealevel: null,
                        total: null,
                        count: null,
                        children: []
                      }
                    ]
                  },
                  {
                    id: 486,
                    orgType: '3',
                    level: 0,
                    organCode: null,
                    orgFullName: '2233',
                    formatState: null,
                    priceSystem: null,
                    fatherId: 482,
                    orgUuid: null,
                    tenantState: '0',
                    text: '2233',
                    validState: '1',
                    fatherName: '111',
                    fatherOrganCode: null,
                    fatherLeve: 1,
                    manageType: null,
                    storelevel: null,
                    arealevel: null,
                    total: null,
                    count: null,
                    children: []
                  }
                ]
              },
              {
                id: 502,
                orgType: '4',
                level: 1,
                organCode: null,
                orgFullName: '1212',
                formatState: null,
                priceSystem: null,
                fatherId: 0,
                orgUuid: 'hdl_85580c63d6e44d249fea35aa4384ba37',
                tenantState: '0',
                text: '1212',
                validState: '1',
                fatherName: '总部',
                fatherOrganCode: '0',
                fatherLeve: 0,
                manageType: null,
                storelevel: null,
                arealevel: null,
                total: null,
                count: null,
                children: []
              },
              {
                id: 503,
                orgType: '4',
                level: 1,
                organCode: null,
                orgFullName: '121',
                formatState: null,
                priceSystem: null,
                fatherId: 0,
                orgUuid: 'hdl_91832dd1da5a4fe09186a727198f0ef6',
                tenantState: '0',
                text: '121',
                validState: '0',
                fatherName: '总部',
                fatherOrganCode: '0',
                fatherLeve: 0,
                manageType: null,
                storelevel: null,
                arealevel: null,
                total: null,
                count: null,
                children: []
              },
              {
                id: 509,
                orgType: '4',
                level: 1,
                organCode: null,
                orgFullName: '编辑品牌',
                formatState: null,
                priceSystem: null,
                fatherId: 0,
                orgUuid: 'hdl_f884167cf187439791b9f317db1fb4e0',
                tenantState: null,
                text: '编辑品牌',
                validState: '0',
                fatherName: '总部',
                fatherOrganCode: '0',
                fatherLeve: 0,
                manageType: null,
                storelevel: null,
                arealevel: null,
                total: null,
                count: null,
                children: []
              },
              {
                id: 508,
                orgType: '4',
                level: 1,
                organCode: null,
                orgFullName: '编辑明层',
                formatState: null,
                priceSystem: null,
                fatherId: 0,
                orgUuid: 'hdl_74aba163013f4c94a38d71f9dff069f8',
                tenantState: null,
                text: '编辑明层',
                validState: '0',
                fatherName: '总部',
                fatherOrganCode: '0',
                fatherLeve: 0,
                manageType: null,
                storelevel: null,
                arealevel: null,
                total: null,
                count: null,
                children: []
              },
              {
                id: 539,
                orgType: '4',
                level: 1,
                organCode: null,
                orgFullName: '测试价格体系(勿动)',
                formatState: null,
                priceSystem: null,
                fatherId: 0,
                orgUuid: null,
                tenantState: '0',
                text: '测试价格体系(勿动)',
                validState: '1',
                fatherName: '总部',
                fatherOrganCode: '0',
                fatherLeve: 0,
                manageType: null,
                storelevel: null,
                arealevel: null,
                total: null,
                count: null,
                children: [
                  {
                    id: 543,
                    orgType: '1',
                    level: 2,
                    organCode: null,
                    orgFullName: '测试价格体系分公司(勿动)',
                    formatState: null,
                    priceSystem: null,
                    fatherId: 539,
                    orgUuid: null,
                    tenantState: '0',
                    text: '测试价格体系分公司(勿动)',
                    validState: '1',
                    fatherName: '测试价格体系(勿动)',
                    fatherOrganCode: null,
                    fatherLeve: 1,
                    manageType: null,
                    storelevel: null,
                    arealevel: null,
                    total: null,
                    count: null,
                    children: []
                  },
                  {
                    id: 540,
                    orgType: '1',
                    level: 2,
                    organCode: null,
                    orgFullName: '价格体系分公司(勿动)',
                    formatState: null,
                    priceSystem: null,
                    fatherId: 539,
                    orgUuid: null,
                    tenantState: '0',
                    text: '价格体系分公司(勿动)',
                    validState: '1',
                    fatherName: '测试价格体系(勿动)',
                    fatherOrganCode: null,
                    fatherLeve: 1,
                    manageType: null,
                    storelevel: null,
                    arealevel: null,
                    total: null,
                    count: null,
                    children: [
                      {
                        id: 541,
                        orgType: '3',
                        level: 3,
                        organCode: null,
                        orgFullName: '价格体系门店(勿动)',
                        formatState: null,
                        priceSystem: null,
                        fatherId: 540,
                        orgUuid: null,
                        tenantState: '0',
                        text: '价格体系门店(勿动)',
                        validState: '1',
                        fatherName: '价格体系分公司(勿动)',
                        fatherOrganCode: null,
                        fatherLeve: 2,
                        manageType: null,
                        storelevel: null,
                        arealevel: null,
                        total: null,
                        count: null,
                        children: []
                      }
                    ]
                  },
                  {
                    id: 542,
                    orgType: '3',
                    level: 2,
                    organCode: null,
                    orgFullName: '价格体系门店2(勿动)',
                    formatState: null,
                    priceSystem: null,
                    fatherId: 539,
                    orgUuid: null,
                    tenantState: '0',
                    text: '价格体系门店2(勿动)',
                    validState: '1',
                    fatherName: '测试价格体系(勿动)',
                    fatherOrganCode: null,
                    fatherLeve: 1,
                    manageType: null,
                    storelevel: null,
                    arealevel: null,
                    total: null,
                    count: null,
                    children: []
                  },
                  {
                    id: 544,
                    orgType: '3',
                    level: 2,
                    organCode: null,
                    orgFullName: '价格体系门店3(勿动)',
                    formatState: null,
                    priceSystem: null,
                    fatherId: 539,
                    orgUuid: null,
                    tenantState: '0',
                    text: '价格体系门店3(勿动)',
                    validState: '1',
                    fatherName: '测试价格体系(勿动)',
                    fatherOrganCode: null,
                    fatherLeve: 1,
                    manageType: null,
                    storelevel: null,
                    arealevel: null,
                    total: null,
                    count: null,
                    children: []
                  }
                ]
              },
              {
                id: 504,
                orgType: '4',
                level: 1,
                organCode: null,
                orgFullName: '12',
                formatState: null,
                priceSystem: null,
                fatherId: 0,
                orgUuid: 'hdl_2f0be6769b3d4eb69429c7dcfd2e6d10',
                tenantState: '0',
                text: '12',
                validState: '1',
                fatherName: '总部',
                fatherOrganCode: '0',
                fatherLeve: 0,
                manageType: null,
                storelevel: null,
                arealevel: null,
                total: null,
                count: null,
                children: []
              },
              {
                id: 340,
                orgType: '4',
                level: 1,
                organCode: '201',
                orgFullName: '黄焖臭豆腐',
                formatState: null,
                priceSystem: null,
                fatherId: 0,
                orgUuid: 'hdl_d8lx2s7todeje1dopkdj1kn90e6ttwng',
                tenantState: '1',
                text: '201黄焖臭豆腐',
                validState: '1',
                fatherName: '总部',
                fatherOrganCode: '0',
                fatherLeve: 0,
                manageType: null,
                storelevel: null,
                arealevel: null,
                total: null,
                count: null,
                children: []
              },
              {
                id: 360,
                orgType: '4',
                level: 1,
                organCode: '215',
                orgFullName: '宁夏银川店',
                formatState: null,
                priceSystem: null,
                fatherId: 0,
                orgUuid: 'hdl_nrzibc3agk4jpn9x3gfi54muwqbjm80x',
                tenantState: '1',
                text: '215宁夏银川店',
                validState: '1',
                fatherName: '总部',
                fatherOrganCode: '0',
                fatherLeve: 0,
                manageType: null,
                storelevel: null,
                arealevel: null,
                total: null,
                count: null,
                children: []
              },
              {
                id: 473,
                orgType: '4',
                level: 1,
                organCode: null,
                orgFullName: '吉祥大酒店',
                formatState: null,
                priceSystem: null,
                fatherId: 0,
                orgUuid: 'hdl_c27ad971930e48b5bc19c71ef63e65bb',
                tenantState: '0',
                text: '吉祥大酒店',
                validState: '1',
                fatherName: '总部',
                fatherOrganCode: '0',
                fatherLeve: 0,
                manageType: null,
                storelevel: null,
                arealevel: null,
                total: null,
                count: null,
                children: []
              },
              {
                id: 474,
                orgType: '4',
                level: 1,
                organCode: null,
                orgFullName: '天天吃',
                formatState: null,
                priceSystem: null,
                fatherId: 0,
                orgUuid: 'hdl_40a5c96c086c41cbba41d2a1b8f992da',
                tenantState: '0',
                text: '天天吃',
                validState: '1',
                fatherName: '总部',
                fatherOrganCode: '0',
                fatherLeve: 0,
                manageType: null,
                storelevel: null,
                arealevel: null,
                total: null,
                count: null,
                children: [
                  {
                    id: 467,
                    orgType: '3',
                    level: 1,
                    organCode: '284',
                    orgFullName: '66',
                    formatState: null,
                    priceSystem: null,
                    fatherId: 474,
                    orgUuid: 'hdl_d2f7fac16ace4459a83512a5d8319c6a',
                    tenantState: null,
                    text: '28466',
                    validState: '1',
                    fatherName: '天天吃',
                    fatherOrganCode: null,
                    fatherLeve: 1,
                    manageType: null,
                    storelevel: null,
                    arealevel: null,
                    total: null,
                    count: null,
                    children: []
                  },
                  {
                    id: 468,
                    orgType: '1',
                    level: 1,
                    organCode: '285',
                    orgFullName: '77',
                    formatState: null,
                    priceSystem: null,
                    fatherId: 474,
                    orgUuid: 'hdl_234d189871d4473e83bf18161a2aff92',
                    tenantState: null,
                    text: '28577',
                    validState: '1',
                    fatherName: '天天吃',
                    fatherOrganCode: null,
                    fatherLeve: 1,
                    manageType: null,
                    storelevel: null,
                    arealevel: null,
                    total: null,
                    count: null,
                    children: []
                  }
                ]
              }
            ]
          }
        ]
      }
      //
      this.organizaTreeData = resultY.data
      //
      this.organizaListData = resultX.data.rows // 数据 // [] 空数据测试
      this.page = resultX.data.page // 初始化当前页
      this.total = resultX.data.total // 初始化总记录数
      this.pageSize = resultX.data.pageSize // 初始化页大小
      */
      //
      // 发起ajax请求获取机构列表数据
      this.init()
      //
      // 监听重新加载的时机
      EventBus.$on('reload', () => {
        this.reload()
      })
      //
      // 监听编辑分公司
      EventBus.$on('editCompany', (company) => {
        this.editCompany(company)
      })
      //
      // 监听编辑配送中心
      EventBus.$on('editDistribution', (distribution) => {
        this.editDistribution(distribution)
      })
    },
    destroyed () {
      EventBus.$off('reload')
    },
    mounted () {
      document.querySelector('.organiza-manage-container .main .tree .content').oncontextmenu = () => false // 取消默认浏览器右键菜单
    },
    data () {
      return {
        // 权限对象
        auth: null,
        //
        brandId: null, // 品牌ID，添加门店的时候需要
        //
        filterText: '',
        organizaTreeData: [], // 机构树数据
        defaultProps: {
          children: 'children',
          //
          // 之前显示的是text = orgFullName + organCode
          label: 'orgFullName'
        },
        //
        rightMenuData: [], // 右键菜单数据
        isShowRightMenu: false, // 是否显示右键菜单
        isShowCascadeSubMenu: false, // 是否显示级联子菜单
        //
        organizaListData: [], // 右侧表格数据
        // 分页
        page: 1, // 当前页
        total: 0, // 总数据
        pageSize: 10, // 每一页显示多少条数据
        // 排序
        sort: 'org_full_name', // 默认按照全名数据库字段进行排序
        order: null, // 默认排序方式
        //
        orgType: null, // 用于传递参数
        organiza: null, // 机构，用于编辑，可以是分公司、门店、配送中心 // 详情也用
        //
        //
        showEditCompany: false, // 显示新增/编辑分公司
        //
        showEditDistribution: false,
        showCompanyDetails: false,
        showDistributionDetails: false,
        //
        selectedOrg: null, // 选中的机构（品牌、分公司），添加分公司之前先要选中品牌或者分公司
        //
        showInitStore: false, // 显示初始化门店
        showSpecialInstruction: false, // 显示特殊指令
        //
        showEditBrand: false, // 显示新增/编辑品牌
        //
        orgId: null, // 通过id查询机构下的所有分公司、门店、配送中心
        organCode: null,
        //
        showOperatorList: false, // 显示操作员列表
        //
        inTopAnim: true, // 默认顶部动画
        //
        // 过滤条件
        validStateFilter: null, // 启用/停用
        operatingStatusFilter: null, // 正常/暂停/关店
        storeStateFilter: null, // 在线/离线/未知
        orgTypeFilter: null  // 机构类型
      }
    },
    watch: {
      filterText (val) { // 监视过滤文本
        this.$refs.organizaTree.filter(val)
      }
    },
    methods: {
      getAuth () {
        this.auth = this.authorityMap[this.$route.path]
      },
      //
      init () {
        // 初始化页结构
        this.page = 1
        this.pageSize = 10
        this.total = 0
        // 初始化排序
        this.sort = 'org_full_name'
        this.order = null
        // 初始化查询参数
        this.orgId = null
        this.organCode = null
        // 过滤器初始化
        this.validStateFilter = null
        this.operatingStatusFilter = null
        this.storeStateFilter = null
        this.orgTypeFilter = null
        // 获取树和列表数据
        this.getOrganizaTreeDataAjax()
        this.getOrganizaListDataAjax()
      },
      getOrganizaListDataAjax () { // 获取机构列表数据
        this.$http
          .post('/api/organization/organ/load', { form: { id: this.orgId, organCode: this.organCode, validState: this.validStateFilter, operatingStatus: this.operatingStatusFilter, storeState: this.storeStateFilter, orgType: this.orgTypeFilter }, pagination: { page: this.page, pageSize: this.pageSize, sort: this.sort, order: this.order } })
          .then(res => {
            if (res.data.code === '0') {
              this.organizaListData = res.data.data.rows // 数据
              this.total = res.data.data.total // 初始化总记录数
            } else {
              this.$message({ type: 'error', message: res.data.msg })
            }
          })
          .catch(err => {
            this.$message({ type: 'error', message: err.msg })
          })
      },
      getOrganizaTreeDataAjax () { // 获取机构树数据
        this.$http
          .post('/api/organization/organ/getOrganTree', {})
          .then(res => {
            if (res.data.code === '0') {
              this.organizaTreeData = res.data.data
            } else {
              this.$message({ type: 'error', message: res.data.msg })
            }
          })
          .catch(err => {
            this.$message({ type: 'error', message: err.msg })
          })
      },
      filterNode (value, data) { // 过滤节点
        if (!value) return true
        return (data.orgFullName && data.orgFullName.indexOf(value) !== -1) || (data.organCode && data.organCode.indexOf(value) !== -1)
      },
      //
      renderContent (h, { node, data, store }) { // 指定渲染函数
        return (
              <span class='el-tree-node__label' on-mouseup={ (e) => this.handleRightClick(node, data, e) }>
                {node.label}
                <strong>
                  {node.childNodes.length === 0 ? '' : '（' + node.childNodes.length + '）'}
                </strong>
              </span>)
      },
      handleNodeClick (data) { // 点击节点，发送请求，获取数据列表渲染到右侧表格中
        // 初始化分页
        this.page = 1
        this.pageSize = 10
        this.total = 0
        // 初始化排序
        this.sort = 'org_full_name'
        this.order = null
        // 设置查询参数
        this.orgId = data.id === 0 ? null : data.id
        this.organCode = data.organCode
        // 查询请求
        this.getOrganizaListDataAjax()
      },
      handleTreeNodeSingleSelected (currentRow, oldRow) { // 处理树节点单选
        this.selectedOrg = currentRow
      },
      handleRightClick (node, data, e) { // 处理右键点击事件
        if (e.button === 2) { // 右键
          //
          this.rightMenuData = [] // 初始化右键菜单数据
          //
          let setNextValidStateTitle = data.validState === '1' ? '停用' : '启用' // 如果当前启用就显示停用，如果当前停用就显示启用
          let isShowDelete = data.validState === '0' // 删除（停用状态下显示）
          //
          switch (data.orgType) {
            case '0': // 集团右击鼠标，快捷操作包括:“新建品牌”，点击后进入新建品牌页面
              this.rightMenuData = []
              if (this.auth['moduleAuth_save']) {
                this.rightMenuData.push({ title: '新增品牌', data: data, opt: 'add', type: '4' })
              }
              break
            case '4': // 品牌右击鼠标，快捷操作包括：新建（分公司、门店）、编辑（编辑跳转到品牌编辑页面）
              this.rightMenuData = []
              if (this.auth['moduleAuth_save']) {
                this.rightMenuData.push({ title: '新增', children: [ { title: '分公司', data: data, opt: 'add', type: '1' }, { title: '门店', data: data, opt: 'add', type: '3' } ] })
              }
              if (this.auth['moduleAuth_update']) {
                this.rightMenuData.push({ title: '编辑', data: data, opt: 'edit' })
              }
              break
            case '1': // 分公司右击鼠标，快捷操作包括：新建（分公司、门店）、启用（停用）、删除（停用状态下显示）、编辑
              this.rightMenuData = []
              if (this.auth['moduleAuth_save']) {
                this.rightMenuData.push({ title: '新增', data: data, children: [ { title: '分公司', data: data, opt: 'add', type: '1' }, { title: '门店', data: data, opt: 'add', type: '3' } ] })
              }
              if (this.auth['moduleAuth_stopOrstart']) {
                this.rightMenuData.push({ title: setNextValidStateTitle, data: data, opt: 'setState' })
              }
              if (this.auth['moduleAuth_update']) {
                this.rightMenuData.push({ title: '编辑', data: data, opt: 'edit' })
              }
              if (this.auth['moduleAuth_del'] && isShowDelete) {
                this.rightMenuData.push({title: '删除', data: data, opt: 'delete'})
              }
              break
            case '3': // 门店右击鼠标，快捷操作包括：启用（停用）、删除、编辑、初始化、特殊指令、检测基础数据
              this.rightMenuData = []
              if (this.auth['moduleAuth_stopOrstart']) {
                this.rightMenuData.push({ title: setNextValidStateTitle, data: data, opt: 'setState' })
              }
              if (this.auth['moduleAuth_update']) {
                this.rightMenuData.push({ title: '编辑', data: data, opt: 'edit' })
              }
              if (this.auth['moduleAuth_csh']) {
                this.rightMenuData.push({ title: '初始化', data: data, opt: 'initStore' })
              }
              if (this.auth['moduleAuth_tszl']) {
                this.rightMenuData.push({ title: '特殊指令', data: data, opt: 'specialInstruction' })
              }
              if (this.auth['moduleAuth_jcjcsj']) {
                this.rightMenuData.push({ title: '检测基础数据', data: data, opt: 'detectBasicData' })
              }
              if (this.auth['moduleAuth_del'] && isShowDelete) {
                this.rightMenuData.push({title: '删除', data: data, opt: 'delete'})
              }
              break
            case '6': // 物流部右击鼠标，快捷操作包括：新建配送中心、新建分公司
              this.rightMenuData = []
              if (this.auth['moduleAuth_save']) {
                this.rightMenuData.push({ title: '新增配送中心', data: data, opt: 'add', type: '2' })
                this.rightMenuData.push({ title: '新增分公司', data: data, opt: 'add', type: '5' })
              }
              break
            case '5': // 物流下方的配送中心（分公司）右击鼠标，快捷方式包括：新建（配送中心、分公司）、启用（停用）、删除（停用状态下显示）、编辑
            case '2':
              this.rightMenuData = []
              if (this.auth['moduleAuth_save']) {
                this.rightMenuData.push({ title: '新增', children: [ { title: '配送中心', data: data, opt: 'add', type: '2' }, { title: '物流分公司', data: data, opt: 'add', type: '5' } ] })
              }
              if (this.auth['moduleAuth_stopOrstart']) {
                this.rightMenuData.push({ title: setNextValidStateTitle, data: data, opt: 'setState' })
              }
              if (this.auth['moduleAuth_update']) {
                this.rightMenuData.push({ title: '编辑', data: data, opt: 'edit' })
              }
              if (this.auth['moduleAuth_del'] && isShowDelete) {
                this.rightMenuData.push({title: '删除', data: data, opt: 'delete'})
              }
              break
            default:
              return
          }
          //
          // 设置右键菜单的位置
          this.$refs.rightMenu.style.left = e.clientX - 1 + 'px'
          //
          // 处理右键菜单被遮挡问题
          if ((myClient().clientH - e.clientY) < 200) { // 从底部开始显示
            this.$refs.rightMenu.style.top = 'auto'
            this.$refs.rightMenu.style.bottom = myClient().clientH - e.clientY - 1 + 'px'
            this.inTopAnim = false
          } else { // 从顶部开始显示
            this.$refs.rightMenu.style.top = e.clientY - 1 + 'px'
            this.$refs.rightMenu.style.bottom = 'auto'
            this.inTopAnim = true
          }
          // 显示右键菜单
          this.isShowRightMenu = true
        }
      },
      popCascadeSubMenu (item) { // 显示级联子菜单
        if (item.children) {
          this.isShowCascadeSubMenu = true
        }
      },
      slideCascadeSubMenu (item) { // 隐藏级联子菜单
        if (item.children) {
          this.isShowCascadeSubMenu = false
        }
      },
      handleMenuService (item) { // 处理右键菜单业务 //////////////////////////////////////////
        if (!item.children) { // 条目 // 只处理有效条目
          this.isShowRightMenu = false // 点击条目后,关闭右键菜单
          //
          // 处理点击事件
          switch (item.opt) { // 判断操作类型
            case 'add': // item { title: '新增配送中心', data: data, opt: 'add', type: '2' }
              switch (item.type) {
                case '4': // 添加品牌
                  this.selectedOrg = item.data // 1. 选择上级
                  this.addBrand() // 2. 添加品牌
                  break
                case '1': // 添加分公司
                case '5': // 添加物流分公司
                  this.selectedOrg = item.data
                  this.addCompany()
                  break
                case '3': // 添加门店
                  this.selectedOrg = item.data
                  this.addStore()
                  break
                case '2': // 添加配送中心
                  this.selectedOrg = item.data
                  this.addDistribution()
                  break
              }
              break
            case 'edit': // item { title: '编辑', data: data, opt: 'edit' }
              switch (item.data.orgType) { // 根据机构类型，进入不同的编辑方法
                case '1': // 分公司
                case '5': // 物流分公司
                  this.editCompany(item.data)
                  break
                case '2': // 配送中心
                  this.editDistribution(item.data)
                  break
                case '3': // 门店
                  this.editStore(item.data)
                  break
                case '4': // 品牌
                  this.editBrand(item.data)
                  break
              }
              break
            case 'setState':
              let state = item.data.validState === '1' ? '0' : '1'
              this.setValidState(item.data, state)
              break
            case 'delete':
              this.deleteCommand(item.data)
              break
            // 门店特有3个业务
            case 'initStore':
              this.initStoreCommand(item.data)
              break
            case 'specialInstruction':
              this.specialInstructionCommand(item.data)
              break
            case 'detectBasicData':
              this.detectBasicDataCommand(item.data)
              break
          }
        }
      },
      //
      addCompany () { // 新增分公司（1分公司、5物流分公司）
        if (!this.selectedOrg) { // 如果没有选择上级，提示用户
          this.showMessageInfoBox('请选择上级机构！')
        } else { // 如果已选上级，可以进行新增操作
          switch (this.selectedOrg.orgType) { // 根据已选上级的机构类别，判断添加的是分公司还是物流分公司
            case '4': // 品牌
            case '1': // 分公司
              this.orgType = '1' // 添加的是分公司
              this.organiza = null
              this.showEditCompany = true
              break
            case '6': // 物流部
            case '5': // 物流分公司
            case '2': // 配送中心
              this.orgType = '5' // 添加的是物流分公司
              this.organiza = null
              this.showEditCompany = true
              break
            default: // 非法上级
              this.showMessageInfoBox('集团和门店不能作为分公司上级机构！')
          }
        }
      },
      addDistribution () { // 添加配送中心
        if (!this.selectedOrg) {
          this.showMessageInfoBox('请选择上级机构！')
        } else {
          this.orgType = '2' // 添加的是配送中心
          this.organiza = null
          this.showEditDistribution = true
        }
      },
      addStore () { // 添加门店 // props: ['orgType', 'organiza', 'topOrg', 'showEditDistribution']
        if (!this.selectedOrg) {
          this.showMessageInfoBox('请选择上级机构！')
        } else {
          switch (this.selectedOrg.orgType) { // 根据已选上级的机构类别，只有分公司和品牌才能作为门店的上级
            case '1': // 分公司
            case '4': // 品牌
              this.getBrandIdByOrgId(this.selectedOrg.id, () => { // 添加门店的时候需要品牌ID，获取品牌ID后，添加门店 // 设置品牌ID
                //
                this.orgType = '3' // 添加的是门店
                this.organiza = null
                //
                this.$store.dispatch('setStoreParams', { // 分发action // 设置状态
                  orgType: this.orgType,
                  organiza: this.organiza,
                  topOrg: this.selectedOrg,
                  brandId: this.brandId
                })
                this.$router.push({name: 'editStore'}) // 跳转路由
              })
              break
            default:
              this.showMessageInfoBox('只有分公司和品牌才能作为门店的上级机构！')
          }
        }
      },
      addBrand () { // 添加品牌
        this.orgType = '4' // 添加的是品牌
        this.organiza = null
        this.showEditBrand = true
      },
      //
      editCompany (company) { // 编辑分公司
        this.getOrgDetailByOrgId(company.id, company.orgType, () => { // 0. 获取机构详情 // 3. 设置当前编辑的机构
          if (this.organiza) {
            this.buildTopOrg(this.organiza) // 1. 构建上级机构
            //
            this.orgType = this.organiza.orgType // 2. 设置当前编辑的机构的机构类型
            //
            this.showEditCompany = true  // 4. 显示编辑窗口
          }
        })
      },
      editDistribution (distribution) { // 编辑配送中心
        this.getOrgDetailByOrgId(distribution.id, distribution.orgType, () => {
          if (this.organiza) {
            this.buildTopOrg(this.organiza) // 1. 构建上级机构
            //
            this.orgType = this.organiza.orgType // 2. 设置当前编辑的机构的机构类型
            //
            this.showEditDistribution = true // 4. 显示编辑窗口
          }
        })
      },
      editStore (store) { // 编辑门店
        this.getBrandIdAndgetOrgDetail(store.id, store.orgType, () => { // 0. 查询出门店详情和门店所在的品牌ID // 3. 设置品牌ID、设置当前编辑机构
          if (this.brandId && this.organiza) {
            this.buildTopOrg(this.organiza) // 1. 构建上级
            //
            this.orgType = this.organiza.orgType // 2. 设置当前编辑的机构的机构类型
            //
            this.$store.dispatch('setStoreParams', { // 4. 分发action
              orgType: this.orgType,
              organiza: this.organiza,
              topOrg: this.selectedOrg,
              brandId: this.brandId
            })
            this.$router.push({name: 'editStore'})
          }
        })
      },
      editBrand (brand) { // 编辑品牌
        this.getOrgDetailByOrgId(brand.id, brand.orgType, () => { // 0. 获取机构详情 // 3. 设置当前编辑机构
          if (this.organiza) {
            this.buildTopOrg(this.organiza) // 1. 构建上级机构
            //
            this.orgType = this.organiza.orgType // 2. 设置当前编辑的机构的机构类型
            //
            this.showEditBrand = true // 4. 显示编辑窗口
          }
        })
      },
      //
      setValidState (org, state) { // 设置机构有效状态
        this.setValidStateAjax(org.id, org.orgType, state)
      },
      deleteCommand (org) { // 删除机构
        const h = this.$createElement
        this.deleteOrgAjax(org.id, org.orgType, '0')
          .then(res => {
            if (res.data.code === '1001') { // 可以删除
              this.$msgbox({ title: '', type: 'warning', message: h('div', null, [ h('span', null, '您确认要删除此机构吗？') ]), showCancelButton: true, cancelButtonText: '取消', confirmButtonText: '确定' })
                .then(action => {
                  this.deleteOrgAjax(org.id, org.orgType, '1')
                    .then(res => {
                      if (res.data.code === '0') { // 删除成功
                        this.$message({ type: 'success', message: res.data.msg })
                        //
                        this.getOrganizaListDataAjax()
                        this.getOrganizaTreeDataAjax()
                        //
                      } else { // 删除失败
                        this.$message({ type: 'error', message: res.data.msg })
                      }
                    })
                    .catch(err => {
                      this.$message({ type: 'error', message: err.msg })
                    })
                })
                .catch(cancel => {})
            } else {
              this.showMessageInfoBox(res.data.msg)
            }
          })
          .catch(err => {
            this.$message({ type: 'error', message: err.msg })
          })
      },
      //
      initStoreCommand (store) { // 初始化门店命令
        this.detectBasicDataByIdAjax(store.id, () => { // 先进行基础数据检测，通过后方能进行初始化
          this.showInitStore = true
          this.organiza = store
        })
      },
      specialInstructionCommand (store) { // 特殊指令命令
        this.detectBasicDataByIdAjax(store.id, () => {
          this.showSpecialInstruction = true
          this.organiza = store
        })
      },
      detectBasicDataCommand (store) { // 检测基本数据命令
        this.detectBasicDataByIdAjax(store.id)
      },
      //
      handleOrgOperatorList (org) { //  查看机构人员列表
        this.showOperatorList = true
        this.organiza = org
      },
      //
      getBrandIdByOrgId (id, callback) { // 根据机构ID查出机构所在的品牌ID
        this.$http
          .post('/api/organization/organ/getBrandIdById', { id: id })
          .then(res => {
            if (res.data.code === '0') {
              this.brandId = res.data.data
              callback()
            } else {
              this.$message({ type: 'error', message: res.data.msg })
            }
          })
          .catch(err => {
            this.$message({ type: 'error', message: err.msg })
          })
      },
      getOrgDetailByOrgId (id, type, callback) { // 根据机构ID和机构类型查询机构详细信息
        this.$http
          .post('/api/organization/organ/getDetail', { id: id, orgType: type })
          .then(res => {
            if (res.data.code === '0') {
              this.organiza = res.data.data
              callback()
            } else {
              this.$message({ type: 'error', message: res.data.msg })
            }
          })
          .catch(err => {
            this.$message({ type: 'error', message: err.msg })
          })
      },
      getBrandIdAndgetOrgDetail (id, type, callback) { // 合并请求：1. 获取品牌ID 2. 获取机构详细信息
        this.$http.axios.all(
          [
            this.$http.post('/api/organization/organ/getBrandIdById', { id: id }),
            this.$http.post('/api/organization/organ/getDetail', { id: id, orgType: type })
          ]
        )
        .then(this.$http.axios.spread((res1, res2) => {
          if (res1.data.code === '0' && res2.data.code === '0') {
            this.brandId = res1.data.data // 获取品牌ID
            this.organiza = res2.data.data // 获取机构详细信息
            callback()
          } else if (res1.data.code !== '0') {
            this.$message({ type: 'error', message: res1.data.msg })
          } else {
            this.$message({ type: 'error', message: res2.data.msg })
          }
        }))
        .catch(err => {
          this.$message({ type: 'error', message: err.msg })
        })
      },
      setValidStateAjax (id, orgType, validState) { // 设置机构有效状态请求
        this.$http
          .post('/api/organization/organ/updateValidate', { id: id, orgType: orgType, validState: validState })
          .then(res => {
            if (res.data.code === '0') {
              this.$message({ type: 'success', message: res.data.msg })
              //
              this.getOrganizaListDataAjax()
              this.getOrganizaTreeDataAjax()
            } else {
              this.$message({ type: 'error', message: res.data.msg })
            }
          })
          .catch(err => {
            this.$message({ type: 'error', message: err.msg })
          })
      },
      deleteOrgAjax (id, orgType, ok) { // 删除机构请求 // 请求删除、确认删除都走这个请求
        return this.$http.post('/api/organization/organ/delOrgan', { id: id, orgType: orgType, ok: ok })
      },
      detectBasicDataByIdAjax (id, callback) { // 检测基本数据请求
        this.$http
          .post('/api/organization/organ/checkOrgan', { id: id })
          .then(res => {
            if (res.data.code === '0') {
              this.$message({ type: 'success', message: res.data.msg })
              if (callback) {
                callback()
              }
            } else {
              this.$message({ type: 'error', message: res.data.msg })
            }
          })
          .catch(err => {
            this.$message({ type: 'error', message: err.msg })
          })
      },
      //
      buildTopOrg (org) { // 构建上级机构：id、level、orgFullName、organCode
        this.selectedOrg = { id: org.fatherId, orgFullName: org.fatherName, level: org.fatherLevel, organCode: org.fatherOrganCode }
      },
      //
      handleAddCommand (command) { // 处理头部按钮新增命令 // 新增（1分公司、5物流分公司），新增门店
        if (command === 'addCompany') { // 新增分公司
          this.addCompany()
        } else if (command === 'addStore') { // 新增门店
          this.addStore()
        }
      },
      handleDbClick (row) { // 处理行双击事件 // 查看详情
        if (!this.auth['moduleAuth_viewDetails']) return
        switch (row.orgType) {
          case '1': // 分公司
          case '5': // 物流分公司
            this.getOrgDetailByOrgId(row.id, row.orgType, () => { // 查询出机构详情
              if (this.organiza) {
                this.showCompanyDetails = true
              }
            })
            break
          case '2': // 配送中心
            this.getOrgDetailByOrgId(row.id, row.orgType, () => { // 查询出机构详情
              if (this.organiza) {
                this.showDistributionDetails = true
              }
            })
            break
          case '3': // 门店
            this.$router.push({ name: 'storeDetails', query: { orgId: row.id, orgType: row.orgType } })
            break
        }
      },
      edit (row) { // 列表中的编辑按钮 ///////////////////// 都是先查，因为列表中某些字段时null，需要查详情
        switch (row.orgType) {
          case '1': // 编辑分公司
          case '5': // 编辑物流分公司
            this.editCompany(row)
            break
          case '2': // 编辑配送中心
            this.editDistribution(row)
            break
          case '3': // 编辑门店
            this.editStore(row)
            break
        }
      },
      //
      filterValidState (value, row) { // 有效/无效状态过滤
        return row.validState === value
      },
      filterOperatingStatus (value, row) { // 营业状态过滤
        return row.operatingStatus === value
      },
      filterOnlineState (value, row) { // 在线状态过滤
        return row.storeState === value
      },
      filterOrgType (value, row) { // 机构类型过滤
        return row.orgType === value
      },
      //
      filterChange (filters) {
        for (let k in filters) {
          this[k] = filters[k][0]
        }
        this.getOrganizaListDataAjax()
        return true
      },
      //
      shrinkAll () { // 收缩树所有节点
        this.handleExpandOrShrinkTree(false)
      },
      expandAll () { // 展开树所有节点
        this.handleExpandOrShrinkTree(true)
      },
      handleExpandOrShrinkTree (isExpandAll) { // 处理展开和收起所有树节点
        let allNodes = this.$refs.organizaTree.store._getAllNodes()
        for (let i = 0; i < allNodes.length; i++) {
          allNodes[i].expanded = isExpandAll
        }
      },
      //
      handleSort (column, prop, order) { // 处理服务器排序 // 当表格的排序条件发生变化的时候会触发该事件
        // 服务器端排序时：prop, order 为undefined
        // 无序：{column: null, prop: null, order: null}
        // 升序：{column: {…}, prop: "organCode", order: "ascending"}
        // 降序：{column: {…}, prop: "organCode", order: "descending"}
        //
        // 排序后从第1页开始
        this.page = 1
        this.sort = column.prop
        this.order = column.order
        //
        if (column && column.prop && column.order) {
          this.sort = column.prop
          this.order = column.order === 'ascending' ? 'asc' : 'desc'
        } else { // 默认按全名排序
          this.sort = 'org_full_name'
          this.order = null
        }
        // 排序请求
        this.getOrganizaListDataAjax()
      },
      //
      handleSizeChange (val) {
        // 设置分页参数
        this.pageSize = val // 更改每页显示多少条数据
        this.page = 1 // 当更改页大小时，从第一页开始加载数据
        // total不变
        //
        // 保持排序规则和查询参数
        //
        // 获取数据
        this.getOrganizaListDataAjax()
      },
      handleCurrentChange (val) {
        // 设置分页参数
        this.page = val
        // 页大小和total不变
        //
        // 保持排序规则和查询参数
        //
        // 获取数据
        this.getOrganizaListDataAjax()
      },
      //
      closeEditCompany () { // 关闭新增分公司
        this.showEditCompany = false
      },
      closeEditDistribution () { // 关闭编辑配送中心
        this.showEditDistribution = false
      },
      closeEditBrand () { // 关闭检测基本数据
        this.showEditBrand = false
      },
      closeInitStore () { // 关闭初始化门店
        this.showInitStore = false
      },
      closeSpecialInstruction () { // 关闭特殊指令
        this.showSpecialInstruction = false
      },
      closeOperatorList () { // 关闭人员列表
        this.showOperatorList = false
      },
      closeCompanyDetails () { // 关闭分公司详情
        this.showCompanyDetails = false
      },
      closeDistributionDetails () { // 关闭配送中心详情
        this.showDistributionDetails = false
      },
      //
      reload () { // 重新加载
        this.init()
      },
      //
      showMessageInfoBox (msg) { // 抽取消息提示框
        const h = this.$createElement
        this.$msgbox({
          title: '',
          type: 'info',
          message: h('div', null, [ h('p', null, msg) ]),
          confirmButtonText: '知道了',
          confirmButtonClass: 'saasbtn saasbtn-default',
          showClose: false
        })
      }
    },
    computed: {
      authorityMap () {
        return this.$store.getters.getAuthorityMap
      }
    },
    components: {
      'editCompany': editCompany,
      'editDistribution': editDistribution,
      'companyDetails': companyDetails,
      'distributionDetails': distributionDetails,
      'initStore': initStore,
      'specialInstruction': specialInstruction,
      'editBrand': editBrand,
      'operatorList': operatorList
    }
  }
</script>
<style lang="less">
.organiza-manage-container .main .tree .head .search .search-input > .el-input__inner{
    background: #FFFFFF;
    border: 1px solid rgba(216,229,236,0.50);
    border-radius: 3px;
    padding: 0 28px 0 8px;
    color: #34495E;
    height: 28px;
}
.organiza-manage-container .main .tree .content .organiza-tree .el-tree-node__label{
    font-family: "PingFangSC-Regular","微软雅黑";
    font-size: 14px;
    color: #34495E;
    line-height: 14px;

    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
}
.organiza-manage-container .main .tree .content .organiza-tree .el-tree-node__expand-icon {
  font-size: 14px;
}

// 右键菜单侧滑动画效果
.slide-fade-enter-active {
  transition: all .3s ease;
}
.slide-fade-leave-active {
  transition: all .3s cubic-bezier(1.0, 0.5, 0.8, 1.0);
}
.slide-fade-enter{
  transform: translateX(-10px);
  opacity: 0;
}
.slide-fade-leave-to {
  opacity: 0;
  transform: translateX(-10px);
}
</style>
