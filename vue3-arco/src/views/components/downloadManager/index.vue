<template>
  <div class="download-manager">
    <el-drawer
      :visible="visible"
      direction="rtl"
      size="1000px"
      :before-close="handleClose"
      @opened="handleOpen"
    >
      <template slot="title">
        <div class="title-container">
          <div>
            <span class="title">任务管理</span>
            <span class="des">
              ( 查看和操作最近24小时的下载及长时间分析任务 )</span
            >
          </div>
          <el-input
            placeholder="请输入"
            class="search-input"
            :clearable="true"
            v-model="searchText"
            @input="handleSearch"
          >
            <template slot="append">
              <i class="el-icon-search" @click="handleSearchClick"></i>
            </template>
          </el-input>
        </div>
      </template>
      <div class="table-container" ref="tableContainer">
        <dynamic-table
          :height="tableHeight"
          :dimension="dimenssion"
          :source="source"
          :filter="tableFilter"
          :filterOptions="filterOptions"
          :pager="pager"
          :loading="loading"
          :contentHandler="preDealContent"
          @getTableData="getTableData"
        ></dynamic-table>
      </div>
    </el-drawer>

    <ai-asisstant
      :visible="assVisible"
      :viewId="summaryId"
      @close="handleCloseViewAiSummary"
    ></ai-asisstant>
  </div>
</template>
<script>
import dynamicTable from "@/views/components/dynamicTable/index.vue";
import { exportByUrl } from "@/utils";
import { OpinionType } from "@/views/dashbord/data";
import AiAsisstant from "@/views/components/aiSummary/aiAsisstant.vue";

export default {
  props: {
    visible: {
      default: false,
      type: Boolean,
    },
  },
  components: {
    dynamicTable,
    AiAsisstant,
  },
  data() {
    return {
      assVisible: false,
      summaryId: 0,
      //   visible: true,
      loading: false,
      tableHeight: 300,
      source: [],
      dimenssion: [
        {
          label: "任务名称",
          prop: "name",
          minWidth: "150px",
          hasTooltip: true, //是否使用toolTip
        },
        {
          label: "发起时间",
          prop: "startTime",
          actionType: "sort", // 排序类型
          width: "180px",
          // hasTooltip: true,
        },
        {
          label: "任务状态",
          prop: "status",
          width: "100px",
          hasTooltip: false,
          contentType: "tags",
          tagType: {
            success: "success",

            pending: "warning",
            processing: "warning",

            failed: "danger",
            cancel: "danger",

            default: "primary",
          },
        },
        {
          label: "任务耗时",
          prop: "costTime",
          width: "100px",
          hasTooltip: false,
        },

        {
          label: "文件大小",
          prop: "fileSize",
          width: "100px",
          hasTooltip: false,
        },
        {
          label: "归属模块",
          prop: "ownModule",
          width: "150px",
          actionType: "filter", // 排序类型
          hasTooltip: false,
        },
        {
          label: "操作",
          prop: "",
          width: "100px",

          isActionColumn: true, // 是否是操作列 查看、删除等
          actions: [
            {
              //或字符串 "下载",
              label: (row) => {
                const dict = {
                  数据下载: "下载",
                  主题分析: "跳转页面",
                  AI总结: "查看",
                };

                return dict[row.ownModule];
              },

              loadingRowTag: "loading", //自动 设置row 的这这属性为true启用loading 否则关闭loading

              ifShow: (row) => {
                return true;
              },

              ifDisabled: (row) => {
                return row.status !== "success";
              },

              action: (row) => {
                if (row.ownModule === "数据下载") {
                  return this.handleDownload(row);
                } else if (row.ownModule === "主题分析") {
                  // 主题分析页面
                  this.jumpPage(row);
                } else if (row.ownModule === "AI总结") {
                  //查看ai总结
                  this.handleViewAiSummary(row.id);
                }
              },
            },
          ],
        },
      ],

      filterOptions: {},
      tableFilter: {},

      pager: {
        curPage: 1,
        pageSize: 10,
        total: 0,
      },

      /**
        PENDING = 0, _('pending')
        PROCESSING = 1, _('processing')
        SUCCESS = 2, _('success')
        FAILED = 3, _('failed')
        CANCEL = 4, _('cancel')
       */
      statusDict: {
        pending: "等待中",
        processing: "执行中",
        cancel: "取消",
        success: "成功",
        failed: "失败",
      },
      searchText: "",
    };
  },

  methods: {
    handleCloseViewAiSummary() {
      this.assVisible = false;
    },

    handleViewAiSummary(id) {
      this.summaryId = id;
      this.assVisible = true;
    },

    jumpPage(row) {
      const dict = {
        主题分析: OpinionType.topic,
      };

      const routeName = dict[row.ownModule];
      if (routeName) {
        this.$router.replace({
          name: routeName,
          query: { id: row.id },
        });
        this.handleClose();
      }
    },

    preDealContent(header, content) {
      if (header.prop === "status") {
        content = this.statusDict[content];
      }
      return content;
    },
    handleClose() {
      this.$emit("close");
    },

    handleOpen() {
      // console.log("opemd");
      this.setHeightOfTable();
      this.getTableData();
    },

    setHeightOfTable() {
      this.$nextTick(() => {
        if (this.$refs["tableContainer"]) {
          this.tableHeight =
            this.$refs["tableContainer"].getBoundingClientRect().height - 100;
        }
      });
    },

    handleSearch() {
      clearTimeout(this.timer);
      this.timer = setTimeout(() => {
        this.getTableData();
      }, 300);
    },

    handleSearchClick() {
      this.getTableData();
    },

    handleDownload(row) {
      if (row.status) {
        const payload = {
          project_id: this.$store.getters.appId,
          id: row.id,
        };

        return this.$store
          .dispatch("task/download", payload)
          .then((data) => {
            if (data.url) {
              exportByUrl(data.url);
              this.$message({
                message: "下载成功!",
                type: "success",
              });
            } else {
              this.$message({
                message: "下载链接不存在!",
                type: "info",
              });
            }
          })
          .catch(() => {
            // noop
          });
      }
    },

    handleOpenAnylysis(row) {
      const jumpPath = window.aop[row.reportType];
      const routerId = this.$route.query.id;
      const routerPath = this.$route.path;
      if (routerId != row.id || jumpPath !== routerPath) {
        this.$router.replace({
          path: jumpPath,
          query: {
            id: row.id,
          },
        });
      }
      this.handleClose();
    },

    deleteTask(id) {
      const payload = {
        id,
        project_id: this.$store.getters.appId,
      };

      this.$store
        .dispatch("task/deleteTask", payload)
        .then(() => {
          this.$message({
            message: "删除成功!",
            type: "success",
          });
          this.getTableData();
        })
        .catch(() => {
          // noop
        });
    },

    getQueryParams(payload, obj) {
      for (let prop in obj) {
        payload[prop] = obj[prop];
      }
      return payload;
    },

    getTableData() {
      let payload = {
        project_id: this.$store.getters.appId,
        // pager: this.pager,
        // filter: this.tableFilter,
        search: this.searchText,
      };

      payload = this.getQueryParams(payload, this.pager);
      payload = this.getQueryParams(payload, this.tableFilter);
      delete payload.total;

      this.loading = true;
      this.$store
        .dispatch("task/getTableData", payload)
        .then((data) => {
          this.source = data.list;
          this.filterOptions = data.filterOptions;
          this.pager = data.pager;
        })
        .catch(() => {
          // noop
        })
        .finally(() => {
          this.loading = false;
        });
    },

    listenWindowResize() {
      window.addEventListener(
        "resize",
        () => {
          this.setHeightOfTable();
        },
        false
      );
    },
  },

  mounted() {
    this.listenWindowResize();
  },
};
</script>
<style lang="scss" scoped>
@import "@/styles/index.scss";
.download-manager {
  .search-input {
    width: 260px;
    margin-right: 50px;

    .el-icon-search {
      cursor: pointer;
    }
  }

  .table-container {
    .pagination-container {
      text-align: center;

      .pagination {
        display: inline-block;
      }
    }
  }

  .title-container {
    display: flex;
    justify-content: space-between;
    align-items: center;

    .title {
      font-weight: bold;
      color: $color-text;
    }
  }

  .table-container {
    height: 100%;
    width: 100%;
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
