<template>
  <div>
    <el-card>
      <CategorySelector
        :isShowList="isShowList"
        @changeCategory="changeCategory"
      ></CategorySelector>
    </el-card>
    <el-card style="margin-top: 20px">
      <div v-show="!isShowSpuForm && !isShowSkuForm">
        <el-button type="primary" icon="el-icon-plus" @click="showAddSpuForm"
          >添加SPU</el-button
        >
        <el-table border :data="spuList" style="width: 100%">
          <el-table-column
            type="index"
            align="center"
            prop="prop"
            label="序号"
            width="80"
          >
          </el-table-column>
          <el-table-column prop="description" label="SPU名称" width="width">
          </el-table-column>
          <el-table-column prop="spuName" label="SPU描述" width="width">
          </el-table-column>
          <el-table-column prop="prop" label="操作" width="width">
            <template slot-scope="{ row, $index }">
              <HintButton
                type="success"
                icon="el-icon-plus"
                size="mini"
                title="添加SKU"
                @click="showAddSkuForm(row)"
              ></HintButton>
              <HintButton
                type="primary"
                icon="el-icon-edit"
                size="mini"
                title="修改SPU"
                @click="showUpdateSpuForm(row)"
              ></HintButton>
              <HintButton
                type="info"
                icon="el-icon-info"
                size="mini"
                title="查看SKU列表"
              ></HintButton>
              <HintButton
                type="danger"
                icon="el-icon-delete"
                size="mini"
                title="删除SPU"
              ></HintButton>
            </template>
          </el-table-column>
        </el-table>

        <el-pagination
          @size-change="handleSizeChange"
          @current-change="getSpuList"
          style="text-align: center"
          :current-page="page"
          :page-sizes="[2, 3, 5]"
          :page-size="limit"
          layout="prev, pager, next, jumper,->,sizes,total"
          :total="total"
        >
        </el-pagination>
      </div>
      <!-- 修改spu页面的组件 -->
      <SpuForm v-show="isShowSpuForm" ref="spu"></SpuForm>
      <!-- 添加sku页面的组件 -->
      <SkuForm v-show="isShowSkuForm"></SkuForm>
    </el-card>
  </div>
</template>

<script>
import SkuForm from "../components/SkuForm";
import SpuForm from "../components/SpuForm";
export default {
  name: "spu",
  components: {
    SkuForm,
    SpuForm,
  },
  data() {
    return {
      category1Id: "",
      category2Id: "",
      category3Id: "",
      page: 1,
      limit: 3,
      spuList: [],
      total: 0,

      isShowList: true,
      isShowSpuForm: false,
      isShowSkuForm: false,
    };
  },
  methods: {
    changeCategory({ categoryId, level }) {
      if (level === 1) {
        this.category1Id = categoryId;
        this.category2Id = "";
        this.category3Id = "";
        this.spuList = [];
      } else if (level === 2) {
        this.category2Id = categoryId;
        this.category3Id = "";
        this.spuList = [];
      } else {
        this.category3Id = categoryId;
        this.getSpuList();
      }
    },

    // 请求获取spu的分页列表
    async getSpuList(pager = 1) {
      this.page = pager;
      let { page, limit, category3Id } = this;
      const result = await this.$API.spu.getList(page, limit, category3Id);
      if (result.code === 200) {
        this.spuList = result.data.records;
        this.total = result.data.total;
      }
    },
    handleSizeChange(size) {
      this.limit = size;
      this.getSpuList();
    },
    // 点击添加spu按钮
    showAddSpuForm() {
      this.isShowSpuForm = true;
      this.$refs.spu.initAddSpuFormData()
    },
    // 点击修改spu按钮
    showUpdateSpuForm(row) {
      this.isShowSpuForm = true;
      // 拿到子组件对象,可以使用组件当中的数据也可以调用子组件的方法
      this.$refs.spu.initUpdateSpuFormData(row)
    },
    // 点击添加Sku按钮
    showAddSkuForm(row){
      this.isShowSkuForm = true
    }
  },
};
</script>

<style lang="scss" scoped>
</style>
