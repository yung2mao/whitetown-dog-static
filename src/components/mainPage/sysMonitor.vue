<template>
    <div>
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item :to="{ path: '/dog' }">首页</el-breadcrumb-item>
        <el-breadcrumb-item>权限管理</el-breadcrumb-item>
        <el-breadcrumb-item>系统监控</el-breadcrumb-item>
      </el-breadcrumb>
      <el-row :gutter="15">
        <el-col :span="8">
          <el-card>
            <div ref="sysBaseInfo" style="width: 425px;height:220px;"></div>
          </el-card>
        </el-col>
        <el-col :span="8">
          <el-card>

          </el-card>
        </el-col>
        <el-col :span="8">
          <el-card>

          </el-card>
        </el-col>
      </el-row>
    </div>
</template>

<script>
    export default {
        name: "sysMonitor",
        data() {
            return {
                identityInfo: {},
                websocket: null
            }
        },
        created() {
            this.beforeConnectSocket()
        },
        mounted() {
            this.demos()
        },
        beforeDestroy() {
            this.disconnect()
        },
        methods: {
            async beforeConnectSocket() {
                const {data: res} = await this.$http.get('/ws/identity')
                if (res.status !== 200) {
                    layer.msg(res.statusName, {
                        offset: '15px',
                        icon: 5,
                        time: 1000
                    })
                } else {
                    this.identityInfo.randomId = res.data.randomId
                    this.identityInfo.userId = res.data.userId
                }
                this.connectWebSocket()
            },
            getAllServerInfo() {
            },
            connectWebSocket() {
                let websocket = null;
                let randomId = this.identityInfo.randomId
                let userId = this.identityInfo.userId
                //判断当前浏览器是否支持WebSocket
                if('WebSocket' in window){
                    let param = "randomId="+randomId+"&userId="+userId+"&groupId=sys_monitor0001"
                    websocket = new WebSocket("ws://127.0.0.1:10003/ws/white?"+param);
                    this.websocket = websocket;
                    // console.log(this.websocket)
                    console.log("connect success")
                }
                else{
                    alert('Not support websocket')
                }
                websocket.onmessage = function(event){
                    // console.log(event)
                }
            },
            disconnect() {
                this.websocket.close()
            },
            demos() {
                let echarts  =require('echarts')
                let demos = echarts.init(this.$refs.sysBaseInfo)
                // Generate data
                let category = [];
                let dottedBase = +new Date();
                let lineData = [];
                let barData = [];

                for (let i = 0; i < 20; i++) {
                    let date = new Date(dottedBase += 3600 * 24 * 1000);
                    category.push([
                        date.getFullYear(),
                        date.getMonth() + 1,
                        date.getDate()
                    ].join('-'));
                    let b = Math.random() * 200;
                    let d = Math.random() * 200;
                    barData.push(b)
                    lineData.push(d + b);
                }
                let option = {
                    backgroundColor: '#0f375f',
                    tooltip: {
                        trigger: 'axis',
                        axisPointer: {
                            type: 'shadow'
                        }
                    },
                    legend: {
                        data: ['line', 'bar'],
                        textStyle: {
                            color: '#ccc'
                        }
                    },
                    xAxis: {
                        data: category,
                        axisLine: {
                            lineStyle: {
                                color: '#ccc'
                            }
                        }
                    },
                    yAxis: {
                        splitLine: {show: false},
                        axisLine: {
                            lineStyle: {
                                color: '#ccc'
                            }
                        }
                    },
                    series: [{
                        name: 'line',
                        type: 'line',
                        smooth: true,
                        showAllSymbol: true,
                        symbol: 'emptyCircle',
                        symbolSize: 15,
                        data: lineData
                    }, {
                        name: 'bar',
                        type: 'bar',
                        barWidth: 10,
                        itemStyle: {
                            barBorderRadius: 5,
                            color: new echarts.graphic.LinearGradient(
                                0, 0, 0, 1,
                                [
                                    {offset: 0, color: '#14c8d4'},
                                    {offset: 1, color: '#43eec6'}
                                ]
                            )
                        },
                        data: barData
                    }, {
                        name: 'line',
                        type: 'bar',
                        barGap: '-100%',
                        barWidth: 10,
                        itemStyle: {
                            color: new echarts.graphic.LinearGradient(
                                0, 0, 0, 1,
                                [
                                    {offset: 0, color: 'rgba(20,200,212,0.5)'},
                                    {offset: 0.2, color: 'rgba(20,200,212,0.2)'},
                                    {offset: 1, color: 'rgba(20,200,212,0)'}
                                ]
                            )
                        },
                        z: -12,
                        data: lineData
                    }, {
                        name: 'dotted',
                        type: 'pictorialBar',
                        symbol: 'rect',
                        itemStyle: {
                            color: '#0f375f'
                        },
                        symbolRepeat: true,
                        symbolSize: [12, 4],
                        symbolMargin: 1,
                        z: -10,
                        data: lineData
                    }]
                };
                demos.setOption(option)
            }
        }
    }
</script>

<style lang="less" scoped>

</style>
