<style lang="less" scoped>
  @import "./editStore.less";
</style>
<template>
  <div class="edit-store-container">
    <div class="head">
      <h3 class="title">{{this.getStoreParams.organiza ? '编辑门店' : '新增门店'}}</h3>
      <i class="saas iconfont saas-nav-closehover" @click="close"></i>
    </div>

    <div class="jb-line"></div>

    <div class="main">
      <div class="content tzx-form">
        <el-form :model="form" :rules="rules" ref="form" label-width="114px" label-position="left" status-icon>

          <div class="info-box base-info">
            <h4 class="sub-title">基本信息</h4>
            <div class="sub-content">
              <div class="row">
                <div class="col">
                  <el-form-item label="机构名称:" prop="orgFullName">
                    <el-input v-model="form.orgFullName" placeholder="请输入30个以内的汉字或字符" clearable @blur="form.orgFullName ? form.orgFullName = form.orgFullName.trim() : ''"></el-input>
                  </el-form-item>
                </div>
                <div class="col space">
                  <el-form-item label="机构简称:" prop="orgShortName">
                    <el-input v-model="form.orgShortName" placeholder="请输入20个以内的汉字或字符" clearable @blur="form.orgShortName ? form.orgShortName = form.orgShortName.trim() : ''"></el-input>
                  </el-form-item>
                </div>
              </div>
              <div class="row">
                <div class="col">
                  <el-form-item label="上级机构:" prop="topOrgId">
                    <el-input placeholder="请返回选择上级机构" :readonly="true" v-model="topOrgName" ></el-input>
                  </el-form-item>
                </div>
                <div class="col space">
                </div>
              </div>
              <div class="row">
                <div class="col">
                  <!-- 必选：新增价格体系时，ID为null，name必须有，选择已存在价格体系时，ID为ID，name为name -->
                  <el-form-item label="价格体系:" prop="priceSystemName">
                    <el-input v-model="form.priceSystemName"
                              placeholder="输入名称快速查找"
                              @focus="showPriceSystemList = true"
                              @blur="trim('priceSystemName')">
                              <i slot="suffix" class="el-input__icon el-icon-circle-close el-input__clear" @click="clearPriceSystem"></i>
                              </el-input>
                    <transition name="el-zoom-in-top">
                      <div class="selectList priceSystemList" v-if="showPriceSystemList && priceSystemOptions && priceSystemOptions.length > 0">
                        <ul>
                          <li v-for="(item) in priceSystemOptions"
                              :key="item.id"
                              @click="selectPriceSystem(item)"
                              :class="item.id === null ? 'create' : ''">
                              <span>{{ item.priceSystemName }}</span>
                              <el-button type='text' v-if="item.id === null">创建价格体系</el-button>
                          </li>
                        </ul>
                      </div>
                    </transition>
                  </el-form-item>
                </div>
                <div class="col space">
                  <el-form-item label="业态:" prop="formatState">
                    <el-select v-model="form.formatState" clearable placeholder="请选择业态" style="width:100%" popper-class="my-popper-select-class">
                      <el-option
                        v-for="item in formatStateData"
                        :key="item.textid"
                        :label="item.text"
                        :value="item.textid">
                      </el-option>
                    </el-select>
                  </el-form-item>
                </div>
              </div>
              <div class="row">
                <div class="col">
                  <el-form-item label="城市地区:" prop="regionalism">
                    <el-input v-model="regionalismName" placeholder="请选择城市地区" clearable @focus="showCitiesList = true"></el-input>
                    <transition name="el-zoom-in-top">
                      <div class="my-ssx-cascade-container" v-if="showCitiesList && citiesOptions && citiesOptions.length > 0">
                        <ul>
                          <li v-for="city in citiesOptions" :key="city.regCode" @click="loadCounties(city)">
                            <span :title="city.regName">{{ city.regName }}</span>
                            <i class="el-icon-arrow-right"></i>
                          </li>
                        </ul>
                        <transition name="slide-fade">
                          <ul v-if="showCountiesList && countiesData && countiesData.length > 0">
                            <li v-for="county in countiesData" :key="county.regCode" @click="selectRegionalism(county)">
                              <span>{{ county.regName }}</span>
                            </li>
                          </ul>
                        </transition>
                      </div>
                    </transition>
                  </el-form-item>
                </div>
                <div class="col space">
                  <el-form-item label="地区级别:">
                    <el-select v-model="form.arealevel" clearable placeholder="请选择地区级别" style="width:100%" popper-class="my-popper-select-class">
                      <el-option
                        v-for="item in arealevelData"
                        :key="item.textid"
                        :label="item.text"
                        :value="item.textid">
                      </el-option>
                    </el-select>
                  </el-form-item>
                </div>
              </div>
              <div class="row">
                <div class="col">
                  <el-form-item label="门店类型:">
                    <el-select @change="handleStoreTypeSelectChange" v-model="form.storeType" clearable placeholder="请选择门店类型" style="width:100%" popper-class="my-popper-select-class">
                      <el-option
                        v-for="item in storeTypeData"
                        :key="item.textid"
                        :label="item.text"
                        :value="item.textid">
                      </el-option>
                    </el-select>
                  </el-form-item>
                </div>
                <div class="col space">
                  <transition name="el-zoom-in-top">
                    <el-form-item label="上级门店:" v-if="showFatherStore">
                      <el-select v-model="form.fatherStore" clearable placeholder="请选择上级门店" style="width:100%" popper-class="my-popper-select-class">
                        <el-option
                          v-for="item in fatherStoreData"
                          :key="item.id"
                          :label="item.orgFullName"
                          :value="item.id">
                        </el-option>
                      </el-select>
                    </el-form-item>
                  </transition>
                </div>
              </div>
            </div>
          </div>

          <div class="split-line"></div>

          <div class="info-box detail-info">
            <h4 class="sub-title">详细信息</h4>
            <div class="sub-content">
              <div class="row">
                <div class="col">
                  <el-form-item label="经营方式:" prop="manageType">
                    <el-select v-model="form.manageType" clearable placeholder="请选择经营方式" style="width:100%" popper-class="my-popper-select-class">
                      <el-option
                        v-for="item in manageTypeData"
                        :key="item.textid"
                        :label="item.text"
                        :value="item.textid">
                      </el-option>
                    </el-select>
                  </el-form-item>
                </div>
                <div class="col space">
                  <el-form-item label="店面级别:" prop="storelevel">
                    <el-select v-model="form.storelevel" clearable placeholder="请选择店面级别" style="width:100%" popper-class="my-popper-select-class">
                      <el-option
                        v-for="item in storelevelData"
                        :key="item.textid"
                        :label="item.text"
                        :value="item.textid">
                      </el-option>
                    </el-select>
                  </el-form-item>
                </div>
              </div>
              <div class="row">
                <div class="col">
                  <el-form-item label="新美大POI_ID:" prop="poiId">
                    <el-input v-model="form.poiId" placeholder="请输入20个以内的数字或字符" clearable @blur="form.poiId !== null ? form.poiId = form.poiId.trim() : ''"></el-input>
                  </el-form-item>
                </div>
                <div class="col space">
                  <el-form-item label="隶属法人:" prop="legalPerName">
                    <el-input v-model="form.legalPerName"
                              placeholder="输入姓名快速查找"
                              @focus="showLegalList = true"
                              @blur="trim('legalPerName')">
                              <i slot="suffix" class="el-input__icon el-icon-circle-close el-input__clear" @click="clearLegal"></i>
                              </el-input>
                    <transition name="el-zoom-in-top">
                      <div class="selectList legalPerList" v-if="showLegalList && legalPerOptions && legalPerOptions.length > 0">
                        <ul>
                          <li v-for="(item) in legalPerOptions"
                              :key="item.id"
                              @click="selectLegal(item)"
                              :class="item.id === null ? 'create' : ''">
                              <span>{{ item.legalPerName }}</span>
                              <el-button type='text' v-if="item.id === null">创建法人</el-button>
                          </li>
                        </ul>
                      </div>
                    </transition>
                  </el-form-item>
                </div>
              </div>
              <div class="row">
                <div class="col">
                  <el-form-item label="店长工号:" prop="storeManagerNo">
                    <el-input v-model="form.storeManagerNo" placeholder="请输入20个以内的数字或字符" clearable @blur="form.storeManagerNo !== null ? form.storeManagerNo = form.storeManagerNo.trim() : ''"></el-input>
                  </el-form-item>
                </div>
                <div class="col space">
                  <el-form-item label="店长姓名:" prop="storeManagerName">
                    <el-input v-model="form.storeManagerName" placeholder="请输入20个以内的汉字或字符" clearable @blur="form.storeManagerName !== null ? form.storeManagerName = form.storeManagerName.trim() : ''"></el-input>
                  </el-form-item>
                </div>
              </div>
              <div class="row">
                <div class="col">
                  <el-form-item label="联系电话:" prop="phone">
                    <el-input v-model="form.phone" placeholder="请输入20个以内的数字或字符" clearable @blur="form.phone !== null ? form.phone = form.phone.trim() : ''"></el-input>
                  </el-form-item>
                </div>
                <div class="col space">
                  <el-form-item label="投诉电话:" prop="complainPhone">
                    <el-input v-model="form.complainPhone" placeholder="请输入20个以内的数字或字符" clearable @blur="form.complainPhone !== null ? form.complainPhone = form.complainPhone.trim() : ''"></el-input>
                  </el-form-item>
                </div>
              </div>
              <div class="row">
                <div class="col">
                  <el-form-item label="开业日期:" prop="setupDate">
                    <el-date-picker v-model="form.setupDate" type="date" format="yyyy-MM-dd" value-format="yyyy-MM-dd" popper-class="my-date-popper-class" placeholder="请选择日期" clearable style="width: 100%;"></el-date-picker>
                  </el-form-item>
                </div>
                <div class="col space">
                  <el-form-item label="合同终止日期:" prop="contractCloseDate">
                    <el-date-picker v-model="form.contractCloseDate" type="date" format="yyyy-MM-dd" value-format="yyyy-MM-dd" popper-class="my-date-popper-class" placeholder="请选择日期" clearable style="width: 100%;"></el-date-picker>
                  </el-form-item>
                </div>
              </div>
              <div class="row">
                <div class="col">
                  <el-form-item label="网址:" prop="website">
                    <el-input v-model="form.website" placeholder="请输入100个以内的数字或字符" clearable @blur="form.website !== null ? form.website = form.website.trim() : ''"></el-input>
                  </el-form-item>
                </div>
                <div class="col space">
                  <el-form-item label="EMAIL:" prop="email">
                    <el-input v-model="form.email" placeholder="请输入有效的email地址" clearable @blur="form.email !== null ? form.email = form.email.trim() : ''"></el-input>
                  </el-form-item>
                </div>
              </div>
              <div class="row">
                <div class="col">
                  <el-form-item label="营业面积:" prop="bussinessArea">
                    <el-input v-model="form.bussinessArea" placeholder="请输入数字" clearable @blur="form.bussinessArea !== null ? form.bussinessArea = form.bussinessArea.trim() : ''"></el-input>
                  </el-form-item>
                </div>
                <div class="col space">
                  <el-form-item label="营业时间:" prop="businessHours">
                    <el-input v-model="form.businessHours" placeholder="请输入20个以内的汉字或字符" clearable @blur="form.businessHours !== null ? form.businessHours = form.businessHours.trim() : ''" suffix-icon="el-icon-time"></el-input>
                  </el-form-item>
                </div>
              </div>
              <div class="row">
                <div class="col">
                  <el-form-item label="门店标签:" prop="labelValue">
                    <el-input v-model="form.labelValue" placeholder="标签之间请用“,”隔开" clearable @blur="trim('labelValue')"></el-input>
                  </el-form-item>
                </div>
                <div class="col space">
                  <el-form-item label="菜系:" prop="cuisine">
                    <el-input v-model="form.cuisine" placeholder="菜系之间请用“,”隔开" clearable @blur="trim('cuisine')"></el-input>
                  </el-form-item>
                </div>
              </div>
              <div class="row">
                <div class="col2">
                  <el-form-item label="门店属性:">
                    <el-checkbox v-model="form.is24time" label="24小时营业" name="is24time" true-label='1' false-label='0'></el-checkbox>
                    <el-checkbox v-model="form.isDelivery" label="可提供外卖" name="isDelivery" true-label='1' false-label='0'></el-checkbox>
                    <el-checkbox v-model="form.isPhonebook" label="可提供CC" name="isPhonebook" true-label='1' false-label='0'></el-checkbox>
                    <el-checkbox v-model="form.isWebbook" label="可提供网订" name="isWebbook" true-label='1' false-label='0'></el-checkbox>
                  </el-form-item>
                </div>
              </div>
              <div class="row">
                <div class="col2">
                  <el-form-item label="备注:" prop="remark" class="remark">
                    <el-input type="textarea" v-model="form.remark" placeholder="请输入100个以内的汉字或字符" clearable @blur="form.remark !== null ? form.remark = form.remark.trim() : ''" :autosize="{ minRows: 2, maxRows: 8}"></el-input>
                  </el-form-item>
                </div>
              </div>
            </div>
          </div>

          <div class="split-line"></div>

          <div class="info-box wx-info">
            <h4 class="sub-title">微信相关信息</h4>
            <div class="sub-content">
              <div class="row">
                <div class="col">
                  <el-form-item label="二维码编号:" prop="thirdCode">
                    <el-input v-model="form.thirdCode" placeholder="请输入20个以内的数字和字符" clearable @blur="form.thirdCode !== null ? form.thirdCode = form.thirdCode.trim() : ''" ></el-input>
                  </el-form-item>
                </div>
                <div class="col space">
                  <el-form-item label="微信收款账号:" prop="wechat">
                    <el-input v-model="form.wechat" placeholder="请输入20个以内的数字和字符" clearable @blur="form.wechat !== null ? form.wechat = form.wechat.trim() : ''" ></el-input>
                  </el-form-item>
                </div>
              </div>
              <div class="row">
                <div class="col">
                  <el-form-item label="订餐电话:" prop="bookFoodPhone">
                    <el-input v-model="form.bookFoodPhone" placeholder="请输入20个以内的数字和字符" clearable @blur="form.bookFoodPhone !== null ? form.bookFoodPhone = form.bookFoodPhone.trim() : ''" ></el-input>
                  </el-form-item>
                </div>
                <div class="col space">
                  <el-form-item label="人均消费:" prop="avgprice">
                    <el-input v-model="form.avgprice" placeholder="请输入数字" clearable @blur="form.avgprice !== null ? form.avgprice = form.avgprice.trim() : ''" ></el-input>
                  </el-form-item>
                </div>
              </div>
              <div class="row">
                <div class="col2">
                  <el-form-item label="店面地址:" prop="address">
                    <el-input v-model="form.address" placeholder="请输入100个以内的汉字或字符" clearable @blur="form.address !== null ? form.address = form.address.trim() : ''"  ></el-input>
                  </el-form-item>
                </div>
              </div>
              <div class="row">
                <div class="col2">
                  <el-form-item label="公交线路:" prop="busRoute">
                    <el-input v-model="form.busRoute" placeholder="请输入100个以内的汉字或字符" clearable @blur="form.busRoute !== null ? form.busRoute = form.busRoute.trim() : ''" ></el-input>
                  </el-form-item>
                </div>
              </div>
              <div class="row">
                <div class="col2 jwd">
                  <el-form-item label="经纬度:">
                    <el-input v-model="form.longitude" readonly placeholder="经度"></el-input>
                    <el-input v-model="form.latitude" readonly placeholder="维度"></el-input>
                    <i class="el-icon-location-outline" title="选择位置" @click="selectJwd"></i>
                  </el-form-item>
                </div>
              </div>
              <div class="row">
                <div class="col2">
                  <el-form-item label="LOGO:">
                    <el-upload
                      ref="logoUpload"
                      class="uploader logo-uploader"
                      :action="url"
                      :show-file-list="false"
                      name="fileToUpload"
                      :before-upload="beforeLogoUpload"
                      :on-success="handleLogoSuccess">
                      <div class="preview logo" v-if="form.image1" :style='"background-image: url("+form.image1+")"'></div>
                      <div v-else class="desc-container">
                        <i class="icon el-icon-plus avatar-uploader-icon"></i>
                        <div class="title">上传图片</div>
                        <div class="desc">建议尺寸108X108px，50K以内的png、jpg图片</div>
                      </div>
                  </el-upload>
                  </el-form-item>
                </div>
              </div>
              <div class="row">
                <div class="avg-col">
                  <el-form-item label="点餐轮播图:">
                    <el-upload
                      ref="carouselUpload"
                      class="uploader carousel-uploader"
                      :action="url"
                      :show-file-list="false"
                      name="fileToUpload"
                      :before-upload="beforeCarouselUpload"
                      :on-success="handleCarouselSuccess">
                      <div class="desc-container">
                        <i class="icon el-icon-plus avatar-uploader-icon"></i>
                        <div class="title">上传图片</div>
                        <div class="desc">建议尺寸750X170px，500K以内的png、jpg图片</div>
                      </div>
                  </el-upload>
                  </el-form-item>
                </div>
                <div class="avg-col avg-col-right space-small">
                  <el-carousel height="85px" ref="carouselPreview">
                    <el-carousel-item v-for="item in image2Arr" :key="item">
                      <div class="preview" :style='"background-image: url("+item+")"'></div>
                    </el-carousel-item>
                  </el-carousel>
                </div>
              </div>
              <div class="row">
                <div class="col2">
                  <el-form-item label="微信门店背景图:">
                    <el-upload
                      ref="wxStoreBgUpload"
                      class="uploader wxStoreBg-uploader"
                      :action="url"
                      :show-file-list="false"
                      name="fileToUpload"
                      :before-upload="beforeWxStoreBgUpload"
		                  :on-success="handleWxStoreBgSuccess">
                      <div class="preview wxStoreBg" v-if="form.image3" :style='"background-image: url("+form.image3+")"'></div>
                      <div class="desc-container">
                        <i class="icon el-icon-plus avatar-uploader-icon"></i>
                        <div class="title">上传图片</div>
                        <div class="desc">建议尺寸750X252px，300K以内的png、jpg图片</div>
                      </div>
                    </el-upload>
                  </el-form-item>
                </div>
              </div>
              <div class="row">
                <div class="col2">
                  <el-form-item label="微信属性:">
                    <el-checkbox v-model="form.isWechatydzw" label="可提供微信预定餐位" name="isWechatydzw" true-label='1' false-label='0'></el-checkbox>
                    <el-checkbox v-model="form.isWechatdddc" label="可提供微信到店点餐" name="isWechatdddc" true-label='1' false-label='0'></el-checkbox>
                    <el-checkbox v-model="form.isWechatwmzt" label="可提供微信外卖自提" name="isWechatwmzt" true-label='1' false-label='0'></el-checkbox>
                    <el-checkbox v-model="form.isWechatpddh" label="可提供微信排号等号" name="isWechatpddh" true-label='1' false-label='0'></el-checkbox>
                  </el-form-item>
                </div>
              </div>
              <div class="row">
                <div class="col2">
                  <el-form-item label="微信设置:">

                    <!-- 富文本 -->
                    <tzxQuillEditor :editorContent='form.summary'></tzxQuillEditor>

                  </el-form-item>
                </div>
              </div>
            </div>
          </div>
        </el-form>
      </div>
    </div>

    <div class="opt">
      <el-button class="kxBtn" @click="close">取消</el-button>
      <el-button class="kxBtn" @click="submitContinue" :disabled="!enabled" :class="{ 'disabledBtn': !enabled }" >保存并继续</el-button>
      <el-button type="primary" class="sxBtn" @click="submit" :disabled="!enabled" :class="{ 'disabledBtn': !enabled }" >保存</el-button>
    </div>

    <!-- 百度地图 -->
    <baiduMap v-if="showBaiduMap" :showBaiduMap="showBaiduMap" v-on:close="closeBaiduMap"></baiduMap>

  </div>
</template>
<script>
  import '../../../../../assets/less/tzx-form.css'
  import DateUtil from '../../../../../utils/DateUtil.js'
  import EventBus from '../../../../../utils/EventBus.js'
  import baiduMap from './baiduMap.vue'
  import tzxQuillEditor from '../../../../../components/tzxQuillEditor.vue'
  export default {
    created () {
      /*
      // Combobox // 上级门店（所有门店、同品牌下的所有门店）、价格体系、业态、地区级别、门店类型、经营方式、法人、店面级别
      // 假数据
      let result1 = {
        code: '0',
        msg: '操作成功！',
        data: {
          sameBrandStores: [ // 同品牌下的门店
            {
              orgType: '3',
              id: 537,
              orgFullName: '测试使用1218',
              priceSystem: '58',
              deleteState: '0',
              topOrgId: 487, // 上级机构id
              validState: '1'
            }
          ],
          allStores: [ // 所有门店
            {
              orgType: '3',
              id: 489,
              orgFullName: '0101010',
              topOrgId: 487
            },
            {
              orgType: '3',
              id: 549,
              orgFullName: '1222测试门店',
              topOrgId: 446
            },
            {
              orgType: '3',
              id: 550,
              orgFullName: '1223测试门店',
              topOrgId: 446
            },
            {
              orgType: '3',
              id: 551,
              orgFullName: '1224测试门店',
              topOrgId: 446
            },
            {
              orgType: '3',
              id: 490,
              orgFullName: '2121212',
              topOrgId: 487
            },
            {
              orgType: '3',
              id: 486,
              orgFullName: '2233',
              topOrgId: 482
            },
            {
              orgType: '3',
              id: 484,
              orgFullName: '333',
              topOrgId: 483
            },
            {
              orgType: '3',
              id: 485,
              orgFullName: '3334',
              topOrgId: 483
            },
            {
              orgType: '3',
              id: 467,
              orgFullName: '66',
              topOrgId: 474
            },
            {
              orgType: '3',
              id: 363,
              orgFullName: 'hjr小店',
              topOrgId: 0
            },
            {
              orgType: '3',
              id: 401,
              orgFullName: '安徽合肥店',
              topOrgId: 422
            },
            {
              orgType: '3',
              id: 418,
              orgFullName: '北京东单店',
              topOrgId: 428
            },
            {
              orgType: '3',
              id: 419,
              orgFullName: '北京王府井店',
              topOrgId: 442
            },
            {
              orgType: '3',
              id: 420,
              orgFullName: '北京望京西店',
              topOrgId: 428
            },
            {
              orgType: '3',
              id: 421,
              orgFullName: '北京朝阳门店',
              topOrgId: 442
            },
            {
              orgType: '3',
              id: 616,
              orgFullName: '测试SCM门店',
              topOrgId: 615
            },
            {
              orgType: '3',
              id: 371,
              orgFullName: '测试门店222222',
              topOrgId: 449
            },
            {
              orgType: '3',
              id: 537,
              orgFullName: '测试使用1218',
              topOrgId: 487
            },
            {
              orgType: '3',
              id: 451,
              orgFullName: '二狗哥比二牛哥牛逼的门店1',
              topOrgId: 428
            },
            {
              orgType: '3',
              id: 450,
              orgFullName: '二牛哥的测试门店',
              topOrgId: 428
            },
            {
              orgType: '3',
              id: 400,
              orgFullName: '福建厦门店',
              topOrgId: 422
            },
            {
              orgType: '3',
              id: 369,
              orgFullName: '甘肃兰州店',
              topOrgId: 374
            },
            {
              orgType: '3',
              id: 573,
              orgFullName: '高测门店',
              topOrgId: 571
            },
            {
              orgType: '3',
              id: 576,
              orgFullName: '高测门店2',
              topOrgId: 570
            },
            {
              orgType: '3',
              id: 578,
              orgFullName: '高测门店3',
              topOrgId: 577
            },
            {
              orgType: '3',
              id: 579,
              orgFullName: '高测门店4（不包含）',
              topOrgId: 572
            },
            {
              orgType: '3',
              id: 399,
              orgFullName: '广东广州店',
              topOrgId: 423
            },
            {
              orgType: '3',
              id: 398,
              orgFullName: '广东深圳店',
              topOrgId: 423
            },
            {
              orgType: '3',
              id: 397,
              orgFullName: '广西南宁店',
              topOrgId: 423
            },
            {
              orgType: '3',
              id: 388,
              orgFullName: '贵州贵阳店',
              topOrgId: 393
            },
            {
              orgType: '3',
              id: 409,
              orgFullName: '哈尔滨松北店',
              topOrgId: 424
            },
            {
              orgType: '3',
              id: 416,
              orgFullName: '河北石家庄店',
              topOrgId: 428
            },
            {
              orgType: '3',
              id: 392,
              orgFullName: '湖北武汉店',
              topOrgId: 393
            },
            {
              orgType: '3',
              id: 391,
              orgFullName: '湖南长沙店',
              topOrgId: 393
            },
            {
              orgType: '3',
              id: 408,
              orgFullName: '吉林长春店',
              topOrgId: 424
            },
            {
              orgType: '3',
              id: 542,
              orgFullName: '价格体系门店2(勿动)',
              topOrgId: 539
            },
            {
              orgType: '3',
              id: 544,
              orgFullName: '价格体系门店3(勿动)',
              topOrgId: 539
            },
            {
              orgType: '3',
              id: 541,
              orgFullName: '价格体系门店(勿动)',
              topOrgId: 540
            },
            {
              orgType: '3',
              id: 403,
              orgFullName: '江苏南京店',
              topOrgId: 422
            },
            {
              orgType: '3',
              id: 390,
              orgFullName: '江西南昌店',
              topOrgId: 393
            },
            {
              orgType: '3',
              id: 538,
              orgFullName: '今天使用',
              topOrgId: 487
            },
            {
              orgType: '3',
              id: 598,
              orgFullName: '啦啦测试门店',
              topOrgId: 597
            },
            {
              orgType: '3',
              id: 600,
              orgFullName: '啦啦测试门店33',
              topOrgId: 599
            },
            {
              orgType: '3',
              id: 553,
              orgFullName: '啦啦门店2',
              topOrgId: 445
            },
            {
              orgType: '3',
              id: 554,
              orgFullName: '啦啦门店3',
              topOrgId: 445
            },
            {
              orgType: '3',
              id: 562,
              orgFullName: '啦啦门店4',
              topOrgId: 445
            },
            {
              orgType: '3',
              id: 407,
              orgFullName: '辽宁沈阳店',
              topOrgId: 424
            },
            {
              orgType: '3',
              id: 362,
              orgFullName: '内蒙古呼和浩特店',
              topOrgId: 374
            },
            {
              orgType: '3',
              id: 364,
              orgFullName: '青海西宁店',
              topOrgId: 374
            },
            {
              orgType: '3',
              id: 406,
              orgFullName: '山东济南店',
              topOrgId: 422
            },
            {
              orgType: '3',
              id: 404,
              orgFullName: '山东青岛店',
              topOrgId: 422
            },
            {
              orgType: '3',
              id: 373,
              orgFullName: '陕西西安店',
              topOrgId: 374
            },
            {
              orgType: '3',
              id: 389,
              orgFullName: '四川成都店',
              topOrgId: 393
            },
            {
              orgType: '3',
              id: 411,
              orgFullName: '天津津南店',
              topOrgId: 428
            },
            {
              orgType: '3',
              id: 474,
              orgFullName: '天天吃',
              topOrgId: 0
            },
            {
              orgType: '3',
              id: 367,
              orgFullName: '西藏拉萨店',
              topOrgId: 374
            },
            {
              orgType: '3',
              id: 512,
              orgFullName: '新建的门店',
              topOrgId: 511
            },
            {
              orgType: '3',
              id: 368,
              orgFullName: '新疆乌鲁木齐店',
              topOrgId: 374
            },
            {
              orgType: '3',
              id: 395,
              orgFullName: '云南大理店',
              topOrgId: 423
            },
            {
              orgType: '3',
              id: 396,
              orgFullName: '云南昆明店',
              topOrgId: 423
            },
            {
              orgType: '3',
              id: 394,
              orgFullName: '云南香格里拉店',
              topOrgId: 423
            },
            {
              orgType: '3',
              id: 402,
              orgFullName: '浙江杭州店',
              topOrgId: 422
            },
            {
              orgType: '3',
              id: 357,
              orgFullName: '正餐',
              topOrgId: 338
            },
            {
              orgType: '3',
              id: 500,
              orgFullName: '中排档',
              topOrgId: 499
            }
          ],
          storelevel: [ // 店面级别
            {
              textid: '001',
              text: '旗舰店'
            },
            {
              textid: '002',
              text: '社区店'
            }
          ],
          manageTypes: [ // 经营方式
            {
              textid: '001',
              text: '直营'
            },
            {
              textid: '003',
              text: '合作'
            },
            {
              textid: '123',
              text: '直营'
            },
            {
              textid: '110',
              text: '110'
            },
            {
              textid: '12122',
              text: '121212'
            },
            {
              textid: '2132',
              text: '我'
            },
            {
              textid: 'code112121',
              text: '名称1212'
            }
          ],
          legalPer: [ // 法人
            {
              id: 13,
              'legalPerName': '123'
            },
            {
              id: 14,
              'legalPerName': '李志强'
            },
            {
              id: 32,
              'legalPerName': '4324'
            },
            {
              id: 34,
              'legalPerName': '休息'
            },
            {
              id: 36,
              'legalPerName': '张三1'
            },
            {
              id: 37,
              'legalPerName': '张三2'
            },
            {
              id: 54,
              'legalPerName': 'xuguoyu'
            },
            {
              id: 73,
              'legalPerName': 'testwwq1'
            },
            {
              id: 74,
              'legalPerName': 'wwqtest1'
            },
            {
              id: 75,
              'legalPerName': '666'
            },
            {
              id: 76,
              'legalPerName': '烦烦烦'
            },
            {
              id: 77,
              'legalPerName': '555'
            },
            {
              id: 78,
              'legalPerName': '666'
            },
            {
              id: 79,
              'legalPerName': '通天塔'
            },
            {
              id: 80,
              'legalPerName': '也一样'
            },
            {
              id: 81,
              'legalPerName': 'fff555'
            },
            {
              id: 82,
              'legalPerName': 'tttttyyyyyyyy'
            },
            {
              id: 83,
              'legalPerName': '8888gggg'
            },
            {
              id: 85,
              'legalPerName': '百旺哈哈哈'
            },
            {
              id: 86,
              'legalPerName': '瑞红测试'
            },
            {
              id: 89,
              'legalPerName': '李明'
            },
            {
              id: 91,
              'legalPerName': '天天天'
            },
            {
              id: 92,
              'legalPerName': '变变变'
            },
            {
              id: 112,
              'legalPerName': '尼古拉斯'
            },
            {
              id: 113,
              'legalPerName': '尼古拉斯赵四'
            },
            {
              id: 115,
              'legalPerName': '你真的饿了吗'
            },
            {
              id: 114,
              'legalPerName': '你错了吗'
            },
            {
              id: 35,
              'legalPerName': '杨文彦'
            },
            {
              id: 116,
              'legalPerName': '你真v了吗'
            },
            {
              id: 117,
              'legalPerName': '112'
            },
            {
              id: 118,
              'legalPerName': '1212'
            },
            {
              id: 90,
              'legalPerName': '马马马'
            },
            {
              id: 122,
              'legalPerName': '又修仙了'
            },
            {
              id: 87,
              'legalPerName': '早晨好'
            },
            {
              id: 29,
              'legalPerName': '3213213'
            },
            {
              id: 123,
              'legalPerName': '法人名称'
            },
            {
              id: 12,
              'legalPerName': '王五'
            },
            {
              id: 124,
              'legalPerName': '顺风快递'
            },
            {
              id: 125,
              'legalPerName': '12323324'
            },
            {
              id: 126,
              'legalPerName': '中文'
            }
          ],
          arealevel: [ // 区域级别
            {
              textid: '001',
              text: '一线城市'
            },
            {
              textid: '002',
              text: '二线城市'
            },
            {
              textid: '003',
              text: '三线城市'
            },
            {
              textid: '11111',
              text: '一线城市2'
            }
          ],
          storeTypes: [ // 门店类型
            {
              textid: '1',
              text: '单店'
            },
            {
              textid: '2',
              text: '子店'
            },
            {
              textid: '3',
              text: '母店'
            }
          ],
          formatState: [ // 业态
            {
              textid: '1',
              text: '正餐'
            },
            {
              textid: '2',
              text: '快餐'
            }
          ],
          priceSystem: [ // 价格体系
            {
              id: 68,
              priceSystemName: '3333333'
            },
            {
              id: 71,
              priceSystemName: '111'
            }
          ]
        }
      }
      // 所有市
      let result2 = {
        code: '0',
        msg: '操作成功！',
        data: [
          {
            tenancyId: null,
            id: null,
            regCode: '11203',
            regNo: null,
            regName: '蚌埠市',
            fatherId: '112',
            regMemo: null,
            regType: null,
            regTypeName: null,
            districtNo: null,
            postNo: '',
            validState: null,
            remark: null,
            lastOperator: null,
            lastUpdatetime: null,
            parentName: null,
            children: []
          },
          {
            tenancyId: null,
            id: null,
            regCode: '11211',
            regNo: null,
            regName: '阜阳市',
            fatherId: '112',
            regMemo: null,
            regType: null,
            regTypeName: null,
            districtNo: null,
            postNo: '',
            validState: null,
            remark: null,
            lastOperator: null,
            lastUpdatetime: null,
            parentName: null,
            children: []
          },
          {
            tenancyId: null,
            id: null,
            regCode: '11512',
            regNo: null,
            regName: '莱芜市',
            fatherId: '115',
            regMemo: null,
            regType: null,
            regTypeName: null,
            districtNo: null,
            postNo: '',
            validState: null,
            remark: null,
            lastOperator: null,
            lastUpdatetime: null,
            parentName: null,
            children: []
          },
          {
            tenancyId: null,
            id: null,
            regCode: '11906',
            regNo: null,
            regName: '佛山市',
            fatherId: '119',
            regMemo: null,
            regType: null,
            regTypeName: null,
            districtNo: null,
            postNo: '',
            validState: null,
            remark: null,
            lastOperator: null,
            lastUpdatetime: null,
            parentName: null,
            children: []
          },
          {
            tenancyId: null,
            id: null,
            regCode: '12313',
            regNo: null,
            regName: '宜宾市',
            fatherId: '123',
            regMemo: null,
            regType: null,
            regTypeName: null,
            districtNo: null,
            postNo: '',
            validState: null,
            remark: null,
            lastOperator: null,
            lastUpdatetime: null,
            parentName: null,
            children: []
          },
          {
            tenancyId: null,
            id: null,
            regCode: '12807',
            regNo: null,
            regName: '张掖市',
            fatherId: '128',
            regMemo: null,
            regType: null,
            regTypeName: null,
            districtNo: null,
            postNo: '',
            validState: null,
            remark: null,
            lastOperator: null,
            lastUpdatetime: null,
            parentName: null,
            children: []
          },
          {
            tenancyId: null,
            id: null,
            regCode: '10201',
            regNo: null,
            regName: '天津市市辖区',
            fatherId: '102',
            regMemo: null,
            regType: null,
            regTypeName: null,
            districtNo: null,
            postNo: '',
            validState: null,
            remark: null,
            lastOperator: null,
            lastUpdatetime: null,
            parentName: null,
            children: []
          },
          {
            tenancyId: null,
            id: null,
            regCode: '11612',
            regNo: null,
            regName: '三门峡市',
            fatherId: '116',
            regMemo: null,
            regType: null,
            regTypeName: null,
            districtNo: null,
            postNo: '',
            validState: null,
            remark: null,
            lastOperator: null,
            lastUpdatetime: null,
            parentName: null,
            children: []
          },
          {
            tenancyId: null,
            id: null,
            regCode: '10303',
            regNo: null,
            regName: '秦皇岛市',
            fatherId: '103',
            regMemo: null,
            regType: null,
            regTypeName: null,
            districtNo: null,
            postNo: '',
            validState: null,
            remark: null,
            lastOperator: null,
            lastUpdatetime: null,
            parentName: null,
            children: []
          },
          {
            tenancyId: null,
            id: null,
            regCode: '10304',
            regNo: null,
            regName: '邯郸市',
            fatherId: '103',
            regMemo: null,
            regType: null,
            regTypeName: null,
            districtNo: null,
            postNo: '',
            validState: null,
            remark: null,
            lastOperator: null,
            lastUpdatetime: null,
            parentName: null,
            children: []
          },
          {
            tenancyId: null,
            id: null,
            regCode: '10305',
            regNo: null,
            regName: '邢台市',
            fatherId: '103',
            regMemo: null,
            regType: null,
            regTypeName: null,
            districtNo: null,
            postNo: '',
            validState: null,
            remark: null,
            lastOperator: null,
            lastUpdatetime: null,
            parentName: null,
            children: []
          },
          {
            tenancyId: null,
            id: null,
            regCode: '10309',
            regNo: null,
            regName: '沧州市',
            fatherId: '103',
            regMemo: null,
            regType: null,
            regTypeName: null,
            districtNo: null,
            postNo: '',
            validState: null,
            remark: null,
            lastOperator: null,
            lastUpdatetime: null,
            parentName: null,
            children: []
          },
          {
            tenancyId: null,
            id: null,
            regCode: '10310',
            regNo: null,
            regName: '廊坊市',
            fatherId: '103',
            regMemo: null,
            regType: null,
            regTypeName: null,
            districtNo: null,
            postNo: '',
            validState: null,
            remark: null,
            lastOperator: null,
            lastUpdatetime: null,
            parentName: null,
            children: []
          },
          {
            tenancyId: null,
            id: null,
            regCode: '10311',
            regNo: null,
            regName: '衡水市',
            fatherId: '103',
            regMemo: null,
            regType: null,
            regTypeName: null,
            districtNo: null,
            postNo: '',
            validState: null,
            remark: null,
            lastOperator: null,
            lastUpdatetime: null,
            parentName: null,
            children: []
          },
          {
            tenancyId: null,
            id: null,
            regCode: '10401',
            regNo: null,
            regName: '太原市',
            fatherId: '104',
            regMemo: null,
            regType: null,
            regTypeName: null,
            districtNo: null,
            postNo: '',
            validState: null,
            remark: null,
            lastOperator: null,
            lastUpdatetime: null,
            parentName: null,
            children: []
          },
          {
            tenancyId: null,
            id: null,
            regCode: '10402',
            regNo: null,
            regName: '大同市',
            fatherId: '104',
            regMemo: null,
            regType: null,
            regTypeName: null,
            districtNo: null,
            postNo: '',
            validState: null,
            remark: null,
            lastOperator: null,
            lastUpdatetime: null,
            parentName: null,
            children: []
          },
          {
            tenancyId: null,
            id: null,
            regCode: '10403',
            regNo: null,
            regName: '阳泉市',
            fatherId: '104',
            regMemo: null,
            regType: null,
            regTypeName: null,
            districtNo: null,
            postNo: '',
            validState: null,
            remark: null,
            lastOperator: null,
            lastUpdatetime: null,
            parentName: null,
            children: []
          },
          {
            tenancyId: null,
            id: null,
            regCode: '10404',
            regNo: null,
            regName: '长治市',
            fatherId: '104',
            regMemo: null,
            regType: null,
            regTypeName: null,
            districtNo: null,
            postNo: '',
            validState: null,
            remark: null,
            lastOperator: null,
            lastUpdatetime: null,
            parentName: null,
            children: []
          },
          {
            tenancyId: null,
            id: null,
            regCode: '10405',
            regNo: null,
            regName: '晋城市',
            fatherId: '104',
            regMemo: null,
            regType: null,
            regTypeName: null,
            districtNo: null,
            postNo: '',
            validState: null,
            remark: null,
            lastOperator: null,
            lastUpdatetime: null,
            parentName: null,
            children: []
          },
          {
            tenancyId: null,
            id: null,
            regCode: '10406',
            regNo: null,
            regName: '朔州市',
            fatherId: '104',
            regMemo: null,
            regType: null,
            regTypeName: null,
            districtNo: null,
            postNo: '',
            validState: null,
            remark: null,
            lastOperator: null,
            lastUpdatetime: null,
            parentName: null,
            children: []
          },
          {
            tenancyId: null,
            id: null,
            regCode: '10407',
            regNo: null,
            regName: '晋中市',
            fatherId: '104',
            regMemo: null,
            regType: null,
            regTypeName: null,
            districtNo: null,
            postNo: '',
            validState: null,
            remark: null,
            lastOperator: null,
            lastUpdatetime: null,
            parentName: null,
            children: []
          },
          {
            tenancyId: null,
            id: null,
            regCode: '10408',
            regNo: null,
            regName: '运城市',
            fatherId: '104',
            regMemo: null,
            regType: null,
            regTypeName: null,
            districtNo: null,
            postNo: '',
            validState: null,
            remark: null,
            lastOperator: null,
            lastUpdatetime: null,
            parentName: null,
            children: []
          },
          {
            tenancyId: null,
            id: null,
            regCode: '10409',
            regNo: null,
            regName: '忻州市',
            fatherId: '104',
            regMemo: null,
            regType: null,
            regTypeName: null,
            districtNo: null,
            postNo: '',
            validState: null,
            remark: null,
            lastOperator: null,
            lastUpdatetime: null,
            parentName: null,
            children: []
          },
          {
            tenancyId: null,
            id: null,
            regCode: '10410',
            regNo: null,
            regName: '临汾市',
            fatherId: '104',
            regMemo: null,
            regType: null,
            regTypeName: null,
            districtNo: null,
            postNo: '',
            validState: null,
            remark: null,
            lastOperator: null,
            lastUpdatetime: null,
            parentName: null,
            children: []
          },
          {
            tenancyId: null,
            id: null,
            regCode: '10411',
            regNo: null,
            regName: '吕梁市',
            fatherId: '104',
            regMemo: null,
            regType: null,
            regTypeName: null,
            districtNo: null,
            postNo: '',
            validState: null,
            remark: null,
            lastOperator: null,
            lastUpdatetime: null,
            parentName: null,
            children: []
          },
          {
            tenancyId: null,
            id: null,
            regCode: '10501',
            regNo: null,
            regName: '呼和浩特市',
            fatherId: '105',
            regMemo: null,
            regType: null,
            regTypeName: null,
            districtNo: null,
            postNo: '',
            validState: null,
            remark: null,
            lastOperator: null,
            lastUpdatetime: null,
            parentName: null,
            children: []
          },
          {
            tenancyId: null,
            id: null,
            regCode: '10503',
            regNo: null,
            regName: '乌海市',
            fatherId: '105',
            regMemo: null,
            regType: null,
            regTypeName: null,
            districtNo: null,
            postNo: '',
            validState: null,
            remark: null,
            lastOperator: null,
            lastUpdatetime: null,
            parentName: null,
            children: []
          },
          {
            tenancyId: null,
            id: null,
            regCode: '10504',
            regNo: null,
            regName: '赤峰市',
            fatherId: '105',
            regMemo: null,
            regType: null,
            regTypeName: null,
            districtNo: null,
            postNo: '',
            validState: null,
            remark: null,
            lastOperator: null,
            lastUpdatetime: null,
            parentName: null,
            children: []
          },
          {
            tenancyId: null,
            id: null,
            regCode: '10505',
            regNo: null,
            regName: '通辽市',
            fatherId: '105',
            regMemo: null,
            regType: null,
            regTypeName: null,
            districtNo: null,
            postNo: '',
            validState: null,
            remark: null,
            lastOperator: null,
            lastUpdatetime: null,
            parentName: null,
            children: []
          },
          {
            tenancyId: null,
            id: null,
            regCode: '10506',
            regNo: null,
            regName: '鄂尔多斯市',
            fatherId: '105',
            regMemo: null,
            regType: null,
            regTypeName: null,
            districtNo: null,
            postNo: '',
            validState: null,
            remark: null,
            lastOperator: null,
            lastUpdatetime: null,
            parentName: null,
            children: []
          },
          {
            tenancyId: null,
            id: null,
            regCode: '10507',
            regNo: null,
            regName: '呼伦贝尔市',
            fatherId: '105',
            regMemo: null,
            regType: null,
            regTypeName: null,
            districtNo: null,
            postNo: '',
            validState: null,
            remark: null,
            lastOperator: null,
            lastUpdatetime: null,
            parentName: null,
            children: []
          },
          {
            tenancyId: null,
            id: null,
            regCode: '10508',
            regNo: null,
            regName: '巴彦淖尔市',
            fatherId: '105',
            regMemo: null,
            regType: null,
            regTypeName: null,
            districtNo: null,
            postNo: '',
            validState: null,
            remark: null,
            lastOperator: null,
            lastUpdatetime: null,
            parentName: null,
            children: []
          },
          {
            tenancyId: null,
            id: null,
            regCode: '10509',
            regNo: null,
            regName: '乌兰察布市',
            fatherId: '105',
            regMemo: null,
            regType: null,
            regTypeName: null,
            districtNo: null,
            postNo: '',
            validState: null,
            remark: null,
            lastOperator: null,
            lastUpdatetime: null,
            parentName: null,
            children: []
          },
          {
            tenancyId: null,
            id: null,
            regCode: '10511',
            regNo: null,
            regName: '锡林郭勒盟',
            fatherId: '105',
            regMemo: null,
            regType: null,
            regTypeName: null,
            districtNo: null,
            postNo: '',
            validState: null,
            remark: null,
            lastOperator: null,
            lastUpdatetime: null,
            parentName: null,
            children: []
          },
          {
            tenancyId: null,
            id: null,
            regCode: '10512',
            regNo: null,
            regName: '阿拉善盟',
            fatherId: '105',
            regMemo: null,
            regType: null,
            regTypeName: null,
            districtNo: null,
            postNo: '',
            validState: null,
            remark: null,
            lastOperator: null,
            lastUpdatetime: null,
            parentName: null,
            children: []
          },
          {
            tenancyId: null,
            id: null,
            regCode: '10601',
            regNo: null,
            regName: '沈阳市',
            fatherId: '106',
            regMemo: null,
            regType: null,
            regTypeName: null,
            districtNo: null,
            postNo: '',
            validState: null,
            remark: null,
            lastOperator: null,
            lastUpdatetime: null,
            parentName: null,
            children: []
          },
          {
            tenancyId: null,
            id: null,
            regCode: '10602',
            regNo: null,
            regName: '大连市',
            fatherId: '106',
            regMemo: null,
            regType: null,
            regTypeName: null,
            districtNo: null,
            postNo: '',
            validState: null,
            remark: null,
            lastOperator: null,
            lastUpdatetime: null,
            parentName: null,
            children: []
          },
          {
            tenancyId: null,
            id: null,
            regCode: '10603',
            regNo: null,
            regName: '鞍山市',
            fatherId: '106',
            regMemo: null,
            regType: null,
            regTypeName: null,
            districtNo: null,
            postNo: '',
            validState: null,
            remark: null,
            lastOperator: null,
            lastUpdatetime: null,
            parentName: null,
            children: []
          },
          {
            tenancyId: null,
            id: null,
            regCode: '10604',
            regNo: null,
            regName: '抚顺市',
            fatherId: '106',
            regMemo: null,
            regType: null,
            regTypeName: null,
            districtNo: null,
            postNo: '',
            validState: null,
            remark: null,
            lastOperator: null,
            lastUpdatetime: null,
            parentName: null,
            children: []
          },
          {
            tenancyId: null,
            id: null,
            regCode: '10605',
            regNo: null,
            regName: '本溪市',
            fatherId: '106',
            regMemo: null,
            regType: null,
            regTypeName: null,
            districtNo: null,
            postNo: '',
            validState: null,
            remark: null,
            lastOperator: null,
            lastUpdatetime: null,
            parentName: null,
            children: []
          },
          {
            tenancyId: null,
            id: null,
            regCode: '10606',
            regNo: null,
            regName: '丹东市',
            fatherId: '106',
            regMemo: null,
            regType: null,
            regTypeName: null,
            districtNo: null,
            postNo: '',
            validState: null,
            remark: null,
            lastOperator: null,
            lastUpdatetime: null,
            parentName: null,
            children: []
          },
          {
            tenancyId: null,
            id: null,
            regCode: '10607',
            regNo: null,
            regName: '锦州市',
            fatherId: '106',
            regMemo: null,
            regType: null,
            regTypeName: null,
            districtNo: null,
            postNo: '',
            validState: null,
            remark: null,
            lastOperator: null,
            lastUpdatetime: null,
            parentName: null,
            children: []
          },
          {
            tenancyId: null,
            id: null,
            regCode: '10608',
            regNo: null,
            regName: '营口市',
            fatherId: '106',
            regMemo: null,
            regType: null,
            regTypeName: null,
            districtNo: null,
            postNo: '',
            validState: null,
            remark: null,
            lastOperator: null,
            lastUpdatetime: null,
            parentName: null,
            children: []
          },
          {
            tenancyId: null,
            id: null,
            regCode: '10609',
            regNo: null,
            regName: '阜新市',
            fatherId: '106',
            regMemo: null,
            regType: null,
            regTypeName: null,
            districtNo: null,
            postNo: '',
            validState: null,
            remark: null,
            lastOperator: null,
            lastUpdatetime: null,
            parentName: null,
            children: []
          },
          {
            tenancyId: null,
            id: null,
            regCode: '10610',
            regNo: null,
            regName: '辽阳市',
            fatherId: '106',
            regMemo: null,
            regType: null,
            regTypeName: null,
            districtNo: null,
            postNo: '',
            validState: null,
            remark: null,
            lastOperator: null,
            lastUpdatetime: null,
            parentName: null,
            children: []
          },
          {
            tenancyId: null,
            id: null,
            regCode: '10611',
            regNo: null,
            regName: '盘锦市',
            fatherId: '106',
            regMemo: null,
            regType: null,
            regTypeName: null,
            districtNo: null,
            postNo: '',
            validState: null,
            remark: null,
            lastOperator: null,
            lastUpdatetime: null,
            parentName: null,
            children: []
          },
          {
            tenancyId: null,
            id: null,
            regCode: '10612',
            regNo: null,
            regName: '铁岭市',
            fatherId: '106',
            regMemo: null,
            regType: null,
            regTypeName: null,
            districtNo: null,
            postNo: '',
            validState: null,
            remark: null,
            lastOperator: null,
            lastUpdatetime: null,
            parentName: null,
            children: []
          },
          {
            tenancyId: null,
            id: null,
            regCode: '10613',
            regNo: null,
            regName: '朝阳市',
            fatherId: '106',
            regMemo: null,
            regType: null,
            regTypeName: null,
            districtNo: null,
            postNo: '',
            validState: null,
            remark: null,
            lastOperator: null,
            lastUpdatetime: null,
            parentName: null,
            children: []
          },
          {
            tenancyId: null,
            id: null,
            regCode: '10614',
            regNo: null,
            regName: '葫芦岛市',
            fatherId: '106',
            regMemo: null,
            regType: null,
            regTypeName: null,
            districtNo: null,
            postNo: '',
            validState: null,
            remark: null,
            lastOperator: null,
            lastUpdatetime: null,
            parentName: null,
            children: []
          },
          {
            tenancyId: null,
            id: null,
            regCode: '10701',
            regNo: null,
            regName: '长春市',
            fatherId: '107',
            regMemo: null,
            regType: null,
            regTypeName: null,
            districtNo: null,
            postNo: '',
            validState: null,
            remark: null,
            lastOperator: null,
            lastUpdatetime: null,
            parentName: null,
            children: []
          },
          {
            tenancyId: null,
            id: null,
            regCode: '10703',
            regNo: null,
            regName: '四平市',
            fatherId: '107',
            regMemo: null,
            regType: null,
            regTypeName: null,
            districtNo: null,
            postNo: '',
            validState: null,
            remark: null,
            lastOperator: null,
            lastUpdatetime: null,
            parentName: null,
            children: []
          },
          {
            tenancyId: null,
            id: null,
            regCode: '10704',
            regNo: null,
            regName: '辽源市',
            fatherId: '107',
            regMemo: null,
            regType: null,
            regTypeName: null,
            districtNo: null,
            postNo: '',
            validState: null,
            remark: null,
            lastOperator: null,
            lastUpdatetime: null,
            parentName: null,
            children: []
          },
          {
            tenancyId: null,
            id: null,
            regCode: '10705',
            regNo: null,
            regName: '通化市',
            fatherId: '107',
            regMemo: null,
            regType: null,
            regTypeName: null,
            districtNo: null,
            postNo: '',
            validState: null,
            remark: null,
            lastOperator: null,
            lastUpdatetime: null,
            parentName: null,
            children: []
          },
          {
            tenancyId: null,
            id: null,
            regCode: '10706',
            regNo: null,
            regName: '白山市',
            fatherId: '107',
            regMemo: null,
            regType: null,
            regTypeName: null,
            districtNo: null,
            postNo: '',
            validState: null,
            remark: null,
            lastOperator: null,
            lastUpdatetime: null,
            parentName: null,
            children: []
          },
          {
            tenancyId: null,
            id: null,
            regCode: '10707',
            regNo: null,
            regName: '松原市',
            fatherId: '107',
            regMemo: null,
            regType: null,
            regTypeName: null,
            districtNo: null,
            postNo: '',
            validState: null,
            remark: null,
            lastOperator: null,
            lastUpdatetime: null,
            parentName: null,
            children: []
          },
          {
            tenancyId: null,
            id: null,
            regCode: '10708',
            regNo: null,
            regName: '白城市',
            fatherId: '107',
            regMemo: null,
            regType: null,
            regTypeName: null,
            districtNo: null,
            postNo: '',
            validState: null,
            remark: null,
            lastOperator: null,
            lastUpdatetime: null,
            parentName: null,
            children: []
          },
          {
            tenancyId: null,
            id: null,
            regCode: '10709',
            regNo: null,
            regName: '延边朝鲜族自治州',
            fatherId: '107',
            regMemo: null,
            regType: null,
            regTypeName: null,
            districtNo: null,
            postNo: '',
            validState: null,
            remark: null,
            lastOperator: null,
            lastUpdatetime: null,
            parentName: null,
            children: []
          },
          {
            tenancyId: null,
            id: null,
            regCode: '10801',
            regNo: null,
            regName: '哈尔滨市',
            fatherId: '108',
            regMemo: null,
            regType: null,
            regTypeName: null,
            districtNo: null,
            postNo: '',
            validState: null,
            remark: null,
            lastOperator: null,
            lastUpdatetime: null,
            parentName: null,
            children: []
          },
          {
            tenancyId: null,
            id: null,
            regCode: '10802',
            regNo: null,
            regName: '齐齐哈尔市',
            fatherId: '108',
            regMemo: null,
            regType: null,
            regTypeName: null,
            districtNo: null,
            postNo: '',
            validState: null,
            remark: null,
            lastOperator: null,
            lastUpdatetime: null,
            parentName: null,
            children: []
          },
          {
            tenancyId: null,
            id: null,
            regCode: '10803',
            regNo: null,
            regName: '鸡西市',
            fatherId: '108',
            regMemo: null,
            regType: null,
            regTypeName: null,
            districtNo: null,
            postNo: '',
            validState: null,
            remark: null,
            lastOperator: null,
            lastUpdatetime: null,
            parentName: null,
            children: []
          },
          {
            tenancyId: null,
            id: null,
            regCode: '10805',
            regNo: null,
            regName: '双鸭山市',
            fatherId: '108',
            regMemo: null,
            regType: null,
            regTypeName: null,
            districtNo: null,
            postNo: '',
            validState: null,
            remark: null,
            lastOperator: null,
            lastUpdatetime: null,
            parentName: null,
            children: []
          },
          {
            tenancyId: null,
            id: null,
            regCode: '10806',
            regNo: null,
            regName: '大庆市',
            fatherId: '108',
            regMemo: null,
            regType: null,
            regTypeName: null,
            districtNo: null,
            postNo: '',
            validState: null,
            remark: null,
            lastOperator: null,
            lastUpdatetime: null,
            parentName: null,
            children: []
          },
          {
            tenancyId: null,
            id: null,
            regCode: '10807',
            regNo: null,
            regName: '伊春市',
            fatherId: '108',
            regMemo: null,
            regType: null,
            regTypeName: null,
            districtNo: null,
            postNo: '',
            validState: null,
            remark: null,
            lastOperator: null,
            lastUpdatetime: null,
            parentName: null,
            children: []
          },
          {
            tenancyId: null,
            id: null,
            regCode: '10808',
            regNo: null,
            regName: '佳木斯市',
            fatherId: '108',
            regMemo: null,
            regType: null,
            regTypeName: null,
            districtNo: null,
            postNo: '',
            validState: null,
            remark: null,
            lastOperator: null,
            lastUpdatetime: null,
            parentName: null,
            children: []
          },
          {
            tenancyId: null,
            id: null,
            regCode: '10809',
            regNo: null,
            regName: '七台河市',
            fatherId: '108',
            regMemo: null,
            regType: null,
            regTypeName: null,
            districtNo: null,
            postNo: '',
            validState: null,
            remark: null,
            lastOperator: null,
            lastUpdatetime: null,
            parentName: null,
            children: []
          },
          {
            tenancyId: null,
            id: null,
            regCode: '10813',
            regNo: null,
            regName: '大兴安岭地区',
            fatherId: '108',
            regMemo: null,
            regType: null,
            regTypeName: null,
            districtNo: null,
            postNo: '',
            validState: null,
            remark: null,
            lastOperator: null,
            lastUpdatetime: null,
            parentName: null,
            children: []
          },
          {
            tenancyId: null,
            id: null,
            regCode: '10901',
            regNo: null,
            regName: '上海市市辖区',
            fatherId: '109',
            regMemo: null,
            regType: null,
            regTypeName: null,
            districtNo: null,
            postNo: '',
            validState: null,
            remark: null,
            lastOperator: null,
            lastUpdatetime: null,
            parentName: null,
            children: []
          },
          {
            tenancyId: null,
            id: null,
            regCode: '11001',
            regNo: null,
            regName: '南京市',
            fatherId: '110',
            regMemo: null,
            regType: null,
            regTypeName: null,
            districtNo: null,
            postNo: '',
            validState: null,
            remark: null,
            lastOperator: null,
            lastUpdatetime: null,
            parentName: null,
            children: []
          },
          {
            tenancyId: null,
            id: null,
            regCode: '11002',
            regNo: null,
            regName: '无锡市',
            fatherId: '110',
            regMemo: null,
            regType: null,
            regTypeName: null,
            districtNo: null,
            postNo: '',
            validState: null,
            remark: null,
            lastOperator: null,
            lastUpdatetime: null,
            parentName: null,
            children: []
          },
          {
            tenancyId: null,
            id: null,
            regCode: '11003',
            regNo: null,
            regName: '徐州市',
            fatherId: '110',
            regMemo: null,
            regType: null,
            regTypeName: null,
            districtNo: null,
            postNo: '',
            validState: null,
            remark: null,
            lastOperator: null,
            lastUpdatetime: null,
            parentName: null,
            children: []
          },
          {
            tenancyId: null,
            id: null,
            regCode: '11004',
            regNo: null,
            regName: '常州市',
            fatherId: '110',
            regMemo: null,
            regType: null,
            regTypeName: null,
            districtNo: null,
            postNo: '',
            validState: null,
            remark: null,
            lastOperator: null,
            lastUpdatetime: null,
            parentName: null,
            children: []
          },
          {
            tenancyId: null,
            id: null,
            regCode: '11005',
            regNo: null,
            regName: '苏州市',
            fatherId: '110',
            regMemo: null,
            regType: null,
            regTypeName: null,
            districtNo: null,
            postNo: '',
            validState: null,
            remark: null,
            lastOperator: null,
            lastUpdatetime: null,
            parentName: null,
            children: []
          },
          {
            tenancyId: null,
            id: null,
            regCode: '11006',
            regNo: null,
            regName: '南通市',
            fatherId: '110',
            regMemo: null,
            regType: null,
            regTypeName: null,
            districtNo: null,
            postNo: '',
            validState: null,
            remark: null,
            lastOperator: null,
            lastUpdatetime: null,
            parentName: null,
            children: []
          },
          {
            tenancyId: null,
            id: null,
            regCode: '11007',
            regNo: null,
            regName: '连云港市',
            fatherId: '110',
            regMemo: null,
            regType: null,
            regTypeName: null,
            districtNo: null,
            postNo: '',
            validState: null,
            remark: null,
            lastOperator: null,
            lastUpdatetime: null,
            parentName: null,
            children: []
          },
          {
            tenancyId: null,
            id: null,
            regCode: '11008',
            regNo: null,
            regName: '淮安市',
            fatherId: '110',
            regMemo: null,
            regType: null,
            regTypeName: null,
            districtNo: null,
            postNo: '',
            validState: null,
            remark: null,
            lastOperator: null,
            lastUpdatetime: null,
            parentName: null,
            children: []
          },
          {
            tenancyId: null,
            id: null,
            regCode: '11009',
            regNo: null,
            regName: '盐城市',
            fatherId: '110',
            regMemo: null,
            regType: null,
            regTypeName: null,
            districtNo: null,
            postNo: '',
            validState: null,
            remark: null,
            lastOperator: null,
            lastUpdatetime: null,
            parentName: null,
            children: []
          },
          {
            tenancyId: null,
            id: null,
            regCode: '11010',
            regNo: null,
            regName: '扬州市',
            fatherId: '110',
            regMemo: null,
            regType: null,
            regTypeName: null,
            districtNo: null,
            postNo: '',
            validState: null,
            remark: null,
            lastOperator: null,
            lastUpdatetime: null,
            parentName: null,
            children: []
          },
          {
            tenancyId: null,
            id: null,
            regCode: '11011',
            regNo: null,
            regName: '镇江市',
            fatherId: '110',
            regMemo: null,
            regType: null,
            regTypeName: null,
            districtNo: null,
            postNo: '',
            validState: null,
            remark: null,
            lastOperator: null,
            lastUpdatetime: null,
            parentName: null,
            children: []
          },
          {
            tenancyId: null,
            id: null,
            regCode: '11012',
            regNo: null,
            regName: '泰州市',
            fatherId: '110',
            regMemo: null,
            regType: null,
            regTypeName: null,
            districtNo: null,
            postNo: '',
            validState: null,
            remark: null,
            lastOperator: null,
            lastUpdatetime: null,
            parentName: null,
            children: []
          },
          {
            tenancyId: null,
            id: null,
            regCode: '11013',
            regNo: null,
            regName: '宿迁市',
            fatherId: '110',
            regMemo: null,
            regType: null,
            regTypeName: null,
            districtNo: null,
            postNo: '',
            validState: null,
            remark: null,
            lastOperator: null,
            lastUpdatetime: null,
            parentName: null,
            children: []
          },
          {
            tenancyId: null,
            id: null,
            regCode: '11101',
            regNo: null,
            regName: '杭州市',
            fatherId: '111',
            regMemo: null,
            regType: null,
            regTypeName: null,
            districtNo: null,
            postNo: '',
            validState: null,
            remark: null,
            lastOperator: null,
            lastUpdatetime: null,
            parentName: null,
            children: []
          },
          {
            tenancyId: null,
            id: null,
            regCode: '11102',
            regNo: null,
            regName: '宁波市',
            fatherId: '111',
            regMemo: null,
            regType: null,
            regTypeName: null,
            districtNo: null,
            postNo: '',
            validState: null,
            remark: null,
            lastOperator: null,
            lastUpdatetime: null,
            parentName: null,
            children: []
          },
          {
            tenancyId: null,
            id: null,
            regCode: '11103',
            regNo: null,
            regName: '温州市',
            fatherId: '111',
            regMemo: null,
            regType: null,
            regTypeName: null,
            districtNo: null,
            postNo: '',
            validState: null,
            remark: null,
            lastOperator: null,
            lastUpdatetime: null,
            parentName: null,
            children: []
          },
          {
            tenancyId: null,
            id: null,
            regCode: '11104',
            regNo: null,
            regName: '嘉兴市',
            fatherId: '111',
            regMemo: null,
            regType: null,
            regTypeName: null,
            districtNo: null,
            postNo: '',
            validState: null,
            remark: null,
            lastOperator: null,
            lastUpdatetime: null,
            parentName: null,
            children: []
          },
          {
            tenancyId: null,
            id: null,
            regCode: '11106',
            regNo: null,
            regName: '绍兴市',
            fatherId: '111',
            regMemo: null,
            regType: null,
            regTypeName: null,
            districtNo: null,
            postNo: '',
            validState: null,
            remark: null,
            lastOperator: null,
            lastUpdatetime: null,
            parentName: null,
            children: []
          },
          {
            tenancyId: null,
            id: null,
            regCode: '11107',
            regNo: null,
            regName: '金华市',
            fatherId: '111',
            regMemo: null,
            regType: null,
            regTypeName: null,
            districtNo: null,
            postNo: '',
            validState: null,
            remark: null,
            lastOperator: null,
            lastUpdatetime: null,
            parentName: null,
            children: []
          },
          {
            tenancyId: null,
            id: null,
            regCode: '11108',
            regNo: null,
            regName: '衢州市',
            fatherId: '111',
            regMemo: null,
            regType: null,
            regTypeName: null,
            districtNo: null,
            postNo: '',
            validState: null,
            remark: null,
            lastOperator: null,
            lastUpdatetime: null,
            parentName: null,
            children: []
          },
          {
            tenancyId: null,
            id: null,
            regCode: '11109',
            regNo: null,
            regName: '舟山市',
            fatherId: '111',
            regMemo: null,
            regType: null,
            regTypeName: null,
            districtNo: null,
            postNo: '',
            validState: null,
            remark: null,
            lastOperator: null,
            lastUpdatetime: null,
            parentName: null,
            children: []
          },
          {
            tenancyId: null,
            id: null,
            regCode: '11110',
            regNo: null,
            regName: '台州市',
            fatherId: '111',
            regMemo: null,
            regType: null,
            regTypeName: null,
            districtNo: null,
            postNo: '',
            validState: null,
            remark: null,
            lastOperator: null,
            lastUpdatetime: null,
            parentName: null,
            children: []
          },
          {
            tenancyId: null,
            id: null,
            regCode: '11111',
            regNo: null,
            regName: '丽水市',
            fatherId: '111',
            regMemo: null,
            regType: null,
            regTypeName: null,
            districtNo: null,
            postNo: '',
            validState: null,
            remark: null,
            lastOperator: null,
            lastUpdatetime: null,
            parentName: null,
            children: []
          },
          {
            tenancyId: null,
            id: null,
            regCode: '11201',
            regNo: null,
            regName: '合肥市',
            fatherId: '112',
            regMemo: null,
            regType: null,
            regTypeName: null,
            districtNo: null,
            postNo: '',
            validState: null,
            remark: null,
            lastOperator: null,
            lastUpdatetime: null,
            parentName: null,
            children: []
          },
          {
            tenancyId: null,
            id: null,
            regCode: '11204',
            regNo: null,
            regName: '淮南市',
            fatherId: '112',
            regMemo: null,
            regType: null,
            regTypeName: null,
            districtNo: null,
            postNo: '',
            validState: null,
            remark: null,
            lastOperator: null,
            lastUpdatetime: null,
            parentName: null,
            children: []
          },
          {
            tenancyId: null,
            id: null,
            regCode: '11205',
            regNo: null,
            regName: '马鞍山市',
            fatherId: '112',
            regMemo: null,
            regType: null,
            regTypeName: null,
            districtNo: null,
            postNo: '',
            validState: null,
            remark: null,
            lastOperator: null,
            lastUpdatetime: null,
            parentName: null,
            children: []
          },
          {
            tenancyId: null,
            id: null,
            regCode: '11206',
            regNo: null,
            regName: '淮北市',
            fatherId: '112',
            regMemo: null,
            regType: null,
            regTypeName: null,
            districtNo: null,
            postNo: '',
            validState: null,
            remark: null,
            lastOperator: null,
            lastUpdatetime: null,
            parentName: null,
            children: []
          },
          {
            tenancyId: null,
            id: null,
            regCode: '11207',
            regNo: null,
            regName: '铜陵市',
            fatherId: '112',
            regMemo: null,
            regType: null,
            regTypeName: null,
            districtNo: null,
            postNo: '',
            validState: null,
            remark: null,
            lastOperator: null,
            lastUpdatetime: null,
            parentName: null,
            children: []
          },
          {
            tenancyId: null,
            id: null,
            regCode: '11208',
            regNo: null,
            regName: '安庆市',
            fatherId: '112',
            regMemo: null,
            regType: null,
            regTypeName: null,
            districtNo: null,
            postNo: '',
            validState: null,
            remark: null,
            lastOperator: null,
            lastUpdatetime: null,
            parentName: null,
            children: []
          },
          {
            tenancyId: null,
            id: null,
            regCode: '11209',
            regNo: null,
            regName: '黄山市',
            fatherId: '112',
            regMemo: null,
            regType: null,
            regTypeName: null,
            districtNo: null,
            postNo: '',
            validState: null,
            remark: null,
            lastOperator: null,
            lastUpdatetime: null,
            parentName: null,
            children: []
          },
          {
            tenancyId: null,
            id: null,
            regCode: '11212',
            regNo: null,
            regName: '宿州市',
            fatherId: '112',
            regMemo: null,
            regType: null,
            regTypeName: null,
            districtNo: null,
            postNo: '',
            validState: null,
            remark: null,
            lastOperator: null,
            lastUpdatetime: null,
            parentName: null,
            children: []
          },
          {
            tenancyId: null,
            id: null,
            regCode: '11213',
            regNo: null,
            regName: '巢湖市',
            fatherId: '112',
            regMemo: null,
            regType: null,
            regTypeName: null,
            districtNo: null,
            postNo: '',
            validState: null,
            remark: null,
            lastOperator: null,
            lastUpdatetime: null,
            parentName: null,
            children: []
          },
          {
            tenancyId: null,
            id: null,
            regCode: '11214',
            regNo: null,
            regName: '六安市',
            fatherId: '112',
            regMemo: null,
            regType: null,
            regTypeName: null,
            districtNo: null,
            postNo: '',
            validState: null,
            remark: null,
            lastOperator: null,
            lastUpdatetime: null,
            parentName: null,
            children: []
          },
          {
            tenancyId: null,
            id: null,
            regCode: '11215',
            regNo: null,
            regName: '亳州市',
            fatherId: '112',
            regMemo: null,
            regType: null,
            regTypeName: null,
            districtNo: null,
            postNo: '',
            validState: null,
            remark: null,
            lastOperator: null,
            lastUpdatetime: null,
            parentName: null,
            children: []
          },
          {
            tenancyId: null,
            id: null,
            regCode: '11216',
            regNo: null,
            regName: '池州市',
            fatherId: '112',
            regMemo: null,
            regType: null,
            regTypeName: null,
            districtNo: null,
            postNo: '',
            validState: null,
            remark: null,
            lastOperator: null,
            lastUpdatetime: null,
            parentName: null,
            children: []
          },
          {
            tenancyId: null,
            id: null,
            regCode: '11217',
            regNo: null,
            regName: '宣城市',
            fatherId: '112',
            regMemo: null,
            regType: null,
            regTypeName: null,
            districtNo: null,
            postNo: '',
            validState: null,
            remark: null,
            lastOperator: null,
            lastUpdatetime: null,
            parentName: null,
            children: []
          },
          {
            tenancyId: null,
            id: null,
            regCode: '11301',
            regNo: null,
            regName: '福州市',
            fatherId: '113',
            regMemo: null,
            regType: null,
            regTypeName: null,
            districtNo: null,
            postNo: '',
            validState: null,
            remark: null,
            lastOperator: null,
            lastUpdatetime: null,
            parentName: null,
            children: []
          },
          {
            tenancyId: null,
            id: null,
            regCode: '11302',
            regNo: null,
            regName: '厦门市',
            fatherId: '113',
            regMemo: null,
            regType: null,
            regTypeName: null,
            districtNo: null,
            postNo: '',
            validState: null,
            remark: null,
            lastOperator: null,
            lastUpdatetime: null,
            parentName: null,
            children: []
          },
          {
            tenancyId: null,
            id: null,
            regCode: '11303',
            regNo: null,
            regName: '莆田市',
            fatherId: '113',
            regMemo: null,
            regType: null,
            regTypeName: null,
            districtNo: null,
            postNo: '',
            validState: null,
            remark: null,
            lastOperator: null,
            lastUpdatetime: null,
            parentName: null,
            children: []
          },
          {
            tenancyId: null,
            id: null,
            regCode: '11304',
            regNo: null,
            regName: '三明市',
            fatherId: '113',
            regMemo: null,
            regType: null,
            regTypeName: null,
            districtNo: null,
            postNo: '',
            validState: null,
            remark: null,
            lastOperator: null,
            lastUpdatetime: null,
            parentName: null,
            children: []
          },
          {
            tenancyId: null,
            id: null,
            regCode: '11305',
            regNo: null,
            regName: '泉州市',
            fatherId: '113',
            regMemo: null,
            regType: null,
            regTypeName: null,
            districtNo: null,
            postNo: '',
            validState: null,
            remark: null,
            lastOperator: null,
            lastUpdatetime: null,
            parentName: null,
            children: []
          },
          {
            tenancyId: null,
            id: null,
            regCode: '11306',
            regNo: null,
            regName: '漳州市',
            fatherId: '113',
            regMemo: null,
            regType: null,
            regTypeName: null,
            districtNo: null,
            postNo: '',
            validState: null,
            remark: null,
            lastOperator: null,
            lastUpdatetime: null,
            parentName: null,
            children: []
          },
          {
            tenancyId: null,
            id: null,
            regCode: '11307',
            regNo: null,
            regName: '南平市',
            fatherId: '113',
            regMemo: null,
            regType: null,
            regTypeName: null,
            districtNo: null,
            postNo: '',
            validState: null,
            remark: null,
            lastOperator: null,
            lastUpdatetime: null,
            parentName: null,
            children: []
          },
          {
            tenancyId: null,
            id: null,
            regCode: '11308',
            regNo: null,
            regName: '龙岩市',
            fatherId: '113',
            regMemo: null,
            regType: null,
            regTypeName: null,
            districtNo: null,
            postNo: '',
            validState: null,
            remark: null,
            lastOperator: null,
            lastUpdatetime: null,
            parentName: null,
            children: []
          },
          {
            tenancyId: null,
            id: null,
            regCode: '11309',
            regNo: null,
            regName: '宁德市',
            fatherId: '113',
            regMemo: null,
            regType: null,
            regTypeName: null,
            districtNo: null,
            postNo: '',
            validState: null,
            remark: null,
            lastOperator: null,
            lastUpdatetime: null,
            parentName: null,
            children: []
          },
          {
            tenancyId: null,
            id: null,
            regCode: '11401',
            regNo: null,
            regName: '南昌市',
            fatherId: '114',
            regMemo: null,
            regType: null,
            regTypeName: null,
            districtNo: null,
            postNo: '',
            validState: null,
            remark: null,
            lastOperator: null,
            lastUpdatetime: null,
            parentName: null,
            children: []
          },
          {
            tenancyId: null,
            id: null,
            regCode: '11402',
            regNo: null,
            regName: '景德镇市',
            fatherId: '114',
            regMemo: null,
            regType: null,
            regTypeName: null,
            districtNo: null,
            postNo: '',
            validState: null,
            remark: null,
            lastOperator: null,
            lastUpdatetime: null,
            parentName: null,
            children: []
          },
          {
            tenancyId: null,
            id: null,
            regCode: '11403',
            regNo: null,
            regName: '萍乡市',
            fatherId: '114',
            regMemo: null,
            regType: null,
            regTypeName: null,
            districtNo: null,
            postNo: '',
            validState: null,
            remark: null,
            lastOperator: null,
            lastUpdatetime: null,
            parentName: null,
            children: []
          },
          {
            tenancyId: null,
            id: null,
            regCode: '11404',
            regNo: null,
            regName: '九江市',
            fatherId: '114',
            regMemo: null,
            regType: null,
            regTypeName: null,
            districtNo: null,
            postNo: '',
            validState: null,
            remark: null,
            lastOperator: null,
            lastUpdatetime: null,
            parentName: null,
            children: []
          },
          {
            tenancyId: null,
            id: null,
            regCode: '11405',
            regNo: null,
            regName: '新余市',
            fatherId: '114',
            regMemo: null,
            regType: null,
            regTypeName: null,
            districtNo: null,
            postNo: '',
            validState: null,
            remark: null,
            lastOperator: null,
            lastUpdatetime: null,
            parentName: null,
            children: []
          },
          {
            tenancyId: null,
            id: null,
            regCode: '11406',
            regNo: null,
            regName: '鹰潭市',
            fatherId: '114',
            regMemo: null,
            regType: null,
            regTypeName: null,
            districtNo: null,
            postNo: '',
            validState: null,
            remark: null,
            lastOperator: null,
            lastUpdatetime: null,
            parentName: null,
            children: []
          },
          {
            tenancyId: null,
            id: null,
            regCode: '11407',
            regNo: null,
            regName: '赣州市',
            fatherId: '114',
            regMemo: null,
            regType: null,
            regTypeName: null,
            districtNo: null,
            postNo: '',
            validState: null,
            remark: null,
            lastOperator: null,
            lastUpdatetime: null,
            parentName: null,
            children: []
          },
          {
            tenancyId: null,
            id: null,
            regCode: '11408',
            regNo: null,
            regName: '吉安市',
            fatherId: '114',
            regMemo: null,
            regType: null,
            regTypeName: null,
            districtNo: null,
            postNo: '',
            validState: null,
            remark: null,
            lastOperator: null,
            lastUpdatetime: null,
            parentName: null,
            children: []
          },
          {
            tenancyId: null,
            id: null,
            regCode: '11409',
            regNo: null,
            regName: '宜春市',
            fatherId: '114',
            regMemo: null,
            regType: null,
            regTypeName: null,
            districtNo: null,
            postNo: '',
            validState: null,
            remark: null,
            lastOperator: null,
            lastUpdatetime: null,
            parentName: null,
            children: []
          },
          {
            tenancyId: null,
            id: null,
            regCode: '11410',
            regNo: null,
            regName: '抚州市',
            fatherId: '114',
            regMemo: null,
            regType: null,
            regTypeName: null,
            districtNo: null,
            postNo: '',
            validState: null,
            remark: null,
            lastOperator: null,
            lastUpdatetime: null,
            parentName: null,
            children: []
          },
          {
            tenancyId: null,
            id: null,
            regCode: '11411',
            regNo: null,
            regName: '上饶市',
            fatherId: '114',
            regMemo: null,
            regType: null,
            regTypeName: null,
            districtNo: null,
            postNo: '',
            validState: null,
            remark: null,
            lastOperator: null,
            lastUpdatetime: null,
            parentName: null,
            children: []
          },
          {
            tenancyId: null,
            id: null,
            regCode: '11501',
            regNo: null,
            regName: '济南市',
            fatherId: '115',
            regMemo: null,
            regType: null,
            regTypeName: null,
            districtNo: null,
            postNo: '',
            validState: null,
            remark: null,
            lastOperator: null,
            lastUpdatetime: null,
            parentName: null,
            children: []
          },
          {
            tenancyId: null,
            id: null,
            regCode: '11502',
            regNo: null,
            regName: '青岛市',
            fatherId: '115',
            regMemo: null,
            regType: null,
            regTypeName: null,
            districtNo: null,
            postNo: '',
            validState: null,
            remark: null,
            lastOperator: null,
            lastUpdatetime: null,
            parentName: null,
            children: []
          },
          {
            tenancyId: null,
            id: null,
            regCode: '11503',
            regNo: null,
            regName: '淄博市',
            fatherId: '115',
            regMemo: null,
            regType: null,
            regTypeName: null,
            districtNo: null,
            postNo: '',
            validState: null,
            remark: null,
            lastOperator: null,
            lastUpdatetime: null,
            parentName: null,
            children: []
          },
          {
            tenancyId: null,
            id: null,
            regCode: '11504',
            regNo: null,
            regName: '枣庄市',
            fatherId: '115',
            regMemo: null,
            regType: null,
            regTypeName: null,
            districtNo: null,
            postNo: '',
            validState: null,
            remark: null,
            lastOperator: null,
            lastUpdatetime: null,
            parentName: null,
            children: []
          },
          {
            tenancyId: null,
            id: null,
            regCode: '11505',
            regNo: null,
            regName: '东营市',
            fatherId: '115',
            regMemo: null,
            regType: null,
            regTypeName: null,
            districtNo: null,
            postNo: '',
            validState: null,
            remark: null,
            lastOperator: null,
            lastUpdatetime: null,
            parentName: null,
            children: []
          },
          {
            tenancyId: null,
            id: null,
            regCode: '11506',
            regNo: null,
            regName: '烟台市',
            fatherId: '115',
            regMemo: null,
            regType: null,
            regTypeName: null,
            districtNo: null,
            postNo: '',
            validState: null,
            remark: null,
            lastOperator: null,
            lastUpdatetime: null,
            parentName: null,
            children: []
          },
          {
            tenancyId: null,
            id: null,
            regCode: '11507',
            regNo: null,
            regName: '潍坊市',
            fatherId: '115',
            regMemo: null,
            regType: null,
            regTypeName: null,
            districtNo: null,
            postNo: '',
            validState: null,
            remark: null,
            lastOperator: null,
            lastUpdatetime: null,
            parentName: null,
            children: []
          },
          {
            tenancyId: null,
            id: null,
            regCode: '11508',
            regNo: null,
            regName: '济宁市',
            fatherId: '115',
            regMemo: null,
            regType: null,
            regTypeName: null,
            districtNo: null,
            postNo: '',
            validState: null,
            remark: null,
            lastOperator: null,
            lastUpdatetime: null,
            parentName: null,
            children: []
          },
          {
            tenancyId: null,
            id: null,
            regCode: '11509',
            regNo: null,
            regName: '泰安市',
            fatherId: '115',
            regMemo: null,
            regType: null,
            regTypeName: null,
            districtNo: null,
            postNo: '',
            validState: null,
            remark: null,
            lastOperator: null,
            lastUpdatetime: null,
            parentName: null,
            children: []
          },
          {
            tenancyId: null,
            id: null,
            regCode: '11510',
            regNo: null,
            regName: '威海市',
            fatherId: '115',
            regMemo: null,
            regType: null,
            regTypeName: null,
            districtNo: null,
            postNo: '',
            validState: null,
            remark: null,
            lastOperator: null,
            lastUpdatetime: null,
            parentName: null,
            children: []
          },
          {
            tenancyId: null,
            id: null,
            regCode: '11511',
            regNo: null,
            regName: '日照市',
            fatherId: '115',
            regMemo: null,
            regType: null,
            regTypeName: null,
            districtNo: null,
            postNo: '',
            validState: null,
            remark: null,
            lastOperator: null,
            lastUpdatetime: null,
            parentName: null,
            children: []
          },
          {
            tenancyId: null,
            id: null,
            regCode: '11513',
            regNo: null,
            regName: '临沂市',
            fatherId: '115',
            regMemo: null,
            regType: null,
            regTypeName: null,
            districtNo: null,
            postNo: '',
            validState: null,
            remark: null,
            lastOperator: null,
            lastUpdatetime: null,
            parentName: null,
            children: []
          },
          {
            tenancyId: null,
            id: null,
            regCode: '11514',
            regNo: null,
            regName: '德州市',
            fatherId: '115',
            regMemo: null,
            regType: null,
            regTypeName: null,
            districtNo: null,
            postNo: '',
            validState: null,
            remark: null,
            lastOperator: null,
            lastUpdatetime: null,
            parentName: null,
            children: []
          },
          {
            tenancyId: null,
            id: null,
            regCode: '11515',
            regNo: null,
            regName: '聊城市',
            fatherId: '115',
            regMemo: null,
            regType: null,
            regTypeName: null,
            districtNo: null,
            postNo: '',
            validState: null,
            remark: null,
            lastOperator: null,
            lastUpdatetime: null,
            parentName: null,
            children: []
          },
          {
            tenancyId: null,
            id: null,
            regCode: '11516',
            regNo: null,
            regName: '滨州市',
            fatherId: '115',
            regMemo: null,
            regType: null,
            regTypeName: null,
            districtNo: null,
            postNo: '',
            validState: null,
            remark: null,
            lastOperator: null,
            lastUpdatetime: null,
            parentName: null,
            children: []
          },
          {
            tenancyId: null,
            id: null,
            regCode: '11517',
            regNo: null,
            regName: '菏泽市',
            fatherId: '115',
            regMemo: null,
            regType: null,
            regTypeName: null,
            districtNo: null,
            postNo: '',
            validState: null,
            remark: null,
            lastOperator: null,
            lastUpdatetime: null,
            parentName: null,
            children: []
          },
          {
            tenancyId: null,
            id: null,
            regCode: '11601',
            regNo: null,
            regName: '郑州市',
            fatherId: '116',
            regMemo: null,
            regType: null,
            regTypeName: null,
            districtNo: null,
            postNo: '',
            validState: null,
            remark: null,
            lastOperator: null,
            lastUpdatetime: null,
            parentName: null,
            children: []
          },
          {
            tenancyId: null,
            id: null,
            regCode: '11602',
            regNo: null,
            regName: '开封市',
            fatherId: '116',
            regMemo: null,
            regType: null,
            regTypeName: null,
            districtNo: null,
            postNo: '',
            validState: null,
            remark: null,
            lastOperator: null,
            lastUpdatetime: null,
            parentName: null,
            children: []
          },
          {
            tenancyId: null,
            id: null,
            regCode: '11603',
            regNo: null,
            regName: '洛阳市',
            fatherId: '116',
            regMemo: null,
            regType: null,
            regTypeName: null,
            districtNo: null,
            postNo: '',
            validState: null,
            remark: null,
            lastOperator: null,
            lastUpdatetime: null,
            parentName: null,
            children: []
          },
          {
            tenancyId: null,
            id: null,
            regCode: '11604',
            regNo: null,
            regName: '平顶山市',
            fatherId: '116',
            regMemo: null,
            regType: null,
            regTypeName: null,
            districtNo: null,
            postNo: '',
            validState: null,
            remark: null,
            lastOperator: null,
            lastUpdatetime: null,
            parentName: null,
            children: []
          },
          {
            tenancyId: null,
            id: null,
            regCode: '11605',
            regNo: null,
            regName: '安阳市',
            fatherId: '116',
            regMemo: null,
            regType: null,
            regTypeName: null,
            districtNo: null,
            postNo: '',
            validState: null,
            remark: null,
            lastOperator: null,
            lastUpdatetime: null,
            parentName: null,
            children: []
          },
          {
            tenancyId: null,
            id: null,
            regCode: '11606',
            regNo: null,
            regName: '鹤壁市',
            fatherId: '116',
            regMemo: null,
            regType: null,
            regTypeName: null,
            districtNo: null,
            postNo: '',
            validState: null,
            remark: null,
            lastOperator: null,
            lastUpdatetime: null,
            parentName: null,
            children: []
          },
          {
            tenancyId: null,
            id: null,
            regCode: '11607',
            regNo: null,
            regName: '新乡市',
            fatherId: '116',
            regMemo: null,
            regType: null,
            regTypeName: null,
            districtNo: null,
            postNo: '',
            validState: null,
            remark: null,
            lastOperator: null,
            lastUpdatetime: null,
            parentName: null,
            children: []
          },
          {
            tenancyId: null,
            id: null,
            regCode: '11608',
            regNo: null,
            regName: '焦作市',
            fatherId: '116',
            regMemo: null,
            regType: null,
            regTypeName: null,
            districtNo: null,
            postNo: '',
            validState: null,
            remark: null,
            lastOperator: null,
            lastUpdatetime: null,
            parentName: null,
            children: []
          },
          {
            tenancyId: null,
            id: null,
            regCode: '11609',
            regNo: null,
            regName: '濮阳市',
            fatherId: '116',
            regMemo: null,
            regType: null,
            regTypeName: null,
            districtNo: null,
            postNo: '',
            validState: null,
            remark: null,
            lastOperator: null,
            lastUpdatetime: null,
            parentName: null,
            children: []
          },
          {
            tenancyId: null,
            id: null,
            regCode: '11610',
            regNo: null,
            regName: '许昌市',
            fatherId: '116',
            regMemo: null,
            regType: null,
            regTypeName: null,
            districtNo: null,
            postNo: '',
            validState: null,
            remark: null,
            lastOperator: null,
            lastUpdatetime: null,
            parentName: null,
            children: []
          },
          {
            tenancyId: null,
            id: null,
            regCode: '11611',
            regNo: null,
            regName: '漯河市',
            fatherId: '116',
            regMemo: null,
            regType: null,
            regTypeName: null,
            districtNo: null,
            postNo: '',
            validState: null,
            remark: null,
            lastOperator: null,
            lastUpdatetime: null,
            parentName: null,
            children: []
          },
          {
            tenancyId: null,
            id: null,
            regCode: '11613',
            regNo: null,
            regName: '南阳市',
            fatherId: '116',
            regMemo: null,
            regType: null,
            regTypeName: null,
            districtNo: null,
            postNo: '',
            validState: null,
            remark: null,
            lastOperator: null,
            lastUpdatetime: null,
            parentName: null,
            children: []
          },
          {
            tenancyId: null,
            id: null,
            regCode: '11614',
            regNo: null,
            regName: '商丘市',
            fatherId: '116',
            regMemo: null,
            regType: null,
            regTypeName: null,
            districtNo: null,
            postNo: '',
            validState: null,
            remark: null,
            lastOperator: null,
            lastUpdatetime: null,
            parentName: null,
            children: []
          },
          {
            tenancyId: null,
            id: null,
            regCode: '11615',
            regNo: null,
            regName: '信阳市',
            fatherId: '116',
            regMemo: null,
            regType: null,
            regTypeName: null,
            districtNo: null,
            postNo: '',
            validState: null,
            remark: null,
            lastOperator: null,
            lastUpdatetime: null,
            parentName: null,
            children: []
          },
          {
            tenancyId: null,
            id: null,
            regCode: '11616',
            regNo: null,
            regName: '周口市',
            fatherId: '116',
            regMemo: null,
            regType: null,
            regTypeName: null,
            districtNo: null,
            postNo: '',
            validState: null,
            remark: null,
            lastOperator: null,
            lastUpdatetime: null,
            parentName: null,
            children: []
          },
          {
            tenancyId: null,
            id: null,
            regCode: '11617',
            regNo: null,
            regName: '驻马店市',
            fatherId: '116',
            regMemo: null,
            regType: null,
            regTypeName: null,
            districtNo: null,
            postNo: '',
            validState: null,
            remark: null,
            lastOperator: null,
            lastUpdatetime: null,
            parentName: null,
            children: []
          },
          {
            tenancyId: null,
            id: null,
            regCode: '11701',
            regNo: null,
            regName: '武汉市',
            fatherId: '117',
            regMemo: null,
            regType: null,
            regTypeName: null,
            districtNo: null,
            postNo: '',
            validState: null,
            remark: null,
            lastOperator: null,
            lastUpdatetime: null,
            parentName: null,
            children: []
          },
          {
            tenancyId: null,
            id: null,
            regCode: '11702',
            regNo: null,
            regName: '黄石市',
            fatherId: '117',
            regMemo: null,
            regType: null,
            regTypeName: null,
            districtNo: null,
            postNo: '',
            validState: null,
            remark: null,
            lastOperator: null,
            lastUpdatetime: null,
            parentName: null,
            children: []
          },
          {
            tenancyId: null,
            id: null,
            regCode: '11703',
            regNo: null,
            regName: '十堰市',
            fatherId: '117',
            regMemo: null,
            regType: null,
            regTypeName: null,
            districtNo: null,
            postNo: '',
            validState: null,
            remark: null,
            lastOperator: null,
            lastUpdatetime: null,
            parentName: null,
            children: []
          },
          {
            tenancyId: null,
            id: null,
            regCode: '11704',
            regNo: null,
            regName: '宜昌市',
            fatherId: '117',
            regMemo: null,
            regType: null,
            regTypeName: null,
            districtNo: null,
            postNo: '',
            validState: null,
            remark: null,
            lastOperator: null,
            lastUpdatetime: null,
            parentName: null,
            children: []
          },
          {
            tenancyId: null,
            id: null,
            regCode: '11705',
            regNo: null,
            regName: '襄樊市',
            fatherId: '117',
            regMemo: null,
            regType: null,
            regTypeName: null,
            districtNo: null,
            postNo: '',
            validState: null,
            remark: null,
            lastOperator: null,
            lastUpdatetime: null,
            parentName: null,
            children: []
          },
          {
            tenancyId: null,
            id: null,
            regCode: '11706',
            regNo: null,
            regName: '鄂州市',
            fatherId: '117',
            regMemo: null,
            regType: null,
            regTypeName: null,
            districtNo: null,
            postNo: '',
            validState: null,
            remark: null,
            lastOperator: null,
            lastUpdatetime: null,
            parentName: null,
            children: []
          },
          {
            tenancyId: null,
            id: null,
            regCode: '11707',
            regNo: null,
            regName: '荆门市',
            fatherId: '117',
            regMemo: null,
            regType: null,
            regTypeName: null,
            districtNo: null,
            postNo: '',
            validState: null,
            remark: null,
            lastOperator: null,
            lastUpdatetime: null,
            parentName: null,
            children: []
          },
          {
            tenancyId: null,
            id: null,
            regCode: '11708',
            regNo: null,
            regName: '孝感市',
            fatherId: '117',
            regMemo: null,
            regType: null,
            regTypeName: null,
            districtNo: null,
            postNo: '',
            validState: null,
            remark: null,
            lastOperator: null,
            lastUpdatetime: null,
            parentName: null,
            children: []
          },
          {
            tenancyId: null,
            id: null,
            regCode: '11709',
            regNo: null,
            regName: '荆州市',
            fatherId: '117',
            regMemo: null,
            regType: null,
            regTypeName: null,
            districtNo: null,
            postNo: '',
            validState: null,
            remark: null,
            lastOperator: null,
            lastUpdatetime: null,
            parentName: null,
            children: []
          },
          {
            tenancyId: null,
            id: null,
            regCode: '11710',
            regNo: null,
            regName: '黄冈市',
            fatherId: '117',
            regMemo: null,
            regType: null,
            regTypeName: null,
            districtNo: null,
            postNo: '',
            validState: null,
            remark: null,
            lastOperator: null,
            lastUpdatetime: null,
            parentName: null,
            children: []
          },
          {
            tenancyId: null,
            id: null,
            regCode: '11711',
            regNo: null,
            regName: '咸宁市',
            fatherId: '117',
            regMemo: null,
            regType: null,
            regTypeName: null,
            districtNo: null,
            postNo: '',
            validState: null,
            remark: null,
            lastOperator: null,
            lastUpdatetime: null,
            parentName: null,
            children: []
          },
          {
            tenancyId: null,
            id: null,
            regCode: '11712',
            regNo: null,
            regName: '随州市',
            fatherId: '117',
            regMemo: null,
            regType: null,
            regTypeName: null,
            districtNo: null,
            postNo: '',
            validState: null,
            remark: null,
            lastOperator: null,
            lastUpdatetime: null,
            parentName: null,
            children: []
          },
          {
            tenancyId: null,
            id: null,
            regCode: '11713',
            regNo: null,
            regName: '恩施土家族苗族自治州',
            fatherId: '117',
            regMemo: null,
            regType: null,
            regTypeName: null,
            districtNo: null,
            postNo: '',
            validState: null,
            remark: null,
            lastOperator: null,
            lastUpdatetime: null,
            parentName: null,
            children: []
          },
          {
            tenancyId: null,
            id: null,
            regCode: '11714',
            regNo: null,
            regName: '省直辖行政单位',
            fatherId: '117',
            regMemo: null,
            regType: null,
            regTypeName: null,
            districtNo: null,
            postNo: '',
            validState: null,
            remark: null,
            lastOperator: null,
            lastUpdatetime: null,
            parentName: null,
            children: []
          },
          {
            tenancyId: null,
            id: null,
            regCode: '11802',
            regNo: null,
            regName: '株洲市',
            fatherId: '118',
            regMemo: null,
            regType: null,
            regTypeName: null,
            districtNo: null,
            postNo: '',
            validState: null,
            remark: null,
            lastOperator: null,
            lastUpdatetime: null,
            parentName: null,
            children: []
          },
          {
            tenancyId: null,
            id: null,
            regCode: '11803',
            regNo: null,
            regName: '湘潭市',
            fatherId: '118',
            regMemo: null,
            regType: null,
            regTypeName: null,
            districtNo: null,
            postNo: '',
            validState: null,
            remark: null,
            lastOperator: null,
            lastUpdatetime: null,
            parentName: null,
            children: []
          },
          {
            tenancyId: null,
            id: null,
            regCode: '11804',
            regNo: null,
            regName: '衡阳市',
            fatherId: '118',
            regMemo: null,
            regType: null,
            regTypeName: null,
            districtNo: null,
            postNo: '',
            validState: null,
            remark: null,
            lastOperator: null,
            lastUpdatetime: null,
            parentName: null,
            children: []
          },
          {
            tenancyId: null,
            id: null,
            regCode: '11805',
            regNo: null,
            regName: '邵阳市',
            fatherId: '118',
            regMemo: null,
            regType: null,
            regTypeName: null,
            districtNo: null,
            postNo: '',
            validState: null,
            remark: null,
            lastOperator: null,
            lastUpdatetime: null,
            parentName: null,
            children: []
          },
          {
            tenancyId: null,
            id: null,
            regCode: '11806',
            regNo: null,
            regName: '岳阳市',
            fatherId: '118',
            regMemo: null,
            regType: null,
            regTypeName: null,
            districtNo: null,
            postNo: '',
            validState: null,
            remark: null,
            lastOperator: null,
            lastUpdatetime: null,
            parentName: null,
            children: []
          },
          {
            tenancyId: null,
            id: null,
            regCode: '11808',
            regNo: null,
            regName: '张家界市',
            fatherId: '118',
            regMemo: null,
            regType: null,
            regTypeName: null,
            districtNo: null,
            postNo: '',
            validState: null,
            remark: null,
            lastOperator: null,
            lastUpdatetime: null,
            parentName: null,
            children: []
          },
          {
            tenancyId: null,
            id: null,
            regCode: '11809',
            regNo: null,
            regName: '益阳市',
            fatherId: '118',
            regMemo: null,
            regType: null,
            regTypeName: null,
            districtNo: null,
            postNo: '',
            validState: null,
            remark: null,
            lastOperator: null,
            lastUpdatetime: null,
            parentName: null,
            children: []
          },
          {
            tenancyId: null,
            id: null,
            regCode: '11810',
            regNo: null,
            regName: '郴州市',
            fatherId: '118',
            regMemo: null,
            regType: null,
            regTypeName: null,
            districtNo: null,
            postNo: '',
            validState: null,
            remark: null,
            lastOperator: null,
            lastUpdatetime: null,
            parentName: null,
            children: []
          },
          {
            tenancyId: null,
            id: null,
            regCode: '11811',
            regNo: null,
            regName: '永州市',
            fatherId: '118',
            regMemo: null,
            regType: null,
            regTypeName: null,
            districtNo: null,
            postNo: '',
            validState: null,
            remark: null,
            lastOperator: null,
            lastUpdatetime: null,
            parentName: null,
            children: []
          },
          {
            tenancyId: null,
            id: null,
            regCode: '11812',
            regNo: null,
            regName: '怀化市',
            fatherId: '118',
            regMemo: null,
            regType: null,
            regTypeName: null,
            districtNo: null,
            postNo: '',
            validState: null,
            remark: null,
            lastOperator: null,
            lastUpdatetime: null,
            parentName: null,
            children: []
          },
          {
            tenancyId: null,
            id: null,
            regCode: '11813',
            regNo: null,
            regName: '娄底市',
            fatherId: '118',
            regMemo: null,
            regType: null,
            regTypeName: null,
            districtNo: null,
            postNo: '',
            validState: null,
            remark: null,
            lastOperator: null,
            lastUpdatetime: null,
            parentName: null,
            children: []
          },
          {
            tenancyId: null,
            id: null,
            regCode: '11814',
            regNo: null,
            regName: '湘西土家族苗族自治州',
            fatherId: '118',
            regMemo: null,
            regType: null,
            regTypeName: null,
            districtNo: null,
            postNo: '',
            validState: null,
            remark: null,
            lastOperator: null,
            lastUpdatetime: null,
            parentName: null,
            children: []
          },
          {
            tenancyId: null,
            id: null,
            regCode: '11901',
            regNo: null,
            regName: '广州市',
            fatherId: '119',
            regMemo: null,
            regType: null,
            regTypeName: null,
            districtNo: null,
            postNo: '',
            validState: null,
            remark: null,
            lastOperator: null,
            lastUpdatetime: null,
            parentName: null,
            children: []
          },
          {
            tenancyId: null,
            id: null,
            regCode: '11902',
            regNo: null,
            regName: '韶关市',
            fatherId: '119',
            regMemo: null,
            regType: null,
            regTypeName: null,
            districtNo: null,
            postNo: '',
            validState: null,
            remark: null,
            lastOperator: null,
            lastUpdatetime: null,
            parentName: null,
            children: []
          },
          {
            tenancyId: null,
            id: null,
            regCode: '11903',
            regNo: null,
            regName: '深圳市',
            fatherId: '119',
            regMemo: null,
            regType: null,
            regTypeName: null,
            districtNo: null,
            postNo: '',
            validState: null,
            remark: null,
            lastOperator: null,
            lastUpdatetime: null,
            parentName: null,
            children: []
          },
          {
            tenancyId: null,
            id: null,
            regCode: '11904',
            regNo: null,
            regName: '珠海市',
            fatherId: '119',
            regMemo: null,
            regType: null,
            regTypeName: null,
            districtNo: null,
            postNo: '',
            validState: null,
            remark: null,
            lastOperator: null,
            lastUpdatetime: null,
            parentName: null,
            children: []
          },
          {
            tenancyId: null,
            id: null,
            regCode: '11905',
            regNo: null,
            regName: '汕头市',
            fatherId: '119',
            regMemo: null,
            regType: null,
            regTypeName: null,
            districtNo: null,
            postNo: '',
            validState: null,
            remark: null,
            lastOperator: null,
            lastUpdatetime: null,
            parentName: null,
            children: []
          },
          {
            tenancyId: null,
            id: null,
            regCode: '11907',
            regNo: null,
            regName: '江门市',
            fatherId: '119',
            regMemo: null,
            regType: null,
            regTypeName: null,
            districtNo: null,
            postNo: '',
            validState: null,
            remark: null,
            lastOperator: null,
            lastUpdatetime: null,
            parentName: null,
            children: []
          },
          {
            tenancyId: null,
            id: null,
            regCode: '11908',
            regNo: null,
            regName: '湛江市',
            fatherId: '119',
            regMemo: null,
            regType: null,
            regTypeName: null,
            districtNo: null,
            postNo: '',
            validState: null,
            remark: null,
            lastOperator: null,
            lastUpdatetime: null,
            parentName: null,
            children: []
          },
          {
            tenancyId: null,
            id: null,
            regCode: '11910',
            regNo: null,
            regName: '肇庆市',
            fatherId: '119',
            regMemo: null,
            regType: null,
            regTypeName: null,
            districtNo: null,
            postNo: '',
            validState: null,
            remark: null,
            lastOperator: null,
            lastUpdatetime: null,
            parentName: null,
            children: []
          },
          {
            tenancyId: null,
            id: null,
            regCode: '11911',
            regNo: null,
            regName: '惠州市',
            fatherId: '119',
            regMemo: null,
            regType: null,
            regTypeName: null,
            districtNo: null,
            postNo: '',
            validState: null,
            remark: null,
            lastOperator: null,
            lastUpdatetime: null,
            parentName: null,
            children: []
          },
          {
            tenancyId: null,
            id: null,
            regCode: '11912',
            regNo: null,
            regName: '梅州市',
            fatherId: '119',
            regMemo: null,
            regType: null,
            regTypeName: null,
            districtNo: null,
            postNo: '',
            validState: null,
            remark: null,
            lastOperator: null,
            lastUpdatetime: null,
            parentName: null,
            children: []
          },
          {
            tenancyId: null,
            id: null,
            regCode: '11913',
            regNo: null,
            regName: '汕尾市',
            fatherId: '119',
            regMemo: null,
            regType: null,
            regTypeName: null,
            districtNo: null,
            postNo: '',
            validState: null,
            remark: null,
            lastOperator: null,
            lastUpdatetime: null,
            parentName: null,
            children: []
          },
          {
            tenancyId: null,
            id: null,
            regCode: '11914',
            regNo: null,
            regName: '河源市',
            fatherId: '119',
            regMemo: null,
            regType: null,
            regTypeName: null,
            districtNo: null,
            postNo: '',
            validState: null,
            remark: null,
            lastOperator: null,
            lastUpdatetime: null,
            parentName: null,
            children: []
          },
          {
            tenancyId: null,
            id: null,
            regCode: '11915',
            regNo: null,
            regName: '阳江市',
            fatherId: '119',
            regMemo: null,
            regType: null,
            regTypeName: null,
            districtNo: null,
            postNo: '',
            validState: null,
            remark: null,
            lastOperator: null,
            lastUpdatetime: null,
            parentName: null,
            children: []
          },
          {
            tenancyId: null,
            id: null,
            regCode: '11916',
            regNo: null,
            regName: '清远市',
            fatherId: '119',
            regMemo: null,
            regType: null,
            regTypeName: null,
            districtNo: null,
            postNo: '',
            validState: null,
            remark: null,
            lastOperator: null,
            lastUpdatetime: null,
            parentName: null,
            children: []
          },
          {
            tenancyId: null,
            id: null,
            regCode: '11917',
            regNo: null,
            regName: '东莞市',
            fatherId: '119',
            regMemo: null,
            regType: null,
            regTypeName: null,
            districtNo: null,
            postNo: '',
            validState: null,
            remark: null,
            lastOperator: null,
            lastUpdatetime: null,
            parentName: null,
            children: []
          },
          {
            tenancyId: null,
            id: null,
            regCode: '11918',
            regNo: null,
            regName: '中山市',
            fatherId: '119',
            regMemo: null,
            regType: null,
            regTypeName: null,
            districtNo: null,
            postNo: '',
            validState: null,
            remark: null,
            lastOperator: null,
            lastUpdatetime: null,
            parentName: null,
            children: []
          },
          {
            tenancyId: null,
            id: null,
            regCode: '11919',
            regNo: null,
            regName: '潮州市',
            fatherId: '119',
            regMemo: null,
            regType: null,
            regTypeName: null,
            districtNo: null,
            postNo: '',
            validState: null,
            remark: null,
            lastOperator: null,
            lastUpdatetime: null,
            parentName: null,
            children: []
          },
          {
            tenancyId: null,
            id: null,
            regCode: '11920',
            regNo: null,
            regName: '揭阳市',
            fatherId: '119',
            regMemo: null,
            regType: null,
            regTypeName: null,
            districtNo: null,
            postNo: '',
            validState: null,
            remark: null,
            lastOperator: null,
            lastUpdatetime: null,
            parentName: null,
            children: []
          },
          {
            tenancyId: null,
            id: null,
            regCode: '11921',
            regNo: null,
            regName: '云浮市',
            fatherId: '119',
            regMemo: null,
            regType: null,
            regTypeName: null,
            districtNo: null,
            postNo: '',
            validState: null,
            remark: null,
            lastOperator: null,
            lastUpdatetime: null,
            parentName: null,
            children: []
          },
          {
            tenancyId: null,
            id: null,
            regCode: '12001',
            regNo: null,
            regName: '南宁市',
            fatherId: '120',
            regMemo: null,
            regType: null,
            regTypeName: null,
            districtNo: null,
            postNo: '',
            validState: null,
            remark: null,
            lastOperator: null,
            lastUpdatetime: null,
            parentName: null,
            children: []
          },
          {
            tenancyId: null,
            id: null,
            regCode: '12002',
            regNo: null,
            regName: '柳州市',
            fatherId: '120',
            regMemo: null,
            regType: null,
            regTypeName: null,
            districtNo: null,
            postNo: '',
            validState: null,
            remark: null,
            lastOperator: null,
            lastUpdatetime: null,
            parentName: null,
            children: []
          },
          {
            tenancyId: null,
            id: null,
            regCode: '12003',
            regNo: null,
            regName: '桂林市',
            fatherId: '120',
            regMemo: null,
            regType: null,
            regTypeName: null,
            districtNo: null,
            postNo: '',
            validState: null,
            remark: null,
            lastOperator: null,
            lastUpdatetime: null,
            parentName: null,
            children: []
          },
          {
            tenancyId: null,
            id: null,
            regCode: '12004',
            regNo: null,
            regName: '梧州市',
            fatherId: '120',
            regMemo: null,
            regType: null,
            regTypeName: null,
            districtNo: null,
            postNo: '',
            validState: null,
            remark: null,
            lastOperator: null,
            lastUpdatetime: null,
            parentName: null,
            children: []
          },
          {
            tenancyId: null,
            id: null,
            regCode: '12005',
            regNo: null,
            regName: '北海市',
            fatherId: '120',
            regMemo: null,
            regType: null,
            regTypeName: null,
            districtNo: null,
            postNo: '',
            validState: null,
            remark: null,
            lastOperator: null,
            lastUpdatetime: null,
            parentName: null,
            children: []
          },
          {
            tenancyId: null,
            id: null,
            regCode: '12006',
            regNo: null,
            regName: '防城港市',
            fatherId: '120',
            regMemo: null,
            regType: null,
            regTypeName: null,
            districtNo: null,
            postNo: '',
            validState: null,
            remark: null,
            lastOperator: null,
            lastUpdatetime: null,
            parentName: null,
            children: []
          },
          {
            tenancyId: null,
            id: null,
            regCode: '12007',
            regNo: null,
            regName: '钦州市',
            fatherId: '120',
            regMemo: null,
            regType: null,
            regTypeName: null,
            districtNo: null,
            postNo: '',
            validState: null,
            remark: null,
            lastOperator: null,
            lastUpdatetime: null,
            parentName: null,
            children: []
          },
          {
            tenancyId: null,
            id: null,
            regCode: '12008',
            regNo: null,
            regName: '贵港市',
            fatherId: '120',
            regMemo: null,
            regType: null,
            regTypeName: null,
            districtNo: null,
            postNo: '',
            validState: null,
            remark: null,
            lastOperator: null,
            lastUpdatetime: null,
            parentName: null,
            children: []
          },
          {
            tenancyId: null,
            id: null,
            regCode: '12009',
            regNo: null,
            regName: '玉林市',
            fatherId: '120',
            regMemo: null,
            regType: null,
            regTypeName: null,
            districtNo: null,
            postNo: '',
            validState: null,
            remark: null,
            lastOperator: null,
            lastUpdatetime: null,
            parentName: null,
            children: []
          },
          {
            tenancyId: null,
            id: null,
            regCode: '12010',
            regNo: null,
            regName: '百色市',
            fatherId: '120',
            regMemo: null,
            regType: null,
            regTypeName: null,
            districtNo: null,
            postNo: '',
            validState: null,
            remark: null,
            lastOperator: null,
            lastUpdatetime: null,
            parentName: null,
            children: []
          },
          {
            tenancyId: null,
            id: null,
            regCode: '12011',
            regNo: null,
            regName: '贺州市',
            fatherId: '120',
            regMemo: null,
            regType: null,
            regTypeName: null,
            districtNo: null,
            postNo: '',
            validState: null,
            remark: null,
            lastOperator: null,
            lastUpdatetime: null,
            parentName: null,
            children: []
          },
          {
            tenancyId: null,
            id: null,
            regCode: '12012',
            regNo: null,
            regName: '河池市',
            fatherId: '120',
            regMemo: null,
            regType: null,
            regTypeName: null,
            districtNo: null,
            postNo: '',
            validState: null,
            remark: null,
            lastOperator: null,
            lastUpdatetime: null,
            parentName: null,
            children: []
          },
          {
            tenancyId: null,
            id: null,
            regCode: '12013',
            regNo: null,
            regName: '来宾市',
            fatherId: '120',
            regMemo: null,
            regType: null,
            regTypeName: null,
            districtNo: null,
            postNo: '',
            validState: null,
            remark: null,
            lastOperator: null,
            lastUpdatetime: null,
            parentName: null,
            children: []
          },
          {
            tenancyId: null,
            id: null,
            regCode: '12014',
            regNo: null,
            regName: '崇左市',
            fatherId: '120',
            regMemo: null,
            regType: null,
            regTypeName: null,
            districtNo: null,
            postNo: '',
            validState: null,
            remark: null,
            lastOperator: null,
            lastUpdatetime: null,
            parentName: null,
            children: []
          },
          {
            tenancyId: null,
            id: null,
            regCode: '12101',
            regNo: null,
            regName: '海口市',
            fatherId: '121',
            regMemo: null,
            regType: null,
            regTypeName: null,
            districtNo: null,
            postNo: '',
            validState: null,
            remark: null,
            lastOperator: null,
            lastUpdatetime: null,
            parentName: null,
            children: []
          },
          {
            tenancyId: null,
            id: null,
            regCode: '12102',
            regNo: null,
            regName: '三亚市',
            fatherId: '121',
            regMemo: null,
            regType: null,
            regTypeName: null,
            districtNo: null,
            postNo: '',
            validState: null,
            remark: null,
            lastOperator: null,
            lastUpdatetime: null,
            parentName: null,
            children: []
          },
          {
            tenancyId: null,
            id: null,
            regCode: '12103',
            regNo: null,
            regName: '省直辖县级行政单位',
            fatherId: '121',
            regMemo: null,
            regType: null,
            regTypeName: null,
            districtNo: null,
            postNo: '',
            validState: null,
            remark: null,
            lastOperator: null,
            lastUpdatetime: null,
            parentName: null,
            children: []
          },
          {
            tenancyId: null,
            id: null,
            regCode: '12201',
            regNo: null,
            regName: '重庆市市辖区',
            fatherId: '122',
            regMemo: null,
            regType: null,
            regTypeName: null,
            districtNo: null,
            postNo: '',
            validState: null,
            remark: null,
            lastOperator: null,
            lastUpdatetime: null,
            parentName: null,
            children: []
          },
          {
            tenancyId: null,
            id: null,
            regCode: '12301',
            regNo: null,
            regName: '成都市',
            fatherId: '123',
            regMemo: null,
            regType: null,
            regTypeName: null,
            districtNo: null,
            postNo: '',
            validState: null,
            remark: null,
            lastOperator: null,
            lastUpdatetime: null,
            parentName: null,
            children: []
          },
          {
            tenancyId: null,
            id: null,
            regCode: '12302',
            regNo: null,
            regName: '自贡市',
            fatherId: '123',
            regMemo: null,
            regType: null,
            regTypeName: null,
            districtNo: null,
            postNo: '',
            validState: null,
            remark: null,
            lastOperator: null,
            lastUpdatetime: null,
            parentName: null,
            children: []
          },
          {
            tenancyId: null,
            id: null,
            regCode: '12303',
            regNo: null,
            regName: '攀枝花市',
            fatherId: '123',
            regMemo: null,
            regType: null,
            regTypeName: null,
            districtNo: null,
            postNo: '',
            validState: null,
            remark: null,
            lastOperator: null,
            lastUpdatetime: null,
            parentName: null,
            children: []
          },
          {
            tenancyId: null,
            id: null,
            regCode: '12306',
            regNo: null,
            regName: '绵阳市',
            fatherId: '123',
            regMemo: null,
            regType: null,
            regTypeName: null,
            districtNo: null,
            postNo: '',
            validState: null,
            remark: null,
            lastOperator: null,
            lastUpdatetime: null,
            parentName: null,
            children: []
          },
          {
            tenancyId: null,
            id: null,
            regCode: '12307',
            regNo: null,
            regName: '广元市',
            fatherId: '123',
            regMemo: null,
            regType: null,
            regTypeName: null,
            districtNo: null,
            postNo: '',
            validState: null,
            remark: null,
            lastOperator: null,
            lastUpdatetime: null,
            parentName: null,
            children: []
          },
          {
            tenancyId: null,
            id: null,
            regCode: '12308',
            regNo: null,
            regName: '遂宁市',
            fatherId: '123',
            regMemo: null,
            regType: null,
            regTypeName: null,
            districtNo: null,
            postNo: '',
            validState: null,
            remark: null,
            lastOperator: null,
            lastUpdatetime: null,
            parentName: null,
            children: []
          },
          {
            tenancyId: null,
            id: null,
            regCode: '12309',
            regNo: null,
            regName: '内江市',
            fatherId: '123',
            regMemo: null,
            regType: null,
            regTypeName: null,
            districtNo: null,
            postNo: '',
            validState: null,
            remark: null,
            lastOperator: null,
            lastUpdatetime: null,
            parentName: null,
            children: []
          },
          {
            tenancyId: null,
            id: null,
            regCode: '12310',
            regNo: null,
            regName: '乐山市',
            fatherId: '123',
            regMemo: null,
            regType: null,
            regTypeName: null,
            districtNo: null,
            postNo: '',
            validState: null,
            remark: null,
            lastOperator: null,
            lastUpdatetime: null,
            parentName: null,
            children: []
          },
          {
            tenancyId: null,
            id: null,
            regCode: '12311',
            regNo: null,
            regName: '南充市',
            fatherId: '123',
            regMemo: null,
            regType: null,
            regTypeName: null,
            districtNo: null,
            postNo: '',
            validState: null,
            remark: null,
            lastOperator: null,
            lastUpdatetime: null,
            parentName: null,
            children: []
          },
          {
            tenancyId: null,
            id: null,
            regCode: '12312',
            regNo: null,
            regName: '眉山市',
            fatherId: '123',
            regMemo: null,
            regType: null,
            regTypeName: null,
            districtNo: null,
            postNo: '',
            validState: null,
            remark: null,
            lastOperator: null,
            lastUpdatetime: null,
            parentName: null,
            children: []
          },
          {
            tenancyId: null,
            id: null,
            regCode: '12314',
            regNo: null,
            regName: '广安市',
            fatherId: '123',
            regMemo: null,
            regType: null,
            regTypeName: null,
            districtNo: null,
            postNo: '',
            validState: null,
            remark: null,
            lastOperator: null,
            lastUpdatetime: null,
            parentName: null,
            children: []
          },
          {
            tenancyId: null,
            id: null,
            regCode: '12315',
            regNo: null,
            regName: '达州市',
            fatherId: '123',
            regMemo: null,
            regType: null,
            regTypeName: null,
            districtNo: null,
            postNo: '',
            validState: null,
            remark: null,
            lastOperator: null,
            lastUpdatetime: null,
            parentName: null,
            children: []
          },
          {
            tenancyId: null,
            id: null,
            regCode: '12316',
            regNo: null,
            regName: '雅安市',
            fatherId: '123',
            regMemo: null,
            regType: null,
            regTypeName: null,
            districtNo: null,
            postNo: '',
            validState: null,
            remark: null,
            lastOperator: null,
            lastUpdatetime: null,
            parentName: null,
            children: []
          },
          {
            tenancyId: null,
            id: null,
            regCode: '12317',
            regNo: null,
            regName: '巴中市',
            fatherId: '123',
            regMemo: null,
            regType: null,
            regTypeName: null,
            districtNo: null,
            postNo: '',
            validState: null,
            remark: null,
            lastOperator: null,
            lastUpdatetime: null,
            parentName: null,
            children: []
          },
          {
            tenancyId: null,
            id: null,
            regCode: '12318',
            regNo: null,
            regName: '资阳市',
            fatherId: '123',
            regMemo: null,
            regType: null,
            regTypeName: null,
            districtNo: null,
            postNo: '',
            validState: null,
            remark: null,
            lastOperator: null,
            lastUpdatetime: null,
            parentName: null,
            children: []
          },
          {
            tenancyId: null,
            id: null,
            regCode: '12319',
            regNo: null,
            regName: '阿坝藏族羌族自治州',
            fatherId: '123',
            regMemo: null,
            regType: null,
            regTypeName: null,
            districtNo: null,
            postNo: '',
            validState: null,
            remark: null,
            lastOperator: null,
            lastUpdatetime: null,
            parentName: null,
            children: []
          },
          {
            tenancyId: null,
            id: null,
            regCode: '12320',
            regNo: null,
            regName: '甘孜藏族自治州',
            fatherId: '123',
            regMemo: null,
            regType: null,
            regTypeName: null,
            districtNo: null,
            postNo: '',
            validState: null,
            remark: null,
            lastOperator: null,
            lastUpdatetime: null,
            parentName: null,
            children: []
          },
          {
            tenancyId: null,
            id: null,
            regCode: '12321',
            regNo: null,
            regName: '凉山彝族自治州',
            fatherId: '123',
            regMemo: null,
            regType: null,
            regTypeName: null,
            districtNo: null,
            postNo: '',
            validState: null,
            remark: null,
            lastOperator: null,
            lastUpdatetime: null,
            parentName: null,
            children: []
          },
          {
            tenancyId: null,
            id: null,
            regCode: '12401',
            regNo: null,
            regName: '贵阳市',
            fatherId: '124',
            regMemo: null,
            regType: null,
            regTypeName: null,
            districtNo: null,
            postNo: '',
            validState: null,
            remark: null,
            lastOperator: null,
            lastUpdatetime: null,
            parentName: null,
            children: []
          },
          {
            tenancyId: null,
            id: null,
            regCode: '12402',
            regNo: null,
            regName: '六盘水市',
            fatherId: '124',
            regMemo: null,
            regType: null,
            regTypeName: null,
            districtNo: null,
            postNo: '',
            validState: null,
            remark: null,
            lastOperator: null,
            lastUpdatetime: null,
            parentName: null,
            children: []
          },
          {
            tenancyId: null,
            id: null,
            regCode: '12403',
            regNo: null,
            regName: '遵义市',
            fatherId: '124',
            regMemo: null,
            regType: null,
            regTypeName: null,
            districtNo: null,
            postNo: '',
            validState: null,
            remark: null,
            lastOperator: null,
            lastUpdatetime: null,
            parentName: null,
            children: []
          },
          {
            tenancyId: null,
            id: null,
            regCode: '12404',
            regNo: null,
            regName: '安顺市',
            fatherId: '124',
            regMemo: null,
            regType: null,
            regTypeName: null,
            districtNo: null,
            postNo: '',
            validState: null,
            remark: null,
            lastOperator: null,
            lastUpdatetime: null,
            parentName: null,
            children: []
          },
          {
            tenancyId: null,
            id: null,
            regCode: '12405',
            regNo: null,
            regName: '铜仁地区',
            fatherId: '124',
            regMemo: null,
            regType: null,
            regTypeName: null,
            districtNo: null,
            postNo: '',
            validState: null,
            remark: null,
            lastOperator: null,
            lastUpdatetime: null,
            parentName: null,
            children: []
          },
          {
            tenancyId: null,
            id: null,
            regCode: '12406',
            regNo: null,
            regName: '黔西南布依族苗族自治州',
            fatherId: '124',
            regMemo: null,
            regType: null,
            regTypeName: null,
            districtNo: null,
            postNo: '',
            validState: null,
            remark: null,
            lastOperator: null,
            lastUpdatetime: null,
            parentName: null,
            children: []
          },
          {
            tenancyId: null,
            id: null,
            regCode: '12407',
            regNo: null,
            regName: '毕节地区',
            fatherId: '124',
            regMemo: null,
            regType: null,
            regTypeName: null,
            districtNo: null,
            postNo: '',
            validState: null,
            remark: null,
            lastOperator: null,
            lastUpdatetime: null,
            parentName: null,
            children: []
          },
          {
            tenancyId: null,
            id: null,
            regCode: '12408',
            regNo: null,
            regName: '黔东南苗族侗族自治州',
            fatherId: '124',
            regMemo: null,
            regType: null,
            regTypeName: null,
            districtNo: null,
            postNo: '',
            validState: null,
            remark: null,
            lastOperator: null,
            lastUpdatetime: null,
            parentName: null,
            children: []
          },
          {
            tenancyId: null,
            id: null,
            regCode: '12409',
            regNo: null,
            regName: '黔南布依族苗族自治州',
            fatherId: '124',
            regMemo: null,
            regType: null,
            regTypeName: null,
            districtNo: null,
            postNo: '',
            validState: null,
            remark: null,
            lastOperator: null,
            lastUpdatetime: null,
            parentName: null,
            children: []
          },
          {
            tenancyId: null,
            id: null,
            regCode: '12501',
            regNo: null,
            regName: '昆明市',
            fatherId: '125',
            regMemo: null,
            regType: null,
            regTypeName: null,
            districtNo: null,
            postNo: '',
            validState: null,
            remark: null,
            lastOperator: null,
            lastUpdatetime: null,
            parentName: null,
            children: []
          },
          {
            tenancyId: null,
            id: null,
            regCode: '12502',
            regNo: null,
            regName: '曲靖市',
            fatherId: '125',
            regMemo: null,
            regType: null,
            regTypeName: null,
            districtNo: null,
            postNo: '',
            validState: null,
            remark: null,
            lastOperator: null,
            lastUpdatetime: null,
            parentName: null,
            children: []
          },
          {
            tenancyId: null,
            id: null,
            regCode: '12503',
            regNo: null,
            regName: '玉溪市',
            fatherId: '125',
            regMemo: null,
            regType: null,
            regTypeName: null,
            districtNo: null,
            postNo: '',
            validState: null,
            remark: null,
            lastOperator: null,
            lastUpdatetime: null,
            parentName: null,
            children: []
          },
          {
            tenancyId: null,
            id: null,
            regCode: '12504',
            regNo: null,
            regName: '保山市',
            fatherId: '125',
            regMemo: null,
            regType: null,
            regTypeName: null,
            districtNo: null,
            postNo: '',
            validState: null,
            remark: null,
            lastOperator: null,
            lastUpdatetime: null,
            parentName: null,
            children: []
          },
          {
            tenancyId: null,
            id: null,
            regCode: '12505',
            regNo: null,
            regName: '昭通市',
            fatherId: '125',
            regMemo: null,
            regType: null,
            regTypeName: null,
            districtNo: null,
            postNo: '',
            validState: null,
            remark: null,
            lastOperator: null,
            lastUpdatetime: null,
            parentName: null,
            children: []
          },
          {
            tenancyId: null,
            id: null,
            regCode: '12506',
            regNo: null,
            regName: '丽江市',
            fatherId: '125',
            regMemo: null,
            regType: null,
            regTypeName: null,
            districtNo: null,
            postNo: '',
            validState: null,
            remark: null,
            lastOperator: null,
            lastUpdatetime: null,
            parentName: null,
            children: []
          },
          {
            tenancyId: null,
            id: null,
            regCode: '12507',
            regNo: null,
            regName: '思茅市',
            fatherId: '125',
            regMemo: null,
            regType: null,
            regTypeName: null,
            districtNo: null,
            postNo: '',
            validState: null,
            remark: null,
            lastOperator: null,
            lastUpdatetime: null,
            parentName: null,
            children: []
          },
          {
            tenancyId: null,
            id: null,
            regCode: '12508',
            regNo: null,
            regName: '临沧市',
            fatherId: '125',
            regMemo: null,
            regType: null,
            regTypeName: null,
            districtNo: null,
            postNo: '',
            validState: null,
            remark: null,
            lastOperator: null,
            lastUpdatetime: null,
            parentName: null,
            children: []
          },
          {
            tenancyId: null,
            id: null,
            regCode: '12509',
            regNo: null,
            regName: '楚雄彝族自治州',
            fatherId: '125',
            regMemo: null,
            regType: null,
            regTypeName: null,
            districtNo: null,
            postNo: '',
            validState: null,
            remark: null,
            lastOperator: null,
            lastUpdatetime: null,
            parentName: null,
            children: []
          },
          {
            tenancyId: null,
            id: null,
            regCode: '12510',
            regNo: null,
            regName: '红河哈尼族彝族自治州',
            fatherId: '125',
            regMemo: null,
            regType: null,
            regTypeName: null,
            districtNo: null,
            postNo: '',
            validState: null,
            remark: null,
            lastOperator: null,
            lastUpdatetime: null,
            parentName: null,
            children: []
          },
          {
            tenancyId: null,
            id: null,
            regCode: '12511',
            regNo: null,
            regName: '文山壮族苗族自治州',
            fatherId: '125',
            regMemo: null,
            regType: null,
            regTypeName: null,
            districtNo: null,
            postNo: '',
            validState: null,
            remark: null,
            lastOperator: null,
            lastUpdatetime: null,
            parentName: null,
            children: []
          },
          {
            tenancyId: null,
            id: null,
            regCode: '12512',
            regNo: null,
            regName: '西双版纳傣族自治州',
            fatherId: '125',
            regMemo: null,
            regType: null,
            regTypeName: null,
            districtNo: null,
            postNo: '',
            validState: null,
            remark: null,
            lastOperator: null,
            lastUpdatetime: null,
            parentName: null,
            children: []
          },
          {
            tenancyId: null,
            id: null,
            regCode: '12513',
            regNo: null,
            regName: '大理白族自治州',
            fatherId: '125',
            regMemo: null,
            regType: null,
            regTypeName: null,
            districtNo: null,
            postNo: '',
            validState: null,
            remark: null,
            lastOperator: null,
            lastUpdatetime: null,
            parentName: null,
            children: []
          },
          {
            tenancyId: null,
            id: null,
            regCode: '12514',
            regNo: null,
            regName: '德宏傣族景颇族自治州',
            fatherId: '125',
            regMemo: null,
            regType: null,
            regTypeName: null,
            districtNo: null,
            postNo: '',
            validState: null,
            remark: null,
            lastOperator: null,
            lastUpdatetime: null,
            parentName: null,
            children: []
          },
          {
            tenancyId: null,
            id: null,
            regCode: '12515',
            regNo: null,
            regName: '怒江傈僳族自治州',
            fatherId: '125',
            regMemo: null,
            regType: null,
            regTypeName: null,
            districtNo: null,
            postNo: '',
            validState: null,
            remark: null,
            lastOperator: null,
            lastUpdatetime: null,
            parentName: null,
            children: []
          },
          {
            tenancyId: null,
            id: null,
            regCode: '12516',
            regNo: null,
            regName: '迪庆藏族自治州',
            fatherId: '125',
            regMemo: null,
            regType: null,
            regTypeName: null,
            districtNo: null,
            postNo: '',
            validState: null,
            remark: null,
            lastOperator: null,
            lastUpdatetime: null,
            parentName: null,
            children: []
          },
          {
            tenancyId: null,
            id: null,
            regCode: '12601',
            regNo: null,
            regName: '拉萨市',
            fatherId: '126',
            regMemo: null,
            regType: null,
            regTypeName: null,
            districtNo: null,
            postNo: '',
            validState: null,
            remark: null,
            lastOperator: null,
            lastUpdatetime: null,
            parentName: null,
            children: []
          },
          {
            tenancyId: null,
            id: null,
            regCode: '12602',
            regNo: null,
            regName: '昌都地区',
            fatherId: '126',
            regMemo: null,
            regType: null,
            regTypeName: null,
            districtNo: null,
            postNo: '',
            validState: null,
            remark: null,
            lastOperator: null,
            lastUpdatetime: null,
            parentName: null,
            children: []
          },
          {
            tenancyId: null,
            id: null,
            regCode: '12603',
            regNo: null,
            regName: '山南地区',
            fatherId: '126',
            regMemo: null,
            regType: null,
            regTypeName: null,
            districtNo: null,
            postNo: '',
            validState: null,
            remark: null,
            lastOperator: null,
            lastUpdatetime: null,
            parentName: null,
            children: []
          },
          {
            tenancyId: null,
            id: null,
            regCode: '12604',
            regNo: null,
            regName: '日喀则地区',
            fatherId: '126',
            regMemo: null,
            regType: null,
            regTypeName: null,
            districtNo: null,
            postNo: '',
            validState: null,
            remark: null,
            lastOperator: null,
            lastUpdatetime: null,
            parentName: null,
            children: []
          },
          {
            tenancyId: null,
            id: null,
            regCode: '12605',
            regNo: null,
            regName: '那曲地区',
            fatherId: '126',
            regMemo: null,
            regType: null,
            regTypeName: null,
            districtNo: null,
            postNo: '',
            validState: null,
            remark: null,
            lastOperator: null,
            lastUpdatetime: null,
            parentName: null,
            children: []
          },
          {
            tenancyId: null,
            id: null,
            regCode: '12606',
            regNo: null,
            regName: '阿里地区',
            fatherId: '126',
            regMemo: null,
            regType: null,
            regTypeName: null,
            districtNo: null,
            postNo: '',
            validState: null,
            remark: null,
            lastOperator: null,
            lastUpdatetime: null,
            parentName: null,
            children: []
          },
          {
            tenancyId: null,
            id: null,
            regCode: '12607',
            regNo: null,
            regName: '林芝地区',
            fatherId: '126',
            regMemo: null,
            regType: null,
            regTypeName: null,
            districtNo: null,
            postNo: '',
            validState: null,
            remark: null,
            lastOperator: null,
            lastUpdatetime: null,
            parentName: null,
            children: []
          },
          {
            tenancyId: null,
            id: null,
            regCode: '12701',
            regNo: null,
            regName: '西安市',
            fatherId: '127',
            regMemo: null,
            regType: null,
            regTypeName: null,
            districtNo: null,
            postNo: '',
            validState: null,
            remark: null,
            lastOperator: null,
            lastUpdatetime: null,
            parentName: null,
            children: []
          },
          {
            tenancyId: null,
            id: null,
            regCode: '12702',
            regNo: null,
            regName: '铜川市',
            fatherId: '127',
            regMemo: null,
            regType: null,
            regTypeName: null,
            districtNo: null,
            postNo: '',
            validState: null,
            remark: null,
            lastOperator: null,
            lastUpdatetime: null,
            parentName: null,
            children: []
          },
          {
            tenancyId: null,
            id: null,
            regCode: '12703',
            regNo: null,
            regName: '宝鸡市',
            fatherId: '127',
            regMemo: null,
            regType: null,
            regTypeName: null,
            districtNo: null,
            postNo: '',
            validState: null,
            remark: null,
            lastOperator: null,
            lastUpdatetime: null,
            parentName: null,
            children: []
          },
          {
            tenancyId: null,
            id: null,
            regCode: '12704',
            regNo: null,
            regName: '咸阳市',
            fatherId: '127',
            regMemo: null,
            regType: null,
            regTypeName: null,
            districtNo: null,
            postNo: '',
            validState: null,
            remark: null,
            lastOperator: null,
            lastUpdatetime: null,
            parentName: null,
            children: []
          },
          {
            tenancyId: null,
            id: null,
            regCode: '12705',
            regNo: null,
            regName: '渭南市',
            fatherId: '127',
            regMemo: null,
            regType: null,
            regTypeName: null,
            districtNo: null,
            postNo: '',
            validState: null,
            remark: null,
            lastOperator: null,
            lastUpdatetime: null,
            parentName: null,
            children: []
          },
          {
            tenancyId: null,
            id: null,
            regCode: '12706',
            regNo: null,
            regName: '延安市',
            fatherId: '127',
            regMemo: null,
            regType: null,
            regTypeName: null,
            districtNo: null,
            postNo: '',
            validState: null,
            remark: null,
            lastOperator: null,
            lastUpdatetime: null,
            parentName: null,
            children: []
          },
          {
            tenancyId: null,
            id: null,
            regCode: '12707',
            regNo: null,
            regName: '汉中市',
            fatherId: '127',
            regMemo: null,
            regType: null,
            regTypeName: null,
            districtNo: null,
            postNo: '',
            validState: null,
            remark: null,
            lastOperator: null,
            lastUpdatetime: null,
            parentName: null,
            children: []
          },
          {
            tenancyId: null,
            id: null,
            regCode: '12708',
            regNo: null,
            regName: '榆林市',
            fatherId: '127',
            regMemo: null,
            regType: null,
            regTypeName: null,
            districtNo: null,
            postNo: '',
            validState: null,
            remark: null,
            lastOperator: null,
            lastUpdatetime: null,
            parentName: null,
            children: []
          },
          {
            tenancyId: null,
            id: null,
            regCode: '12709',
            regNo: null,
            regName: '安康市',
            fatherId: '127',
            regMemo: null,
            regType: null,
            regTypeName: null,
            districtNo: null,
            postNo: '',
            validState: null,
            remark: null,
            lastOperator: null,
            lastUpdatetime: null,
            parentName: null,
            children: []
          },
          {
            tenancyId: null,
            id: null,
            regCode: '12710',
            regNo: null,
            regName: '商洛市',
            fatherId: '127',
            regMemo: null,
            regType: null,
            regTypeName: null,
            districtNo: null,
            postNo: '',
            validState: null,
            remark: null,
            lastOperator: null,
            lastUpdatetime: null,
            parentName: null,
            children: []
          },
          {
            tenancyId: null,
            id: null,
            regCode: '12801',
            regNo: null,
            regName: '兰州市',
            fatherId: '128',
            regMemo: null,
            regType: null,
            regTypeName: null,
            districtNo: null,
            postNo: '',
            validState: null,
            remark: null,
            lastOperator: null,
            lastUpdatetime: null,
            parentName: null,
            children: []
          },
          {
            tenancyId: null,
            id: null,
            regCode: '12802',
            regNo: null,
            regName: '嘉峪关市',
            fatherId: '128',
            regMemo: null,
            regType: null,
            regTypeName: null,
            districtNo: null,
            postNo: '',
            validState: null,
            remark: null,
            lastOperator: null,
            lastUpdatetime: null,
            parentName: null,
            children: []
          },
          {
            tenancyId: null,
            id: null,
            regCode: '12803',
            regNo: null,
            regName: '金昌市',
            fatherId: '128',
            regMemo: null,
            regType: null,
            regTypeName: null,
            districtNo: null,
            postNo: '',
            validState: null,
            remark: null,
            lastOperator: null,
            lastUpdatetime: null,
            parentName: null,
            children: []
          },
          {
            tenancyId: null,
            id: null,
            regCode: '12804',
            regNo: null,
            regName: '白银市',
            fatherId: '128',
            regMemo: null,
            regType: null,
            regTypeName: null,
            districtNo: null,
            postNo: '',
            validState: null,
            remark: null,
            lastOperator: null,
            lastUpdatetime: null,
            parentName: null,
            children: []
          },
          {
            tenancyId: null,
            id: null,
            regCode: '12805',
            regNo: null,
            regName: '天水市',
            fatherId: '128',
            regMemo: null,
            regType: null,
            regTypeName: null,
            districtNo: null,
            postNo: '',
            validState: null,
            remark: null,
            lastOperator: null,
            lastUpdatetime: null,
            parentName: null,
            children: []
          },
          {
            tenancyId: null,
            id: null,
            regCode: '12806',
            regNo: null,
            regName: '武威市',
            fatherId: '128',
            regMemo: null,
            regType: null,
            regTypeName: null,
            districtNo: null,
            postNo: '',
            validState: null,
            remark: null,
            lastOperator: null,
            lastUpdatetime: null,
            parentName: null,
            children: []
          },
          {
            tenancyId: null,
            id: null,
            regCode: '12808',
            regNo: null,
            regName: '平凉市',
            fatherId: '128',
            regMemo: null,
            regType: null,
            regTypeName: null,
            districtNo: null,
            postNo: '',
            validState: null,
            remark: null,
            lastOperator: null,
            lastUpdatetime: null,
            parentName: null,
            children: []
          },
          {
            tenancyId: null,
            id: null,
            regCode: '12809',
            regNo: null,
            regName: '酒泉市',
            fatherId: '128',
            regMemo: null,
            regType: null,
            regTypeName: null,
            districtNo: null,
            postNo: '',
            validState: null,
            remark: null,
            lastOperator: null,
            lastUpdatetime: null,
            parentName: null,
            children: []
          },
          {
            tenancyId: null,
            id: null,
            regCode: '12810',
            regNo: null,
            regName: '庆阳市',
            fatherId: '128',
            regMemo: null,
            regType: null,
            regTypeName: null,
            districtNo: null,
            postNo: '',
            validState: null,
            remark: null,
            lastOperator: null,
            lastUpdatetime: null,
            parentName: null,
            children: []
          },
          {
            tenancyId: null,
            id: null,
            regCode: '12811',
            regNo: null,
            regName: '定西市',
            fatherId: '128',
            regMemo: null,
            regType: null,
            regTypeName: null,
            districtNo: null,
            postNo: '',
            validState: null,
            remark: null,
            lastOperator: null,
            lastUpdatetime: null,
            parentName: null,
            children: []
          },
          {
            tenancyId: null,
            id: null,
            regCode: '12812',
            regNo: null,
            regName: '陇南市',
            fatherId: '128',
            regMemo: null,
            regType: null,
            regTypeName: null,
            districtNo: null,
            postNo: '',
            validState: null,
            remark: null,
            lastOperator: null,
            lastUpdatetime: null,
            parentName: null,
            children: []
          },
          {
            tenancyId: null,
            id: null,
            regCode: '12813',
            regNo: null,
            regName: '临夏回族自治州',
            fatherId: '128',
            regMemo: null,
            regType: null,
            regTypeName: null,
            districtNo: null,
            postNo: '',
            validState: null,
            remark: null,
            lastOperator: null,
            lastUpdatetime: null,
            parentName: null,
            children: []
          },
          {
            tenancyId: null,
            id: null,
            regCode: '11105',
            regNo: null,
            regName: '湖州市',
            fatherId: '111',
            regMemo: null,
            regType: null,
            regTypeName: null,
            districtNo: null,
            postNo: '',
            validState: null,
            remark: null,
            lastOperator: null,
            lastUpdatetime: null,
            parentName: null,
            children: []
          },
          {
            tenancyId: null,
            id: null,
            regCode: '12814',
            regNo: null,
            regName: '甘南藏族自治州',
            fatherId: '128',
            regMemo: null,
            regType: null,
            regTypeName: null,
            districtNo: null,
            postNo: '',
            validState: null,
            remark: null,
            lastOperator: null,
            lastUpdatetime: null,
            parentName: null,
            children: []
          },
          {
            tenancyId: null,
            id: null,
            regCode: '12901',
            regNo: null,
            regName: '西宁市',
            fatherId: '129',
            regMemo: null,
            regType: null,
            regTypeName: null,
            districtNo: null,
            postNo: '',
            validState: null,
            remark: null,
            lastOperator: null,
            lastUpdatetime: null,
            parentName: null,
            children: []
          },
          {
            tenancyId: null,
            id: null,
            regCode: '12903',
            regNo: null,
            regName: '海北藏族自治州',
            fatherId: '129',
            regMemo: null,
            regType: null,
            regTypeName: null,
            districtNo: null,
            postNo: '',
            validState: null,
            remark: null,
            lastOperator: null,
            lastUpdatetime: null,
            parentName: null,
            children: []
          },
          {
            tenancyId: null,
            id: null,
            regCode: '12904',
            regNo: null,
            regName: '黄南藏族自治州',
            fatherId: '129',
            regMemo: null,
            regType: null,
            regTypeName: null,
            districtNo: null,
            postNo: '',
            validState: null,
            remark: null,
            lastOperator: null,
            lastUpdatetime: null,
            parentName: null,
            children: []
          },
          {
            tenancyId: null,
            id: null,
            regCode: '12905',
            regNo: null,
            regName: '海南藏族自治州',
            fatherId: '129',
            regMemo: null,
            regType: null,
            regTypeName: null,
            districtNo: null,
            postNo: '',
            validState: null,
            remark: null,
            lastOperator: null,
            lastUpdatetime: null,
            parentName: null,
            children: []
          },
          {
            tenancyId: null,
            id: null,
            regCode: '12906',
            regNo: null,
            regName: '果洛藏族自治州',
            fatherId: '129',
            regMemo: null,
            regType: null,
            regTypeName: null,
            districtNo: null,
            postNo: '',
            validState: null,
            remark: null,
            lastOperator: null,
            lastUpdatetime: null,
            parentName: null,
            children: []
          },
          {
            tenancyId: null,
            id: null,
            regCode: '12908',
            regNo: null,
            regName: '海西蒙古族藏族自治州',
            fatherId: '129',
            regMemo: null,
            regType: null,
            regTypeName: null,
            districtNo: null,
            postNo: '',
            validState: null,
            remark: null,
            lastOperator: null,
            lastUpdatetime: null,
            parentName: null,
            children: []
          },
          {
            tenancyId: null,
            id: null,
            regCode: '13001',
            regNo: null,
            regName: '银川市',
            fatherId: '130',
            regMemo: null,
            regType: null,
            regTypeName: null,
            districtNo: null,
            postNo: '',
            validState: null,
            remark: null,
            lastOperator: null,
            lastUpdatetime: null,
            parentName: null,
            children: []
          },
          {
            tenancyId: null,
            id: null,
            regCode: '13002',
            regNo: null,
            regName: '石嘴山市',
            fatherId: '130',
            regMemo: null,
            regType: null,
            regTypeName: null,
            districtNo: null,
            postNo: '',
            validState: null,
            remark: null,
            lastOperator: null,
            lastUpdatetime: null,
            parentName: null,
            children: []
          },
          {
            tenancyId: null,
            id: null,
            regCode: '13003',
            regNo: null,
            regName: '吴忠市',
            fatherId: '130',
            regMemo: null,
            regType: null,
            regTypeName: null,
            districtNo: null,
            postNo: '',
            validState: null,
            remark: null,
            lastOperator: null,
            lastUpdatetime: null,
            parentName: null,
            children: []
          },
          {
            tenancyId: null,
            id: null,
            regCode: '13004',
            regNo: null,
            regName: '固原市',
            fatherId: '130',
            regMemo: null,
            regType: null,
            regTypeName: null,
            districtNo: null,
            postNo: '',
            validState: null,
            remark: null,
            lastOperator: null,
            lastUpdatetime: null,
            parentName: null,
            children: []
          },
          {
            tenancyId: null,
            id: null,
            regCode: '13005',
            regNo: null,
            regName: '中卫市',
            fatherId: '130',
            regMemo: null,
            regType: null,
            regTypeName: null,
            districtNo: null,
            postNo: '',
            validState: null,
            remark: null,
            lastOperator: null,
            lastUpdatetime: null,
            parentName: null,
            children: []
          },
          {
            tenancyId: null,
            id: null,
            regCode: '13101',
            regNo: null,
            regName: '乌鲁木齐市',
            fatherId: '131',
            regMemo: null,
            regType: null,
            regTypeName: null,
            districtNo: null,
            postNo: '',
            validState: null,
            remark: null,
            lastOperator: null,
            lastUpdatetime: null,
            parentName: null,
            children: []
          },
          {
            tenancyId: null,
            id: null,
            regCode: '13102',
            regNo: null,
            regName: '克拉玛依市',
            fatherId: '131',
            regMemo: null,
            regType: null,
            regTypeName: null,
            districtNo: null,
            postNo: '',
            validState: null,
            remark: null,
            lastOperator: null,
            lastUpdatetime: null,
            parentName: null,
            children: []
          },
          {
            tenancyId: null,
            id: null,
            regCode: '13103',
            regNo: null,
            regName: '吐鲁番地区',
            fatherId: '131',
            regMemo: null,
            regType: null,
            regTypeName: null,
            districtNo: null,
            postNo: '',
            validState: null,
            remark: null,
            lastOperator: null,
            lastUpdatetime: null,
            parentName: null,
            children: []
          },
          {
            tenancyId: null,
            id: null,
            regCode: '13104',
            regNo: null,
            regName: '哈密地区',
            fatherId: '131',
            regMemo: null,
            regType: null,
            regTypeName: null,
            districtNo: null,
            postNo: '',
            validState: null,
            remark: null,
            lastOperator: null,
            lastUpdatetime: null,
            parentName: null,
            children: []
          },
          {
            tenancyId: null,
            id: null,
            regCode: '13105',
            regNo: null,
            regName: '昌吉回族自治州',
            fatherId: '131',
            regMemo: null,
            regType: null,
            regTypeName: null,
            districtNo: null,
            postNo: '',
            validState: null,
            remark: null,
            lastOperator: null,
            lastUpdatetime: null,
            parentName: null,
            children: []
          },
          {
            tenancyId: null,
            id: null,
            regCode: '13106',
            regNo: null,
            regName: '博尔塔拉蒙古自治州',
            fatherId: '131',
            regMemo: null,
            regType: null,
            regTypeName: null,
            districtNo: null,
            postNo: '',
            validState: null,
            remark: null,
            lastOperator: null,
            lastUpdatetime: null,
            parentName: null,
            children: []
          },
          {
            tenancyId: null,
            id: null,
            regCode: '13107',
            regNo: null,
            regName: '巴音郭楞蒙古自治州',
            fatherId: '131',
            regMemo: null,
            regType: null,
            regTypeName: null,
            districtNo: null,
            postNo: '',
            validState: null,
            remark: null,
            lastOperator: null,
            lastUpdatetime: null,
            parentName: null,
            children: []
          },
          {
            tenancyId: null,
            id: null,
            regCode: '13108',
            regNo: null,
            regName: '阿克苏地区',
            fatherId: '131',
            regMemo: null,
            regType: null,
            regTypeName: null,
            districtNo: null,
            postNo: '',
            validState: null,
            remark: null,
            lastOperator: null,
            lastUpdatetime: null,
            parentName: null,
            children: []
          },
          {
            tenancyId: null,
            id: null,
            regCode: '13109',
            regNo: null,
            regName: '克孜勒苏柯尔克孜自治州',
            fatherId: '131',
            regMemo: null,
            regType: null,
            regTypeName: null,
            districtNo: null,
            postNo: '',
            validState: null,
            remark: null,
            lastOperator: null,
            lastUpdatetime: null,
            parentName: null,
            children: []
          },
          {
            tenancyId: null,
            id: null,
            regCode: '13110',
            regNo: null,
            regName: '喀什地区',
            fatherId: '131',
            regMemo: null,
            regType: null,
            regTypeName: null,
            districtNo: null,
            postNo: '',
            validState: null,
            remark: null,
            lastOperator: null,
            lastUpdatetime: null,
            parentName: null,
            children: []
          },
          {
            tenancyId: null,
            id: null,
            regCode: '11210',
            regNo: null,
            regName: '滁州市',
            fatherId: '112',
            regMemo: null,
            regType: null,
            regTypeName: null,
            districtNo: null,
            postNo: '',
            validState: null,
            remark: null,
            lastOperator: null,
            lastUpdatetime: null,
            parentName: null,
            children: []
          },
          {
            tenancyId: null,
            id: null,
            regCode: '12907',
            regNo: null,
            regName: '玉树藏族自治州',
            fatherId: '129',
            regMemo: null,
            regType: null,
            regTypeName: null,
            districtNo: null,
            postNo: '',
            validState: null,
            remark: null,
            lastOperator: null,
            lastUpdatetime: null,
            parentName: null,
            children: []
          },
          {
            tenancyId: null,
            id: null,
            regCode: '13111',
            regNo: null,
            regName: '和田地区',
            fatherId: '131',
            regMemo: null,
            regType: null,
            regTypeName: null,
            districtNo: null,
            postNo: '',
            validState: null,
            remark: null,
            lastOperator: null,
            lastUpdatetime: null,
            parentName: null,
            children: []
          },
          {
            tenancyId: null,
            id: null,
            regCode: '13112',
            regNo: null,
            regName: '伊犁哈萨克自治州',
            fatherId: '131',
            regMemo: null,
            regType: null,
            regTypeName: null,
            districtNo: null,
            postNo: '',
            validState: null,
            remark: null,
            lastOperator: null,
            lastUpdatetime: null,
            parentName: null,
            children: []
          },
          {
            tenancyId: null,
            id: null,
            regCode: '13113',
            regNo: null,
            regName: '塔城地区',
            fatherId: '131',
            regMemo: null,
            regType: null,
            regTypeName: null,
            districtNo: null,
            postNo: '',
            validState: null,
            remark: null,
            lastOperator: null,
            lastUpdatetime: null,
            parentName: null,
            children: []
          },
          {
            tenancyId: null,
            id: null,
            regCode: '13114',
            regNo: null,
            regName: '阿勒泰地区',
            fatherId: '131',
            regMemo: null,
            regType: null,
            regTypeName: null,
            districtNo: null,
            postNo: '',
            validState: null,
            remark: null,
            lastOperator: null,
            lastUpdatetime: null,
            parentName: null,
            children: []
          },
          {
            tenancyId: null,
            id: null,
            regCode: '13115',
            regNo: null,
            regName: '省直辖行政单位',
            fatherId: '131',
            regMemo: null,
            regType: null,
            regTypeName: null,
            districtNo: null,
            postNo: '',
            validState: null,
            remark: null,
            lastOperator: null,
            lastUpdatetime: null,
            parentName: null,
            children: []
          },
          {
            tenancyId: null,
            id: null,
            regCode: '10101',
            regNo: null,
            regName: '北京市市辖区',
            fatherId: '101',
            regMemo: null,
            regType: null,
            regTypeName: null,
            districtNo: null,
            postNo: '',
            validState: null,
            remark: null,
            lastOperator: null,
            lastUpdatetime: null,
            parentName: null,
            children: []
          },
          {
            tenancyId: null,
            id: null,
            regCode: '10306',
            regNo: null,
            regName: '保定市',
            fatherId: '103',
            regMemo: null,
            regType: null,
            regTypeName: null,
            districtNo: null,
            postNo: '',
            validState: null,
            remark: null,
            lastOperator: null,
            lastUpdatetime: null,
            parentName: null,
            children: []
          },
          {
            tenancyId: null,
            id: null,
            regCode: '10510',
            regNo: null,
            regName: '兴安盟',
            fatherId: '105',
            regMemo: null,
            regType: null,
            regTypeName: null,
            districtNo: null,
            postNo: '',
            validState: null,
            remark: null,
            lastOperator: null,
            lastUpdatetime: null,
            parentName: null,
            children: []
          },
          {
            tenancyId: null,
            id: null,
            regCode: '11807',
            regNo: null,
            regName: '常德市',
            fatherId: '118',
            regMemo: null,
            regType: null,
            regTypeName: null,
            districtNo: null,
            postNo: '',
            validState: null,
            remark: null,
            lastOperator: null,
            lastUpdatetime: null,
            parentName: null,
            children: []
          },
          {
            tenancyId: null,
            id: null,
            regCode: '12304',
            regNo: null,
            regName: '泸州市',
            fatherId: '123',
            regMemo: null,
            regType: null,
            regTypeName: null,
            districtNo: null,
            postNo: '',
            validState: null,
            remark: null,
            lastOperator: null,
            lastUpdatetime: null,
            parentName: null,
            children: []
          },
          {
            tenancyId: null,
            id: null,
            regCode: '13201',
            regNo: null,
            regName: '香港市辖区',
            fatherId: '132',
            regMemo: null,
            regType: null,
            regTypeName: null,
            districtNo: null,
            postNo: '',
            validState: null,
            remark: null,
            lastOperator: null,
            lastUpdatetime: null,
            parentName: null,
            children: []
          },
          {
            tenancyId: null,
            id: null,
            regCode: '13301',
            regNo: null,
            regName: '澳门市辖区',
            fatherId: '133',
            regMemo: null,
            regType: null,
            regTypeName: null,
            districtNo: null,
            postNo: '',
            validState: null,
            remark: null,
            lastOperator: null,
            lastUpdatetime: null,
            parentName: null,
            children: []
          },
          {
            tenancyId: null,
            id: null,
            regCode: '10812',
            regNo: null,
            regName: '绥化市',
            fatherId: '108',
            regMemo: null,
            regType: null,
            regTypeName: null,
            districtNo: null,
            postNo: '',
            validState: null,
            remark: null,
            lastOperator: null,
            lastUpdatetime: null,
            parentName: null,
            children: []
          },
          {
            tenancyId: null,
            id: null,
            regCode: '11202',
            regNo: null,
            regName: '芜湖市',
            fatherId: '112',
            regMemo: null,
            regType: null,
            regTypeName: null,
            districtNo: null,
            postNo: '',
            validState: null,
            remark: null,
            lastOperator: null,
            lastUpdatetime: null,
            parentName: null,
            children: []
          },
          {
            tenancyId: null,
            id: null,
            regCode: '10811',
            regNo: null,
            regName: '黑河市',
            fatherId: '108',
            regMemo: null,
            regType: null,
            regTypeName: null,
            districtNo: null,
            postNo: '',
            validState: null,
            remark: null,
            lastOperator: null,
            lastUpdatetime: null,
            parentName: null,
            children: []
          },
          {
            tenancyId: null,
            id: null,
            regCode: '11909',
            regNo: null,
            regName: '茂名市',
            fatherId: '119',
            regMemo: null,
            regType: null,
            regTypeName: null,
            districtNo: null,
            postNo: '',
            validState: null,
            remark: null,
            lastOperator: null,
            lastUpdatetime: null,
            parentName: null,
            children: []
          },
          {
            tenancyId: null,
            id: null,
            regCode: '12902',
            regNo: null,
            regName: '海东地区',
            fatherId: '129',
            regMemo: null,
            regType: null,
            regTypeName: null,
            districtNo: null,
            postNo: '',
            validState: null,
            remark: null,
            lastOperator: null,
            lastUpdatetime: null,
            parentName: null,
            children: []
          },
          {
            tenancyId: null,
            id: null,
            regCode: '10301',
            regNo: null,
            regName: '石家庄市',
            fatherId: '103',
            regMemo: null,
            regType: null,
            regTypeName: null,
            districtNo: null,
            postNo: '',
            validState: null,
            remark: null,
            lastOperator: null,
            lastUpdatetime: null,
            parentName: null,
            children: []
          },
          {
            tenancyId: null,
            id: null,
            regCode: '10302',
            regNo: null,
            regName: '唐山市',
            fatherId: '103',
            regMemo: null,
            regType: null,
            regTypeName: null,
            districtNo: null,
            postNo: '',
            validState: null,
            remark: null,
            lastOperator: null,
            lastUpdatetime: null,
            parentName: null,
            children: []
          },
          {
            tenancyId: null,
            id: null,
            regCode: '10308',
            regNo: null,
            regName: '承德市',
            fatherId: '103',
            regMemo: null,
            regType: null,
            regTypeName: null,
            districtNo: null,
            postNo: '',
            validState: null,
            remark: null,
            lastOperator: null,
            lastUpdatetime: null,
            parentName: null,
            children: []
          },
          {
            tenancyId: null,
            id: null,
            regCode: '10502',
            regNo: null,
            regName: '包头市',
            fatherId: '105',
            regMemo: null,
            regType: null,
            regTypeName: null,
            districtNo: null,
            postNo: '',
            validState: null,
            remark: null,
            lastOperator: null,
            lastUpdatetime: null,
            parentName: null,
            children: []
          },
          {
            tenancyId: null,
            id: null,
            regCode: '11801',
            regNo: null,
            regName: '长沙市',
            fatherId: '118',
            regMemo: null,
            regType: null,
            regTypeName: null,
            districtNo: null,
            postNo: '',
            validState: null,
            remark: null,
            lastOperator: null,
            lastUpdatetime: null,
            parentName: null,
            children: []
          },
          {
            tenancyId: null,
            id: null,
            regCode: '12305',
            regNo: null,
            regName: '德阳市',
            fatherId: '123',
            regMemo: null,
            regType: null,
            regTypeName: null,
            districtNo: null,
            postNo: '',
            validState: null,
            remark: null,
            lastOperator: null,
            lastUpdatetime: null,
            parentName: null,
            children: []
          },
          {
            tenancyId: null,
            id: null,
            regCode: '10307',
            regNo: null,
            regName: '张家口市',
            fatherId: '103',
            regMemo: null,
            regType: null,
            regTypeName: null,
            districtNo: null,
            postNo: '',
            validState: null,
            remark: null,
            lastOperator: null,
            lastUpdatetime: null,
            parentName: null,
            children: []
          },
          {
            tenancyId: null,
            id: null,
            regCode: '10702',
            regNo: null,
            regName: '吉林市',
            fatherId: '107',
            regMemo: null,
            regType: null,
            regTypeName: null,
            districtNo: null,
            postNo: '',
            validState: null,
            remark: null,
            lastOperator: null,
            lastUpdatetime: null,
            parentName: null,
            children: []
          },
          {
            tenancyId: null,
            id: null,
            regCode: '10804',
            regNo: null,
            regName: '鹤岗市',
            fatherId: '108',
            regMemo: null,
            regType: null,
            regTypeName: null,
            districtNo: null,
            postNo: '',
            validState: null,
            remark: null,
            lastOperator: null,
            lastUpdatetime: null,
            parentName: null,
            children: []
          },
          {
            tenancyId: null,
            id: null,
            regCode: '10810',
            regNo: null,
            regName: '牡丹江市',
            fatherId: '108',
            regMemo: null,
            regType: null,
            regTypeName: null,
            districtNo: null,
            postNo: '',
            validState: null,
            remark: null,
            lastOperator: null,
            lastUpdatetime: null,
            parentName: null,
            children: []
          }
        ]
      }
      // 齐齐哈尔所对应的所有县
      let result3 = {
        code: '0',
        msg: '操作成功！',
        data: [
          {
            tenancyId: null,
            id: null,
            regCode: '1080201',
            regNo: null,
            regName: '市辖区',
            fatherId: '10802',
            regMemo: '黑龙江省齐齐哈尔市市辖区',
            regType: null,
            regTypeName: null,
            districtNo: null,
            postNo: '',
            validState: null,
            remark: null,
            lastOperator: null,
            lastUpdatetime: null,
            parentName: null,
            children: []
          },
          {
            tenancyId: null,
            id: null,
            regCode: '1080202',
            regNo: null,
            regName: '龙沙区',
            fatherId: '10802',
            regMemo: '黑龙江省齐齐哈尔市龙沙区',
            regType: null,
            regTypeName: null,
            districtNo: null,
            postNo: '',
            validState: null,
            remark: null,
            lastOperator: null,
            lastUpdatetime: null,
            parentName: null,
            children: []
          },
          {
            tenancyId: null,
            id: null,
            regCode: '1080203',
            regNo: null,
            regName: '建华区',
            fatherId: '10802',
            regMemo: '黑龙江省齐齐哈尔市建华区',
            regType: null,
            regTypeName: null,
            districtNo: null,
            postNo: '',
            validState: null,
            remark: null,
            lastOperator: null,
            lastUpdatetime: null,
            parentName: null,
            children: []
          },
          {
            tenancyId: null,
            id: null,
            regCode: '1080204',
            regNo: null,
            regName: '铁锋区',
            fatherId: '10802',
            regMemo: '黑龙江省齐齐哈尔市铁锋区',
            regType: null,
            regTypeName: null,
            districtNo: null,
            postNo: '',
            validState: null,
            remark: null,
            lastOperator: null,
            lastUpdatetime: null,
            parentName: null,
            children: []
          },
          {
            tenancyId: null,
            id: null,
            regCode: '1080205',
            regNo: null,
            regName: '昂昂溪区',
            fatherId: '10802',
            regMemo: '黑龙江省齐齐哈尔市昂昂溪区',
            regType: null,
            regTypeName: null,
            districtNo: null,
            postNo: '',
            validState: null,
            remark: null,
            lastOperator: null,
            lastUpdatetime: null,
            parentName: null,
            children: []
          },
          {
            tenancyId: null,
            id: null,
            regCode: '1080206',
            regNo: null,
            regName: '富拉尔基区',
            fatherId: '10802',
            regMemo: '黑龙江省齐齐哈尔市富拉尔基区',
            regType: null,
            regTypeName: null,
            districtNo: null,
            postNo: '',
            validState: null,
            remark: null,
            lastOperator: null,
            lastUpdatetime: null,
            parentName: null,
            children: []
          },
          {
            tenancyId: null,
            id: null,
            regCode: '1080207',
            regNo: null,
            regName: '碾子山区',
            fatherId: '10802',
            regMemo: '黑龙江省齐齐哈尔市碾子山区',
            regType: null,
            regTypeName: null,
            districtNo: null,
            postNo: '',
            validState: null,
            remark: null,
            lastOperator: null,
            lastUpdatetime: null,
            parentName: null,
            children: []
          },
          {
            tenancyId: null,
            id: null,
            regCode: '1080208',
            regNo: null,
            regName: '梅里斯达斡尔族区',
            fatherId: '10802',
            regMemo: '黑龙江省齐齐哈尔市梅里斯达斡尔族区',
            regType: null,
            regTypeName: null,
            districtNo: null,
            postNo: '',
            validState: null,
            remark: null,
            lastOperator: null,
            lastUpdatetime: null,
            parentName: null,
            children: []
          },
          {
            tenancyId: null,
            id: null,
            regCode: '1080209',
            regNo: null,
            regName: '龙江县',
            fatherId: '10802',
            regMemo: '黑龙江省齐齐哈尔市龙江县',
            regType: null,
            regTypeName: null,
            districtNo: null,
            postNo: '',
            validState: null,
            remark: null,
            lastOperator: null,
            lastUpdatetime: null,
            parentName: null,
            children: []
          },
          {
            tenancyId: null,
            id: null,
            regCode: '1080210',
            regNo: null,
            regName: '依安县',
            fatherId: '10802',
            regMemo: '黑龙江省齐齐哈尔市依安县',
            regType: null,
            regTypeName: null,
            districtNo: null,
            postNo: '',
            validState: null,
            remark: null,
            lastOperator: null,
            lastUpdatetime: null,
            parentName: null,
            children: []
          },
          {
            tenancyId: null,
            id: null,
            regCode: '1080211',
            regNo: null,
            regName: '泰来县',
            fatherId: '10802',
            regMemo: '黑龙江省齐齐哈尔市泰来县',
            regType: null,
            regTypeName: null,
            districtNo: null,
            postNo: '',
            validState: null,
            remark: null,
            lastOperator: null,
            lastUpdatetime: null,
            parentName: null,
            children: []
          },
          {
            tenancyId: null,
            id: null,
            regCode: '1080212',
            regNo: null,
            regName: '甘南县',
            fatherId: '10802',
            regMemo: '黑龙江省齐齐哈尔市甘南县',
            regType: null,
            regTypeName: null,
            districtNo: null,
            postNo: '',
            validState: null,
            remark: null,
            lastOperator: null,
            lastUpdatetime: null,
            parentName: null,
            children: []
          },
          {
            tenancyId: null,
            id: null,
            regCode: '1080213',
            regNo: null,
            regName: '富裕县',
            fatherId: '10802',
            regMemo: '黑龙江省齐齐哈尔市富裕县',
            regType: null,
            regTypeName: null,
            districtNo: null,
            postNo: '',
            validState: null,
            remark: null,
            lastOperator: null,
            lastUpdatetime: null,
            parentName: null,
            children: []
          },
          {
            tenancyId: null,
            id: null,
            regCode: '1080214',
            regNo: null,
            regName: '克山县',
            fatherId: '10802',
            regMemo: '黑龙江省齐齐哈尔市克山县',
            regType: null,
            regTypeName: null,
            districtNo: null,
            postNo: '',
            validState: null,
            remark: null,
            lastOperator: null,
            lastUpdatetime: null,
            parentName: null,
            children: []
          },
          {
            tenancyId: null,
            id: null,
            regCode: '1080215',
            regNo: null,
            regName: '克东县',
            fatherId: '10802',
            regMemo: '黑龙江省齐齐哈尔市克东县',
            regType: null,
            regTypeName: null,
            districtNo: null,
            postNo: '',
            validState: null,
            remark: null,
            lastOperator: null,
            lastUpdatetime: null,
            parentName: null,
            children: []
          },
          {
            tenancyId: null,
            id: null,
            regCode: '1080216',
            regNo: null,
            regName: '拜泉县',
            fatherId: '10802',
            regMemo: '黑龙江省齐齐哈尔市拜泉县',
            regType: null,
            regTypeName: null,
            districtNo: null,
            postNo: '',
            validState: null,
            remark: null,
            lastOperator: null,
            lastUpdatetime: null,
            parentName: null,
            children: []
          },
          {
            tenancyId: null,
            id: null,
            regCode: '1080217',
            regNo: null,
            regName: '讷河市',
            fatherId: '10802',
            regMemo: '黑龙江省齐齐哈尔市讷河市',
            regType: null,
            regTypeName: null,
            districtNo: null,
            postNo: '',
            validState: null,
            remark: null,
            lastOperator: null,
            lastUpdatetime: null,
            parentName: null,
            children: []
          },
          {
            tenancyId: null,
            id: null,
            regCode: '1110802',
            regNo: null,
            regName: '柯城区',
            fatherId: '11108',
            regMemo: '浙江省衢州市柯城区',
            regType: null,
            regTypeName: null,
            districtNo: null,
            postNo: '',
            validState: null,
            remark: null,
            lastOperator: null,
            lastUpdatetime: null,
            parentName: null,
            children: []
          },
          {
            tenancyId: null,
            id: null,
            regCode: '1310802',
            regNo: null,
            regName: '温宿县',
            fatherId: '13108',
            regMemo: '新疆维吾尔自治区阿克苏地区温宿县',
            regType: null,
            regTypeName: null,
            districtNo: null,
            postNo: '',
            validState: null,
            remark: null,
            lastOperator: null,
            lastUpdatetime: null,
            parentName: null,
            children: []
          }
        ]
      }
      // 价格体系初始化
      this.priceSystemData = result1.data.priceSystem
      // 获取所有的市
      this.citiesData = result2.data
      // 加载市下面的县
      this.countiesData = result3.data
      // 初始化业态数据
      this.formatStateData = result1.data.formatState
      // 初始化地区级别数据
      this.arealevelData = result1.data.arealevel
      // 初始化门店类型
      this.storeTypeData = result1.data.storeTypes
      // 初始化上级门店
      this.allStores = result1.data.allStores
      this.sameBrandStores = result1.data.sameBrandStores
      // 初始化经营方式
      this.manageTypeData = result1.data.manageTypes
      // 初始化店面级别
      this.storelevelData = result1.data.storelevel
      // 初始化法人
      this.legalPerData = result1.data.legalPer
      //
      */
      // 监听，获取经纬度
      EventBus.$on('getJwd', (addressDetail) => {
        // console.log('监听并获取到了选取地址的详细信息：', addressDetail)
        // 初始化地址详情
        this.addressDetail = addressDetail
        // 初始化经纬度
        this.form.longitude = addressDetail.lng
        this.form.latitude = addressDetail.lat
      })
      //
      // 初始化数据
      this.initData()
      //
      // 监听，富文本
      EventBus.$on('getContent', (content) => {
        // console.log('监听到富文本变化')
        this.form.summary = content
      })
    },
    mounted () {
      if (this.$refs.carouselPreview) {
        // 为轮播图中的按钮添加type=button，防止表单中点击后提交表单
        let btns = this.$refs.carouselPreview.$el.querySelectorAll('button')
        // console.log('updated: ', btns)
        for (let i = 0; i < btns.length; i++) {
          btns[i].setAttribute('type', 'button')
        }
      }
    },
    updated () {
      if (this.$refs.carouselPreview) {
        // 为轮播图中的按钮添加type=button，防止表单中点击后提交表单
        let btns = this.$refs.carouselPreview.$el.querySelectorAll('button')
        // console.log('updated: ', btns)
        for (let i = 0; i < btns.length; i++) {
          btns[i].setAttribute('type', 'button')
        }
      }
    },
    data () {
      let numCharCheck = (rule, value, callback) => { // 数字字符检测
        let errors = []
        if (value != null) {
          value = value.trim()
          if (!/^[0-9a-zA-Z\\/_\-\\.]*$/.test(value)) {
            errors.push(new Error('请输入数字或字符'))
          }
        }
        callback(errors)
      }
      let numCheck = (rule, value, callback) => { // 数字检测
        let errors = []
        if (value != null) {
          if (!/^[0-9]*$/.test(value)) {
            errors.push(new Error('请输入数字'))
          }
        }
        callback(errors)
      }
      return {
        //
        brandId: null,
        //
        storeParams: null, // vuex状态参数
        //
        form: {
          //
          id: null, // 机构ID，编辑的时候有值
          //
          orgType: null, // 机构类型
          //
          orgFullName: null, // 机构名称
          orgShortName: null, // 机构简称
          topOrgId: null, // 上级机构的ID
          formatState: null, // 业态ID
          //
          priceSystem: null, // 价格体系ID
          priceSystemName: null, // 价格体系名称
          //
          regionalism: null, // 机构所在区域的编码
          arealevel: null, // 地区级别ID
          storeType: null, // 门店类型代码
          fatherStore: null, // 上级门店
          //
          manageType: null, // 经营方式ID
          storelevel: null, // 店面级别ID
          poiId: null, // 新美大POI_ID
          //
          legalPer: null, // 法人ID
          legalPerName: null, // 法人名称
          //
          storeManagerNo: null, // 店长工号
          storeManagerName: null, // 店长姓名
          phone: null, // 联系电话
          complainPhone: null, // 投诉电话
          setupDate: null, // 开业日期
          contractCloseDate: null, // 合同终止日期
          website: null, // 网址
          email: null, // 邮件
          bussinessArea: null, // 营业面积
          businessHours: null, // 营业时间
          labelValue: null, // 门店标签
          cuisine: null, // 菜系
          is24time: null, // 24小时营业
          isDelivery: null, // 可提供外卖
          isPhonebook: null, // 可提供CC
          isWebbook: null, // 可提供网订
          remark: null, // 备注
          //
          thirdCode: null, // 二维码编号
          wechat: null, // 微信收款账号
          bookFoodPhone: null, // 订餐电话
          avgprice: null, // 人均消费
          address: null, // 店面地址
          busRoute: null, // 公交线路
          //
          longitude: null, // 经度
          latitude: null, // 维度
          //
          image1: null, // logo
          image2: null, // 轮播图，使用逗号分隔
          image3: null, // 微信门店背景图
          isWechatydzw: null, // 可提供微信预定餐位
          isWechatdddc: null, // 可提供微信到店点餐
          isWechatwmzt: null, // 可提供微信外卖自提
          isWechatpddh: null, // 可提供微信排号等号
          summary: null // 微信设置
        },
        rules: {
          orgFullName: [
            { required: true, message: '请输入30个以内的汉字或字符', trigger: 'blur' },
            { min: 1, max: 30, message: '请输入30个以内的汉字或字符', trigger: 'change' },
            { whitespace: true, message: '请输入30个以内的汉字或字符', trigger: 'change' }
          ],
          orgShortName: [
            { required: true, message: '请输入20个以内的汉字或字符', trigger: 'blur' },
            { min: 1, max: 20, message: '请输入20个以内的汉字或字符', trigger: 'change' },
            { whitespace: true, message: '请输入20个以内的汉字或字符', trigger: 'change' }
          ],
          topOrgId: [
            { required: true, message: '请返回选择上级机构', trigger: 'change' }
          ],
          //
          priceSystemName: [ // 价格体系名称 // 必填
            { required: true, message: '输入名称快速查找', trigger: 'change' },
            { required: true, message: '输入名称快速查找', trigger: 'blur' },
            { min: 1, max: 20, message: '请输入20个以内的汉字或字符', trigger: 'change' },
            { whitespace: true, message: '请输入20个以内的汉字或字符', trigger: 'change' }
          ],
          //
          formatState: [ { required: true, message: '请选择业态', trigger: 'change' } ],
          regionalism: [ { required: true, message: '请选择城市地区', trigger: 'change' } ],
          //
          legalPerName: [ // 法人名称 // 可选
            { min: 0, max: 20, message: '请输入20个以内的汉字或字符', trigger: 'change' },
            { whitespace: true, message: '请输入20个以内的汉字或字符', trigger: 'change' }
          ],
          poiId: [ { validator: numCharCheck, trigger: 'blur' }, { min: 0, max: 20, message: '请输入20个以内的数字或字符', trigger: 'blur' } ],
          storeManagerNo: [ { validator: numCharCheck, trigger: 'blur' }, { min: 0, max: 20, message: '请输入20个以内的数字或字符', trigger: 'blur' } ],
          storeManagerName: [ { min: 0, max: 20, message: '请输入20个以内的汉字或字符', trigger: 'blur' } ],
          phone: [ { validator: numCharCheck, trigger: 'blur' }, { min: 0, max: 20, message: '请输入20个以内的数字或字符', trigger: 'blur' } ],
          complainPhone: [ { validator: numCharCheck, trigger: 'blur' }, { min: 0, max: 20, message: '请输入20个以内的数字或字符', trigger: 'blur' } ],
          website: [ { validator: numCharCheck, trigger: 'blur' }, { min: 0, max: 100, message: '请输入100个以内的数字或字符', trigger: 'blur' } ],
          email: [ { type: 'email', message: '请输入有效的Email地址', trigger: 'blur' } ],
          bussinessArea: [ { validator: numCheck, trigger: 'blur' } ],
          businessHours: [ { type: 'string', min: 0, max: 20, message: '请输入20个以内的汉字或字符', trigger: 'blur' } ],
          labelValue: [ { type: 'string', min: 0, max: 100, message: '最多不能超过100个字符', trigger: 'blur' } ],
          cuisine: [ { type: 'string', min: 0, max: 100, message: '最多不能超过100个字符', trigger: 'blur' } ],
          remark: [ { type: 'string', min: 0, max: 100, message: '请输入100个以内的汉字或字符', trigger: 'blur' } ],
          //
          thirdCode: [ { validator: numCharCheck, trigger: 'blur' }, { min: 0, max: 20, message: '请输入20个以内的数字或字符', trigger: 'blur' } ],
          wechat: [ { validator: numCharCheck, trigger: 'blur' }, { min: 0, max: 20, message: '请输入20个以内的数字或字符', trigger: 'blur' } ],
          bookFoodPhone: [ { validator: numCharCheck, trigger: 'blur' }, { min: 0, max: 20, message: '请输入20个以内的数字或字符', trigger: 'blur' } ],
          avgprice: [ { validator: numCheck, trigger: 'blur' } ],
          address: [ { type: 'string', min: 0, max: 100, message: '请输入100个以内的汉字或字符', trigger: 'blur' } ],
          busRoute: [ { type: 'string', min: 0, max: 100, message: '请输入100个以内的汉字或字符', trigger: 'blur' } ]
        },
        url: `${process.env.API_ROOT}/organization/upload/uploadFile`,
        //
        topOrgId: '', // 上级机构的ID
        topOrgName: '', // 上级机构的名称
        topLevel: '', // 上级机构的级别
        topOrganCode: '', // 上级机构的编码
        //
        showPriceSystemList: false, // 显示价格体系列表
        priceSystemOptions: [], // 价格体系选项数组
        priceSystemData: [], // 价格体系数据
        //
        citiesData: [], // 市 //  市、县联动
        citiesOptions: [], // 下拉选择城市数据
        countiesData: [], // 县
        regionalismName: '', // 机构所在区域的名称
        showCitiesList: false, // 显示城市列表
        showCountiesList: false, // 显示县列表
        //
        formatStateData: [], // 业态数据
        //
        arealevelData: [], // 地区级别数据
        //
        storeTypeData: [], // 门店类型
        //
        fatherStoreData: [], // 上级门店数据
        showFatherStore: false, // 显示上级门店
        allStores: [], // 所有门店
        sameBrandStores: [], // 同品牌的门店
        //
        manageTypeData: [], // 经营方式数据
        //
        storelevelData: [], // 店面级别
        //
        showLegalList: false, // 是否显示法人下拉列表
        legalPerOptions: [], // 法人选项
        legalPerData: [], // 所有法人数据
        //
        showBaiduMap: false, // 显示百度地图
        addressDetail: null, // 选取的地址详情
        //
        image2Arr: [] // 轮播图数组
      }
    },
    watch: {
      priceSystemName (value) { // 监测价格体系
        if (value !== null) {
          value = value.trim()

          this.priceSystemOptions = this.priceSystemData.filter(item => {
            return item.priceSystemName && item.priceSystemName.indexOf(value) > -1
          })

          let index = this.priceSystemData.findIndex(item => {
            return item.priceSystemName && item.priceSystemName === value
          })

          if (index === -1 && value !== '') { // 添加价格体系
            this.priceSystemOptions.push({
              id: null,
              priceSystemName: value
            })
          }
        } else {
          this.priceSystemOptions = this.priceSystemData
        }
      },
      legalPerName (value) { // 监测法人
        if (value !== null) {
          value = value.trim()

          this.legalPerOptions = this.legalPerData.filter(item => {
            return item.legalPerName && item.legalPerName.indexOf(value) > -1
          })

          let index = this.legalPerData.findIndex(item => {
            return item.legalPerName && item.legalPerName === value
          })

          if (index === -1 && value !== '') { // 添加法人
            this.legalPerOptions.push({
              id: null,
              legalPerName: value
            })
          }
        } else {
          this.legalPerOptions = this.legalPerData
        }
      },
      //
      regionalismName (value) { // 监测城市
        if (value) {
          value = value.trim()
          this.citiesOptions = this.citiesData.filter(item => {
            return item.regName && item.regName.indexOf(value) > -1
          })
        } else {
          this.citiesOptions = this.citiesData
        }
      }
    },
    methods: {
      initData () {
        // 获取vuex门店参数状态
        this.storeParams = this.getStoreParams
        // console.log('状态数据：', this.storeParams)
        //
        // 初始化品牌ID
        this.brandId = this.storeParams.brandId
        // console.log('品牌ID：', this.brandId)
        //
        // 初始化上级
        if (this.storeParams.topOrg) {
          //
          this.topOrgId = this.storeParams.topOrg.id // 上级机构的ID
          this.topOrgName = this.storeParams.topOrg.orgFullName // 上级机构的名称（用于显示）
          //
          this.topLevel = this.storeParams.topOrg.level
          this.topOrganCode = this.storeParams.topOrg.organCode
          //
          this.form.topOrgId = this.storeParams.topOrg.id // 添加、编辑都要使用
        }
        //
        // 初始化机构类型
        this.form.orgType = this.storeParams.orgType
        //
        // 初始化combobox
        this.getComboboxAjax(() => {
          if (this.storeParams.organiza) { // 编辑
            let store = this.storeParams.organiza
            //
            this.form.id = store.id
            //
            this.form.orgFullName = store.orgFullName // 机构名称
            this.form.orgShortName = store.orgShortName // 机构简称
            this.form.formatState = store.formatState // 业态ID
            //
            this.form.priceSystem = store.priceSystem // 价格体系ID（新增价格体系的时候，ID为null，选择已有的时ID不为null）
            this.form.priceSystemName = store.priceSystemName // 价格体系名称
            //
            this.form.regionalism = store.regionalism // 机构所在区域的编码
            //
            this.form.arealevel = store.arealevel // 地区级别ID
            this.form.storeType = store.storeType // 门店类型代码
            this.handleStoreTypeSelectChange(this.form.storeType) // 根据门店类型，处理上级门店
            this.form.fatherStore = store.fatherStore // 上级门店
            //
            this.form.regionalism = store.regionalism
            this.regionalismName = store.regionName
            //
            this.form.manageType = store.manageType // 经营方式ID
            this.form.storelevel = store.storelevel // 经营方式ID
            this.form.poiId = store.poiId // 经营方式ID
            //
            this.form.legalPer = store.legalPer // 法人ID
            this.form.legalPerName = store.legalPerName // 法人名称
            //
            this.form.storeManagerNo = store.storeManagerNo // 店长工号
            this.form.storeManagerName = store.storeManagerName // 店长姓名
            this.form.phone = store.phone // 联系电话
            this.form.complainPhone = store.complainPhone // 投诉电话
            //
            this.form.setupDate = DateUtil.dateFilter(store.setupDate, '2', 'YYYY-MM-DD') // 开业日期
            this.form.contractCloseDate = DateUtil.dateFilter(store.contractCloseDate, '2', 'YYYY-MM-DD') // 合同终止日期
            // console.log(store.setupDate, store.contractCloseDate)
            //
            this.form.website = store.website // 网址
            this.form.email = store.email // 邮箱
            this.form.bussinessArea = store.bussinessArea // 营业面积
            this.form.businessHours = store.businessHours // 营业时间
            this.form.labelValue = store.labelValue // 门店标签
            this.form.cuisine = store.cuisine // 菜系
            this.form.is24time = store.is24time // 24小时营业
            this.form.isDelivery = store.isDelivery // 可提供外卖
            this.form.isPhonebook = store.isPhonebook // 可提供CC
            this.form.isWebbook = store.isWebbook // 可提供网订
            this.form.remark = store.remark // 备注
            //
            this.form.thirdCode = store.thirdCode // 二维码编号
            this.form.wechat = store.wechat // 微信收款账号
            this.form.bookFoodPhone = store.bookFoodPhone // 订餐电话
            this.form.avgprice = store.avgprice // 人均消费
            this.form.address = store.address // 店面地址
            this.form.busRoute = store.busRoute // 公交线路
            //
            this.form.longitude = store.longitude // 经度
            this.form.latitude = store.latitude // 维度
            //
            this.form.image1 = store.image1 // logo
            this.form.image2 = store.image2 // 轮播图，使用逗号分隔
            this.image2Arr = store.image2 ? store.image2.split(',') : [] // 轮播图数据构建
            this.form.image3 = store.image3 // 微信门店背景图
            //
            this.form.isWechatydzw = store.isWechatydzw // 可提供微信预定餐位
            this.form.isWechatdddc = store.isWechatdddc // 可提供微信到店点餐
            this.form.isWechatwmzt = store.isWechatwmzt // 可提供微信外卖自提
            this.form.isWechatpddh = store.isWechatpddh // 可提供微信排号等号
            //
            this.form.summary = store.summary // 微信设置
          }
        })
        // 初始化城市
        this.getCitiesDataAjax()
      },
      // Combobox
      // 上级门店（所有门店、同品牌下的所有门店）、价格体系、业态、地区级别、门店类型、经营方式、法人、店面级别
      getComboboxAjax (callback) {
        this.$http
          .post('/api/organization/organ/getCombobox', { brandId: this.brandId })
          .then(res => {
            // console.log('Combobox：', res)
            try {
              if (res.data.code === '0') {
                // 价格体系初始化
                this.priceSystemData = res.data.data.priceSystem
                this.priceSystemOptions = res.data.data.priceSystem
                // console.log(this.priceSystemOptions)
                // 业态初始化
                this.formatStateData = res.data.data.formatState
                // 地区级别初始化
                this.arealevelData = res.data.data.arealevel
                // 门店类型初始化
                this.storeTypeData = res.data.data.storeTypes
                // 上级门店初始化
                this.allStores = res.data.data.allStores
                this.sameBrandStores = res.data.data.sameBrandStores
                //
                // 编辑的时候，从上级机构中，剔除掉当前正在编辑的机构
                if (this.storeParams.organiza && this.storeParams.organiza.id) {
                  let id = this.storeParams.organiza.id
                  let index = this.allStores.findIndex(item => {
                    return item.id === id
                  })
                  if (index !== -1) {
                    this.allStores.splice(index, 1)
                  }
                  index = -1
                  index = this.sameBrandStores.findIndex(item => {
                    return item.id === id
                  })
                  if (index !== -1) {
                    this.sameBrandStores.splice(index, 1)
                  }
                }
                //
                // 初始化经营方式
                this.manageTypeData = res.data.data.manageTypes
                // 初始化店面级别
                this.storelevelData = res.data.data.storelevel
                // 初始化法人
                this.legalPerData = res.data.data.legalPer
                this.legalPerOptions = res.data.data.legalPer
                // console.log(this.legalPerOptions)
                //
                callback()
              } else {
                this.$message({ type: 'error', message: res.data.msg })
              }
            } catch (error) {
              console.log(error)
            }
          })
          .catch(err => {
            this.$message({ type: 'error', message: err.msg })
          })
      },
      getCitiesDataAjax () { // 获取所有城市ajax
        this.$http
          .post('/api/organization/organ/getRegionalism', {})
          .then(res => {
            if (res.data.code === '0') {
              // console.log('城市：', res)
              this.citiesData = res.data.data
              //
              this.citiesOptions = res.data.data // 城市下拉框数据
              //
            } else {
              this.$message({ type: 'error', message: res.data.msg })
            }
          })
          .catch(err => {
            this.$message({ type: 'error', message: err.msg })
          })
      },
      getCountiesDataAjax (code) { // 根据城市code获取所有县ajax
        this.$http
          .post('/api//organization/organ/getRegionalismTreeChild', { regCode: code })
          .then(res => {
            if (res.data.code === '0') {
              // console.log('获取的县元数据：', res)
              this.countiesData = res.data.data
            } else {
              this.$message({ type: 'error', message: res.data.msg })
            }
          })
          .catch(err => {
            this.$message({ type: 'error', message: err.msg })
          })
      },
      //
      clearPriceSystem () { // 清除价格体系
        this.showPriceSystemList = false
        //
        this.form.priceSystem = null
        this.form.priceSystemName = null
      },
      selectPriceSystem (priceSystem) { // 选择价格体系
        this.showPriceSystemList = false
        //
        this.form.priceSystem = priceSystem.id
        this.form.priceSystemName = priceSystem.priceSystemName
      },
      //
      clearLegal () { // 清除法人
        this.showLegalList = false
        //
        this.form.legalPer = null
        this.form.legalPerName = null
      },
      selectLegal (legal) { // 选择法人
        this.showLegalList = false
        //
        this.form.legalPer = legal.id
        this.form.legalPerName = legal.legalPerName
      },
      //
      loadCounties (city) { // 加载城市下面的县
        this.countiesData = []
        this.showCountiesList = true
        // 根据城市的regCode发请求获取县
        this.getCountiesDataAjax(city.regCode)
      },
      selectRegionalism (county) { // 选择市下面的县，这里面包含省市县三级的组合名称，提交的时候提交这个编码
        this.form.regionalism = county.regCode // 用于提交
        this.regionalismName = county.regMemo // 用于显示
        // 选择完之后，隐藏
        this.showCountiesList = false
        this.showCitiesList = false
        // this.countiesData = []
      },
      handleStoreTypeSelectChange (value) { // 处理门店类型选择改变
        this.fatherStoreData = []
        this.form.fatherStore = null
        switch (value) {
          case '1': // 单店 // 隐藏上级门店
            this.showFatherStore = false
            break
          case '2': // 子店 // 可选择所有门店
            this.showFatherStore = true
            this.fatherStoreData = this.allStores
            break
          case '3': // 母店 // 只可选择同品牌下门店
            this.showFatherStore = true
            this.fatherStoreData = this.sameBrandStores
            break
          default:
            this.showFatherStore = false
        }
      },
      submitAjax (callback) {
        this.$http
          .post('/api/organization/organ/save', { form: this.form, level: this.topLevel, organCode: this.topOrganCode })
          .then(res => {
            if (res.data.code === '0') {
              this.$message({ type: 'success', message: res.data.msg })
              callback()
            } else {
              this.$message({ type: 'error', message: res.data.msg })
            }
          })
          .catch(err => {
            this.$message({ type: 'error', message: err.msg })
          })
      },
      submit () { // 提交表单
        // console.log(this.form, this.topLevel, this.topOrg)
        this.$refs.form.validate((valid) => {
          if (valid) {
            // console.log('验证通过可以提交表单', this.form, this.topLevel, this.topOrg)
            this.submitAjax(() => {
              this.close()
              //
              EventBus.$emit('reload') // 添加/编辑后通知父组件重新reload
              //
            })
          }
        })
      },
      submitContinue () { // 提交并继续
        // console.log(this.form, this.topLevel, this.topOrg)
        this.$refs.form.validate((valid) => {
          if (valid) {
            // console.log('验证通过可以提交表单', this.form, this.topLevel, this.topOrg)
            this.submitAjax(() => {
              this.holdFormFields()
            })
          }
        })
      },
      holdFormFields () { // 保存并继续，保留以下数据：上级机构、价格体系、业态、城市地区、地区级别
        // 设置状态 // 新增/编辑提交后应该下次都是新增
        this.storeParams.organiza = null
        this.$store.dispatch('setStoreParams', this.storeParams)
        this.storeParams = this.getStoreParams

        let holdFields = ['orgType', 'topOrgId', 'formatState', 'priceSystem', 'priceSystemName', 'regionalism', 'arealevel']
        for (let k in this.form) {
          if (holdFields.indexOf(k) !== -1) {
            // console.log(k)
            continue
          }
          this.form[k] = null
        }
        // 法人相关项清除
        // this.legalPerName = null // 法人名称
        // 轮播图相关项清除
        this.image2Arr = null
        // 上级门店相关项清除
        this.handleStoreTypeSelectChange(null)
        //
        console.log('状态数据：', this.storeParams)
      },
      close () { // 关闭
        this.$router.go(-1)
      },
      //
      beforeLogoUpload (file) { // 上传logo
        return this.beforeUpload(file, 50)
      },
      handleLogoSuccess (res, file) {
        this.uploadSuccess(res, file, url => {
          this.form.image1 = url
        })
      },
      beforeWxStoreBgUpload (file) { // 上传微信背景图
        return this.beforeUpload(file, 300)
      },
      handleWxStoreBgSuccess (res, file) {
        this.uploadSuccess(res, file, url => {
          this.form.image3 = url
        })
      },
      beforeCarouselUpload (file) { // 上传轮播图
        return this.beforeUpload(file, 500)
      },
      handleCarouselSuccess (res, file) {
        this.uploadSuccess(res, file, url => {
          this.image2Arr.push(url)
          this.form.image2 = this.image2Arr.join(',')
        })
      },
      //
      beforeUpload (file, limitK) { // 上传之前（公用）（KB）
        const isJPGPNG = file.type === 'image/jpeg' || file.type === 'image/png'
        const isLtLimit = file.size < limitK * 1024

        if (!isJPGPNG) {
          this.$message.error('上传图片只能是 JPG/PNG 格式!')
        }
        if (!isLtLimit) {
          this.$message.error(`上传图片大小不能超过 ${limitK}K!`)
        }

        return isJPGPNG && isLtLimit
      },
      uploadSuccess (res, file, callback) { // res // {error: 0, url: "http://test.e7e6.net:7778/group1/M00/02/F1/wKggEFpm7rqAGTk-AADHhBgcwxw421.png"}
        console.log('上传成功回调res=', res, 'file=', file)
        try {
          if (res.error === 0) {
            callback(res.url)
            this.$message({ type: 'success', message: '上传成功' })
          } else {
            this.$message({ type: 'error', message: '上传失败' })
          }
        } catch (error) {
          this.$message({ type: 'error', message: '上传失败' })
        }
      },
      //
      selectJwd () {
        this.showBaiduMap = true
        console.log('显示百度地图')
      },
      closeBaiduMap () {
        this.showBaiduMap = false
        console.log('关闭百度地图')
      },
      //
      trim (field) { // form表单：去除前后导空格
        if (this.form[field] != null) {
          this.form[field] = this.form[field].trim()
        }
      }
    },
    computed: {
      getStoreParams () { // 获取门店参数状态
        return this.$store.getters.getStoreParams
      },
      enabled () {
        return this.form.orgFullName && this.form.orgShortName && this.form.topOrgId && this.form.priceSystemName && this.form.formatState && this.form.regionalism
      },
      //
      priceSystemName () { // 通过计算属性监测form对象中的价格体系的名称属性
        return this.form.priceSystemName
      },
      legalPerName () { // 通过计算属性监测form对象中的法人的名称属性
        return this.form.legalPerName
      }
    },
    components: {
      'baiduMap': baiduMap,
      'tzxQuillEditor': tzxQuillEditor
    }
  }
</script>
