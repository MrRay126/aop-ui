<template>
  <div class="data-view-panel">
    <div class="top">
      <div class="title">添加报表</div>
      <div class="search-container">
        <div class="search-name">
          <el-input
            v-model="filter.search"
            @input="handleFilterChange"
            :clearable="true"
            size="mini"
            placeholder="输入报表名称"
          >
            <i class="el-icon-search el-input__icon" slot="suffix"></i
          ></el-input>
        </div>
        <div class="view-type-filter">
          <!-- filter select -->
          <simple-select
            v-model="filter.viewType"
            :options="viewDataTypeList"
            @change="handleFilterChange"
          ></simple-select>
        </div>
      </div>
    </div>
    <div class="bottom" :style="{ marginTop: mode === 'view' ? '20px' : '' }">
      <div class="list-container">
        <ul class="view-item-list">
          <template v-for="(item, index) in viewList">
            <li
              class="view-list-item"
              :key="index"
              @dragstart="handleDragStart(item)"
              :draggable="isListDragable"
            >
              <div class="report-item-title" :class="{ focus: item.focus }">
                <i class="el-icon-document"></i>
                <span>{{ viewTypesLabel[item.type] || "" }}</span>
                <span class="bold">|</span>

                <el-popover
                  placement="top-start"
                  width="200"
                  trigger="hover"
                  :content="item.name"
                >
                  <span slot="reference" class="title-text">
                    {{ item.name }}
                  </span>
                </el-popover>

                <template v-if="item.comment">
                  <el-popover
                    placement="top-start"
                    width="200"
                    trigger="hover"
                    :content="item.comment"
                  >
                    <i class="el-icon-question" slot="reference"></i>
                  </el-popover>
                </template>
              </div>
              <template v-if="mode === 'view'">
                <div @click="handelModify(item)" class="edit-btn">
                  <span>修改</span>
                </div>
              </template>
            </li>
          </template>
        </ul>
      </div>
      <div class="btn-container">
        <template v-if="mode === 'operation'">
          <div class="operation-btn-container">
            <el-button
              @click="handleCancel"
              size="mini"
              style="margin-right: 5px"
              >取消</el-button
            >
            <el-button @click="handleApply" size="mini" type="primary"
              >应用</el-button
            >
          </div>
        </template>
        <template v-else-if="mode === 'view'">
          <div class="manage-btn-container">
            <el-button @click="handleMange" icon="el-icon-document"
              >报表管理</el-button
            >
          </div>
        </template>
      </div>
    </div>
  </div>
</template>
<script>
import { viewDataTypeList, viewTypesLabel } from "../data";
import { cloneObject } from "@/utils";
import simpleSelect from "@/views/components/simpleSelect.vue";

export default {
  props: {
    // 列表展示可点击跳转:'view' , 拖拽操作: 'operation'
    mode: {
      type: String,
      default: "operation",
    },

    reportType: {
      type: String,
      default: "all",
    },

    //列表项是否可以拖拽
    isListDragable: {
      type: Boolean,
      default: true,
    },

    /**
     * 报表列表
    [
      {
         type: "trend",
         name: "报表A",
         id: "0",
         comment: "注释内容",
       },
     ]
    */
    listData: {
      type: Array,
      default() {
        return [];
        // return [
        //   {
        //     id: 1,
        //     type: "trend",
        //     name: "报表A",
        //     comment: "注释内容",
        //   },
        // ];
      },
    },

    //经过拖拽在使用中的报表(用于回显)
    usedList: {
      type: Array,
      default() {
        return [];
      },
    },
  },
  components: {
    simpleSelect,
  },
  data() {
    return {
      viewDataTypeList: [...viewDataTypeList, { label: "全部", value: "all" }],
      viewTypesLabel: { ...viewTypesLabel, all: "全部" },
      filterLabel: "全部",

      filter: {
        search: "", //搜索的名称
        viewType: "all", // 趋势分析:trend 主题分析: theme
      },

      viewList: [],
      // [
      //   {
      //     id: 1,
      //     type: "trend",
      //     name: "报表A",
      //     comment: "注释内容",
      //   },
      // ],
    };
  },
  watch: {
    listData: {
      immediate: true,
      handler(val) {
        if (Array.isArray(val)) {
          this.viewList = val;
          this.setFocusedListItem();
          this.handleFilterChange();
        }
      },
    },

    reportType: {
      immediate: true,
      handler(val) {
        if (val) {
          this.filter.viewType = val;
          this.handleFilterChange();
        }
      },
    },

    usedList: {
      immediate: true,
      handler(val) {
        if (Array.isArray(val)) {
          this.setFocusedListItem();
        }
      },
    },
  },
  methods: {
    setFocusedListItem() {
      if (Array.isArray(this.usedList) && this.viewList.length > 0) {
        const usedReportIds = this.usedList.map((item) => {
          return item.report.id;
        });

        this.viewList.forEach((item) => {
          if (usedReportIds.includes(item.id)) {
            item.focus = 1;
          } else {
            item.focus = 0;
          }
        });

        const sortedList = cloneObject(this.viewList);
        sortedList.sort((pre, next) => (next.focus || 0) - pre.focus);
        this.viewList = sortedList;
      }
    },

    //报表修改
    handelModify(item) {
      const jumpPath = window.aop[item.type];

      const curViewId = this.$route.query.id;
      if (item.id != curViewId) {
        this.$router.replace({
          path: jumpPath,
          query: {
            type: item.type,
            id: item.id,
          },
        });
        this.handleCancel();
      } else {
        this.handleCancel();
        window.location.reload(true);
      }
    },

    //报表管理
    handleMange() {
      this.$router.push({
        path: window.aop.reportManage,
      });
    },

    //应用
    handleApply() {
      this.$emit("apply");
    },

    //取消
    handleCancel() {
      this.$emit("cancel");
    },

    handleDragStart(item) {
      this.$emit("onDragstart", item);
    },

    handleFilterChange() {
      this.viewList = this.listData;

      if (this.filter.viewType !== "all") {
        this.viewList = this.listData.filter((item) => {
          return item.type === this.filter.viewType;
        });
      }

      if (this.filter.search) {
        this.viewList = this.viewList.filter((item) => {
          return item.name.includes(this.filter.search);
        });
      }
    },
  },

  created() {},
};
</script>
<style lang="scss" scoped>
@import "@/styles/index.scss";

.data-view-panel {
  width: 330px;
  height: 100%;
  padding: 10px;
  border: 1px solid $color-border;

  .bottom {
    position: relative;
    height: calc(100% - 90px);

    .list-container {
      height: calc(100% - 60px);
      overflow-y: auto;
    }

    .btn-container {
      position: absolute;
      bottom: -5px;
      left: 0;
      width: 100%;
      border-top: 1px solid $color-border;
      padding: 10px;
    }
  }

  .operation-btn-container {
    text-align: right;
  }

  .manage-btn-container {
    text-align: center;
  }

  .search-container {
    display: flex;
    align-items: center;
    justify-content: flex-start;
    height: 60px;
    border-bottom: 1px solid $color-border;

    .search-name {
      width: 180px;
    }

    .view-type-filter {
      margin-left: 10px;
    }
  }

  .filter-icon {
    display: flex;
    justify-content: flex-start;
    align-items: center;
    color: $color-text;

    .filter-label {
      font-size: 14px;
      padding-left: 5px;
      cursor: pointer;
    }

    &:hover {
      color: $color-primary;
    }
  }

  .title {
    font-weight: bold;
    font-size: 14px;
    padding: 10px;
    padding-top: 0;
    color: $color-text;
    border-bottom: 1px solid $color-border;
  }

  .el-icon-question {
    font-size: 13px;
    color: $color-text;
    margin-left: 5px;
  }

  .el-icon-document {
    font-size: 14px;
    margin-right: 5px;
  }

  .bold {
    font-weight: bold;
    vertical-align: 1px;
    font-size: 12px;
    padding: 0 3px;
  }

  .view-item-list {
    color: $color-text;
    list-style: none;
    margin: 0;
    padding: 0;

    & li {
      margin: 0;
      padding: 0;
      list-style: none;
      padding: 10px;
    }

    .view-list-item {
      // cursor: pointer;
      display: flex;
      justify-content: space-between;
      align-items: center;
      // font-size:14px;

      .report-item-title {
        display: flex;
        align-items: center;
        justify-content: flex-start;
        flex-grow: 0;
        font-size: 14px;

        &.focus {
          color: $color-primary;
        }

        .title-text {
          display: inline-block;
          max-width: 180px;
          flex-grow: 1;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: pre;
          vertical-align: middle;
        }
      }

      &:hover {
        background: $light-background-color;
      }

      .edit-btn {
        flex-shrink: 0;
        width: 60px;
        text-align: center;
        color: $color-primary;
        cursor: pointer;
        font-size: 14px;
      }
    }
  }
}
</style>
