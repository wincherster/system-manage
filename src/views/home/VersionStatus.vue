<template>
  <div class="pos">
    <h3 class="title">POS版本统计</h3>
    <div class='split-line'></div>
    <div class="content">
      <div class="pos-version-statistic-view">
        <div id="pos-pie" style="width: 204px;height:204px;"></div>
        <div class="pos-legend">
          <ul>
            <li @mouseout="handleMouseout" @mouseover='handleClick(item.name)' @click="handleClick(item.name)"
                v-for="(item, index) in posVersionStatisticData" :key="index"><i class="legend-icon"></i><span
              class="version">{{item.name}}</span><span class="statistic" v-if="item.name != '获取失败'">{{item.value}}家</span></li>
          </ul>
        </div>
        <div class="pos-default-tip" v-if="showDefaultTip">
          <p class="label">所有版本</p>
          <p class="value">{{ sumVal }}家</p>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
  function initPosVersionStatisticEcharts (domID, data, callback) {
    var echarts = require('echarts/lib/echarts')
    require('echarts/lib/chart/pie')
    var colors = [
      {
        type: 'linear',
        x: 0,
        y: 0,
        x2: 0,
        y2: 1,
        colorStops: [{offset: 0, color: '#86D5FF'}, {offset: 1, color: '#008EFF'}],
        globalCoord: false
      },
      {
        type: 'linear',
        x: 0,
        y: 0,
        x2: 0,
        y2: 1,
        colorStops: [{offset: 0, color: '#90EEB2'}, {offset: 1, color: '#4FE09F'}],
        globalCoord: false
      },
      {
        type: 'linear',
        x: 0,
        y: 0,
        x2: 0,
        y2: 1,
        colorStops: [{offset: 0, color: '#FAE84F'}, {offset: 1, color: '#F9AF23'}],
        globalCoord: false
      },
      {
        type: 'linear',
        x: 0,
        y: 0,
        x2: 0,
        y2: 1,
        colorStops: [{offset: 0, color: '#FFBF71'}, {offset: 1, color: '#FF9233'}],
        globalCoord: false
      },
      {
        type: 'linear',
        x: 0,
        y: 0,
        x2: 0,
        y2: 1,
        colorStops: [{offset: 0, color: '#C0AAFE'}, {offset: 1, color: '#7F28EC'}],
        globalCoord: false
      }
    ]
    var pie1 = {
      name: 'pos版本统计',
      type: 'pie',
      radius: ['78px', '96px'],
      avoidLabelOverlap: false,
      hoverOffset: 4,
      itemStyle: {
        normal: {
          borderWidth: 4,
          borderColor: '#fff'
        }
      },
      label: {
        normal: {
          show: false,
          position: 'center',
          textStyle: {
            fontSize: '12',
            fontWeight: 300,
            color: '#34495E'
          }
        },
        emphasis: {
          show: true,
          formatter: ['{style1| {b}}', '{style2| {c}家}'].join('\n'),
          rich: {
            style1: {
              fontSize: '12'
            },
            style2: {
              fontSize: '24',
              lineHeight: '40'
            }
          }
        }
      },
      labelLine: {
        normal: {
          show: false
        }
      },
      animationType: 'scale',
      animationDuration: 1000,
      data: data,
      center: [103, '50%'],
      z: 3
    }
    var pie2 = {
      name: '内环',
      type: 'pie',
      radius: ['66px', '78px'],
      avoidLabelOverlap: false,
      label: {
        normal: {
          show: false,
          position: 'center'
        }
      },
      labelLine: {
        normal: {
          show: false
        }
      },
      itemStyle: {
        normal: {
          color: {
            type: 'radial',
            x: 0.5,
            y: 0.5,
            r: 0.5,
            colorStops: [{offset: 0, color: '#86D5FF'}, {offset: 1, color: '#fff'}],
            globalCoord: false
          }
        }
      },
      silent: true,
      animationType: 'scale',
      animationDuration: 5000,
      data: [{value: 1, name: ''}],
      center: [103, '50%'],
      z: 2
    }
    var option = {
      backgroundColor: '#fff',
      color: colors,
      series: [pie1, pie2]
    }
    var myChart = echarts.init(document.getElementById(domID))
    myChart.setOption(option)
    callback(myChart)
  }
  export default {
    created () {
      const self = this
      this.$http.post('/api/homepage/hp/queryStoreOnlineVersion', {}).then(function (res) {
        if (res.data.code === '0') {
          self.posDataList = res.data.data
          for (var i = 0; i < self.posDataList.length; i++) {
            var obj = res.data.data[i]
            if (obj.posVer === '66666') {
              obj['name'] = '其他版本'
              obj['value'] = obj.posCount
            } else {
              obj['name'] = '版本号:' + obj.posVer
              obj['value'] = obj.posCount
            }
            self.sumVal += +obj.value
          }
          self.posVersionStatisticData = self.posDataList
        } else {
          self.posVersionStatisticData = [{name: '获取失败'}]
          self.$message({
            message: '获取门店数据失败',
            type: 'error'
          })
        }
        initPosVersionStatisticEcharts('pos-pie', self.posVersionStatisticData, myChart => {
          self.myChart = myChart
          self.showDefaultTip = true
          self.myChart.on('mouseover', () => {
            self.showDefaultTip = false
          })
          self.myChart.on('mouseout', () => {
            self.showDefaultTip = true
          })
        })
      }).catch(function (err) {
        if (err) {
          console.log(err)
        }
        self.$message({
          message: '网络有误！',
          type: 'error'
        })
      })
    },
    data () {
      return {
        posVersionStatisticData: [],
        myChart: {},
        posDataList: [],
        sumVal: 0,
        showDefaultTip: false
      }
    },
    methods: {
      handleClick (name) {
        if (this.myChart) {
          this.myChart.dispatchAction({type: 'downplay'})
          this.myChart.dispatchAction({type: 'highlight', name: name})
          this.showDefaultTip = false
        }
      },
      handleMouseout () {
        if (this.myChart) {
          this.myChart.dispatchAction({type: 'downplay'})
          this.showDefaultTip = true
        }
      }
    }
  }
</script>
<style scoped>
  .pos {
    width: 100%;
    height: 100%;
    box-sizing: border-box;
    border: 1px solid #eaf1f6;
    background-color: #fff;
  }
  .pos * {
    box-sizing: border-box;
  }
  .pos .title {
    height: 46px;
    font-family: "PingFangSC-Regular", "微软雅黑";
    font-size: 14px;
    color: #34495e;
    letter-spacing: 0;
    line-height: 46px;
    margin-left: 13px;
    font-weight: 300;
  }
  .pos .split-line {
    height: 10px;
    width: 100%;
    opacity: 0.03;
    background-image: linear-gradient(-180deg, #434c94 0%, #ffffff 100%);
  }
  .pos .content {
    width: 100%;
    display: flex;
    justify-content: center;
  }
  .pos .content .pos-version-statistic-view {
    width: 584px;
    height: 204px;
    box-sizing: border-box;
    display: flex;
    justify-content: center;
    margin-top: 52px;
    position: relative;
  }
  .pos .content .pos-version-statistic-view * {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
  }
  .pos .content .pos-version-statistic-view ul {
    list-style: none;
  }
  .pos .content .pos-version-statistic-view .pos-legend {
    height: 100%;
    display: flex;
    align-items: center;
    margin-left: 62px;
  }
  .pos .content .pos-version-statistic-view .pos-default-tip {
    width: 204px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    position: absolute;
    top: 50%;
    left: 0;
    margin-left: 70px;
    margin-top: -26px;
    font-family: 'PingFangSC-Regular', '微软雅黑'
  }
  .pos .content .pos-version-statistic-view .pos-default-tip .label {
    font-size: 12px;
    line-height: 12px;
  }
  .pos .content .pos-version-statistic-view .pos-default-tip .value {
    font-size: 24px;
    line-height: 40px;
  }
  .pos .content .pos-version-statistic-view .pos-legend ul li {
    margin-bottom: 7px;
    cursor: pointer;
    display: flex;
    align-items: center;
  }
  .pos .content .pos-version-statistic-view .pos-legend ul li .legend-icon {
    display: inline-block;
    width: 10px;
    height: 10px;
    border-radius: 10px;
    margin-right: 10px;
    vertical-align: middle;
  }
  .pos
  .content
  .pos-version-statistic-view
  .pos-legend
  ul
  li:nth-of-type(1)
  .legend-icon {
    background-image: linear-gradient(0deg, #008eff 0%, #86d5ff 96%);
  }
  .pos
  .content
  .pos-version-statistic-view
  .pos-legend
  ul
  li:nth-of-type(2)
  .legend-icon {
    background-image: linear-gradient(-135deg, #90eeb2 0%, #4fe09f 100%);
  }
  .pos
  .content
  .pos-version-statistic-view
  .pos-legend
  ul
  li:nth-of-type(3)
  .legend-icon {
    background-image: linear-gradient(-218deg, #fae84f 2%, #f9af23 100%);
  }
  .pos
  .content
  .pos-version-statistic-view
  .pos-legend
  ul
  li:nth-of-type(4)
  .legend-icon {
    background-image: linear-gradient(-226deg, #ffbf71 0%, #ff9233 100%);
  }
  .pos
  .content
  .pos-version-statistic-view
  .pos-legend
  ul
  li:nth-of-type(5)
  .legend-icon {
    background-image: linear-gradient(-45deg, #7f28ec 0%, #c0aafe 100%);
  }
  .pos .content .pos-version-statistic-view .pos-legend ul li span {
    font-family: "PingFangSC-Regular", "微软雅黑";
    font-size: 14px;
    color: #34495e;
    letter-spacing: 0;
    line-height: 22px;
    vertical-align: middle;
  }
  .pos .content .pos-version-statistic-view .pos-legend ul li .version {
    width: 125.64px;
  }
  .pos
  .content
  .pos-version-statistic-view
  .pos-legend
  ul
  li:nth-of-type(1):hover
  span {
    color: #0c9aff;
  }
  .pos
  .content
  .pos-version-statistic-view
  .pos-legend
  ul
  li:nth-of-type(2):hover
  span {
    color: #4fe09f;
  }
  .pos
  .content
  .pos-version-statistic-view
  .pos-legend
  ul
  li:nth-of-type(3):hover
  span {
    color: #f9af23;
  }
  .pos
  .content
  .pos-version-statistic-view
  .pos-legend
  ul
  li:nth-of-type(4):hover
  span {
    color: #ff9233;
  }
  .pos
  .content
  .pos-version-statistic-view
  .pos-legend
  ul
  li:nth-of-type(5):hover
  span {
    color: #7f28ec;
  }
</style>
