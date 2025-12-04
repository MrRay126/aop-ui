<template>
  <div class="meta-data" v-loading="isLoadingChannelList">
    <div class="left">
      <div class="left-title"><span>元数据管理</span></div>
      <div class="menu-list">
        <template v-if="menuList.length === 0">
          <span class="channel-no-data-text">暂无数据</span>
        </template>
        <template v-else>
          <el-menu
            :default-active="focusedMenu"
            class="el-menu-vertical-demo"
            @select="handleSelectMenu"
          >
            <template v-for="(menuItem, menuIndex) in menuList">
              <template v-if="Array.isArray(menuItem.children)">
                <el-submenu :index="menuItem.value" :key="menuIndex">
                  <template slot="title">
                    <i class="el-icon-document"></i>
                    <span>{{ menuItem.label }}</span>
                  </template>
                  <template v-for="(childItem, cIndex) in menuItem.children">
                    <el-menu-item
                      :index="`${menuItem.value}-${childItem.value}`"
                      :key="cIndex"
                    >
                      <i class="el-icon-document"></i>
                      <span> {{ childItem.label }}</span>
                    </el-menu-item>
                  </template>
                </el-submenu>
              </template>
              <template v-else>
                <el-menu-item :index="menuItem.value" :key="menuIndex">
                  <i class="el-icon-document"></i>
                  <span>{{ menuItem.label }}</span>
                </el-menu-item>
              </template>
            </template>
          </el-menu>
        </template>
      </div>
    </div>
    <div class="right-content">
      <div class="title">
        <span>元数据管理</span>
        <span>
          <span class="collect-time-title">采集时间:</span>
          <!-- <el-date-picker
            v-model="time"
            type="datetimerange"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            value-format="yyyy-MM-dd"
            size="mini"
          >
          </el-date-picker> -->
          <time-calendar
            :isAutoTriggerApplyTimeEvent="false"
            :isTextTypeReference="false"
            :timeData="time"
            @applyTime="handleTimeChange"
          >
          </time-calendar>
          <el-button
            class="refresh-btn"
            icon="el-icon-refresh"
            type="text"
            @click="handleRefresh"
          ></el-button>
        </span>
      </div>
      <div class="content-inner">
        <div class="chart-container" v-loading="isLoadingChart">
          <div class="chart-item">
            <div class="chart-item-title">
              <span class="title-text">落库数据监控</span>
              <span class="data-scope">
                <span>区间数据: </span>
                <span>采集{{ collectCount }}条 </span>
                <!-- <span>,</span>
                <span>入库{{ storedCount }}条</span> -->
              </span>
            </div>
            <div class="chart-section">
              <!-- chart -->
              <line-chart :height="240" :chartData="dataChart"></line-chart>
            </div>
          </div>
          <div class="chart-item">
            <div class="chart-item-title">
              <span class="title-text">请求监控</span>
              <span class="data-scope">
                <span>区间数据: </span>
                <span
                  >请求{{ requestCount }}条 , 完成请求{{ finishCount }}条</span
                >
              </span>
            </div>
            <div class="chart-section">
              <!-- chart -->
              <line-chart :height="240" :chartData="requestChart"></line-chart>
            </div>
          </div>
        </div>
        <div class="table-container">
          <div class="field-title">字段管理</div>
          <div class="dynamic-table-container">
            <dynamic-table
              :height="500"
              :dimension="dimension"
              :source="source"
              :filter="filter"
              :search="search"
              :filterOptions="filterOptions"
              :pager="pager"
              :loading="isLoading"
              :contentHandler="preDealContent"
              @getTableData="handleGetTableData"
            ></dynamic-table>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { dimension } from "./data.js";
import dynamicTable from "@/views/components/dynamicTable";
import lineChart from "@/views/components/charts/lineChart.vue";
import TimeCalendar from "@/views/components/time-range-calendar";
import recentDay from "@/utils/timeData.js";

export default {
  props: {},
  components: { dynamicTable, lineChart, TimeCalendar },
  data() {
    return {
      channel: "",
      contentType: "",
      focusedMenu: "",
      isLoadingChannelList: false,
      isLoading: false,
      isLoadingChart: false,

      menuList: [
        // {
        //   label: "导航1",
        //   value: "nav1",
        //   children: [
        //     { label: "子导航1", value: "cnav1" },
        //     { label: "子导航2", value: "cnav2" },
        //   ],
        // },
        // {
        //   label: "导航2",
        //   value: "nav2",
        // },
      ],
      time: {
        type: "absolute", // absolute|relative 绝对时间|相对时间
        start: recentDay["0-6"].start, //"2021/8/1 0:0:0", //开始时间字符串
        end: recentDay["0-6"].end, //"2021/8/30 23:59:59", //结束时间字符串
        recent_day: "1-7", //配置日期组件回显  昨日: ‘1-1’ | 今日: ’0-0’ | 上周: ‘W1’ |: 本周 W0 | 上月: M1 | 本月: M0 | 过去7天:  1-7 | 过去30天  1-30 | 过去某天至过去某天 2-7 | StartToNow （绝对时间自某日至今）
        unit: "hour",
      },

      dataChart: {
        dimensions: [],
        source: [],
      },
      collectCount: 0, //采集数量
      storedCount: 0, // 入库数量

      requestChart: {
        dimensions: [],
        source: [],
      },
      requestCount: 0, //请求数量
      finishCount: 0, //完成数量

      dimension,
      source: [
        {
          name: "name",
          displayName: "显示名称",
          fieldType: "String",
          comment: "字段备注neirong",
        },
      ],

      search: { name: "" },
      filter: {},
      filterOptions: {},
      pager: {
        curPage: 1,
        pageSize: 10,
        total: 0,
      },
    };
  },

  watch: {
    "$store.getters.appId": {
      immediate: true,
      handler(val) {
        if (val) {
          this.init();
        }
      },
    },
  },

  methods: {
    handleTimeChange(data) {
      this.time = {
        type: data.type,
        start: data.start,
        end: data.end,
        recent_day: data.recent_day,
        unit: "hour",
      };
    },

    //刷新显示页面
    handleRefresh() {
      this.getChartData();
      this.getTableData();
    },

    handleSelectMenu(key, path) {
      this.focusedMenu = key;

      const ids = key.split("-");
      const channelId = ids[0];
      const contentTypeId = ids[1];

      //菜单点击
      if (path.length === 2) {
        this.channel = channelId;
        this.contentType = contentTypeId;

        //重置查询数据
        this.resetTime();
        this.resetTableFilterSearchPager();

        this.getChartData();
        this.getTableData();
      }
    },

    resetTableFilterSearchPager() {
      this.filter = this.$options.data().filter;
      this.search = this.$options.data().search;
      this.pager = this.$options.data().pager;
    },

    resetTime() {
      this.time = this.$options.data().time;
    },

    preDealContent(header, content) {
      // const fieldTypeDict = {
      //   string: "文本",
      //   number: "数值",
      // };
      // if (header.prop === "fieldType") {
      //   return fieldTypeDict[content];
      // }
      return content;
    },

    handleGetTableData(payload) {
      //api
      this.filter = payload.filter;
      this.search = payload.search;
      this.getTableData();
    },

    getChartData() {
      this.dataChart = this.$options.data().dataChart;
      this.requestChart = this.$options.data().requestChart;
      const payload = {
        project_id: this.$store.getters.appId,
        channelId: this.channel,
        contentTypeId: this.contentType,
        time: this.time,
      };
      this.isLoadingChart = true;
      this.$store
        .dispatch("metaData/getChartsData", payload)
        .then((resData) => {
          this.dataChart = {
            dimensions: resData.dataWatch.dimensions,
            source: resData.dataWatch.source,
          };
          this.collectCount = resData.dataWatch.collectCount;
          this.storedCount = resData.dataWatch.storedCount;

          this.requestChart = {
            dimensions: resData.requestWatch.dimensions,
            source: resData.requestWatch.source,
          };
          this.requestCount = resData.requestWatch.requestCount;
          this.finishCount = resData.requestWatch.finishCount;
        })
        .catch(() => {
          // noop
        })
        .finally(() => {
          this.isLoadingChart = false;
        });
    },

    getTableData() {
      // console.log("this.search::", this.search);
      const params = {
        project_id: this.$store.getters.appId,
        channelId: this.channel,
        contentTypeId: this.contentType,

        curPage: this.pager.curPage,
        pageSize: this.pager.pageSize,

        search: this.search.name, // 字段名查询内容
        ...this.filter,
      };

      this.isLoading = true;
      this.$store
        .dispatch("metaData/getFieldTableData", params)
        .then((resData) => {
          this.source = resData.results;
          this.pager = { ...this.pager, total: resData.pager.total };
          this.filterOptions = resData.filterOptions;
        })
        .catch(() => {
          // noop
        })
        .finally(() => {
          this.isLoading = false;
        });
    },

    getChannelList() {
      const payload = {
        project_id: this.$store.getters.appId,
      };
      this.isLoadingChannelList = true;
      return this.$store
        .dispatch("metaData/getChannelList", payload)
        .then((resData) => {
          this.menuList = resData;
        })
        .catch(() => {
          // noop
        })
        .finally(() => {
          this.isLoadingChannelList = false;
        });
    },
    //设置当前选中的menu 渠道 , 通过路由查看 or 默认使用第一项
    setMenuSelected() {
      const channel = this.$route.query["channel"];
      const contentType = this.$route.query["contentType"];

      if (channel && contentType) {
        this.channel = String(channel);
        this.contentType = String(contentType);
        this.focusedMenu = `${this.channel}-${this.contentType}`;
      } else {
        this.channel = String(this.menuList[0].value);
        this.contentType = String(this.menuList[0].children[0]?.value);
      }
    },

    async init() {
      // 重置time 和table查询数据
      this.resetTime();
      this.resetTableFilterSearchPager();

      // 获取页面数据
      await this.getChannelList();
      this.setMenuSelected();

      this.getChartData();
      this.getTableData();
    },
  },
};
</script>
<style scoped lang="scss">
@import "@/styles/index.scss";
.meta-data {
  display: flex;
  justify-content: flex-start;
  align-items: flex-start;
  padding: 20px;
  background-color: #f0f2f5;
  height: 100%;
  width: 100%;
  overflow: auto;

  ul,
  li {
    list-style: none;
    padding: 0;
    margin: 0;
  }

  ::v-deep(.time-range-wrapper) {
    vertical-align: middle;
  }

  .left {
    flex-shrink: 0;
    flex-grow: 0;
    width: 300px;
    height: 100%;
    background-color: #fff;
    color: $color-text;

    .menu-list {
      height: calc(100% - 70px);
      overflow: auto;

      .el-icon-document {
        font-size: 14px;
      }

      .channel-no-data-text {
        display: block;
        width: 100%;
        text-align: center;
        margin-top: 50px;
        font-size: 14px;
      }
    }

    .left-title {
      padding: 20px;
      border-bottom: 1px solid $color-border;
    }
  }

  .right-content {
    flex-shrink: 1;
    flex-grow: 1;
    flex-basis: auto;

    min-width: 800px;
    height: 100%;
    overflow: auto;

    margin-left: 20px;
    background-color: #fff;

    .title {
      display: flex;
      align-items: center;
      justify-content: space-between;

      padding: 17px;
      border-bottom: 1px solid $color-border;

      .collect-time-title {
        font-size: 14px;
        color: $color-text;
        margin-right: 15px;
      }

      .refresh-btn {
        margin-left: 5px;
      }
    }

    .content-inner {
      height: calc(100% - 63px);

      .chart-container {
        height: 350px;
        width: 100%;
        display: flex;
        align-items: flex-start;
        justify-content: space-between;
        padding-top: 10px;

        .chart-item {
          width: 50%;
          padding: 20px;

          .chart-item-title {
            display: flex;
            align-items: center;
            justify-content: space-between;
            color: $color-text;

            .title-text {
              font-size: 16px;
              font-weight: bold;
            }

            .data-scope {
              font-size: 12px;
            }
          }

          .chart-section {
            margin-top: 30px;
          }
        }
      }

      .table-container {
        padding: 10px;
        overflow: auto;

        .field-title {
          color: $color-text;
          height: 40px;
        }

        .dynamic-table-container {
        }
      }
    }
  }
}
</style>
–
