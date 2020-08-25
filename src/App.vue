<template>
  <div id="app">
    <router-view></router-view>
  </div>
</template>

<script>

export default {
  name: 'app',
  //初次加载时对token进行更新操作
  async beforeCreate () {
    var token = window.localStorage.getItem('token')
    if (token) {
      const {data:res} = await this.$http.get('/erus/new_token').catch(error=>{window.localStorage.clear()})
      if(res.status != 200){
        window.localStorage.clear()
        window.sessionStorage.clear()
        await this.$router.push('/login')
      }else {
        window.localStorage.setItem('token',res.data)
      }
    }
  }
}
</script>

<style>
</style>
