<template>
  <div style="height: 100%" v-loading="loading">
    <template v-for="(cardItem, index) in cardList">
      <div class="custom-card-item" :key="index">
        <!-- cardItem.isLoading:::{{ cardItem.isLoading }} -->
        <card
          :cardData="cardItem"
          :loading="cardItem.isLoading"
          :disabledStatus="{
            download: false,
            config: true,
          }"
          :configs="{
            isAutoTriggerApplyTimeEvent: true,
            hasDownload: true,
            hasMoreOperationBtn: true,
            titleClickToReport: false,
            useToolTip: false,

            hasAiSummary: false,
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
                }"
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
import trend from "./trendCard.vue";
import playerDiscuss from "./discussCard.vue";
import topic from "@/views/dashbord/components/customDashbords/topicCard.vue";
import theme from "@/views/dashbord/components/customDashbords/themeCard.vue";

export default {
  props: {
    dashboard: {
      type: Object,
      default() {
        return { id: 0, dashbordPerms: {} };
      },
    },

    //配置的列表, 数据另外获取
    cardListData: {
      type: Array,
      default: () => {
        return [];
      },
    },

    loading: {
      type: Boolean,
      default: false,
    },
  },
  components: {
    card,
    trend,
    playerDiscuss,
    theme,
    topic,
  },
  data() {
    return {
      cardList: [],
      // [
      //   {
      //     report: {
      //       id: 1,
      //       configs: {
      //         type: "trend",
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
      //     report: {
      //       id: 2,
      //       configs: {
      //         type: "theme",
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
      //     report: {
      //       id: 3,
      //       configs: {
      //         type: "topic",
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
      //     report: {
      //       id: 4,
      //       configs: {
      //         type: "playerDiscuss",
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
    };
  },

  watch: {
    cardListData: {
      immediate: true,
      handler(val) {
        this.cardList = [];
        if (Array.isArray(val)) {
          this.cardList = val.map((item) => {
            // item.isLoading = false;
            // item.isErrorOccured = false;
            // item.errorMessage = "";
            return {
              ...item,
              hidden: false,
              isLoading: false,
              isErrorOccured: false,
              errorMessage: "",
            };
          });
        }
      },
    },
  },

  methods: {
    /**
     * 获取卡片的 apiAction 等配置数据
     */
    getDatas(cardItem) {
      // 话题类聚
      if (cardItem.report.type === "theme") {
        return {
          tableAction: "dashbord/getThemeDispositionTableData",
          detailTableAction: "dashbord/getThemeDetailTableData",
        };
      }
      // 主题分布
      if (cardItem.report.type === "topic") {
        return {
          dispositionTableAction: "dashbord/getTopicDispositionTable",
          detailTableAction: "dashbord/getTopicDetailTableData",
        };
      }
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
    },

    getCardData(card) {
      card.isLoading = true;

      if (card.report.type === "playerDiscuss") {
        //重载后自动获取数据
        this.$nextTick(() => {
          this.$refs["card" + card.report.id][0].refresh(() => {
            card.isLoading = false;
          });
        });
      } else {
        // 获取数据
        card.isErrorOccured = false;
        const payload = {
          ...card.report.configs,
          type: card.report.type,
          project_id: this.$store.getters.appId,
        };
        this.$store
          .dispatch("dashbord/getCustomDashboardCardData", payload)
          .then((res) => {
            if (card.report.type === "trend") {
              this.$set(card, "cardData", res.chartData);
            } else if (card.report.type === "topic") {
              // 主题分析卡片
              this.$set(card, "cardData", res.chartData);
              return;
            } else {
              this.$set(card, "cardData", res);
            }
          })
          .catch((err) => {
            // noop
            card.errorMessage = err;
            card.isErrorOccured = true;
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
  },
  created() {},
};
</script>
<style lang="scss" scoped>
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
</style>
