<template>
  <div class="shopdata">
    <div class="title">
      门店数据统计
    </div>
    <div class='split-line'></div>
    <div class="content">
      <p class="type">
        门店类型
      </p>
      <p class="amount type">门店数量</p>
      <ul>
        <li><span class="fl">门店总数</span><span class="fr" @click="slideShow('0')">{{StoreCount.sumStore}}</span></li>
        <li><span class="fl">正常营业门店</span><span class="fr" @click="slideShow('1')">{{StoreCount.sumStoreUp}}</span></li>
        <li><span class="fl">本月新开</span><span class="fr" @click="slideShow('2')">{{StoreCount.sumStoreNew}}</span></li>
        <li><span class="fl">停业门店数</span><span class="fr" @click="slideShow('3')">{{StoreCount.sumStoreStop}}</span></li>
        <li><span class="fl">当前在线门店数</span><span class="fr" @click="slideShow('4')">{{StoreCount.sumStoreInt}}</span></li>
      </ul>
      <div id="main1" style="width:500px;height:300px;"></div>
    </div>
  </div>
</template>
<script>
  import { mapGetters } from 'vuex'

  var echarts = require('echarts')
  export default {
    created () {
      const self = this
      this.$http.post('/api/homepage/hp/queryStoreCount', {}).then(function (res) {
        if (res.data.code === '0') {
          self.StoreCount = res.data.data[0]
          self.numbers = [
            self.StoreCount.sumStoreInt - 0,
            self.StoreCount.sumStoreStop - 0,
            self.StoreCount.sumStoreNew - 0,
            self.StoreCount.sumStoreUp - 0,
            self.StoreCount.sumStore - 0
          ]
        } else {
          self.numbers = [0, 0, 0, 0]
          self.$message({
            message: '获取门店数据失败',
            type: 'error'
          })
        }
        self.drawline()
      }).catch(function (err) {
        console.log(err)
        self.$message({
          message: '网络有误！',
          type: 'error'
        })
      })
    },
    data () {
      return {
        numbers: [],
        StoreCount: {}
      }
    },
    computed: {
      ...mapGetters([
        'show'
      ])
    },
    mounted () {
    },
    methods: {
      drawline () {
        var myChart = echarts.init(document.getElementById('main1'))
        var option = {
          cursor: 'default',
          grid: {
            left: '0%',
            right: '0%',
            bottom: '1%',
            containLabel: true
          },
          xAxis: {
            show: 'false',
            type: 'value',
            position: 'top',
            splitLine: {show: false},
            splitArea: {show: false},
            axisLine: {
              show: false
            },
            axisTick: {
              show: false
            },
            axisLabel: {
              show: false
            }

          },
          yAxis: {
            show: false,
            type: 'category',
            nameLocation: 'end',
            max: 4,
            data: [{
              value: '网络异常门店数',
              textStyle: {align: 'left'}

            }, {
              value: '停业门店数',
              textStyle: {align: 'leftt'}
            }, {
              value: '本月新开',
              textStyle: {align: 'left'}
            }, {
              value: '正常营业门店',
              textStyle: {align: 'left'}
            }, {
              value: '门店总数',
              textStyle: {align: 'left'}
            }
            ],
            axisLine: {
              show: false
            },
            axisTick: {
              show: false
            }
          },
          series: [
            {
              type: 'bar',
              data: this.numbers,
              barWidth: 6,
              itemStyle: {
                normal: {
                  color: function (params) {
                    var colorList = [
                      ' #FF7171', ' #FF7171', ' #0C9AFF', ' #0C9AFF', ' #0C9AFF'
                    ]
                    return colorList[params.dataIndex]
                  },
                  barBorderRadius: [5, 5, 5, 5]
                }
              }
            }
          ]
        }
        myChart.setOption(option)
      },
      slideShow (storeTypeFlag) {
        this.$store.commit('slideShow')
        this.$store.commit('storeTypeFlag', storeTypeFlag)
      }
    }
  }
</script>

<style scoped>
  .shopdata {
    position: relative;
    width: 100%;
    height: 100%;
    background: #FFFFFF;
    border: 1px solid #EAF1F6;
  }
  .shopdata * {
    box-sizing: border-box;
  }
  .shopdata .title {
    height: 46px;
    font-family: "PingFangSC-Regular", "微软雅黑";
    font-size: 14px;
    color: #34495e;
    letter-spacing: 0;
    line-height: 46px;
    margin-left: 13px;
    font-weight: 300;
  }
  .shopdata .split-line {
    height: 9.8px;
    width: 100%;
    opacity: 0.03;
    background-image: linear-gradient(-180deg, #434c94 0%, #ffffff 100%);
  }
  .amount {
    position: absolute;
    right: 20px;
    top: 50px;
  }
  .type {
    margin-left: 20px;
    margin-top: 14px;
    margin-bottom: 32px;
    font-family: PingFangSC-Regular;
    font-size: 12px;
    color: #9AABB8;
    letter-spacing: 0;
    line-height: 12px;
  }
  ul li {
    padding-left: 20px;
    font-family: PingFangSC-Regular;
    font-size: 12px;
    color: #34495E;
    letter-spacing: 0;
    line-height: 12px;
    height: 44px;
  }
  ul li span {
    display: inline-block;
    height: 44px;
    line-height: 44px;
  }
  ul li:hover {
    background: #F5FBFF;
  }
  ul li:hover span {
    color: #0C9AFF;
  }
  .fl {
    float: left;
  }
  .fr {
    float: right;
    margin-right: 45px;
    cursor: pointer;
  }
  #main1 {
    position: absolute;
    left: 50px;
    top: 30px;
  }
</style>
