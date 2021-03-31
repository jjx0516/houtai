<template>
  <div>
    <el-button type="primary" icon="el-icon-plus" @click="showAddDialog"
      >添加</el-button
    >
    <el-table :data="trademarkList" border style="width: 100%; margin: 20px 0">
      <el-table-column type="index" label="序号" width="80" align="center">
      </el-table-column>
      <el-table-column prop="tmName" label="品牌名称" width="width">
      </el-table-column>
      <el-table-column prop="logoUrl" label="品牌logo" width="width">
        <!-- 作用域插槽:只要有结构改变,就得用 -->
        <template slot-scope="{ row, $index }">
          <!-- row,$index对应的就是当前遍历的某个品牌对象,及这个品牌在数组当中的下标 -->
          <img :src="row.logoUrl" alt="" style="width: 100px; height: 80px" />
        </template>
      </el-table-column>
      <el-table-column prop="prop" label="操作" width="width">
        <template slot-scope="{ row, $index }">
          <el-button
            type="warning"
            icon="el-icon-edit"
            size="mini"
            @click="showUpdateDialog(row)"
            >修改</el-button
          >
          <el-button
            type="danger"
            icon="el-icon-delete"
            size="mini"
            @click="deleteTrademark(row)"
            >删除</el-button
          >
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      style="text-align: center"
      @size-change="handleSizeChange"
      @current-change="getTrademarkList"
      :current-page="page"
      :page-sizes="[3, 5, 7]"
      :page-size="limit"
      layout=" prev, pager, next, jumper,->,sizes,total"
      :total="total"
    >
    </el-pagination>
    <!-- 添加和修改的对话框 -->
    <el-dialog
      :title="tmForm.id ? '修改品牌' : '添加品牌'"
      :visible.sync="dialogFormVisible"
    >
      <!-- 对于form来说,是专门用来收集数据的,收集的数据是最后要发请求携带的参数
      都会有一个属性:model="tmform" -->
      <el-form :rules="rules" ref="tmForm" :model="tmForm" style="width: 80%">
        <el-form-item prop="tmName" label="品牌名称" label-width="100px">
          <el-input v-model="tmForm.tmName" autocomplete="off"></el-input>
        </el-form-item>

        <el-form-item prop="logoUrl" label="品牌LOGO" label-width="100px">
          <!-- upload中的action就是上传真实的接口  /dev-api ****
          show-file-list 上传照片墙-->
          <el-upload
            class="avatar-uploader"
            action="/dev-api/admin/product/fileUpload"
            :show-file-list="false"
            :on-success="handleAvatarSuccess"
            :before-upload="beforeAvatarUpload"
          >
            <img v-if="tmForm.logoUrl" :src="tmForm.logoUrl" class="avatar" />
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
            <div class="el-upload__tip" slot="tip">
              只能上传jpg/png文件，且不超过500kb
            </div>
          </el-upload>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="addOrUpdate">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: "trademark",
  data() {
    let validateTmName = (rule, value, callback) => {
      // value就是你要校验的数据
      // callback 代表校验成功还是失败的回调
      if (value.length < 3 || value.length >10) {
        callback(new Error("长度必须是2~10之间"));
      } else {
        callback()
      }
    };
    return {
      page: 1,
      limit: 3,
      trademarkList: [],
      total: 0,
      dialogFormVisible: false, // 控制对话框,显示和隐藏
      tmForm: {
        tmName: "",
        logoUrl: "",
      },
      rules: {
        // 这个对象代表是表单验证的规则对象
        // 每个字段都是一个数组,数组里面放得是我们验证的规则对象,
        // 每个规则都可以规定规则名称,消息名称,和触发时机
        // 触发时机有三种情况:失去焦点的时候,输入框改变的时候,整体校验的时候,
        tmName: [
          { required: true, message: "请输入品牌名称", trigger: "blur" },
          // {
          //   min: 3,
          //   max: 10,
          //   message: "长度在 3 到 10 个字符",
          //   trigger: "change",
          // },
          // 自定义校验规则
          { validator: validateTmName, trigger: "change" },
        ],
        logoUrl: [
          // 这个上传也什么都可以,
          { required: true, message: "请选择上传图片", trigger: "change" },
        ],
      },
    };
  },
  mounted() {
    this.getTrademarkList();
  },
  methods: {
    // 发请求获取品牌列表,以及分页器翻页的回调
    async getTrademarkList(page = 1) {
      try {
        this.page = page;
        const result = await this.$API.trademark.getPageList(
          this.page,
          this.limit
        );
        this.trademarkList = result.data.records;
        this.total = result.data.total;
      } catch (error) {
        alert(error.message);
      }
    },
    // 修改每一页数量的回调函数
    handleSizeChange(size) {
      this.limit = size;
      this.getTrademarkList();
    },

    // 上传相关的回调
    // 上传成功的回调  重点*****
    handleAvatarSuccess(res, file) {
      //console.log(res,file);  //通过打印知道图片地址在res.data或file.response.data中
      // 上传成功后返回真实的图片路径
      // this.imageUrl = URL.createObjectURL(file.raw);
      this.tmForm.logoUrl = file.response.data;
    },
    // 上传前的回调,可以限定图片大小和格式
    beforeAvatarUpload(file) {
      // file就是准备上传的文件
      const typeArr = ["image/jpeg", "image/png", "image/gif"];
      // const isJPG = file.type === "image/jpeg";
      const isJPGOrPNGOrGIF = typeArr.indexOf(file.type) !== -1; //不等于-1为true
      const isLt2M = file.size / 1024 / 1024 < 2;

      if (!isJPGOrPNGOrGIF) {
        this.$message.error("上传头像图片可以使 JPG、PNG、GIF 格式!");
      }
      if (!isLt2M) {
        this.$message.error("上传头像图片大小不能超过 2MB!");
      }
      return isJPGOrPNGOrGIF && isLt2M;
    },

    // 点击添加按钮,弹出对话框
    showAddDialog() {
      this.dialogFormVisible = true;
      this.tmForm = {
        // 点击添加后,需要清空数据一遍,
        tmName: "",
        logoUrl: "",
      };
    },
    // 点击修改弹出对话框
    showUpdateDialog(row) {
      this.dialogFormVisible = true;
      // 不能这么写,如果这么写,那么table展示的数据和tmform要修改的数据就是用一个对象
      // 一旦修改tmform数据,列表中数据也会被修改
      //this.tmForm = row  //把展示的这个数据赋值给tmForm,而且数据中有id

      // 拷贝 *****
      // 拷贝必然出现新的地址开辟新的空间,也就是说有不同的数据存储位置
      // 深拷贝和浅拷贝:如果拷贝的是地址,那就是浅拷贝, 如果拷贝的是对象里的值,那就是深拷贝
      // row里面都是基本数据, 使用浅拷贝即可,
      this.tmForm = {
        ...row,
      };
    },
    // 点击确定发请求去添加或修改商品
    addOrUpdate() {
      // 先对表单做整体校验 ============
      this.$refs.tmForm.validate(async (valid) => {
        if (valid) {
          // 如果成功
          // 第一步:获取收集到的参数数据
          let trademark = this.tmForm;
          // 第二步:整理收集的参数数据  这里不需要整理
          // 第三步:发请求
          try {
            // 第四步:成功干啥
            const result = await this.$API.trademark.addOrUpdate(trademark);
            // 1.提示
            this.$message.success(
              trademark.id ? "修改品牌成功" : "添加品牌成功"
            );
            // 2.返回到列表页
            this.dialogFormVisible = false;
            // 3.重新获取列表数据
            // 添加和修改 返回到页面之后,重新获取那个页的数据是不一样的
            this.getTrademarkList(trademark.id ? this.page : 1);
          } catch (error) {
            // 第五步:失败干啥:提示
            this.$message.success(
              trademark.id ? "修改品牌失败" : "添加品牌失败"
            );
          }
        } else {
          console.log("校验失败");
          return false;
        }
      });
    },
    // 点击删除,删除列表中商品
    deleteTrademark(row) {
      this.$confirm(`你确定要删除${row.tmName}`, "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(async () => {
          // 处理点击确定按钮的逻辑
          // 发请求
          try {
            await this.$API.trademark.delete(row.id);
            // 成功干啥
            this.$message({
              type: "success",
              message: "删除成功!",
            });
            // 重新获取列表数据  重新获取那一页的数据  ,
            // 我们需要看前面有几条数据,如果只有一条,需要回到前一页,如果不是,就回到当页
            this.getTrademarkList(
              this.trademarkList.length > 1 ? this.page : this.page - 1
            );
          } catch (error) {
            // 失败干啥
            this.$message.error("删除品牌失败");
          }
        })
        .catch(() => {
          // 处理点击取消按钮的逻辑
          this.$message({
            type: "info",
            message: "已取消删除",
          });
        });
    },
  },
};
</script>

<style>
.avatar-uploader .el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}
.avatar-uploader .el-upload:hover {
  border-color: #409eff;
}
.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 178px;
  height: 178px;
  line-height: 178px;
  text-align: center;
}
.avatar {
  width: 178px;
  height: 178px;
  display: block;
}
</style>
