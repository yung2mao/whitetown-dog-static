<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/dog' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card>
      <el-row :gutter="15">
        <el-col :span="4">
          <el-input
            placeholder="请输入用户名/手机号"
            prefix-icon="el-icon-search"
            v-model="searchDetail">
          </el-input>
        </el-col>
        <el-col :span="5">
          <el-select v-model="pageDeptId"
                     placeholder="请选择部门"
                     style="width: 120px"
                     @change="pageDeptChange()">
            <el-option
              v-for="item in deptList"
              :key="item.deptId+''"
              :label="item.deptName"
              :value="item.deptId">
            </el-option>
          </el-select>
          <el-select v-model="pagePositionId"
                     placeholder="请选择职位"
                     style="width: 120px;margin-left: 20px">
            <el-option
              v-for="item in pagePositionList"
              :key="item.positionId+''"
              :label="item.positionName+'-'+item.positionCode"
              :value="item.positionId">
            </el-option>
          </el-select>
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
            <button type="button" class="layui-btn" @click="normalSearchUser()">搜索</button>
            <button type="button" class="layui-btn" @click="addUserDialog = true">添加</button>
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
          width="100%">
        </el-table-column>
        <el-table-column
          prop="realName"
          label="姓名"
          width="100%">
        </el-table-column>
        <el-table-column
          prop="gender"
          label="性别"
          width="100%">
        </el-table-column>
        <el-table-column
          prop="deptName"
          label="部门"
          width="100%">
        </el-table-column>
        <el-table-column
          prop="positionName"
          label="职位"
          width="100%">
        </el-table-column>
        <el-table-column
          prop="birthday"
          label="出生日期"
          width="100%">
        </el-table-column>
        <el-table-column
          prop="createTime"
          label="创建时间"
          width="160%">
        </el-table-column>
        <el-table-column
          prop="telephone"
          label="手机号"
          width="120%">
        </el-table-column>
        <el-table-column
          prop="email"
          label="邮箱"
          width="190%">
        </el-table-column>
        <el-table-column
          label="用户状态"
          width="120%">
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
          width="250%">
          <template slot-scope="scope">
            <button type="button" class="layui-btn layui-btn-xs layui-btn-radius layui-btn-primary"
                    @click="updateUserDialogOpen(scope.row)">编辑
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
    <el-dialog
      title="添加用户"
      :visible.sync="addUserDialog"
      width="30%"
      center
      @close="addUserDialogReset">
      <el-form :model="addUserInfo" :rules="addUserInfoRules"
               ref="addUserInfoRef" label-width="70px"
               size="small"
               class="demo-ruleForm">
        <el-form-item label="用户名: " prop="username">
          <el-input v-model="addUserInfo.username"></el-input>
        </el-form-item>
        <el-form-item label="密 码: " prop="password">
          <el-input v-model="addUserInfo.password" type="password"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="addUser()">确 定</el-button>
        <el-button @click="addUserDialog = false">取 消</el-button>
      </span>
    </el-dialog>
    <!--    完善编辑用户信息弹窗-->
    <el-dialog
      title="编辑用户"
      :visible.sync="updateUserDialog"
      width="30%"
      center
      @close="updateUserDialogReset()">
      <el-form :model="updateUserInfo" :rules="updateUserInfoRules" ref="updateUserInfoRef" label-width="70px"
               size="small">
        <el-form-item label="用户名: ">
          <el-input v-model="updateUserInfo.username" disabled></el-input>
        </el-form-item>
        <el-form-item label="姓 名: " prop="realName">
          <el-input v-model="updateUserInfo.realName"></el-input>
        </el-form-item>
        <el-form-item label="性 别: ">
          <el-radio-group v-model="updateUserInfo.gender">
            <el-radio label="男">
              <i class="layui-icon layui-icon-male" style="color: #2F4056;margin-right: 5px"></i>男
            </el-radio>
            <el-radio label="女">
              <i class="layui-icon layui-icon-female" style="color: #2F4056;margin-right: 5px"></i>女
            </el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="职 位: ">
          <el-select v-model="deptSelect"
                     placeholder="请选择部门"
                     style="width: 120px"
                     @change="deptSelectChange">
            <el-option
              v-for="item in deptList"
              :key="item.deptId+''"
              :label="item.deptName"
              :value="item.deptId">
            </el-option>
          </el-select>
          <el-select v-model="selectPosition" placeholder="请选择职位" style="width: 120px;margin-left: 20px">
            <el-option
              v-for="item in positionList"
              :key="item.positionId+''"
              :label="item.positionName+'-'+item.positionCode"
              :value="item.positionId">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="生 日: ">
          <el-date-picker
            type="date"
            placeholder="请选择出生日期"
            v-model="updateUserInfo.birthday"
            :value-format="'yyyy-MM-dd'"
            style="width: 100%;"></el-date-picker>
        </el-form-item>
        <el-form-item label="手机号: " prop="telephone">
          <el-input v-model="updateUserInfo.telephone"></el-input>
        </el-form-item>
        <el-form-item label="邮箱: " prop="email">
          <el-input v-model="updateUserInfo.email"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="updateUser()">确 定</el-button>
        <el-button @click="updateUserDialog = false">取 消</el-button>
      </span>
    </el-dialog>
    <el-dialog
      title="角色分配"
      :visible.sync="roleConfigDialog"
      width="20%"
      center
      @close="roleDialogClose()">
      <div class="layui-card">
        <div class="layui-card-header">[ {{currentRoleUser}} ] 当前角色信息:</div>
        <div class="layui-card-body">
          <el-tag
            v-for="tag in checkedTag"
            :key="tag.roleId"
            size="mini"
            :type="'success'"
            style="margin-right: 5px">
            {{tag.description}}
          </el-tag>
        </div>
      </div>
      <div class="layui-card">
        <div class="layui-card-header">角色信息更新:</div>
        <div class="layui-card-body">
          <el-select v-model="checkedRoles" multiple placeholder="请选择角色" style="margin-left: 20px">
            <el-option
              v-for="item in roleList"
              :key="item.roleId+''"
              :label="item.description"
              :value="item.roleId">
            </el-option>
          </el-select>
        </div>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="updateUserRole()">确 定</el-button>
        <el-button @click="roleConfigDialog = false">取 消</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
    export default {
        name: 'user',
        data() {
            //邮箱校验
            var checkEmail = (rules, value, cb) => {
                const regex = /^[a-z0-9]+([._\\\\-]*[a-z0-9])*@([a-z0-9]+[-a-z0-9]*[a-z0-9]+.){1,63}[a-z0-9]+$/
                if (regex.test(value)) {
                    return cb()
                } else {
                    cb(new Error('邮箱格式错误'))
                }
            }
            //手机号校验
            var checkTelephone = (rules, value, cb) => {
                const regex = /^1(3|4|5|6|7|8|9)\d{9}$/
                if (regex.test(value)) {
                    return cb()
                }
                cb(new Error('手机号格式错误'))
            }
            return {
                searchDetail: '',
                timeScope: [],
                pickerOptions: {
                    shortcuts: [{
                        text: '最近一周',
                        onClick(picker) {
                            const end = new Date()
                            const start = new Date()
                            start.setTime(start.getTime() - 3600 * 1000 * 24 * 7)
                            picker.$emit('pick', [start, end])
                        }
                    }, {
                        text: '最近一个月',
                        onClick(picker) {
                            const end = new Date()
                            const start = new Date()
                            start.setTime(start.getTime() - 3600 * 1000 * 24 * 30)
                            picker.$emit('pick', [start, end])
                        }
                    }, {
                        text: '最近三个月',
                        onClick(picker) {
                            const end = new Date()
                            const start = new Date()
                            start.setTime(start.getTime() - 3600 * 1000 * 24 * 90)
                            picker.$emit('pick', [start, end])
                        }
                    }]
                },
                userList: [],
                userTotal: 0,
                currentPage: 0,
                pageSize: 0,
                pageDeptId: null,
                pagePositionId: null,
                pagePositionList: [],
                addUserDialog: false,
                addUserInfo: {},
                addUserInfoRules: {
                    username: [
                        {
                            required: true,
                            message: '请输入用户名',
                            trigger: 'blur'
                        },
                        {
                            min: 3,
                            max: 20,
                            message: '用户名长度3-20',
                            trigger: 'blur'
                        }
                    ],
                    password: [
                        {
                            required: true,
                            message: '请输入密码',
                            trigger: 'blur'
                        },
                        {
                            min: 3,
                            max: 20,
                            message: '密码长度为6-20',
                            trigger: 'blur'
                        }
                    ]
                },
                deptSelect: null,
                selectPosition: null,
                updateUserDialog: false,
                updateUserInfo: {},
                deptList: [],
                positionList: [],
                updateUserInfoRules: {
                    realName: [
                        {
                            required: true,
                            message: '请输入姓名',
                            trigger: 'blur'
                        },
                        {
                            min: 1,
                            max: 20,
                            message: '姓名长度1-20',
                            trigger: 'blur'
                        }
                    ],
                    telephone: [
                        {
                            required: false
                        },
                        {
                            validator: checkTelephone,
                            trigger: 'blur'
                        }
                    ],
                    email: [
                        {
                            required: false
                        },
                        {
                            validator: checkEmail,
                            trigger: 'blur'
                        }
                    ]
                },
                roleConfigDialog: false,
                roleList: [],
                currentRoleUser: '',
                checkedRoles: [],
                checkedTag: []
            }
        },
        created() {
            this.getUserList(1, 10)
            this.deptListInit()
        },
        mounted() {
        },
        methods: {
            //获取userList
            async getUserList(page, size) {
                const {data: res} = await this.$http.get('/user/pageUser', {
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
            async deptListInit() {
                const {data: res} = await this.$http.get('/dept/allSimple')
                if (res.status === 200) {
                    this.deptList = res.data
                } else {
                    console.log(res.statusName)
                }
            },
            async pageDeptChange() {
                this.pagePositionId = null
                if (this.pageDeptId != null && this.pageDeptId > 1) {
                    const {data: res} = await this.$http.get('/position/deptPosition?deptId=' + this.pageDeptId)
                    if (res.status === 200) {
                        this.pagePositionList = res.data
                    } else {
                        console.log(res.statusName)
                    }
                }
            },
            //普通搜索功能
            async normalSearchUser() {
                if(this.timeScope==null){
                    this.timeScope = []
                }
                const {data: res} = await this.$http.get('/user/pageUser', {
                    params: {
                        page: 1,
                        rows: this.pageSize,
                        searchDetail: this.searchDetail,
                        deptId: this.pageDeptId,
                        positionId: this.pagePositionId,
                        startTime: this.timeScope[0],
                        endTime: this.timeScope[1]
                    }
                })
                if (res.status === 200) {
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
            async userStatusUpdate(row) {
                let userStatus = row.userStatus
                if (userStatus == 0) {
                    userStatus = 1
                } else if (1 == userStatus) {
                    userStatus = 0
                }
                const {data: res} = await this.$http.get('/user/active', {
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
            //删除用户
            deleteUser(row) {
                const that = this
                layer.confirm('此操作不可恢复, 确认删除？', {
                    title: false,
                    closeBtn: 0,
                    btn: ['确认', '取消']
                    ,
                    yes: async function (index, layero) {
                        const {data: res} = await that.$http.get('/user/active', {
                            params: {
                                username: row.username,
                                userStatus: 2
                            }
                        })
                        if (res.status == 200) {
                            await that.getUserList(that.currentPage, that.pageSize)
                            await layer.closeAll()
                        } else {
                            layer.closeAll()
                            layer.msg(res.statusName, {
                                offset: '15px',
                                icon: 5,
                                time: 1000
                            })
                        }
                    },
                    btn2: function (index) {
                        layer.closeAll()
                    }
                })
            },
            //添加用户对话框关闭
            addUserDialogReset() {
                this.$refs.addUserInfoRef.resetFields()
            },
            addUser() {
                this.$refs.addUserInfoRef.validate(valid => {
                    if (!valid) {
                        return
                    } else {
                        const that = this
                        this.$http.post('/user/registry', this.addUserInfo)
                            .then(function (result) {
                                const res = result.data
                                if (res.status == 200) {
                                    layer.msg('添加成功', {
                                        offset: '15px',
                                        icon: 1,
                                        time: 1000
                                    }, function () {
                                        that.addUserDialog = false
                                        that.getUserList(that.currentPage, that.pageSize)
                                    })
                                } else {
                                    layer.msg(res.statusName, {
                                        offset: '15px',
                                        icon: 5,
                                        time: 1000
                                    })
                                }
                            })
                    }
                })
            },
            //修改用户对话框打开
            async updateUserDialogOpen(row) {
                this.updateUserDialog = true
                this.updateUserInfo = JSON.parse(JSON.stringify(row))
                this.deptSelect = this.updateUserInfo.deptId
                if(this.deptSelect != null && this.deptSelect > 1) {
                    const {data: res} = await this.$http.get('/position/deptPosition?deptId='+this.deptSelect)
                    if(res.status === 200) {
                        this.positionList = res.data
                        this.selectPosition = this.updateUserInfo.positionId
                    }else {
                        console.log(res.statusName)
                    }
                }
            },
            async deptSelectChange() {
                this.selectPosition = null
                const {data: res} = await this.$http.get('/position/deptPosition?deptId=' + this.deptSelect)
                if(res.status === 200) {
                    this.positionList = res.data
                }else {
                    console.log(res.statusName)
                }
            },
            //修改用户弹窗关闭时调用
            updateUserDialogReset() {
                this.$refs.updateUserInfoRef.resetFields()
                this.positionList = []
                this.deptSelect = ''
                this.selectPosition = ''
            },
            //修改用户按钮单击触发
            updateUser() {
                var that = this
                this.$refs.updateUserInfoRef.validate(valid => {
                    if (!valid) {
                        return
                    }
                    this.updateUserInfo.deptId = this.deptSelect
                    this.updateUserInfo.positionId = this.selectPosition
                    this.$http.post('/user/update', this.updateUserInfo)
                        .then(function (result) {
                            const res = result.data
                            if (res.status != 200) {
                                layer.msg(res.statusName, {
                                    offset: '15px',
                                    icon: 5,
                                    time: 1000
                                })
                                return
                            } else {
                                layer.msg('更新成功', {
                                    offset: '15px',
                                    icon: 1,
                                    time: 1000
                                })
                                that.updateUserDialog = false
                                that.getUserList(that.currentPage, that.pageSize)
                            }
                        })
                })
            },
            //角色分配
            async roleUpdate(username) {
                this.roleConfigDialog = true
                this.currentRoleUser = username
                const {data: response} = await this.$http.get('/role/getAll')
                if(response.status === 200){
                    this.roleList = response.data
                }else {
                    this.roleConfigDialog = false
                    console.log(response.statusName)
                    return
                }
                const {data: res} = await this.$http.get('role/users?username='+username)
                if(res.status === 200) {
                    this.checkedTag = res.data
                }else {
                    this.roleConfigDialog = false
                    console.log(res.statusName)
                    return
                }
            },
            roleDialogClose() {
                this.roleList = []
                this.checkedRoles = []
                this.currentRoleUser = ''
            },
            async updateUserRole() {
                const {data: res} = await this.$http.post('/role/configureRole', {
                    username: this.currentRoleUser,
                    roleIds: this.checkedRoles
                })
                if(res.status === 200){
                    this.roleConfigDialog = false
                    layer.msg('角色更新成功', {
                        offset: '15px',
                        icon: 1,
                        time: 1000
                    })
                }else {
                    layer.msg(res.statusName, {
                        offset: '15px',
                        icon: 5,
                        time: 1000
                    })
                }
            },
            updatePwd(username) {
                const that = this
                layer.confirm('用户密码将被重置，确认继续？', {
                    title: false,
                    closeBtn: 0,
                    btn: ['确认', '取消']
                    ,
                    yes: async function (index, layero) {
                        const {data: res} = await that.$http.get('/user/reSetPwd', {
                            params: {username: username}
                        })
                        layer.closeAll()
                        if (res.status != 200) {
                            layer.msg('操作失败', {
                                offset: '15px',
                                icon: 5,
                                time: 1000
                            })
                        } else {
                            layer.msg('操作成功', {
                                offset: '15px',
                                icon: 1,
                                time: 1000
                            })
                        }
                    },
                    btn2: function (index) {
                        layer.closeAll()
                    }
                })
            },
            handleSizeChange(newSize) {
                this.getUserList(this.currentPage, newSize)
            },
            handleCurrentChange(newPage) {
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
