<template>
  <div class="info" v-loading="loading">
    <template v-if="viewPage">
      <div class="page">
        <div class="left">
          <div class="title">
            <span class="channel-tag">
              <i class="el-icon-setting"></i>
              <span> {{ infoData.chanelCnName }}</span>
            </span>
            <span>&nbsp;</span>
            <el-tooltip effect="light">
              <div class="title-inner">{{ infoData.title }}</div>
              <div slot="content" style="max-width: 400px">
                {{ infoData.title }}
                <span>&nbsp;</span>
                <span class="id">({{ infoData.id }})</span>
              </div>
            </el-tooltip>
          </div>
          <div class="content">
            <div class="content-item">
              <span class="content-item-title">内容ID: </span>
              <span class="content-text">{{ infoData.id }}</span>
            </div>
            <div class="content-item">
              <span class="content-item-title">发布时间: </span>
              <span class="content-text">{{ infoData.publishTime }}</span>
            </div>
            <div class="content-item">
              <span class="content-item-title">更新时间: </span>
              <span class="content-text">{{ infoData.updateTime }}</span>
            </div>
            <div class="content-item">
              <span class="content-item-title">链接: </span>

              <el-tooltip effect="light">
                <span class="content-text">
                  <a :href="infoData.link">{{ infoData.link }}</a>
                </span>
                <div slot="content" style="max-width: 400px">
                  <span class="content-text">
                    <a :href="infoData.link">{{ infoData.link }}</a>
                  </span>
                </div>
              </el-tooltip>
            </div>
            <div class="content-item">
              <span class="content-item-title">转发数:</span>
              <span class="content-text">{{ infoData.forwardCount }} </span>
            </div>
            <div class="content-item">
              <span class="content-item-title">评论数:</span>
              <span class="content-text">{{ infoData.commentCount }} </span>
            </div>
            <div class="content-item">
              <span class="content-item-title">点赞数:</span>
              <span class="content-text">{{ infoData.favorCount }} </span>
            </div>
          </div>
          <div class="ai-summary">
            <ai-summary
              :configs="{
                ...datas,
                type,
                time,
                ...otherConfigs,
                module: 'deep',
              }"
            ></ai-summary>
          </div>
        </div>
        <div class="right">
          <div class="top-tools">
            <time-calendar
              :timeData="time"
              :isTextTypeReference="false"
              :isAutoTriggerApplyTimeEvent="false"
              @applyTime="handleApplyTime"
            >
            </time-calendar>
            <div class="anylysis-types">
              <el-radio-group v-model="type" @change="handleTypeChange">
                <template v-for="(item, index) in typesList">
                  <el-radio-button :key="index" :label="item.value">{{
                    item.label
                  }}</el-radio-button>
                </template>
              </el-radio-group>
            </div>
          </div>
          <template v-if="anylysisVisible">
            <div class="anylysis-section">
              <!-- 趋势 -->
              <template
                v-if="
                  [typeMapCn['评论趋势'], typeMapCn['转发趋势']].includes(type)
                "
              >
                <trend
                  ref="trend"
                  :datas="{
                    ...datas,
                    type,
                    time,
                    ...otherConfigs,
                  }"
                  tableApiAction="kol/getXiaZuanTrendTableData"
                  chartApiAction="kol/getXiaZuanTrendChartData"
                  @event="handleAction('trend', $event)"
                ></trend>
              </template>

              <!-- 词云 -->
              <template
                v-if="
                  [typeMapCn['评论词云'], typeMapCn['转发词云']].includes(type)
                "
              >
                <word
                  ref="word"
                  :wordChartHeight="viewConfigs.wordChartHeight"
                  :wordTableHeight="viewConfigs.wordTableHeight"
                  :datas="{
                    ...datas,
                    type,
                    time,
                    ...otherConfigs,
                  }"
                  @event="handleAction('word', $event)"
                ></word>
              </template>

              <!-- 传播分析 -->
              <template v-if="type === typeMapCn['传播分析']">
                <spread
                  :chartHeight="viewConfigs.spreadChartHeight"
                  :tableHeight="viewConfigs.spreadTableHeight"
                  ref="spread"
                  :datas="{
                    ...datas,
                    type,
                    time,
                    ...otherConfigs,
                  }"
                  :isTimeLineVisible="viewConfigs.isTimeLineVisible"
                  action="test/action"
                  @event="handleAction('spread', $event)"
                ></spread>
              </template>
            </div>
          </template>
        </div>
      </div>
    </template>
    <template v-else>
      <!-- 数据详情 -->
      <div class="more-contents-table-container">
        <div class="detail-top">
          <span class="top-path">
            <span class="path-pre" @click="handleBackToPage">{{
              types[type]
            }}</span>
            <span> / </span>
            <span style="font-weight: bold">{{ detailName }}</span>
            <span> 的</span>
            <span>数据详情</span>
            <span> ( </span>
            <span>分析时间 </span>
            <span>{{ recordTime }}</span>
            <span> )</span>
          </span>

          <span class="btns-container">
            <!-- <span style="margin-right: 10px">
              <ai-summary
                :configs="{
                  ...getParams(),
                  type: OpinionType.trend,
                }"
              ></ai-summary>
            </span> -->
            <el-button
              class="refresh-btn"
              @click="handleRefreshDetail"
              type="text"
              icon="el-icon-refresh"
            ></el-button>
            <el-button
              @click="handleDownloadDetail"
              type="text"
              icon="el-icon-download"
              :loading="isDownloadingDetail"
            ></el-button>
          </span>
        </div>

        <div class="detail-table-container">
          <detail-table
            ref="detailTable"
            :configs="{
              isXiaZuanDetail: true,
              ...datas,
              ...detailConfigs,
              ...otherConfigs,
            }"
            :apiAction="apiAction"
            @event="handleDetailTableEvent"
          ></detail-table>
        </div>
      </div>
    </template>
  </div>
</template>
<script>
import trend from "./trend.vue";
import word from "./word.vue";
import spread from "./spread.vue";
import { OpinionType } from "@/views/dashbord/data";
// import aiSummary from "@/views/components/aiSummary";
import detailTable from "@/views/components/anylysisDetailTable";
import timeCalendar from "@/views/components/time-range-calendar";
import recentDay from "@/utils/timeData.js";
import { types, typeMapCn, typesList } from "./data.js";
import aiSummary from "@/views/components/aiSummary";

export default {
  props: {
    datas: {
      type: Object,
      default() {
        return {};
      },
    },

    viewConfigs: {
      type: Object,
      default() {
        return {};
      },
    },
  },
  components: {
    trend,
    word,
    spread,
    aiSummary,
    detailTable,
    timeCalendar,
  },
  data() {
    return {
      loading: true,
      otherConfigs: {}, // 用于点击下钻的详情时覆盖row参数
      infoData: {
        chanelCnName: "-",
        title: "-",
        id: "-",
        publishTime: "-",
        updateTime: "-",
        link: "-",

        forwardCount: 0, // 转发数
        commentCount: 0, // 评论数
        favorCount: 0,
      },
      types,
      type: typeMapCn["评论趋势"],
      typeMapCn,
      typesList,
      OpinionType,

      time: {
        type: "absolute", // absolute|relative 绝对时间|相对时间
        start: recentDay["1-7"].start, //开始时间字符串
        end: recentDay["1-7"].end, //结束时间字符串
        recent_day: "1-7", //配置日期组件回显  昨日: ‘1-1’ | 今日: ’0-0’ | 上周: ‘W1’ |: 本周 W0 | 上月: M1 | 本月: M0 | 过去7天:  1-7 | 过去30天  1-30 | 过去某天至过去某天 2-7 | StartToNow （绝对时间自某日至今）
      },

      viewPage: true,
      detailName: "",
      recordTime: "2020-12-12 20:10:10",
      isDownloadingDetail: false,
      apiAction: "",
      detailConfigs: {},
      anylysisVisible: false,
    };
  },

  watch: {
    "datas.time": {
      immediate: true,
      handler(val) {
        // this.time = val;
      },
    },
  },

  methods: {
    handleDetailTableEvent({ action, data }) {
      if (action === "xiaZuan") {
        this.otherConfigs = {
          row: data,
        };
        this.type = typeMapCn["评论趋势"];
      }
      this.handleBackToPage();
      this.getInfoData();
    },

    getInfoData() {
      this.loading = true;
      const payload = {
        project_id: this.datas.project_id,
        row: this.datas.row,
        ...this.otherConfigs,
      };
      console.log("lcq", payload);
      this.$store
        .dispatch("kol/getXiaZuanBaseInfo", payload)
        .then((data) => {
          console.log("lcq", data);
          this.infoData = data;

          this.time.start = this.infoData.publishTime;
          this.time.end = getAfter3DateOf(this.time.start);
          this.handleTypeChange();
        })
        .catch(() => {
          // noop
        })
        .finally(() => {
          this.loading = false;
        });

      function getAfter3DateOf(dateString) {
        let dateTime = new Date(dateString).getTime();
        const date = new Date(dateTime + 3 * 24 * 60 * 60 * 1000);

        return `${date.getFullYear()}-${
          date.getMonth() + 1
        }-${date.getDate()} ${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`;
      }
    },

    _getDownloadConfigs() {
      const data = {};
      if (this.viewPage) {
        data.isViewDetail = false;

        const name = {
          0: "trend",
          1: "trend",
          2: "word",
          3: "word",
          4: "spread",
        }[this.type];

        data.configs = this.$refs[name]?.getParams();
        data.configs.type = this.type;
        data.configs.time = this.time;
      } else {
        data.isViewDetail = true;
        data.configs = this.$refs["detailTable"]?.getParams();
      }
      return data;
    },

    handleApplyTime(data) {
      //刷新页面等
      const tmpType = this.type;
      this.type = "";
      this.time = data;
      this.$nextTick(() => {
        this.type = tmpType;
      });
    },

    handleTypeChange() {
      this.anylysisVisible = false;
      this.$nextTick(() => {
        this.anylysisVisible = true;
      });
    },

    handleDownloadDetail() {
      this.isDownloadingDetail = true;

      const name = {
        0: "trend",
        1: "trend",
        2: "word",
        3: "word",
        4: "spread",
      }[this.type];

      const payload = {
        urlParams: { download_type: name + "_detail" },
        data: { ...this.$refs["detailTable"].getParams() },
      };
      this.$store
        .dispatch("download/downloadKolAnalysis", payload)
        .finally(() => {
          this.isDownloadingDetail = false;
        });
    },

    handleRefreshDetail() {
      this.$refs["detailTable"].getTableData();
    },

    handleBackToPage() {
      this.viewPage = true;
      this.$emit("event", { action: "viewXiaZuan" });
    },

    handleAction(blockType, payload) {
      //查看详情等操作
      const { action, data } = payload;
      this.apiAction = {
        trend: "kol/getXiaZuanTrendDetailData",
        word: "kol/getXiaZuanWordDetaildata",
        spread: "kol/getXiaZuanSpreadDetaildata",
      }[blockType];

      if (action === "viewDetail") {
        this.viewPage = false;

        this.detailConfigs = {
          type: this.type,
          ...data,
        };

        if (blockType === "trend") {
          // if need
        } else if (blockType === "word") {
          // if need
        } else if (blockType === "spread") {
          // if need
        }

        this.$emit("event", { action: "viewDetail" });
      }
    },
  },
  created() {
    this.getInfoData();
    //左侧内容在显示时触发下载
  },
};
</script>
<style lang="scss" scoped>
@import "@/styles/index.scss";
.info {
  height: 100%;
  width: 100%;
  overflow: auto;

  .page {
    height: 100%;
    width: 100%;
    overflow: auto;
    display: flex;
    align-content: center;
    justify-content: flex-start;
  }

  .left {
    margin-top: 10px;
    width: 300px;
    padding-left: 10px;
    height: calc(100% - 10px);
    flex-shrink: 0;
    background: #fff;
    margin-left: 10px;

    .ai-summary {
      padding-top: 10px;
    }

    .title {
      margin-top: 20px;
      display: flex;
      align-items: center;
      justify-content: flex-start;
      margin-bottom: 20px;

      .title-inner {
        font-size: 16px;
        font-weight: 500;

        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
      }

      .channel-tag {
        flex-shrink: 0;
        display: inline-block;
        border-radius: 3px;
        padding: 3px 5px;
        border: 1px dashed $color-disabled;
        font-size: 14px;
      }
    }

    .content {
      .content-item {
        padding: 5px;
        color: #42546d;
        display: flex;
        align-items: center;
        justify-content: flex-start;

        .content-item-title {
          font-weight: 500;
          font-size: 14px;
          flex-shrink: 0;
          padding-right: 5px;
        }

        .content-text {
          font-size: 14px;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }
      }
    }
  }

  .right {
    margin-top: 10px;
    flex: auto;
    margin-left: 10px;
    height: calc(100% - 10px);
    background: #fff;
    margin-right: 10px;
    overflow: auto;

    .top-tools {
      padding: 10px;
      padding-left: 20px;
      display: flex;
      justify-content: flex-start;
      align-items: center;

      .anylysis-types {
        margin-left: 20px;
      }
    }

    .anylysis-section {
      height: calc(100% - 67px);
    }
  }

  .more-contents-table-container {
    height: 100%;
    width: 100%;
    padding: 15px;
    background: #fff;

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
}
</style>
