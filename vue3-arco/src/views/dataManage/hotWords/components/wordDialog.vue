<template>
  <el-dialog
    :visible="visible"
    :title="`${mode === 'create' ? '新增' : '编辑'}热词`"
    width="600px"
    class="word-group-dialog"
    @open="handleOpen"
    @close="handleClose"
  >
    <!-- wordData:{{ wordData }} -->
    <div v-loading="isLoadingOptions">
      <el-form :model="form" :rules="rules" label-width="100px">
        <el-form-item label="热词名称:" prop="name">
          <el-input
            v-model="form.name"
            maxlength="20"
            show-word-limit
            class="input-item"
            size="mini"
          ></el-input>
        </el-form-item>
        <el-form-item label="热词别名:">
          <editable-list
            :listData="form.alias"
            :maxSize="20"
            @change="handleAliasChange"
          ></editable-list>
        </el-form-item>
        <!-- <el-form-item label="词性:" prop="wordType">
          <el-select v-model="form.wordType" class="input-item" size="mini">
            <template v-for="(wordTypeItem, index) in wordTypeList">
              <el-option
                :key="index"
                :label="wordTypeItem.label"
                :value="wordTypeItem.value"
              ></el-option>
            </template>
          </el-select>
        </el-form-item> -->
        <el-form-item label="备注:">
          <el-input
            v-model="form.comment"
            type="textarea"
            size="mini"
            :rows="6"
            maxlength="100"
            show-word-limit
            class="input-item"
            placeholder="请输入"
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
      <div class="btn-container">
        <el-button
          @click="handleSubmit"
          :disabled="isSubmitBtnDisabled"
          type="primary"
          size="mini"
          :loading="isSubmiting"
        >
          确定
        </el-button>
      </div>
    </div>
  </el-dialog>
</template>
<script>
import editableList from "./editableList.vue";
// import { wordTypeList } from "./data.js";
import { cloneObject } from "@/utils";

export default {
  components: { editableList },
  props: {
    visible: {
      type: Boolean,
      default: false,
    },

    mode: {
      type: String,
      default: "create", // create edit
    },

    wordData: {
      type: Object,
      default() {
        return {};
      },
    },
  },
  data() {
    return {
      form: {
        id: null,
        name: "",
        alias: [],
        // wordType: "",
        comment: "",
        permission: {
          type: 1,
          values: [],
        },
      },
      rules: {},
      wordTypeList: [],
      isSubmiting: false,
      isLoadingOptions: false,
      users: [],
    };
  },
  computed: {
    isSubmitBtnDisabled() {
      return this.form.name.trim() === "";
    },
  },
  methods: {
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

    handleAliasChange(data) {
      this.form.alias = data;
    },

    handleSubmit() {
      this.isSubmiting = true;

      let actions = {
        create: "hotWord/createWord",
        edit: "hotWord/modifyWord",
      };

      const action = actions[this.mode];

      let payload = cloneObject(this.form);

      payload.alias = payload.alias.map((item) => {
        return { name: item.value };
      });

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
          this.handleClose();
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

    // getWordTypesList() {
    //   return this.$store
    //     .dispatch("hotWord/getWordTypeList")
    //     .then((data) => {
    //       this.wordTypeList = data;
    //     })
    //     .catch(() => {
    //       // noop
    //     });
    // },

    handleOpen() {
      if (this.mode === "create") {
        this.form = this.$options.data().form;
      } else {
        const data = this.getPayload(this.wordData);
        const alias = data.alias.map((item) => {
          return { value: item.name };
        });

        this.form = {
          ...data,
          alias,
        };
      }

      // this.isLoadingOptions = true;
      // Promise.all([this.getWordTypesList()]).then(() => {
      //   this.isLoadingOptions = false;
      // });

      this.getUsers();
    },

    handleClose() {
      this.$emit("close");
    },
  },
};
</script>
<style lang="scss" scoped>
.word-group-dialog {
  .input-area {
    width: 400px;
  }

  .input-item {
    width: 300px;
  }

  .btn-container {
    text-align: center;
  }
}
</style>
