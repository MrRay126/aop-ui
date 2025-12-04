<template>
  <el-popover
    popper-class="date-type-selector"
    placement="bottom-start"
    v-model="isListerShow"
    trigger="click"
    :disabled="disabled"
    :close-delay="closeDelay"
    @after-enter="handleListerShow"
  >
    <template v-slot:reference>
      <div class="content-wrapper">
        <slot :labelValue="selectValueLabel">
          <el-button size="mini" :disabled="disabled" plain>
            <span :class="['title', { 'is-disabled': disabled }]">
              {{ selectValueLabel }}
            </span>
            <span :class="['pointer', isListerShow ? 'turn-down' : 'turn-up']">
              <span class="el-icon-arrow-down"></span>
            </span>
          </el-button>
        </slot>
      </div>
    </template>
    <div class="lister" v-show="isListerShow">
      <template v-for="(listItem, index) in listerData">
        <template v-if="listItem.unit === 'week'">
          <div
            :key="index"
            :class="['list-item', { focus: focusIndex === index }]"
            @click="select(index)"
          >
            <span>{{ listItem.label }}</span>
            <template v-if="hasWeekDaySettor">
              <el-popover v-model="isWeekdayPanelShow" placement="right">
                <template v-slot:reference>
                  <span @click.stop class="weeker-icon">
                    <svg-icon icon-class="calendar"></svg-icon>
                  </span>
                </template>
                <WeekdayPanel
                  :isWeekdayPanelShow="isWeekdayPanelShow"
                  :defaultData="weekDayData.weekStart"
                  @cancel="weekdayCancel"
                  @commit="weekdayCommit"
                ></WeekdayPanel>
              </el-popover>
            </template>
          </div>
        </template>
        <!--   v-if="listItem.unit !== 'week'" -->
        <template v-else>
          <div
            :key="index"
            :class="[
              'list-item',
              {
                focus: focusIndex === index,
                'focus-parent':
                  focusIndex === index &&
                  listItem.children &&
                  listItem.children.length > 0,
              },
            ]"
            @click="select(index)"
          >
            <template v-if="listItem.children && listItem.children.length > 0">
              <el-popover v-model="subListShowStatus[index]" placement="right">
                <template #reference>
                  <div class="list-item-refenrence">
                    <span>{{ listItem.label }}</span>
                    <i class="el-icon-arrow-right icon"></i>
                  </div>
                </template>
                <template v-for="(child, childIndex) in listItem.children">
                  <div
                    :key="`${index}:${childIndex}`"
                    :class="[
                      'list-item',
                      {
                        focus:
                          listItem.unit === value.unit &&
                          focusChildIndex === childIndex,
                      },
                    ]"
                    @click="selectChild(listItem, index, child, childIndex)"
                  >
                    <span>{{ child.label }}</span>
                    <i
                      v-if="
                        listItem.unit === value.unit &&
                        focusChildIndex === childIndex
                      "
                      class="el-icon-check icon"
                    ></i>
                  </div>
                </template>
              </el-popover>
            </template>
            <template v-else>
              {{ listItem.label }}
            </template>
          </div>
        </template>
      </template>
    </div>
  </el-popover>
</template>

<script>
import WeekdayPanel from "./WeekdayPanel";
export default {
  name: "UnitSelector",
  model: {
    prop: "value",
    event: "change",
  },
  props: {
    value: {
      type: Object,
      default() {
        return {
          unit: "day",
          weekStart: 0,
        };
      },
    },
    disabled: {
      type: Boolean,
      default: false,
    },
    listerData: {
      type: Array,
      default() {
        return [
          { label: "按天", unit: "day" },
          {
            label: "按分钟",
            unit: "minutes",
            children: [
              { label: "1分钟", value: 1 },
              { label: "5分钟", value: 5 },
              { label: "10分钟", value: 10 },
            ],
          },
          {
            label: "按小时",
            unit: "hour",
            children: [],
          },
          { label: "按周", unit: "week", weekStart: 0 },
          { label: "按月", unit: "month" },
          { label: "合计", unit: "sum" },
        ];
      },
    },
    hasWeekDaySettor: {
      type: Boolean,
      default: true,
    },
  },
  components: {
    WeekdayPanel,
  },
  data() {
    return {
      closeDelay: 200,
      selectValueLabel: "",
      focusIndex: -1,
      focusChildIndex: -1,
      weekDayIndex: -1,
      isListerShow: false,
      subListShowStatus: {
        1: true,
      },

      // listerData: [
      //   { label: "按天", unit: "day" },
      //   { label: "按分钟", unit: "minutes" },
      //   { label: "按小时", unit: "hour" },
      //   { label: "按周", unit: "week", weekStart: 0 },
      //   { label: "按月", unit: "month" },
      //   { label: "合计", unit: "sum" },
      // ],
      unitLabelDict: {
        day: "天",
        minutes: "分钟",
        hour: "小时",
        week: "周",
        month: "月",
      },
      isWeekdayPanelShow: false,
      weekDayData: {
        value: 0, //星期一是0  星期二是1 选项的值
        label: "星期一",
        weekStart: 0, //周几是起点的值
      },
    };
  },
  watch: {
    value: {
      handler(val) {
        // val.value = 2;
        this.weekDayData.weekStart = val.weekStart || 0;
        this.listerData.forEach((item, index) => {
          if (item.unit === val.unit) {
            // this.selectValueLabel = item.label;
            this.setLabel(val);

            this.focusIndex = index;
            if (typeof val.value !== "undefined") {
              if (Array.isArray(item.children) && item.children.length > 0) {
                this.focusChildIndex = item.children.findIndex((child) => {
                  return child.value === val.value;
                });
              }
            }
          }
        });
        this.weekDayIndex = this.listerData.findIndex((item) => {
          return item.unit === "week";
        });
      },
      immediate: true,
    },
  },
  methods: {
    handleListerShow() {
      if (
        this.listerData[this.focusIndex].children &&
        this.listerData[this.focusIndex].children.length > 0 &&
        this.value["value"]
      ) {
        this.setSubListerVisible(this.focusIndex, true);
      }
    },

    setLabel(val) {
      const item = this.listerData.find((item) => {
        return item.unit === val.unit;
      });

      if (!item) return;

      if (item.unit === "sum") {
        this.selectValueLabel = item.label; //合计
      } else if (item.children && item.children.length > 0 && val.value) {
        this.selectValueLabel = `按${val.value}${
          this.unitLabelDict[item.unit]
        }`;
      } else {
        this.selectValueLabel = item.label;
      }
    },

    getApiValue(parent, child) {
      //输出值 {unit, value, weekStart}
      const apiValue = {
        unit: parent.unit,
        value: 1,
        weekStart: 0,
      };

      if (parent && parent.unit === "week") {
        // 如果选择的是周
        apiValue.weekStart = this.weekDayData.weekStart;
      }
      if (child && child.value) {
        apiValue.value = child.value;
      }

      return apiValue;
    },
    weekdayCancel() {
      this.isWeekdayPanelShow = false;
    },
    weekdayCommit(data) {
      this.weekDayData.weekStart = data.value;
      this.hideLister();
      this.select(this.weekDayIndex);
    },
    select(index) {
      this.focusIndex = index;

      if (
        this.listerData[index].children &&
        this.listerData[index].children.length > 0
      ) {
        this.resetAllSubListHidden();
        this.setSubListerVisible(index, true);
        return;
      }

      this.resetAllSubListHidden();
      const apiValue = this.getApiValue(this.listerData[index]);
      // this.selectValueLabel = selectData.label;
      // if (index === this.weekDayIndex) {
      //   // 如果选择的是周
      //   selectData["weekStart"] = this.weekDayData.value;
      // }
      this.setLabel(apiValue);
      this.$emit("change", apiValue);
      //
      setTimeout(() => {
        this.hideLister();
      }, 200);
    },
    selectChild(parent, index, child, childIndex) {
      this.focusIndex = index;
      this.focusChildIndex = childIndex;
      const apiValue = this.getApiValue(parent, child);
      this.setLabel(parent, child);
      this.$emit("change", apiValue);

      setTimeout(() => {
        this.hideLister();
        //点击时需关闭子菜单
        this.setSubListerVisible(index, false);
        // this.subListShowStatus[index] = false;
      }, 200);
    },

    resetAllSubListHidden() {
      for (let prop in this.subListShowStatus) {
        this.subListShowStatus[prop] = false;
      }
    },
    setSubListerVisible(index, visible) {
      this.subListShowStatus[index] = visible;
    },
    toggleLister() {
      this.isListerShow = !this.isListerShow;
    },
    showLister() {
      this.isListerShow = true;
    },
    hideLister() {
      this.isListerShow = false;
      this.isWeekdayPanelShow = false;
    },
  },
  beforeMount() {
    this._close = (e) => {
      // 如果点击发生在当前组件内部，则不处理
      if (this.$el.contains(e.target)) {
        return;
      }
      this.hideLister();
    };
    window.addEventListener("click", this._close);
  },
  beforeUnmount() {
    window.removeEventListener("click", this._close);
  },
};
</script>

<style scoped lang="scss">
@import "@/styles/index.scss";

$height: 28px;

.icon {
  font-size: 12px;
}
.list-item-refenrence {
  width: 140px;
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.content-wrapper {
  display: inline-block;
  overflow: auto;
  vertical-align: top;
}

.title {
  font-size: 14px;
  color: $color-text;
  font-weight: normal;

  &.is-disabled {
    color: #c0c4cc;
  }
}

.pointer {
  display: inline-block;
  transition: transform 0.2s ease;
  transform: scale(0.88);

  &.turn-down {
    transform: rotate(-180deg) scale(0.88);
  }

  &.turn-up {
    transform: rotate(0deg) scale(0.88);
  }
}

.lister {
  transform-origin: top center;
  z-index: 99;
  padding: 4px;
  background-color: #fff;
  border-radius: 2px;
}

.list-item {
  position: relative;
  align-items: center;
  justify-content: space-between;
  height: 24px;
  margin-bottom: 7px;
  padding: 0 8px;
  color: #42546d;
  font-size: 14px;
  line-height: 28px;
  cursor: pointer;
  display: flex;

  &:hover {
    background-color: rgb(249, 249, 249);
  }

  &.focus {
    background-color: #e4f2ff;
  }

  &.focus-parent {
    background-color: rgb(249, 249, 249);
  }

  .weeker-icon {
    display: flex;
    align-items: center;
    margin-top: -2px;
    color: #7a84a9;
  }
}
</style>
