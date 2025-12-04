<template>
  <div class="trend">
    <div class="right-section">
      <div class="bottom-container">
        <div class="chart-container">
          <div class="chart-section" v-loading="isLoadingChart">
            <template v-if="trendData.chartData.source.length === 0">
              <span class="no-data-text">暂无数据</span>
            </template>
            <line-chart
              ref="trendLineChart"
              :height="chartHeight"
              :chartData="trendData.chartData"
              :hotModeOpened="false"
              :hasLegend="true"
            ></line-chart>
          </div>
        </div>
        <div class="table-container">
          <div class="top">
            <el-input
              v-model="searchText"
              @input="handleSearchChange"
              :clearable="true"
              class="filter-input"
              size="mini"
              placeholder="筛选分组项"
            >
              <template slot="append">
                <i class="el-icon-search" @click="getTableData"></i>
              </template>
            </el-input>
          </div>
          <dynamic-table
            :height="tableHeight"
            :dimension="trendData.table.dimension"
            :source="trendData.table.source"
            :filter="trendData.table.filter"
            :filterOptions="trendData.table.filterOptions"
            :pager="trendData.table.pager"
            :loading="isLoadingTable"
            sortMode="single"
            @getTableData="handleGetTableData"
            @rowClick="handleRowClick"
          ></dynamic-table>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
//时间单位组件
import lineChart from "@/views/components/charts/trendLineChart.vue";
import dynamicTable from "@/views/components/dynamicTable";

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

    tableHeight: {
      type: Number,
      default: 500,
    },

    chartHeight: {
      type: Number,
      default: 450,
    },
  },
  components: {
    lineChart,
    dynamicTable,
  },

  data() {
    return {
      searchText: "",

      trendData: {
        chartData: {
          dimension: [
            // "time", "武器-内容量", "角色-内容量"
          ],
          source: [
            // {
            //   time: "2022-12-28T12:30:20",
            //   "武器-内容量": 43.3,
            //   "角色-内容量": 85.8,
            // },
          ],
        },

        table: {
          dimension: [],
          source: [],
          pager: {
            curPage: 1,
            pageSize: 10,
            total: 0,
          },
          search: "",
          filter: {},
          filterOptions: {},
        },
      },

      trendFilter: {
        time: "",
      },

      isLoadingTable: false,
      isLoadingChart: false,
    };
  },

  methods: {
    _getDownloadConfigs() {
      const table = this.trendData.table;
      return {
        configs: {
          ...this.datas,
          search: this.searchText,
          pager: table.pager,
          tableFilter: table.filter,
        },
      };
    },

    handleSearchChange() {
      clearTimeout(this.timer);
      this.timer = setTimeout(() => {
        this.getTableData();
      }, 300);
    },

    handleGetTableData(data) {
      const table = this.trendData.table;
      table.pager = data.pager;
      table.filter = data.filter;
      this.getTableData();
    },

    getParams() {
      const table = this.trendData.table;
      return {
        ...this.datas,
        search: this.searchText,
        pager: table.pager,
        tableFilter: table.filter,
      };
    },

    getTableData() {
      const table = this.trendData.table;

      const payload = {
        ...this.datas,
        search: this.searchText,
        pager: table.pager,
        tableFilter: table.filter,
      };

      this.isLoadingTable = true;

      this.trendData.table = this.$options.data().trendData.table;
      this.$store
        .dispatch(this.tableApiAction, payload)
        .then((res) => {
          const table = this.trendData.table;
          for (let prop in table) {
            table[prop] = res[prop];
          }
          table.filter = res.filter;

          table.demension = table.dimension.map((dItem) => {
            if (table.dimension.length < 20) {
              dItem.minWidth = "135px";
            } else {
              dItem.width = "135px";
            }
            return dItem;
          });
        })
        .catch(() => {
          // noop
        })
        .finally(() => {
          this.isLoadingTable = false;
        });
    },

    handleRowClick(data) {
      const { row, header } = data;
      const prop = header.prop;

      if (header.contentType === "data") {
        if (!row[prop]) {
          return;
        }

        // 编辑数据中的trend_filter,并回传
        const data = {
          detailRow: row,
          detailHeader: header,
        };

        this.$emit("event", { action: "viewDetail", data });
      }
    },

    getChartData() {
      const payload = {
        ...this.datas,
      };
      this.isLoadingChart = true;
      this.$store
        .dispatch(this.chartApiAction, payload)
        .then((data) => {
          this.trendData.chartData = data.chartData;
        })
        .catch(() => {
          // noop
        })
        .finally(() => {
          this.isLoadingChart = false;
        });
    },
  },

  created() {
    // 初始化
    this.getChartData();
    this.getTableData();
  },
};
</script>

<style lang="scss" scoped>
@import "@/styles/index.scss";

.btn-container {
  padding: 10px;
  text-align: right;
}

.trend {
  height: 100%;
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
  background: transparent;

  .more-contents-table-container {
    height: 100%;
    width: 100%;
    padding: 15px;

    ::v-deep(.more-contents-table-row) {
      cursor: pointer;
    }

    .detail-table-container {
      height: calc(100% - 50px);
    }

    .pagination-container {
      margin-top: 15px;
      text-align: center;

      .pagination {
        display: inline-block;
      }
    }

    .detail-top {
      display: flex;
      justify-content: space-between;
      align-items: center;

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

      .btns-container {
        margin-right: 10px;
      }
    }
  }

  .right-section {
    width: 100%;
    height: 100%;
    background: #fff;
    // overflow: auto;

    .bottom-container {
      padding: 20px;
      padding-top: 0;
      text-align: left;
      // height: calc(100% - 70px);
      height: 100%;
      overflow: auto;
      position: relative;

      .table-container {
        .top {
          margin-bottom: 10px;

          .el-icon-search {
            cursor: pointer;
          }

          .filter-input {
            width: 200px;
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
      }

      .color-red {
        color: red;
      }

      .color-green {
        color: #52c51d;
      }

      .chart-container {
        text-align: left;

        .title {
          font-size: 16px;
        }

        .chart-section {
          position: relative;
          margin-top: 20px;

          .no-data-text {
            position: absolute;
            left: 50%;
            top: 50%;
            margin-top: -50px;
            font-size: 14px;
            color: #909399;
            transform: translate(-50%, -50%);
          }
        }
      }

      .brief-datas {
        padding-left: 20px;
        padding-top: 25px;
        padding-bottom: 10px;

        text-align: left;
        display: flex;
        justify-content: flex-start;
        align-items: center;

        width: 100%;
        overflow-x: auto;

        .brief-data-item:not(:first-child) {
          margin-left: 35px;
        }

        .brief-data-item {
          flex: 0 0 auto;
          & > div {
            margin-bottom: 2px;
          }
        }

        & > div {
          margin-bottom: 10px;
        }

        .brief-datas-title {
          font-size: 14px;
          width: 200px;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: pre;
        }

        .rate-container {
          & > span:not(:first-child) {
            margin-left: 5px;
          }

          .arrow {
            font-size: 12px;
          }

          .rate-title {
            font-size: 14px;
          }
          .rate-number {
            font-size: 14px;
          }
        }

        .count-wrapper {
          display: flex;
          justify-content: flex-start;
          align-items: center;
        }

        .count-number {
          font-size: 18px;
          font-weight: bold;
          margin-left: 5px;
        }
      }
    }
  }
}
</style>
