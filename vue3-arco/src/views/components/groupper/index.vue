<template>
  <div class="groupper">
    <div class="group-items-container">
      <template v-for="(list, index) in listData">
        <div class="item-wraper" :key="index">
          <span class="num-wrapper">{{ index + 1 }}.</span>
          <div class="groupper-item">
            <!-- options: {{ options }} -->
            <template v-if="valueComponent === 'select'">
              <el-select
                v-model="list.value"
                size="mini"
                style="width: 120px"
                :clearable="true"
                @change="
                  handleItemValueChange({ index: index, data: list.value })
                "
              >
                <template v-for="(item, index) in options">
                  <el-option
                    :key="index"
                    :label="item.label"
                    :value="item.value"
                  ></el-option>
                </template>
              </el-select>
            </template>
            <template v-else-if="valueComponent === 'input'">
              <span class="groupper-label">{{ list.value }}</span>
              <div class="groupper-input-item">
                <el-input
                  v-model="list.value"
                  @input="
                    handleItemValueChange({ index: index, data: list.value })
                  "
                  size="mini"
                  :clearable="true"
                >
                </el-input>
              </div>
            </template>
            <template v-else-if="valueComponent === 'tabSelect'">
              <tab-select
                :anylysis="anylysis"
                :canIOSearch="true"
                :value="{
                  data: [list.value],
                  category: list.category,
                  search: list.search || '',
                }"
                :options="options"
                :disabledOptions="disabledOptions"
                @change="handleTabSelectValueChange($event, index)"
                @search="handleSearch($event, index)"
              >
                <el-input
                  v-model="list.title"
                  :style="{ width: 150 + 'px' }"
                  size="mini"
                  :readonly="true"
                  :clearable="true"
                ></el-input>
              </tab-select>
            </template>
          </div>
          <i
            class="el-icon-remove-outline close-item"
            @click="removeItem(index)"
          >
          </i>
        </div>
      </template>
    </div>
    <div class="groupper-bottom" @click="handleAddItem">
      <svg-icon icon-class="list" size="16"></svg-icon>
      <span class="title-text">{{ operateBtnTitle }}</span>
    </div>
  </div>
</template>
<script>
import tabSelect from "@/views/components/tabSelect";
import { uuid, cloneObject } from "@/utils";

export default {
  model: {
    event: "change",
    prop: "groupperData",
  },
  props: {
    /**
     * [{
     *   value: "", //值
     *   category:""  // 如果是tab-select类型的值,为tab值
     * }]
     */
    groupperData: {
      type: Array,
      default() {
        return [];
      },
    },

    operateBtnTitle: {
      type: String,
      default: "添加分组项",
    },

    /**
     *  input 单输入框
     *  select  选择输入框
     *  tabSelect  tabselect组件
     */
    valueComponent: {
      type: String,
      default: "input",
    },

    /**
     * [{
     *   label:'',
     *   value:''
     * }]
     */

    anylysis: {
      type: String,
      default: "trend",
    },

    //组件的 options 配置数据
    options: {
      type: Array,
      default() {
        return [];
      },
    },

    // 不可选选项
    disabledOptions: {
      type: Array,
      default() {
        return [];
      },
    },

    // 分组项的上限个数
    limit: {
      type: Number,
      default: 10,
    },
  },
  components: {
    tabSelect,
  },
  data() {
    return {
      listData: [],
    };
  },

  watch: {
    groupperData: {
      immediate: true,
      handler(val) {
        if (Array.isArray(val)) {
          this.listData = val;
          val.forEach((item, index) => {
            this.handleInitShow(item, index);
          });
        }
      },
    },
  },

  methods: {
    // 根据值设置回显(input 和 tabselector), 如果值在列表里不存在,则设置当前值直接显示出来
    handleInitShow(item, index) {
      const value = item.value;
      const category = item.category;

      const itemData = { title: "", value: "", category: "", search: "" };

      if (category && Array.isArray(this.options)) {
        const curTab = this.options.find((tabItem) => {
          return tabItem.name === category;
        });

        if (curTab && value) {
          const curItem = curTab.data.find((listItem) => {
            return listItem.value === value;
          });

          this.curValue = { ...itemData };
          if (curItem) {
            item.title = curItem.title;
          } else {
            //设置title显示值为value
            item.title = value;
          }
        } else {
          this.listData[index] = { ...itemData };
          item.title = value;
        }
      }
    },

    handleSearch(data, index) {
      this.listData[index].search = data;
      this.$emit("change", cloneObject(this.listData));
    },

    handleAddItem() {
      if (this.listData.length === this.limit) {
        this.$message({
          message: `上限不能超过${this.limit}个!`,
          type: "warning",
        });
        return;
      }

      let item = { value: "" };

      if (this.valueComponent === "tabSelect") {
        const defaultValue = this.getDefaultValue();
        item = {
          id: uuid(),
          value: defaultValue ? defaultValue.value : "",
          category: defaultValue ? defaultValue.category : "",
          search: "",
        };
      }

      this.listData.push(item);
      this.$emit("addItem");
      this.$emit("change", cloneObject(this.listData));
    },

    getDefaultValue() {
      const list = this.options.reduce((pre, item) => {
        item.data.forEach((optionsItem) => (optionsItem.category = item.name));
        return pre.concat(item.data);
      }, []);

      for (let i = 0, len = list.length; i < len; i++) {
        const listItem = list[i];
        const isDisabledItem = this.disabledOptions.some(
          (item) => item.value === listItem.value
        );
        if (!isDisabledItem) {
          return listItem;
        }
      }
    },

    removeItem(index) {
      this.listData.splice(index, 1);

      this.$emit("removeItem");
      this.$emit("change", cloneObject(this.listData));
    },

    // input select
    handleItemValueChange(payload) {
      this.$emit("itemValueChange", payload);
      this.$emit("change", cloneObject(this.listData));
    },

    // tab-select
    handleTabSelectValueChange(data, index) {
      this.listData[index] = { ...data.data[0], category: data.category };
      this.$emit("itemValueChange", data);
      this.$emit("change", cloneObject(this.listData));
    },
  },
};
</script>

<style lang="scss" scoped>
@import "@/styles/index.scss";
$inputMaxWidth: 300px;
.groupper {
  .group-items-container {
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: flex-start;

    .item-wraper {
      display: flex;
      justify-content: flex-start;
      align-items: center;
      padding-right: 15px;
      margin-top: 8px;

      .num-wrapper {
        margin-right: 5px;
        color: $color-text;
      }

      .close-item {
        margin-left: 5px;
        cursor: pointer;
        display: none;
        color: $color-desc;

        &:hover {
          color: $color-primary;
        }
      }

      &:hover {
        .close-item {
          display: inline-block;
        }
      }
    }

    .groupper-item {
      position: relative;
      max-width: $inputMaxWidth;
      height: 28px;
      overflow: hidden;

      .groupper-label {
        height: 28px;
        max-width: $inputMaxWidth;
        min-width: 100px;
        display: inline-block;
        line-height: 28px;
        font-size: 16px;
        padding: 0 15px;
        padding-right: 30px;
        overflow: hidden;
        visibility: hidden;
      }

      .groupper-input-item {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 20px;
        min-width: 100px;
      }
    }
  }

  .groupper-bottom {
    display: flex;
    justify-content: flex-start;
    align-items: center;
    margin-top: 10px;
    color: $color-primary;
  }
}
</style>
