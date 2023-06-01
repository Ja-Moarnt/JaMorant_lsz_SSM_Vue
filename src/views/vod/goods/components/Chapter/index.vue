<template>
  <div class="app-container">

    <!-- 添加章节按钮 -->
    <div>
      <el-button type="primary" @click="addVideo()">添加视频</el-button>
    </div>

    <!-- 章节列表 -->
    <ul class="chapterList">

      <!-- 视频 -->
      <ul class="chapterList videoList">
        <li
          v-for="video in videoList"
          :key="video.id"
        >
          <p>
            {{ video.title }}
            <span class="acts">
              <el-button @click="sendmessage(video.id)" type="warning" size="mini" plain>观看</el-button>
              <el-button type="text" @click="editVideo(video.id)">编辑</el-button>
              <el-button type="text" @click="removeVideoById(video.id)">删除</el-button>
            </span>
          </p>
<!--          <div id="video_container"></div>-->
        </li>
      </ul>
    </ul>

    <!-- 弹出的页面内容 -->
    <el-dialog :visible.sync="getmessage">
      <div>
      <h1 style="text-align: center;color: #d32f24">宣传视频</h1>
        <video id="my-video"muted="muted" loop="true" width="632" height="360" autoplay="true" class="video-js">
          <source src="" type="video/mp4">
        </video>
        </div>
    </el-dialog>

    <!-- 课时表单对话框 -->
    <video-form ref="videoForm" />
    <div style="text-align:center">
      <el-button type="primary" @click="prev()">上一步</el-button>
      <el-button type="primary" @click="next()">下一步</el-button>
    </div>
  </div>
</template>

<script>

import videoApi from '@/api/vod/video'
import vodApi from '@/api/vod/vod'

// 引入组件
import VideoForm from '@/views/vod/goods/components/Video/Form'
import videojs from 'video.js';
import 'video.js/dist/video-js.css';

export default {
  // 注册组件
  components: { VideoForm},
  data() {
    return {
      videoList: [] // 视频列表
      ,  //弹框
      getmessage:false,
    }
  },
  created() {
    this.fetchNodeList(),
      this.getPlayAuth(this.$route.params.videoId);
  },
  methods: {
    getvoid(videoId) {
      vodApi.getPlayAuth(videoId).then(response => {
        console.log(response.data);
        this.play(response.data);

        //展开章节
        this.activeNames = [response.data.chapterId]
        //选中播放视频
        this.activeVideoId = response.data.videoId
      })
    },
    play(data) {
      const video = videojs('my-video', {}, function () {
        // 播放器创建成功后的回调函数
        console.log('播放器创建成功');
      });
      video.src({src: data.videoSourceId, type: 'video/mp4'});
      video.load();
      video.play();
    },
    //弹框
    sendmessage(videoId){
      this.getmessage = true
      this.getvoid(videoId)
    },
    fetchNodeList() {
      videoApi.getBygoodsId(this.$parent.goodsId).then(response => {
        this.videoList = response.data
      })
    },
    // 添加课时
    addVideo() {
      this.$refs.videoForm.open()
    },
    // 编辑课时
    editVideo(videoId) {
      this.$refs.videoForm.open(videoId)
    },
    // 删除课时
    removeVideoById(videoId) {
      this.$confirm('此操作将永久删除该广告, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        return videoApi.removeById(videoId)
      }).then(response => {
        this.fetchNodeList()
        this.$message.success(response.message)
      }).catch((response) => {
        if (response === 'cancel') {
          this.$message.info('取消删除')
        }
      })
    },
    // 上一步
    prev() {
      this.$parent.active = 0
    },
    // 下一步
    next() {
      this.$parent.active = 2
    }
  }
}
</script>
<style scoped>
.chapterList{
    position: relative;
    list-style: none;
    margin: 0;
    padding: 0;
}
.chapterList li{
  position: relative;
}
.chapterList p{
  float: left;
  font-size: 20px;
  margin: 10px 0;
  padding: 10px;
  height: 70px;
  line-height: 50px;
  width: 100%;
  border: 1px solid #DDD;
}
.chapterList .acts {
    float: right;
    font-size: 14px;
}

.videoList{
  padding-left: 50px;
}
.videoList p{
  float: left;
  font-size: 14px;
  margin: 10px 0;
  padding: 10px;
  height: 50px;
  line-height: 30px;
  width: 100%;
  border: 1px dashed #DDD;
}
</style>
