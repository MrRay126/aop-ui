<template>
  <el-popover
    placement="right"
    title=""
    trigger="click"
    @show="handlePopoverShow"
    @hide="handlePopoverHide"
  >
    <!-- 销毁完全重新建立,避免一些显示残留问题 -->
    <template v-if="isShowTabSelect">
      <template v-if="searchable">
        <div class="search-section">
          <el-input
            size="mini"
            class="search-input"
            placeholder="请输入搜索"
            :clearable="true"
            v-model="searchText"
            @input="handleSearch"
          >
            <template slot="prepend">
              <i class="el-icon-search"></i>
            </template>
          </el-input>
        </div>
      </template>
      <selector
        @select="handleSelectList"
        @tabClick="handleTabClick"
        :disabledOptions="disabledOptions"
        :options="optionsData"
        :value="value.data"
        :activeTab="activeTab"
        :mutilpleSelect="mutilpleSelect"
        :distincTabValue="distincTabValue"
      >
      </selector>
    </template>
    <span slot="reference">
      <slot></slot>
    </span>
  </el-popover>
</template>
<script>
import selector from "./selector.vue";
import { cloneObject } from "@/utils";

/*
 @event hide 弹窗隐藏 携带当前选中的参数
 @event search 
 @event select 
 @event clickTab 
*/
export default {
  model: {
    event: "change",
    prop: "value",
  },
  props: {
    options: {
      type: Array,
      default() {
        return [];
        // return [
        //   {
        //     title: "通用属性",
        //     name: "common",
        //     data: [
        //       { title: "作者", value: "author", type: "文本" },
        //       { title: "作者id", value: "author_id", type: "数值" },
        //     ],
        //   },
        //   {
        //     title: "渠道属性",
        //     name: "channel",
        //     data: [
        //       { title: "微博", value: "weibo", type: "文本" },
        //       { title: "b站", value: "bilibili", type: "数值" },
        //       { title: "其他", value: "others", type: "数值" },
        //       { title: "微博", value: "weibo", type: "文本" },
        //       { title: "b站", value: "bilibili", type: "数值" },
        //       { title: "其他", value: "others", type: "数值" },
        //       { title: "微博", value: "weibo", type: "文本" },
        //       { title: "b站", value: "bilibili", type: "数值" },
        //       { title: "其他", value: "others", type: "数值" },
        //       { title: "微博", value: "weibo", type: "文本" },
        //       { title: "b站", value: "bilibili", type: "数值" },
        //       { title: "其他", value: "others", type: "数值" },
        //       { title: "微博", value: "weibo", type: "文本" },
        //       { title: "b站", value: "bilibili", type: "数值" },
        //       { title: "其他", value: "others", type: "数值" },
        //       { title: "微博", value: "weibo", type: "文本" },
        //       { title: "b站", value: "bilibili", type: "数值" },
        //       { title: "其他", value: "others", type: "数值" },
        //     ],
        //   },
        //   {
        //     title: "热词组",
        //     name: "wordgroup",
        //     data: [
        //       { title: "词组1", value: "g1", type: "文本" },
        //       { title: "词组2", value: "g2", type: "数值" },
        //     ],
        //   },
        //   {
        //     title: "热词",
        //     name: "word",
        //     data: [
        //       { title: "词1", value: "w1", type: "文本" },
        //       { title: "词2", value: "w2", type: "数值" },
        //     ],
        //   },
        // ];
      },
    },

    // 单选(mutilpleSelect=false)时,可设置disabled options, 多选时设置无效
    disabledOptions: {
      type: Array,
      default() {
        return [];
      },
    },

    value: {
      type: Object,
      default() {
        return {
          data: [],
          category: "",
          search: "",
        };
      },
    },

    size: {
      type: Number,
      default: 100,
    },

    anylysis: {
      type: String,
      default: "trend",
    },

    // 是否多选(显示对选框)
    mutilpleSelect: {
      type: Boolean,
      default: false,
    },

    // 多选操作时是否只能选择一个tab内的值
    distincTabValue: {
      type: Boolean,
      default: true,
    },

    // 是否开启搜索功能
    searchable: {
      type: Boolean,
      default: true,
    },

    //是否允许 输入输出search内容,用于区别搜索功能是否是单独的内部功能, 为true时值在value值的search
    canIOSearch: {
      type: Boolean,
      default: false,
    },
  },

  components: {
    selector,
  },

  data() {
    return {
      visible: false,
      isShowTabSelect: false,
      searchText: "",
      activeTab: "",
      optionsData: [],
      valueData: [],
    };
  },

  watch: {
    options: {
      // deep: true,
      immediate: true,
      handler(val) {
        // this.handleInitShow();

        if (Array.isArray(val)) {
          this.optionsData = val;

          if (this.searchText) {
            this.handleSearch(false);
          }
        }
      },
    },
    // value.data 输出为 [id,id,id,,,] ,输入可以是带value的对象,也可以是[id,id,id,,,]数组
    value: {
      immediate: true,
      handler(val) {
        if (val) {
          if (val.data) {
            val.data = this.getSinpleDataOfValue(val.data);
          }

          if (val.category) {
            this.activeTab = val.category;
          }

          // this.handleInitShow();
          if (this.canIOSearch && val.search && this.options.length > 0) {
            this.searchText = val.search;
            this.handleSearch(false);
          }
        }
      },
    },
  },

  methods: {
    // @param tab { string } tab的name
    handleTabClick(tab) {
      // this.activeTab = tab;
      this.$emit("clickTab", tab);
    },

    getSinpleDataOfValue(data) {
      return data.map((item) => {
        if (typeof item === "object") {
          return item.value || "";
        } else {
          return item;
        }
      });
    },

    handleSearch(needOutput = true) {
      //api获取查询数据
      const searchText = this.searchText;

      if (searchText) {
        this.optionsData = this.getSearchResult(searchText);
      } else {
        this.optionsData = cloneObject(this.options);
      }

      if (this.canIOSearch && needOutput) {
        this.$emit("search", searchText);
      }
    },

    getSearchResult(searchText) {
      let result = [];
      result = this.options.map((item) => {
        return {
          ...item,
          data: item.data.filter((dataItem) => {
            return dataItem.title.includes(searchText);
          }),
        };
      });
      return result;
    },

    handlePopoverShow() {
      this.isShowTabSelect = true;
      if (!this.canIOSearch) {
        this.searchText = "";
        this.handleSearch();
      }
    },

    handlePopoverHide() {
      this.isShowTabSelect = false;
      this.$emit("hide", this.selectedData);
    },

    handleSelectList(payload) {
      // console.log("payload:", payload);
      this.activeTab = payload.category;
      this.selectedData = {
        ...payload,
        search: this.searchText,
      };
      this.$emit("change", this.selectedData);
    },
  },
  created() {},
};
</script>
<style lang="scss" scoped>
.search-section {
  padding: 5px 0;
  .search-input {
    width: 100%;
  }
}
</style>
