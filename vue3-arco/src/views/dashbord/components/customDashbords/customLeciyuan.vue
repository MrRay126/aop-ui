<template>
  <div class="custom-leciyuan" v-loading="loading">
    <div class="filter-container" :style="{ 'display': 'none' }">
      <template v-for="(item, index) in selectsFilters">
        <el-select
          :key="index"
          v-model="filterValue[item.name]"
          :filterable="true"
          :multiple="item.multiple"
          size="mini"
          @change="handleFilterChange"
        >
          <template v-for="(optionItem, oIndex) in item.options">
            <el-option
              :key="oIndex"
              :label="optionItem.label"
              :value="optionItem.value"
            ></el-option>
          </template>
        </el-select>
      </template>
    </div>
    <template v-for="(cardItem, index) in cardList">
      <div class="custom-card-item" :key="index">
        <card
          :cardData="cardItem"
          :loading="cardItem.isLoading"
          :disabledStatus="{
            download: false,
            config: true,
          }"
          :bottomHeight="bottomHeight"
          :configs="{
            isAutoTriggerApplyTimeEvent: true,
            hasDownload: true,
            hasMoreOperationBtn: true,
            titleClickToReport: false,
            useToolTip: false,
            hasAiSummary: false,
            disableOldCalendar: true,
          }"
          @action="handleCardAction($event, cardItem)"
        >
          <template v-if="!cardItem.isErrorOccured">
            <template v-if="!cardItem.hidden">
              <component
                :ref="'card' + cardItem.report.id"
                :is="getComponent(cardItem)"
                :cardData="cardItem.cardData"
                :cardConfigs="{
                  ...cardItem.report.configs,
                  type: cardItem.report.type,
                  dashbordFilters: getDashbordFilters(cardItem),
                }"
                :height="bottomHeight"
                :selectsFilters="selectsFilters"
                :datas="getDatas(cardItem)"
                @action="handleComponentAction($event, cardItem)"
              ></component>
            </template>
          </template>

          <template v-else>
            <div class="error-message-container">
              <span>{{ cardItem.errorMessage }}</span>
            </div>
          </template>
        </card>
      </div>
    </template>
  </div>
</template>
<script>
// import { cloneObject } from "@/utils";
import card from "../card.vue";
import lcyTrend from "./leciyuanTrendCard.vue";
import lcyDataTable from "./leciyuanTableCard.vue";
import lcyRadar from "./leciyuanRadarCard.vue";

export default {
  props: {
    dashboard: {
      type: Object,
      default() {
        return { id: 0, dashbordPerms: {} };
      },
    },
    //配置的列表, 数据另外获取
    configs: {
      type: Object,
      default: () => {
        return {
          // cardList: [
          //   {
          //     visible: true,
          //     report: {
          //       id: 1,
          //       type: "lcyTrend",
          //       configs: {
          //         time: {
          //           type: "relative",
          //           recent_day: "0-0",
          //         },
          //       },
          //     },
          //     isErrorOccured: false,
          //     errorMessage: "",
          //   },
          //   {
          //     visible: true,
          //     report: {
          //       id: 2,
          //       type: "lcyDataTable",
          //       configs: {
          //         time: {
          //           type: "relative",
          //           recent_day: "0-0",
          //         },
          //       },
          //     },
          //     isErrorOccured: false,
          //     errorMessage: "",
          //   },
          // ],
          // selectsFilters: [
          //   { name: "product", options: [{ label: "商品", value: "p1" }],defaultValue:[] },
          //   {
          //     name: "levelTwo",
          //     options: [{ label: "二级标签1", value: "e1" }],
          //     defaultValue:[]
          //   },
          //   {
          //     name: "period",
          //     options: [{ label: "宣发阶段", value: "per1" }],
          //     defaultValue:[]
          //   },
          //   {
          //     name: "weiboType",
          //     options: [{ label: "图文", value: "per1" }],
          //     defaultValue:[]
          //   },
          // ],
        };
      },
    },

    loading: {
      type: Boolean,
      default: false,
    },
  },
  components: {
    card,
    lcyTrend,
    lcyDataTable,
    lcyRadar,
  },
  data() {
    return {
      selectsFilters: [],
      filterValue: {},
      cardList: [],
      bottomHeight: 729, //卡片底部高度
    };
  },

  watch: {
    configs: {
      immediate: true,
      handler(val) {
        if (val && Array.isArray(val.cardList)) {
          this.cardList = [];

          this.cardList = val.cardList.map((item) => {
            return {
              ...item,
              hidden: false,
              isLoading: false,
              isErrorOccured: false,
              errorMessage: "",
              visible: true,
            };
          });
        }

        if (val && val.selectsFilters) {
          this.selectsFilters = val.selectsFilters;
          this.selectsFilters.forEach((item) => {
            if (item.multiple) {
              this.filterValue[item.name] = Array.isArray(item.defaultValue)
                ? item.defaultValue
                : [];
            } else {
              this.filterValue[item.name] = item.defaultValue || null;
            }
          });
        }
      },
    },
  },

  methods: {
    getDashbordFilters(cardItem) {
      //获取卡片的过滤器
      if (cardItem.dashbordFilters == null || cardItem.dashbordFilters === undefined) {
        if (cardItem.report.type === "lcyTrend") {
          return {};
        }
        return this.filterValue;
      }
      return cardItem.dashbordFilters;
    },
    //filer改变全局刷新
    handleFilterChange() {
      this.oldcardList = this.cardList;
      this.cardList = [];
      this.$nextTick(() => {
        this.cardList = this.oldcardList;
      });
    },
    /**
     * 获取卡片的 apiAction 等配置数据
     */

    getDatas() {
      return null;
    },

    getComponent(cardItem) {
      return cardItem.report.type;
    },

    async handleCardAction(payload, cardItem) {
      const { action, data, cb } = payload;
      //处理卡片time change事件

      if (action === "timeChange") {
        cardItem.hidden = true;
        this.$nextTick(() => {
          cardItem.hidden = false;
          cardItem.report.configs.time = data;
          this.getCardData(cardItem);
        });
      }

      //下载卡片数据
      if (action === "download") {
        this.hasDownloadingCard = true;
        await this.downloadCardData(cardItem);
        this.hasDownloadingCard = false;
        if (typeof cb === "function") {
          cb();
        }
      }
    },

    handleComponentAction(payload, cardItem) {
      this.currentCard = cardItem;

      const { action, data } = payload;
      if (action === "changeViewPart") {
        // 设置ai总结是否可见
        this.$set(cardItem, "isViewDetail", !data);
      }

      if (action === "filter") {
        // 过滤器事件
        // conole.log("filterValue:::", this.filterValue);
        cardItem.hidden = true;
        this.$nextTick(() => {
          cardItem.hidden = false;
          cardItem.dashbordFilters = data.filter;
          cardItem.report.configs.time = data.time;
          this.getCardData(cardItem, data.time, data.filter);
        });

        if (data.table) {
          for (let item of this.cardList) {
            if (item.report.type === "lcyDataTable") {
              item.dashbordFilters = data.filter;
              item.report.configs.time = data.time;
              this.$nextTick(() => {
                this.$refs["card" + item.report.id][0].refresh(() => {
                  item.isLoading = false;
                });
              });
            }
          }
        }

      }

    },

    getCardData(card, time = null, filter = null) {
      card.isLoading = true;
      if (card.report.type === "lcyDataTable") {
        //重载后自动获取数据
        this.$nextTick(() => {
          this.$refs["card" + card.report.id][0].refresh(() => {
            card.isLoading = false;
          });
        });
      } else if (card.report.type === "lcyRadar") {
        //重载后自动获取数据
        card.isErrorOccured = false;
        const payload = {
          ...card.report.configs,
          // time: time || card.report.configs.time,
          type: card.report.type,
          dashbordFilters: filter || this.filterValue,
          project_id: this.$store.getters.appId,
        };
        let p1 = this.$store
          .dispatch("dashbord/getLeciyuanTrend", payload)
        let p2 = this.$store
          .dispatch("dashbord/getLeciyuanRadar", payload);
        let p3 = this.$store
          .dispatch("dashbord/get_leciyuan_statistics", payload);
        Promise.all([p1, p2, p3])
          .then((res) => {
            this.$set(card, "cardData", {
              line: res[0],
              radar: res[1],
              statistics: res[2],
            });
            card.isErrorOccured = false;
            card.errorMessage = "";
          })
          .catch((err) => {
            // noop
            // console.log("error:::", err);
            card.isErrorOccured = true;
            card.errorMessage = err;
          })
          .finally(() => {
            card.isLoading = false;
          });
      } else {
        // 获取数据
        card.isErrorOccured = false;
        let filterValue = { ...this.filterValue };
        delete filterValue["product"];
        if (filter) {
          filterValue = { ...filter };
        }
        const payload = {
          ...card.report.configs,
          type: card.report.type,
          dashbordFilters: filterValue,
          project_id: this.$store.getters.appId,
        };
         let p1 = this.$store
          .dispatch("dashbord/getLeciyuanTrend", payload)
        let p3 = this.$store
          .dispatch("dashbord/get_leciyuan_statistics", payload);
        Promise.all([p1, p3])
          .then((res) => {
            this.$set(card, "cardData", {
              line: res[0],
              statistics: res[1],
            });
            card.isErrorOccured = false;
            card.errorMessage = "";
          })
          .catch((err) => {
            // noop
            // console.log("error:::", err);
            card.isErrorOccured = true;
            card.errorMessage = err;
          })
          .finally(() => {
            card.isLoading = false;
          });
      }
    },

    downloadCardData(card) {
      const reportId = card.report.id;
      const reportType = card.report.type;
      const cardRef = this.$refs["card" + reportId][0];
      const cardStatus = cardRef.getCardStatus(reportType, card);

      if (cardStatus.isXiazuan) {
        //下钻功能
        const payload = {
          urlParams: { download_type: reportType },

          data: null,
        };
        const params = cardStatus.configs;

        payload.data = {
          ...params.configs,
          isViewDetail: params.isViewDetail, // 下钻功能的详情
          xiaZuan: true,
          project_id: this.$store.getters.appId,
        };

        return downloadCardInfo.call(this, payload);
      } else if (cardStatus.isViewDetail) {
        //常规功能
        // 下载分析详情数据
        const payload = {
          urlParams: { download_type: reportType + "_detail" },
          data: {
            ...cardStatus.detailConfigs,
            project_id: this.$store.getters.appId,
          },
        };

        return downloadCardInfo.call(this, payload);
      } else {
        return downloadCardInfo.call(this);
      }

      //大卡的主页面数据 小卡的主页面数据(无数据详情)
      function downloadCardInfo(configs) {
        // 下载分析数据
        // 同查看数据请求的参数
        let payload = {
          urlParams: {
            download_type: reportType,
          },
          data: {
            ...this.getCardParams(card),
          },
        };

        if (configs) {
          payload = configs;
        }

        return this.$store
          .dispatch("download/downloadAnalysis", payload)
          .catch((e) => {
            // noop
            console.error(e);
          })
          .finally(() => {
            // cardItem.isLoading = false;
          });
      }
    },

    getCardParams(card) {
      //重新获取卡片逻辑
      return {
        type: card.report.type,
        project_id: this.$store.getters.appId,

        dashbord_id: this.dashboard.id,
        ...card.report.configs,
      };
    },
    handlerResize() {
       let height = window.document.body.clientHeight;
        // 计算底部高度
        // 62px: 顶部导航栏高度
        // 50px: 卡片标题高度
        // 50px: 卡片操作按钮高度
        // 20px: 卡片间距
        // 20px: delta
        let bH = height - 62 - 50 - 50 - 20 - 20;
        if (bH < 729) {
          bH = 729; // 最小高度
        }
        this.bottomHeight = bH;
    },
  },
  created() {
    this.handlerResize();
    window.addEventListener("resize", this.handlerResize);
  },
};
</script>
<style lang="scss" scoped>
.custom-leciyuan {
  height: 100%;
  overflow: auto;
  // background: #fff;

  .filter-container {
    padding: 10px;
    margin-bottom: 10px;

    & > div {
      margin-left: 10px;
    }
  }

  .custom-card-item {
    margin-bottom: 15px;

    .error-message-container {
      width: 100%;
      height: 100%;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      color: red;
    }
  }

  ::v-deep {
    .info {
      background-color: #fff;

      padding-top: 0;

      .page {
        background-color: #fff;
      }

      .left {
        padding-top: 0;
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
      height: calc(100%);
    }
  }
}
</style>
