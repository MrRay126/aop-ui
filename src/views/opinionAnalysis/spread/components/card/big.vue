<template>
  <!-- 传播分析大卡 -->
  <div class="spread-big-card" ref="container">
    <template v-if="!isViewXiaZuan">
      <template v-if="isViewInfos">
        <div class="bottom-container">
          <div class="bottom-content-top" ref="contentTop">
            <div class="chart-container">
              <div class="top">
                <div class="title-wrapper">
                  <span class="title-text">传播路径</span>
                  <el-tooltip
                    content="以转发行为为连接关系，构建事件中，观点在各个用户间的传播关系。"
                    effect="light"
                    placement="top-start"
                  >
                    <i class="el-icon-info"></i>
                  </el-tooltip>
                </div>
                <div class="count-num-wrapper">
                  <span class="count-wrapper">
                    <span>曝光量 : </span><span>{{ cardData.viewCount }}</span>
                  </span>
                  <span class="count-wrapper">
                    <span>内容量 : </span
                    ><span>{{ cardData.contentCount }}</span>
                  </span>
                </div>
              </div>
              <div
                class="spread-chart-container"
                :style="{ height: tableMaxHeight + 'px' }"
              >
                <template
                  v-if="cardData && cardData.chartData.nodes.length > 0"
                >
                  <spread-chart
                    :height="tableMaxHeight"
                    :chartData="cardData.chartData"
                  ></spread-chart>
                </template>
                <template v-else>
                  <span class="no-data">暂无数据</span>
                </template>
              </div>
            </div>
            <!-- 评价词表 -->
            <div class="table-container">
              <div class="top">
                <div class="title-wrapper">
                  <el-tooltip
                    content="以扩散度为排序依据，对事件有较高扩散影响的用户为事件的意见领袖。"
                    effect="light"
                    placement="top-start"
                  >
                    <i class="el-icon-info"></i>
                  </el-tooltip>
                  <span class="title"> 意见领袖数量:</span>
                  <el-select
                    v-model="leaderCount"
                    @change="handleLeaderCountChange"
                    size="mini"
                    class="counter"
                    style="width: 60px"
                  >
                    <template v-for="(item, index) in leaderCountOptions">
                      <el-option
                        :key="index"
                        :label="item"
                        :value="item"
                      ></el-option>
                    </template>
                  </el-select>
                </div>

                <div class="jump-title">
                  <span @click="handleViewMore" class="view-more">
                    <span>所有原创内容</span>
                    <span style="font-weight: bold">
                      {{ count }}
                    </span>
                    <span>条</span>
                    <i class="el-icon-arrow-right" style="font-size: 12px"></i>
                  </span>
                </div>
              </div>
              <div class="table-wrapper">
                <!-- <el-table
                :data="tableData"
                border
                row-class-name="table-row"
                :max-height="tableMaxHeight"
                v-loading="isLoadingTableData"
                ref="dispositionTable"
                :highlight-current-row="true"
              >
                <el-table-column prop="user" label="用户"> </el-table-column>
                <el-table-column prop="focus_num" label="关注度">
                </el-table-column>
                <el-table-column prop="active_num" label="活跃度">
                </el-table-column>
                <el-table-column prop="spread_num" label="扩散度">
                </el-table-column>
                <el-table-column prop="content_count" label="内容量">
                </el-table-column>
                <el-table-column prop="effect_num" label="影响度">
                </el-table-column>
                <el-table-column prop="center_num" label="中心度">
                </el-table-column>
              </el-table> -->

                <dynamic-table
                  border
                  :height="tableMaxHeight"
                  :dimension="dimension"
                  :source="tableData"
                  :loading="isLoadingTableData"
                ></dynamic-table>
              </div>
            </div>
          </div>
          <div class="bottom-content-bottom">
            <div>
              <span class="time-line-title">意见领袖传播轴 </span>
              <el-tooltip
                content="意见领袖们发布内容的时间线。"
                effect="light"
                placement="top-start"
              >
                <i class="el-icon-info"></i>
              </el-tooltip>
            </div>
            <div class="time-line-container">
              <!-- <time-line :timeLine="timeLineData"></time-line> -->
              <bar-chart-simple
                :chartData="timeLineData"
                :hasXAxis="false"
                :height="130"
              ></bar-chart-simple>
            </div>
          </div>
        </div>
      </template>
      <template v-else>
        <!-- 数据详情 -->
        <div class="more-contents-table-container">
          <div class="top-path">
            <span class="path-pre" @click="handleBackToInfoTables"
              >传播分析</span
            >
            <span>/</span>
            <span> 相关原创内容 </span>
            <span>( </span>
            <span>分析时段 </span>
            <span
              >{{ cardConfigs.time.start.split(" ")[0] }} ~
              {{ cardConfigs.time.end.split(" ")[0] }}</span
            >
            <span> )</span>
          </div>

          <div class="detail-table-container">
            <detail-table
              ref="detailTable"
              :configs="{
                project_id: $store.getters.appId,
                ...cardConfigs,
              }"
              apiAction="spread/getSpreadDetail"
              @event="handleDetailTableEvent"
            >
            </detail-table>
          </div>
        </div>
      </template>
    </template>
    <template v-else>
      <div class="xia-zuan-info">
        <div style="padding-left: 10px">
          <el-button @click="handleXiaZuanReturn" type="text">
            &lt;返回
          </el-button>
        </div>
        <xia-zuan-info
          ref="xiaZuanInfo"
          :viewConfigs="{
            wordChartHeight: 400,
            wordTableHeight: 400,
            spreadChartHeight: 400,
            spreadTableHeight: 400,
            isTimeLineVisible: false,
          }"
          :datas="{
            ...cardConfigs,
            row: xiaZuanRow,
            project_id: $store.getters.appId,
          }"
        ></xia-zuan-info>
      </div>
    </template>
  </div>
</template>
<script>
import spreadChart from "@/views/components/charts/spreadChart.vue";
// import timeLine from "../timeLine";
import detailTable from "@/views/components/anylysisDetailTable";
import { OpinionType } from "@/views/dashbord/data";
import { leaderCountOptions } from "../../data.js";
import { bigCardMixin } from "@/views/mixins/card.js";
import dynamicTable from "@/views/components/dynamicTable";
import barChartSimple from "@/views/components/charts/barChartSimple.vue";
import xiaZuanInfo from "@/views/components/xiaZuan/info.vue";

export default {
  components: {
    spreadChart,
    // timeLine,
    detailTable,
    dynamicTable,
    barChartSimple,
    xiaZuanInfo,
  },

  mixins: [bigCardMixin],

  props: {
    //卡片显示使用的数据
    cardData: {
      type: Object,
      default() {
        return {
          chartData: {
            nodes: [],
            links: [],
            categories: [],
          },
        };
      },
    },

    //卡片的配置信息
    cardConfigs: {
      type: Object,
      default() {
        return {
          filter: {},
          leader_count: 10,
        };
      },
    },
  },

  watch: {
    cardConfigs: {
      immediate: true,
      handler(val) {
        if (val) {
          this.leaderCount = val.leader_count;
          this.getTableData();
        }
      },
    },
  },

  data() {
    return {
      isViewXiaZuan: false,
      xiaZuanRow: {},

      viewCount: 0,
      contentCount: 0,
      count: 0, // 所有原创内容数量
      leaderCount: 10,

      dimension: [
        {
          label: "用户",
          prop: "user",
          minWidth: "100px",
          // hasTooltip: true, //是否使用toolTip
        },
        {
          label: "关注度",
          prop: "focus_num",
          minWidth: "80px",
          // hasTooltip: true,
        },
        {
          label: "活跃度",
          prop: "active_num",
          minWidth: "80px",
          actionType: "info",
          tip: "相关帖子发布数",
          // hasTooltip: true,
        },
        {
          label: "扩散度",
          prop: "spread_num",
          actionType: "info",
          tip: "获得的总转发数",
          minWidth: "80px",
          // hasTooltip: true,
        },
        {
          label: "内容量",
          prop: "content_count",
          minWidth: "80px",
          // hasTooltip: true,
        },
        {
          label: "影响度",
          prop: "effect_num",
          actionType: "info",
          tip: "获得的总点赞数",
          minWidth: "80px",
          // hasTooltip: true,
        },
        {
          label: "讨论度",
          prop: "comments_count",
          // actionType: "info",
          // tip: "用户在传播中的中心程度",
          minWidth: "80px",
          // hasTooltip: true,
        },
      ],
      tableData: [],

      chartData: {
        nodes: [],
        links: [],
        categories: [],
      },

      // 时间轴数据
      timeLineData: {
        source: [],
        dimensions: [],
      },
      // 标识当前报表是否已经计算过(计算过的没问题 可以更新 另存等操作)
      alreadyCalculated: false,
      OpinionType,
      leaderCountOptions,
      tableMaxHeight: 370,
      isViewInfos: true,
      isLoadingTableData: false,
      isLoadingDetailTable: false,
      hasData: true,
    };
  },
  methods: {
    handleXiaZuanReturn() {
      this.isViewXiaZuan = false;
    },

    handleDetailTableEvent({ action, data }) {
      if (action === "xiaZuan") {
        this.isViewXiaZuan = true;
        this.xiaZuanRow = data;
      }
    },

    setIfViewInfos(data) {
      this.isViewInfos = data;
      this.$emit("action", { action: "changeViewPart", data, cb: () => {} });
    },
    getCommonParams() {
      let payload = {
        project_id: this.$store.getters.appId,
        ...this.cardConfigs,
      };
      return payload;
    },

    handleLeaderCountChange() {
      this.getTableData();
    },

    getTableData() {
      this.isLoadingTableData = true;

      let payload = {
        ...this.getCommonParams(),
        leader_count: this.leaderCount,
      };

      this.$store
        .dispatch("spread/getSpreadTable", payload)
        .then((data) => {
          //评价词
          this.tableData = data.results;
          this.count = data.all_content_count;
          this.timeLineData = data.timeLineData.chart;
        })
        .catch(() => {
          //noop
        })
        .finally(() => {
          this.isLoadingTableData = false;
        });
    },

    handleViewMore() {
      if (this.count > 0) {
        // this.isViewInfos = false;
        this.setIfViewInfos(false);
      }
    },

    handleBackToInfoTables() {
      // this.isViewInfos = true;
      this.setIfViewInfos(true);
    },
  },
};
</script>
<style lang="scss" scoped>
@import "@/styles/index.scss";

.spread-big-card {
  width: 100%;
  height: 100%;
  background: #fff;
  overflow: auto;
  overflow-y: hidden;

  .xia-zuan-info {
    width: 100%;
    height: 100%;

    ::v-deep {
      .info {
        background-color: #fff;
        height: calc(100% - 10px);
        padding-top: 0;

        .page {
          background-color: #fff;

          .right {
            margin-top: 0;
          }

          .left {
            padding-top: 0;

            .title {
              margin-top: 0;
            }
          }
        }

        .top-tools {
          padding: 0 0 8px 20px;
        }
      }
      .more-contents-table-container {
        padding: 0;
      }

      .top-path {
        padding-top: 8px;
      }

      .btns-container {
        display: none;
      }

      .cloud-chart {
        min-height: initial;
      }

      .bottom-content-top {
        height: calc(100% - 10px);
      }
    }
  }

  .bottom-container {
    height: 100%;
  }

  .top-tools {
    display: flex;
    justify-content: flex-start;
    align-items: center;
    padding: 20px;
  }

  .bottom-content-top {
    width: 100%;
    height: calc(100% - 170px);
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    overflow-x: auto;
    overflow-y: hidden;

    .chart-container {
      flex: 1 1 auto;
      // padding: 0 10px;
      color: $color-text;
      width: 380px;
      margin: 0 10px;
      overflow: hidden;

      .top {
        display: flex;
        align-items: center;
        justify-content: space-between;
        color: $color-text;
        padding: 10px;
        height: 48px;

        .title-wrapper {
          font-size: 16px;

          .title-text {
            margin-right: 5px;
          }
        }

        .count-num-wrapper {
          font-size: 12px;

          .count-wrapper {
            margin-left: 10px;
          }
        }
      }

      .spread-chart-container {
        width: 100%;
        border: 1px solid #ebeef5;
        position: relative;

        .no-data {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          font-size: 14px;
          color: $color-text;
        }
      }

      .title {
        height: 40px;
        font-size: 14px;

        .view-word-name {
          padding: 0 3px;
        }
      }
    }

    .table-container {
      flex: 1 1 auto;
      width: 300px;
      height: 100%;
      padding: 0 10px;

      .view-more {
        &:hover {
          color: $color-primary;
        }
        cursor: pointer;
      }

      .top {
        display: flex;
        justify-content: space-between;
        align-items: flex-start;
        height: 48px;
        min-width: 390px;
        color: $color-text;
        padding: 11px;

        .title {
          margin-right: 5px;
          font-size: 16px;
          // vertical-align: middle;
        }

        .el-icon-info {
          // vertical-align: middle;
        }

        .jump-title {
          font-size: 14px;
        }

        .counter {
          width: 100px;
          margin-left: 20px;
        }
      }
    }
  }

  .bottom-content-bottom {
    width: 100%;
    padding-top: 10px;

    .time-line-container {
      width: 100%;
      height: 150px;
      overflow: auto;
      padding: 0 10px;
    }

    .time-line-title {
      padding-left: 20px;
      color: $color-text;
    }
  }
  .empty-element {
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -70%);
  }

  .stepper-wrapper {
    position: absolute;
    top: 40%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 50%;
    min-width: 300px;
    flex: 0 0 auto;
  }

  .color-red {
    color: red;
  }

  .color-green {
    color: #52c51d;
  }

  .more-contents-table-container {
    height: 100%;
    width: 100%;
    padding: 15px;

    .top-path {
      text-align: left;
      padding-bottom: 10px;
      padding-left: 10px;
      padding-top: 20px;
      font-size: 14px;
      color: $title-text-color;

      .path-pre {
        color: $color-desc;
        cursor: pointer;
      }
    }

    .detail-table-container {
      height: calc(100% - 50px);
    }
  }
}
</style>
