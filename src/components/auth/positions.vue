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
            v-model="searchPositionInfo.searchPositionName">
          </el-input>
        </el-col>
        <el-col :span="3">
          <el-cascader
            :options="deptTree"
            :clearable="true"
            :props="{ checkStrictly: true ,value: 'deptId',label: 'deptName',expandTrigger: 'hover',emitPath: false}"
            v-model="searchPositionInfo.searchDeptId"
            placeholder="选择部门"
            clearable>
          </el-cascader>
        </el-col>
        <el-col :span="5">
          <el-date-picker
            v-model="searchPositionInfo.timeScope"
            type="daterange"
            align="right"
            unlink-panels
            range-separator="-"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            :value-format="'yyyy-MM-dd HH:mm:ss'"
            style="width: 240px">
          </el-date-picker>
        </el-col>
        <el-col :span="6">
          <div class="layui-btn-group">
            <button type="button" class="layui-btn" @click="searchPosition()">搜索</button>
            <button type="button" class="layui-btn" @click="addPositionDialog = true">添加</button>
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
          prop="positionCode"
          label="职位编码">
        </el-table-column>
        <el-table-column
          prop="positionName"
          label="职位名称">
        </el-table-column>
        <el-table-column
          prop="deptName"
          label="所属部门">
        </el-table-column>
        <el-table-column
          prop="deptCode"
          label="部门编码">
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
                    @click="updatePositionDialogOpen(scope.row)">编辑
            </button>
            <button type="button" class="layui-btn layui-btn-xs layui-btn-radius layui-btn-danger"
                    @click="deletePosition(scope.row)">删除
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
    <!--添加职位信息-->
    <el-dialog
      title="添加职位"
      :visible.sync="addPositionDialog"
      width="420px"
      center
      @close="addPositionDialogClose()">
      <el-form :model="addPositionInfo" :rules="addPositionRules"
               ref="addPositionRef" label-width="85px"
               size="small"
               class="demo-ruleForm">
        <el-form-item label="名 称: " prop="positionName">
          <el-input v-model="addPositionInfo.positionName"
                    placeholder="请输入中文名称"
                    style="width: 260px"></el-input>
        </el-form-item>
        <el-form-item label="编 码: " prop="positionCode">
          <el-input v-model="addPositionInfo.positionCode"
                    placeholder="请输入英文编码"
                    style="width: 260px"></el-input>
        </el-form-item>
        <el-form-item label="所属部门: " prop="deptId">
          <el-cascader
            :options="deptTree"
            :clearable="true"
            :props="{ checkStrictly: true ,value: 'deptId',label: 'deptName',expandTrigger: 'hover',emitPath: false}"
            v-model="addPositionInfo.deptId"
            placeholder="选择部门"
            clearable>
          </el-cascader>
        </el-form-item>
        <el-form-item label="职位类别: " prop="positionLevel">
          <el-select v-model="addPositionInfo.positionLevel" placeholder="请选择" style="width: 260px">
            <el-option
              v-for="item in positionLevels"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="职位排序: " prop="positionSort">
          <el-input v-model="addPositionInfo.positionSort"
                    placeholder="输入职位序号"
                    style="width: 260px"></el-input>
        </el-form-item>
        <el-form-item label="职位描述: ">
          <el-input v-model="addPositionInfo.description"
                    placeholder="请输入描述信息"
                    style="width: 260px"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="addPosition()">确 定</el-button>
        <el-button @click="addPositionDialog = false">取 消</el-button>
      </span>
    </el-dialog>
    <!--更新职位信息-->
    <el-dialog
      title="更新职位"
      :visible.sync="updatePositionDialog"
      width="420px"
      center
      @close="updatePositionDialogClose()">
      <el-form :model="updatePositionInfo" :rules="updatePositionRules"
               ref="updatePositionRef" label-width="85px"
               size="small"
               class="demo-ruleForm">
        <el-form-item label="名 称: " prop="positionName">
          <el-input v-model="updatePositionInfo.positionName"
                    placeholder="请输入中文名称"
                    style="width: 260px"></el-input>
        </el-form-item>
        <el-form-item label="编 码: " prop="positionCode">
          <el-input v-model="updatePositionInfo.positionCode"
                    placeholder="请输入英文编码"
                    style="width: 260px"></el-input>
        </el-form-item>
        <el-form-item label="职位类别: " prop="positionLevel">
          <el-select v-model="updatePositionInfo.positionLevel" placeholder="请选择" style="width: 260px">
            <el-option
              v-for="item in positionLevels"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="职位排序: " prop="positionSort">
          <el-input v-model="updatePositionInfo.positionSort"
                    placeholder="输入职位序号"
                    style="width: 260px"></el-input>
        </el-form-item>
        <el-form-item label="职位描述: ">
          <el-input v-model="updatePositionInfo.description"
                    placeholder="请输入描述信息"
                    style="width: 260px"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="updatePosition()">确 定</el-button>
        <el-button @click="updatePositionDialog = false">取 消</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
    export default {
        name: "positions",
        data () {
            var checkSort = (rules, value, cb) => {
                const regex = /^[1-9][0-9]*$/
                if (value == null || "" ==value || regex.test(value)) {
                    return cb()
                } else {
                    cb(new Error('请输入数字'))
                }
            }
            return {
                positionList: [],
                currentPage: 0,
                pageSize: 0,
                positionTotal: 0,
                deptTree: [],
                searchPositionInfo: {
                    searchDeptId: null,
                    searchPositionName: '',
                    timeScope: []
                },
                addPositionDialog: false,
                addPositionInfo: {},
                positionLevels: [
                    {
                        value: 1,
                        label: '1类-该职位仅允许一人'
                    },
                    {
                        value: 2,
                        label: '2类-该职位允许多人'
                    }
                ],
                addPositionRules: {
                    positionName: [{
                        required: true,
                        message: '请输入职位名称',
                        trigger: 'blur'
                    }],
                    positionCode: [{
                        required: true,
                        message: '请输入职位编码',
                        trigger: 'blur'
                    }],
                    deptId: [{
                        required: true,
                        message: '请选择所属部门',
                        trigger: 'blur'
                    }],
                    positionLevel: [{
                        required: true,
                        message: '请选择职位类别',
                        trigger: 'blur'
                    }],
                    positionSort: [
                        {
                            required: false
                        },
                        {
                            validator: checkSort,
                            trigger: 'blur'
                        }
                    ]
                },
                updatePositionDialog: false,
                updatePositionInfo: {},
                updatePositionRules: {
                    positionName: [{
                        required: true,
                        message: '请输入职位名称',
                        trigger: 'blur'
                    }],
                    positionCode: [{
                        required: true,
                        message: '请输入职位编码',
                        trigger: 'blur'
                    }],
                    positionLevel: [{
                        required: true,
                        message: '请选择职位类别',
                        trigger: 'blur'
                    }],
                    positionSort: [
                        {
                            required: false
                        },
                        {
                            validator: checkSort,
                            trigger: 'blur'
                        }
                    ]
                }
            }
        },
        created() {
            this.initPositionList(1,10)
            this.initDeptTree(1,100)
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
            async searchPosition() {
                if(this.searchPositionInfo.timeScope==null){
                    this.searchPositionInfo.timeScope = []
                }
                const {data: res} = await this.$http.get('/position/page', {
                    params: {
                        deptId: this.searchPositionInfo.searchDeptId,
                        positionName: this.searchPositionInfo.searchPositionName,
                        startTime: this.searchPositionInfo.timeScope[0],
                        endTime: this.searchPositionInfo.timeScope[1]
                    }
                })
                if(res.status === 200) {
                    this.positionList = res.data.resultList
                    this.currentPage = res.data.page
                    this.pageSize = res.data.rows
                    this.total = res.data.total
                }else {
                    layer.msg(res.statusName, {
                        offset: '15px',
                        icon: 5,
                        time: 1000
                    })
                }
            },
            addPositionDialogClose() {
                this.$refs.addPositionRef.resetFields()
                this.addPositionInfo = {}
            },
            addPosition() {
                this.$refs.addPositionRef.validate(valid => {
                    if(!valid) {
                        return
                    }
                    const  that = this
                    this.$http.post('/position/add',this.addPositionInfo).then(function (result) {
                        const res = result.data
                        if(res.status === 200) {
                            layer.msg('添加成功', {
                                offset: '15px',
                                icon: 1,
                                time: 1000
                            },function () {
                                that.addPositionDialog = false
                                that.initPositionList(that.currentPage, that.pageSize)
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
            updatePositionDialogOpen(row) {
                this.updatePositionDialog = true
                this.updatePositionInfo = JSON.parse(JSON.stringify(row))
            },
            updatePositionDialogClose() {
                this.$refs.updatePositionRef.resetFields()
                this.updatePositionInfo = {}
            },
            updatePosition() {
                this.$refs.updatePositionRef.validate(valid => {
                    if(!valid) {
                        return
                    }
                    const that = this
                    this.$http.post('/position/update',this.updatePositionInfo).then(function (result) {
                        const res = result.data
                        if(res.status === 200) {
                            layer.msg('更新成功', {
                                offset: '15px',
                                icon: 1,
                                time: 1000
                            },function () {
                                that.updatePositionDialog = false
                                that.initPositionList(that.currentPage,that.pageSize)
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
            deletePosition(row) {
                const that = this
                layer.confirm('此操作不可恢复, 确认删除？', {
                    title: false,
                    closeBtn: 0,
                    btn: ['确认', '取消']
                    ,
                    yes: async function (index, layero) {
                        const {data: res} = await that.$http.get('/position/del', {
                            params: {
                                positionId: row.positionId
                            }
                        })
                        if (res.status == 200) {
                            await that.initPositionList(that.currentPage,that.pageSize)
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
