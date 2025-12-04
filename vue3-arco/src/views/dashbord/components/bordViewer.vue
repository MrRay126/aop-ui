<template>
  <div class="bord-viewer" v-loading="loading">
    <template v-if="cardListData.length > 0">
      <grid-layout
        ref="show-grid-layout"
        :layout.sync="cardList"
        :col-num="colNumber"
        :row-height="40"
        :maxRows="20"
        :is-draggable="false"
        :is-resizable="true"
        :is-mirrored="false"
        :autoSize="true"
        :vertical-compact="true"
        :prevent-collision="true"
        :responsive="false"
        :use-css-transforms="false"
        :margin="[5, 5]"
        :breakpoints="{ lg: 1200, md: 996, sm: 768, xs: 480, xxs: 0 }"
        :cols="{ lg: 12, md: 10, sm: 6, xs: 4, xxs: 2 }"
      >
        <template v-for="(cardItem, index) in cardList">
          <grid-item
            :key="index"
            class="echarts_box"
            :x="cardItem.x"
            :y="cardItem.y"
            :w="cardItem.w"
            :h="cardItem.h"
            :i="cardItem.i"
            :is-resizable="false"
          >
            <card
              :cardData="cardItem"
              :loading="cardItem.isLoading"
              :disabledStatus="{
                download: false,
                config: !dashboard.dashbordPerms.edit,
              }"
              :configs="{
                isAutoTriggerApplyTimeEvent: true,
                hasDownload: true,
                hasMoreOperationBtn: true,
                titleClickToReport: true,
                useToolTip: true,
                hasAiSummary: cardItem.isViewDetail,
              }"
              @action="handleCardAction($event, cardItem)"
            >
              <template v-if="!cardItem.isErrorOccured">
                <template v-if="!cardItem.hidden">
                  <component
                    :ref="'card' + cardItem.report.id"
                    :is="
                      getComponent(
                        cardItem.report.type,
                        cardItem.report.cardSize,
                        cardItem
                      )
                    "
                    :cardData="cardItem.cardData"
                    :cardConfigs="cardItem.report.configs"
                    @action="handleComponentAction($event, cardItem)"
                  ></component>
                </template>
              </template>

              <template v-else>
                <div>错误提示信息</div>
              </template>
            </card>
          </grid-item>
        </template>
      </grid-layout>
    </template>
    <template v-else>
      <template v-if="!loading">
        <div class="add-new-bord-card">
          <div>
            <el-empty description="尚未添加报表" :image-size="130"></el-empty>
          </div>
          <div class="add-btn-container">
            <el-button
              type="primary"
              @click="handleAddBord"
              :disabled="!dashboard?.dashbordPerms.edit"
            >
              <span style="font-size: 16px">+</span>
              添加报表
            </el-button>
          </div>
        </div>
      </template>
    </template>
    <card-config
      :dashbordId="dashboard.id"
      :card="currentCard"
      @close="handleCardConfigClose"
      @submit="handleCardSubmit"
      :dialogVisible="isConfigDialogVisible"
    ></card-config>
  </div>
</template>
<script>
import { GridLayout, GridItem } from "vue-grid-layout";
import card from "./card.vue";
// import { cardItem, colNumber, MarketType } from "../data/index.js";
import cardConfig from "./cardConfig.vue";
import {
  OpinionType,
  big,
  middle,
  height,
  MarketType,
  colNumber,
} from "../data";
import trendCardBig from "@/views/opinionAnalysis/trend/components/card/big.vue";
import trendCardMiddle from "@/views/opinionAnalysis/trend/components/card/middle.vue";
import themeCardBig from "@/views/opinionAnalysis/theme/components/card/big.vue";
import wordsCardBig from "@/views/opinionAnalysis/words/components/card/big.vue";
import wordsCardMiddle from "@/views/opinionAnalysis/words/components/card/middle.vue";
import spreadCardBig from "@/views/opinionAnalysis/spread/components/card/big.vue";
// import { cloneObject } from "@/utils";
import kolCardBig from "@/views/opinionAnalysis/kol/components/card/big.vue";

import competitionTrendBigCard from "@/views/opinionAnalysis/competition/components/card/trend/big.vue";
import competitionTrendMiddleCard from "@/views/opinionAnalysis/competition/components/card/trend/middle.vue";
import competitionWordCloudBigCard from "@/views/opinionAnalysis/competition/components/card/wordCloud/big.vue";

import {
  score,
  trend,
  wordCloud,
} from "@/views/opinionAnalysis/competition/data.js";

export default {
  props: {
    dashboard: {
      type: Object,
      default() {
        return { id: 0, dashbordPerms: {} };
      },
    },

    cardListData: {
      type: Array,
      default() {
        return [];
      },
    },
    loading: {
      type: Boolean,
      default: false,
    },
  },
  components: {
    GridLayout,
    GridItem,
    card,
    cardConfig,
    trendCardBig,
    trendCardMiddle,
    themeCardBig,
    wordsCardBig,
    wordsCardMiddle,
    spreadCardBig,
    kolCardBig,
    competitionTrendBigCard,
    competitionTrendMiddleCard,
    competitionWordCloudBigCard,
  },
  data() {
    return {
      component: "",
      isConfigDialogVisible: false,
      colNumber,
      cardList: [],
      currentCard: null,
    };
  },
  watch: {
    //卡片列表数据只包含配置数据 , 具体显示数据再次获取 getOpinionCardData
    cardListData: {
      immediate: true,
      handler(val) {
        if (Array.isArray(val)) {
          val.forEach((cardItem) => {
            cardItem.h = height;
            cardItem.w = cardItem.report.cardSize === "big" ? big : middle;
          });
          this.cardList = val;
        }
      },
    },
  },
  methods: {
    cancelDownload() {
      if (this.hasDownloadingCard) {
        this.hasDownloadingCard = false;
        this.$store.dispatch("download/stopDownloadAnalysis").catch(() => {
          //noop
        });
      }
    },

    handleAddBord() {
      this.$emit("addBord");
    },

    //获取组件类型
    getComponent(type, size, card) {
      const components = {
        [OpinionType.trend]: {
          big: "trendCardBig",
          middle: "trendCardMiddle",
        },
        [OpinionType.theme]: {
          big: "themeCardBig",
          middle: "themeCardMiddle",
        },

        [OpinionType.words]: {
          big: "wordsCardBig",
          middle: "wordsCardMiddle",
        },
        [OpinionType.spread]: {
          big: "spreadCardBig",
          // 只有大卡
        },
        [MarketType.kol]: {
          big: "kolCardBig",
          // 只有大卡
        },
      };

      // 竞品分析
      const competitionComponent = {
        [trend]: {
          big: "competitionTrendBigCard",
          middle: "competitionTrendMiddleCard",
        },
        [score]: {
          big: "competitionTrendBigCard",
          middle: "competitionTrendMiddleCard",
        },
        [wordCloud]: {
          big: "competitionWordCloudBigCard",
        },
      };

      // 根据配置数据获取
      if (components[type]) {
        return components[type][size] || "";
      } else if (type === OpinionType.competition) {
        return competitionComponent[card.report.configs.anylysisType][size];
      }

      return "";
    },

    async handleCardAction(payload, cardItem) {
      const { action, data, cb } = payload;

      this.currentCard = cardItem;

      //处理卡片time change事件
      if (action === "timeChange") {
        //刷新初始化卡片显示
        this.$set(cardItem, "hidden", true);
        this.$nextTick(() => {
          this.$set(cardItem, "hidden", false);
          this.$set(cardItem.report.configs, "time", data);
          this.getOpinionCardData(cardItem);
        });
      }

      //开启卡片配置弹窗
      if (action === "openConfig") {
        this.handleCardConfigOpen();
      }

      //下载卡片数据
      if (action === "download") {
        this.hasDownloadingCard = true;

        try {
          await this.downloadCardData(cardItem);
        } catch (e) {
          console.error("download error: ", e);
        }

        this.hasDownloadingCard = false;
        if (typeof cb === "function") {
          cb();
        }
      }
    },

    downloadCardData(cardItem) {
      const reportId = cardItem.report.id;
      const reportType = cardItem.report.type;

      const cardRef = this.$refs["card" + reportId][0];
      if (cardRef) {
        const isBigCard = cardItem.report.cardSize === "big";

        if (isBigCard) {
          const cardStatus = cardRef.getCardStatus(reportType, cardItem);

          if (cardStatus.isXiazuan) {
            //下钻功能
            const payload = {
              urlParams: { download_type: reportType },
              project_id: this.$store.getters.appId,
              data: null,
            };

            const params = cardStatus.configs;

            payload.data = {
              ...params.configs,
              isViewDetail: params.isViewDetail, // 下钻功能的详情
              xiaZuan: true,
            };

            return this.$store
              .dispatch("download/downloadAnalysis", payload)
              .finally(() => {
                //noop
              });
          } else if (cardStatus.isViewDetail) {
            //常规功能
            // 下载分析详情数据
            const payload = {
              urlParams: { download_type: reportType + "_detail" },
              data: { ...cardStatus.detailConfigs },
            };

            return this.$store
              .dispatch("download/downloadAnalysis", payload)
              .catch((e) => {
                // noop
                console.error(e);
              })
              .finally(() => {
                cardItem.isLoading = false;
              });
          } else {
            const downloadConfigs =
              reportType === MarketType.kol ? cardStatus.detailConfigs : null;
            return downloadCardInfo.call(this, downloadConfigs);
          }
        } else {
          return downloadCardInfo.call(this);
        }
      }

      //大卡的主页面数据 小卡的主页面数据(无数据详情)
      function downloadCardInfo(configs) {
        // 下载分析数据
        // 同查看数据请求的参数
        const payload = {
          urlParams: {
            download_type: reportType,
          },
          data: {
            ...this.getCardParams(cardItem),
          },
        };

        if (configs) {
          // kol 会有这种情况
          payload.data = configs;
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

    handleComponentAction(payload, cardItem) {
      this.currentCard = cardItem;

      const { action, data } = payload;
      if (action === "changeViewPart") {
        this.$set(cardItem, "isViewDetail", !data);
      }
    },

    handleCardConfigOpen() {
      this.isConfigDialogVisible = true;
    },

    handleCardConfigClose() {
      this.isConfigDialogVisible = false;
    },

    //报表设置submit
    handleCardSubmit(payload) {
      // 在前端改变当前卡片数据
      const cardData = payload;
      for (let prop in cardData) {
        this.currentCard[prop] = cardData[prop];
      }

      this.getOpinionCardData(this.currentCard);

      this.$refs["show-grid-layout"].layoutUpdate();
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

    getOpinionCardData(card) {
      const cardType = card.report.type;
      //重新获取卡片逻辑
      const payload = this.getCardParams(card);

      this.$set(card, "isLoading", true);
      // kol有在自身内部获取数据
      if (cardType !== MarketType.kol) {
        this.$store
          .dispatch("dashbord/getCardData", payload)
          .then((data) => {
            if (cardType === OpinionType.theme) {
              this.$set(card, "cardData", {
                wordTypesTableData: data.ranks,
              });
            }

            if (cardType === OpinionType.trend) {
              this.$set(card, "cardData", data);
            }

            if (cardType === OpinionType.words) {
              this.$set(card, "cardData", data.words);
            }

            if (cardType === OpinionType.spread) {
              this.$set(card, "cardData", data);
            }

            if (cardType === MarketType.kol) {
              // this.$set(card, "cardData", data);
            }

            if (cardType === OpinionType.competition) {
              this.$set(card, "cardData", data);
            }
          })
          .catch(() => {
            //noop
          })
          .finally(() => {
            card.isLoading = false;
          });
      } else {
        // 通过card内部处理  MarketType.kol
        this.$set(card, "isLoading", false);
      }
    },
  },
  created() {},

  beforeDestroy() {
    this.cancelDownload();
    // this.$cancelRequest();
  },
};
</script>
<style lang="scss" scoped>
.bord-viewer {
  width: 100%;
  min-height: 100%;
  padding-right: 10px;
  position: relative;
  overflow: auto;

  .add-new-bord-card {
    position: absolute;
    left: 50%;
    top: 40%;
    transform: translate(-50%, -50%);
    width: 500px;
    height: 350px;
    text-align: center;
    background: #fff;
  }
}
</style>
