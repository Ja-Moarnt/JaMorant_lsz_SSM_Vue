<template>
  <div class="app-container">
    <!-- 课程信息表单 -->
    <el-form label-width="120px">
      <!-- 课程讲师 -->
      <el-form-item label="车牌号">
        <el-select
          v-model="CarShopingInfo.carId"
          placeholder="请选择"
        >
          <el-option
            v-for="carid in caridList"
            :key="carid.id"
            :label="carid.carId"
            :value="carid.id"
          />
        </el-select>
      </el-form-item>
      <!-- 所属分类：级联下拉列表 -->
      <el-form-item label="商品类别">
        <!-- 一级分类 -->
        <el-select
          v-model="CarShopingInfo.subjectParentId"
          placeholder="请选择"
          @change="subjectChanged"
        >
          <el-option
            v-for="subject in subjectList"
            :key="subject.id"
            :label="subject.title"
            :value="subject.id"
          />
        </el-select>
        <!-- 二级分类 -->
        <el-select
          v-model="CarShopingInfo.subjectId"
                   placeholder="请选择"
          @change="goodsChanged">

          <el-option
            v-for="subject in subjectLevelTwoList"
            :key="subject.id"
            :label="subject.title"
            :value="subject.id"
          />
        </el-select>
      </el-form-item>

      <el-form-item label="商品名称">
        <!-- 商品名称-->
        <el-select v-model="CarShopingInfo.goodsId" placeholder="请选择">
          <el-option
            v-for="goods in goodsList"
            :key="goods.id"
            :label="goods.title"
            :value="goods.id"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="剩余货物数量">
          <el-input-number v-model="CarShopingInfo.shengCount" :min="0" controls-position="right" placeholder="剩余数量" />
      </el-form-item>
      <el-form-item label="历史销售数量">
        <el-input-number v-model="CarShopingInfo.buyCount" :min="0" controls-position="right" placeholder="历史数量" />
      </el-form-item>
    </el-form>

    <div style="text-align:center">
      <el-button :disabled="saveBtnDisabled" type="primary" @click="saveAndNext()">保存并下一步</el-button>
    </div>
  </div>
</template>
<script>
import carshopingApi from '@/api/vod/carshoping'
import carApi from '@/api/vod/car'
import subjectApi from '@/api/vod/subject'
import goodsApi from '@/api/vod/goods'

export default {
  data() {
    return {
      BASE_API: 'https://localhost:8333',
      saveBtnDisabled: false, // 按钮是否禁用
      CarShopingInfo: { // 表单数据
        price: '',
        shengCount:'',
        buyCount:'',
        title:'',
        // 以下解决表单数据不全时insert语句非空校验
        goodsId:'',
        carId: '',
        subjectId: '',
        subjectParentId: '',
        cover: '',
      },
      caridList: [], // 讲师列表
      subjectList: [], // 一级分类列表
      subjectLevelTwoList: [],// 二级分类列表
      goodsList:[]
    }
  },
  created() {
    if (this.$parent.carshopingId) { // 回显
      this.fetchCarShopingInfoById(this.$parent.carshopingId)
    } else { // 新增
      // 初始化分类列表
      this.initSubjectList()
    }
    // 获取讲师列表
    this.initCarIdList()
  },
  methods: {
    // 获取课程信息
    fetchCarShopingInfoById(id) {
      carshopingApi.getCarShopingInfoById(id).then(response => {
        this.CarShopingInfo = response.data
        // 初始化分类列表
        subjectApi.getChildList(0).then(response => {
          this.subjectList = response.data
          // 填充二级菜单：遍历一级菜单列表，
          this.subjectList.forEach(subject => {
            // 找到和courseInfo.subjectParentId一致的父类别记录
            if (subject.id === this.CarShopingInfo.subjectParentId) {
              // 拿到当前类别下的子类别列表，将子类别列表填入二级下拉菜单列表
              subjectApi.getChildList(subject.id).then(response => {
                this.subjectLevelTwoList = response.data
                this.subjectLevelTwoList.forEach(subjectLevelTwo => {
                  goodsApi.GetgoodsBysubid(subjectLevelTwo.id).then(response=>{
                    this.goodsList=response.data
                  })
                })
              })
            }
          })
        })
      })
    },
    // 获取讲师列表
    initCarIdList() {
      carApi.findAll().then(response => {
        this.caridList = response.data
      })
    },

    // 初始化分类列表
    initSubjectList() {
      subjectApi.getChildList(0).then(response => {
        this.subjectList = response.data
      })
    },

    // 选择一级分类，切换二级分类
    subjectChanged(value) {
      subjectApi.getChildList(value).then(response => {
        this.CarShopingInfo.subjectId = ''
        this.CarShopingInfo.goodsId=''
        this.subjectLevelTwoList = response.data
      })
    },
    // 商品列表
    goodsChanged(subjectId) {
      goodsApi.GetgoodsBysubid(subjectId).then(response => {
        this.CarShopingInfo.goodsId=''
        this.goodsList = response.data
      })
    },


    // 保存并下一步
    saveAndNext() {
      this.saveBtnDisabled = true
      if (!this.$parent.carshopingId) {
        this.saveData()
      } else {
        this.updateData()
      }
    },
    // 修改
    updateData() {
      carshopingApi.updateCarShopingInfoById(this.CarShopingInfo).then(response => {
        this.$message.success(response.message)
        this.$parent.carshopingId = response.data // 获取courseId
        //this.$parent.activoe = 1 // 下一步
        this.$router.push({ path: '/vodcarshoping/carshoping/list' })
      })
    },

    // 保存
    saveData() {
      carshopingApi.saveCarShopingInfo(this.CarShopingInfo).then(response => {
        this.$message.success(response.message)
        this.$parent.carshopingId = response.data // 获取courseId
        //this.$parent.active = 1 // 下一步
        this.$router.push({ path: '/vodcarshoping/carshoping/list' })
      })
    }

  }
}
</script>
<style scoped>
.tinymce-container {
  position: relative;
  line-height: normal;
}
.cover-uploader .avatar-uploader-icon {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;

  font-size: 28px;
  color: #8c939d;
  width: 640px;
  height: 357px;
  line-height: 357px;
  text-align: center;
}
.cover-uploader .avatar-uploader-icon:hover {
  border-color: #409EFF;
}
.cover-uploader img {
  width: 640px;
  height: 357px;
  display: block;
}
</style>
