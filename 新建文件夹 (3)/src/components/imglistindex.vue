<script setup lang="ts">

const { list, selected } = defineProps<{
  list: [{}]
  selected: any
}>()

const emit = defineEmits(['switch', 'remove'])
const switchClick = (url: any) => {
  emit('switch', url)
}
</script>

<template>
  <div class="min-video">
    <div
      class="image-item"
      v-for="(item, index) in list"
      :key="index"
      @click="switchClick(index)"
      :class="{ selected: selected === index }"
    >
      <el-image
      crossorigin="anonymous"
        v-show="item"
        :src="item"
        fit="fill"
        style="height: 100%; min-width: 120px; border-radius: 2px"
      />
      
    </div>
  </div>
</template>

<style lang="less" scoped>
.min-video {
  position: relative;
  height: 100%;
  background-color: #f2f3f5;
  border-radius: 4px;
  padding: 10px 4px;
  display: flex;
  flex-wrap: nowrap;
  overflow: hidden;
  overflow-x: auto;
}
.image-item {
  height: 100%;
  min-width: 124px;
  box-sizing: border-box;
  margin: 0 5px;
  border-radius: 4px;
  cursor: pointer;
  overflow: hidden;
  position: relative;
  padding: 2px;
}
.selected {
  background-color: #67c23a;
}
</style>