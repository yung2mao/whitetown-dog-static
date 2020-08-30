<template>
    <div>
      sys_monitor
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
            }
        }
    }
</script>

<style lang="less" scoped>

</style>
