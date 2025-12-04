<template>
  <div class="warn">
    <div class="top">
      <div class="left">
        <span class="title-text">预警管理</span>
        <el-tooltip
          effect="light"
          placement="right"
          content="对玩家议论的风险，外挂，BUG等期望使用者尽快展开行动的舆情进行自定义的配置，支持飞书的通知及简报发送。"
        >
          <i class="el-icon-info" style="font-size: 14px"></i>
        </el-tooltip>
      </div>
      <div class="right">
        <template v-if="isDeleteStatus">
          <span class="delete-btn-wraper">
            <el-button
              type="danger"
              size="mini"
              :loading="isDeleteting"
              @click="handleDelete"
            >
              删除
            </el-button>
          </span>
          <span class="cancel-btn">
            <el-button @click="handleCancelDelete" size="mini" plain>
              取消
            </el-button>
          </span>
        </template>
        <template v-else>
          <span class="btn-wrapper">
            <el-button type="primary" size="mini" @click="handleCreateWarn"
              >+ 创建预警</el-button
            >
          </span>
          <el-input
            size="mini"
            v-model="search"
            @input="handleSearch"
            suffix-icon="el-icon-search"
          >
          </el-input>
        </template>
      </div>
    </div>
    <div class="table-container">
      <dynamic-table
        :height="600"
        :dimension="dimenssion"
        :source="tableData"
        :filter="filter"
        :filterOptions="filterOptions"
        :pager="pager"
        :loading="isLoading"
        :contentHandler="preDealContent"
        :selections="multipleSelection"
        sortMode="single"
        @rowClick="handleRowClick"
        @getTableData="handleGetTableData"
        @selectChange="handleSelectionChange"
      ></dynamic-table>
    </div>
  </div>
</template>
<script>
import numeral from "numeral";
import { save } from "@/utils";
import { SessionKey, CalcPeriodMaps, dimenssion } from "./data";
import dynamicTable from "@/views/components/dynamicTable/index.vue";
import { bordType, queryKeys } from "../../dashbord/data";

export default {
  name: "warn",
  components: {
    dynamicTable,
  },

  props: {},
  data() {
    return {
      dimenssion,

      filterOptions: {},
      filter: {},

      pager: {
        curPage: 1,
        pageSize: 10,
        total: 10,
      },
      sort: {
        prop: "hit_count",
        order: "",
      },
      search: "",
      isDeleteting: false,
      tableData: [],
      multipleSelection: [],
      isLoading: false,
    };
  },
  computed: {
    isDeleteStatus() {
      return this.multipleSelection.length > 0;
    },
  },
  watch: {
    "$store.getters.appId": {
      immediate: true,
      handler(val) {
        if (val) {
          this.getTableList();
        }
      },
    },
  },
  methods: {
    // 处理行点击
    handleRowClick(payload) {
      // console.log("row:::", row);
      const { row, header } = payload;
      if (header.prop === "name" && row.id) {
        this.handleWarnNameClick(row.id, row.name);
      }
    },

    // 预处理表格内容
    preDealContent(header, content) {
      if (header.prop === "calculatePeriod") {
        return CalcPeriodMaps[content];
      }

      if (header.prop === "name") {
        return `<a class="clickable">${content}</a>`;
      }

      return content;
    },
    numeral,

    handleWarnNameClick(id, name) {
      // 跳转到对应的报警看板页面
      save(SessionKey.dashbordType, "warn");
      save(SessionKey.warnBordId, id);
      this.$router.push({
        path: window.aop.dashbord,
        query: {
          [queryKeys.id]: id,
          [queryKeys.type]: bordType.warn,
          [queryKeys.warnName]: name,
        },
      });
    },
    //table列排序改变
    handleSortChange(sort) {
      this.sort = { prop: sort.prop, order: sort.order };
      this.getTableList();
    },

    //filter search
    handleSearch() {
      // console.log(this.search);
      clearTimeout(this.timer);
      this.timer = setTimeout(() => {
        this.pager.curPage = 1;
        this.getTableList();
      }, 300);
    },

    //table勾选复选框
    handleSelectionChange(val) {
      this.multipleSelection = val;
    },

    //设置
    handleTableRowSet(row) {
      this.$router.push({
        path: window.aop.warnConfig,
        query: { id: row.id },
      });
    },

    handleCancelDelete() {
      this.multipleSelection = [];
    },

    //删除设置
    handleDelete() {
      this.$confirm("确定要删除吗?", "提示").then(() => {
        this.isDeleteting = true;
        const ids = this.multipleSelection.map((item) => item.id);
        this.$store
          .dispatch("warn/deleteWarnTableData", { ids })
          .then(() => {
            //只提示订阅成功 , 订阅失败是否存在, 由code码控制?
            this.$message({
              message: "删除成功!",
              duration: 3000,
              type: "success",
            });

            this.getTableList();
          })
          .catch(() => {
            //noop
          })
          .finally(() => {
            this.isDeleteting = false;
          });
      });
    },

    handleCreateWarn() {
      this.$router.push({
        path: window.aop.warnConfig,
      });
    },

    handleChangePage() {
      this.getTableList();
    },

    handleSizeChange() {
      this.pager.curPage = 1;
      this.getTableList();
    },

    //订阅报警
    // handleReserve(row, isSubscribe) {
    //   this.$set(row, "isSubscribing", true);

    //   const url = isSubscribe
    //     ? "warn/subscribeWarn"
    //     : "warn/cancleSubscribeWarn";
    //   this.$store
    //     .dispatch(url, { id: row.id })
    //     .then(() => {
    //       //只提示订阅成功 , 订阅失败是否存在, 由code码控制?
    //       this.$message({
    //         message: `${isSubscribe ? "" : "取消"}订阅成功!`,
    //         duration: 3000,
    //         type: "success",
    //       });

    //       this.getTableList();
    //     })
    //     .catch(() => {
    //       //noop
    //     })
    //     .finally(() => {
    //       this.$set(row, "isSubscribing", false);
    //     });
    // },

    handleGetTableData(data) {
      this.pager = data.pager;
      this.filter = data.filter;
      this.getTableList();
    },

    getTableList() {
      this.multipleSelection = [];
      this.isLoading = true;
      const params = {
        project_id: this.$store.getters.appId,
        curPage: this.pager.curPage,
        pageSize: this.pager.pageSize,
        ...this.filter,
        // ordering:
        //   this.sort.order === "ascending" ? "+" : "-" + this.sort["prop"],
        search: this.search,
      };

      this.$store
        .dispatch("warn/getWarnTableData", params)
        .then((res) => {
          const resData = res;
          this.tableData = resData.results;

          this.pager = resData.pager;
          this.sort = resData.sort;

          // console.log("this.pager::", this.pager);
        })
        .catch(() => {
          //noop
        })
        .finally(() => {
          this.isLoading = false;
        });
    },
  },
};
</script>
<style lang="scss" scoped>
@import "@/styles/index.scss";

.tool-tip-content {
  max-width: 400px;
}

.warn {
  padding: 20px;
  height: 100%;
  background-color: $background-color;

  .ellipse-text {
    white-space: pre;
    overflow: hidden;
    text-overflow: ellipsis;
    display: inline;
  }

  .top {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 10px;
    background-color: #fff;
    margin-bottom: 10px;

    .left {
      .title-text {
        font-size: 16px;
        margin-left: 10px;
        font-weight: bold;
      }

      .el-icon-info {
        margin-left: 3px;
        color: $color-text;
      }
    }

    .right {
      display: flex;
      align-items: center;
      justify-content: space-between;

      .btn-wrapper {
        margin-right: 10px;
      }

      .delete-btn-wraper {
        margin-right: 10px;
      }
    }
  }

  .table-container {
    background: #fff;
    padding-bottom: 30px;

    .pagination {
      display: inline-block;
      margin-top: 20px;
      margin-left: 50%;
      transform: translateX(-50%);
    }

    .warn-name {
      color: $color-primary;
      cursor: pointer;
      &:hover {
        text-decoration: underline;
      }
    }

    .grade-tag {
      &:not(:first-child) {
        margin-left: 5px;
      }
    }

    .des-text-wraper {
      width: 100%;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: pre;
    }

    .description {
      max-width: 300px;
    }
  }
}
</style>
