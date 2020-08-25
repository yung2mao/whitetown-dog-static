<template>
    <div>
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item :to="{ path: '/dog' }">首页</el-breadcrumb-item>
        <el-breadcrumb-item>权限管理</el-breadcrumb-item>
        <el-breadcrumb-item>部门管理</el-breadcrumb-item>
      </el-breadcrumb>
      <el-card
        v-for="item in activeMenu"
        :key="item.menuId+''"
        v-if="item.menuCode=='dept_query'">
        <el-row :gutter="15">
          <el-col :span="4">
            <el-cascader
              :options="deptTree"
              :clearable="true"
              :props="{ checkStrictly: true ,value: 'deptId',label: 'deptName',expandTrigger: 'hover',emitPath: false}"
              v-model="searchDeptId"
              placeholder="选择部门"
              clearable>
            </el-cascader>
          </el-col>
          <el-col :span="6">
            <div class="layui-btn-group">
              <button type="button" class="layui-btn" @click="searchDeptTree()">搜索</button>
              <button type="button" class="layui-btn" @click="addDeptDialog = true"
                      v-for="item in activeMenu"
                      :key="item.menuId+''"
                      v-if="item.menuCode=='dept_add_button'">添加</button>
              <button type="button" class="layui-btn">导出</button>
            </div>
          </el-col>
        </el-row>
        <el-table
          :data="deptList"
          style="width: 100%;margin-bottom: 20px;"
          row-key="deptId"
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
            prop="deptCode"
            label="部门编码"
            sortable
            width="180">
          </el-table-column>
          <el-table-column
            prop="deptName"
            label="部门名称"
            sortable
            width="160">
          </el-table-column>
          <el-table-column
            prop="bossPositionName"
            label="领导职位">
          </el-table-column>
          <el-table-column
            prop="bossName"
            label="实际负责人"
            width="150">
          </el-table-column>
          <el-table-column
            prop="address"
            label="部门地址"
            width="180">
          </el-table-column>
          <el-table-column
            prop="phone"
            label="联系电话"
            width="150">
          </el-table-column>
          <el-table-column
            prop="description"
            label="部门描述"
            width="190">
          </el-table-column>
          <el-table-column
            prop="deptStatus"
            label="部门状态"
            width="150">
            <template slot-scope="scope">
              <el-switch
                v-model="scope.row.deptStatus==0"
                active-color="#13ce66"
                inactive-color="#ff4949"
                @change="deptStatusChange(scope.row)">
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
            fixed="right"
            width="250">
            <template slot-scope="scope">
              <button type="button" class="layui-btn layui-btn-xs layui-btn-radius layui-btn-primary"
                      @click="updateDeptDialogOpen(scope.row)"
                      v-for="item in activeMenu"
                      :key="item.menuId+''"
                      v-if="item.menuCode=='dept_update_button'">编辑
              </button>
              <button type="button" class="layui-btn layui-btn-xs layui-btn-radius layui-btn-warm"
                      @click="configureBossDialogOpen(scope.row)"
                      v-for="item in activeMenu"
                      :key="item.menuId+''"
                      v-if="item.menuCode=='dept_boss_button'">指定负责人
              </button>
              <button type="button" class="layui-btn layui-btn-xs layui-btn-radius layui-btn-danger"
                      @click="deleteDept(scope.row)"
                      v-for="item in activeMenu"
                      :key="item.menuId+''"
                      v-if="item.menuCode=='dept_del_button'">删除
              </button>
            </template>
          </el-table-column>
        </el-table>
      </el-card>
      <!--添加部门信息-->
      <el-dialog
        title="添加部门"
        :visible.sync="addDeptDialog"
        width="420px"
        center
        @close="addDeptDialogClose()">
        <el-form :model="addDeptInfo" :rules="addDeptRules"
                 ref="addDeptRef" label-width="85px"
                 size="small"
                 class="demo-ruleForm">
          <el-form-item label="名 称: " prop="deptName">
            <el-input v-model="addDeptInfo.deptName"
                      placeholder="请输入中文名称"
                      style="width: 260px"></el-input>
          </el-form-item>
          <el-form-item label="编 码: " prop="deptCode">
            <el-input v-model="addDeptInfo.deptCode"
                      placeholder="请输入英文编码"
                      style="width: 260px"></el-input>
          </el-form-item>
          <el-form-item label="父级部门: ">
            <el-cascader
              :options="deptTree"
              :clearable="true"
              :props="{ checkStrictly: true ,value: 'deptId',label: 'deptName',expandTrigger: 'hover',emitPath: false}"
              v-model="addDeptInfo.parentId"
              placeholder="选择部门"
              clearable>
            </el-cascader>
          </el-form-item>
          <el-form-item label="办公地址: ">
            <el-input v-model="addDeptInfo.address"
                      placeholder="请输入办公地址"
                      style="width: 260px"></el-input>
          </el-form-item>
          <el-form-item label="联系电话: " prop="phone">
            <el-input v-model="addDeptInfo.phone"
                      placeholder="输入联系电话"
                      style="width: 260px"></el-input>
          </el-form-item>
          <el-form-item label="部门描述: ">
            <el-input v-model="addDeptInfo.description"
                      placeholder="请输入描述信息"
                      style="width: 260px"></el-input>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="addDept()">确 定</el-button>
        <el-button @click="addDeptDialog = false">取 消</el-button>
      </span>
      </el-dialog>
      <!--编辑部门信息-->
      <el-dialog
        title="编辑部门"
        :visible.sync="updateDeptDialog"
        width="30%"
        center
        @close="updateDeptDialogClose()">
        <el-form :model="updateDeptInfo" :rules="updateDeptRules"
                 ref="updateDeptRef" label-width="85px"
                 size="small"
                 class="demo-ruleForm">
          <el-form-item label="名 称: " prop="deptName">
            <el-input v-model="updateDeptInfo.deptName"
                      placeholder="请输入中文名称"
                      style="width: 350px"></el-input>
          </el-form-item>
          <el-form-item label="编 码: " prop="deptCode">
            <el-input v-model="updateDeptInfo.deptCode"
                      placeholder="请输入英文编码"
                      style="width: 350px"></el-input>
          </el-form-item>
          <el-form-item label="父级部门: ">
            <el-cascader
              :options="deptTree"
              :clearable="true"
              :props="{ checkStrictly: true ,value: 'deptId',label: 'deptName',expandTrigger: 'hover',emitPath: false}"
              v-model="updateDeptInfo.parentId"
              placeholder="选择部门"
              style="width: 350px;"
              clearable>
            </el-cascader>
          </el-form-item>
          <el-form-item label="领导职位: ">
            <el-cascader
              :options="deptTree"
              :clearable="true"
              :props="{ checkStrictly: true ,value: 'deptId',label: 'deptName',expandTrigger: 'hover',emitPath: false}"
              v-model="deptSelect"
              placeholder="选择部门"
              @change="deptSelectChange()"
              style="width: 160px"
              clearable>
            </el-cascader>
            <el-select v-model="selectPositionId" placeholder="请选择职位"
                       style="width: 170px;margin-left: 20px">
              <el-option
                v-for="item in positionList"
                :key="item.positionId+''"
                :label="item.positionName"
                :value="item.positionId">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="办公地址: ">
            <el-input v-model="updateDeptInfo.address"
                      placeholder="请输入办公地址"
                      style="width: 350px"></el-input>
          </el-form-item>
          <el-form-item label="联系电话: " prop="phone">
            <el-input v-model="updateDeptInfo.phone"
                      placeholder="输入联系电话"
                      style="width: 350px"></el-input>
          </el-form-item>
          <el-form-item label="部门描述: ">
            <el-input v-model="updateDeptInfo.description"
                      placeholder="请输入描述信息"
                      style="width: 350px"></el-input>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="updateDept()">确 定</el-button>
        <el-button @click="updateDeptDialog = false">取 消</el-button>
      </span>
      </el-dialog>
      <!--指定负责人-->
      <el-dialog
        title="指定负责人"
        :visible.sync="configureBossDialog"
        width="20%"
        center
        @close="configureBossDialogClose()">
        <div class="layui-card">
          <div class="layui-card-header">当前负责人:</div>
          <div class="layui-card-body">
            <el-tag>{{oldBoss}}</el-tag>
          </div>
        </div>
        <div class="layui-card">
          <div class="layui-card-header">指定新负责人:</div>
          <div class="layui-card-body">
            <el-autocomplete
              class="inline-input"
              v-model="userSelect"
              :fetch-suggestions="querySearch"
              placeholder="请输入用户姓名"
              :trigger-on-focus="false"
            ></el-autocomplete>
          </div>
        </div>
        <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="configureBoss()">确 定</el-button>
        <el-button @click="configureBossDialog = false">取 消</el-button>
      </span>
      </el-dialog>
    </div>
</template>

<script>
    export default {
        name: "depts",
        data() {
            var checkPhone = (rules,value,cb) => {
                const regex = /^(\d+-\d+)|(1(3|4|5|6|7|8|9)\d{9})$/
                if(value == null || "" ==value || regex.test(value)){
                    return cb()
                }else {
                    cb(new Error("电话号码格式错误"))
                }
            }
            return {
                activeMenu: [],
                deptList: [],
                deptTree: [],
                searchDeptId: null,
                addDeptDialog: false,
                addDeptInfo: {},
                addDeptRules: {
                    deptName: [{
                        required: true,
                        message: '请输入部门名称',
                        trigger: 'blur'
                    }],
                    deptCode: [{
                        required: true,
                        message: '请输入部门编码',
                        trigger: 'blur'
                    }],
                    phone: [
                        {required: false},
                        {
                            validator: checkPhone,
                            trigger: 'blur'
                        }
                    ]
                },
                deptSelect: null,
                selectPositionId: null,
                positionList: [],
                updateDeptDialog: false,
                updateDeptInfo: {},
                updateDeptRules: {
                    deptName: [{
                        required: true,
                        message: '请输入部门名称',
                        trigger: 'blur'
                    }],
                    deptCode: [{
                        required: true,
                        message: '请输入部门编码',
                        trigger: 'blur'
                    }],
                    phone: [
                        {required: false},
                        {
                            validator: checkPhone,
                            trigger: 'blur'
                        }
                    ]
                },
                configureBossDialog: false,
                bossChangeDeptId: null,
                oldBoss: '',
                userSelect: null
            }
        },
        created() {
            this.initDeptList()
            this.initDeptTree(1,100)
            this.initActiveMenu()
        },
        methods: {
            async initActiveMenu() {
                const {data: res} = await this.$http.get('/menu/login_menu', {
                    params: {
                        menuId: 7,
                        lowLevel: 3
                    }
                })
                if(res.status === 200) {
                    this.activeMenu = res.data.children
                }
            },
            async initDeptList() {
                const {data: res} = await this.$http.get('/dept/tree',{
                    params: {
                        deptId: 1,
                        lowLevel: 100
                    }
                })
                if(res.status === 200) {
                    this.deptList = res.data.children
                }
            },
            async initDeptTree(deptId,lowLevel) {
                const {data: res} = await this.$http.get("/dept/simple_tree",{
                    params: {
                        deptId: deptId,
                        lowLevel: lowLevel
                    }
                })
                if(res.status === 200) {
                    this.deptTree = res.data.children
                }else {
                    console.log(res.statusName)
                }
            },
            async deptSelectChange() {
                this.updateDeptInfo.positionId = null
                this.positionList = []
                if(this.deptSelect == null || !/^\d+$/.test(this.deptSelect)) {
                    return
                }
                const {data: res} = await this.$http.get('/position/depts?deptId=' + this.deptSelect)
                if(res.status === 200) {
                    this.positionList = res.data
                }else {
                    console.log(res.statusName)
                }
            },
            async searchDeptTree() {
                if(this.searchDeptId == null) {
                    this.searchDeptId = 1
                }
                const {data: res} = await this.$http.get("/dept/tree", {
                    params: {
                        deptId: this.searchDeptId,
                        lowLevel: 100
                    }
                })
                if (res.status === 200) {
                    this.deptList = []
                    if(res.data.deptId == 1) {
                        this.deptList = res.data.children
                        return
                    }
                    this.deptList.push(res.data)
                } else {
                    console.log(res.statusName)
                }
            },
            addDeptDialogClose() {
                this.$refs.addDeptRef.resetFields()
                this.addDeptInfo = {}
            },
            addDept() {
                this.$refs.addDeptRef.validate(valid => {
                    if(!valid) {
                        return
                    }
                    const  that = this
                    this.$http.post('/dept/add',this.addDeptInfo).then(function (result) {
                        const res = result.data
                        if(res.status === 200) {
                            layer.msg('添加成功', {
                                offset: '15px',
                                icon: 1,
                                time: 1000
                            },function () {
                                that.addDeptDialog = false
                                that.initDeptList()
                                that.initDeptTree(1,100)
                            })
                        }else {
                            layer.msg(res.statusName, {
                                offset: '15px',
                                icon: 5,
                                time: 1000
                            })
                        }
                    })
                })
            },
            updateDeptDialogOpen(row) {
                this.updateDeptDialog = true
                this.updateDeptInfo = JSON.parse(JSON.stringify(row))
            },
            updateDeptDialogClose() {
                this.$refs.updateDeptRef.resetFields()
                this.updateDeptInfo = {}
                this.deptSelect = null
                this.selectPositionId = null

            },
            updateDept() {
                if(this.selectPositionId != null) {
                    this.updateDeptInfo.bossPositionId = this.selectPositionId
                }
                this.$refs.updateDeptRef.validate(valid => {
                    if(!valid) {
                        return
                    }
                    const that = this
                    this.$http.post('/dept/update', this.updateDeptInfo)
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
                                that.updateDeptDialog = false
                                that.initDeptList()
                                that.initDeptTree(1,100)
                            }
                        })
                })
            },
            async deptStatusChange(row) {
                let status = row.deptStatus
                if(status == 0) {
                    status = 1
                }else if(status == 1) {
                    status = 0
                }
                const {data: res} = await this.$http.get('/dept/status',{
                    params: {
                        deptId: row.deptId,
                        deptStatus: status
                    }
                })
                if(res.status === 200) {
                    row.deptStatus = status
                }else {
                    layer.msg(res.statusName, {
                        offset: '15px',
                        icon: 5,
                        time: 1000
                    })
                }
            },
            configureBossDialogOpen(row) {
                this.bossChangeDeptId = row.deptId
                this.oldBoss = row.bossName
                this.configureBossDialog = true
            },
            configureBossDialogClose() {
                this.bossChangeDeptId = null
                this.oldBoss = ''
                this.userSelect = null
            },
            async querySearch(queryString, cb) {
                if (queryString != null) {
                    const {data: res} = await this.$http.get('/user/page', {
                        params: {
                            realName: queryString
                        }
                    })
                    if(res.status === 200) {
                        let result = []
                        let list = res.data.resultList
                        list.forEach(user => {
                            result.push({value:user.realName + '--' +user.username,userId:user.userId})
                        })
                        return cb(result)
                    }
                }
                return null
            },
            async configureBoss() {
                if (this.userSelect == null) {
                    return
                }
                let us = this.userSelect.split("--")
                if (us.length != 2) {
                    return
                }
                const {data: res} = await this.$http.get('/dept/boss', {
                    params: {
                        deptId: this.bossChangeDeptId,
                        username: us[1]
                    }
                })
                if(res.status === 200) {
                    this.configureBossDialog = false
                    layer.msg("成功指定负责人", {
                        offset: '15px',
                        icon: 1,
                        time: 1000
                    })
                    this.initDeptList()
                }else {
                    layer.msg(res.statusName, {
                        offset: '15px',
                        icon: 5,
                        time: 1000
                    })
                }
            },
            deleteDept(row) {
                const that = this
                layer.confirm('此操作不可恢复, 确认删除？', {
                    title: false,
                    closeBtn: 0,
                    btn: ['确认', '取消']
                    ,
                    yes: async function (index, layero) {
                        const {data: res} = await that.$http.get('/dept/status', {
                            params: {
                                deptId: row.deptId,
                                deptStatus: 2
                            }
                        })
                        if (res.status == 200) {
                            await that.initDeptList()
                            await that.initDeptTree(1,100)
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
