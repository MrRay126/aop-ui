<template>
  <div class="tab-select">
    <div class="tab-contents-section" v-loading="loading">
      <!-- 有数据 -->
      <template v-if="Array.isArray(optionsData) && optionsData.length > 0">
        <el-tabs v-model="activeName" @tab-click="handleTabClick" size="mini">
          <template v-for="item in optionsData">
            <el-tab-pane :label="item.title" :name="item.name" :key="item.name">
              <ul
                class="data-list-container"
                :style="{
                  height: contentHeight + 'px',
                }"
              >
                <template v-for="(list, index) in item.data">
                  <slot :data="list">
                    <li
                      class="list-item"
                      :class="{
                        focused: value.includes(list.value),
                        disabled: list.disabled,
                      }"
                      :key="index"
                      :title="list.disabled ? 'disabled' : ''"
                      @click="handleClickList(list, item)"
                    >
                      <span>
                        <template v-if="mutilpleSelect">
                          <el-checkbox
                            v-model="list.checked"
                            @change="handleClickList(list, item)"
                          ></el-checkbox>
                        </template>
                        <span class="title">{{ list.title }}</span>
                      </span>

                      <span class="type">{{ list.type || "" }}</span>
                    </li>
                  </slot>
                </template>
              </ul>
            </el-tab-pane>
          </template>
        </el-tabs>
      </template>
      <template v-else>
        <div class="no-data">暂无数据</div>
      </template>
    </div>
  </div>
</template>
<script>
export default {
  // @select选中选项的事件
  // @slot : default  列表项的 slot
  props: {
    options: {
      type: Array,
      default() {
        return [
          //  {
          //     title: "通用属性",
          //     name: "common",
          //     data: [
          //       { title: "作者", value: "author", type: "文本"},
          //       { title: "作者id", value: "author_id", type: "数值"},
          //     ],
          //   },
        ];
      },
    },

    activeTab: {
      type: String,
      default: null,
    },

    // 当前选中的值
    value: {
      type: Array,
      default() {
        return [];
      },
    },

    // 是否加载中
    loading: {
      type: Boolean,
      default: false,
    },

    contentHeight: {
      type: Number,
      default: 300,
    },

    // 多选操作时是否只能选择一个tab内的值
    distincTabValue: {
      type: Boolean,
      default: true,
    },

    mutilpleSelect: {
      type: Boolean,
      default: false,
    },

    /**
     *  [{category:category-name, value: option-value}] 属性名同输出的值
     */
    disabledOptions: {
      type: Array,
      default() {
        return [];
      },
    },
  },
  data() {
    return {
      activeName: "",
      optionsData: [],
    };
  },
  watch: {
    options: {
      immediate: true,
      handler(val) {
        if (val) {
          this.activeName = this.activeTab || val[0]?.name;
          this.optionsData = val;
          this.initOptionsData(val);

          if (Array.isArray(this.disabledOptions)) {
            this.setDisabledOptions(this.disabledOptions);
          }
        }
      },
    },

    disabledOptions: {
      immediate: true,
      handler(val) {
        if (val) {
          this.setDisabledOptions(val);
        }
      },
    },
    mutilpleSelect: {
      immediate: true,
      handler() {
        if (Array.isArray(this.disabledOptions)) {
          this.setDisabledOptions(this.disabledOptions);
        }
      },
    },

    value: {
      immediate: true,
      handler(val) {
        if (val) {
          if (Array.isArray(val)) {
            this.initOptionsData(this.optionsData);
          }
        }
      },
    },
    activeTab: {
      immediate: true,
      handler(val) {
        if (val) {
          this.activeName = val;
        }
      },
    },
  },
  methods: {
    handleTabClick() {
      this.$emit("tabClick", this.activeName);
    },

    //{ [title:category-name, value: option-value }
    setDisabledOptions(disabledOptions) {
      if (this.mutilpleSelect) {
        this.resetDisabledOptionsToAbled();
        return;
      }

      if (this.optionsData.length > 0) {
        this.resetDisabledOptionsToAbled();
        disabledOptions.forEach((item) => {
          this.setCategoryOptionDisabled(item.category, item.value);
        });
      }
    },

    setCategoryOptionDisabled(category, optionValue) {
      const cate = this.optionsData.find((item) => {
        return item.name === category;
      });

      if (cate && cate.data) {
        cate.data.forEach((item) => {
          if (item.value === optionValue) {
            item.disabled = true;
          }
        });
      }
    },

    resetDisabledOptionsToAbled() {
      this.optionsData.forEach((categoryItem) => {
        const data = categoryItem.data;
        data.forEach((dataItem) => {
          dataItem.disabled = false;
        });
      });
    },

    initOptionsData(options) {
      if (Array.isArray(options)) {
        options.forEach((tabItem) => {
          // 添加checked初始字段
          this.setItemCheckedStausOf(tabItem.data, false);
          this.setCheckedStatusOfList(tabItem.data);
        });
      }
    },

    //设置选中的list
    setCheckedStatusOfList(list) {
      if (this.mutilpleSelect) {
        list.forEach((item) => {
          item.checked = this.value.includes(item.value);
        });
      }
    },

    handleClickList(listItem, tabItem) {
      if (listItem.disabled) return;

      // list可多选
      if (!this.mutilpleSelect) {
        this.setItemCheckedStausOf(tabItem.data);
      }
      listItem.checked = !listItem.checked;

      // 可选的tab的唯一
      if (this.distincTabValue) {
        this.optionsData.forEach((item) => {
          if (item.name !== tabItem.name) {
            this.setItemCheckedStausOf(item.data);
          }
        });
      }

      const data = this.getCheckedListOf(tabItem.data);

      this.$emit("select", { data, category: this.activeName });
    },

    // 清除列表项的选中状态
    setItemCheckedStausOf(list, status = false) {
      list.forEach((listItem) => {
        listItem.checked = status;
      });
    },

    //获取选中的list
    getCheckedListOf(list) {
      return list.filter((item) => {
        return item.checked;
      });
    },
  },
  created() {},
};
</script>
<style lang="scss" scoped>
@import "@/styles/index.scss";
$containerWidth: 360px;
.tab-select {
  width: 300px;
  // padding: 10px;
  // border: 1px solid #ccc;

  ::v-deep(.el-tabs__item) {
    padding: 0 10px;
  }

  .tab-contents-section {
    min-height: 200px;

    .no-data {
      font-size: 12px;
      color: $color-text;
      padding-top: 80px;
      text-align: center;
    }

    .data-list-container,
    .list-item {
      list-style: none;
      padding: 0;
      margin: 0;
      list-style: none;
    }

    .data-list-container {
      overflow-y: auto;
      padding-right: 10px;
    }

    .list-item {
      font-size: 12px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 5px;
      cursor: pointer;

      &.focused {
        color: $color-primary;
      }

      &.disabled {
        color: $color-disabled;
      }

      &:hover {
        background: $background-color;
      }

      .title {
        display: inline-block;
        max-width: $containerWidth - 120px;
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
        vertical-align: middle;
        margin-left: 5px;
      }

      .type {
        color: $color-disabled;
      }
    }
  }
}
</style>
