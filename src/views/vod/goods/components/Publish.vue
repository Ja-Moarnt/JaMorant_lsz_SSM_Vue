<template>
  <div class="app-container">
    <!--课程预览-->
    <div class="ccInfo">
      <img :src="goodsPublish.cover">
      <div class="main">
        <h2>{{ goodsPublish.title }}</h2>
        <p><span>所属分类：{{ goodsPublish.subjectParentId }} — {{ goodsPublish.subjectId }}</span></p>
        <h3 class="red">￥{{ goodsPublish.price }}</h3>
      </div>
    </div>
    <div style="text-align:center">
      <el-button type="primary" @click="prev()">上一步</el-button>
      <el-button :disabled="publishBtnDisabled" type="primary" @click="publish()">上架商品</el-button>
    </div>
  </div>
</template>

<script>
import goodsApi from '@/api/vod/goods'

export default {
  data() {
    return {
      publishBtnDisabled: false, // 按钮是否禁用
      goodsPublish: {}
    }
  },
  created() {
    if (this.$parent.goodsId) {
      this.fetchCoursePublishById(this.$parent.goodsId)
    }
  },
  methods: {
    // 获取课程发布信息
    fetchCoursePublishById(id) {
      goodsApi.getGoodsInfoById(id).then(response => {
        this.goodsPublish = response.data
      })
    },
    // 上一步
    prev() {
      this.$parent.active = 1
    },
    // 下一步
    publish() {
      this.publishBtnDisabled = true
      goodsApi.publishGoodsById(this.$parent.goodsId).then(response => {
        this.$parent.active = 3
        this.$message.success(response.message)
        this.$router.push({ path: '/vodgoods/goods/list' })
      })
    }
  }
}
</script>
<style scoped>
.ccInfo {
    background: #f5f5f5;
    padding: 20px;
    overflow: hidden;
    border: 1px dashed #DDD;
    margin-bottom: 40px;
    position: relative;
}
.ccInfo img {
    background: #d6d6d6;
    width: 500px;
    height: 278px;
    display: block;
    float: left;
    border: none;
}
.ccInfo .main {
    margin-left: 520px;
}
.ccInfo .main h2 {
    font-size: 28px;
    margin-bottom: 30px;
    line-height: 1;
    font-weight: normal;
}
.ccInfo .main p {
    margin-bottom: 10px;
    word-wrap: break-word;
    line-height: 24px;
    max-height: 48px;
    overflow: hidden;
}
.ccInfo .main p {
    margin-bottom: 10px;
    word-wrap: break-word;
    line-height: 24px;
    max-height: 48px;
    overflow: hidden;
}
.ccInfo .main h3 {
    left: 540px;
    bottom: 20px;
    line-height: 1;
    font-size: 28px;
    color: #d32f24;
    font-weight: normal;
    position: absolute;
}
</style>
