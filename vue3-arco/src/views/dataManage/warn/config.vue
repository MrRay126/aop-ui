<template>
  <div class="config">
    <div class="config-container">
      <div class="top">
        <div class="left">
          <span class="top-left-title" @click="handleBackToWarn"
            >预警管理
          </span>
          <span>/</span>
          <span> 创建预警</span>
        </div>
        <div class="right">
          <el-button size="mini" @click="handleCancel" :disabled="isSaving"
            >取消</el-button
          >
          <el-button
            size="mini"
            type="primary"
            :loading="isSaving"
            @click="handleSave"
            >保存</el-button
          >
        </div>
      </div>
      <div class="bottom">
        <div class="left-content">
          <div class="left-content-inner">
            <div class="basic-info">
              <div class="config-title">
                <div class="text">基本信息</div>
              </div>
              <div class="form-container">
                <el-form
                  ref="basicForm"
                  label-width="100px"
                  label-position="left"
                  :model="form"
                  :rules="rules"
                >
                  <el-form-item class="basic-form-item" prop="name">
                    <template slot="label">
                      <span style="color: #606266">预警名称 </span>
                      <el-tooltip
                        content="预警标签，创建后不可修改"
                        effect="light"
                        placement="top-start"
                      >
                        <i class="el-icon-info"></i>
                      </el-tooltip>
                    </template>
                    <el-input
                      class="input-item"
                      size="mini"
                      placeholder="请输入"
                      :disabled="isEdit"
                      :maxlength="20"
                      show-word-limit
                      v-model="form.name"
                    ></el-input>
                  </el-form-item>
                  <el-form-item label="描述" class="basic-form-item">
                    <el-input
                      type="textarea"
                      placeholder="请输入"
                      class="warn-des-texarea"
                      :rows="3"
                      :maxlength="100"
                      show-word-limit
                      size="mini"
                      v-model="form.description"
                    ></el-input>
                  </el-form-item>
                </el-form>
              </div>
            </div>
            <div class="data-scope">
              <div class="config-title">
                <div class="text">
                  数据范围<span style="color: red; font-size: 12px"> *</span>
                </div>
              </div>
              <div class="form-container">
                <div class="filter-container">
                  <div class="selector-container">
                    <svg-icon class="deng-icon" icon-class="deng"></svg-icon>
                    <el-select
                      size="mini"
                      v-model="form.dataScope.value"
                      @change="handleFilterValueChange"
                      :clearable="true"
                      :disabled="isEdit"
                    >
                      <template v-for="(item, index) in tableOptionsData">
                        <el-option
                          :value="item.value"
                          :label="item.label"
                          :key="index"
                        ></el-option>
                      </template>
                    </el-select>

                    <svg-icon
                      @click="handleAddItem(form.dataScope.filters)"
                      class="add-filter-icon"
                      icon-class="filter"
                    ></svg-icon>
                  </div>
                  <filters
                    :configData="form.dataScope.filters"
                    :optionsData="filterOptionsData"
                    :valueComponentConfig="filterValueComponentConfig"
                    :disabled="isEdit"
                    @change="handleFilterChange"
                  ></filters>
                </div>
              </div>
            </div>

            <div class="warn-rules">
              <div class="config-title">
                <div class="text">
                  预警规则<span style="color: red; font-size: 12px"> *</span>
                </div>
              </div>
              <div class="form-container">
                <el-form
                  label-width="100px"
                  label-position="left"
                  :model="form"
                  :rules="rules"
                >
                  <el-form-item label="计算周期" class="basic-form-item">
                    <el-radio-group
                      v-model="form.alarmRule.calcPeriod"
                      @change="handleCalcPeriodChange"
                      size="mini"
                    >
                      <el-radio-button :label="PeriodValues.oneByOne">{{
                        CalcPeriodMaps[PeriodValues.oneByOne]
                      }}</el-radio-button>
                      <el-radio-button :label="PeriodValues.hour">
                        {{ CalcPeriodMaps[PeriodValues.hour] }}
                      </el-radio-button>
                      <el-radio-button :label="PeriodValues.day">
                        {{ CalcPeriodMaps[PeriodValues.day] }}
                      </el-radio-button>
                    </el-radio-group>
                  </el-form-item>

                  <template
                    v-if="
                      form.alarmRule.calcPeriod === PeriodValues.hour ||
                      form.alarmRule.calcPeriod === PeriodValues.day
                    "
                  >
                    <el-form-item label="规则关系" class="basic-form-item">
                      <el-radio-group
                        v-model="form.alarmRule.relation"
                        size="mini"
                      >
                        <el-radio-button label="or">或</el-radio-button>
                        <el-radio-button label="and">且</el-radio-button>
                      </el-radio-group>
                    </el-form-item>

                    <el-form-item label="预警规则" class="basic-form-item">
                      <template
                        v-for="(ruleItem, index) in form.alarmRule.rules"
                      >
                        <div class="rule-item-container" :key="index">
                          <span class="rule-index-number">{{ index + 1 }}</span>
                          <condition
                            ref="alarmRuleItem"
                            :compareOptions="compareOptions"
                            :compareTypeOptions="compareTypeOptionsData"
                            :valueTypeOptions="ruleItem.valueTypeOptionsData"
                            v-model="form.alarmRule.rules[index]"
                            @change="handleConfigChange"
                          />
                          <span
                            @click="handleRemoveRule(index)"
                            class="remove-btn"
                          >
                            <i class="el-icon-minus"></i>
                          </span>
                        </div>
                      </template>
                      <div class="rule-add-btn">
                        <el-button type="text" @click="handleAddRule"
                          >+ 预警规则</el-button
                        >
                      </div>
                    </el-form-item>
                  </template>
                </el-form>
              </div>
            </div>

            <div class="permission-config">
              <div class="config-title">
                <div class="text">权限配置</div>
              </div>

              <div class="form-container">
                <el-form label-width="120px" label-position="left">
                  <el-form-item>
                    <template slot="label">
                      <span style="color: #606266">访问成员 </span>
                      <el-tooltip
                        content="配置可访问及查看该预警的用户"
                        effect="light"
                        placement="top-start"
                      >
                        <i class="el-icon-info"></i>
                      </el-tooltip>
                    </template>
                    <el-select
                      class="input-item"
                      size="mini"
                      :filterable="true"
                      v-model="form.members"
                      :clearable="true"
                      :multiple="true"
                    >
                      <template v-for="(user, index) in warnMemberOptions">
                        <el-option
                          :label="user.username"
                          :value="user.id"
                          :key="index"
                        ></el-option>
                      </template>
                    </el-select>
                  </el-form-item>
                  <el-form-item label="webhook配置" size="mini">
                    <template slot="label">
                      <span style="color: #606266">webhook配置 </span>
                      <el-tooltip
                        content="通过飞书webhook机器人推送预警信息"
                        effect="light"
                        placement="top-start"
                      >
                        <i class="el-icon-info"></i>
                      </el-tooltip>
                    </template>

                    <input-register
                      v-model="form.webhooks"
                      class="channel-select"
                      :width="300"
                    ></input-register>
                  </el-form-item>
                </el-form>
              </div>
            </div>
          </div>
        </div>
        <div class="right-step">
          <el-divider content-position="left" class="divider"
            >预警规则 <i class="el-icon-edit"></i
          ></el-divider>

          <div class="warn-rule-container">
            <div class="warn-item">
              <p class="bold">1.计算周期：</p>
              <p style="padding-left: 20px">
                - 逐条:当渠道内容命中数据范围时,立刻进行预警。
              </p>
              <p style="padding-left: 20px">
                - 按小时:
                每小时进行时序统计,根据配置的预警规则确定是否推送预警。
              </p>
              <p style="padding-left: 20px">
                - 按天: 按照24小时的粒度进行时序统计推送预警。
              </p>
            </div>

            <div class="warn-item">
              <p class="bold">2.规则关系</p>
              <p style="padding-left: 20px">
                - 或:
                当规则关系为或时,时序统计值命中任意一条预警规则即进行预警。
              </p>
              <p style="padding-left: 20px">
                - 且:当预警规则为且时,命中所有的预警规则才进行预警。
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import filters from "@/views/components/filters";
import inputRegister from "@/views/components/inputRegister";

import { uuid } from "@/utils";
import condition from "./components/condition.vue";

import { fitListData } from "@/views/components/filters/data.js";
import { travelFilterItem } from "@/views/components/filters/data.js";
import {
  PeriodValues,
  CalcPeriodMaps,
  compareOptions,
  valueTypeOptions,
  getCompareTypeOptions,
  getValueTypeOptionsOf,
} from "./data";

export default {
  name: "warn",
  props: {},
  components: {
    filters,
    condition,
    inputRegister,
  },
  data() {
    return {
      compareOptions,
      valueTypeOptions,
      CalcPeriodMaps,
      PeriodValues,

      isEdit: false,
      //报警人列表
      warnMemberOptions: [],

      tableOptionsData: [], //过滤器列表数据
      filterOptionsData: [],
      filterValueComponentConfig: {},
      /**
       {
        name: "",
        description: "",
        levels: {
          one: {
            checked: false,
          },
          two: {
            checked: false,
            conditions: {
              value: 10,
              valueType: "percent",
              compare: "gt",
              compareType: "fix",
            },
          },
          three: {
            checked: false,
          },
        },


        dataScope: {
          value: "",
          filters: {
            relTag: "and", // or | and
            children: [],
          },
        },
        members: [],
        webhooks: "",
      }

       */

      form: {
        name: "",
        description: "",

        // 预警规则
        alarmRule: {
          calcPeriod: PeriodValues.hour, //逐条
          relation: "or", // or || and
          rules: [],
        },
        // 数据范围
        dataScope: {
          value: "",
          filters: {
            relTag: "and", // or | and
            children: [],
          },
        },
        members: [],
        webhooks: [],
      },

      rules: {
        name: [
          { required: true, message: "请填写预警名称", trigger: "change" },
        ],
      },
      isSaving: false,
    };
  },
  computed: {
    compareTypeOptionsData() {
      if (this.form.alarmRule.calcPeriod === PeriodValues.day) {
        return getCompareTypeOptions(["固定值", "前一天", "上周同一天"]);
      }
      if (this.form.alarmRule.calcPeriod === PeriodValues.hour) {
        return getCompareTypeOptions(["固定值", "上一小时", "昨日同时刻"]);
      }
      return [];
    },
  },

  methods: {
    handleConfigChange(data) {
      data.valueTypeOptionsData = getValueTypeOptionsOf(data.compareType);
    },
    handleCalcPeriodChange() {
      this.form.alarmRule.rules = [];
    },

    handleRemoveRule(index) {
      this.form.alarmRule.rules.splice(index, 1);
    },
    // 添加预警规则
    handleAddRule() {
      //限制上限是5个
      if (this.form.alarmRule.rules.length === 5) {
        this.$message({
          message: "预警规则上限制是5个!",
        });
        return;
      }

      // 预警规则选项
      const ruleItem = {
        value: 10,
        valueType: "number", // number percent
        compare: "gt",
        compareType: "fix",
        valueTypeOptionsData: getValueTypeOptionsOf("fix"),
      };

      this.form.alarmRule.rules.push(ruleItem);
    },

    async validForm() {
      const validPass = await new Promise((res) => {
        this.$refs["basicForm"].validate((valid) => {
          res(valid);
        });
      });

      return validPass;
    },

    validScopeRule() {
      if (!this.form.dataScope.value) {
        return "数据范围是必填项!";
      }
      const filters = this.form.dataScope.filters;
      if (filters.children.length > 0) {
        let hasEmptyFilterItem = false;
        travelFilterItem(filters, (item) => {
          if (hasEmptyFilterItem) return;
          hasEmptyFilterItem =
            !item.key ||
            !item.relation ||
            !item.value ||
            (Array.isArray(item.value) && item.value.length === 0);
        });

        if (hasEmptyFilterItem) {
          return "过滤条件的值是必填项!";
        }
      } else {
        return "数据范围过滤条件是必填项!";
      }
    },

    //取消
    handleCancel() {
      this.handleBackToWarn();
    },

    //回跳预警分析
    handleBackToWarn() {
      this.$router.push({
        path: window.aop.warn,
      });
    },
    handleFilterChange() {},

    handleFilterValueChange() {
      this.form.dataScope.filters = this.$options.data().form.dataScope.filters;
      this.setFilterOptionsData();
    },

    setFilterOptionsData() {
      this.filterOptionsData = [];

      if (this.form.dataScope.value && this.tableOptionsData.length > 0) {
        const curTable = this.tableOptionsData.find((tableItem) => {
          return tableItem.value === this.form.dataScope.value;
        });

        if (curTable) {
          this.filterOptionsData = curTable.keyList || [];
          this.filterValueComponentConfig = curTable.valueComponentConfig;
        }
      }
    },

    handleAddItem(filters) {
      if (this.isEdit) return;
      if (!this.form.dataScope.value) {
        this.$message({
          message: "选择舆情内容后方可添加条件",
          type: "info",
          duration: 3000,
        });
        return;
      }

      const filterItem = { id: uuid(), key: null, relation: null, value: null };
      filters.children.push(filterItem);
    },

    getWarnMembers() {
      this.$store
        .dispatch("warn/getWarnMembers")
        .then((data) => {
          this.warnMemberOptions = data;
          // console.log(111, JSON.stringify(this.warnMemberOptions));
        })
        .catch(() => {
          //noop
        });
    },
    getFilterOptionsData() {
      const payload = {
        project_id: this.$store.getters.appId,
      };
      this.$store.dispatch("trend/getFilterOptions", payload).then((data) => {
        this.tableOptionsData = fitListData(data);
        if (data.length > 0) {
          //设置默认选中第一个值
          // this.form.dataScope.value = data[0].code;
          // this.handleFilterValueChange();
          this.setFilterOptionsData();
        }
      });
    },

    //api
    async handleSave() {
      const validPass = await this.validForm();

      if (!validPass) {
        this.$message({
          message: "请填写必填项!",
          duration: 3000,
          type: "warning",
        });
        return;
      }

      let validRulesMessage = this.validScopeRule();

      if (validRulesMessage) {
        this.$message({
          message: validRulesMessage,
          duration: 3000,
          type: "warning",
        });
        return;
      }

      const isOneByOnePeriod =
        this.form.alarmRule.calcPeriod === PeriodValues.oneByOne;
      const rules = this.form.alarmRule.rules;

      if (!isOneByOnePeriod && rules.length === 0) {
        this.$message({
          message: "请添加预警规则!",
          duration: 3000,
          type: "warning",
        });
        return;
      } else if (!isOneByOnePeriod && rules.length > 0) {
        const ruleItems = this.$refs["alarmRuleItem"];
        const validResults = await Promise.all(
          ruleItems.map((item) => item.validate())
        );

        const pass = validResults.every((isPass) => {
          return isPass;
        });

        if (!pass) {
          this.$message({
            message: "预警规则项存在未填写的值!",
            duration: 3000,
            type: "warning",
          });
          return;
        }
      }

      this.isSaving = true;
      const payload = {
        project_id: this.$store.getters.appId,
        id: this.$route.query.id || null,
        ...this.form,
      };

      const isEditMode = typeof this.$route.query.id !== "undefined";
      const action = isEditMode
        ? "warn/updateWarnSettings"
        : "warn/saveWarnSettings";

      this.$store
        .dispatch(action, payload)
        .then(() => {
          this.$message({
            message: isEditMode ? "更新成功!" : "保存成功!",
            type: "success",
            duration: 3000,
          });

          setTimeout(() => {
            this.handleCancel();
          }, 500);
        })
        .catch(() => {
          // noop
        })
        .finally(() => {
          this.isSaving = false;
        });
    },

    getWarnSettingData() {
      const isEdit = "id" in this.$route.query;
      const id = this.$route.query["id"];
      if (isEdit) {
        this.$store
          .dispatch("warn/getWarnSettingsById", { id })
          .then((data) => {
            this.form = data;

            //设置回显时的 数值类型options
            this.form.alarmRule.rules.forEach((item) => {
              item.valueTypeOptionsData = getValueTypeOptionsOf(
                item.compareType
              );
            });

            //有值了需根据值 设置当前过滤选项使用的options
            this.setFilterOptionsData();
          })
          .catch(() => {
            //noop
          });
      }
    },
    init() {
      this.getFilterOptionsData();
      this.getWarnMembers();
      this.isEdit = "id" in this.$route.query;

      if (this.isEdit) {
        this.getWarnSettingData();
      }
    },
  },
  created() {
    this.init();
  },
};
</script>
<style lang="scss" scoped>
@import "@/styles/index.scss";
.config {
  padding: 15px;
  background-color: $normal-background-color;
  text-align: left;
  height: 100%;

  .channel-select {
    width: 300px;
  }

  .condition-container {
    margin-bottom: 10px;
  }

  .config-container {
    background-color: #fff;
    height: 100%;
    overflow-y: auto;

    .top {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 10px;
      border-bottom: 1px solid $color-border;
      .left {
        font-size: 14px;
        color: $color-text;

        .top-left-title {
          color: $color-disabled;
          cursor: pointer;

          &:hover {
            color: $color-text;
          }
        }
      }
    }

    .bottom {
      display: flex;
      justify-content: flex-start;
      align-items: flex-start;
      height: calc(100% - 50px);

      .right-step {
        border-left: 1px solid $color-border;
        height: 100%;
        width: 400px;
        overflow-y: auto;
        padding-bottom: 30px;
        padding-right: 20px;
        flex-shrink: 0;

        .step-container {
          width: 350px;
          height: 350px;
          padding-top: 30px;
          padding-right: 50px;
        }

        .divider {
          margin-top: 50px;
        }

        .warn-rule-container {
          font-size: 14px;
          padding-top: 10px;
          padding-left: 40px;

          .warn-item {
            margin-bottom: 10px;
            color: #606266;

            .bold {
              font-weight: bold;
            }
          }
        }
      }

      .left-content {
        // width: 600px;
        // margin-left: 200px;
        // border-left: 1px solid $color-border;

        width: 100%;
        height: 100%;
        overflow-y: auto;
        padding-left: 30px;
        position: relative;

        .filter-container {
          min-height: 50%;
          width: 570px;

          $shallow-color-text: #8395ad;
          $color-primary: #2d8cf0;

          .selector-container {
            display: flex;
            justify-content: flex-start;
            align-items: center;
            & > span {
              margin-left: 5px;
            }

            .deng-icon {
              margin-right: 5px;
              color: $shallow-color-text;
            }

            .add-filter-icon {
              margin-left: 5px;
              color: $shallow-color-text;
              cursor: pointer;

              &:hover {
                color: $color-primary;
              }
            }
          }
        }

        .left-content-inner {
          position: absolute;
          left: 50%;
          transform: translateX(-50%);
          max-width: 800px;
          padding-bottom: 50px;
        }

        .input-item {
          width: 300px;
        }

        .config-title {
          height: 30px;
          font-size: 20px;
          text-align: left;
          color: $color-text;
          border-bottom: 1px solid $color-border;

          .text {
            display: inline-block;
            border-left: 2px solid $color-primary;
            line-height: 20px;
            padding-left: 5px;
          }
        }

        .warn-grade {
          display: flex;
          flex-direction: column;
          justify-content: flex-start;
          align-items: flex-start;
        }

        .form-container {
          padding-top: 30px;

          .basic-form-item {
            .warn-des-texarea {
              width: 300px;
            }
            .rule-item-container {
              min-width: 500px;
              height: 40px;

              &:hover {
                .remove-btn {
                  display: inline;
                }
              }

              .rule-index-number {
                font-size: 12px;
                display: inline-block;
                padding: 2px 4px;
                border-radius: 2px;
                line-height: 1;
                background-color: #bae7ff;
              }

              .remove-btn {
                display: none;
                margin-left: 5px;
                color: $color-primary;
                cursor: pointer;
              }
            }
          }
        }

        .basic-info {
          padding-top: 30px;
        }

        .data-scope {
          padding-top: 30px;
        }

        .warn-rules {
          padding-top: 30px;
        }

        .permission-config {
          padding-top: 30px;
        }
      }
    }
  }
}
</style>
