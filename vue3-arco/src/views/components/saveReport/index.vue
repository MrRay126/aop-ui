<template>
  <el-dialog
    :title="title"
    :visible="visible"
    @close="handleClose"
    width="700px"
  >
    <div class="save-reports">
      <!-- 保存报表弹窗 -->
      <el-form label-width="100px">
        <template v-if="type === OpinionType.topic">
          <el-form-item label="任务名称:">
            <el-input
              v-model="form.name"
              placeholder="请输入"
              class="input-area"
              maxlength="20"
              show-word-limit
            ></el-input>
            <div class="comment">
              备注:
              主题分析计算量较大,需要后台异步计算,请保存任务,并稍后在任务管理界面查看任务结果
            </div>
          </el-form-item>
        </template>
        <template v-else>
          <el-form-item label="报表名称:">
            <el-input
              v-model="form.name"
              placeholder="请输入"
              size="mini"
              class="input-area"
              maxlength="20"
              show-word-limit
            ></el-input>
          </el-form-item>
          <el-form-item label="报表备注:">
            <el-input
              v-model="form.comment"
              type="textarea"
              size="mini"
              :rows="4"
              maxlength="200"
              show-word-limit
              class="input-area"
              placeholder="请输入"
            ></el-input>
          </el-form-item>
        </template>
      </el-form>
      <div class="btn-container">
        <el-button @click="handleCancel" size="mini" class="cancel-btn"
          >取消</el-button
        >
        <el-button
          @click="handleSubmit"
          :loading="isSaving"
          :disabled="!form.name"
          size="mini"
          type="primary"
        >
          {{ mode === modes.save || mode === modes.saveAs ? "保存" : "更新" }}
        </el-button>
      </div>
    </div>
  </el-dialog>
</template>
<script>
import { commands } from "@/views/components/saveReport/data.js";
import { OpinionType } from "@/views/dashbord/data/index.js";

export default {
  props: {
    // 报表的类型 趋势分析 主题分析..
    type: {
      type: String,
      default: "",
    },

    mode: {
      type: String,
      default: "save", // save:保存 update:更新 saveAs:另存为
    },

    visible: {
      type: Boolean,
      default: true,
    },

    reportData: {
      type: Object,
      default: () => {
        return {
          name: "",
          comments: "",
          type: "",
          configs: {},
        };
      },
    },
  },
  components: {},
  data() {
    return {
      OpinionType,
      modes: commands,
      isSaving: false,
      form: {
        name: "",
        comment: "",
      },
    };
  },
  computed: {
    title() {
      if (this.type === "topic") {
        return "保存任务";
      } else {
        const titleDict = {
          save: "保存报表",
          update: "更新报表",
          saveAs: "另存报表",
        };
        return titleDict[this.mode];
      }
    },
  },
  watch: {
    reportData: {
      deep: true,
      handler(val) {
        if (val) {
          this.form = val;
        }
      },
    },
  },

  methods: {
    handleSubmit() {
      this.isSaving = true;
      const payload = this.form;

      const isCreateTask = [OpinionType.topic].includes(this.type);
      const action = isCreateTask
        ? "reports/creareTask" //创建异步任务(需要异步计算的报表)
        : "reports/saveReportConfig"; // 保存报表配置

      if (isCreateTask) {
        payload.click = 1;
      }
      this.$store
        .dispatch(action, payload)
        .then(() => {
          this.$message({
            message: "保存成功!",
            duration: 3000,
            type: "success",
          });

          this.$emit("saved", payload);
          this.$emit("close");

          // 打开任务管理器
          if (isCreateTask) {
            this.$store.dispatch("task/openTaskPannel");
          }
        })
        .catch(() => {
          //noop
        })
        .finally(() => {
          this.isSaving = false;
        });
    },
    handleCancel() {
      this.$emit("close");
    },
    handleClose() {
      this.$emit("close");
    },
  },
  created() {},
};
</script>
<style lang="scss" scoped>
@import "@/styles/index.scss";
.save-reports {
  .input-area {
    width: 500px;
  }

  .btn-container {
    text-align: right;
    padding-right: 60px;

    .cancel-btn {
      margin-right: 10px;
    }
  }

  .comment {
    font-size: 12px;
    color: $color-text;
    // padding: 0 30px;
  }
}
</style>
