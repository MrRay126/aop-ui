<template>
  <div class="filter">
    <template v-if="filters.children.length > 0">
      <div class="filter-container">
        <div class="filter-wrapper">
          <template v-if="filters.children.length > 1">
            <div
              class="relation-item-all"
              :class="{ disabled: disabled }"
              @click="handleChangeRelation(filters)"
            >
              <span>{{ filters.relTag === "and" ? "且" : "或" }}</span>
            </div>
          </template>

          <template v-for="(filterItem, findex) in filters.children">
            <template v-if="filterItem.relTag">
              <div class="muti-filters-container" :key="findex">
                <template v-if="filterItem.children.length > 1">
                  <div
                    class="relation-item-sub"
                    :class="{ disabled: disabled }"
                    @click="handleChangeRelation(filterItem)"
                  >
                    {{ filterItem.relTag === "and" ? "且" : "或" }}
                  </div>
                </template>
                <div class="muti-filters-wrapper">
                  <template v-for="(item, index) in filterItem.children">
                    <filter-item
                      :ref="item.id"
                      :filterValue="item"
                      :optionsData="optionsData"
                      :valueComponentConfig="valueComponentConfig"
                      :key="index"
                      :disabled="disabled"
                      @itemChange="handelFilterChange"
                      @add="handleAddItem(filterItem, index)"
                      @remove="handleRemoveItem(filterItem, index)"
                    ></filter-item>
                  </template>
                </div>
              </div>
            </template>
            <template v-else>
              <div class="single-filter-wrapper" :key="findex">
                <filter-item
                  :ref="filterItem.id"
                  :filterValue="filterItem"
                  :optionsData="optionsData"
                  :valueComponentConfig="valueComponentConfig"
                  :key="findex"
                  :disabled="disabled"
                  @add="handleAddItem(filterItem, findex)"
                  @remove="handleRemoveItem(filterItem, findex)"
                  @itemChange="handelFilterChange"
                ></filter-item>
              </div>
            </template>
          </template>
        </div>
      </div>
    </template>
    <template v-if="isUseAddConditionBtn">
      <div class="btn-container">
        <el-button
          type="text"
          @click="handleAddItem(filters)"
          :disabled="disabled"
        >
          <div class="add-filter-btn-title">
            <svg-icon icon-class="filter" size="16"></svg-icon
            ><span>添加条件</span>
          </div>
        </el-button>
      </div>
    </template>
  </div>
</template>
<script>
/*
 *  prop: configData 组件的数据格式见默认值
 *  event: 组件值改变时输出的change事件,带值
 */
import filterItem from "./filterItem.vue";
import { uuid, cloneObject } from "@/utils";
import { travelFilterItem } from "./data";

export default {
  props: {
    /*@description
      {
        relTag: "and", // or | and
        children: [
          { id: uuid(), key: 3, relation: "eq", value: [] },
          { id: uuid(), key: 3, relation: "eq", value: [] },
          {
            relTag: "or",
            children: [
              { id: uuid(), key: 1, relation: "eq", value: 1 },
              { id: uuid(), key: 2, relation: "eq", value: 2 },
            ],
          },
        ],
      }
    */
    configData: {
      type: Object,
      default() {
        return {
          relTag: "and", // or | and
          children: [],
        };
      },
    },

    //组件的基础数据 keyList:[]  relationList:[]  choices:[](select  cascader)
    optionsData: {
      type: Array,
      default() {
        return [];
      },
    },

    //配置value值使用的组件的配置文件
    valueComponentConfig: {
      type: Object,
      default() {
        return null;
      },
    },

    disabled: {
      type: Boolean,
      default: false,
    },

    isUseAddConditionBtn: {
      type: Boolean,
      default: true,
    },
  },
  components: { filterItem },
  data() {
    return {
      // value: "",
      filters: {
        relTag: "and", // or | and
        children: [],
      },

      filterData: { id: null, key: null, relation: null, value: null },

      keyList: [],
      filterValueOptionsMap: {},
    };
  },

  watch: {
    configData: {
      immediate: true,
      handler(val) {
        if (val) {
          this.filters = val;
        }
      },
    },
  },
  methods: {
    // 对外暴露的方法
    __getFilterDisplayTagList() {
      const displayList = [];
      travelFilterItem(this.filters, (filterItem) => {
        let tag = this.$refs[filterItem.id][0]?.getFilterItemTag();
        if (tag) {
          displayList.push(tag);
        }
      });
      return displayList;
    },
    handelFilterChange(item) {
      //更新值到外部数据
      const assignChangedValue = (filterItem) => {
        if (filterItem.id === item.id) {
          Object.assign(filterItem, item);
        }
      };
      travelFilterItem(this.filters, assignChangedValue);
      this.handleChange();
    },

    handleChangeRelation(item) {
      if (this.disabled) return;
      item.relTag = item.relTag === "and" ? "or" : "and";
      this.handleChange();
    },

    /**
     * @param {Object} item  description: filters.children的数组项item
     * @param {Number} childindex  children内当前值的index索引
     */
    handleRemoveItem(item, childindex) {
      if (item && item.children) {
        item.children.splice(childindex, 1);

        if (item.children.length === 1) {
          const itemCopy = item.children[0];
          const itemIndex = this.filters.children.indexOf(item);
          //替换当前项
          this.filters.children.splice(itemIndex, 1, itemCopy);
        }
      } else {
        //只有一项时禁止删除
        // if (this.filters.children.length === 1) return;
        this.filters.children.splice(childindex, 1);

        //如果只剩一个二级节点 则展开二姐到一级节点
        if (this.filters.children.length === 1) {
          const onlyChild = this.filters.children[0];
          if (onlyChild.relTag) {
            this.filters = onlyChild;
          }
        }
      }
      this.handleChange();
    },
    /**
     * @param {Object} item  description: filters.children的数组项item
     * @param {Number} childindex  children内当前值的index索引
     */
    handleAddItem(item, childindex) {
      const filterData = JSON.parse(JSON.stringify(this.filterData));
      filterData.id = uuid();
      filterData.key = null;
      filterData.relation = null;
      filterData.value = null;

      if (item && item.children) {
        item.children.push(filterData);
      } else {
        const newItem = {
          relTag: "and",
          children: [item, filterData],
        };
        this.filters.children.splice(childindex, 1, newItem);
        //创建一个二级过滤条件时 ,如果第一层只有一个元素则不创建第二层
        // if (this.filters.children.length === 1) {
        //   this.filters.children = this.filters.children[0].children;
        // }
      }

      //获取当前项的cascaderOptions
      // this.setCascaderOptionsOfItemIfNeed(filterData);

      this.handleChange();
    },

    handleChange() {
      const output = cloneObject(this.filters);
      this.$emit("change", output);
    },
  },
  created() {
    //noop
  },
};
</script>
<style lang="scss" scoped>
$shallow-color-text: #8395ad;
$color-text: #42546d;
$shallow-color-border: #c0c9d4;
$color-border: #42546d;
$color-primary: #2d8cf0;
$normal-background-color: rgb(236, 236, 236);
$light-background-color: rgb(232, 232, 232);

@import "@/styles/index.scss";
.filter {
  width: 100%;

  .btn-container {
    display: flex;
    justify-content: flex-start;
    align-items: center;
    font-size: 14px;
    cursor: pointer;
    color: $color-text;

    &:hover {
      color: $color-primary;
    }

    .add-filter-btn-title {
      display: flex;
      justify-content: flex-start;
      align-items: center;
      font-weight: normal;
      // color: $color-primary;
      padding-left: 5px;
    }
  }

  .selector-container {
    display: flex;
    justify-content: flex-start;
    align-items: center;
    & > span {
      margin-left: 5px;
    }

    .deng-icon {
      margin-right: 5px;
      color: $shallow-color-text;
    }

    .add-filter-icon {
      margin-left: 5px;
      color: $shallow-color-text;
      cursor: pointer;

      &:hover {
        color: $color-primary;
      }
    }
  }

  .filter-container {
    padding: 10px;
    overflow-y: auto;

    .filter-wrapper {
      border-left: 1px dashed $shallow-color-border;
      position: relative;
      padding-left: 30px;

      .relation-item-all {
        line-height: 14px;
        text-align: center;
        font-size: 14px;
        color: $color-text;
        background-color: $background-color;
        padding: 5px;
        border-radius: 3px;

        position: absolute;
        left: 0;
        top: 50%;
        transform: translate(-50%, -50%);
        cursor: pointer;

        &:hover:not(.disabled) {
          color: $color-primary;
          background: $deep-background-color;
        }

        &.disabled {
          color: $color-disabled;
        }
      }
    }

    .muti-filters-container {
      border-left: 1px dashed $shallow-color-border;
      position: relative;
      padding-left: 30px;

      .relation-item-sub {
        line-height: 14px;
        text-align: center;
        font-size: 14px;
        color: $color-text;
        background-color: $background-color;
        padding: 5px;
        border-radius: 3px;

        position: absolute;
        left: 0;
        top: 50%;
        transform: translate(-50%, -50%);
        cursor: pointer;

        &:hover:not(.disabled) {
          color: $color-primary;
          background: $deep-background-color;
        }

        &.disabled {
          color: $color-disabled;
        }
      }

      .muti-filters-wrapper {
        margin-bottom: 15px;

        border-bottom: 1px solid rgb(230, 229, 229);
      }
    }
  }
}
</style>
