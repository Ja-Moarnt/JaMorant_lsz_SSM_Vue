<template>
  <div class="app-container">
    <!--查询表单-->
    <el-card class="operate-container" shadow="never">
      <el-form :inline="true" class="demo-form-inline">

        <!-- 所属分类：级联下拉列表 -->
        <!-- 一级分类 -->
        <el-form-item label="商品类别">
          <el-select
            v-model="searchObj.subjectParentId"
            placeholder="请选择"
            @change="subjectLevelOneChanged"
          >
            <el-option
              v-for="subject in subjectList"
              :key="subject.id"
              :label="subject.title"
              :value="subject.id"
            />
          </el-select>

          <!-- 二级分类 -->
          <el-select v-model="searchObj.subjectId" placeholder="请选择">
            <el-option
              v-for="subject in subjectLevelTwoList"
              :key="subject.id"
              :label="subject.title"
              :value="subject.id"
            />
          </el-select>
        </el-form-item>

        <!-- 标题 -->
        <el-form-item label="商品名">
          <el-input v-model="searchObj.title" placeholder="商品名" />
        </el-form-item>
        <br>
        <!-- 标题 -->
        <el-form-item label="价格下限">
          <el-input v-model="searchObj.price1" placeholder="价格" />
        </el-form-item>
        <!-- 标题 -->
        <el-form-item label="价格上限">
          <el-input v-model="searchObj.price2" placeholder="价格" />
        </el-form-item>

        <el-button type="primary" icon="el-icon-search" @click="fetchData()">查询</el-button>
        <el-button type="default" @click="resetData()">清空</el-button>
      </el-form>
    </el-card>

    <!-- 工具按钮 -->
    <el-card class="operate-container" shadow="never">
      <i class="el-icon-tickets" style="margin-top: 5px" />
      <span style="margin-top: 5px">数据列表</span>
      <el-button class="btn-add" @click="add()">添加</el-button>
      <el-button class="btn-add" @click="batchRemove()" >批量删除</el-button>
    </el-card>

    <!-- 表格 -->
    <el-table
      :data="list"
      border
      stripe
      @selection-change="handleSelectionChange">
      <el-table-column type="selection"/>
      <el-table-column label="#" width="50">
        <template slot-scope="scope">
          {{ (page - 1) * limit + scope.$index + 1 }}
        </template>
      </el-table-column>

      <el-table-column label="封面" width="200" align="center">
        <template slot-scope="scope">
          <img :src="scope.row.cover" alt="scope.row.title" width="100%">
        </template>
      </el-table-column>
      <el-table-column label="商品信息">
        <template slot-scope="scope">
          <a href="">{{ scope.row.title }}</a>
          <p>
            分类：{{ scope.row.param.subjectParentTitle }} > {{ scope.row.param.subjectTitle }}
          </p>
        </template>
      </el-table-column>
      <el-table-column label="价格(元)" width="100" align="center">
        <template slot-scope="scope">
          <!-- {{ typeof '0' }}  {{ typeof 0 }} {{ '0' == 0 }} -->
          <!-- {{ typeof scope.row.price }}
          {{ typeof Number(scope.row.price) }}
          {{ typeof Number(scope.row.price).toFixed(2) }} -->

          <el-tag v-if="Number(scope.row.price) === 0" type="success">免费</el-tag>

          <!-- 前端解决保留两位小数的问题 -->
          <!-- <el-tag v-else>{{ Number(scope.row.price).toFixed(2) }}</el-tag> -->

          <!-- 后端解决保留两位小数的问题，前端不用处理 -->
          <el-tag v-else>{{ scope.row.price }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="status" label="商品上架状态" width="150" align="center">
        <template slot-scope="scope">
          <el-tag :type="scope.row.status === 0 ? 'warning' : 'success'">{{ scope.row.status === 0 ? '未上架' : '已上架' }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="创建时间" width="140" align="center">
        <template slot-scope="scope">
          {{ scope.row.createTime ? scope.row.createTime.substr(0, 16) : '' }}
        </template>
      </el-table-column>

      <el-table-column label="操作" width="210" align="center">
        <template slot-scope="scope">
          <router-link :to="'/vodgoods/goods/info/'+scope.row.id">
            <el-button type="text" icon="el-icon-edit">基本信息</el-button>
          </router-link>
          <router-link :to="'/vodgoods/goods/video/'+scope.row.id">
            <el-button type="text" icon="el-icon-edit">宣传视频 </el-button>
          </router-link>
          <router-link :to="'/vodgoods/goods/chart/'+scope.row.id">
            <el-button type="text" icon="el-icon-edit">商品统计</el-button>
          </router-link>
          <el-button type="text" icon="el-icon-delete" @click="removeById(scope.row.id)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- 分页组件 -->
    <el-pagination
      :current-page="page"
      :total="total"
      :page-size="limit"
      :page-sizes="[5, 10, 20, 30, 40, 50, 100]"
      style="padding: 30px 0; text-align: center;"
      layout="total, sizes, prev, pager, next, jumper"
      @size-change="changePageSize"
      @current-change="changeCurrentPage"
    />
  </div>
</template>

<script>
import GoodsApi from '@/api/vod/goods'
import subjectApi from '@/api/vod/subject'
import teacherApi from '@/api/vod/teacher'

export default {

  data() {
    return {
      list: [], // 课程列表
      total: 0, // 总记录数
      page: 1, // 页码
      limit: 10, // 每页记录数
      searchObj: {
        subjectId: ''// 解决查询表单无法选中二级类别
      }, // 查询条件
      subjectList: [], // 一级分类列表
      subjectLevelTwoList: [], // 二级分类列表,
      multipleSelection: []// 批量删除选中的记录列表
    }
  },

  created() {
    this.fetchData()
    // 初始化分类列表
    this.initSubjectList()
    // 获取讲师列表
    this.initTeacherList()
  },

  methods: {
    //批量删除
    batchRemove() {
      //判断非空
      if(this.multipleSelection.length===0) {
        this.$message.warning('请选择要删除的记录！')
        return
      }
      this.$confirm('此操作将删除该商品信息, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        var idList = []
        // [1,2,3]
        //遍历数组
        for(var i=0;i<this.multipleSelection.length;i++) {
          var obj = this.multipleSelection[i]
          var id = obj.id
          //放到数组
          idList.push(id)
        }
        //调用接口删除
        GoodsApi.batchRemove(idList)
          .then(response => {
            //提示
            this.$message({
              type: 'success',
              message: '删除成功!'
            });
            //刷新
            this.fetchData()
          })
      })
    },
    //复选框发生变化，调用方法，选中复选框行内容传递
    handleSelectionChange(selection) {
      this.multipleSelection = selection
    },
    fetchData() {
      GoodsApi.getPageList(this.page, this.limit, this.searchObj).then(response => {
        this.list = response.data.records
        console.log(this.list)
        this.total = response.data.totalCount
      })
    },

    initSubjectList() {
      subjectApi.getChildList(0).then(response => {
        this.subjectList = response.data
      })
    },

    subjectLevelOneChanged(value) {
      subjectApi.getChildList(value).then(response => {
        this.subjectLevelTwoList = response.data
        this.searchObj.subjectId = ''
      })
    },

    add() {
      this.$router.push({ path: '/vodgoods/goods/info' })
    },

    // 每页记录数改变，size：回调参数，表示当前选中的“每页条数”
    changePageSize(size) {
      this.limit = size
      this.fetchData()
    },

    // 改变页码，page：回调参数，表示当前选中的“页码”
    changeCurrentPage(page) {
      this.page = page
      this.fetchData()
    },

    // 重置表单
    resetData() {
      this.searchObj = {}
      this.subjectLevelTwoList = [] // 二级分类列表
      this.fetchData()
    },

    // 根据id删除数据
    removeById(id) {
      this.$confirm('此操作将永久删除该商品，以及该商品下的广告，是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        return GoodsApi.removeById(id)
      }).then(response => {
        this.fetchData()
        this.$message.success(response.message)
      })
    }
  }
}
</script>
