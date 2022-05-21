<template>
  <div :class="['os-process', props.type]">
    <el-popconfirm
      confirm-button-text="确定"
      cancel-button-text="取消"
      icon-color="red"
      title="你确定要移除该进程吗？"
      @confirm="emits('remove', props.prog.id)"
    >
      <template #reference>
        <div class="content">
          <span class="id">{{ props.prog.id }}</span>
          <sup v-if="pri" class="pri">{{ props.prog.pri }}</sup>
          <span class="mem">{{ props.prog.mem }}MB</span>
        </div>
      </template>
    </el-popconfirm>
  </div>
</template>

<script lang="ts" setup>
import { Process } from "@/scripts/models";
import { defineProps, defineEmits, getCurrentInstance } from "vue";
const globalProperties =
  getCurrentInstance()?.appContext.config.globalProperties;
let pri = globalProperties?.pri;

const emits = defineEmits<{
  (event: "remove", id: string): void;
}>();
const props = defineProps({
  prog: {
    type: Process,
    required: true,
  },
  type: {
    type: String,
    required: true,
  },
});
</script>

<style lang="stylus" scoped>
.os-process
  display block
  border 1px solid black
  padding 10px
  border-radius 6px
  height 20px
  cursor pointer
  & .content
    & .id
      font-weight bold
      font-size 20px
    & .pri
      font-size 12px
    & .mem
      margin-left 8px
      font-size 16px
  &.new
    border-color #a0cfff
    background-color #ecf5ff
    color #409eff
  &.ready
    border-color #f3d19e
    background-color #fdf6ec
    color #e6a23c
  &.running
    border-color #b3e19d
    background-color #f0f9eb
    color #67c23a
  &.block
    border-color #fab6b6
    background-color #fef0f0
    color #f56c6c
  &.exit
    border-color #c8c9cc
    background-color #f4f4f5
    color #909399
</style>
