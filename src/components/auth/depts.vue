<template>
    <div>
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item :to="{ path: '/dog' }">首页</el-breadcrumb-item>
        <el-breadcrumb-item>权限管理</el-breadcrumb-item>
        <el-breadcrumb-item>部门管理</el-breadcrumb-item>
      </el-breadcrumb>
      <el-card>
      </el-card>
    </div>
</template>

<script>
    export default {
        name: "depts",
        data() {
            return {}
        },
        created() {
        },
        methods: {

        }
    }
</script>

<style lang="less" scoped>

</style>
