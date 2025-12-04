<template>
  <div class="filter-item" :class="{ disabled: disabled }">
    <div class="input-item-wrapper">
      <div class="keys-wrapper" style="float: left">
        <el-select
          v-model="key"
          @change="handleKeyChange"
          size="mini"
          style="width: 100%"
          value-key="value"
          placeholder="请选择"
          :disabled="disabled"
        >
          <template v-for="(item, index) in optionsData">
            <el-option
              :value="item"
              :label="item.label"
              :key="index"
            ></el-option>
          </template>
        </el-select>
      </div>
      <div class="relation-wrapper">
        <el-select
          v-model="relation"
          @change="handleRelationChange"
          size="mini"
          value-key="value"
          placeholder="请选择"
          :disabled="disabled"
        >
          <template v-for="(item, index) in relationList">
            <el-option
              :value="item"
              :label="item.label"
              :key="index"
            ></el-option>
          </template>
        </el-select>
      </div>

      <div class="value-wrapper">
        <template v-if="valueComponentType.name === 'number'">
          <el-input-number
            v-model="value"
            @change="handleValueChange"
            class="between-value"
            size="mini"
            controls-position="right"
            placeholder="请输入"
            :min="0"
            :disabled="disabled"
          ></el-input-number>
        </template>
        <template v-if="valueComponentType.name === 'numberBetween'">
          <el-input-number
            v-model="value[0]"
            @change="handleValueChange"
            class="between-value"
            size="mini"
            controls-position="right"
            placeholder="请输入"
            :min="0"
            :disabled="disabled"
          ></el-input-number>
          <span class="span-text">与</span>
          <el-input-number
            v-model="value[1]"
            @change="handleValueChange"
            class="between-value"
            size="mini"
            controls-position="right"
            placeholder="请输入"
            :min="0"
            :disabled="disabled"
          ></el-input-number>
          <span class="span-text">之间</span>
        </template>

        <template v-if="valueComponentType.name === 'cascader'">
          <el-cascader
            v-model="value"
            @change="handleValueChange"
            class="cascader"
            size="mini"
            placeholder="请选择"
            :props="{ multiple: true }"
            :options="valueOptionsList"
            :show-all-levels="true"
            separator=" - "
            :disabled="disabled"
          ></el-cascader>
        </template>

        <template v-if="valueComponentType.name === 'text'">
          <el-input
            v-model="value"
            @change="handleValueChange"
            class="value-input-item"
            type="text"
            size="mini"
            placeholder="请输入"
            :disabled="disabled"
          ></el-input>

          <template v-if="value.length > 16">
            <el-tooltip effect="light">
              <i class="el-icon-info icon-info"></i>
              <div slot="content" style="max-width: 300px">
                {{ value }}
              </div>
            </el-tooltip>
          </template>
        </template>
        <template v-if="valueComponentType.name === 'select'">
          <template v-if="!valueComponentType.options.isRemote">
            <template v-if="isSelectComponentShow">
              <el-select
                v-model="value"
                @change="handleValueChange"
                size="mini"
                class="select-value"
                placeholder="请选择"
                filterable
                :disabled="disabled"
                :multiple="valueComponentType.options.isMultipleSelect"
              >
                <template v-for="(item, index) in valueOptionsList">
                  <el-option
                    :label="item.label"
                    :value="item.value"
                    :key="index"
                  ></el-option>
                </template>
              </el-select>
            </template>
          </template>
          <template v-else>
            <template v-if="isSelectComponentShow">
              <!-- remoteValueOptionList::{{ remoteValueOptionList }} -->
              <el-select
                v-model="value"
                @change="handleValueChange"
                class="select-value"
                size="mini"
                placeholder="请输入"
                filterable
                remote
                allow-create
                :multiple="valueComponentType.options.isMultipleSelect"
                :remote-method="
                  (val) => {
                    remoteMethod(val, valueComponentType.options.remoteUrl);
                  }
                "
                :loading="isRemoteSelectLoading"
                :disabled="disabled"
              >
                <template v-for="(item, index) in remoteValueOptionList">
                  <el-option
                    :key="index"
                    :label="item.label"
                    :value="item.value"
                  ></el-option>
                </template>
              </el-select>
            </template>
          </template>
        </template>
        <template v-if="valueComponentType.name === 'datetime'">
          <el-date-picker
            v-model="value"
            @change="handleValueChange"
            type="datetime"
            value-format="yyyy-MM-dd HH:mm:ss"
            placeholder="选择日期时间"
            size="mini"
          >
          </el-date-picker>
        </template>
        <template v-if="valueComponentType.name === 'datetimeRange'">
          <el-date-picker
            v-model="value"
            @change="handleValueChange"
            type="datetimerange"
            size="mini"
            value-format="yyyy-MM-dd HH:mm:ss"
            range-separator="至"
            start-placeholder="开始时间"
            end-placeholder="结束时间"
          >
          </el-date-picker>
        </template>
      </div>
    </div>
    <div class="operator">
      <span @click="handleAdd">
        <svg-icon :disabled="disabled" icon-class="filter" size="14"></svg-icon>
      </span>
      <span @click="handleRemove">
        <svg-icon
          :disabled="disabled"
          icon-class="close-circle"
          size="14"
        ></svg-icon>
      </span>
    </div>
  </div>
</template>
<script>
import {
  getValueComponentType,
  getInitialValue,
  // componentconfig,
} from "./data";
export default {
  props: {
    filterValue: {
      type: Object,
      default() {
        return null; // {key , relation , value}
      },
    },

    /**
     * @description optionsData数据格式
     * [
     *    {
     *      label: "渠道number",
     *      value: 1,
     *      type: "number" ,
     *      keyList:[
     *        {
     *          label:'',
     *          value:'',
     *          type:'text',
     *        },
     *        {
     *          label:'',
     *          value:'',
     *          type:'chanel',
     *          choices:[
     *             {
     *               value: "zhinan",
     *               label: "指南",
     *               children:[]
     *             }
     *           ]
     *        }
     *     ]
     *   },
     * ]
     */
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

    /**
     *  @description: 外部传如的值组件的options选项
     *   1. value组件类型是cascader时,该数据应对应为cascader的option数据
     *   [{
     *       value: "zhinan",
     *       label: "指南",
     *       children: []
     *   }]
     *
     *   2. value组件类型是select时,该数据应对应为select的option数据
     *   [
     *     {label:'',value:''}
     *   ]
     */
    valueOptions: {
      type: Array,
      default() {
        return [];
      },
    },

    disabled: {
      type: Boolean,
      default: false,
    },
  },
  components: {},
  data() {
    return {
      isSelectComponentShow: true,
      isRemoteSelectLoading: false,
      remoteValueOptionList: [],

      relationList: [],

      key: null,
      relation: "",
      value: "", // "" | [],

      valueComponentType: { name: "text", options: { isRemote: false } }, //使用value输入组件的类型,默认使用 "text"类型
      valueOptionsList: [],
    };
  },
  computed: {},
  watch: {
    filterValue: {
      immediate: true,
      handler(val) {
        const isEdit = !!val?.key;
        this.init(isEdit);
      },
    },
    optionsData: {
      immediate: true,
      handler(val) {
        const isEdit = Array.isArray(val) && val.length > 0;
        this.init(isEdit);
      },
    },
  },

  methods: {
    //函数 依赖远程数据值(remoteValueOptionList)所以函数不能外提
    getFilterItemTag() {
      if (this.key && this.relation && this.value) {
        const key = this.key.label;
        const relation = this.relation.label;
        let valueLabel = "";
        const componentName = this.valueComponentType.name;
        if (
          [
            "number",
            "numberBetween",
            "text",
            "datetime",
            "datetimeRange",
          ].includes(componentName)
        ) {
          valueLabel = this.value;
        } else if (componentName === "cascader") {
          const valueLabelsArr = [];
          this.value.forEach((item) => {
            let parentLabel = "";
            let childLabel = "";

            const [parent, child] = item;
            if (parent && child) {
              const parentFind = this.valueOptionsList.find((item) => {
                return item.value === parent;
              });
              const childFind = parentFind.children.find((item) => {
                // 是否是children??
                return item.value === child;
              });
              if (parentFind && childFind) {
                parentLabel = parentFind.label;
                childLabel = childFind.label;
              }

              valueLabelsArr.push(`${parentLabel}-${childLabel}`);
            }
          });
          valueLabel = valueLabelsArr;
        } else if (componentName === "select") {
          // let valuelabel=
          let optionList = this.remoteValueOptionList.map((item) => {
            return { label: item.value, value: item.value };
          });

          if (!this.valueComponentType.options.isMultipleSelect) {
            this.value = [this.value];
          }

          if (!this.valueComponentType.options.isRemote) {
            optionList = this.valueOptionsList;
          }

          // console.log("optionList::", this.remoteValueOptionList, this.value);
          valueLabel = this.value.map((item) => {
            const findOption = optionList.find((optionItem) => {
              return optionItem.value === item;
            });

            if (findOption) {
              return findOption.label;
            } else {
              // 输入的值但是无options匹配的
              return item;
            }
          });
        }

        return {
          key,
          relation,
          value: valueLabel,
        };
      }
    },
    // 值的远程搜索函数
    remoteMethod(value, url) {
      clearTimeout(this.timer);
      this.remoteValueOptionList = [];
      if (value) {
        this.isRemoteSelectLoading = true;
        this.timer = setTimeout(() => {
          this.$store
            .dispatch("app/querySearch", {
              url,
              query: {
                value,
                code: this.filterValue.key,
                project_id: this.$store.getters.appId,
              },
            })
            .then((data) => {
              if (Array.isArray(data)) {
                this.remoteValueOptionList = data;
              }
            })
            .catch(() => {
              // noop
            })
            .finally(() => {
              this.isRemoteSelectLoading = false;
            });
        }, 100);
      }
    },

    handleAdd() {
      if (!this.disabled) {
        this.$emit("add");
      }
    },
    handleRemove() {
      if (!this.disabled) {
        this.$emit("remove");
      }
    },

    handleKeyChange() {
      // 完全重新加载组件,初始化显示, 避免显示问题
      this.isSelectComponentShow = false;
      //初始化relation
      if (this.key) {
        this.relationList = this.key.options || [];
        this.relation = this.relationList[0];
        // this.handleRelationChange();
        if (this.key?.choices) {
          this.valueOptionsList = this.key.choices;
        }
      }
      //初始化值部分
      if (this.key && this.relation) {
        //获取使用的值组件
        const componentType = getValueComponentType(
          this.key,
          this.relation.label,
          this.valueComponentConfig
        );

        //更换组件并设置初始值
        this.valueComponentType = componentType;

        this.value = getInitialValue(componentType);
        // 重置远程搜索类型的选项值options

        this.remoteValueOptionList = [];
      }

      this.handleItemChange();

      this.$emit("keyChange", this.key);

      this.$nextTick(() => {
        this.isSelectComponentShow = true;
      });
    },

    handleRelationChange() {
      //初始化值部分
      if (this.key && this.relation) {
        //获取使用的值组件
        const componentType = getValueComponentType(
          this.key,
          this.relation.label,
          this.valueComponentConfig
        );

        if (this.valueComponentType.name !== componentType.value) {
          //更换组件并设置初始值
          this.valueComponentType = componentType;
          this.value = getInitialValue(componentType);
        }
      }
      this.handleItemChange();
    },

    handleValueChange() {
      this.handleItemChange();
    },

    handleItemChange() {
      this.$emit("itemChange", {
        id: this.filterValue.id,
        key: this.key?.value || null,
        relation: this.relation?.value || null,
        value: this.value,
      });
    },

    emitFilterValue() {
      this.$emit("change", "value");
    },

    /**
     * @params {Boolean} isEdit 是否是回显的初始化
     */
    async init(isEdit = false) {
      if (this.filterValue && this.optionsData.length > 0) {
        //默认按有初始值算
        this.key = this.optionsData.find((item) => {
          return item.value === this.filterValue.key;
        });

        if (this.key) {
          this.relationList = this.key.options;
          this.relation = this.relationList.find((item) => {
            return item.value === this.filterValue.relation;
          });

          this.valueOptionsList = this.key.choices;
          this.value = this.filterValue.value;
        }
      }

      if (this.key && this.relation) {
        //获取使用的值组件
        const componentType = getValueComponentType(
          this.key,
          this.relation.label,
          this.valueComponentConfig
        );

        this.valueComponentType = componentType;

        //设置初始值
        if (!isEdit) {
          this.value = getInitialValue(componentType);
        }
      }
    },
  },
  async created() {
    //初始化在watch
  },
};
</script>
<style lang="scss" scoped>
$shallow-color-text: #8395ad;
$color-text: #42546d;
// $shallow-color-border: #c0c9d4;
// $color-border: #42546d;
// $color-primary: #2d8cf0;
// $normal-background-color: rgb(236, 236, 236);
$light-background-color: rgb(241, 240, 240);
.filter-item {
  display: flex;
  align-items: center;
  justify-content: flex-start;
  width: 100%;
  overflow-x: auto;
  padding-bottom: 10px;
  flex: 0 0 auto;
  padding: 5px;

  &:hover:not(.disabled) {
    background: $light-background-color;
  }

  .icon-info {
    color: #999;
    margin-left: 5px;
    font-size: 14px;
  }

  .relation-wrapper {
    width: 95px;
    flex: 0 0 auto;
    margin-bottom: 5px;
  }

  .value-wrapper {
    display: flex;
    justify-content: flex-start;
    align-items: center;
    margin-bottom: 5px;
    // min-width: 80px;

    .span-text {
      font-size: 12px;
      display: inline-block;
      //   width: 40px;
      white-space: pre;
      flex: 0 0 auto;
      padding: 0 5px;
    }

    .value-input-item {
      width: 225px;
    }

    .cascader {
      width: 225px;
      flex: 0 0 auto;
    }

    .select-value {
      width: 225px;
    }
  }

  .keys-wrapper {
    width: 120px;
    flex: 0 0 auto;
    margin-bottom: 5px;
  }

  .between-value {
    width: 130px;
    flex: 0 0 auto;
  }

  .input-item-wrapper {
    display: flex;
    align-items: center;
    justify-content: flex-start;
    flex-wrap: wrap;
    flex-grow: 1;

    & > div:not(:last-child) {
      margin-right: 10px;
    }
  }

  .operator {
    display: flex;
    justify-content: flex-start;
    align-items: center;
    // width: 40px;
    margin-left: 5px;

    & > span {
      margin-left: 5px;
      cursor: pointer;
    }
    color: $color-text;
  }
}
</style>
