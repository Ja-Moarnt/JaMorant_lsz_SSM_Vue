<template>
  <div class="app-container">
    <!-- 课程信息表单 -->
    <el-form label-width="120px">
      <el-form-item label="车牌号">
        <el-input v-model="CarInfo.carId"  rows="1"  placeholder="赣B xxxxx"/>
      </el-form-item>
      <!-- 所属分类：级联下拉列表 -->
      <el-form-item label="城市">
        <!-- 一级分类 -->
        <el-select
          v-model="CarInfo.chengshiParentId"
          placeholder="请选择"
          @change="chengshiChanged"
        >
          <el-option
            v-for="chengshi in chengshiList"
            :key="chengshi.id"
            :label="chengshi.title"
            :value="chengshi.id"
          />
        </el-select>
        <!-- 二级分类 -->
        <el-select
          v-model="CarInfo.chengshiId"
          placeholder="请选择">

          <el-option
            v-for="chengshi in chengshiLevelTwoList"
            :key="chengshi.id"
            :label="chengshi.title"
            :value="chengshi.id"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="货柜号">
        <div style="display: flex; align-items: center;">
        <el-input v-model="CarInfo.guiId" style="width: 300px; margin-right: 30px;"/>
          <span style="margin-left: 40px;"><span style="color: green;font-weight: bold;">订单流水号：</span><b>{{CarInfo.orderLiu}}</b></span>
        </div>
      </el-form-item>
      <el-form-item label="广告基础分成">
        <div style="display: flex; align-items: center;">
          <el-input-number v-model="CarInfo.jifeng" style="width: 250px; margin-right: 30px;"></el-input-number>
          <b>(元/小时)</b>
          <span style="margin-left: 40px;"><span style="color: green ;font-weight: bold;">当前分成：</span><b>{{CarInfo.fengcheng}}</b></span>
          <span style="margin-left: 40px;"><span style="color: green;font-weight: bold;">当前盈利：</span><b>{{CarInfo.yingli}}</b></span>
        </div>
      </el-form-item>
      <el-form-item label="审核状态">
        <input type="radio" v-model="CarInfo.carStatus" :value="0"> 未审核
        <input type="radio" v-model="CarInfo.carStatus" :value="1"> 已审核
      </el-form-item>

      <!-- 课程讲师 -->
      <el-form-item label="司机">
        <el-select
          v-model="CarInfo.teacherId"
          placeholder="请选择"
        >
          <el-option
            v-for="teacher in teacherList"
            :key="teacher.id"
            :label="teacher.name"
            :value="teacher.id"
          />
        </el-select>
      </el-form-item>

      <!-- 所属分类：级联下拉列表 -->
      <el-form-item label="广告的商品类别">
        <!-- 一级分类 -->
        <el-select
          v-model="CarInfo.subjectParentId"
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
          v-model="CarInfo.subjectId"
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
      <el-form-item label="广告的商品名称">
        <!-- 商品名称-->
        <el-select v-model="CarInfo.goodsId" placeholder="请选择"
                   @change="videoChanged">
          <el-option
            v-for="goods in goodsList"
            :key="goods.id"
            :label="goods.title"
            :value="goods.id"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="广告名称">
        <!-- 商品名称-->
        <el-select v-model="CarInfo.videoId" placeholder="请选择">
          <el-option
            v-for="video in videoList"
            :key="video.id"
            :label="video.title"
            :value="video.id"
          />
        </el-select>
      </el-form-item>


    </el-form>

    <div style="text-align:center">
      <el-button :disabled="saveBtnDisabled" type="primary" @click="saveAndNext()">保存并下一步</el-button>
    </div>
  </div>
</template>
<script>
import carApi from '@/api/vod/car'
import teacherApi from '@/api/vod/teacher'
import subjectApi from '@/api/vod/subject'
import goodsApi from '@/api/vod/goods'
import videoApi from '@/api/vod/video'
import chengshiApi from '@/api/thc/chengshi'


export default {
  data() {
    return {
      BASE_API: 'https://localhost:8333',
      saveBtnDisabled: false, // 按钮是否禁用
      CarInfo: { // 表单数据
        title:'',
        // 以下解决表单数据不全时insert语句非空校验
        goodsId:'',
        videoId:'',
        teacherId: '',
        subjectId: '',
        subjectParentId: '',
        chengshiId: '',
        chengshiParentId: '',

      },
      teacherList: [], // 讲师列表
      subjectList: [], // 一级分类列表
      subjectLevelTwoList: [],// 二级分类列表
      chengshiList: [], // 一级分类列表
      chengshiLevelTwoList: [],// 二级分类列表
      goodsList:[],
      videoList:[]
    }
  },
  created() {
    if (this.$parent.carId) { // 回显
      this.fetchCarInfoById(this.$parent.carId)
    } else { // 新增
      // 初始化分类列表
      this.initSubjectList()
      // 初始化分类列表
      this.initchengshiList()
    }
    // 获取讲师列表
    this.initTeacherList()
  },
  methods: {
    // 获取课程信息
    fetchCarInfoById(id) {
      carApi.getCarInfoById(id).then(response => {
        this.CarInfo = response.data
        // 初始化分类列表
        subjectApi.getChildList(0).then(response => {
          this.subjectList = response.data
          // 填充二级菜单：遍历一级菜单列表，
          this.subjectList.forEach(subject => {
            // 找到和courseInfo.subjectParentId一致的父类别记录
            if (subject.id === this.CarInfo.subjectParentId) {
              // 拿到当前类别下的子类别列表，将子类别列表填入二级下拉菜单列表
              subjectApi.getChildList(subject.id).then(response => {
                this.subjectLevelTwoList = response.data
                this.subjectLevelTwoList.forEach(subjectLevelTwo => {
                  goodsApi.GetgoodsBysubid(subjectLevelTwo.id).then(response=>{
                    this.goodsList=response.data
                    this.goodsList.forEach(goods => {
                      videoApi.getBygoodsId(goods.id).then(response=>{
                        this.videoList=response.data
                      })
                    })
                  })
                })
              })
            }
          })
        })
        chengshiApi.getChildList(0).then(response => {
          this.chengshiList = response.data
          // 填充二级菜单：遍历一级菜单列表，
          this.chengshiList.forEach(chengshi => {
            // 找到和courseInfo.subjectParentId一致的父类别记录
            if (chengshi.id === this.CarInfo.chengshiParentId) {
              // 拿到当前类别下的子类别列表，将子类别列表填入二级下拉菜单列表
              chengshiApi.getChildList(chengshi.id).then(response => {
                this.chengshiLevelTwoList = response.data
              })
            }
          })
        })
      })
    },
    // 获取讲师列表
    initTeacherList() {
      teacherApi.list().then(response => {
        this.teacherList = response.data
      })
    },

    // 初始化分类列表
    initSubjectList() {
      subjectApi.getChildList(0).then(response => {
        this.subjectList = response.data
      })
    },
    // 初始化分类列表
    initchengshiList() {
      chengshiApi.getChildList(0).then(response => {
        this.chengshiList = response.data
      })
    },
    // 选择一级分类，切换二级分类
    chengshiChanged(value) {
      chengshiApi.getChildList(value).then(response => {
        this.CarInfo.chengshiId = ''
        this.chengshiLevelTwoList = response.data
      })
    },

    // 选择一级分类，切换二级分类
    subjectChanged(value) {
      subjectApi.getChildList(value).then(response => {
        this.CarInfo.subjectId = ''
        this.CarInfo.goodsId=''
        this.CarInfo.videoId=''
        this.subjectLevelTwoList = response.data
      })
    },
    // 商品列表
    goodsChanged(subjectId) {
      goodsApi.GetgoodsBysubid(subjectId).then(response => {
        this.CarInfo.goodsId=''
        this.CarInfo.videoId=''
        this.goodsList = response.data
      })
    },

    // 广告列表
    videoChanged(goodsid) {
      videoApi.getBygoodsId(goodsid).then(response => {
        this.CarInfo.videoId=''
        this.videoList = response.data
      })
    },


    // 保存并下一步
    saveAndNext() {
      this.saveBtnDisabled = true
      if (!this.$parent.carId) {
        this.saveData()
      } else {
        this.updateData()
      }
    },
    // 修改
    updateData() {
      carApi.updateCarInfoById(this.CarInfo).then(response => {
        this.$message.success(response.message)
        this.$parent.carId = response.data // 获取courseId
        //this.$parent.activoe = 1 // 下一步
        this.$router.push({ path: '/vodcar/car/list' })
      })
    },

    // 保存
    saveData() {
      carApi.saveCarInfo(this.CarInfo).then(response => {
        this.$message.success(response.message)
        this.$parent.carId = response.data // 获取courseId
        //this.$parent.active = 1 // 下一步
        this.$router.push({ path: '/vodcar/car/list' })
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
