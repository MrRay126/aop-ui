<template>
  <!-- 数据详情 -->
  <div class="detail-table" ref="detailTable">
    <!-- detailTableHeight:::{{ detailTableHeight }} -->
    <dynamic-table
      :height="detailTableHeight"
      :dimension="tableDimensions"
      :source="moreDetailTable"
      :filter="filter"
      :filterOptions="filterOptions"
      sortMode="single"
      :pager="pager"
      :loading="isLoadingMoreDetailTable"
      :contentHandler="preDealContent"
      @getTableData="handleDynamicTableGetData"
    ></dynamic-table>
  </div>
</template>
<script>
import dynamicTable from "../dynamicTable";
import { OpinionType, MarketType } from "@/views/dashbord/data/index.js";

export default {
  props: {
    //分析的配置
    configs: {
      type: Object,
      default() {
        return null;
      },
    },

    tablePager: {
      type: Object,
      default() {
        return null;
      },
    },

    tableFilter: {
      type: Object,
      default() {
        return null;
      },
    },

    apiAction: {
      type: String,
      default: "",
    },

    //数据标记处理颜色
    markContentWords: {
      type: Array,
      default: null,
    },
  },

  components: {
    dynamicTable,
  },

  data() {
    return {
      isXiaZuanVisible: false,
      xiaZuanRow: {},
      isLoadingMoreDetailTable: false,
      moreDetailTable: [],
      tableDimensions: [
        {
          width: "50px",
          actionType: "expand", //
          expandContentHtmlHandler: (header, row) => {
            return `<div style="padding:30px;line-height:25px;">${JSON.stringify(
              row.info,
              null,
              5
            )}</div>`;
          },
        },

        {
          label: "渠道-内容类型",
          prop: "channelContentType",
          width: "200px",
          actionType: "filter", // 排序类型
          // hasTooltip: true,
        },
        {
          label: "内容",
          prop: "content",
          hasTooltip: false,
          minWidth: "200px",
        },
        {
          label: "作者名称",
          prop: "authorName",
          // hasTooltip: true,
          width: "200px",
        },
        {
          label: "发布时间",
          prop: "publishTime",
          actionType: "sort",
          width: "200px",
          // hasTooltip: true,
        },
        {
          label: "整体情感",
          prop: "emotion",
          width: "120px",
          actionType: "filter",

          contentType(row) {
            if (row.inEditing) {
              // this 指向自身
              return "component";
            }
            return "";
          },
          //内容组件, 设置content 支持 select input (使用coponent需先指定contentType为 'component')
          contentComponent: {
            handler(row, header) {
              if (row.inEditing) {
                // this 指向自身
                return "select";
              }
            },

            modelProp: "emotion",

            //组件配置项
            config(row) {
              return {
                // multiple: true,
                filterable: true,
                disabled: row.committing,
                "value-key": "value",
              };
            },

            //组件事件
            onChange(row) {},

            // select 组件的options
            options: [],
          },
        },
        {
          label: "文本类型",
          prop: "textType",
          width: "120px",
          hasTooltip: false,
          actionType: "filter",

          contentType(row) {
            if (row.inEditing) {
              // this 指向自身
              return "component";
            }
            return "";
          },
          //内容组件, 设置content 支持 select input (使用coponent需先指定contentType为 'component')
          contentComponent: {
            handler(row, header) {
              if (row.inEditing) {
                // this 指向自身
                return "select";
              }
            },

            modelProp: "textType",

            //组件配置项
            config(row) {
              return {
                // multiple: true,
                filterable: true,
                disabled: row.committing,
                "value-key": "value",
              };
            },

            //组件事件
            onChange(row) {},
            // select 组件的options
            options: [],
          },
        },
        {
          label: "转发数",
          prop: "repostsCount",
          actionType: "",
          width: "100px",
        },
        {
          label: "评论数",
          prop: "commentsCount",
          actionType: "",
          width: "100px",
        },
        {
          label: "点赞数",
          prop: "attitudesCount",
          actionType: "",
          width: "100px",
        },

        {
          label: "操作",
          prop: "",
          width: "260px",
          isActionColumn: true, // 是否是操作列 查看、删除等

          actions: [
            {
              name: "jumpOriginalArticleLink", // 操作过程使用手动设置loading的情况 $set(row,'cancel',true)
              loadingRowTag: "", // 操作过程自动loading设置任意值
              //函数或字符串
              label: "跳转原文",

              ifShow(row) {
                // this指向dynamic-table的父组件
                return !row.inEditing && row.link;
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
              label: "重新标注", // 名称

              ifShow: (row) => {
                // 计算是否显示
                return !row.inEditing;
              },
              ifDisabled: (row) => {
                // 计算disabled
                return false;
              },
              action: (row) => {
                // 操作动作
                return this.handleReDimension(row);
              },
            },

            // {
            //   label: "KOL分析", // 名称
            //   ifShow: (row) => {
            //     // 计算是否显示
            //     return !row.inEditing && row.authorId;
            //   },
            //   ifDisabled: (row) => {
            //     // 计算disabled
            //     return false;
            //   },
            //   action: (row) => {
            //     // 操作动作
            //     this.jumpAnylysis(row, MarketType.kol);
            //   },
            // },

            // {
            //   label: "传播分析", // 名称
            //   ifShow: (row) => {
            //     // 计算是否显示
            //     const channel = row["channelContentType"].split("-")[0];
            //     const contentType = row["channelContentType"].split("-")[1];

            //     return (
            //       !row.inEditing &&
            //       channel === "新浪微博" &&
            //       ["原创微博", "转发微博"].includes(contentType)
            //     );
            //   },
            //   ifDisabled: (row) => {
            //     // 计算disabled
            //     return false;
            //   },
            //   action: (row) => {
            //     // 操作动作
            //     this.jumpAnylysis(row, OpinionType.spread);
            //   },
            // },
            {
              label: "下钻分析", // 名称
              ifShow: (row) => {
                // 计算是否显示
                const needXiazuan = [
                  "新浪微博-转发微博",
                  "新浪微博-原创微博",
                  "BiliBili-视频",
                  "抖音短视频-短视频",
                ].includes(row.channelContentType);
                return !row.inEditing && needXiazuan;
              },
              ifDisabled: () => {
                // 计算disabled
                return false;
              },
              action: (row) => {
                // 操作动作
                return this.handleXiaZuan(row);
              },
            },

            {
              label: "取消", // 名称
              ifShow: (row) => {
                // 计算是否显示
                return row.inEditing;
              },
              ifDisabled: (row) => {
                // 计算disabled
                return row.committing;
              },
              action: (row) => {
                // 操作动作
                return this.handleCancel(row);
              },
            },

            {
              label: "更新", // 名称
              loadingRowTag: true,

              ifShow: (row) => {
                // 计算是否显示
                return row.inEditing;
              },

              ifDisabled: (row) => {
                // 计算disabled
                return false;
              },
              action: (row) => {
                // 操作动作
                return this.handleUpdate(row);
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
      detailTableHeight: 300,

      emotionOptions: [],
      textTypeOptions: [],
    };
  },

  methods: {
    handleXiaZuan(row) {
      this.xiaZuanRow = row;
      this.isXiaZuanVisible = true;
      this.$emit("event", { action: "xiaZuan", data: row });
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

    handleUpdate(row) {
      const payload = {
        project_id: this.$store.getters.appId,
        configs: this.configs,
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

    handleCancel(row) {
      row.inEditing = false;
      // this.getTableData();
      row.emotion = row.emotionData;
      row.textType = row.textTypeData;
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

    handleJumpLink(row) {
      if (row.link) {
        window.open(row.link);
      }
    },

    //重新标注
    handleReDimension(row) {
      this.$set(row, "inEditing", true);
      const textTypeHeader = this.tableDimensions.find((item) => {
        return item.label === "文本类型";
      });
      const emotionHeader = this.tableDimensions.find((item) => {
        return item.label === "整体情感";
      });

      textTypeHeader.contentComponent.options = this.textTypeOptions;
      emotionHeader.contentComponent.options = this.emotionOptions;
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
      if (this.apiAction) {
        this.isLoadingMoreDetailTable = true;
        this.moreDetailTable = [];
        let payload = this.getParams();
        this.$store
          .dispatch(this.apiAction, payload)
          .then((data) => {
            this.moreDetailTable = data.list.map((item) => {
              return {
                ...item,
                textTypeData: item.textType,
                emotionData: item.emotion,
              };
            });
            this.pager = data.pager;
            this.filterOptions = data.filterOptions || {};
          })
          .catch(() => {
            //noop
          })
          .finally(() => {
            this.isLoadingMoreDetailTable = false;

            if (typeof cb === "function") {
              cb();
            }
          });
      }
    },
    // 外部会调用
    getParams() {
      return {
        ...this.configs,
        pager: this.pager,
        tableFilter: this.filter,
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
              this.detailTableHeight =
                this.$refs["detailTable"].getBoundingClientRect().height - 80;
            }
          }, 1000);
        },
        false
      );

      this.$nextTick(() => {
        if (this.$refs["detailTable"]) {
          this.detailTableHeight =
            this.$refs["detailTable"].getBoundingClientRect().height - 80;
        }
      });
    },
  },
  mounted() {
    this.setTableHeight();
    this.getTableData();
    this.getTextTypeOptions();
    this.getEmotionOptions();
  },
};
</script>
<style lang="scss" scoped>
@import "@/styles/index.scss";

.content-wrapper {
  display: inline-block;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  width: 100%;
}

.tooltip-content-inner {
  max-width: 400px;
}

.detail-table {
  height: 100%;
  width: 100%;
  padding: 15px;

  .xia-zuan-info {
    height: 100%;
  }

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
</style>
