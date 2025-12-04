<template>
  <el-popover placement="bottom" title="" width="300" trigger="click">
    <span slot="reference">
      <slot></slot>
    </span>
    <template>
      <div class="warn-tab-select">
        <el-tabs v-model="active" @tab-click="handleTabClick">
          <template v-for="(tabItem, index) in optionsList">
            <el-tab-pane
              :key="index"
              :label="tabItem.label"
              :name="tabItem.name"
            >
              <ul class="tab-list">
                <template v-for="(listItem, index) in tabItem.data">
                  <li
                    class="list-item"
                    :key="index"
                    @click="handleListClick(tabItem, listItem)"
                  >
                    <el-checkbox
                      v-model="listItem.checked"
                      @change="handleListClick(tabItem, listItem)"
                    ></el-checkbox>
                    <span> {{ listItem.label }}</span>
                  </li>
                </template>
              </ul>
            </el-tab-pane>
          </template>
        </el-tabs>
      </div>
    </template>
  </el-popover>
</template>
<script>
// @change 选中的值改变
export default {
  model: {
    event: "change",
    prop: "value",
  },
  props: {
    tabData: {
      type: Array,
      default() {
        return [];
      },
    },
    value: {
      type: Object,
      default() {
        return {
          type: "oneByOne",
          values: [],
        };
      },
    },
  },
  data() {
    return {
      optionsList: [
        {
          label: "逐条",
          name: "oneByOne",
          data: [
            { label: "bug1", value: 1, checked: false },
            { label: "bug2", value: 2, checked: false },
          ],
        },
        {
          label: "按天",
          name: "day",
          data: [
            { label: "bug3", value: 3, checked: false },
            { label: "bug4", value: 4, checked: false },
          ],
        },
        {
          label: "按小时",
          name: "hour",
          data: [
            { label: "bug5", value: 5, checked: false },
            { label: "bug6", value: 6, checked: false },
          ],
        },
      ],

      active: "oneByOne",
    };
  },
  watch: {
    options: {
      immediate: true,
      handler(val) {
        if (Array.isArray(val)) {
          val.forEach((tabItem) => {
            // 添加checked初始字段
            this.clearItemCheckedStausOf(tabItem.data);
          });
        }
        this.setCurTabAndCheckedList();
      },
    },

    value: {
      immediate: true,
      handler() {
        this.setCurTabAndCheckedList();
      },
    },
  },
  methods: {
    handleListClick(tabItem, listitem) {
      listitem.checked = !listitem.checked;

      this.optionsList.forEach((item) => {
        if (item.name !== tabItem.name) {
          this.clearItemCheckedStausOf(item.data);
        }
      });

      const values = this.getCheckedListOf(tabItem.data);
      this.$emit("change", values);
    },

    handleTabClick() {},

    // 回显设置当前选中的tab和tab下的
    setCurTabAndCheckedList() {
      if (this.value && this.tabData.length > 0) {
        const tab = this.value.type.name;
        const values = this.value.values;

        this.active = tab;

        let listData = [];
        const tabObj = this.tabData.find((tabItem) => {
          return tabItem.name === tab;
        });

        if (tabObj && tab) {
          listData = tabObj[tab];
        }

        values.forEach((valueItem) => {
          listData.forEach((listItem) => {
            listItem.checked = listItem.value === valueItem.value;
          });
        });
      }
    },

    //获取选中的list
    getCheckedListOf(list) {
      return list.filter((item) => {
        return item.checked;
      });
    },

    // 清除列表项的选中状态
    clearItemCheckedStausOf(list) {
      list.forEach((listItem) => {
        listItem.checked = false;
      });
    },
  },
  created() {},
};
</script>
<style scoped lang="scss">
@import "@/styles/index.scss";
.warn-tab-select {
  .tab-list {
    margin: 0;
    padding: 0;
    max-height: 200px;
    width: 100%;
    overflow: auto;

    .list-item {
      padding-left: 10px;
      line-height: 24px;
      font-size: 14px;
      cursor: pointer;

      &:hover {
        background: $background-color;
      }
    }
  }
}
</style>
