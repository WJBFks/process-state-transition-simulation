<template>
  <div class="home">
    <div class="status">
      <div class="outline t1">
        <os-queue v-model:progs="progsNew" type="new"></os-queue>
      </div>
      <div class="outline t2">
        <os-queue v-model:progs="progsReady" type="ready"></os-queue>
        <div class="mem">
          <div class="text">{{ currentMemory }}/100MB</div>
        </div>
      </div>
      <div class="outline t3">
        <os-queue v-model:progs="progsRunning" type="running"></os-queue>
      </div>
      <div class="outline t4">
        <os-queue v-model:progs="progsBlock" type="block"></os-queue>
      </div>
      <div class="outline t5">
        <os-queue v-model:progs="progsExit" type="exit"></os-queue>
      </div>
      <div class="operate">
        <div class="create">
          <div class="id">
            P{{ counter < 10 ? "0" + counter : "" + counter }}
          </div>
          <div v-if="pri" class="input">
            <div class="tip">priority</div>
            <el-input
              v-model.number="inputPri"
              :placeholder="'' + inputPriPH"
            ></el-input>
          </div>
          <div class="input">
            <div class="tip">memory(MB)</div>
            <el-input
              v-model.number="inputMem"
              :placeholder="'' + inputMemPH"
            ></el-input>
          </div>
          <el-button type="primary" @click="Create" plain>Create</el-button>
        </div>
        <el-button type="warning button" @click="Timeout" plain
          >Timeout</el-button
        >
        <el-button type="danger button" @click="Wait" plain>Wait</el-button>
        <el-button type="success button" @click="Occurs" plain
          >Occurs</el-button
        >
        <el-button type="info button" @click="Release" plain>Release</el-button>
        <el-button type="info button" @click="Reset">Reset</el-button>
      </div>
      <el-scrollbar class="logs">
        <os-log
          v-for="item in logs"
          :key="item.id"
          :id="item.id"
          :prog="item.prog"
          :operate="item.operate"
          :from="item.from"
          :to="item.to"
          :mem-from="item.memFrom"
          :mem-to="item.memTo"
          :mem-max="item.memMax"
          style="height: 100%; flex: 1"
        ></os-log>
      </el-scrollbar>
    </div>
  </div>
</template>

<script lang="ts" setup>
import OsQueue from "@/components/OsQueue.vue";
import OsLog from "@/components/OsLog.vue";
import { Process } from "@/scripts/models";
import { computed, getCurrentInstance, ref, watch } from "vue";
const progsNew = ref(Array<Process>());
const progsReady = ref(Array<Process>());
const progsRunning = ref(Array<Process>());
const progsBlock = ref(Array<Process>());
const progsExit = ref(Array<Process>());
const counter = ref(1);
const inputPri = ref();
const inputMem = ref();
const inputPriPH = ref(1);
const inputMemPH = ref(1);
const maxMemory = ref(100);
const globalProperties =
  getCurrentInstance()?.appContext.config.globalProperties;
let pri = globalProperties?.pri;
const getCreatePH = () => {
  inputPriPH.value = Math.ceil(Math.random() * 10);
  inputMemPH.value = Math.ceil(Math.random() * 50);
};
let logID = 1;
class Log {
  id: number;
  prog: Process;
  operate: string;
  from?: string;
  to?: string;
  memFrom?: number;
  memTo?: number;
  memMax?: number;
  constructor(
    p: Process,
    op: string,
    f?: string,
    t?: string,
    mf?: number,
    mt?: number,
    mm?: number
  ) {
    this.id = logID++;
    this.prog = p;
    this.operate = op;
    this.from = f;
    this.to = t;
    this.memFrom = mf;
    this.memTo = mt;
    this.memMax = mm;
  }
}
const logs = ref(Array<Log>());
getCreatePH();
const Create = () => {
  let pri: number;
  let mem: number;
  if (inputPri.value == undefined) {
    pri = inputPriPH.value;
  } else {
    pri = inputPri.value;
  }
  if (inputMem.value == undefined) {
    mem = inputMemPH.value;
  } else {
    mem = inputMem.value;
  }
  const toDoubleInt = (num: number) => {
    return num < 10 ? "0" + num : "" + num;
  };
  let prog = new Process("P" + toDoubleInt(counter.value++), pri, mem);
  progsNew.value.push(prog);
  logs.value.unshift(new Log(prog, "Create"));
  inputPri.value = undefined;
  inputMem.value = undefined;
  getCreatePH();
};
const currentMemory = computed(() => {
  let count = 0;
  for (let prog of progsReady.value) {
    count += prog.mem;
  }
  for (let prog of progsRunning.value) {
    count += prog.mem;
  }
  for (let prog of progsBlock.value) {
    count += prog.mem;
  }
  return count;
});
const Admit = () => {
  if (
    progsNew.value.length > 0 &&
    currentMemory.value + progsNew.value[0].mem <= maxMemory.value
  ) {
    let prog = progsNew.value[0];
    let memPre = currentMemory.value;
    progsReady.value.push(prog);
    progsNew.value.splice(0, 1);
    let memNow = currentMemory.value;
    logs.value.unshift(
      new Log(prog, "Admit", "new", "ready", memPre, memNow, maxMemory.value)
    );
  }
};
const Dispatch = () => {
  if (progsReady.value.length > 0 && progsRunning.value.length == 0) {
    let prog = progsReady.value[0];
    let memPre = currentMemory.value;
    progsRunning.value.push(prog);
    progsReady.value.splice(0, 1);
    let memNow = currentMemory.value;
    logs.value.unshift(
      new Log(
        prog,
        "Dispatch",
        "ready",
        "running",
        memPre,
        memNow,
        maxMemory.value
      )
    );
  }
};
const Timeout = () => {
  if (progsRunning.value.length > 0) {
    let prog = progsRunning.value[0];
    progsReady.value.push(progsRunning.value[0]);
    progsRunning.value.splice(0, 1);
    logs.value.unshift(new Log(prog, "Timeout", "running", "ready"));
  }
};
const Wait = () => {
  if (progsRunning.value.length > 0) {
    let prog = progsRunning.value[0];
    progsBlock.value.push(progsRunning.value[0]);
    progsRunning.value.splice(0, 1);
    logs.value.unshift(new Log(prog, "Wait", "running", "block"));
  }
};
const Occurs = () => {
  if (progsBlock.value.length > 0) {
    let prog = progsBlock.value[0];
    progsReady.value.push(progsBlock.value[0]);
    progsBlock.value.splice(0, 1);
    logs.value.unshift(new Log(prog, "Occurs", "block", "ready"));
  }
};
const Release = () => {
  if (progsRunning.value.length > 0) {
    let prog = progsRunning.value[0];
    let memPre = currentMemory.value;
    progsExit.value.push(progsRunning.value[0]);
    progsRunning.value.splice(0, 1);
    let memNow = currentMemory.value;
    logs.value.unshift(
      new Log(
        prog,
        "Release",
        "block",
        "ready",
        memPre,
        memNow,
        maxMemory.value
      )
    );
  }
};
const Reset = () => {
  progsNew.value.splice(0, progsNew.value.length);
  progsReady.value.splice(0, progsReady.value.length);
  progsRunning.value.splice(0, progsRunning.value.length);
  progsBlock.value.splice(0, progsBlock.value.length);
  progsExit.value.splice(0, progsExit.value.length);
  counter.value = 1;
};
watch(
  [progsNew, progsReady, progsRunning, progsBlock],
  () => {
    Admit();
  },
  {
    deep: true,
  }
);
watch(
  [progsReady, progsRunning],
  () => {
    Dispatch();
  },
  {
    deep: true,
  }
);
</script>

<style lang="stylus" scoped>
.status, .operate
  max-width 1030px
  width 100%
  margin auto
.os-queue
  border 1px solid black
  width 100%
.logs
  margin-top 30px
  height calc(100vh - 630px)
  min-height 300px
  box-sizing border-box
  padding 10px
  border-radius 8px
  border 2px solid #99A
  text-align left
  display flex
  flex-direction column-reverse
  justify-content flex-end
  overflow-y auto
.outline
  box-sizing border-box
  padding 10px 150px 10px 10px
  border 2px solid #99A
  &.t1
    border-width 0
  &.t2
    padding 10px
    border-bottom 0
    border-radius 8px 8px 0 0
    display flex
    & .mem
      & .text
        width 120px
        text-align right
        font-weight bold
  &.t3
    border-top 0
    border-bottom 0
  &.t4
    border-top 0
    border-radius 0 0 8px 8px
  &.t5
    border-width 0
.operate
  margin-top 30px
  display flex
  justify-content center
  flex-wrap wrap
  & .create
    padding 10px
    border 1px solid black
    border-radius 6px
    border-color #a0cfff
    background-color #ecf5ff
    color #409eff
    display flex
    align-items center
    & .input
      display flex
      flex-direction column
      align-items center
      margin-left 10px
      & .tip
        font-size 12px
    & .el-input
      width 50px
    /deep/& .el-input__inner
      border 1px solid black
      border-radius 6px
      border-color #a0cfff
      background-color #ecf5ff
      color #409eff
      width 50px
      text-align center
      &:focus::placeholder
        opacity 0
    & .id
      font-weight bold
      font-size 20px
    & .el-button
      margin-left 20px
      height 46px
      font-size 20px
  & .button
    height 68px
    font-size 20px
    border-radius 6px
    margin-left 20px
</style>
