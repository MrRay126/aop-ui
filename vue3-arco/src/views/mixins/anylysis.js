import { queryKeys } from "@/views/dashbord/data";
import { param } from "@/utils";
import { OpinionType, MarketType } from "@/views/dashbord/data/index.js";

export const anylysisMixin = {
  methods: {
    handleShare() {
      let url = this.$route.path;

      let query = param({
        [queryKeys.id]: this.$route.query.id || "",
        [queryKeys.projectId]: this.$store.getters.appId,
      });

      this.$copyText(`${window.location.origin}/#${url}?${query}`).then(() => {
        this.$message({
          message: "复制成功",
          type: "success",
        });
      });
    },
  },
};

/*
 * 分析页与分析详情页面数据表的跳转原文、重新标柱、 KOL分析跳转等功能(dimension维度数据中操作列使用的methods)
 *
 **/
export const editTableMixin = {
  data() {
    return {
      emotionOptions: [],
      textTypeOptions: [],
    };
  },

  methods: {
    handleJumpLink(row) {
      if (row.link) {
        window.open(row.link);
      }
    },

    //重新标注
    handleReDimension(row, tableDimensions) {
      if (!row.emotionData) {
        row.emotionData = row.emotion;
      }
      if (!row.textTypeData) {
        row.textTypeData = row.textType;
      }

      this.$set(row, "inEditing", true);
      const textTypeHeader = tableDimensions.find((item) => {
        return item.label === "文本类型";
      });
      const emotionHeader = tableDimensions.find((item) => {
        return item.label === "整体情感";
      });

      textTypeHeader.contentComponent.options = this.textTypeOptions;
      emotionHeader.contentComponent.options = this.emotionOptions;
    },

    jumpAnylysis(row, type) {
      if (type === MarketType.kol) {
        // 跳转kol分析
        this.$router.push({
          path: window.aop[MarketType.kol],
          query: { authorId: row.authorId, channelName: "新浪微博" },
        });
      } else if (type === OpinionType.spread) {
        // 跳转传播分析
        this.$router.push({
          path: window.aop[OpinionType.spread],
          query: { contentId: row.id, channelName: "新浪微博" },
        });
      }
    },

    handleCancel(row) {
      row.inEditing = false;
      // this.getTableData();
      row.emotion = row.emotionData;
      row.textType = row.textTypeData;
    },

    handleUpdate(row, configs) {
      const payload = {
        project_id: this.$store.getters.appId,
        configs: configs,
        row: row,
      };

      row.committing = true;
      return this.$store
        .dispatch("common/updateDetail", payload)
        .then(() => {
          row.inEditing = false;
          this.$message({
            message: "更新成功!",
            type: "success",
          });
        })
        .catch(() => {
          row.emotion = row.emotionData;
          row.textType = row.textTypeData;
        })
        .finally(() => {
          row.inEditing = false;
          row.committing = false;
        });
    },

    // 获取整体情感options选项
    getEmotionOptions() {
      const params = {
        project_id: this.$store.getters.appId,
      };
      this.$store.dispatch("common/getEmotionOptions", params).then((data) => {
        this.emotionOptions = data;
      });
    },

    // 获取文本类型options选项
    getTextTypeOptions() {
      const params = {
        project_id: this.$store.getters.appId,
      };
      this.$store.dispatch("common/getTextTypeOptions", params).then((data) => {
        this.textTypeOptions = data;
      });
    },
  },
};
