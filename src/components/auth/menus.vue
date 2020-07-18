<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/dog' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>菜单管理</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card>
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
            <button type="button" class="layui-btn" @click="addMenuDialog = true">添加</button>
            <button type="button" class="layui-btn">导出</button>
          </div>
        </el-col>
      </el-row>
      <el-table
        :data="menuList"
        style="width: 100%;margin-bottom: 20px;"
        row-key="menuId"
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
          sortable>
        </el-table-column>
        <el-table-column
          prop="menuCode"
          label="菜单标识"
          sortable>
        </el-table-column>
        <el-table-column
          prop="menuUrl"
          label="路由地址">
        </el-table-column>
        <el-table-column
          prop="menuIcon"
          label="菜单图标"
          width="150">
          <template slot-scope="scope">
            <i :class="'layui-icon '+scope.row.menuIcon"></i>
          </template>
        </el-table-column>
        <el-table-column
          prop="description"
          label="菜单描述">
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
              @change="">
            </el-switch>
          </template>
        </el-table-column>
        <el-table-column
          prop="createTime"
          label="创建时间"
          width="180">
        </el-table-column>
        <el-table-column
          label="操作">
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
    </el-card>
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
        <el-form-item label="父级菜单: ">
          <el-cascader
            :options="allMenuList"
            v-model="addMenuInfo.parentId"
            style="width: 260px"
            :props="{ checkStrictly: true, value: 'menuId',label: 'menuName'}"
            clearable></el-cascader>
        </el-form-item>
        <el-form-item label="路由地址: ">
          <el-input v-model="addMenuInfo.menuIcon"
                    placeholder="选择菜单图标"
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
  </div>
</template>

<script>
    export default {
        name: "menu",
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
                allMenuList: [],
                menuList: [],
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
                }
            }
        },
        created() {
            this.initMenuList()
        },
        methods: {
            async initMenuList() {
                const {data: res} = await this.$http.get('/menu/tree', {
                    params: {
                        menuId: 1,
                        lowLevel: 100
                    }
                })
                if (res.status === 200) {
                    this.allMenuList = res.data.children
                    this.menuList = this.allMenuList
                } else {
                    console.log(res.statusName)
                }
            },
            async searchMenu() {
                if (!this.roleName) {
                    return this.initMenuList()
                }
                const {data: res} = await this.$http.get('/menu/role?roleName=' + this.roleName)
                if (res.status === 200) {
                    this.menuList = res.data.children
                } else {
                    this.menuList = []
                }
            },
            addMenuDialogClose() {
                this.$refs.addMenuRef.resetFields()
            },
            addMenu() {
                let checkedParent = this.addMenuInfo.parentId

                this.addMenuInfo.parentId = checkedParent.pop()

            }
        }
    }
</script>

<style lang="less" scoped>

</style>
