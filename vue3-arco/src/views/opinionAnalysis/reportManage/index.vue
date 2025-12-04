<template>
  <!-- 报表管理 -->
  <div class="view-manange">
    <div class="top-banner">
      <span class="title">
        <span>报表管理</span>
        <el-tooltip
          content="仅展示可访问的报表"
          effect="light"
          placement="top-start"
        >
          <i class="el-icon-question"></i>
        </el-tooltip>
      </span>
      <template v-if="multipleSelection.length > 0">
        <span>
          <el-button
            @click="handleMultipleDelete"
            :loading="isDeleting"
            type="danger"
            size="mini"
            >删除</el-button
          >

          <el-button
            @click="handleCancelMutipleDelete"
            :loading="isDeleting"
            type="plain"
            size="mini"
            >取消</el-button
          >
        </span>
      </template>
      <template v-else>
        <el-input
          class="search-input"
          size="mini"
          placeholder="请输入查找内容"
          v-model="filter.search"
          suffix-icon="el-icon-search"
          @input="handleSearchInput"
        ></el-input>
      </template>
    </div>
    <div class="table-container">
      <!-- <template>
        <el-table
          :data="tableData.source"
          max-height="600"
          v-loading="isLoadingTable"
          @selection-change="handleSelectionChange"
        >
          <el-table-column
            type="selection"
            width="55"
            :selectable="setCheckboxSelectable"
          >
          </el-table-column>
          <template v-for="(headerItem, index) in tableDimensions">
            <template v-if="headerItem.actionType === 'sort'">
              <el-table-column :key="index" :width="headerItem.width">
                <template #header>
                  <div class="sortable-header">
                    <span>{{ headerItem.label }}</span>
                    <span class="sort-container">
                      <span
                        class="el-icon-caret-top"
                        :class="{
                          'focus-sort': filter[headerItem.prop] === 'ascending',
                        }"
                        @click="handleSort(headerItem, 'ascending')"
                      ></span>
                      <span
                        class="el-icon-caret-bottom"
                        :class="{
                          'focus-sort':
                            filter[headerItem.prop] === 'descending',
                        }"
                        @click="handleSort(headerItem, 'descending')"
                      ></span>
                    </span>
                  </div>
                </template>
                <template #default="scope">
                  <div class="value-container">
                    <template v-if="headerItem.hasContentTooltip">
                      <el-tooltip placement="top-start" effect="light">
                        <div slot="content" class="tooltip-content-inner">
                          {{ scope.row[headerItem.prop] || "-" }}
                        </div>

                        <span>
                          {{ scope.row[headerItem.prop] || "-" }}
                        </span>
                      </el-tooltip>
                    </template>
                    <template v-else>
                      <span>
                        {{ scope.row[headerItem.prop] || "-" }}
                      </span>
                    </template>
                  </div>
                </template>
              </el-table-column>
            </template>

            <template v-else-if="headerItem.actionType === 'filter'">
              <el-table-column
                :key="index"
                :width="headerItem.width"
                class="table"
              >
                <template #header>
                  <div class="sortable-header">
                    <span>{{ headerItem.label }}</span>
                    <el-dropdown @command="handleSort(headerItem, $event)">
                      <span>
                        <svg-icon
                          icon-class="filter-fill"
                          size="14"
                          class="filter-icon"
                        ></svg-icon>
                      </span>

                      <el-dropdown-menu slot="dropdown">
                        <template
                          v-for="(item, index) in getFilterOptions(
                            headerItem.prop
                          )"
                        >
                          <el-dropdown-item :command="item.value" :key="index">
                            <span
                              :class="{
                                'focus-drop-down-item':
                                  filter[headerItem.prop] == item.value,
                              }"
                              :style="{
                                color:
                                  filter[headerItem.prop] == item.value
                                    ? '#2d8cf0'
                                    : '',
                              }"
                            >
                              {{ item.label }}
                            </span>
                          </el-dropdown-item>
                        </template>
                      </el-dropdown-menu>
                    </el-dropdown>
                  </div>
                </template>
                <template #default="scope">
                  <template v-if="headerItem.hasContentTooltip">
                    <el-tooltip placement="top-start" effect="light">
                      <div slot="content" class="tooltip-content-inner">
                        <template v-if="headerItem.valueMap">
                          {{ getColumnMapValue(headerItem, scope) }}
                        </template>
                        <template v-else>
                          {{ scope.row[headerItem.prop] || "-" }}
                        </template>
                      </div>

                      <span>
                        <template v-if="headerItem.valueMap">
                          {{ getColumnMapValue(headerItem, scope) }}
                        </template>
                        <template v-else>
                          {{ scope.row[headerItem.prop] || "-" }}
                        </template>
                      </span>
                    </el-tooltip>
                  </template>
                  <template v-else>
                    <span>
                      <template v-if="headerItem.valueMap">
                        {{ getColumnMapValue(headerItem, scope) }}
                      </template>
                      <template v-else>
                        {{ scope.row[headerItem.prop] || "-" }}
                      </template>
                    </span>
                  </template>
                </template>
              </el-table-column>
            </template>

            <template v-else-if="headerItem.actionType === 'info'">
              <el-table-column
                :key="index"
                :width="headerItem.width"
                class="table"
              >
                <template #header>
                  <div class="sortable-header">
                    <span>{{ headerItem.label }}</span>
                    <el-tooltip
                      :content="headerItem.tip"
                      effect="light"
                      placement="top-start"
                    >
                      <i class="el-icon-question"></i>
                    </el-tooltip>
                  </div>
                </template>
                <template #default="scope">
                  <template v-if="headerItem.hasContentTooltip">
                    <el-tooltip placement="top-start" effect="light">
                      <div slot="content" class="tooltip-content-inner">
                        {{ scope.row[headerItem.prop] || "-" }}
                      </div>

                      <span>
                        {{ scope.row[headerItem.prop] || "-" }}
                      </span>
                    </el-tooltip>
                  </template>
                  <template v-else>
                    <span>
                      {{ scope.row[headerItem.prop] || "-" }}
                    </span>
                  </template>
                </template>
              </el-table-column>
            </template>

            <template v-else>
              <el-table-column :label="headerItem.label" :key="index">
                <template #default="scope">
                  <div class="value-container">
                    <template v-if="headerItem.hasContentTooltip">
                      <el-tooltip placement="top-start" effect="light">
                        <div slot="content" class="tooltip-content-inner">
                          {{ scope.row[headerItem.prop] || "-" }}
                        </div>
                        <span>
                          {{ scope.row[headerItem.prop] || "-" }}
                        </span>
                      </el-tooltip>
                    </template>
                    <template v-else>
                      <span>
                        {{ scope.row[headerItem.prop] || "-" }}
                      </span>
                    </template>
                  </div>
                </template>
              </el-table-column>
            </template>
          </template>
          <el-table-column label="操作">
            <template #default="scope">
              <template v-if="scope.row.perms.edit">
                <el-button @click="handleEdit(scope.row)" type="text"
                  >修改</el-button
                >
              </template>
              <template v-if="scope.row.perms.remove">
                <el-button
                  @click="handleDeleteRow(scope.row)"
                  type="text"
                  :loading="scope.row.isDeleting"
                  >删除</el-button
                >
              </template>
            </template>
          </el-table-column>
        </el-table>

        <div class="pagination-container">
          <el-pagination
            class="pagination"
            layout="sizes,total,  prev, pager, next, jumper"
            background
            @current-change="handlePageChange"
            @size-change="handleSizeChange"
            :current-page.sync="pager.curPage"
            :page-size.sync="pager.pageSize"
            :total="pager.total"
          ></el-pagination>
        </div>
      </template> -->

      <dynamic-table
        :height="600"
        :dimension="tableDimensions"
        :source="tableData.source"
        :filter="filter"
        :filterOptions="filterOptions"
        :pager="pager"
        :loading="isLoadingTable"
        :selections="multipleSelection"
        :contentHandler="preDealContent"
        @getTableData="handleGetTableData"
        @selectChange="handleSelectionChange"
      ></dynamic-table>
    </div>
  </div>
</template>
<script>
import { OpinionType, viewTypesLabel } from "@/views/dashbord/data";
import dynamicTable from "@/views/components/dynamicTable/index.vue";

export default {
  props: {},
  components: {
    dynamicTable,
  },
  data() {
    return {
      isDeleting: false,
      multipleSelection: [],
      isLoadingTable: false,
      tableData: {
        source: [],
        filterOptions: {
          // levels: [
          //   { label: "一级", value: 1 },
          //   { label: "二级", value: 2 },
          //   { label: "三级", value: 3 },
          // ], // 字段levels的过滤选项列表
          // channel: [{ label: "微博", value: "weibo" }],
          // tag: [{ label: "tag1", value: "tag1" }],
        },

        pager: {
          curPage: 1,
          pageSize: 10,
          total: 100,
        },

        //初始化选中的项
        filter: {
          // time: "ascending",
          // levels: "",
          // tags: "",
        },
      },

      tableValueMaps: {
        type: {
          [OpinionType.trend]: "趋势分析",
          [OpinionType.theme]: "话题分析",
          [OpinionType.words]: "词云分析",
          [OpinionType.spread]: "传播分析",
        },
      },

      tableDimensions: [
        {
          label: "",
          prop: "",
          width: "50px",
          actionType: "selection",

          ifDisabled(row) {
            return false;
          },

          ifVisible(row) {
            return row.perms.remove;
          },
        },
        {
          label: "名称",
          prop: "name",
          width: "300px",
          hasContentTooltip: true, //是否使用toolTip
        },
        {
          label: "创建人",
          prop: "creator",
          actionType: "filter", // 排序类型
        },
        {
          label: "类型",
          prop: "type",
          actionType: "filter", // 点击分类类型
          valueMap: true,
        },
        {
          label: "更新时间",
          prop: "updateTime",
          actionType: "sort",
        },
        {
          label: "已应用看板",
          prop: "appliedDashbords",
          actionType: "info", //options过滤类型
          tip: "报表当前应用的看板",
        },

        {
          label: "操作",
          prop: "",
          width: "",

          isActionColumn: true, // 是否是操作列 查看、删除等
          actions: [
            {
              //函数或字符串
              label(row) {
                return "修改";
              },

              loadingRowTag: "",

              ifShow(row) {
                return true;
              },

              ifDisabled(row) {
                return !row.perms.edit;
              },

              action(row) {
                return this.handleEdit(row);
              },
            },
            {
              //函数或字符串
              name: "delete", //按钮名称, 用于手动设置按钮loading状态

              label(row) {
                return "删除";
              },

              loadingRowTag: "", //若有值,用于自动设置按钮loading状态

              ifShow(row) {
                return true;
              },

              ifDisabled(row) {
                return !row.perms.remove;
              },

              action(row) {
                return this.handleDeleteRow(row);
              },
            },
          ],
        },
      ],
      pager: {
        curPage: 1,
        pageSize: 10,
        total: 10,
      },

      filter: {
        search: "",
        // time: "ascending",
        // levels: "",
        // tag: "",
      },
      filterOptions: {},
    };
  },
  watch: {
    "$store.getters.appId": {
      immediate: true,
      handler(val) {
        if (val) {
          this.getTableData();
        }
      },
    },
  },
  methods: {
    preDealContent(header, content) {
      if (header.prop === "type") {
        return viewTypesLabel[content];
      }
      if (content === "") {
        return "-";
      }
      return content;
    },

    setCheckboxSelectable(row) {
      return row.perms.remove;
    },

    handleSelectionChange(val) {
      this.multipleSelection = val;
    },

    getColumnMapValue(headerItem, scope) {
      return (
        this.tableValueMaps[headerItem.prop][scope.row[headerItem.prop]] || "-"
      );
    },

    handleEdit(row) {
      this.$router.push({
        path: window.aop[row.type],
        query: { id: row.id },
      });
    },

    handleCancelMutipleDelete() {
      this.tableData.source.forEach((item) => (item.checked = false));
      this.multipleSelection = [];
    },

    handleMultipleDelete() {
      this.$confirm("确定要删除报表吗?", "提示")
        .then(() => {
          this.isDeleting = true;
          // 执行删除操作
          const ids = this.multipleSelection.map((item) => item.id);
          this.$store
            .dispatch("reports/deleteReportById", {
              project_id: this.$store.getters.appId,
              ids: ids,
            })
            .then(() => {
              this.$message({
                message: "删除成功!",
                duration: 3000,
                type: "success",
              });
              this.getTableData();
            })
            .catch(() => {
              // noop
            })
            .finally(() => {
              this.isDeleting = false;
            });
        })
        .catch(() => {
          // noop
        });
    },

    handleDeleteRow(row) {
      this.$confirm("确定要删除报表吗?", "提示")
        .then(() => {
          this.$set(row, "delete", true);
          this.$store
            .dispatch("reports/deleteReportById", {
              project_id: this.$store.getters.appId,
              ids: [row.id],
            })
            .then(() => {
              this.$message({
                message: "删除成功!",
                duration: 3000,
                type: "success",
              });

              this.getTableData();
            })
            .catch(() => {
              // noop
            })
            .finally(() => {
              this.$set(row, "delete", false);
            });
        })
        .catch(() => {
          //noop
        });
    },

    getFilterOptions(prop) {
      return this.filterOptions[prop] || [];
    },

    handleSearchInput() {
      clearTimeout(this.timer);
      this.timer = setTimeout(() => {
        this.pager.curPage = 1;
        this.getTableData();
      }, 1000);
    },

    //处理table分类操作
    handleSort(headerItem, value) {
      const prop = headerItem.prop;

      const isSortableHeader = headerItem.actionType === "sort";
      if (isSortableHeader && value === this.filter[prop]) {
        //重复点击取消选中状态
        this.$set(this.filter, prop, "");
      } else {
        this.$set(this.filter, prop, value);
      }
      this.getTableData();
    },

    handlePageChange() {
      this.getTableData();
    },

    handleSizeChange() {
      this.pager.curPage = 1;
      this.getTableData();
    },

    handleGetTableData(data) {
      this.filter = data.filter;
      this.pager = data.pager;
      this.getTableData();
    },

    getTableData() {
      //恢复到初始状态
      this.multipleSelection = [];

      this.isLoadingTable = true;
      const payload = {
        project_id: this.$store.getters.appId,
        curPage: this.pager.curPage,
        pageSize: this.pager.pageSize,
        ...this.filter,
      };

      this.$store
        .dispatch("reports/getReportsTableData", payload)
        .then((data) => {
          // console.log("data:", data);
          this.tableData.source = data.source;
          this.pager = data.pager;
          // this.filter = data.filter || {};
          this.filterOptions = data.filterOptions;
          // console.log("filterOptions:", this.filterOptions);
        })
        .catch(() => {
          //noop
        })
        .finally(() => {
          this.isLoadingTable = false;
        });
    },
  },
  created() {},
};
</script>
<style lang="scss" scoped>
@import "@/styles/index.scss";

.tooltip-content-inner {
  max-width: 400px;
}

.view-manange {
  //
  min-height: 300px;
  padding: 15px;

  .top-banner {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 15px;

    .title {
      font-size: 14px;
    }
    .search-input {
      width: 300px;
    }
  }

  .table-container {
    .el-icon-question {
      margin-left: 3px;
      color: $color-text;
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
}
</style>
