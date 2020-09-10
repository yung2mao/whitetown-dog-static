<template>
  <div style="height: 100%;">
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/dog' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>接口文档</el-breadcrumb-item>
    </el-breadcrumb>
    <iframe src="http://127.0.0.1:10003/swagger-ui.html" class="interfaceDoc"></iframe>
  </div>
</template>

<script>
    export default {
        name: "interfaceDoc"
    }
</script>

<style scoped lang="less">
  .interfaceDoc {
    box-shadow: 0 1px 1px rgba(0,0,0,0.15)!important;
    width: 100%;
    height: 100%;
  }
</style>
