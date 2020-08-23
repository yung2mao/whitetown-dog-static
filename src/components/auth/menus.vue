<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/dog' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>菜单管理</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card
      v-for="item in activeMenu"
      :key="item.menuId+''"
      v-if="item.menuCode=='menus_query'">
      <el-row :gutter="15">
        <el-col :span="5">
          <el-input
            placeholder="输入角色信息查看绑定的菜单"
            prefix-icon="el-icon-search"
            v-model="roleName">
          </el-input>
        </el-col>
        <el-col :span="6">
          <div class="layui-btn-group">
            <button type="button" class="layui-btn" @click="searchMenu()">搜索</button>
            <button type="button" class="layui-btn" @click="addMenuDialogOpen()"
                    v-for="item in activeMenu"
                    :key="item.menuId+''"
                    v-if="item.menuCode=='menus_add_button'">添加</button>
            <button type="button" class="layui-btn">导出</button>
          </div>
        </el-col>
      </el-row>
      <el-table
        :data="menuList"
        style="width: 100%;margin-bottom: 20px;"
        row-key="menuId"
        max-height="580"
        border
        :tree-props="{children: 'children', hasChildren: 'hasChildren'}"
        empty-text="当前项没有数据"
        :header-cell-style="{background: '#eef1f6',color:'#606266',textAlign: 'center'}"
        :cell-style="{textAlign: 'center'}">
        <el-table-column
          type="selection">
        </el-table-column>
        <el-table-column
          prop="menuName"
          label="菜单名称"
          sortable
          width="200">
        </el-table-column>
        <el-table-column
          prop="menuCode"
          label="菜单标识"
          sortable
          width="160">
        </el-table-column>
        <el-table-column
          prop="menuUrl"
          label="路由地址">
        </el-table-column>
        <el-table-column
          prop="menuIcon"
          label="菜单图标"
          width="120">
          <template slot-scope="scope">
            <i :class="'layui-icon '+scope.row.menuIcon"></i>
          </template>
        </el-table-column>
        <el-table-column
          prop="description"
          label="菜单描述"
          width="200">
        </el-table-column>
        <el-table-column
          prop="menuSort"
          label="菜单排序"
          width="150">
        </el-table-column>
        <el-table-column
          prop="menuStatus"
          label="菜单状态"
          width="150">
          <template slot-scope="scope">
            <el-switch
              v-model="scope.row.menuStatus==0"
              active-color="#13ce66"
              inactive-color="#ff4949"
              @change="updateMenuStatus(scope.row)">
            </el-switch>
          </template>
        </el-table-column>
        <el-table-column
          prop="createTime"
          label="创建时间"
          width="180">
        </el-table-column>
        <el-table-column
          label="操作"
          width="140">
          <template slot-scope="scope">
            <button type="button" class="layui-btn layui-btn-xs layui-btn-radius layui-btn-primary"
                    @click="updateMenuDialogOpen(scope.row)"
                    v-for="item in activeMenu"
                    :key="item.menuId+''"
                    v-if="item.menuCode=='menus_update_button'">编辑
            </button>
            <button type="button" class="layui-btn layui-btn-xs layui-btn-radius layui-btn-danger"
                    @click="delMenu(scope.row)"
                    v-for="item in activeMenu"
                    :key="item.menuId+''"
                    v-if="item.menuCode=='menus_del_button'">删除
            </button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
<!--   添加菜单-->
    <el-dialog
      title="添加菜单"
      :visible.sync="addMenuDialog"
      width="420px"
      center
      @close="addMenuDialogClose()">
      <el-form :model="addMenuInfo" :rules="addMenuInfoRules"
               ref="addMenuRef" label-width="85px"
               size="small"
               class="demo-ruleForm">
        <el-form-item label="名 称: " prop="menuName">
          <el-input v-model="addMenuInfo.menuName"
                    placeholder="请输入中文名称"
                    style="width: 260px"></el-input>
        </el-form-item>
        <el-form-item label="标 识: " prop="menuCode">
          <el-input v-model="addMenuInfo.menuCode"
                    placeholder="请输入英文标识"
                    style="width: 260px"></el-input>
        </el-form-item>
        <el-form-item label="父级菜单: " prop="parentId">
          <el-cascader
            :options="selectMenuList"
            v-model="addMenuInfo.parentId"
            style="width: 260px"
            :props="{ checkStrictly: true, value: 'menuId',label: 'menuName',expandTrigger: 'hover',emitPath: false}"
            clearable></el-cascader>
        </el-form-item>
        <el-form-item label="路由地址: ">
          <el-input v-model="addMenuInfo.menuUrl"
                    placeholder="请输入路由地址"
                    style="width: 260px"></el-input>
        </el-form-item>
        <el-form-item label="菜单图标: ">
          <el-input v-model="addMenuInfo.menuIcon"
                    placeholder="请选择菜单图标"
                    style="width: 260px"></el-input>
        </el-form-item>
        <el-form-item label="菜单排序: " prop="menuSort">
          <el-input v-model="addMenuInfo.menuSort"
                    placeholder="输入菜单序号"
                    style="width: 260px"></el-input>
        </el-form-item>
        <el-form-item label="菜单描述: " prop="description">
          <el-input v-model="addMenuInfo.description"
                    placeholder="请输入描述信息"
                    style="width: 260px"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="addMenu()">确 定</el-button>
        <el-button @click="addMenuDialog = false">取 消</el-button>
      </span>
    </el-dialog>
    <!--   编辑菜单-->
    <el-dialog
      title="编辑菜单"
      :visible.sync="updateMenuDialog"
      width="420px"
      center
      @close="updateMenuDialogClose()">
      <el-form :model="updateMenuInfo" :rules="updateMenuInfoRules"
               ref="updateMenuRef" label-width="85px"
               size="small"
               class="demo-ruleForm">
        <el-form-item label="名 称: " prop="menuName">
          <el-input v-model="updateMenuInfo.menuName"
                    placeholder="请输入中文名称"
                    style="width: 260px"></el-input>
        </el-form-item>
        <el-form-item label="标 识: " prop="menuCode">
          <el-input v-model="updateMenuInfo.menuCode"
                    placeholder="请输入英文标识"
                    style="width: 260px"></el-input>
        </el-form-item>
        <el-form-item label="路由地址: ">
          <el-input v-model="updateMenuInfo.menuUrl"
                    placeholder="请输入路由地址"
                    style="width: 260px"></el-input>
        </el-form-item>
        <el-form-item label="菜单图标: ">
          <el-input v-model="updateMenuInfo.menuIcon"
                    placeholder="请选择菜单图标"
                    style="width: 260px"></el-input>
        </el-form-item>
        <el-form-item label="菜单排序: " prop="menuSort">
          <el-input v-model="updateMenuInfo.menuSort"
                    placeholder="输入菜单序号"
                    style="width: 260px"></el-input>
        </el-form-item>
        <el-form-item label="菜单描述: " prop="description">
          <el-input v-model="updateMenuInfo.description"
                    placeholder="请输入描述信息"
                    style="width: 260px"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="updateMenu()">确 定</el-button>
        <el-button @click="updateMenuDialog = false">取 消</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
    export default {
        name: "menu",
        data() {
            var checkSort = (rules, value, cb) => {
                const regex = /^[1-9][0-9]*$/
                if (value == null || "" ==value || regex.test(value)) {
                    return cb()
                } else {
                    cb(new Error('请输入数字'))
                }
            }
            return {
                activeMenu: [],
                roleName: '',
                menuList: [],
                selectMenuList: [],
                addMenuDialog: false,
                addMenuInfo: {},
                addMenuInfoRules: {
                    menuName: [{
                        required: true,
                        message: '请输入菜单名称',
                        trigger: 'blur'
                    }],
                    menuCode: [{
                        required: true,
                        message: '请输入菜单编码',
                        trigger: 'blur'
                    }],
                    parentId: [{
                        required: true,
                        message: '请选择父级菜单',
                        trigger: 'blur'
                    }],
                    menuSort: [{
                        required: false
                    },
                        {
                            validator: checkSort,
                            trigger: 'blur'
                        }],
                    description: [{
                        required: true,
                        message: '请输入菜单描述',
                        trigger: 'blur'
                    }]
                },
                updateMenuDialog: false,
                updateMenuInfo: {},
                updateMenuInfoRules: {
                    menuName: [{
                        required: true,
                        message: '请输入菜单名称',
                        trigger: 'blur'
                    }],
                    menuCode: [{
                        required: true,
                        message: '请输入菜单编码',
                        trigger: 'blur'
                    }],
                    menuSort: [{
                        required: false
                    },
                        {
                            validator: checkSort,
                            trigger: 'blur'
                        }],
                    description: [{
                        required: true,
                        message: '请输入菜单描述',
                        trigger: 'blur'
                    }]
                }
            }
        },
        created() {
            this.initMenuList()
            this.initActiveMenu()
        },
        methods: {
            async initActiveMenu() {
                const {data: res} = await this.$http.get('/menu/login_menu', {
                    params: {
                        menuId: 6,
                        lowLevel: 3
                    }
                })
                if(res.status === 200) {
                    this.activeMenu = res.data.children
                }
            },
            async initMenuList() {
                this.menuList = []
                const {data: res} = await this.$http.get('/menu/tree', {
                    params: {
                        menuId: 1,
                        lowLevel: 100
                    }
                })
                if (res.status === 200) {
                    this.menuList = res.data.children
                } else {
                    console.log(res.statusName)
                }
            },
            async searchMenu() {
                this.menuList = []
                if (!this.roleName) {
                    return this.initMenuList()
                }
                const {data: res} = await this.$http.get('/menu/role?roleName=' + this.roleName)
                if (res.status === 200) {
                    this.menuList.push(res.data)
                } else {
                    this.menuList = []
                }
            },
            async addMenuDialogOpen() {
                const {data: res} = await this.$http.get('/menu/tree', {
                    params: {
                        menuId: 1,
                        lowLevel: 100
                    }
                })
                if(res.status === 200){
                    this.selectMenuList = []
                    this.selectMenuList.push(res.data)
                }
                this.addMenuDialog = true
            },
            addMenuDialogClose() {
                this.$refs.addMenuRef.resetFields()
                this.addMenuInfo = {}
            },
            addMenu() {
                this.$refs.addMenuRef.validate(valid => {
                    if(!valid){
                        return
                    }
                    const that = this
                    this.$http.post('/menu/add',this.addMenuInfo).then(function (result) {
                        const res = result.data
                        if(res.status === 200) {
                            layer.msg('添加成功', {
                                offset: '15px',
                                icon: 1,
                                time: 1000
                        },function () {
                                that.addMenuDialog = false
                                that.initMenuList()
                            })
                        }else{
                            layer.msg(res.statusName, {
                                offset: '15px',
                                icon: 5,
                                time: 1000
                            })
                        }
                    })
                })
            },
            async updateMenuDialogOpen(row) {
                this.updateMenuDialog = true
                this.updateMenuInfo = JSON.parse(JSON.stringify(row))
                const {data: res} = await this.$http.get('/menu/tree', {
                    params: {
                        menuId: 1,
                        lowLevel: 100
                    }
                })
                if (res.status === 200) {
                    this.selectMenuList.push(res.data)
                }
            },
            updateMenuDialogClose() {
                this.$refs.updateMenuRef.resetFields()
            },
            updateMenu() {
                this.$refs.updateMenuRef.validate(valid => {
                    if(!valid){
                        return
                    }
                    const that = this
                    this.$http.post('/menu/update',this.updateMenuInfo).then(function (result) {
                        const res = result.data
                        if(res.status === 200) {
                            layer.msg('更新成功', {
                                offset: '15px',
                                icon: 1,
                                time: 1000
                            },function () {
                                that.updateMenuDialog = false
                                that.initMenuList()
                            })
                        }else{
                            layer.msg(res.statusName, {
                                offset: '15px',
                                icon: 5,
                                time: 1000
                            })
                        }
                    })
                })
            },
            async updateMenuStatus(row) {
                let status = row.menuStatus
                if (status === 0) {
                    status = 1
                } else if (status === 1) {
                    status = 0
                }
                const {data: res} = await this.$http.get('/menu/status', {
                    params: {
                        menuId: row.menuId,
                        menuStatus: status
                    }
                })
                if(res.status === 200){
                    row.menuStatus = status
                }else {
                    layer.msg(res.statusName,{
                        offset: '15px',
                        icon: 5,
                        time: 1000
                    })
                }
            },
            delMenu(row) {
                const that = this
                layer.confirm('此操作不可恢复, 确认删除？', {
                    title: false,
                    closeBtn: 0,
                    btn: ['确认', '取消']
                    ,
                    yes: async function (index, layero) {
                        const {data: res} = await that.$http.get('/menu/status', {
                            params: {
                                menuId: row.menuId,
                                menuStatus: 2
                            }
                        })
                        if (res.status == 200) {
                            await that.initMenuList()
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

</style>
