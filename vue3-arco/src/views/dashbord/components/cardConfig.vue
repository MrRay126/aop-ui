<template>
  <el-dialog
    title="报表设置"
    class="card-config"
    width="600px"
    :visible="visible"
    @close="handleClose"
  >
    <div class="config-content">
      <el-form
        ref="form"
        :model="form"
        :rules="rules"
        label-width="80px"
        label-position="left"
      >
        <el-form-item label="报表名称:">
          <el-input
            v-model="form.name"
            class="input-item"
            placeholder="请输入"
            size="mini"
          ></el-input>
        </el-form-item>
        <el-form-item label="时间范围:">
          <time-calendar
            :isAutoTriggerApplyTimeEvent="false"
            :isTextTypeReference="false"
            :timeData="form.time"
            @applyTime="handleFormTimeChange"
          >
            <!-- <template v-slot:calendar="{ data }">
                <div class="time">{{ data.labelValue }}</div>
              </template> -->
          </time-calendar>
        </el-form-item>
        <template v-if="card && card.report && card.report.type === 'trend'">
          <el-form-item label="时间粒度(仅趋势分析存在):" label-width="180px">
            <unit-selector
              :value="form.particle"
              :listerData="unitOptions"
              @change="handleTimeUnitChange"
            ></unit-selector>
          </el-form-item>
        </template>

        <el-form-item label="图表尺寸:">
          <el-radio-group
            v-model="form.cardSize"
            @change="handleCardSizeChange"
          >
            <template
              v-for="(item, index) in getSizeOptions(form.type, cardData)"
            >
              <el-radio :label="item.value" :key="index">{{
                item.label
              }}</el-radio>
            </template>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="备注:">
          <el-input
            class="input-item"
            type="textarea"
            :rows="2"
            v-model="form.comment"
            placeholder="请输入"
          ></el-input>
        </el-form-item>
      </el-form>
      <div class="btn-container">
        <el-button class="cancel-btn" @click="handleCancel">取消</el-button>
        <el-button @click="handleSubmit" :loading="isSaving" type="primary">
          确定
        </el-button>
      </div>
    </div>
  </el-dialog>
</template>
<script>
import TimeCalendar from "@/views/components/time-range-calendar";
import unitSelector from "@/views/components/time-range-calendar/UnitSelector.vue";

import { cloneObject } from "@/utils";
import { getSizeOptions, big, middle } from "../data";
import { getTimeUnitOptions } from "@/views/opinionAnalysis/trend/utils";
export default {
  props: {
    dashbordId: Number,

    card: {
      type: Object,
      default() {
        return null;
      },
    },

    dialogVisible: {
      type: Boolean,
      default: true,
    },
  },

  components: {
    TimeCalendar,
    unitSelector,
  },

  data() {
    return {
      unitOptions: [],
      visible: false,
      isSaving: false,
      cardData: null,
      form: {
        name: "",
        type: "",
        cardSize: "",
        comment: "",
        time: {
          type: "absolute", // absolute|relative 绝对时间|相对时间
          start: "2021/8/1 0:0:0", //开始时间字符串
          end: "2021/8/30 23:59:59", //结束时间字符串
          recent_day: "0-0", //配置日期组件回显  昨日: ‘1-1’ | 今日: ’0-0’ | 上周: ‘W1’ |: 本周 W0 | 上月: M1 | 本月: M0 | 过去7天:  1-7 | 过去30天  1-30 | 过去某天至过去某天 2-7 | StartToNow （绝对时间自某日至今）
        },
        particle: {
          unit: "day",
          weekStart: 0,
        },
      },

      rules: {
        name: [{ required: true, message: "报表名称必填!", trigger: "change" }],
      },
    };
  },
  computed: {},
  watch: {
    dialogVisible: {
      immediate: true,
      handler(val) {
        this.visible = val;
      },
    },

    card: {
      deep: true,
      immediate: true,
      handler(val) {
        if (val && val.report.configs) {
          this.cardData = cloneObject(val);

          // this.cardData = cloneObject({
          //   h: 15,
          //   w: 24,
          //   x: 0,
          //   y: 0,
          //   i: "3",
          //   report: {
          //     project_id: 1,
          //     dashboard_id: 1,
          //     id: 37,
          //     type: "trend",
          //     cardSize: "big",
          //     name: "trend-a",
          //     comment: "注释",
          //     configs: {
          //       filters: {
          //         relTag: "and",
          //         children: [],
          //       },
          //       value: "aop.ods_aop",
          //       time: {
          //         type: "relative",
          //         start: "2023-03-02 00:00:00",
          //         end: "2023-03-08 23:59:59",
          //         recent_day: "1-7",
          //       },
          //       time_unit: {
          //         unit: "hour",
          //         value: 1,
          //         weekStart: 0,
          //       },
          //       groups: [],
          //     },
          //   },
          // });

          const report = this.cardData.report;
          this.unitOptions = getTimeUnitOptions(report.configs.time);
          this.form = {
            name: report.name,
            type: report.type,
            cardSize: report.cardSize,
            comment: report.comment,
            time: report.configs.time,
            particle: report.configs.time_unit,
          };
        }
      },
    },
  },
  methods: {
    getSizeOptions,
    handleTimeUnitChange(value) {
      this.form.particle = value;
    },

    handleFormTimeChange(time) {
      this.form.time = time;
      this.unitOptions = getTimeUnitOptions(time);
    },

    handleCardSizeChange() {
      // 调整布局数据
      const size = this.form.cardSize;
      if (size === "big") {
        this.cardData.x = 0;
        // this.cardData.y = this.cardData.y - 0;
        this.cardData.w = big;
      } else if (size === "middle") {
        this.cardData.w = middle;
      }
    },

    handleClose() {
      this.$emit("close");
      this.isSaving = false;
    },

    handleCancel() {
      this.visible = false;
    },

    async handleSubmit() {
      const validPass = await new Promise((resolve) => {
        this.$refs["form"].validate((valid) => {
          resolve(valid);
        });
      });
      if (!validPass) {
        this.$message({
          message: "请填写必填项!",
          duration: 3000,
          type: "warning",
        });
        return;
      }

      const { x, y, w, h, i } = this.cardData;
      const { project_id, dashboard_id, id } = this.cardData.report;
      const { name, type, cardSize, comment } = this.form;

      const payload = {
        x,
        y,
        w,
        h,
        i,
        report: {
          project_id,
          dashboard_id,
          id,

          name,
          type,
          cardSize,
          comment,

          configs: {
            ...this.cardData.report.configs,
            time: this.form.time,
            time_unit: this.form.particle,
          },
        },
      };

      // console.log("payload:", JSON.stringify(payload, null, "  "));

      this.isSaving = true;
      this.$store
        .dispatch("dashbord/saveCardConfig", payload)
        .then(() => {
          this.$message({
            message: "保存成功!",
            duration: 3000,
            type: "success",
          });

          this.$emit("submit", payload);
        })
        .catch(() => {
          //noop
        })
        .finally(() => {
          this.handleClose();
        });
    },
  },
};
</script>
<style lang="scss" scoped>
.card-config {
  .config-content {
    padding: 20px;

    ::v-deep(.el-input__inner) {
      font-size: 14px;
      height: 30px;
      list-style: 30px;
    }
  }
  .input-item {
    width: 350px;
  }

  .btn-container {
    text-align: right;
    padding-right: 70px;
    padding-top: 20px;

    .cancel-btn {
      margin-right: 10px;
    }
  }
}
</style>
