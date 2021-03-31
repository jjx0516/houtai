<template>
  <div>
    <el-form :inline="true" :model="CForm" class="demo-form-inline" :disabled="!isShowList">
      <el-form-item label="一级分类">
        <el-select
          v-model="CForm.category1Id"
          placeholder="请选择"
          @change="changeCategory1"
        >
          <el-option
            :label="c1.name"
            :value="c1.id"
            v-for="(c1, index) in category1List"
            :key="c1.id"
          ></el-option>
        </el-select>
      </el-form-item>

      <el-form-item label="二级分类">
        <el-select
          v-model="CForm.category2Id"
          placeholder="请选择"
          @change="changeCategory2"
        >
          <el-option
            :label="c2.name"
            :value="c2.id"
            v-for="(c2, index) in category2List"
            :key="c2.id"
          ></el-option>
        </el-select>
      </el-form-item>

      <el-form-item label="三级分类">
        <el-select
          v-model="CForm.category3Id"
          placeholder="请选择"
          @change="changeCategory3"
        >
          <el-option
            :label="c3.name"
            :value="c3.id"
            v-for="(c3, index) in category3List"
            :key="c3.id"
          ></el-option>
        </el-select>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
export default {
  name: "",
  props:["isShowList"],
  data() {
    return {
      CForm: {
        category1Id: "",
        category2Id: "",
        category3Id: "",
      },
      category1List: [],
      category2List: [],
      category3List: [],
    };
  },
  mounted() {
    this.getCategory1List();
    // this.getCategory1List()
    // this.getCategory1List()
  },
  methods: {
    // 获取一级分类列表
    async getCategory1List() {
      const result = await this.$API.category.getCategory1();
      if (result.code === 200) {
        this.category1List = result.data;
      }
    },
    // 根据选中的一级分类id获取这个一级分类的所有二级分类
    async changeCategory1(category1Id) {
      this.$emit('changeCategory',{categoryId:category1Id,level:1})
      this.CForm.category2Id=""
      this.CForm.category3Id=""
      this.category2List = []
      this.category3List = []
      const result = await this.$API.category.getCategory2(category1Id);
      if (result.code === 200) {
        this.category2List = result.data;
      }
    },
    // 根据选中的二级分类id获取这个二级分类的所有三级分类
    async changeCategory2(category2Id) {
      this.$emit("changeCategory",{categoryId:category2Id,level:2})
      this.CForm.category3Id = ''
      this.category3List=""
      const result = await this.$API.category.getCategory3(category2Id);
      if (result.code === 200) {
        this.category3List = result.data;
      }
    },
    // 选中三级分类
    // 三级分类被选中,下面有数据了,要发请求获取属性数据进行展示
    // 但是,这个请求不是在当前组件发的,而是在父组件发的
    // 组件通信
    changeCategory3(category3Id){
      // 组件通信,把id给传递到父组件 ========== 子向父==自定义事件\\
      this.$emit("changeCategory",{categoryId:category3Id,level:3})

    }
  },
};
</script>

<style lang="less" scoped>
</style>