<template>
  <el-container class="home-container">
    <el-header>
      <div>
        <h3 class="dog-title"><i class="layui-icon layui-icon-key" style="color: #9F9F9F;margin-right: 5px"></i>DOG后台组件演示平台
        </h3>
      </div>
      <div>
        <el-menu
          class="el-menu-demo"
          mode="horizontal"
          background-color="#2D3F57"
          text-color="#fff"
          active-text-color="#ffd04b">
          <el-menu-item index="1">处理中心</el-menu-item>
          <el-submenu index="2">
            <template slot="title"><img src="../assets/githubblue.png" width="15%" style="margin-right: 5px"/>{{loginUser.realName}}</template>
            <el-menu-item index="2-1">个人中心</el-menu-item>
            <el-menu-item index="2-2">密码管理</el-menu-item>
            <el-menu-item index="2-3" @click="logOut()">登出</el-menu-item>
          </el-submenu>
        </el-menu>
      </div>
    </el-header>
    <el-container>
      <el-aside :width="isCollapse ? '64px' : '230px'">
        <el-menu
          default-active="2"
          class="el-menu-vertical-demo"
          unique-opened
          background-color="#2D3F57"
          text-color="#fff"
          active-text-color="#ffd04b" :collapse="isCollapse"
          :collapse-transition="false"
          router
          :default-active="activePath">
          <div class="menu-control-button">

            <i :class="menuControlIcon"
               style="color: #9F9F9F; cursor: pointer;"
               @click="closeAndOpen()"
               :style="isCollapse ? 'padding-right: 23px;' : 'padding-right: 14px;'"></i>
          </div>
          <el-submenu :index="item.menuId+''" v-for="item in menuList" :key="item.menuId+''">
            <template slot="title">
              <i :class="'layui-icon '+item.menuIcon" style="color: rgba(206,209,245,0.84);padding-right: 20px"></i>
              <span>{{item.menuName}}</span>
            </template>
            <el-menu-item :index="subItem.menuUrl"
                          :key="subItem.menuId" v-for="subItem in item.children"
                          style="padding-left: 60px" @click="saveStatus(subItem.menuUrl)">
              {{subItem.menuName}}
            </el-menu-item>
          </el-submenu>
        </el-menu>
      </el-aside>
      <el-container>
        <el-main>
          <router-view></router-view>
        </el-main>
      </el-container>
    </el-container>
  </el-container>
</template>

<script>
    export default {
        name: 'dog',
        data() {
            return {
                isCollapse: false,
                menuControlIcon: 'layui-icon layui-icon-shrink-right',
                menuList: [],
                activePath: '',
                loginUser: {}
            }
        },
        created() {
            this.getMenuList(1,100)
            this.activePath = window.sessionStorage.getItem('activePath')
            this.getLoginUser()
        },
        methods: {
            //退出
            logOut() {
                window.localStorage.clear()
                window.sessionStorage.clear()
                this.$http.get('/erus/logout').catch(res => console.log(res))
                this.$router.push('/login')
            },
            async getLoginUser() {
                const {data: res} = await this.$http.get('/erus/info')
                if (res.status != 200) {
                    this.$message.error("状态错误，请重新登陆")
                    this.logOut();
                } else {
                    this.loginUser = res.data
                }
            },
            //获取菜单列表
            async getMenuList(menuId,lowLevel) {
                const {data: res} = await this.$http.get('menu/login_menu',{
                    params: {
                        menuId: menuId,
                        lowLevel: lowLevel
                    }
                })
                if (res.status != 200) {

                    layer.msg(res.statusName, {
                        offset: '15px',
                        icon: 5,
                        time: 1000
                    })
                } else {
                    this.menuList = res.data.children
                }
            },
            closeAndOpen() {
                if (this.menuControlIcon == 'layui-icon layui-icon-shrink-right') {
                    this.menuControlIcon = 'layui-icon layui-icon-spread-left'
                } else {
                    this.menuControlIcon = 'layui-icon layui-icon-shrink-right'
                }
                if (this.isCollapse == false) {
                    this.isCollapse = true
                } else {
                    this.isCollapse = false
                }
            },
            //保存激活状态下path
            saveStatus(activePath) {
                window.sessionStorage.setItem("activePath", activePath)
                this.activePath = activePath
            }
        }
    }
</script>

<style lang="less" scoped>
  .el-header {
    background-color: #2D3F57;
    display: flex;
    justify-content: space-between;
    padding-left: 20px;
    align-items: center;
  }

  .dog-title {
    color: #d7f0ed;
    font-family: "Microsoft YaHei", "微软雅黑", Arial, sans-serif;
  }

  .el-aside {
    background-color: #2D3F57;
  }

  .el-main {
    background-color: #f2f2f2;
  }

  .home-container {
    height: 100%;
  }

  .el-menu-vertical-demo {
    border-right: 0;
  }

  .menu-control-button {
    text-align: right;
  }
</style>
