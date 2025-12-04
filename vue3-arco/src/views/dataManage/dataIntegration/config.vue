<template>
  <div class="config-container">
    <div class="top-section">
      <div class="title">
        <span class="pre-title" @click="handleBack">媒体渠道数据集成</span>
        <span> / </span>
        <span class="after-title"
          >{{ channel.channelName }}-{{ contentType.contentType }}采集规则</span
        >
      </div>
      <div class="btn-container">
        <template v-if="hasCreateRulePerm">
          <el-button type="plain" @click="handleConfigBtnClick">
            + 采集规则
          </el-button>
        </template>
      </div>
    </div>

    <div class="table-container">
      <dynamic-table
        :height="600"
        :dimension="dimensions"
        :source="source"
        :filter="filter"
        :filterOptions="filterOptions"
        sortMode="single"
        :pager="pager"
        :loading="loading"
        :contentHandler="preDealContent"
        @getTableData="handleGetTableData"
      ></dynamic-table>
    </div>

    <el-dialog
      class="config-dialog"
      title="采集配置"
      :visible.sync="isShowConfigDialog"
      width="500px"
      @open="handleConfigOpen"
    >
      <div slot="title">
        <div class="top-section">
          <div class="left">
            <div class="content-type-tag">内容类型</div>
            <div class="content-type-text">{{ rule.contentType }}</div>
          </div>
          <div
            class="logo-section"
            :style="{ backgroundImage: 'url(' + rule.logo + ')' }"
          ></div>
        </div>
      </div>

      <div class="bottom-section" v-loading="loadingRuleConfig">
        <div class="galler-container">
          <span class="title">采集规则:</span>
          <el-select v-model="curRule" value-key="label" size="mini">
            <template v-for="(item, index) in rule.ruleList">
              <el-option
                :label="item.label"
                :value="item"
                :key="index"
              ></el-option>
            </template>
          </el-select>
        </div>
        <!-- rule.ruleList:: {{ rule.ruleList }} -->
        <!-- <el-tabs v-model="tabActiveName" @tab-click="handleConfigTabClick"> -->
        <!-- <template v-for="(ruleItem, index) in rule.ruleList"> -->
        <!-- <el-tab-pane
              :label="ruleItem.label"
              :name="ruleItem.label"
              :key="index"
            > -->
        <template v-if="curRule && curRule.configs">
          <div class="rule-list-item">
            <div class="content-section">
              <template v-if="'preTaskComment' in curRule.configs">
                <div class="config-item">
                  <div class="title">前置任务:</div>
                  <div class="pre-task-comment">
                    {{ curRule.configs["preTaskComment"] }}
                  </div>
                </div>
              </template>

              <template v-if="curRule.configs.isParamsVisible">
                <div class="config-item">
                  <div class="title">参数配置:</div>

                  <div class="params-container">
                    <!-- <div> -->
                    <template v-for="(pItem, pIndex) in curRule.configs.params">
                      <template
                        v-if="
                          typeof pItem.visible === 'undefined' || pItem.visible
                        "
                      >
                        <div class="param-item-container" :key="pIndex">
                          <span class="param-label">{{ pItem.label }}:</span>
                          <div class="input-container">
                            <template v-if="pItem.type === 'string'">
                              <el-input
                                class="string-input-item"
                                size="mini"
                                v-model="pItem.value"
                              ></el-input>
                            </template>
                            <template v-if="pItem.type === 'number'">
                              <el-input-number
                                class="number-input-item"
                                size="mini"
                                v-model="pItem.value"
                                controls-position="right"
                              ></el-input-number>
                            </template>
                          </div>
                        </div>
                      </template>
                    </template>
                  </div>
                </div>
              </template>
              <template v-if="'execType' in curRule.configs">
                <div class="config-item">
                  <div class="title">执行方式:</div>
                  <el-select
                    class="input-select"
                    size="mini"
                    v-model="curRule.configs.execType"
                  >
                    <template
                      v-for="(item, index) in getPeriodOptions('execType')"
                    >
                      <el-option
                        :key="index"
                        :label="item.label"
                        :value="item"
                      ></el-option>
                    </template>
                  </el-select>
                </div>
              </template>
              <template v-if="'etlPeriod' in curRule.configs">
                <div class="config-item">
                  <div class="title">调度周期:</div>
                  <el-select
                    class="input-select"
                    size="mini"
                    v-model="curRule.configs.etlPeriod"
                    value-key="label"
                  >
                    <template
                      v-for="(item, index) in getPeriodOptions('etlPeriod')"
                    >
                      <el-option
                        :key="index"
                        :label="item.label"
                        :value="item"
                      ></el-option>
                    </template>
                  </el-select>
                </div>
              </template>
              <template v-if="'delayPeriod' in curRule.configs">
                <div class="config-item">
                  <div class="title">延时周期:</div>
                  <el-select
                    class="input-select"
                    size="mini"
                    v-model="curRule.configs.delayPeriod"
                    value-key="label"
                  >
                    <template
                      v-for="(item, index) in getPeriodOptions('delayPeriod')"
                    >
                      <el-option
                        :key="index"
                        :label="item.label"
                        :value="item"
                      ></el-option>
                    </template>
                  </el-select>
                </div>
              </template>
              <template v-if="'hasAlgorithm' in curRule.configs">
                <div class="config-item">
                  <div class="title">算法:</div>
                  <div class="input-select">
                    <el-switch
                      v-model="curRule.configs.hasAlgorithm"
                    ></el-switch>
                  </div>
                  <!-- <el-select
                    class="input-select"
                    size="mini"
                    v-model="curRule.configs.algorithm"
                    value-key="label"
                    multiple
                  >
                    <template v-for="(item, index) in algorithmOptions">
                      <el-option
                        :key="index"
                        :label="item.label"
                        :value="item.value"
                      ></el-option>
                    </template>
                  </el-select> -->
                </div>
              </template>

              <template v-if="'comment' in curRule.configs">
                <div class="config-item">
                  <div class="title">备注信息:</div>
                  <el-input
                    placeholder="请输入"
                    class="comment-textarea"
                    type="textarea"
                    cols="3"
                    v-model="curRule.configs.comment"
                  ></el-input>
                </div>
              </template>

              <template v-if="'note' in curRule.configs">
                <div class="config-item">
                  <div class="title">规则说明:</div>
                  <div class="comment-text">
                    {{ curRule.configs.note }}
                  </div>
                </div>
              </template>
            </div>
            <!-- </el-tab-pane> -->
          </div>
        </template>
        <!-- </template> -->
        <!-- </el-tabs> -->
      </div>

      <div class="btns-container">
        <!-- <el-button size="mini">取消</el-button> -->
        <el-button
          size="mini"
          type="primary"
          :loading="isSubmitting"
          :disabled="isSubmitDisabled"
          @click="handleSubmit"
          >确定
        </el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import dynamicTable from "@/views/components/dynamicTable";

import {
  dimensions,
  statusOptions,
  getPeriodOptions,
  validRuleList,
} from "./data.js";

import { mapGetters } from "vuex";
export default {
  props: {
    // 渠道名称
    channel: {
      type: Object,
      default() {
        return {};
      },
    },
    //内容类型
    contentType: {
      type: Object,
      default() {
        return {};
      },
    },
  },

  components: {
    dynamicTable,
  },

  data() {
    return {
      curRule: {},
      tabActiveName: "",
      isSubmitDisabled: true,
      isSubmitting: false,
      rule: {
        contentType: "",
        logo: "",
        ruleList: [
          // {
          //   label: "关键字搜索",
          //   type: "list", // list || detail
          //   configs: {
          //     preTaskComment: "前置任务说明",
          //     params: [
          //       {
          //         name: "keyword",
          //         label: "采集关键字",
          //         type: "string",
          //         value: "keyword1",
          //       },
          //       { name: "uids", label: "用户id", type: "number", value: 0 },
          //     ],
          //     etlPeriod: "day", // 调度周期
          //     delayPeriod: "day", // 延时周期
          //     algorithm:"算法",  // 算法
          //     comment: "注释内容",
          //   },
          // },
          // {
          //   label: "关键字搜索2",
          //   type: "list", // list || detail
          //   configs: {
          //     preTaskComment: "帖子搜索",
          //     params: [
          //       {
          //         name: "keyword",
          //         label: "采集关键字",
          //         type: "string",
          //         value: "keyword1",
          //       },
          //       { name: "uids", label: "用户id", type: "number", value: 0 },
          //     ],
          //     etlPeriod: "day", // 调度周期
          //     delayPeriod: "day", // 延时周期
          //     comment: "注释内容",
          //   },
          // },
        ],
      },
      algorithmOptions: [{ label: "算法1", value: 1 }],

      isShowConfigDialog: false,
      dimensions,
      source: [],
      filterOptions: {},
      filter: {},
      pager: {
        curPage: 1,
        pageSize: 10,
        total: 0,
      },
      loading: false,
      loadingRuleConfig: false,
      curRow: null,
    };
  },

  computed: {
    ...mapGetters(["perms"]),

    hasCreateRulePerm() {
      return this.perms.includes("root") || this.perms.includes("admin");
    },

    hasAuditPerm() {
      return this.perms.includes("root");
    },

    hasDeletePerm() {
      return this.perms.includes("root");
    },
  },

  watch: {
    // rule: {
    //   deep: true,
    //   handler(val) {
    //     if (val) {
    //       this.isSubmitDisabled = !validRuleList(val.ruleList);
    //     }
    //   },
    // },

    curRule: {
      deep: true,
      handler(val) {
        this.isSubmitDisabled = !validRuleList([val]);
      },
    },
  },

  methods: {
    getAlgorithmOptions() {
      const payload = {
        project_id: this.$store.getters.appId,
        channelId: this.channel.id,
        contentTypeId: this.contentType.id,
      };
      this.$store
        .dispatch("dataIntegration/getAlgorithmOptions", payload)
        .then((resData) => {
          this.algorithmOptions = resData;
        })
        .catch(() => {
          // noop
        });
    },

    // tab点击事件
    handleConfigTabClick() {
      this.curRule = this.rule.ruleList.find((item) => {
        return item.label === this.tabActiveName;
      });
    },

    getPeriodOptions,

    modifyRuleStatus(row) {
      const payload = {
        id: row.id,
        status: row.statusData.value,
      };

      this.$store
        .dispatch("dataIntegration/modifyRuleStatus", payload)
        .then(() => {
          this.$message({
            type: "success",
            message: "修改成功!",
            duration: 3000,
          });
        })
        .catch(() => {
          // noop
        })
        .finally(() => {
          // noop
        });
    },
    handleConfigBtnClick() {
      this.isEdit = false;
      this.curRow = null;
      this.isShowConfigDialog = true;

      const payload = {
        project_id: this.$store.getters.appId,
        channelId: this.channel.id,
        contentTypeId: this.contentType.id,
        id: 0, // url内部参数 接口特别规定 新增时获取配置数据指定id为0
      };

      this.loadingRuleConfig = true;
      this.$store
        .dispatch("dataIntegration/getRuleConfig", payload)
        .then((resData) => {
          this.rule = resData;
          const ruleList = this.rule.ruleList;

          ruleList.forEach((ruleItem) => {
            ruleItem.configs.isParamsVisible = false;

            if (Array.isArray(ruleItem.configs.params)) {
              const isParamsVisible = ruleItem.configs.params.some((item) => {
                return typeof item.visible === "undefined" || item.visible;
              });
              ruleItem.configs.isParamsVisible = isParamsVisible;
            }
          });

          // 设置默认显示值
          const hasRulelist =
            Array.isArray(this.rule.ruleList) && this.rule.ruleList.length > 0;
          if (hasRulelist) {
            this.curRule = this.rule.ruleList[0];
            this.tabActiveName = this.curRule.label;
          }
        })
        .catch(() => {
          // noop
        })
        .finally(() => {
          this.loadingRuleConfig = false;
        });
    },

    handleSubmit() {
      this.isSubmitting = true;
      const payload = {
        project_id: this.rule.project_id,
        channelId: this.rule.channelId,
        contentTypeId: this.rule.contentTypeId,
        contentType: this.rule.contentType,
        logo: this.rule.logo,
        id: this.rule.id || null,

        rule: this.curRule,
      };

      if (this.isEdit) {
        this.$store
          .dispatch("dataIntegration/updateRuleConfig", payload)
          .then(() => {
            this.$message({
              message: "保存成功!",
              type: "success",
            });
            this.isShowConfigDialog = false;

            this.pager.curPage = 1;
            this.getTableData();
          })
          .catch(() => {
            // noop
          })
          .finally(() => {
            this.isSubmitting = false;
          });
      } else {
        this.$store
          .dispatch("dataIntegration/saveRuleConfig", payload)
          .then(() => {
            this.$message({
              message: "保存成功!",
              type: "success",
            });
            this.isShowConfigDialog = false;
            this.getTableData();
          })
          .catch(() => {
            // noop
          })
          .finally(() => {
            this.isSubmitting = false;
          });
      }
    },

    handleConfigOpen() {},

    handleBack() {
      this.$emit("back");
    },

    preDealContent(header, content) {
      const contentDict = {
        stoped: "已停用",
        processing: "审核中",
        done: "已配置",
      };

      const periodDict = {
        week: "每周",
        day: "每天",
        hour: "每小时",
        minute: "每分钟",
      };

      if (header.prop === "status") {
        return contentDict[content];
      }

      if (header.prop === "etlPeriod") {
        return periodDict[content];
      }
      return content || "-";
    },

    handleGetTableData(data) {
      this.filter = data.filter;
      this.pager = data.pager;

      this.getTableData();
    },

    getTableData() {
      this.loading = true;
      const payload = {
        pageSize: this.pager.pageSize,
        curPage: this.pager.curPage,
        project_id: this.$store.getters.appId,
        channelId: this.channel.id,
        contentTypeId: this.contentType.id,
      };
      this.$store
        .dispatch("dataIntegration/getRulesTableData", payload)
        .then((resData) => {
          this.source = resData.list.map((item) => {
            item.statusData = statusOptions.find((optionItem) => {
              return optionItem.value === item.status;
            });

            // 算法字段显示内容
            item.hasAlgorithm = item.hasAlgorithm ? "有" : "无";
            return item;
          });

          this.pager = { ...this.pager, total: resData.pager.total };
        })
        .catch(() => {
          // noop
        })
        .finally(() => {
          this.loading = false;
        });
      // api
    },

    // 修改
    handleModify(row) {
      // open dialog
      this.curRow = row;
      this.isEdit = true;

      this.rule = this.$options.data().rule;
      this.isShowConfigDialog = true;
      this.loadingRuleConfig = true;

      const payload = {
        project_id: this.$store.getters.appId,
        channelId: this.channel.id,
        contentTypeId: this.contentType.id,
        id: row.id || null,
      };
      this.$store
        .dispatch("dataIntegration/getRuleConfig", payload)
        .then((resData) => {
          this.rule = resData;
        })
        .catch(() => {
          // noop
        })
        .finally(() => {
          this.loadingRuleConfig = false;
        });
    },

    // 删除
    handleDelete(row) {
      this.$confirm("确定要删除吗?", "提示")
        .then(() => {
          this.$set(row, "delete", true);
          // api
          const payload = {
            project_id: this.$store.getters.appId,
            channelId: this.channel.id,
            id: row.id,
          };
          this.$store
            .dispatch("dataIntegration/deleteRuleConfig", payload)
            .then(() => {
              this.$message({
                message: "删除成功!",
                type: "success",
              });
              this.getTableData();
            })
            .catch(() => {
              // noop
            })
            .finally(() => {
              this.$set(row, "delete", false);
            });
        })
        .catch(() => {
          // noop
        });
    },
  },
  created() {
    this.getTableData();
    // this.getAlgorithmOptions();
  },
};
</script>
<style lang="scss" scoped>
@import "@/styles/index.scss";
.config-container {
  .top-section {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 15px;

    .title {
      font-size: 14px;
      color: $color-text;

      .pre-title {
        cursor: pointer;
      }

      .after-title {
        font-weight: bold;
      }
    }

    .btn-container {
      margin-right: 20px;
    }
  }

  .table-container {
    padding: 10px;
  }
}

.config-dialog {
  ::v-deep(.el-dialog__body) {
    padding-top: 0;
  }

  .btns-container {
    text-align: right;
    padding-right: 20px;
  }

  .top-section {
    .left {
      .content-type-tag {
        padding: 3px 5px;
        font-size: 12px;
        border-radius: 3px;
        background-color: #c4e6fd;
        color: $color-text;
      }

      .content-type-text {
        font-weight: bold;
        font-size: 14px;
        margin-top: 5px;
      }
    }

    .logo-section {
      width: 120px;
      height: 40px;
      margin-right: 40px;
      background-size: contain;
      background-repeat: no-repeat;
      background-position: right center;

      img {
        width: 100%;
        height: auto;
      }
    }
  }

  .bottom-section {
    min-height: 300px;

    .galler-container {
      border-bottom: 1px solid $color-border;
      padding: 0 0 15px 10px;

      .title {
        color: $color-text;
        font-size: 15px;
        font-weight: bold;
        margin-right: 10px;
      }
    }

    .content-section {
      padding: 20px 0;

      .config-item {
        display: flex;
        justify-content: flex-start;
        align-items: flex-start;
        margin-bottom: 20px;

        .comment-textarea {
          width: 260px;
        }

        .comment-text {
          color: $color-light-text;
          width: 270px;
        }

        .title {
          color: $color-primary;
          // color: #ccc; //$color-disabled;
          margin-right: 20px;
          // font-weight: bold;
          width: 80px;
          flex-shrink: 0;
        }

        .input-select {
          width: 260px;
        }

        .params-container {
          .param-item-container {
            display: flex;
            justify-content: flex-start;
            align-items: flex-start;
            margin-bottom: 10px;

            &:first-child {
              padding-top: 2px;
            }

            .string-input-item {
              width: 180px;
            }

            .number-input-item {
              width: 180px;
            }

            .param-label {
              display: inline-block;
              width: 75px;
              font-size: 12px;
              padding-right: 5px;
            }
          }
        }
      }
    }
  }
}
</style>
