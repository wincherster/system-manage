<template>
  <transition name="fade">
    <div class="baidu-map-container tzx-pop-dialog-window" v-if="showBaiduMap">
      <div class="body" ref="popDialogBody">
        <div class="head">
          <h3 class="title">点击地图标注位置</h3>
          <i class="saas iconfont saas-nav-closehover close-icon-btn" @click="close"></i>
        </div>
        <div class="main">
          <div class="search-container">
            <el-input placeholder="快速查找" v-model="searchKeyWords" clearable @blur="searchKeyWords = searchKeyWords.trim()">
              <template slot="append">
                <i slot="suffix" class="saas iconfont saas-seach" ref="searchBtn"></i>
              </template>
            </el-input>
          </div>
          <div ref="baiduMap" class="baidu-map"></div>
        </div>
        <div class="opt">
          <el-button class="kxBtn" @click="close">取消</el-button>
          <el-button type="primary" class="sxBtn" @click="submit">确定</el-button>
        </div> 
      </div>
    </div>
  </transition>
</template>
<script>
import '../../../../../assets/less/tzx-pop-dialog-window.css'
import EventBus from '../../../../../utils/EventBus.js'
import BMap from 'BMap'
import BMAP_ANIMATION_BOUNCE from 'BMAP_ANIMATION_BOUNCE'
import BMAP_ANCHOR_TOP_LEFT from 'BMAP_ANCHOR_TOP_LEFT'
import BMAP_ANCHOR_TOP_RIGHT from 'BMAP_ANCHOR_TOP_RIGHT'
import BMAP_NAVIGATION_CONTROL_LARGE from 'BMAP_NAVIGATION_CONTROL_LARGE'
import BMAP_NORMAL_MAP from 'BMAP_NORMAL_MAP'
import BMAP_HYBRID_MAP from 'BMAP_HYBRID_MAP'
export default {
  props: ['showBaiduMap'],
  data () {
    return {
      showPopDialogBody: this.showBaiduMap,
      addressDetail: '', // 地址详情
      searchKeyWords: '' // 查询关键字
    }
  },
  created () {
    console.log(this.showBaiduMap)
  },
  mounted () {
    if (this.showPopDialogBody) {
      this.showBody()
    }
    this.initBaiduMap()
  },
  methods: {
    submit () {
      if (this.addressDetail) {
        console.log('你选取的位置是：', this.addressDetail.text, this.addressDetail.lng, this.addressDetail.lat)
        EventBus.$emit('getJwd', this.addressDetail)
        this.close()
      } else {
        const h = this.$createElement
        this.$msgbox({
          title: '',
          type: 'info',
          message: h('div', null, [ h('p', null, '您还没选取位置') ]),
          confirmButtonText: '知道了',
          confirmButtonClass: 'saasbtn saasbtn-default',
          showClose: false
        })
      }
    },
    close: function () {
      this.$emit('close')
    },
    showBody () { // 显示body
      this.$refs.popDialogBody.style.transform = 'scale(1)'
      this.$refs.popDialogBody.style.opacity = 1
    },
    initBaiduMap () {
      let map = new BMap.Map(this.$refs.baiduMap) // 创建Map实例

      let point = new BMap.Point(116.404, 39.915) // 创建点坐标
      map.centerAndZoom(point, 15)

      map.enableScrollWheelZoom() // 启用滚轮放大缩小，默认禁用
      map.enableContinuousZoom() // 启用地图惯性拖拽，默认禁用

      new BMap.LocalCity().get(result => { // 根据IP定位
        console.log('IP定位：', result.name)
        map.setCenter(result.name)
      })

      let geoc = new BMap.Geocoder() // 逆地址解析
      // 为地图添加点击事件
      // 1. 获取经纬度
      // 2. 添加标注
      // 3. 逆地址解析，获取改坐标的城市街道信息
      map.addEventListener('click', (e) => {
        let jwd = { lng: e.point.lng, lat: e.point.lat } // 获取经纬度坐标

        map.clearOverlays() // 清除覆盖物

        let point = new BMap.Point(jwd.lng, jwd.lat) // 创建覆盖物（标注点）
        let marker = new BMap.Marker(point) // 创建标注
        map.addOverlay(marker) // 将标注添加到地图中
        marker.setAnimation(BMAP_ANIMATION_BOUNCE) // DROP坠落动画 // BMAP_ANIMATION_BOUNCE跳动的动画

        let addressDetail = {}
        let pt = e.point
        geoc.getLocation(pt, (rs) => { // 逆地址解析，获取地址详情
          let addComp = rs.addressComponents
          addressDetail = addComp
          addressDetail.lng = jwd.lng
          addressDetail.lat = jwd.lat
          addressDetail.text = addressDetail.province + addressDetail.city + addressDetail.district + addressDetail.street + addressDetail.streetNumber
          //
          let label = new BMap.Label(`<p>已标注</p><p>${addressDetail.text}</p>`, { offset: new BMap.Size(-20, -66) }) // 为标注点添加文字标签
          label.setStyle({
            borderRadius: '3px',
            fontFamily: ['PingFangSC-Regular', '微软雅黑'],
            fontSize: '12px',
            color: '#6C7D8E',
            lineHeight: '16px',
            padding: '5px 10px',
            textAlign: 'center',
            boxShadow: '1px 1px 4px rgba(255,0,0,.3)'
          })
          marker.setLabel(label)
          //
          this.addressDetail = addressDetail
        })
      })

      let local = new BMap.LocalSearch(map, { // 关键字检索
        renderOptions: { map: map }
      })
      this.$refs.searchBtn.onclick = () => {
        local.search(this.searchKeyWords)
      }

      map.addControl(new BMap.NavigationControl({ // 添加平移缩放控件
        anchor: BMAP_ANCHOR_TOP_LEFT, // 左上角，添加比例尺
        type: BMAP_NAVIGATION_CONTROL_LARGE, // LARGE类型 // 标准的平移缩放控件（包括平移、缩放按钮和滑块）
        offset: new BMap.Size(26, 40)
      }))

      let geolocationControl = new BMap.GeolocationControl({ // 添加定位控件
        offset: new BMap.Size(31, 500 - 270),
        showAddressBar: false
      })
      geolocationControl.addEventListener('locationSuccess', (e) => { // 定位成功事件
        let address = ''
        address += e.addressComponent.province
        address += e.addressComponent.city
        address += e.addressComponent.district
        address += e.addressComponent.street
        address += e.addressComponent.streetNumber
        this.$message({
          message: '定位成功：' + address
        })
      })
      geolocationControl.addEventListener('locationError', (e) => { // 定位失败事件
        this.$message.info('定位失败')
        console.log(e.message)
      })
      map.addControl(geolocationControl)

      map.addControl(new BMap.CityListControl({ // 添加城市列表控件
        anchor: BMAP_ANCHOR_TOP_RIGHT,
        offset: new BMap.Size(10, 10)
      }))
      //
      map.addControl(new BMap.MapTypeControl({ // 添加地图类型控件
        anchor: BMAP_ANCHOR_TOP_LEFT,
        offset: new BMap.Size(10, 10),
        mapTypes: [
          BMAP_NORMAL_MAP, // 此地图类型展示普通街道视图
          BMAP_HYBRID_MAP  // 此地图类型展示卫星和路网的混合视图
        ]
      }))
      //
      map.setDefaultCursor('crosshair') // 设置默认的鼠标样式
    }
  }
}
</script>

<style scoped lang='less'>
.baidu-map-container {
  > .body {
    width: 800px;
    min-width: 800px;
    height: 596px;
    min-height: 596px;
    > .main {
      .search-container {
        width: 230px;
        position: absolute;
        top: 10px;
        right: 100px;
        z-index: 1;
      }
      .baidu-map {
        width: 100%;
        height: 100%;
      }
    }
  }
}
</style>


      