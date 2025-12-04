<template>
  <div class="condition">
    <el-form ref="form" :rules="rules" :model="{ value: value }">
      <span>预警值</span>
      <el-select
        class="compare"
        size="mini"
        v-model="compare"
        @change="handleCompareChange"
      >
        <template v-for="(item, index) in compareOptionsData">
          <el-option
            :key="index"
            :label="item.label"
            :value="item.value"
          ></el-option>
        </template>
      </el-select>

      <el-select
        class="compare-type"
        size="mini"
        v-model="compareType"
        @change="handleCompareTypeChange"
      >
        <template v-for="(item, index) in compareTypeOptionsData">
          <el-option
            :label="item.label"
            :value="item.value"
            :key="index"
          ></el-option>
        </template>
      </el-select>

      <el-form-item prop="value" style="display: inline-block">
        <el-input-number
          class="value-input"
          size="mini"
          v-model="value"
          controls-position="right"
          :controls="false"
          @change="handleValueChange"
        ></el-input-number>
      </el-form-item>

      <el-select
        class="value-type"
        size="mini"
        v-model="valueType"
        @change="handleValueTypeChange"
      >
        <template v-for="(item, index) in valueTypeOptionsData">
          <el-option
            :key="index"
            :label="item.label"
            :value="item.value"
          ></el-option>
        </template>
      </el-select>
    </el-form>
  </div>
</template>

<script>
/**
 @event change  @eventdata 
 {
     compare: "gt", // 大于:gt, 小于:lt  
     compareType: "fix", // 固定值:fix , 上一小时:oneHourBefore , 昨日同时刻:sameTimeOfYestoday
     value: 1, // Number
     valueType: "" //数值: number , 百分比:percent
 }
 */

export default {
  model: {
    event: "change",
    prop: "valueData",
  },
  props: {
    /**组件输入的数据值*/
    valueData: {
      type: Object,
      default() {
        return null;
      },
    },
    // 高于 低于
    compareOptions: {
      type: Array,
      default() {
        return [];
      },
    },

    // 固定值、上一小时、昨日同时刻、前一天、上周同一天
    compareTypeOptions: {
      type: Array,
      default() {
        return [];
      },
    },

    // 数值 百分比
    valueTypeOptions: {
      type: Array,
      default() {
        return [];
      },
    },
  },
  data() {
    return {
      compareOptionsData: [],
      compareTypeOptionsData: [],
      valueTypeOptionsData: [],

      compare: "",
      compareType: "",
      value: "",
      valueType: "",

      rules: {
        value: [
          { message: "请输入比较数值!", required: true, trigger: "change" },
        ],
      },
    };
  },
  watch: {
    valueData: {
      immediate: true,
      handler(val) {
        if (val) {
          this.value = val.value;
          this.valueType = val.valueType;
          this.compare = val.compare;
          this.compareType = val.compareType;
        }
      },
    },

    compareOptions: {
      immediate: true,
      handler(val) {
        if (Array.isArray(val)) {
          this.compareOptionsData = val;
        }
      },
    },

    compareTypeOptions: {
      immediate: true,
      handler(val) {
        if (Array.isArray(val)) {
          this.compareTypeOptionsData = val;
        }
      },
    },

    valueTypeOptions: {
      immediate: true,
      handler(val) {
        if (Array.isArray(val)) {
          this.valueTypeOptionsData = val;
        }
      },
    },
  },
  methods: {
    validate() {
      return new Promise((resolve) => {
        this.$refs["form"].validate((valid) => {
          resolve(valid);
        });
      });
    },
    handleCompareChange() {
      this.handleChange();
    },
    handleCompareTypeChange() {
      // 对比类型为固定值时,值类型选项只有 "数值" , 则设置值类型为 "数值".
      if (this.compareType === "fix") {
        this.valueType = "number";
      }

      this.handleChange();
    },
    handleValueChange() {
      this.handleChange();
    },
    handleValueTypeChange() {
      this.handleChange();
    },
    handleChange() {
      const data = {
        compare: this.compare,
        compareType: this.compareType,
        value: this.value,
        valueType: this.valueType,
      };

      this.$emit("change", data);
    },
  },
  created() {},
};
</script>
<style lang="scss" scoped>
.condition {
  display: inline-flex;
  align-items: center;
  justify-content: flex-start;
  // border-left: 1px dashed #dcdfe6;
  padding-left: 10px;

  .compare {
    width: 90px;
    margin-left: 5px;
  }

  .compare-type {
    width: 110px;
    margin-left: 5px;
  }

  .value-input {
    width: 100px;
    margin-left: 5px;
  }

  .value-type {
    width: 90px;
    margin-left: 5px;
  }

  ::v-deep(.el-input__inner) {
    border: 1px solid #dcdfe6 !important;
  }
}
</style>
