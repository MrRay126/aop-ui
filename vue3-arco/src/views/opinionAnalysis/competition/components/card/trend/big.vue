<template>
  <div class="big-card">
    <template v-if="!isViewXiaZuan">
      <div v-if="isViewInfos" class="basic">
        <div class="chart-container">
          <line-chart :height="600" :chartData="chartData"></line-chart>
        </div>

        <div class="table-container">
          <div class="time-filter">
            <el-select
              v-model="search"
              size="mini"
              :filterable="true"
              @change="handleSearchChange"
            >
              <template v-for="(groupItem, index) in groupOptions">
                <el-option
                  :key="index"
                  :label="groupItem"
                  :value="groupItem"
                ></el-option>
              </template>
            </el-select>
          </div>
          <vxe-table
            :data="tableData.source"
            height="460px"
            :loading="isloadingCountTable"
          >
            <template v-for="(headerItem, index) in tableData.dimensions">
              <template v-if="headerItem.filterType === 'sort'">
                <vxe-table-column :key="index" :width="headerItem.width">
                  <template #header>
                    <div class="sortable-header">
                      <span>{{ headerItem.label }}</span>
                      <span class="sort-container">
                        <span
                          class="el-icon-caret-top"
                          :class="{
                            'focus-sort':
                              filter[headerItem.prop] === 'ascending',
                          }"
                          @click="handleSort(headerItem, 'ascending')"
                        ></span>
                        <span
                          class="el-icon-caret-bottom"
                          :class="{
                            'focus-sort':
                              filter[headerItem.prop] === 'descending',
                          }"
                          @click="handleSort(headerItem, 'descending')"
                        ></span>
                      </span>
                    </div>
                  </template>
                  <template #default="scope">
                    <div class="value-container">
                      <span
                        class="content-wrapper"
                        :class="{
                          'count-text':
                            scope.row[headerItem.prop] &&
                            headerItem.contentType === 'data',
                        }"
                        @click="handleViewDetail(scope.row)"
                      >
                        {{
                          headerItem.contentType === "data"
                            ? typeof scope.row[headerItem.prop] === "number"
                              ? scope.row[headerItem.prop]
                              : "-"
                            : scope.row[headerItem.prop]
                        }}
                      </span>
                    </div>
                  </template>
                </vxe-table-column>
              </template>
            </template>
          </vxe-table>
          <div class="pagination-container">
            <el-pagination
              class="pagination"
              layout="sizes,total,  prev, pager, next, jumper"
              background
              @current-change="handlePageChange"
              @size-change="handleSizeChange"
              :current-page.sync="pager.curPage"
              :page-size.sync="pager.pageSize"
              :total="pager.total"
            ></el-pagination>
          </div>
        </div>
      </div>
      <div class="data-detail" v-else>
        <div class="title">
          <span class="report-title" @click="handleReprotTittleClick">
            <span>竟品分析</span>
          </span>
          <span class="title-span">/</span>
          <span class="detail-title">
            <span>{{ search }}</span>
            <span> 数据详情</span>
            <span> ( </span>
            <span>分析时间 {{ viewRow.time }}</span>
            <span> )</span>
          </span>
        </div>
        <div class="detail-table-container">
          <detail-table
            ref="detailTable"
            :configs="{
              ...cardConfigs,
              pager: detail.pager,
              tableFilter: detail.filter,

              trend_filter: {
                ...trendFilter,
                time: viewRow.time,
              },
            }"
            apiAction="competition/getDetailData"
            @event="handleDetailTableEvent"
          >
          </detail-table>
        </div>
      </div>
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
import lineChart from "@/views/components/charts/trendLineChart.vue";
import detailTable from "@/views/components/anylysisDetailTable";
import { bigCardMixin } from "@/views/mixins/card.js";
import xiaZuanInfo from "@/views/components/xiaZuan/info.vue";

export default {
  props: {
    cardData: {
      type: Object,
      default() {
        return {
          chartData: {
            dimensions: [],
            source: [],
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
        };
      },
    },
  },

  components: { lineChart, detailTable, xiaZuanInfo },

  mixins: [bigCardMixin],

  data() {
    return {
      isViewXiaZuan: false,
      xiaZuanRow: {},

      isloadingCountTable: false,
      isLoaingDetailData: false,
      isViewInfos: false,
      viewRow: { time: "" },
      chartData: {
        dimensions: [],
        source: [],
      },

      tableData: {
        dimensions: [
          {
            label: "时间",
            prop: "time",
            width: "200px",
            filterType: "sort", // 排序类型
            hasContentTooltip: false, //是否使用toolTip
          },
          {
            label: "内容量",
            prop: "content_count",
            contentType: "data",
            width: "200px",
            filterType: "sort", // 排序类型
            hasContentTooltip: false, //是否使用toolTip
          },
        ],
        source: [],
      },

      pager: {
        curPage: 1,
        pageSize: 10,
        total: 10,
      },

      filter: {
        // collectTime: "ascending",
        // publishTime: "ascending",
        // channel: "",
      },

      //数据详情查询参数 由后端返回 , 查询时在该参数额外添加点击的时间
      trendFilter: {},

      // 搜索的日期
      search: "",
      groupOptions: [],

      detail: {
        detailWord: "", // 详情词
        periodTime: "", // 分析时段
        isLoadingTable: false,
        tableData: {
          source: [],
          filterOptions: {
            // levels: [
            //   { label: "一级", value: 1 },
            //   { label: "二级", value: 2 },
            //   { label: "三级", value: 3 },
            // ], // 字段levels的过滤选项列表
            // channel: [{ label: "微博", value: "weibo" }],
            // tag: [{ label: "tag1", value: "tag1" }],
          },

          pager: {
            curPage: 1,
            pageSize: 10,
            total: 100,
          },

          //初始化选中的项
          filter: {
            // time: "ascending",
            // levels: "",
            // tags: "",
          },
        },

        pager: {
          curPage: 1,
          pageSize: 10,
          total: 10,
        },

        filter: {
          search: "",
          // time: "ascending",
          // levels: "",
          // tag: "",
        },
        filterOptions: {},
      },
    };
  },

  watch: {
    cardData: {
      immediate: true,
      handler(val) {
        if (val) {
          setTimeout(() => {
            if (val.chartData) {
              this.chartData = val.chartData;
              this.groupOptions = val.chartData.dimensions.slice(1, 51);
              this.search = this.groupOptions[0];
              // 获取表数据
              this.getTableData();
            }
          }, 500);
        }
      },
    },
    cardConfigs: {
      immediate: true,
      handler(val) {
        if (val) {
          this.isViewInfos = true;
        }
      },
    },
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

    // 查询条件改变
    handleSearchChange() {
      this.getTableData();
    },

    // return from detail
    handleReprotTittleClick() {
      // this.isViewInfos = true;
      this.setIfViewInfos(true);
    },

    getTableData() {
      this.isloadingCountTable = true;
      const payload = {
        ...this.cardConfigs,
        search: this.search,
        pager: this.pager,
        tableFilter: this.filter,
      };

      this.$store
        .dispatch("competition/getCountTableData", payload)
        .then((data) => {
          this.tableData.source = data.list;
          this.pager = data.pager;
          this.trendFilter = data.trend_filter;
        })
        .catch(() => {
          //noop
        })
        .finally(() => {
          this.isloadingCountTable = false;
        });
    },

    handleViewDetail(row) {
      if (row.content_count !== 0) {
        this.viewRow = row;
        // this.isViewInfos = false;
        this.setIfViewInfos(false);
      }
    },

    handlePageChange() {
      this.getTableData();
    },

    handleSizeChange() {
      this.pager.curPage = 1;
      this.getTableData();
    },

    //处理table分类操作
    handleSort(headerItem, value) {
      const isSortableHeader = headerItem.filterType === "sort";
      const prop = headerItem.prop;

      if (isSortableHeader && value === this.filter[prop]) {
        //重复点击取消选中状态
        this.$set(this.filter, prop, "");
      } else {
        this.$set(this.filter, prop, value);
      }
      this.getTableData();
    },
  },
  created() {},
};
</script>
<style lang="scss" scoped>
@import "@/styles/index.scss";
.big-card {
  width: 100%;
  height: 590px;

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

  .time-filter {
    padding: 10px 0;
  }

  .count-text {
    text-decoration: underline;
    cursor: pointer;
    padding: 0;

    &:hover {
      color: $color-primary;
    }
  }

  .basic {
    display: flex;
    align-items: flex-start;
    justify-content: flex-start;
    width: 100%;
    overflow-x: auto;

    .chart-container {
      min-width: 600px;
      flex-grow: 1;
    }

    .table-container {
      max-width: 500px;
      padding: 0px 30px 30px 30px;

      .pagination-container {
        width: 100%;
        overflow-x: auto;
        padding: 15px;
        text-align: center;

        .pagination {
          display: inline-block;
        }
      }

      .value-container {
        width: 100%;
        white-space: pre;
        text-overflow: ellipsis;
        overflow: hidden;
      }

      .focus-drop-down-item {
        color: $color-primary;
      }

      .focus-sort {
        color: $color-primary;
      }

      .sortable-header {
        display: flex;
        align-items: center;
        justify-content: flex-start;

        .sort-container {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          flex-direction: column;

          & > span {
            &:hover {
              color: $color-primary;
            }
          }

          .el-icon-caret-top {
            line-height: 5px;
            margin-bottom: 2px;
          }

          .el-icon-caret-bottom {
            line-height: 5px;
          }

          .filter-container {
            vertical-align: middle;
          }
        }

        .filter-icon {
          vertical-align: -2px;
          margin-left: 2px;
          cursor: pointer;
          color: #909399;
        }
      }
    }
  }

  .data-detail {
    .title {
      font-size: 14px;
      padding: 10px;

      .report-title {
        color: $color-desc;
        cursor: pointer;

        &:hover {
          color: $color-primary;
        }
      }

      .title-span {
        padding: 0 3px;
      }

      .detail-title {
        color: $color-text;
      }
    }

    .detail-table-container {
      height: 550px;
    }
  }

  .pagination-container {
    width: 100%;
    padding: 15px;
    text-align: center;

    .pagination {
      display: inline-block;
    }
  }

  .sortable-header {
    display: flex;
    align-items: center;
    justify-content: flex-start;

    .sort-container {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      flex-direction: column;

      & > span {
        &:hover {
          color: $color-primary;
        }
      }

      .el-icon-caret-top {
        line-height: 5px;
        margin-bottom: 2px;
      }

      .el-icon-caret-bottom {
        line-height: 5px;
      }

      .filter-container {
        vertical-align: middle;
      }
    }

    .filter-icon {
      vertical-align: -2px;
      margin-left: 2px;
      cursor: pointer;
      color: #909399;
    }
  }
}
</style>
