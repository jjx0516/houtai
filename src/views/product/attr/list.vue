<template>
  <div>
    <!-- 三级联动 -->
    <el-card>
      <CategorySelector @changeCategory="changeCategory" :isShowList="isShowList"></CategorySelector>
    </el-card>
    <el-card style="margin-top: 20px">
      <!-- 列表页的页面 -->
      <div v-show="isShowList">
        <el-button
          type="primary"
          icon="el-icon-plus"
          @click="showAddDiv"
          :disabled="!category3Id"
          >添加属性</el-button
        >
        <el-table border :data="attrList" style="width: 100%">
          <el-table-column
            prop="prop"
            label="序号"
            width="80"
            type="index"
            align="center"
          >
          </el-table-column>
          <el-table-column
            prop="attrName"
            label="属性名称"
            width="150"
            align="center"
          >
          </el-table-column>
          <el-table-column prop="prop" label="属性值列表" width="width">
            <!-- 遍历的是每个属性当中的属性值列表 -->
            <template slot-scope="{ row, $index }">
              <el-tag
                type="success"
                v-for="(attrValue, index) in row.attrValueList"
                :key="attrValue.id"
                >{{ attrValue.valueName }}</el-tag
              >
            </template>
          </el-table-column>
          <el-table-column prop="prop" label="操作" width="150">
            <template slot-scope="{ row, $index }">
              <HintButton
                type="warning"
                icon="el-icon-edit"
                size="mini"
                title="修改"
                @click="showUpdateDiv(row)"
              ></HintButton>
              <el-popconfirm :title="`你确定删除${row.attrName}`" @onConfirm ="deleteAttr(row)">
                <HintButton
                  slot="reference"
                  type="danger"
                  icon="el-icon-delete"
                  size="mini"
                  title="删除"
                ></HintButton>
              </el-popconfirm>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <!-- 添加和修改的页面-->
      <div v-show="!isShowList">
        <el-form :model="attrForm" :inline="true">
          <el-form-item label="属性名">
            <el-input
              v-model="attrForm.attrName"
              placeholder="请输入属性名"
            ></el-input>
          </el-form-item>
        </el-form>

        <el-button
          type="primary"
          icon="el-icon-plus"
          :disabled="!attrForm.attrName"
          @click="addAtteValue"
          >添加属性值</el-button
        >
        <el-button @click="isShowList = true">取消</el-button>

        <el-table
          :data="attrForm.attrValueList"
          style="width: 100%; margin: 20px 0"
          border
        >
          <el-table-column type="index" align="center" label="序号" width="80">
          </el-table-column>
          <el-table-column prop="prop" label="属性值名称" width="width">
            <template slot-scope="{ row, $index }">
              <el-input
                :ref="$index"
                v-if="row.isEdit"
                v-model="row.valueName"
                placeholder="请输入属性值名称"
                @blur="toLook(row)"
                @keyup.enter.native="toLook(row)"
                size="mini"
              ></el-input>
              <span
                v-else
                @click="toEdit(row, $index)"
                style="display: block; width: 100%; height: 100%"
                >{{ row.valueName }}</span
              >
            </template>
          </el-table-column>
          <el-table-column prop="prop" label="操作" width="width">
            <template slot-scope="{ row, $index }">
              <el-popconfirm
                :title="`确定要删除${row.valueName}吗`"
                @onConfirm="attrForm.attrValueList.splice($index, 1)"
              >
                <HintButton
                  slot="reference"
                  type="danger"
                  icon="el-icon-delete"
                  size="mini"
                  title="删除"
                ></HintButton>
              </el-popconfirm>
            </template>
          </el-table-column>
        </el-table>
        <el-button type="primary" @click="save" :disabled="attrForm.attrValueList.length === 0">保存</el-button>
        <el-button @click="isShowList = true">取消</el-button>
      </div>
    </el-card>
  </div>
</template>

<script>
import cloneDeep from "lodash/cloneDeep";
export default {
  name: "",
  data() {
    return {
      // 保存子组件传递过来的id,之后需要发请求
      category1Id: "",
      category2Id: "",
      category3Id: "",
      attrList: [],
      attrForm: {
        //         {   需要收集的数据
        attrName: "",
        attrValueList: [
          //     {
          //       "attrId": 0,
          //       "id": 0,
          //       "valueName": "string"
          //     }
        ],
        categoryId: 0,
        categoryLevel: 3,
      },

      isShowList: true,
    };
  },
  methods: {
    changeCategory({ categoryId, level }) {
      if (level === 1) {
        // 保存id
        this.category1Id = categoryId;
        // 一级被选中,子组件传递过来一级id,并且还要让父组件把数据清空
        this.category2Id = "";
        this.category3Id = "";
        this.attrList = [];
      } else if (level === 2) {
        this.category2Id = categoryId;
        // 二级被选中,子组件传递过来二级id,并且还要让父组件把数据清空
        this.category3Id = "";
        this.attrList = [];
      } else {
        this.category3Id = categoryId;
        // 发请求获取属性列表数据
        this.getAttrList();
      }
    },
    async getAttrList() {
      let { category1Id, category2Id, category3Id } = this;
      const result = await this.$API.attr.getList(
        category1Id,
        category2Id,
        category3Id
      );
      if (result.code === 200) {
        this.attrList = result.data;
      }
    },
    // 点击添加按钮切换到添加的页面
    showAddDiv() {
      this.isShowList = false;
      // 清空收集的对象
      // 完成收集的对象剩余的收集操作
      this.attrForm = {
        attrName: "",
        attrValueList: [
          //     {
          //       "attrId": 0,
          //       "id": 0,
          //       "valueName": "string"
          //     }
        ],
        categoryId: this.category3Id,
        categoryLevel: 3,
      };
    },
    // 点击添加属性值按钮
    addAtteValue() {
      // 我们可以给属性值列表添加一个空的对象,保证表格当中首先出现第一行
      this.attrForm.attrValueList.push({
        attrId: this.attrForm.id, // 属性值所属属性的id,如果是添加就没有id,如果是修改就有id
        valueName: "", // 现在只是添加了一个空的对象,属性都还没有
        isEdit: true, // 添加属性值的时候,我们属性值对象标识数据为 编辑模式
      });
      // 自动获取焦点,新添加属性值
      this.$nextTick(() => {
        // 等待页面最近更新完成之后再去获取input焦点
        this.$refs[this.attrForm.attrValueList.length - 1].focus(); //index是变量,所以使用[],拿到input
      });
    },
    // 点击修改按钮切换到修改界面
    showUpdateDiv(row) {
      this.isShowList = false;
      // 使用深拷贝
      this.attrForm = cloneDeep(row);
      // 修改属性的时候,也是每个属性值都要有自己的模式标识数据
      this.attrForm.attrValueList.forEach((item) => {
        // item.isEdit=false  // 这种写法不可,因为这是在后期给响应式对象添加新的属性
        // 只有在数据初始化阶段(beforeCreate和created之间初始化的对象,对象中的属性才是响应式的)
        // 此时点击按钮给响应式对象添加新的属性数据,不是响应式的数据,这样会导致后期添加以后页面没有变化
        // 如果后期添加的属性要响应式,必须使用Vue.set, 或者是vm.$set才能成为响应式
        this.$set(item, "isEdit", false);
      });
    },
    // input失去焦点或input回车切换为span
    toLook(row) {
      // 在input变为span之前，需要校验用户输入的数据合法性
      // 1.用户输入的数据不能为空
      let valueName = row.valueName;
      if (valueName.trim() === "") {
        this.$message.info("输入的属性值名称不能为空");
        row.valueName = "";
        return;
      }
      // 2.用户输入的数据不能喝已有数据名称重复
      // 判断输入的数据和其他的属性值名称数据是不是重复,得除去自身
      let isRepeat = this.attrForm.attrValueList.some((item) => {
        if (item !== row) {
          return item.valueName === valueName; //这个为真,所以isRepeat为真
        }
      });
      if (isRepeat) {
        this.$message.info("输入的属性值名称不能重复");
        row.valueName = "";
        return;
      }
      // 直接变为span,有问题
      row.isEdit = false;
    },

    // 点击span切换为input框
    toEdit(row, index) {
      row.isEdit = true;
      // 自动获取焦点
      // 为何this.$refs[index]是undefined,因为我们获取这个节点太快了,

      // $nextTick  代表页面的最近一次更新完成之后执行回调
      this.$nextTick(() => {
        // 等待页面最近更新完成之后再去获取input焦点
        this.$refs[index].focus(); //index是变量,所以使用[],拿到input
      });

      // this.$nexttick 和 updated区别
      // this.$nextTick 页面的最近一次更新完成之后执行回调,一次就完了
      // updated 只要页面有数据变化,就会执行
    },
    // 点击保存按钮
    async save() {
      // 获取收集的参数
      let attr = this.attrForm;
      // 整理参数(因为我们收集的参数不一定和请求需要的一样)
      // 1. 如果属性当中的属性值有空串,我们要去除
      // 2. 请求的时候要把不需要的属性值对象当中的参数数据去除,比如:isEdit
      attr.attrValueList = attr.attrValueList.filter((item) => {
        if (item.valueName !== "") {
          delete item.isEdit; // 过滤的时候,如果属性值对象不为空,去除isEdit
          return true;
        }
      });
      // 3. 当属性当中属性值的列表为空时,不发请求
      if (attr.attrValueList.length === 0) {
        this.$message.info("属性必须有属性值");
        return;
      }
      // 发请求
      try {
        // 成功
        await this.$API.attr.addOrUpdate(attr);
        // 1.提示
        this.$message.success("添加或修改属性成功");
        // 2. 返回发哦列表页
        this.isShowList = true;
        // 3. 重新获取商品数据
        this.getAttrList();
      } catch (error) {
        // 失败
        this.$message.error("修改或添加属性失败");
      }
    },
    // 点击删除按钮
    async deleteAttr(row){
      try {
        await this.$API.attr.delete(row.id)
        this.$message.success('删除成功')
        this.getAttrList()
        
      } catch (error) {
        this.$message.error('删除失败')
      }
    }
  },
};
</script>

<style lang="scss" scoped>
</style>
