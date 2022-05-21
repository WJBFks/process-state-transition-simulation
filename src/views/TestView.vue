<template>
  <div>
    <el-scrollbar>
      <div class="scrollbar-flex-content">
        <p v-for="item in cnt" :key="item" class="scrollbar-demo-item">
          {{ item }}
        </p>
      </div>
    </el-scrollbar>
    <el-button type="primary" @click="cnt--"></el-button>
  </div>
</template>

<script lang="ts" setup>
import { ref } from "vue";
const cnt = ref(50);
</script>

<style scoped>
.scrollbar-flex-content {
  display: flex;
}
.scrollbar-demo-item {
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100px;
  height: 50px;
  margin: 10px;
  text-align: center;
  border-radius: 4px;
  background: var(--el-color-danger-light-9);
  color: var(--el-color-danger);
}
</style>
