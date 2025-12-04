<template>
  <div class="ai-summary">
    <el-popover
      placement="bottom"
      title=""
      width="290"
      trigger="click"
      v-model="isVisible"
      @show="handlePopoverShow"
    >
      <template>
        <div class="pop-content">
          <el-form :disabled="isFormDisabled">
            <div class="radio-section">
              <el-radio-group v-model="summaryType" @change="handleRadioChange">
                <template v-for="radioItem in radioList">
                  <div class="radio-container" :key="radioItem.value">
                    <el-radio :label="radioItem.value">{{
                      radioItem.label
                    }}</el-radio>
                  </div>
                </template>
              </el-radio-group>
            </div>
            <template v-if="summaryType === 'addTips'">
              <div class="tip-wrapper">
                <el-form-item title="提示词" :error="errorMsg">
                  <el-input
                    placeholder="输入希望核心抽取的话题"
                    style="width: 200px"
                    size="mini"
                    v-model="promptWords"
                  ></el-input>
                </el-form-item>
              </div>
            </template>

            <div class="btn-container">
              <el-button size="mini" @click="handleCancel">取消</el-button>
              <el-button
                type="primary"
                size="mini"
                class="cal"
                @click="handleCalculate"
                :loading="isCalculating"
                >计算</el-button
              >
            </div>
          </el-form>
        </div>
      </template>
      <span slot="reference">
        <el-button icon="el-icon-setting" size="mini">Ai总结</el-button>
      </span>
    </el-popover>
  </div>
</template>

<script>
/**
 * @event submit 计算按钮事件 data:{summaryType:总结类型 ,promptWords:补充提示}
 *
 */
export default {
  props: {
    visible: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      radioList: [
        {
          label: "默认",
          value: "default",
        },
        {
          label: "补充提示",
          value: "addTips",
        },
      ],

      isVisible: false,
      summaryType: "default",
      promptWords: "",
      isFormDisabled: false,
      isCalculating: false,
      errorMsg: "",
    };
  },
  methods: {
    handleRadioChange() {
      this.errorMsg = "";
    },

    handleCancel() {
      this.summaryType = this.$options.data().summaryType;
      this.promptWords = this.$options.data().promptWords;
      this.isVisible = false;
    },

    handleCalculate() {
      if (this.summaryType === "addTips" && !this.promptWords) {
        this.errorMsg = "必填项";
        return;
      } else {
        this.errorMsg = "";
      }

      // this.isCalculating = true;
      this.isFormDisabled = true;
      // this.handleCancel();
      // 计算操作
      //   this.$store
      //     .dispath("", {})
      //     .then(() => {})
      //     .finally(() => {
      //       this.isVisible = false;
      //     });

      this.isVisible = false;

      this.$emit("submit", {
        summaryType: this.summaryType,
        promptWords: this.promptWords,
      });
    },

    handlePopoverShow() {
      this.isFormDisabled = false;
      this.isCalculating = false;
    },
  },
  created() {},
};
</script>

<style lang="scss" scoped>
.btn-container {
  text-align: right;

  .cal {
    margin-right: 10px;
  }
}

.pop-content {
  line-height: 30px;
}

.tip-wrapper {
  text-align: left;
  margin-top: 5px;

  .title {
    padding-right: 10px;
  }
}

.radio-section {
  line-height: 30px;

  .radio-container {
    padding-top: 10px;
  }
}

.btn-container {
  margin-top: 20px;
}
</style>
