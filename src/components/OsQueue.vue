<template>
  <div :class="['os-queue', props.type]">
    <div class="content flex">
      <div class="title">{{ props.type }}</div>
      <div class="queue">
        <os-Process
          v-for="item in progs"
          :key="item.id"
          :prog="item"
          :type="props.type"
          @remove="remove"
        ></os-Process>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { Process } from "@/scripts/models";
import OsProcess from "./OsProcess.vue";
import { ref, defineProps, defineEmits } from "vue";
const emit = defineEmits(["update:progs"]);

const props = defineProps({
  progs: {
    type: Array as () => Array<Process>,
    required: true,
  },
  type: {
    type: String,
    required: true,
  },
});
const progs = ref(props.progs);
const remove = (id: string) => {
  progs.value = props.progs.filter((item: Process) => item.id != id);
  emit("update:progs", progs.value);
};
</script>

<style lang="stylus" scoped>
.os-queue
  display block
  border 1px solid black
  padding 10px
  border-radius 6px
  height 42px
  width 100%
  & .title
    min-width 100px
    text-align center
    font-size 24px
    margin 7px 0
    font-weight bold
  & .queue
    display flex
    overflow-x hidden
  &:hover .queue
    overflow-x auto
  .os-Process
    margin-left 10px
  & .content
    display flex
    & .id
      font-weight bold
      font-size 20px
    & .pri
      font-size 12px
    & .mem
      margin-top 4px
      margin-left 8px
      font-size 16px
      justify-content bottom
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
.queue::-webkit-scrollbar
  /* 滚动条整体样式 */
  height 8px
.queue::-webkit-scrollbar-thumb
  /* 滚动条里面小方块 */
  border-radius 10px
  background rgba(100, 100, 100, 0.5)
  .new &
    background alpha(#409eff, 0.5)
  .ready &
    background alpha(#e6a23c, 0.5)
  .running &
    background alpha(#67c23a, 0.5)
  .block &
    background alpha(#f56c6c, 0.5)
  .exit &
    background alpha(#909399, 0.5)
.queue::-webkit-scrollbar-track
  /* 滚动条里面轨道 */
  border-radius 10px
  background rgba(0, 0, 0, 0)
</style>
