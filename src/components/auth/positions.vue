<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/dog' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>职位管理</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card>
      <el-row :gutter="15">
        <el-col :span="3">
          <el-input
            placeholder="请输入职位名称"
            prefix-icon="el-icon-search"
            v-model="searchPositionName">
          </el-input>
        </el-col>
        <el-col :span="2">
          <el-cascader
            :options="deptTree"
            :props="{ checkStrictly: false }"
            :v-model="searchDeptId"
            placeholder="选择部门"
            clearable></el-cascader>
        </el-col>
        <el-col :span="5">
          <el-date-picker
            v-model="timeScope"
            type="daterange"
            align="right"
            unlink-panels
            range-separator="-"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            :value-format="'yyyy-MM-dd HH:mm:ss'"
            :picker-options="pickerOptions"
            style="width: 240px">
          </el-date-picker>
        </el-col>
        <el-col :span="6">
          <div class="layui-btn-group">
            <button type="button" class="layui-btn" @click="">搜索</button>
            <button type="button" class="layui-btn" @click="">添加</button>
            <button type="button" class="layui-btn">导出</button>
          </div>
        </el-col>
      </el-row>
      <el-table
        :data="positionList"
        max-height="580"
        border
        style="width: 100%"
        empty-text="当前项没有数据"
        :header-cell-style="{background: '#eef1f6',color:'#606266',textAlign: 'center'}"
        :cell-style="{textAlign: 'center'}">
        <el-table-column
          type="selection">
        </el-table-column>
        <el-table-column
          prop="deptCode"
          label="部门ID">
        </el-table-column>
        <el-table-column
          prop="deptName"
          label="部门名称">
        </el-table-column>
        <el-table-column
          prop="positionCode"
          label="职位编码">
        </el-table-column>
        <el-table-column
          prop="positionName"
          label="职位名称">
        </el-table-column>
        <el-table-column
          prop="positionLevel"
          label="职位类别"
          width="100">
        </el-table-column>
        <el-table-column
          prop="description"
          label="职位描述">
        </el-table-column>
        <el-table-column
          prop="createTime"
          label="创建时间"
          width="180">
        </el-table-column>
        <el-table-column
          fixed="right"
          label="操作"
          width="150%">
          <template slot-scope="scope">
            <button type="button" class="layui-btn layui-btn-xs layui-btn-radius layui-btn-primary"
                    @click="">编辑
            </button>
            <button type="button" class="layui-btn layui-btn-xs layui-btn-radius layui-btn-danger"
                    @click="">删除
            </button>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="this.currentPage"
        :page-sizes="[5, 10, 20, 30]"
        :page-size="this.pageSize"
        background
        layout="total, sizes, prev, pager, next, jumper"
        :total="this.positionTotal">
      </el-pagination>
    </el-card>
  </div>
</template>

<script>
    export default {
        name: "positions",
        data () {
            return {
                positionList: [],
                currentPage: 0,
                pageSize: 0,
                positionTotal: 0,
                deptTree: [],
                searchDeptId: [],
                searchPositionName: '',
                timeScope: []
            }
        },
        created() {
            this.initPositionList(1,10)
        },
        methods: {
            async initPositionList (page,size) {
                const {data: res} = await this.$http.get('/position/page',{
                    params: {
                        page: page,
                        size: size
                    }
                })
                if(res.status === 200) {
                    this.positionList = res.data.resultList
                    this.currentPage = res.data.page
                    this.pageSize = res.data.rows
                    this.positionTotal = res.data.total
                }else {
                    console.log(res.statusName)
                }
            },
            handleSizeChange(newSize) {
                this.initPositionList(this.currentPage, newSize)
            },
            handleCurrentChange(newPage) {
                this.initPositionList(newPage, this.pageSize)
            }
        }
    }
</script>

<style lang="less" scoped>
</style>
