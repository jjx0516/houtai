<template>
  <div>
    <el-form :model="SpuForm" label-width="100px">
      <el-form-item label="SPU名称">
        <el-input v-model="SpuForm.spuName" placeholder="SPU名称"></el-input>
      </el-form-item>
      <el-form-item label="品牌">
        <el-select v-model="SpuForm.tmId" placeholder="请选择品牌">
          <el-option label="label" value="vlaue"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="SPU描述">
        <el-input
          v-model="SpuForm.description"
          label="SPU描述"
          type="textarea"
          rows="4"
        ></el-input>
      </el-form-item>

      <el-form-item label="SPU图片">
        <el-upload
          action="https://jsonplaceholder.typicode.com/posts/"
          list-type="picture-card"
          :on-preview="handlePictureCardPreview"
          :on-remove="handleRemove"
        >
          <i class="el-icon-plus"></i>
        </el-upload>
        <el-dialog :visible.sync="dialogVisible">
          <img width="100%" :src="dialogImageUrl" alt="" />
        </el-dialog>
      </el-form-item>
      <el-form-item label="销售属性">
        <el-select v-model="spuSaleAttrId" placeholder="还有4未选择">
          <el-option label="label" value="value"></el-option>
        </el-select>
        <el-button type="primary" icon="el-icon-puls">添加销售属性</el-button>
        <el-table
          border
          :data="data"
          style="width: 100%; margin:20px 0;">
          <el-table-column
            align="center"
            prop="prop"
            type="index"
            label="序号"
            width="80">
          </el-table-column>
          <el-table-column
            prop="prop"
            label="属性名"
            width="150">
          </el-table-column>
          <el-table-column
            prop="prop"
            label="属性值名称列表"
            width="width">
          </el-table-column>
          <el-table-column
            prop="prop"
            label="操作"
            width="100">
          </el-table-column>
        </el-table>
        <el-button type="primary">保存</el-button>
        <el-button >取消</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
export default {
  name: "SpuForm",
  data() {
    return {
      dialogImageUrl: "",
      dialogVisible: false,
      spuSaleAttrId:"",  // 不一定要
      SpuForm: {
        category3Id: 0,
        description: "",
        id: 0,
        tmId: "",
        spuName: "",
        spuImageList: [
          {
            id: 0,
            imgName: "string",
            imgUrl: "string",
            spuId: 0,
          },
        ],

        spuSaleAttrList: [
          {
            baseSaleAttrId: 0,
            id: 0,
            saleAttrName: "string",
            spuId: 0,
            spuSaleAttrValueList: [
              {
                baseSaleAttrId: 0,
                id: 0,
                isChecked: "string",
                saleAttrName: "string",
                saleAttrValueName: "string",
                spuId: 0,
              },
            ],
          },
        ],
      },
    };
  },
  methods: {
    // 上传图片相关
    handleRemove(file, fileList) {
      console.log(file, fileList);
    },
    handlePictureCardPreview(file) {
      this.dialogImageUrl = file.url;
      this.dialogVisible = true;
    },
    // 请求获取初始化数据
    initUpdateSpuFormData(spu){
      // 函数当中在发4个请求
      this.$API.sku.getSpuImageList(spuId)
    },

    initAddSpuFormData(){
      
    }
  },
};
</script>

<style lang="less" scoped>
</style>
