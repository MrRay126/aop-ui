import { MarketType, OpinionType } from "@/views/dashbord/data/index.js";
import { wordCloud } from "@/views/opinionAnalysis/competition/data.js";

export const bigCardMixin = {
  methods: {
    //获取卡片自身的显示状态:显示主页面或详情页面
    //如果是详情页面则获取对应配置数据
    getCardStatus(reportType, card) {
      const status = {
        isViewDetail: false,
        detailConfigs: null,
      };
      // kol分析
      const isKol = reportType === MarketType.kol;
      // 竞品分析的词云模块
      const isCompetitionWordCloud =
        reportType == OpinionType.competition &&
        card.report.configs.anylysisType === wordCloud;

      // kol大卡详情数据情况比较多
      if (isKol) {
        if (this.isViewXiaZuan) {
          // 下钻
          const data = this.$refs["xiaZuanInfo"]?._getDownloadConfigs();
          return {
            isXiazuan: true,
            configs: data,
          };
        } else if (this.isViewInfos) {
          //主页面
          ///明细模式
          if (this.mode === "detail") {
            return {
              isViewDetail: false,
              detailConfigs: this.getParams(),
            };
          } else if (this.mode === "trend") {
            const data = this.$refs["trendInfo"]._getDownloadConfigs();
            return {
              isViewDetail: false,
              detailConfigs: data.configs,
            };
          }
        } else {
          //详情
          return {
            isViewDetail: true,
            detailConfigs: this.getMainDetailConfigs(),
          };
        }
      } else if (isCompetitionWordCloud) {
        status.isViewDetail = false;
        return status;
      } else {
        // 其他分析卡片
        if (this.isViewXiaZuan) {
          // 下钻
          const data = this.$refs["xiaZuanInfo"]?._getDownloadConfigs();
          return {
            isXiazuan: true,
            configs: data,
          };
        } else if (this.isViewInfos) {
          //主页面
          return {
            isViewDetail: false,
            detailConfigs: null,
          };
        } else {
          //详情
          return {
            isViewDetail: true,
            detailConfigs: this.$refs["detailTable"]?.getParams(),
          };
        }
      }

      return status;
    },
  },
};
