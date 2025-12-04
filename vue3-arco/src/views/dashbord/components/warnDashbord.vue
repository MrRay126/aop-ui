<template>
  <div class="warn-dashbord" v-loading="isLoadingTable">
    <div class="title-container rules">
      <tab-select
        anylysis="warn"
        :options="tabSelectOptions"
        :mutilpleSelect="true"
        v-model="rules"
        @search="handleSearch"
        @hide="handleTabSelectValueChange"
      >
        <span>
          <span>预警规则-{{ tabTitle }}:</span>
          <span> ({{ rules.data.length }})</span>
          <el-tooltip
            effect="light"
            placement="right"
            content="可筛选展示的预警规则，不同时间粒度的预警无法同时展示"
          >
            <i class="el-icon-info"></i>
          </el-tooltip>
        </span>
      </tab-select>
    </div>

    <div class="chart-container">
      <!-- chart -->
      <template v-if="warnData.chartData.dimensions.length > 0">
        <shadow-line-chart
          :chartData="warnData.chartData"
          @click="handleChartClick"
        ></shadow-line-chart>
      </template>
      <template v-else>
        <span class="no-data-text">暂无数据</span>
      </template>
    </div>
    <template v-if="!detailVisible">
      <div class="table-container">
        <div class="title-operation-container">
          <span class="title-container"
            ><span style="cursor: pointer" @click="backToRiskDetail"
              >风险详情</span
            >
            {{
              isWarnPoint ? "/ " + `${warnPoint.rule} ${warnPoint.date}` : ""
            }}
          </span>
          <el-button
            :loading="isDownloading"
            :disabled="warnData.tableData.source.length === 0"
            @click="handleDownload"
            type="primary"
            icon="el-icon-download"
          >
            下载</el-button
          >
        </div>

        <dynamic-table
          :max-height="600"
          :dimension="tableDimensions"
          :source="warnData.tableData.source"
          :filter="filter"
          :filterOptions="filterOptions"
          :pager="pager"
          :loading="isLoadingTable"
          :contentHandler="preDealContent"
          @rowClick="handleRowClick"
          @getTableData="handleGetTableData"
          @selectChange="handleSelectChange"
        ></dynamic-table>
      </div>
    </template>
    <template v-else>
      <div class="detail-table-container">
        <div class="detail-tiltle">
          <span class="pre-title" @click="handleTitleClick">预警内容 / </span
          >{{ detailRow.rule }} ( 触发时间{{ detailRow.time }} )
        </div>
        <div class="table-wraper">
          <detail-table
            ref="detailTable"
            :configs="{
              project_id: $store.getters.appId,
              alert_rule_id: detailRow.alert_rule_id,
              ref_id: detailRow.ref_id,
              time: detailRow.time,
              date: isWarnPoint ? warnPoint.date : null,
            }"
            apiAction="dashbord/getWarnDetailData"
          ></detail-table>
        </div>
      </div>
    </template>
  </div>
</template>
<script>
import shadowLineChart from "@/views/components/charts/shadowLineChart.vue";
import tabSelect from "@/views/components/tabSelect";
import dynamicTable from "@/views/components/dynamicTable";
import { CalcPeriodMaps, PeriodValues } from "@/views/dataManage/warn/data";
import detailTable from "@/views/components/anylysisDetailTable";

export default {
  components: {
    shadowLineChart,
    tabSelect,
    dynamicTable,
    detailTable,
  },
  props: {
    bordId: {
      type: Number,
      default: null,
    },

    isLoading: {
      type: Boolean,
      default: false,
    },

    warnRules: {
      type: Object,
      default() {
        return null;
      },
    },
  },

  data() {
    return {
      viewIds: [],
      rules: {
        data: [],
        category: null,
        search: null,
      },

      tabTitle: "",
      tabSelectOptions: [],

      isDownloading: false,
      isLoadingTable: false,

      warnData: {
        count: 0,
        chartData: {
          dimensions: [
            // "product", "2015", "2016", "2017"
          ],
          source: [
            // { product: "Matcha Latte", 2015: 43.3, 2016: 85.8, 2017: 93.7 },
            // { product: "Milk Tea", 2015: 83.1, 2016: 73.4, 2017: 55.1 },
            // { product: "Cheese Cocoa", 2015: 86.4, 2016: 65.2, 2017: 82.5 },
            // { product: "Walnut Brownie", 2015: 72.4, 2016: 53.9, 2017: 39.1 },
          ],
        },

        tableData: {
          source: [],
          // filterOptions: {},

          // pager: {
          //   curPage: 1,
          //   pageSize: 10,
          //   total: 100,
          // },

          //初始化选中的项
          // filter: {},
        },
      },

      tableDimensions: [
        {
          label: "",
          prop: "",
          width: "50px",
          actionType: "selection",

          ifDisabled() {
            return false;
          },

          ifVisible() {
            return true;
          },
        },

        {
          label: "预警通知",
          prop: "warnMessage",
          minWidth: "300px",
          // hasTooltip: true, //是否使用toolTip
        },

        {
          label: "时间",
          prop: "time",
          actionType: "sort", // 排序类型
        },

        {
          label: "标签",
          prop: "tags",
          contentType: "tags",
          tagType: {
            default: "primary",
          },
          actionType: "filter", //options过滤类型
        },

        {
          label: "操作",
          prop: "",
          width: "100px",

          isActionColumn: true, // 是否是操作列 查看、删除等
          actions: [
            {
              //或字符串 "下载",
              label: "明细跳转",

              loadingRowTag: "loading", //自动 设置row 的这这属性为true启用loading 否则关闭loading

              ifShow: () => {
                return true;
              },

              ifDisabled: () => {
                return false;
              },

              action: (row) => {
                this.jumpToDetail(row);
              },
            },
          ],
        },
      ],

      pager: {
        curPage: 1,
        pageSize: 10,
        total: 10,
      },

      filter: {},
      filterOptions: {},
      tableSelections: [],

      detailVisible: false,
      detailRow: {
        rule: "规则",
        time: "2020/12/12 24:00:00",
      },

      warnPoint: {
        rule: "",
        date: "",
      },
      isWarnPoint: false, // 是否是预警点的table数据
    };
  },

  watch: {
    bordId: {
      immediate: true,
      handler(id) {
        const isViewWarnById = typeof id === "number" && !this.warnRules;
        if (isViewWarnById) {
          this.initWarnReportById(id);
        }
      },
    },

    warnRules: {
      immediate: true,
      async handler(val) {
        if (val) {
          this.initViewOfUrlReview(val);
        }

        // 不存在warnRules和bordId的情况按点击菜单显示
        if (!val && !this.bordId) {
          this.__initViewOfWarnMenuClick();
        }
      },
    },
  },
  methods: {
    backToRiskDetail() {
      this.isWarnPoint = false;
      this.refresh();
    },

    handleTitleClick() {
      this.detailVisible = false;
    },
    jumpToDetail(row) {
      this.detailRow = row;
      this.detailVisible = true;
    },

    handleChartClick(param) {
      const chartData = this.warnData.chartData;
      const series = chartData.dimensions.slice(1, chartData.dimensions.length);

      const rule = series[param.seriesIndex];
      const date = param.name;
      // const warnCount = param.data.coord[1];

      // this.detailRow={};
      // 预警点
      this.isWarnPoint = false;
      const markPointsOfSerie = chartData.markPoints[rule];
      if (Array.isArray(markPointsOfSerie)) {
        //
        this.isWarnPoint = markPointsOfSerie.some((item) => {
          return item[0] === param.name;
        });
      }

      if (this.isWarnPoint) {
        this.warnPoint = {
          rule,
          date,
        };

        const payload = {
          project_id: this.$store.getters.appId,
          curPage: this.pager.curPage,
          pageSize: this.pager.pageSize,
          ...this.filter,
          calcPeriod: this.rules.category, // 计算周期
          ids: this.rules.data, // 选中的预警报表id
          ...this.warnPoint,
        };

        this.isLoadingTable = true;
        this.$store
          .dispatch("dashbord/getWarnBordData", payload)
          .then((res) => {
            this.pager.total = res.tableData.pager.total;
            this.warnData.tableData.source = res.tableData.source;
            this.filterOptions = res.tableData.filterOptions;
          })
          .catch(() => {
            //noop
          })
          .finally(() => {
            this.isLoadingTable = false;
          });
      }
    },
    // 侧边菜单时初始化 //外部调用方法
    async __initViewOfWarnMenuClick() {
      await this.getWarnTabFilterOptions();
      this.setDefaultRules();
      this.setTabTitile();
      this.getTableData();
    },

    // 初始化url的回显
    async initViewOfUrlReview(warnRules) {
      this.rules = warnRules;
      await this.getWarnTabFilterOptions();
      this.setTabTitile();
      this.getTableData();
    },

    // 初始化预警报表通过id的查看回显
    async initViewOfWarnById(id) {
      this.initWarnReportById(id);
    },

    //选中的项用于下载
    handleSelectChange(selections) {
      this.tableSelections = selections;
    },

    handleGetTableData(data) {
      this.pager = data.pager;
      this.filter = data.filter;
      this.tableSelections = [];
      this.getTableData();
    },
    // 预处理表格内容
    preDealContent(header, content) {
      return content;
    },

    // 处理行点击
    handleRowClick(payload) {
      // console.log("row:::", row);
      const row = payload.row;
      if (row.link) {
        window.open(row.link);
      }
    },

    handleTabSelectValueChange() {
      this.isWarnPoint = false;
      this.detailVisible = false;

      this.setTabTitile();
      this.refresh();

      this.$emit("ruleChange", this.rules);
    },

    setTabTitile() {
      const curTab = this.tabSelectOptions.find((tabItem) => {
        return tabItem.name === this.rules.category;
      });

      if (curTab) {
        this.tabTitle = curTab.title;
      }
    },

    handleSearch() {
      // noop
    },

    handleTableRowClick(row, column) {
      if (column.label === "内容") {
        window.open(row.link);
      }
    },

    getFilterOptions(prop) {
      return this.filterOptions[prop] || [];
    },

    //api 获取列表数据
    getTableData() {
      // this.filter=res.data.tableData.filter;
      if (this.isLoadingTable) {
        return;
      }

      this.isLoadingTable = true;

      const payload = {
        project_id: this.$store.getters.appId,
        curPage: this.pager.curPage,
        pageSize: this.pager.pageSize,
        ...this.filter,

        calcPeriod: this.rules.category, // 计算周期
        ids: this.rules.data, // 选中的预警报表id
      };

      return this.$store
        .dispatch("dashbord/getWarnBordData", payload)
        .then((data) => {
          this.warnData = data;
          this.pager.total = data.tableData.pager.total;
          this.filter = data.tableData.filter;
          this.filterOptions = data.tableData.filterOptions;
        })
        .catch(() => {
          //noop
        })
        .finally(() => {
          this.isLoadingTable = false;
        });

      // this.filter=res.data.tableData.filter;
    },

    // 获取预警分析的tab过滤项
    getWarnTabFilterOptions() {
      const payload = {
        project_id: this.$store.getters.appId,
      };
      return this.$store
        .dispatch("warn/getWarnFilters", payload)
        .then((resData) => {
          if (Array.isArray(resData)) {
            this.tabSelectOptions = resData;
          }
        })
        .catch(() => {
          // noop
        })
        .finally(() => {
          // noop
        });
    },

    // 点击预警分析菜单时默认设置的参数
    // 无查看具体预警时,设置选中所有逐条内容
    setDefaultRules() {
      const oneByOne = this.tabSelectOptions.find((tabItem) => {
        return tabItem.name === PeriodValues.oneByOne;
      });

      if (oneByOne) {
        this.rules = {
          data: oneByOne.data.map((item) => {
            return item.value;
          }),
          category: oneByOne.name,
          search: "",
        };

        this.$emit("ruleChange", this.rules);

        this.tabTitle = CalcPeriodMaps[this.rules.category];
      }
    },

    //下载功能 api
    handleDownload() {
      // const warnId = this.bordId;
      const payload = {
        urlParams: { download_type: "warn" },
        data: {
          project_id: this.$store.getters.appId,
          ruleIds: this.rules.data, // 预警规则id
          notifyIds: this.tableSelections.map((item) => item.id), //风险详情通知的id
          calcPeriod: this.rules.category,
        },
      };

      this.isDownloading = true;
      this.$store.dispatch("download/downloadAnalysis", payload).finally(() => {
        this.isDownloading = false;
      });
    },

    cancelDownload() {
      if (this.isDownloading) {
        this.$store.dispatch("download/stopDownloadAnalysis").catch(() => {
          //noop
        });
      }
    },

    // 刷新时的两种情况 1.刷新不带id, 2.刷新时带id, 3.选择tabfilter之后刷新
    async refresh() {
      this.warnData = this.$options.data().warnData;
      await this.getTableData();
    },

    //外部调用方法
    async viewDefaultWarn() {
      this.warnData = this.$options.data().warnData;
      await this.getWarnTabFilterOptions();

      await this.getTableData();
    },

    // 初始化的两种情况带id时 , 不带id时使用了refresh(false)
    async initWarnReportById(id) {
      if (id) {
        // this.rules.data = [{ value: id }];
        // 初始化tab filter的选中状态
        await this.$store
          .dispatch("warn/getWarnSettingsById", { id })
          .then(async (resData) => {
            if (resData) {
              // 区分是带参数预警回显(有warnRules参数)或点击预警标题跳转

              this.rules = {
                ...this.rules,
                data: [{ value: id }],
                category: resData.alarmRule.calcPeriod,
              };

              await this.getWarnTabFilterOptions();
              this.setTabTitile();
              this.$emit("ruleChange", this.rules);
            }
            this.tabTitle = CalcPeriodMaps[this.rules.category];
          });

        this.getTableData();
      }
    },
  },

  beforeDestroy() {
    this.cancelDownload();
  },
};
</script>
<style lang="scss" scoped>
@import "@/styles/index.scss";

.detail-table-container {
  background: #fff;
  // height: 600px;
  .detail-tiltle {
    padding: 15px;
    font-size: 14px;
    .pre-title {
      color: $color-light-text;
      cursor: pointer;
    }
  }

  .table-wraper {
    height: 600px;
  }
}

.el-icon-info {
  font-size: 14px;
  margin-left: 3px;
  color: $color-text;
}

.tooltip-content-inner {
  max-width: 400px;
}

.warn-dashbord {
  background: $normal-background-color;

  .tag-item {
    margin-left: 5px;
    margin-bottom: 5px;
  }

  .title-operation-container {
    width: 100%;
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0 15px 10px 0px;
  }

  .pagination {
    display: inline-block;
  }

  .title-container {
    padding: 10px;
    color: $color-text;
    font-weight: bold;

    &.rules {
      text-decoration: underline;
    }
  }

  .chart-container {
    position: relative;
    padding: 5px;
    background: #fff;
    margin-bottom: 15px;
    height: 400px;

    ::v-deep(.graphic) {
      overflow: visible;
    }

    .no-data-text {
      position: absolute;
      left: 50%;
      top: 50%;
      transform: translate(-50%, -50%);
      font-size: 14px;
      color: #909399;
    }
  }

  .operation-container {
    text-align: right;
    padding: 10px 20px;
  }

  .table-container {
    background: #fff;
    padding: 15px;

    .pagination-container {
      padding: 15px;
      text-align: center;
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
</style>
