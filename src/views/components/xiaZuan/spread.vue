<template>
  <div class="spread-block">
    <div class="bottom-content-top">
      <div class="chart-container">
        <div class="top">
          <div class="title-wrapper">
            <span class="title-text">传播路径</span>
            <el-tooltip
              content="以转发为互动行为进行连接，构建各个用户之间的传播网络。"
              effect="light"
              placement="top-start"
            >
              <i class="el-icon-info"></i>
            </el-tooltip>
          </div>
          <div class="count-num-wrapper">
            <span class="count-wrapper">
              <span>曝光量 : </span
              ><span>{{
                typeof viewCount === "number"
                  ? numeral(viewCount).format("0,00")
                  : "-"
              }}</span>
            </span>
            <span class="count-wrapper">
              <span>内容量 : </span
              ><span>{{
                typeof contentCount === "number"
                  ? numeral(contentCount).format("0,00")
                  : "-"
              }}</span>
            </span>
          </div>
        </div>

        <div
          class="spread-chart-container"
          :style="{ height: chartHeight + 'px' }"
          v-loading="loadingChart"
        >
          <template v-if="chartData.nodes.length > 0">
            <spread-chart
              :height="chartHeight"
              :chartData="chartData"
              @click="handleClickSpread"
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
              content="以扩散度为排序依据，top的用户为传播的意见领袖，可选择其数量。"
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
                <el-option :key="index" :label="item" :value="item"></el-option>
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
          <dynamic-table
            border
            :height="tableHeight"
            :dimension="dimension"
            :source="tableData"
            :loading="isLoadingTableData"
            :hasPagination="false"
            @toggle-row-expand="handleRowExpand"
          >
            <template v-slot:expand="{ row }">
              <template v-if="row.isLoadingInfo">
                <div class="info-container">
                  <i class="el-icon-loading"></i>
                </div>
              </template>
              <template v-else-if="row.info">
                <div class="content-container">
                  {{ JSON.stringify(row.info, null, 5) }}
                </div>
              </template>
              <template v-else>
                <div class="info-container">
                  <span>暂无数据</span>
                </div>
              </template>
            </template>
          </dynamic-table>
        </div>
      </div>
    </div>
    <template v-if="isTimeLineVisible">
      <div class="bottom-content-bottom">
        <div class="time-line-title-container">
          <span>
            <span class="time-line-title">意见领袖传播轴 </span>
            <el-tooltip
              content="意见领袖们发布内容的时间线。"
              effect="light"
              placement="top-start"
            >
              <i class="el-icon-info"></i>
            </el-tooltip>
          </span>

          <span class="time-line-detail" @click="handleViewTimeLineDetail">
            详细时间轴 &gt;
          </span>
        </div>
        <div class="time-line-container">
          <!-- <time-line :timeLine="timeLineData"></time-line> -->
          <bar-chart-simple
            :chartData="timeLineData"
            :hasXAxis="false"
            :height="150"
          ></bar-chart-simple>
        </div>
      </div>
    </template>

    <el-dialog
      class="time-line-dialog"
      title="意见领袖传播轴"
      :visible.sync="timelineDialogVisible"
      @open="handleOpen"
      @close="handleClose"
      width="950px"
    >
      <div v-loading="isLoadingList" style="min-height: 500px">
        <template v-if="list.length === 0">
          <div class="no-timeline-list-data">暂无数据</div>
        </template>
        <template v-else>
          <virtual-list
            :listData="list"
            :viewportWidth="900"
            :viewportHeight="500"
            :listItemHeight="60"
            :onReachBottom="handleReachBottom"
          >
            <template v-slot:default="scope">
              <div class="container">
                <template v-if="scope.data.item.position === 'right'">
                  <div class="list-item-container">
                    <div class="inner">
                      <div class="list-icon"></div>
                      <div class="list-content">
                        <div class="content-section">
                          <el-popover
                            placement="top-start"
                            title=""
                            width="300"
                            trigger="hover"
                            :content="`${scope.data.item.username}
                      ${scope.data.item.type}
                      : ${scope.data.item.content}
                      `"
                          >
                            <span slot="reference">
                              <span style="font-weight: bold">{{
                                scope.data.item.username
                              }}</span>
                              {{ scope.data.item.type }} :
                              {{ scope.data.item.content }}
                            </span>
                          </el-popover>
                        </div>
                        <div class="datetime-comment">
                          ( {{ scope.data.item.dateTime }}&nbsp;&nbsp; 转:<span
                            class="number"
                            >{{ scope.data.item.repost }}</span
                          >
                          评:<span class="number"
                            >{{ scope.data.item.comment }}
                          </span>
                          赞:<span class="number">{{
                            scope.data.item.favor
                          }}</span>
                          )
                        </div>
                      </div>
                    </div>
                  </div>
                </template>
                <template v-else>
                  <div class="list-item-container-left">
                    <div class="inner">
                      <div class="list-icon"></div>
                      <div class="list-content">
                        <div class="content-section">
                          <el-popover
                            placement="top-start"
                            title=""
                            width="300"
                            trigger="hover"
                            :content="`${scope.data.item.username}
                      ${scope.data.item.type}
                      : ${scope.data.item.content}
                      `"
                          >
                            <span slot="reference">
                              <span style="font-weight: bold">
                                {{ scope.data.item.username }}</span
                              >
                              {{ scope.data.item.type }} :
                              {{ scope.data.item.content }}</span
                            >
                          </el-popover>
                        </div>
                        <div class="datetime-comment">
                          ( {{ scope.data.item.dateTime }}&nbsp;&nbsp; 转:
                          <span class="number">{{
                            scope.data.item.repost
                          }}</span>
                          评:<span class="number">{{
                            scope.data.item.comment
                          }}</span>
                          赞:<span class="number"
                            >{{ scope.data.item.favor }}
                          </span>
                          )
                        </div>
                      </div>
                    </div>
                  </div>
                </template>
              </div>
            </template>
          </virtual-list>
        </template>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import numeral from "numeral";
import { leaderCountOptions } from "@/views/opinionAnalysis/spread/data.js";
import { getSpreadTableDimension } from "@/views/opinionAnalysis/kol/data.js";
import barChartSimple from "@/views/components/charts/barChartSimple.vue";
import spreadChart from "@/views/components/charts/spreadChart.vue";
import dynamicTable from "@/views/components/dynamicTable";
import virtualList from "@/views/components/virtualList";

export default {
  props: {
    datas: {
      type: Object,
      default() {
        return {};
      },
    },

    tableApiAction: {
      type: String,
      default: "",
    },

    chartApiAction: {
      type: String,
      default: "",
    },

    isTimeLineVisible: {
      type: Boolean,
      default: true,
    },

    tableHeight: {
      type: Number,
      default: 350,
    },
    chartHeight: {
      type: Number,
      default: 350,
    },
  },

  components: {
    barChartSimple,
    spreadChart,
    dynamicTable,
    virtualList,
  },
  data() {
    return {
      count: 0, // 所有原创内容数量
      viewCount: 0,
      contentCount: 0,
      tableMaxHeight: 430,
      loadingChart: false,
      chartData: {
        nodes: [],
        links: [],
        categories: [],
      },
      leaderCount: 10,
      leaderCountOptions,

      isLoadingTableData: false,
      dimension: [],
      tableData: [],

      // 时间轴数据
      timeLineData: {
        source: [],
        dimensions: [],
      },

      timelineDialogVisible: false,
      isLoadingList: false,
      list: [],
      listPager: { curPage: 0, pageSize: 10 },
    };
  },
  methods: {
    // 时间轴弹窗滚动触底事件
    handleReachBottom(cb) {
      this.listPager.curPage++;
      const payload = {
        leader_count: this.leaderCount,
        ...this.listPager,
        ...this.datas,
        project_id: this.$store.getters.appId,
      };

      // const action = this.tableApiAction;

      this.$store
        .dispatch("spread/getTimeLineMore", payload)
        .then((resData) => {
          if (resData.length > 0) {
            resData = resData.map((item) => {
              item.position = item.type === "转发" ? "left" : "right";
              return item;
            });

            cb(resData);
          } else {
            cb(false);
          }
        })
        .catch(() => {
          // noop
        });
    },

    handleOpen() {
      this.isLoadingList = true;
      this.listPager.curPage = 0;
      this.handleReachBottom((data) => {
        this.list = data || [];
        this.isLoadingList = false;
      });
    },

    handleClose() {
      this.list = [];
    },

    handleViewTimeLineDetail() {
      this.timelineDialogVisible = true;
    },
    /// api
    handleRowExpand({ expanded, row }) {
      if (expanded && !row.info) {
        this.$set(row, "isLoadingInfo", true);

        this.$store
          .dispatch("spread/getUserCommentInfo", {
            project_id: this.$store.getters.appId,
            id: row.user_id,
            time: this.datas.time,
          })
          .then((res) => {
            this.$set(row, "info", res);
          })
          .catch(() => {
            //
          })
          .finally(() => {
            this.$set(row, "isLoadingInfo", false);
          });
      }
    },
    handleClickSpread(item) {
      const link = item.data?.link;
      if (link) {
        window.open(link);
      }
    },
    numeral,
    handleLeaderCountChange() {
      this.getTableData();
    },

    getParams() {
      return {
        leader_count: this.leaderCount,
        ...this.datas,
      };
    },

    getChartData() {
      const payload = {
        ...this.datas,
      };
      this.loadingChart = true;
      this.$store
        .dispatch("kol/getXiaZuanSpreadChart", payload)
        .then((res) => {
          this.chartData = res.chartData;
        })
        .catch(() => {
          // noop
        })
        .finally(() => {
          this.loadingChart = false;
        });
    },

    getTableData() {
      this.$options.data().timeLineData;
      this.tableData = [];
      this.isLoadingTableData = true;

      let payload = {
        leader_count: this.leaderCount,
        ...this.datas,
      };

      this.$store
        .dispatch("kol/getXiaZuanSpreadTable", payload)
        .then((data) => {
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
        const data = {
          ...this.datas,
        };
        this.$emit("event", { action: "viewDetail", data });
      }
    },
  },
  created() {
    this.dimension = getSpreadTableDimension();
    this.getTableData();
    this.getChartData();
  },
};
</script>
<style lang="scss" scoped>
@import "@/styles/index.scss";

.spread-block {
  // padding: 20px;
  background: #fff;
  height: 100%;
  position: relative;
  overflow-y: hidden;

  .bottom-content-top {
    width: 100%;
    height: calc(100% - 186px);
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    overflow-x: auto;
    overflow-y: hidden;

    .chart-container {
      flex: 1 1 auto;
      padding: 0 10px;
      color: $color-text;
      width: 400px;
      margin-right: 10px;
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
    }
    .time-line-title-container {
      display: flex;
      justify-content: space-between;
      align-items: center;

      .time-line-title {
        padding-left: 20px;
        color: $color-text;
      }

      .time-line-detail {
        font-size: 14px;
        color: $color-text;
        margin-right: 15px;
        cursor: pointer;

        &:hover {
          text-decoration: underline;
        }
      }
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
}
.container {
  // width: 820px;
  border: 0px solid #ccc;

  .username-and-type {
    vertical-align: middle;
  }

  .content-section {
    display: inline-block;
    width: 260px;
    text-overflow: ellipsis;
    white-space: nowrap;
    overflow: hidden;
    vertical-align: middle;
  }

  .list-item-container {
    text-align: right;

    .inner {
      width: calc(50% + 1px);
      box-sizing: border-box;
      display: inline-block;
      position: relative;
      border-left: 1px solid #ccc;
      padding-left: 10px;
      height: 60px;
      text-align: left;

      .list-icon {
        position: absolute;
        left: 0;
        top: 0;
        transform: translate(-50%, 0);
        width: 10px;
        height: 10px;
        border: 2px solid rgb(0, 162, 255);
        background-color: #fff;
        border-radius: 5px;
      }

      .list-content {
        font-size: 12px;
        margin-top: -3px;

        .datetime-comment {
          margin-top: 5px;

          .number {
            font-weight: bold;
          }
        }
      }
    }
  }

  .list-item-container-left {
    text-align: left;
    .inner {
      box-sizing: border-box;
      width: 50%;
      display: inline-block;
      position: relative;
      border-right: 1px solid #ccc;
      padding-right: 10px;
      height: 60px;
      text-align: right;

      .list-icon {
        position: absolute;
        right: 0;
        top: 0;
        transform: translate(50%, 0);
        width: 10px;
        height: 10px;
        border: 2px solid rgb(0, 162, 255);
        background-color: #fff;
        border-radius: 5px;
      }

      .list-content {
        font-size: 12px;
        margin-top: -3px;

        .datetime-comment {
          margin-top: 5px;

          .number {
            font-weight: bold;
          }
        }
      }
    }
  }
}
</style>
