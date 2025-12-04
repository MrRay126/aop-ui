<template>
  <el-popover
    popper-class="time-unit-popper"
    placement="bottom-start"
    :close-delay="closeDelay"
    width="200"
    trigger="click"
    :disabled="disabled"
    v-model="isOpenLister"
    @show="listShowHandler"
  >
    <div class="container__lister">
      <div
        class="list-group"
        v-for="(groupItem, groupIndex) in groupData"
        :key="groupIndex"
      >
        <div class="group-title group-list-item" v-if="groupItem.label">
          <span class="group-label">
            {{ groupItem.label }}
          </span>
          <template v-if="groupItem.useComponent === 'week'">
            <el-popover
              v-model="isWeekdayPanelShow"
              placement="right"
              trigger="click"
            >
              <template v-slot:reference>
                <span @click.stop="" class="weeker-icon">
                  <svg-icon icon-class="calendar"></svg-icon>
                </span>
              </template>
              <template>
                <span @click.stop class="weeker-icon">
                  <WeekdayPanel
                    :isWeekdayPanelShow="isWeekdayPanelShow"
                    :defaultData="weekDayData.value"
                    @cancel="weekdayCancel"
                    @commit="weekdayCommit"
                  ></WeekdayPanel>
                </span>
              </template>
            </el-popover>
          </template>
        </div>

        <template v-for="(listItem, index) in groupItem.children">
          <div
            v-if="listItem.isInput"
            :key="`${groupIndex}${index}`"
            :class="[
              'list-item',
              { focus: focusIndex === `${groupIndex}${index}` },
            ]"
            @click="
              select(
                listItem,
                groupItem.unit,
                groupItem.label,
                groupIndex,
                index
              )
            "
          >
            <div @click.stop="">
              <el-input-number
                v-model="listItem.value"
                controls-position="right"
                :min="0"
                :max="14"
                size="small"
              ></el-input-number>
              {{ groupItem.label }}
            </div>
            <span
              class="correct-icon"
              v-if="focusIndex === `${groupIndex}${index}`"
            >
              <svg-icon icon-class="correct"></svg-icon>
            </span>
          </div>

          <div
            v-else
            :key="`${groupIndex}${index}`"
            :class="[
              'list-item',
              { focus: focusIndex === `${groupIndex}${index}` },
            ]"
            @click="
              select(
                listItem,
                groupItem.unit,
                groupItem.label,
                groupIndex,
                index
              )
            "
          >
            {{ listItem.label }}
            <span
              class="correct-icon"
              v-if="focusIndex === `${groupIndex}${index}`"
            >
              <svg-icon icon-class="correct"></svg-icon>
            </span>
          </div>
        </template>
      </div>
    </div>

    <template v-slot:reference>
      <div class="content-wrapper">
        <slot :labelValue="selectValueLabel">
          <el-button size="mini" class="title-btn" :disabled="disabled" plain>
            <span :class="{ 'title-label-text': !disabled }">
              <span :class="['label-wrapper', { 'is-disabled': disabled }]">
                {{ selectValueLabel }}
              </span>
              <span
                :class="['pointer', isOpenLister ? 'turn-down' : 'turn-up']"
              >
                <span class="el-icon-arrow-down"></span>
              </span>
            </span>
          </el-button>
        </slot>
      </div>
    </template>
  </el-popover>
</template>

<script>
import WeekdayPanel from "./WeekdayPanel";
export default {
  name: "TimeUnitSelector",
  model: {
    prop: "value",
    event: "change",
  },
  props: {
    value: {
      type: Object,
      default() {
        return {
          value: -1,
          unit: "",
          weekStart: -1,
        };
      },
    },
    disabled: {
      type: Boolean,
      default: false,
    },
  },
  components: {
    WeekdayPanel,
  },
  data() {
    return {
      closeDelay: 500,
      selectValueLabel: "",
      focusIndex: -1,
      isOpenLister: false,
      isWeekdayPanelShow: false,

      selectedGroupIndex: -1,
      selectedChildIndex: -1,

      weekDayData: {
        value: 0,
        label: "星期一",
      },
      selectedData: {
        value: -1,
        unit: "",
        weekStart: -1,
      },
      groupData: [
        {
          label: "日",
          unit: "day",
          children: [
            {
              label: "当日",
              value: 0,
            },
            {
              label: "次日",
              value: 1,
            },
            {
              label: "7日",
              value: 7,
            },
            {
              label: "14日",
              value: 14,
            },
            {
              isInput: true,
              value: 30,
            },
          ],
        },
        {
          label: "周",
          unit: "week",
          useComponent: "week",
          children: [
            {
              label: "当周",
              value: 0,
            },
            {
              label: "次周",
              value: 1,
            },
            {
              label: "4周",
              value: 4,
            },
            {
              label: "8周",
              value: 8,
            },
            {
              isInput: true,
              value: 16,
            },
          ],
        },
        {
          label: "月",
          unit: "month",
          children: [
            {
              label: "当月",
              value: 0,
            },
            {
              label: "次月",
              value: 1,
            },
            {
              label: "3月",
              value: 3,
            },
            {
              label: "6月",
              value: 6,
            },
            {
              isInput: true,
              value: 12,
            },
          ],
        },
      ],
    };
  },
  watch: {
    value: {
      handler(data) {
        if (!data) return;
        this.initSelectedStatus(data);
        this.initWeekDayData(data);
      },
      immediate: true,
    },
  },
  methods: {
    listShowHandler() {
      //如果选中项是input类型则重置其值
      if (this.selectedGroupIndex !== -1 && this.selectedChildIndex !== -1) {
        const selectedItem =
          this.groupData[this.selectedGroupIndex].children[
            this.selectedChildIndex
          ];

        if (selectedItem.isInput) {
          selectedItem.value = this.selectedData.value;
        }
      }
    },
    weekdayCommit(data) {
      this.isWeekdayPanelShow = false;
      this.weekDayData.value = data.value;
      const eventData = {
        value: this.selectedData.value,
        unit: this.selectedData.unit,
        weekStart: data.value,
      };
      this.$emit("change", eventData);
    },
    weekdayCancel() {
      this.isWeekdayPanelShow = false;
    },
    toggleLister() {
      this.isOpenLister = !this.isOpenLister;
    },
    select(item, unit, groupLabel, groupIndex, listIndex) {
      this.isOpenLister = false;
      this.isWeekdayPanelShow = false;
      this.focusIndex = `${groupIndex}${listIndex}`;
      this.selectValueLabel = item.label ? item.label : item.value + groupLabel;

      const eventData = {
        value: item.value,
        unit: unit,
        weekStart: this.weekDayData.value,
      };
      // if (unit === "week") {
      //   eventData.weekStart = this.weekDayData.value;
      // } else {
      //   delete eventData.weekStart;
      // }
      if (JSON.stringify(eventData) !== JSON.stringify(this.selectedData)) {
        this.selectedData = eventData;
        this.$emit("change", eventData);
      }
    },
    initSelectedStatus(data) {
      const selectedGroup = this.groupData.find((groupItem) => {
        return groupItem.unit === data.unit;
      });

      if (!selectedGroup) return;

      const selectChild = selectedGroup.children.find((childItem) => {
        return childItem.value === data.value;
      });

      const selectedGroupIndex = this.groupData.indexOf(selectedGroup);
      const selectedChildIndex = selectedGroup.children.indexOf(selectChild);

      this.selectedGroupIndex = selectedGroupIndex;
      this.selectedChildIndex = selectedChildIndex;

      if (!selectChild) {
        //如果是用户自定义设置的值则使用输入框作为回显
        selectedGroup.children[selectedGroup.children.length - 1].value =
          data.value;
        this.selectValueLabel = `${data.value}${selectedGroup.label}`;
        this.focusIndex = `${selectedGroupIndex}${
          selectedGroup.children.length - 1
        }`;
        return;
      }

      this.selectValueLabel =
        selectChild.label || `${selectChild.value}${selectedGroup.label}`;
      this.focusIndex = `${selectedGroupIndex}${selectedChildIndex}`;

      //初始化选中的值记录
      this.selectedData.unit = data.unit;
      this.selectedData.value = data.value;
      this.selectedData.weekStart = data.weekStart || 0;
    },
    initWeekDayData(data) {
      this.weekDayData.value = data.weekStart || this.weekDayData.value;
    },
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
@import "@/styles/index.scss";

$height: 28px;
.title-label-text {
  color: $color-text;
}
.title-btn {
  font-size: 14px;
  color: $color-text;
  font-weight: normal;
}

.content-wrapper {
  display: inline-block;
  overflow: auto;
  vertical-align: top;
}

.container__lister {
  max-height: 400px;
  overflow-y: auto;
  transform-origin: top center;
  z-index: 99;
  padding: 6px;
  background-color: #fff;
  border-radius: 2px;
  .list-group {
    margin-bottom: 5px;
  }
  .group-list-item {
    font-weight: bold;
    position: relative;
    align-items: center;
    justify-content: space-between;
    height: 32px;
    line-height: 32px;
    padding: 0 5px;
    margin-bottom: 5px;
    color: #42546d;
    font-size: 14px;
    cursor: pointer;
    display: flex;

    .weeker-icon {
      display: flex;
      align-items: center;
      color: #7a84a9;
      vertical-align: middle;
    }
  }
  .list-item {
    position: relative;
    align-items: center;
    justify-content: space-between;
    height: 32px;
    line-height: 32px;
    padding: 0 5px;
    margin-bottom: 5px;
    color: #42546d;
    font-size: 14px;
    cursor: pointer;
    display: flex;

    &:hover {
      background-color: rgb(249, 249, 249);
    }

    &.focus {
      background-color: #e4f2ff;
    }

    .correct-icon {
      color: $color-primary;
      transform: scale(0.8);
      line-height: 1;
    }
  }
}
</style>
