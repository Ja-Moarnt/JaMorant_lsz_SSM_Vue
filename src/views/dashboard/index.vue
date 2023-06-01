<template>
  <div class="dashboard-container">
    <div class="dashboard-middle">
      <div id="map2" ref="map2" />
    </div>
    <div class="dashboard-right">
      <div class="up">
        <div class="left">
          <div class="title">已激活车辆数</div>
          <div class="contain">{{number}}</div>
        </div>
        <div class="right">
          <div class="title">总营业额</div>
          <div class="contain">￥{{amount}}</div>
        </div>
      </div>
      <div class="down">
        <div id="servel" ref="servel" />
      </div>
    </div>
  </div>
</template>

<script>

import axios from 'axios'
import echarts from 'echarts'
import { mapData } from '@/assets/mapData'
export default {
  data() {
    return {
      // mapData: {},
      newData: [],
      xiaoliang: {},
      // 近7天销量
      servelAmountData: {},
      // 近7天订单
      servelOrderData: {},
      number: null,
      amount: null
    }
  },
  mounted() {
    this.getState()
      .then(() => {
        // console.log('map2', this.mapData)
        console.log('buydata', this.xiaoliang)
        const cities = []

        for (const item of this.xiaoliang.data) {
          for (const city of item.date) {
            cities.push({
              name: city.name,
              value: [city.value[0], city.value[1], city.value[2]],
              city: item.name
            })
          }
        }

        this.servelOrderData = this.servelOrderData.data.sort((a, b) => new Date(a.name) - new Date(b.name))
        this.servelAmountData = this.servelAmountData.data.sort((a, b) => new Date(a.name) - new Date(b.name))

        const xdata = this.servelOrderData.map(v => v.name)
        const ydata = this.servelOrderData.map(v => v.value)
        const ydata2 = this.servelAmountData.map(v => v.value)
        echarts.registerMap('china', mapData)
        const myChart = echarts.init(document.getElementById('map2'))
        const servelEChart = echarts.init(document.getElementById('servel'))
        myChart.setOption({
          geo: {
            map: 'china',
            roam: true, // 平移
            itemStyle: {
              areaColor: '#0099ff',
              borderColor: '00ffff',
              shadowColor: 'rgb(230,130,70,0.5)',
              shadowBlur: 30,

              emphasis: {
                focus: 'self'
              }
            }
          },
          // 散点图数据

          tooltip: {
            trigger: 'item',
            formatter: function(params) {
              return params.name + ': ' + params.value[2]
            }
          },
          title: {
            text: '城市销量',
            left: '45%',
            textStyle: {
              color: '#000000',
              fontSize: 20,
              textShadowBlur: 10,
              textShadowColor: '#33ffff'
            }
          },
          visualMap: {
            type: 'continuous',
            min: 1,
            max: 20,
            calculable: true,
            inRange: {
              color: ['#77dd77', '#ffd700', '#ff7f50']
            },
            textStyle: {
              color: '#000'
            }
          },
          series: [
            {
              type: 'effectScatter',
              itemStyle: {
                color: 'red'
              },
              coordinateSystem: 'geo',
              data: cities,
              rippleEffect: {
                number: 2, // 波纹数量
                scale: 3
              }
            }
          ]
        })
        servelEChart.setOption({
          xAxis: {
            type: 'category',
            data: xdata,
            axisLabel: {
              textStyle: {
                color: '#000', // 文字颜色
                fontSize: 6 // 文字大小
              }
            }
          },
          yAxis: {
            type: 'value',
            axisLabel: {
              textStyle: {
                color: '#000', // 文字颜色
                fontSize: 10 // 文字大小
              }
            }
          },
          tooltip: {
            trigger: 'axis'
          },
          legend: {
            icon: 'rect',
            data: ['订单量', '营业额'],
            textStyle: {
              color: '#000', // 文字颜色
              fontSize: 10 // 文字大小
            }
          },
          series: [
            {
              data: ydata,
              name: '订单量',
              type: 'line',
              smooth: true,
              lineStyle: {
                color: '#f00', // 线条颜色
                width: 2, // 线条宽度
                type: 'solid' // 线条类型，支持 'solid', 'dashed', 'dotted'
              }
            },
            {
              data: ydata2,
              name: '营业额',
              type: 'line',
              smooth: true,
              lineStyle: {
                color: '#FFD700', // 线条颜色
                width: 2, // 线条宽度
                type: 'solid' // 线条类型，支持 'solid', 'dashed', 'dotted'
              }
            }
          ]
        })
      })
      .catch((error) => {
        console.log(error)
      })
  },
  methods: {
    async getState() {
      // this.mapData = await axios.get('http://43.139.87.121:8888/china/data')
      this.xiaoliang = await axios.get(
        'https://localhost:8333/admin/order/count/CityAll'
      )
      this.servelOrderData = await axios.get('https://localhost:8333/admin/order/count/WeekDay')
      this.servelAmountData = await axios.get('https://localhost:8333/admin/order/count/WeekSales')
      const res = await axios.get('https://localhost:8333/admin/vod/count/carCount')
      const res1 = await axios.get('https://localhost:8333/admin/order/count/Turnover')
      this.number = res.data
      this.amount = res1.data.Turnover
    }
  }
}
</script>

<style lang="scss" scoped>
body{
  background: url("~@/assets/bg.jpg") top center no-repeat;
}
#map2 {
  width: 100%;
  height: 643px;
  border: 1px solid blue;
  margin:  10px;
}
#servel{
  width: 100%;
  height: 343px;
  border: 1px solid blue;
  margin: 10px;
}
.dashboard {
  &-container {
    //margin: 30px;
    width: 100%;
    height: 663px;
    display: flex;
    flex-direction: row;
    // background: url("~@/assets/bg.jpg") top center no-repeat;
  }

  &-middle {
    width: 50%;
    height: 643px;
    margin-left: 7px;
    transform: translateX(-1.5%);
  }
  &-right {
    width: 49%;
    height: 663px;
    // margin: 10px;

    .up{
      width: 100%;
      height: 300px;
      display: flex;
      flex-direction: row;
      .left{
        width: 50%;
        height: 290px;
        border: 1px solid blue;
        margin: 10px;
        .title{
          width: 88%;
          height: 40px;
          border-bottom: 1px solid dodgerblue;
          font-size: 20px;
          display: flex;
          align-items: center;
          margin-left: 20px;
        }
        .contain{
          width: 100%;
          height: 250px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 50px;
          color: dodgerblue;
        }
      }
      .right{
        width: 50%;
        height: 290px;
        border: 1px solid blue;
        margin: 10px 0;
        .title{
          width: 88%;
          height: 40px;
          border-bottom: 1px solid dodgerblue;
          font-size: 20px;
          display: flex;
          align-items: center;
          margin-left: 20px;
        }
        .contain{
          width: 100%;
          height: 250px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 35px;
          color: #C00000;
        }
      }
    }
    .down{
      width: 98.5%;
      height: 343px;

    }
  }
}
</style>
