<template>
  <!-- 数据详情 -->
  <div class="detail-table" ref="detailTable">
    <template v-if="!isViewXiaZuan">
      <div>
        <!-- source::: {{ source }} -->
        <dynamic-table
          :height="tableHeight"
          :dimension="dimensions"
          :source="source"
          :filter="filter"
          :filterOptions="filterOptions"
          sortMode="single"
          :pager="pager"
          :loading="isLoading"
          :contentHandler="preDealContent"
          @getTableData="handleDynamicTableGetData"
        ></dynamic-table>
      </div>
    </template>

    <template v-else>

      <template v-if="isViewInfos">
        <div class="xia-zuan-container">
          <div class="top-title">
            <span class="return-button" type="text" @click="handleReturnClick">
              返回</span
            >
            <span class="down-dimension-title"> / 下钻分析</span>
          </div>
          <div class="down-dimension">
            <xia-zuan-info
              ref="xiaZuanInfo"
              :viewConfigs="{
                wordChartHeight: 400,
                wordTableHeight: 400,
                spreadChartHeight: 415,
                spreadTableHeight: 415,
                isTimeLineVisible: false,
              }"
              :datas="{
                ...cardConfigs,
                row: xiaZuanRow,
                project_id: $store.getters.appId,
              }"
            ></xia-zuan-info>
          </div>
        </div>
      </template>
      <template v-else>
        <!-- 详情备用 -->
      </template>
    </template>
  </div>
</template>
<script>
import dynamicTable from "@/views/components/dynamicTable";
import xiaZuanInfo from "@/views/components/xiaZuan/info.vue";
import { bigCardMixin } from "@/views/mixins/card.js";

export default {
  mixins: [bigCardMixin],
  props: {
    //分析的配置
    cardConfigs: {
      type: Object,
      default() {
        return null;
      },
    },

    //数据标记处理颜色
    markContentWords: {
      type: Array,
      default: null,
    },

    selectsFilters: {
      type: Array,
      default() {
        return [];
      },
    },
  },
  components: {
    dynamicTable,
    xiaZuanInfo,
  },

  data() {
    return {
      isViewInfos: true,
      xiaZuanRow: {},
      isViewXiaZuan: false,
      isLoading: false,
      source: [],
      time: {},
      dimensions: [
        // {
        //   width: "50px",
        //   actionType: "expand", //
        //   expandContentHtmlHandler: (header, row) => {
        //     return `<div style="padding:30px;line-height:25px;">${JSON.stringify(
        //       row.info,
        //       null,
        //       5
        //     )}</div>`;
        //   },
        // },

        {
          label: "商品名称",
          prop: "productName",
          width: "200px",
          actionType: "search", // 排序类型
          hasTooltip: true,
        },
        {
          label: "内容",
          prop: "content",
          actionType: "", // 排序类型
          width: "350px",
          hasTooltip: true,
        },
        {
          label: "二级标签",
          prop: "period",
          // hasTooltip: false,
          width: "120px",
          actionType: "filter", // 排序类型
        },
        {
          label: "微博类型",
          prop: "weiboType",
          width: "100px",
          // hasTooltip: true,
          actionType: "filter", // 排序类型
        },
        {
          label: "发布时间",
          prop: "publishTime",
          actionType: "sort",
          width: "200px",
          // hasTooltip: true,
        },

        {
          label: "转发数",
          prop: "repostsCount",
          actionType: "sort",
          width: "100px",
        },
        {
          label: "评论数",
          prop: "commentsCount",
          actionType: "sort",
          width: "80px",
        },
        {
          label: "点赞数",
          prop: "attitudesCount",
          actionType: "sort",
          width: "80px",
        },

        {
          label: "操作",
          prop: "",
          width: "200px",
          isActionColumn: true, // 是否是操作列 查看、删除等

          actions: [
            {
              name: "jumpOriginalArticleLink", // 操作过程使用手动设置loading的情况 $set(row,'cancel',true)
              loadingRowTag: "", // 操作过程自动loading设置任意值
              //函数或字符串
              label: "跳转原文",

              ifShow(row) {
                // this指向dynamic-table的父组件
                return true;
              },

              ifDisabled(row) {
                // this指向dynamic-table的父组件
                return false;
              },

              action(row) {
                // this指向dynamic-table的父组件
                return this.handleJumpLink(row);
              },
            },

            {
              name: "downdimension", // 操作过程使用手动设置loading的情况 $set(row,'cancel',true)
              loadingRowTag: "", // 操作过程自动loading设置任意值
              //函数或字符串
              label: "下钻分析",

              ifShow(row) {
                // this指向dynamic-table的父组件
                return true;
              },

              ifDisabled(row) {
                // this指向dynamic-table的父组件
                return false;
              },

              action(row) {
                // this指向dynamic-table的父组件
                return this.handleDowndimension(row);
              },
            },
          ],
        },
      ],

      filterOptions: {},
      filter: {},

      pager: {
        curPage: 1,
        pageSize: 10,
        total: 0,
      },
      tableHeight: 300,

      emotionOptions: [],
      textTypeOptions: [],
    };
  },

  watch: {
    cardConfigs: {
      handler(val) {
        console.log(val);
        if (val?.filter) {
          this.filter = val.filter;
        }
        if (val?.time) {
          this.time = val.time;
        }
      },
    },
  },

  methods: {
    handleReturnClick() {
      this.isViewXiaZuan = false;
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

    handleJumpLink(row) {
      if (row.link) {
        window.open(row.link);
      }
    },

    handleDowndimension(row) {
      this.isViewXiaZuan = true;
      this.xiaZuanRow = row;
    },

    handleDynamicTableGetData(data) {
      this.filter = data.filter;
      this.pager = data.pager;
      this.getTableData();
    },

    preDealContent(header, content) {
      // 数据标记处理颜色
      if (header.prop === "content" && Array.isArray(this.markContentWords)) {
        this.markContentWords.forEach((word) => {
          content = this.markContent(content, word);
        });
      }

      // 数据映射处理
      if (["textType", "emotion"].includes(header.prop)) {
        content = content ? content.label : "";
      }

      return content;
    },
    markContent(content, word) {
      let reg = new RegExp(`(${word})`, "g");
      content = content.replace(reg, "<span style='color:red'>$1</span>");
      return content;
    },

    //api获取更多详情数据
    getTableData(cb) {
      // use this.pager
      this.isLoading = true;
      this.source = [];
      let payload = this.getParams();
      let that = this;
      this.$store
        .dispatch("dashbord/getLeciyuanTableData", payload)
        .then((data) => {
          that.source = data.list.map((item) => {
            return {
              ...item,
              textTypeData: item.textType,
              emotionData: item.emotion,
            };
          });
          that.pager.total = data.pager.total;
          that.filterOptions = data.filterOptions || {};
        })
        .catch((error) => {
          //noop
          console.log(error);
        })
        .finally(() => {
          this.isLoading = false;
          cb && cb();
        });
    },
    // 外部会调用
    getParams() {
      return {
        time: this.time,
        pager: this.pager,
        tableFilter: this.filter,
        ...this.cardConfigs,
        project_id: this.$store.getters.appId,
      };
    },

    //浏览具体的网页
    jumpToViewDataPage({ row }) {
      // console.log("row:", row);
      if (row.link) {
        window.open(row.link);
      } else {
        this.$message({
          message: "该内容无外部链接!",
          duration: 3000,
          type: "info",
        });
      }
    },

    setTableHeight() {
      window.addEventListener(
        "resize",
        () => {
          clearTimeout(this.timeO);
          this.timeO = setTimeout(() => {
            if (this.$refs["detailTable"]) {
              this.tableHeight =
                this.$refs["detailTable"].getBoundingClientRect().height - 80;
            }
          }, 1000);
        },
        false
      );

      this.$nextTick(() => {
        if (this.$refs["detailTable"]) {
          this.tableHeight =
            this.$refs["detailTable"].getBoundingClientRect().height - 80;
        }
      });
    },

    refresh(cb) {
      this.getTableData(cb);
    },
  },
  mounted() {
    this.setTableHeight();
    // this.getTableData();
    this.getTextTypeOptions();
    this.getEmotionOptions();
  },
  created() {},
};
</script>
<style lang="scss" scoped>
@import "@/styles/index.scss";

.xia-zuan-container {
  width: 100%;
  height: 100%;
  display: flex;
  align-content: center;
  justify-content: flex-start;
  flex-direction: column;

  .top-title {
    .return-button {
      font-size: 14px;
      cursor: pointer;
      color: $color-text;
      &:hover {
        color: $color-primary;
      }
    }
    .down-dimension-title {
      font-size: 14px;
      color: $color-text;
    }
  }

  .down-dimension {
    overflow: auto;
  }

  ::v-deep {
    .info {
      background-color: #fff;
      height: calc(100%);
      padding-top: 0;
      overflow: initial;

      .page {
        background-color: #fff;
      }

      .left {
        padding-top: 0;
      }

      .anylysis-section {
        height: calc(100% - 60px);
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
  }
}

.detail-table {
  height: 100%;
  width: 100%;
  padding: 15px;
}
</style>
