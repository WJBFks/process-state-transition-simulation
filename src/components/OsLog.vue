<template>
  <div class="os-log">
    <span class="lid">{{ id }}</span>
    <span class="timestamp">{{ timestamp }}</span>
    <span :class="['operate', operate]">{{ operate }}</span>
    <span class="content">
      [
      <span class="id">{{ prog.id }}</span>
      <sup v-if="pri" class="pri">{{ prog.pri }}</sup>
      <span class="mem">{{ prog.mem }}MB</span>
      ]
    </span>
    <span v-if="operate == 'Create'">
      &nbsp;to&nbsp;
      <span :class="['type', 'new']">new</span>.
    </span>
    <span v-else>
      &nbsp;from&nbsp;
      <span :class="['type', from]">{{ from }}</span>
      &nbsp;to&nbsp;
      <span :class="['type', to]">{{ to }}</span>
      .&nbsp;
    </span>
    <span v-if="memFrom != undefined && memFrom != memTo" class="memory">
      Memory from&nbsp;
      <span class="main">{{ memFrom }}</span>
      <span class="info">/{{ memMax }}MB </span>to
      <span class="main">{{ memTo }}</span>
      <span class="info">/{{ memMax }}MB.</span>
    </span>
  </div>
</template>

<script lang="ts" setup>
import { Process } from "@/scripts/models";
import { defineProps, getCurrentInstance } from "vue";
const globalProperties =
  getCurrentInstance()?.appContext.config.globalProperties;
let pri = globalProperties?.pri;

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const props = defineProps({
  id: {
    type: Number,
    required: true,
  },
  prog: {
    type: Process,
    required: true,
  },
  operate: {
    type: String,
    required: true,
  },
  from: {
    type: String,
    required: false,
  },
  to: {
    type: String,
    required: false,
  },
  memFrom: {
    type: Number,
    required: false,
  },
  memTo: {
    type: Number,
    required: false,
  },
  memMax: {
    type: Number,
    required: false,
  },
});
const getTimestamp = () => {
  //author: meizz
  let date = new Date();
  let h = date.getHours();
  let m = date.getMinutes();
  let s = date.getSeconds();
  let hh = h < 10 ? "0" + h : "" + h;
  let mm = m < 10 ? "0" + m : "" + m;
  let ss = s < 10 ? "0" + s : "" + s;
  return `${hh}:${mm}:${ss}`;
};
const timestamp = getTimestamp();
</script>

<style lang="stylus" scoped>
.os-log
  color #626aef
  font-size 20px
  margin 5px 0
  & .content
    & .id
      font-weight bold
      font-size 20px
    & .pri
      font-size 12px
    & .mem
      margin-top 4px
      margin-left 8px
      font-size 16px
  & .type
    font-weight bold
    &.new
      color #409eff
    &.ready
      color #e6a23c
    &.running
      color #67c23a
    &.block
      color #f56c6c
    &.exit
      color #909399
  & .memory
    & .main
      font-weight bold
      font-size 20px
    & .info
      font-size 16px
  & .timestamp
    font-weight bold
    margin-right 20px
& .lid
  display inline-block
  width 24px
  height 24px
  line-height 24px
  color #626aef
  background-color rgb(239, 240, 253)
  border #626aef solid 1px
  border-radius 50%
  text-align center
  margin-right 5px
.operate
  display inline-block
  font-weight bold
  width 100px
  &.Create
    color #409eff
  &.Admit, &.Timeout
    color #e6a23c
  &.Dispatch, &.Occurs
    color #67c23a
  &.Wait
    color #f56c6c
  &.Release
    color #909399
</style>
