<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/dog' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>角色管理</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card>
      <el-row :gutter="15">
        <el-col :span="5">
          <el-input
            placeholder="请输入角色名称或描述"
            prefix-icon="el-icon-search"
            v-model="roleName">
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
            style="width: 240px">
          </el-date-picker>
        </el-col>
        <el-col :span="6">
          <div class="layui-btn-group">
            <button type="button" class="layui-btn" @click="search()">搜索</button>
            <button type="button" class="layui-btn" @click="addRoleDialog = true"
                    v-for="item in activeMenu"
                    :key="item.menuId+''"
                    v-if="item.menuCode=='role_add_button'">添加</button>
            <button type="button" class="layui-btn">导出</button>
          </div>
        </el-col>
      </el-row>
      <el-table
        :data="roleList"
        style="width: 100%"
        max-height="600"
        empty-text="当前项没有数据"
        :header-cell-style="{background: '#eef1f6',color:'#606266',textAlign: 'center'}"
        :cell-style="{textAlign: 'center'}">
        <el-table-column
          type="selection">
        </el-table-column>
        <el-table-column
          fixed
          prop="name"
          label="角色名称"
          width="150">
        </el-table-column>
        <el-table-column
          prop="description"
          label="角色描述"
          width="150">
        </el-table-column>
        <el-table-column
          prop="sort"
          label="角色序号"
          width="120">
        </el-table-column>
        <el-table-column
          label="角色状态"
          width="120">
          <template slot-scope="scope">
            <el-switch
              v-model="scope.row.roleStatus==0"
              active-color="#13ce66"
              inactive-color="#ff4949"
              @change="roleStatusChange(scope.row)">
            </el-switch>
          </template>
        </el-table-column>
        <el-table-column
          prop="createTime"
          label="创建时间"
          width="260">
        </el-table-column>
        <el-table-column
          prop="updateTime"
          label="更新时间"
          width="260">
        </el-table-column>
        <el-table-column
          label="操作"
          width="300">
          <template slot-scope="scope">
            <button type="button" class="layui-btn layui-btn-xs layui-btn-radius layui-btn-primary"
                    @click="updateRoleDialogOpen(scope.row)"
                    v-for="item in activeMenu"
                    :key="item.menuId+''"
                    v-if="item.menuCode=='auth_role_update'">编辑
            </button>
            <button type="button" class="layui-btn layui-btn-xs layui-btn-radius layui-btn-danger"
                    @click="deleteRole(scope.row)"
                    v-for="item in activeMenu"
                    :key="item.menuId+''"
                    v-if="item.menuCode=='auth_role_del'">删除
            </button>
            <button type="button" class="layui-btn layui-btn-xs layui-btn-radius layui-btn-warm"
                    @click="roleMenuDialogOpen(scope.row)"
                    v-for="item in activeMenu"
                    :key="item.menuId+''"
                    v-if="item.menuCode=='role_menus_configure'">菜单配置
            </button>
            <button type="button" class="layui-btn layui-btn-xs layui-btn-radius layui-btn-normal"
                    @click="searchUserByRoleId(scope.row)">查看用户
            </button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
    <el-dialog
      title="添加角色"
      :visible.sync="addRoleDialog"
      width="25%"
      center
      @close="addRoleReset()">
      <el-form :model="addRoleInfo" :rules="addRoleRules"
               ref="addRoleRef" label-width="70px"
               size="small"
               class="demo-ruleForm">
        <el-form-item label="名 称: " prop="name">
          <el-input v-model="addRoleInfo.name" placeholder="请输入英文名称"></el-input>
        </el-form-item>
        <el-form-item label="描 述: " prop="description">
          <el-input v-model="addRoleInfo.description" placeholder="请输入中文描述"></el-input>
        </el-form-item>
        <el-form-item label="序 号: " prop="sort">
          <el-input v-model="addRoleInfo.sort" placeholder="请输入数字"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="addRole()">确 定</el-button>
        <el-button @click="addRoleDialog = false">取 消</el-button>
      </span>
    </el-dialog>
    <!--编辑菜单-->
    <el-dialog
      title="编辑角色"
      :visible.sync="updateRoleDialog"
      width="25%"
      center
      @close="updateRoleReset()">
      <el-form :model="updateRoleInfo" :rules="updateRoleRules"
               ref="updateRoleRef" label-width="70px"
               size="small"
               class="demo-ruleForm">
        <el-form-item label="名 称: " prop="name">
          <el-input v-model="updateRoleInfo.name" placeholder="请输入英文名称" disabled></el-input>
        </el-form-item>
        <el-form-item label="描 述: " prop="description">
          <el-input v-model="updateRoleInfo.description" placeholder="请输入中文描述"></el-input>
        </el-form-item>
        <el-form-item label="序 号: " prop="sort">
          <el-input v-model="updateRoleInfo.sort" placeholder="请输入数字"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="updateRole()">确 定</el-button>
        <el-button @click="updateRoleDialog = false">取 消</el-button>
      </span>
    </el-dialog>
    <!--当前角色下的用户列表-->
    <el-dialog
      title="角色-用户信息"
      :visible.sync="roleUserDialog"
      width="30%"
      center>
      <el-table
        :data="userList"
        max-height="250"
        empty-text="当前角色没有绑定用户"
        border
        style="width: 100%"
        :header-cell-style="{background: '#eef1f6',color:'#606266',textAlign: 'center'}"
        :cell-style="{textAlign: 'center'}">
        <el-table-column
          prop="username"
          label="用户名"
          width="140">
        </el-table-column>
        <el-table-column
          prop="realName"
          label="姓名"
          width="140">
        </el-table-column>
        <el-table-column
          prop="userStatus"
          label="用户状态">
          <template slot-scope="scope">
            <span v-if="scope.row.userStatus == 0">活跃</span>
            <span v-if="scope.row.userStatus == 1">冻结</span>
          </template>
        </el-table-column>
      </el-table>
    </el-dialog>
    <!--菜单配置Dialog-->
    <el-dialog
      title="菜单配置"
      :visible.sync="menuConfigDialog"
      width="25%"
      center
      @close="roleMenuDialogClose ()">
      <el-tree
        :data="menuTree"
        node-key="menuId"
        ref="tree"
        :props="defaultPros"
        show-checkbox
        :check-strictly="menuNodeFlag"
        :default-expanded-keys="[1]">
      </el-tree>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="updateRoleMenu()">确 定</el-button>
        <el-button @click="menuConfigDialog = false">取 消</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
    export default {
        name: "role",
        data() {
            var checkSort = (rules, value, cb) => {
                const regex = /^[1-9][0-9]*$/
                if (regex.test(value)) {
                    return cb()
                } else {
                    cb(new Error('请输入数字'))
                }
            }
            return {
                roleName: '',
                roleList: [],
                activeMenu: [],
                userList: [],
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
                addRoleInfo: {},
                addRoleDialog: false,
                addRoleRules: {
                    name: [
                        {
                            required: true,
                            message: '请输入角色名称',
                            trigger: 'blur'
                        },
                        {
                            min: 2,
                            max: 20,
                            message: '角色名称长度2-20',
                            trigger: 'blur'
                        }
                    ],
                    description: [
                        {
                            required: true,
                            message: '请输入角色描述',
                            trigger: 'blur'
                        },
                        {
                            min: 2,
                            max: 20,
                            message: '角色描述长度2-20',
                            trigger: 'blur'
                        }
                    ],
                    sort: [
                        {
                            required: false
                        },
                        {
                            validator: checkSort,
                            trigger: 'blur'
                        }
                    ]
                },
                updateRoleDialog: false,
                updateRoleInfo: {},
                updateRoleRules: {
                    description: [
                        {
                            required: true,
                            message: '请输入角色描述',
                            trigger: 'blur'
                        },
                        {
                            min: 2,
                            max: 20,
                            message: '角色描述长度2-20',
                            trigger: 'blur'
                        }
                    ],
                    sort: [
                        {
                            required: false
                        },
                        {
                            validator: checkSort,
                            trigger: 'blur'
                        }
                    ]
                },
                roleUserDialog: false,
                menuConfigDialog: false,
                menuNodeFlag: false,
                menuTree: [],
                checkedMenu: [],
                currentRoleId: -1,
                defaultPros: {
                    label: 'menuName',
                    children: 'children'
                }
            }
        },
        created() {
            this.initRoleList()
            this.initActiveMenu()
        },
        methods: {
            async initRoleList() {
                const {data: res} = await this.$http.get('/role/get_all')
                if (res.status != 200) {
                    return console.log(res.statusName)
                }
                this.roleList = res.data
            },
            async initActiveMenu() {
                const {data: res} = await this.$http.get('/menu/login_menu', {
                    params: {
                        menuId: 5,
                        lowLevel: 3
                    }
                })
                if(res.status === 200) {
                    this.activeMenu = res.data.children
                }
            },
            async searchUserByRoleId(row) {
                const {data: res} = await this.$http.get('/user/role_users', {
                    params: {
                        roleId: row.roleId,
                        page: 1,
                        size: 100
                    }
                })
                if (res.status === 200) {
                    this.userList = res.data.resultList
                    this.roleUserDialog = true
                } else {
                    console.log(res.statusName)
                }
            },
            //添加用户对话框关闭
            addRoleReset() {
                this.$refs.addRoleRef.resetFields()
            },
            addRole() {
                this.$refs.addRoleRef.validate(valid => {
                    if (!valid) {
                        return
                    } else {
                        const that = this
                        this.$http.post('/role/add', this.addRoleInfo).then(function (result) {
                            const res = result.data
                            if (res.status == 200) {
                                layer.msg('添加成功', {
                                    offset: '15px',
                                    icon: 1,
                                    time: 1000
                                }, function () {
                                    that.addRoleDialog = false
                                    that.initRoleList()
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
            updateRoleDialogOpen(rowInfo) {
                this.updateRoleDialog = true
                this.updateRoleInfo = JSON.parse(JSON.stringify(rowInfo))
            },
            updateRoleReset() {
                this.$refs.updateRoleRef.resetFields()
            },
            updateRole() {
                this.$refs.updateRoleRef.validate(valid => {
                    if (!valid) {
                        return
                    } else {
                        let regex = /^\d+$/
                        if (!regex.test(this.updateRoleInfo.sort)) {
                            return layer.msg("序号输入格式错误", {
                                offset: '15px',
                                icon: 5,
                                time: 1000
                            })
                        }
                        const that = this
                        this.$http.post('/role/update', this.updateRoleInfo).then(function (result) {
                            const res = result.data
                            if (res.status == 200) {
                                layer.msg('更新成功', {
                                    offset: '15px',
                                    icon: 1,
                                    time: 1000
                                }, function () {
                                    that.updateRoleDialog = false
                                    that.initRoleList()
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
            /*用户状态变更*/
            async roleStatusChange(row) {
                var roleStatus = row.roleStatus
                if (roleStatus == 0) {
                    roleStatus = 1
                } else if (roleStatus == 1) {
                    roleStatus = 0
                }
                const {data: res} = await this.$http.get('/role/status', {
                    params: {
                        roleId: row.roleId,
                        roleStatus: roleStatus
                    }
                })
                if (res.status == 200) {
                    row.roleStatus = roleStatus
                } else {
                    layer.msg(res.statusName, {
                        offset: '15px',
                        icon: 5,
                        time: 1000
                    })
                }
            },
            //搜索角色
            async search() {
                if (this.timeScope == null) {
                    this.timeScope = []
                }
                const {data: res} = await this.$http.get('/role/search', {
                    params: {
                        detail: this.roleName,
                        startTime: this.timeScope[0],
                        endTime: this.timeScope[1]
                    }
                })
                if (res.status === 200) {
                    this.roleList = res.data
                } else {
                    return
                }
            },
            //菜单绑定相关
            async roleMenuDialogOpen(row) {
                const {data: res} = await this.$http.get('/menu/tree', {
                    params: {
                        menuId: 1,
                        lowLevel: 100
                    }
                })
                if (res.status === 200) {
                    let menuArr = []
                    menuArr.push(res.data)
                    this.menuTree = menuArr
                } else {
                    console.log(res.statusName)
                    this.menuConfigDialog = false
                }
                this.menuConfigDialog = true
                this.menuNodeFlag = true
                const {data: response} = await this.$http.get('/menu/role_menuIds', {
                    params: {
                        roleId: row.roleId
                    }
                })
                if (response.status === 200) {
                    this.$refs.tree.setCheckedKeys(response.data)
                    this.menuNodeFlag = false
                } else {
                    console.log(res.statusName)
                }
                this.currentRoleId = row.roleId
            },
            roleMenuDialogClose() {
                this.menuTree = []
                this.checkedMenu = []
                this.currentRoleId = -1
                this.menuConfigDialog = false
            },
            async updateRoleMenu() {
                let menuChecked = this.$refs.tree.getCheckedNodes(false, true)
                let menuIds = []
                menuChecked.forEach(menu => menuIds.push(menu.menuId))
                const {data: res} = await this.$http.post('/menu/role_menu', {
                    roleId: this.currentRoleId,
                    menuIds: menuIds
                })
                if (res.status === 200) {
                    layer.msg("菜单绑定成功", {
                        offset: '15px',
                        icon: 1,
                        time: 1000
                    })
                    this.menuConfigDialog = false
                } else {
                    layer.msg(res.statusName, {
                        offset: '15px',
                        icon: 5,
                        time: 1000
                    })
                }
            },
            deleteRole(row) {
                const that = this
                layer.confirm('此操作不可恢复, 确认删除？', {
                    title: false,
                    closeBtn: 0,
                    btn: ['确认', '取消']
                    ,
                    yes: async function (index, layero) {
                        const {data: res} = await that.$http.get('/role/status', {
                            params: {
                                roleId: row.roleId,
                                roleStatus: 2
                            }
                        })
                        if (res.status == 200) {
                            await that.initRoleList()
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
            }
        }
    }
</script>

<style lang="less" scoped>
  .el-table {
    align-items: center;
  }
</style>
