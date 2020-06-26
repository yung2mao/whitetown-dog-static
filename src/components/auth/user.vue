<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/dog' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card>
      <el-row :gutter="15">
        <el-col :span="5">
          <el-input
            placeholder="请输入用户名/手机号"
            prefix-icon="el-icon-search"
            v-model="searchDetail">
          </el-input>
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
            style="width: 200px">
          </el-date-picker>
        </el-col>
        <el-col :span="6">
          <div class="layui-btn-group">
            <button type="button" class="layui-btn" @click="normalSearchUser()">搜索</button>
            <button type="button" class="layui-btn">添加</button>
            <button type="button" class="layui-btn">导出</button>
          </div>
        </el-col>
      </el-row>
      <!--表格区域-->
      <el-table
        :data="userList"
        border
        style="width: 100%"
        empty-text="当前项没有数据"
        :header-cell-style="{background: '#eef1f6',color:'#606266',textAlign: 'center'}"
        :cell-style="{textAlign: 'center'}">
        <el-table-column
          type="selection">
        </el-table-column>
        <el-table-column
          prop="username"
          label="用户名"
          width="120">
        </el-table-column>
        <el-table-column
          prop="realName"
          label="姓名"
          width="100">
        </el-table-column>
        <el-table-column
          prop="gender"
          label="性别"
          width="100">
        </el-table-column>
        <el-table-column
          prop="birthday"
          label="出生日期"
          width="120">
        </el-table-column>
        <el-table-column
          prop="createTime"
          label="创建时间"
          width="160">
        </el-table-column>
        <el-table-column
          prop="telephone"
          label="手机号"
          width="120">
        </el-table-column>
        <el-table-column
          prop="email"
          label="邮箱"
          width="160">
        </el-table-column>
        <el-table-column
          label="用户状态"
          width="120">
          <template slot-scope="scope">
            <el-switch
              v-model="scope.row.userStatus==0"
              active-color="#13ce66"
              inactive-color="#ff4949"
              @change="userStatusUpdate(scope.row)">
            </el-switch>
          </template>
        </el-table-column>
        <el-table-column
          fixed="right"
          label="操作"
          width="250">
          <template slot-scope="scope">
            <button type="button" class="layui-btn layui-btn-xs layui-btn-radius layui-btn-primary"
                    @click="updateUser(scope.row.username)">编辑
            </button>
            <button type="button" class="layui-btn layui-btn-xs layui-btn-radius layui-btn-danger"
                    @click="deleteUser(scope.row)">删除
            </button>
            <button type="button" class="layui-btn layui-btn-xs layui-btn-radius layui-btn-normal"
                    @click="roleUpdate(scope.row.username)">角色配置
            </button>
            <button type="button" class="layui-btn layui-btn-xs layui-btn-radius layui-btn-warm"
                    @click="updatePwd(scope.row.username)">密码重置
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
        :total="this.userTotal">
      </el-pagination>
    </el-card>
  </div>
</template>

<script>
  export default {
    name: 'user',
    data () {
      return {
        searchDetail: '',
        timeScope: [],
        pickerOptions: {
          shortcuts: [{
            text: '最近一周',
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
              picker.$emit('pick', [start, end]);
            }
          }, {
            text: '最近一个月',
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
              picker.$emit('pick', [start, end]);
            }
          }, {
            text: '最近三个月',
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
              picker.$emit('pick', [start, end]);
            }
          }]
        },
        userList: [],
        userTotal: 0,
        currentPage: 0,
        pageSize: 0
      }
    },
    created () {
      this.getUserList(1, 10)
    },
    mounted () {
    },
    methods: {
      //获取userList
      async getUserList (page, size) {
        const { data: res } = await this.$http.get('/user/pageUser', {
          params: {
            page: page,
            size: size
          }
        })
        if (res.status != 200) {
          console.log(res.statusName)
        } else {
          this.userList = res.data.resultList
          this.userTotal = res.data.total
          this.currentPage = res.data.page
          this.pageSize = res.data.rows
        }
      },
      //普通搜索功能
      async normalSearchUser () {
        const { data: res } = await this.$http.get('/user/pageUser', {
          params: {
            page: 1,
            rows: this.pageSize,
            searchDetail: this.searchDetail,
            startTime: this.timeScope[0],
            endTime: this.timeScope[1]
          }
        })
        if (res.status == 200) {
          this.userList = res.data.resultList
          this.userTotal = res.data.total
          this.currentPage = res.data.page
          this.pageSize = res.data.rows
        } else {
          layer.msg(res.statusName, {
            offset: '15px',
            icon: 5,
            time: 1000
          })
        }
      },
      //用户状态变更
      async userStatusUpdate (row) {
        var userStatus = row.userStatus
        if (userStatus == 0) {
          userStatus = 1
        } else if (1 == userStatus) {
          userStatus = 0
        }
        const { data: res } = await this.$http.get('/user/active', {
          params: {
            username: row.username,
            userStatus: userStatus
          }
        })
        if (res.status == 200) {
          row.userStatus = userStatus
        } else {
          layer.msg(res.statusName, {
            offset: '15px',
            icon: 5,
            time: 1000
          })
        }
      },
      //修改用户按钮单击触发
      updateUser (username) {
        console.log(username)
      },
      //删除用户
      deleteUser (row) {
        var that = this
        layer.confirm('确认删除？', {
          title: false,
          closeBtn: 0,
          btn: ['确认', '取消']
          ,
          yes: function (index, layero) {
            that.userStatusUpdate({
              username: row.username,
              userStatus: 2
            })
            layer.closeAll()
          },
          btn2: function (index) {
            layer.closeAll()
          }
        })
      },
      roleUpdate (username) {
        console.log(username)
      },
      updatePwd (username) {
        console.log(username)
      },
      handleSizeChange (newSize) {
        this.getUserList(this.currentPage, newSize)
      },
      handleCurrentChange (newPage) {
        this.getUserList(newPage, this.pageSize)
      }
    }
  }
</script>

<style lang="less" scoped>
  .text {
    font-size: 14px;
  }

  .item {
    margin-bottom: 18px;
  }

  .clearfix:before,
  .clearfix:after {
    display: table;
    content: "";
  }

  .clearfix:after {
    clear: both
  }

  .box-card {
    width: 480px;
  }
</style>
