<template>
  <!-- <a href="javascript:;" :title="title" style="margin-right: 10px">
    <el-button :content="title" v-bind="$attrs" v-on="$listeners"></el-button>
  </a> -->
  <el-tooltip  :content="title" placement="top-start">
    <el-button  v-bind="$attrs" v-on="$listeners"></el-button>
  </el-tooltip>
</template>
<script>
// 封装属性管理button
export default {
  name: "HintButton",
  props: ["title"],
};
</script>
