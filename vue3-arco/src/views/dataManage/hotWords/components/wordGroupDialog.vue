<template>
  <!-- 词组弹窗 -->
  <el-dialog
    :visible="visible"
    :title="`${mode === 'create' ? '新增' : '编辑'}词组`"
    width="500px"
    class="word-group-dialog"
    @open="handleOpen"
    @close="handleCancel"
  >
    <div class="title-section" slot="title">
      <span class="title-text">
        {{ `${mode === "create" ? "新增" : "编辑"}词组` }}
      </span>
      <!-- <el-button @click="handleCreateHotword" size="mini" type="success">
        + 创建热词
      </el-button> -->
    </div>
    <div v-loading="isLoadingOptions">
      <el-form label-width="100px" :model="form" :rules="rules">
        <el-form-item label="词组名称:">
          <el-input
            v-model="form.name"
            class="input-item"
            size="mini"
            placeholder="请输入"
            maxlength="20"
            show-word-limit
          ></el-input>
        </el-form-item>
        <el-form-item label="成员词:">
          <el-select
            v-model="form.members"
            :multiple="true"
            filterable
            :multiple-limit="20"
            size="mini"
            class="input-item"
            value-key="id"
            @change="handleWordMemberChange"
          >
            <template v-for="(item, index) in wordList">
              <el-option
                :key="index"
                :label="item.name"
                :value="item"
              ></el-option>
            </template>
          </el-select>
        </el-form-item>
        <el-form-item label="备注:">
          <el-input
            type="textarea"
            class="input-item"
            maxlength="100"
            :rows="6"
            show-word-limit
            v-model="form.comment"
          ></el-input>
        </el-form-item>
        <el-form-item label="权限:">
          <div>
            <el-radio v-model="form.permission.type" :label="1">私人</el-radio>
          </div>
          <div>
            <el-radio v-model="form.permission.type" :label="2">公开</el-radio>
          </div>
          <div>
            <el-radio v-model="form.permission.type" :label="3">群组</el-radio>
            <template v-if="form.permission.type === 3">
              <el-select
                v-model="form.permission.values"
                :multiple="true"
                filterable
                placeholder="请选择"
                size="mini"
              >
                <template v-for="(user, index) in users">
                  <el-option
                    :key="index"
                    :label="user.username"
                    :value="user.id"
                  ></el-option>
                </template>
              </el-select>
            </template>
          </div>
        </el-form-item>
      </el-form>
      <div class="btns-container">
        <el-button
          :disabled="isSubmitBtnDisabled"
          :loading="isSubmiting"
          @click="handleSubmit"
          type="primary"
          size="mini"
          >确定</el-button
        >
      </div>
    </div>
  </el-dialog>
</template>
<script>
import { cloneObject } from "@/utils";
export default {
  components: {},
  props: {
    mode: {
      type: String,
      default: "create", // edit: 编辑 create: 新建
    },
    wordGroupData: {
      type: Object,
      default() {
        return null;
      },
    },
    visible: {
      type: Boolean,
      default: true,
    },
  },
  data() {
    // const checkAliasNames = (rule, val, callback) => {
    //   if (val.length === 0) {
    //     return callback(new Error("词组成员必填"));
    //   }
    //   callback();
    // };
    return {
      isSubmiting: false,
      form: {
        id: null,
        name: "",
        members: [],
        comment: "",
        permission: {
          type: 1,
          values: [],
        },
      },

      rules: {
        name: [{ required: true, message: "词组名称必填!", trigger: "change" }],
        members: [
          { required: true, message: "词组成员必填!", trigger: "change" },
        ],
        // alias: [{ validator: checkAliasNames, required: true }],
      },

      wordList: [{ name: "成员词1", value: "word1" }],
      users: [],
      isLoadingOptions: false,
    };
  },

  computed: {
    isSubmitBtnDisabled() {
      return !this.form.name.trim() || this.form.members.length === 0;
    },
  },

  methods: {
    getMemberOptions() {
      const payload = {
        project_id: this.$store.getters.appId,
      };

      return this.$store
        .dispatch("hotWord/getWordMemberOptions", payload)
        .then((data) => {
          this.wordList = data;
        })
        .catch(() => {
          // noop
        });
    },

    getUsers() {
      return this.$store
        .dispatch("hotWord/getUsers")
        .then((data) => {
          this.users = data;
        })
        .catch(() => {
          // noop
        });
    },
    handleWordMemberChange() {},
    handleAliasChange(data) {
      this.form.alias = data;
    },

    handleCreateHotword() {
      this.handleCancel();
      this.$emit("createHotword");
    },

    handleOpen() {
      if (this.mode === "edit") {
        const data = this.getPayload(this.wordGroupData);

        this.form = data;
      }
      if (this.mode === "create") {
        this.form = this.$options.data().form;
      }

      this.isLoadingOptions = true;
      Promise.all([this.getMemberOptions(), this.getUsers()])
        .then(() => {})
        .catch(() => {
          //noop
        })
        .finally(() => {
          this.isLoadingOptions = false;
        });
    },

    handleSubmit() {
      this.isSubmiting = true;

      let actions = {
        create: "hotWord/createWordGroup",
        edit: "hotWord/modifyWordGroup",
      };

      const action = actions[this.mode];

      const payload = cloneObject(this.form);

      payload.project_id = this.$store.getters.appId;

      this.$store
        .dispatch(action, payload)
        .then(() => {
          this.$message({
            message: "保存成功!",
            type: "success",
            duration: 3000,
          });
          this.$emit("submit");
          this.handleCancel();
        })
        .catch(() => {
          // noop
        })
        .finally(() => {
          this.isSubmiting = false;
        });
    },

    // 获取编辑的必要字段
    getPayload(form) {
      const data = {};
      const originForm = this.$options.data().form;
      for (let prop in originForm) {
        data[prop] = form[prop];
      }
      return data;
    },

    handleCancel() {
      this.$emit("close");
    },
  },
  created() {},
};
</script>
<style scoped lang="scss">
@import "@/styles/index.scss";
.word-group-dialog {
  .title-section {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding-right: 50px;
  }

  .input-item {
    width: 260px;
  }

  .btns-container {
    text-align: center;
  }

  .add-alias-btn {
    border-radius: 3px;
    border: 1px dashed $color-border;
    line-height: 1;
    padding: 5px 10px;
    display: inline-block;
    margin-left: 10px;
    font-size: 12px;
    cursor: pointer;

    &:hover {
      color: $color-primary;
      border-color: #ccc;
    }
  }
}
</style>
