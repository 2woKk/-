<!--
 * @Author: huhaibiao
 * @Date: 2023-05-11 15:30:10
-->
<script setup lang="ts">

const emit = defineEmits([
  'selectVideo',
  'upLoadFont',
  'upLoadImage',
  'upLoadSubTitle',
  'downloadVideo',
  'postVideo'
])
</script>

<template>
  <div class="control-btns">
    <el-button @click="emit('selectVideo')">
      {{ '上传视频' }}
    </el-button>
  </div>
</template>

<style lang="less" scoped>
.control-btns {
  width: 100%;
  flex-wrap: wrap;
  > button {
    margin: 1px 6px;
  }
}
</style>

<style>
@media (max-width: 600px) {
  .control-btns > button {
    padding: 6px 8px;
  }
}
</style>
