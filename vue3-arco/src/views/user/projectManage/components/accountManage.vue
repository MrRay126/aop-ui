<template>
  <div class="account-container">
    <div class="channel-list">
      <el-button-group>
        <template v-for="(item, index) in channelList">
          <el-button
            size="small"
            :autofocus="index === 0"
            :key="index"
            :type="item.type"
            @click="handleChannelChange(item)"
            :disabled="isloadingAccountTable || item.disabled"
            >{{ item.title }}</el-button
          >
        </template>
      </el-button-group>
      <el-button type="primary" size="mini" @click="handleAddNewAccount"
        >+ 新增</el-button
      >
    </div>
    <div class="table-container" ref="tbContainer">
      <!--账号管理 table -->
      <dynamic-table
        sortMode="single"
        :loading="isloadingAccountTable"
        :height="height"
        :dimension="accountDimensions"
        :source="accountSource"
        :filter="accountFilter"
        :pager="accountPager"
        :contentHandler="preDealAccountTableContent"
        @getTableData="handleGetAccountTableData"
      >
        <!-- 展开行内容 -->
        <template v-slot:expand="{ row }">
          <template
            v-if="
              Array.isArray(row.detail.dimensions) &&
              Array.isArray(row.detail.source)
            "
          >
            <div class="content-container">
              <dynamic-table
                :maxHeight="300"
                border
                :dimension="row.detail.dimensions"
                :source="row.detail.source"
                :hasPagination="false"
                :scroll-x="{
                  enabled: true,
                  gt: 0,
                }"
                :scroll-y="{
                  enabled: true,
                  gt: 0,
                }"
                show-overflow="tooltip"
                show-header-overflow="tooltip"
              ></dynamic-table>
            </div>
          </template>
          <template v-else>
            <div class="no-data">暂无数据</div>
          </template>
        </template>
      </dynamic-table>
    </div>
    <el-dialog
      title="提示"
      width="560px"
      :visible.sync="isDialogVisible"
      @open="handleOpen"
      @close="handleClose"
    >
      <div class="form-title">
        {{ mode === "new" ? "账号录入" : "账号编辑" }}
      </div>
      <el-form
        ref="form"
        :rules="rules"
        :model="formData"
        label-width="80px"
        size="small"
      >
        <el-form-item label="账号:" prop="name">
          <el-input
            class="input-item"
            v-model="formData.name"
            :disabled="mode === 'edit'"
            placeholder="请输入"
          ></el-input>
        </el-form-item>
        <el-form-item label="账号ID:" prop="accountId">
          <el-input
            class="input-item"
            v-model="formData.accountId"
            :disabled="mode === 'edit'"
            placeholder="请输入"
          ></el-input>
        </el-form-item>
        <el-form-item label="Cookies:" prop="cookie">
          <el-input
            class="input-item"
            v-model="formData.cookie"
            type="textarea"
            rows="5"
            placeholder="请输入"
          ></el-input>
        </el-form-item>
        <el-form-item label="状态:" prop="status" placeholder="请选择">
          <el-select class="input-item" v-model="formData.status">
            <template v-for="(optionItem, index) in statusList">
              <el-option
                :key="index"
                :label="optionItem.label"
                :value="optionItem.value"
              ></el-option>
            </template>
          </el-select>
        </el-form-item>
        <el-form-item label="备注:" prop="comment">
          <el-input
            class="input-item"
            v-model="formData.comment"
            type="textarea"
            rows="5"
            placeholder="请输入"
          ></el-input>
        </el-form-item>
      </el-form>

      <div class="button-container">
        <el-button type="plain" size="small" @click="handleFormCancel"
          >取消</el-button
        >
        <el-button
          type="primary"
          size="small"
          @click="handleFormSubmit"
          :loading="isSubmitting"
          >确定</el-button
        >
      </div>
    </el-dialog>
  </div>
</template>
<script>
import dynamicTable from "@/views/components/dynamicTable";
import { getChannelList, accountDimensions, statusList } from "../data.js";
export default {
  props: {
    height: {
      type: Number,
      default: 500,
    },
  },
  components: { dynamicTable },
  data() {
    return {
      statusList,
      accountDimensions,
      accountSource: [],
      accountFilter: {},
      accountPager: {
        curPage: 1,
        pageSize: 10,
        total: 0,
      },
      accountSearch: "",
      isloadingAccountTable: false,

      channelList: [],
      currentChannel: {},

      mode: "edit", // edit:编辑, new:新增
      isDialogVisible: false,

      formData: {
        id: null,
        name: "",
        accountId: null,
        cookie: "",
        status: "normal",
        comment: "",
      },
      curRow: {},
      rules: {
        name: [{ required: true, message: "必填项!", trigger: "change" }],
        accountId: [{ required: true, message: "必填项!", trigger: "change" }],
        cookie: [{ required: true, message: "必填项!", trigger: "change" }],
      },
      isSubmitting: false,
    };
  },
  methods: {
    async handleFormSubmit() {
      const isPass = await new Promise((resolve) => {
        this.$refs["form"].validate((valid) => {
          resolve(valid);
        });
      });
      if (isPass) {
        this.submitAccountData();
      }
    },

    handleFormCancel() {
      this.isDialogVisible = false;
    },
    handleOpen() {
      // noop
    },

    handleClose() {
      this.formData = this.$options.data().formData;
      this.$nextTick(() => {
        this.$refs["form"].clearValidate();
      });
    },

    handleEdit(row) {
      for (let prop in this.formData) {
        this.formData[prop] = row[prop];
      }
      this.mode = "edit";
      this.isDialogVisible = true;
      this.curRow = row;
    },

    handleDelete(row) {
      this.$confirm("确定要删除吗?", "提示")

        .then(() => {
          this.$set(row, "delete", true);
          const payload = {
            propject_id: this.$store.getters.appId,
            channel: this.currentChannel.value,
            id: row.id,
          };

          this.$store
            .dispatch("projectManage/deleteAccount", payload)
            .then(() => {
              this.$message({
                message: "删除成功!",
                type: "success",
              });

              this.getAccountTableData();
            })
            .finally(() => {
              this.$set(row, "delete", false);
            });
        })
        .catch(() => {
          // noop
        });
    },

    // 新增或编辑账号
    submitAccountData() {
      this.isSubmitting = true;
      const action =
        this.mode === "edit"
          ? "projectManage/editAccount"
          : "projectManage/addNewAccount";

      const payload = {
        ...this.formData,
        channel: this.currentChannel.value,
        project_id: this.$store.getters.appId,
      };

      if (this.mode === "edit") {
        payload.id = this.curRow.id;
      }

      this.$store
        .dispatch(action, payload)
        .then(() => {
          this.$message({
            message: "保存成功!",
            type: "success",
          });
          this.isDialogVisible = false;
          this.getAccountTableData();
        })
        .catch(() => {
          // noop
        })
        .finally(() => {
          // noop
          this.isSubmitting = false;
        });
    },

    handleRequestData(row) {
      this.$set(row, "request", true);
      const payload = {
        propject_id: this.$store.getters.appId,
        channel: this.currentChannel.value,
        id: row.id,
      };
      return this.$store
        .dispatch("projectManage/requestPatchAccount", payload)
        .then(() => {
          this.$message({
            message: "请求成功!",
            type: "success",
          });
        })
        .catch(() => {
          // noop
        })
        .finally(() => {
          this.$set(row, "request", false);
        });
    },

    handleGetAccountTableData(data) {
      this.accountfilter = data.filter;
      this.accountPager = data.pager;
      this.accountSearch = data.search;
      this.getAccountTableData();
    },

    //账号表数据
    getAccountTableData() {
      this.isloadingAccountTable = true;
      const payload = {
        project_id: this.$store.getters.appId,
        channel: this.currentChannel.value,
        ...this.accountPager,
        ...this.accountFilter,
        search: this.accountSearch["accountId"],
      };

      this.$store
        .dispatch("projectManage/fetchAccountTableData", payload)
        .then((resData) => {
          if (resData) {
            this.accountSource = resData.results;
            this.accountPager.total = resData.pager.total;
          }
        })
        .catch(() => {
          // noop
        })
        .finally(() => {
          this.isloadingAccountTable = false;
        });
    },
    // 账号table内容预处理
    preDealAccountTableContent(header, content) {
      if (header.prop === "status") {
        return { normal: "正常", abnormal: "异常", stoped: "停用" }[content];
      } else {
        return content;
      }
    },
    // 新增内部账号
    handleAddNewAccount() {
      this.mode = "new";
      this.isDialogVisible = true;
      this.formData = this.$options.data().formData;
      this.formData.accountId = null;
    },
    // 改变渠道类型
    handleChannelChange(channel) {
      this.channelList.forEach((item) => {
        item.type = "plain";
      });
      channel.type = "primary";
      this.currentChannel = channel;

      this.accountPager = this.$options.data().accountPager;
      this.getAccountTableData();
    },
  },
  created() {
    this.channelList = getChannelList();
    this.currentChannel = this.channelList[0];
    this.getAccountTableData();
  },
};
</script>
<style lang="scss" scoped>
@import "@/styles/index.scss";

.account-container {
  ::v-deep(.el-dialog__body) {
    padding-top: 0;
  }
  .channel-list {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 10px;
  }

  .table-container {
    height: 100%;
    margin-top: 10px;
  }

  .content-container {
    padding: 20px;
    width: 100%;
    overflow: auto;
  }

  .no-data {
    padding: 20px;
    text-align: center;
    color: $color-light-text;
  }

  .form-title {
    font-size: 14px;
    color: $color-primary;
    padding: 20px;
  }

  .input-item {
    width: 400px;
  }

  .button-container {
    text-align: right;
    padding-right: 40px;
  }
}
</style>
