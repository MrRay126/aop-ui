<template>
  <div class="weekdaypannel" v-show="isShowPannel" @click.stop="">
    <div class="weekdaypannel__header">
      <span>自定义周</span>
    </div>
    <div class="weekdaypannel__content">
      <div class="weekdaypannel__content-header">
        按周统计时，将&nbsp;
        <span class="week-day-label">{{ selectedWeekDay }}</span>
        &nbsp;作为周起始日
      </div>
      <ul class="weekdaypannel__content-weekdaycontainer">
        <li
          class="weekdaypannel__content-weekdaycontainer-weekdayitem"
          v-for="(weekday, index) in weekDays"
          :key="index"
          @click="selectWeekDay(index)"
        >
          {{ weekday }}
          <div
            class="weekdaypannel__content-weekdaycontainer-weekdayitem-triangle"
            v-if="seletedIndex === index"
          >
            <span
              class="weekdaypannel__content-weekdaycontainer-weekdayitem-triangle-righticon"
            >
              <svg-icon icon-class="correct"></svg-icon>
            </span>
          </div>
        </li>
      </ul>
    </div>
    <div class="weekdaypannel__footer">
      <div
        class="weekdaypannel__footer-btn weekdaypannel__footer-cancelbtn"
        @click="cancel"
      >
        取 消
      </div>
      <div
        class="weekdaypannel__footer-btn weekdaypannel__footer-submitbtn"
        @click="commit"
      >
        确 定
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "weekdayPanel",
  props: {
    isWeekdayPanelShow: {
      type: Boolean,
      default: false,
    },
    defaultData: {
      type: Number,
      default: 0,
    },
  },
  data() {
    return {
      selectedWeekDay: "星期一",
      seletedIndex: 0,
      resetoreWeekDay: 0,
      weekDays: [
        "星期一",
        "星期二",
        "星期三",
        "星期四",
        "星期五",
        "星期六",
        "星期日",
      ],
      isShowPannel: true,
    };
  },
  watch: {
    isWeekdayPanelShow(val) {
      this.isShowPannel = val;
      if (!val) {
        //关闭时重置一次选中周几
        this.selectWeekDay(this.resetoreWeekDay);
      }
    },
    defaultData: {
      handler(val) {
        this.setRestoreWeekDay(val);
        this.selectWeekDay(val);
      },
      immediate: true,
    },
  },

  methods: {
    // 取消
    cancel() {
      this.$emit("cancel");
      this.selectWeekDay(this.resetoreWeekDay);
    },
    // 确定
    commit() {
      const data = {
        value: this.seletedIndex,
        label: this.weekDays[this.seletedIndex],
      };
      this.$emit("commit", data);
    },
    setRestoreWeekDay(weekDay) {
      this.resetoreWeekDay = weekDay;
    },
    selectWeekDay(index) {
      this.seletedIndex = index;
      this.selectedWeekDay = this.weekDays[index];
    },
  },
};
</script>

<style scoped lang="scss">
@keyframes slideWeekdayKeyFrame {
  0% {
    transform: scaleY(0.8);
    opacity: 0;
  }

  50% {
    opacity: 1;
  }

  100% {
    opacity: 1;
    transform: scaleY(1);
  }
}

.weekday-pannel-enter-active {
  animation: slideWeekdayKeyFrame 0.2s both;
}

.weekday-pannel-leave-active {
  animation: slideWeekdayKeyFrame 0.2s reverse both;
}

ul,
li {
  list-style: none;
  margin: 0;
  padding: 0;
}
.week-day-label {
  font-weight: bold;
}
.weekdaypannel {
  z-index: 99;
  bottom: 30px;
  display: block;
  background: #fff;
  transform-origin: center bottom;
  &__footer {
    display: flex;
    align-items: center;
    justify-content: flex-end;
    height: 50px;
    padding-right: 8px;
    border-top: 1px solid #d9dfe6;
    overflow: auto;
    &-cancelbtn {
      color: #42546d;
      border: 1px solid #d9dfe6;
      &:hover {
        border-color: #3d90ff;
        color: #3d90ff;
      }
    }
    &-btn {
      float: right;
      height: 24px;
      padding: 4px 8px;
      font-weight: normal;
      font-size: 12px;
      line-height: 14px;
      border-radius: 2px;
      box-sizing: border-box;
      transition: all 0.2s;
      cursor: pointer;
    }
    &-submitbtn {
      background-color: #3d90ff;
      border-color: #3d90ff;
      border: 1px solid #3d90ff;
      color: #fff;
      margin: 0px 10px;
      &:hover {
        background-color: #559dfa;
      }
    }
  }
  width: 288px;
  background-color: #fff;
  border-radius: 2px;
  // box-shadow: 0 0 5px #ccc;

  &__header {
    display: flex;
    align-items: center;
    justify-content: flex-start;
    height: 46px;
    padding-left: 12px;
    color: #202d3f;
    font-weight: 500;
    font-size: 14px;
  }

  &__content {
    &-header {
      display: flex;
      align-items: center;
      justify-content: flex-start;
      height: 40px;
      padding-left: 12px;
      color: #42546d;
      font-size: 14px;

      &-weekdaylabel {
        color: #000;
      }
    }

    &-weekdaycontainer {
      position: relative;
      display: flex;
      flex-wrap: wrap;
      padding-bottom: 22px;

      &-weekdayitem {
        position: relative;
        text-align: center;
        width: 60px;
        height: 30px;
        line-height: 30px;
        margin-top: 8px;
        margin-left: 8px;
        color: #42546d;
        font-size: 14px;
        border: 1px solid rgb(239, 239, 239);
        border-radius: 2px;
        cursor: pointer;
        -webkit-user-select: none;
        -ms-user-select: none;
        user-select: none;

        &:hover {
          border: 1px solid #3d90ff;
        }

        &-triangle {
          position: absolute;
          top: 2px;
          right: 2px;
          width: 0;
          height: 0;
          border-top: 16px solid #3d90ff;
          border-left: 16px solid transparent;

          &-righticon {
            display: inline-block;
            position: absolute;
            right: 10px;
            top: -16px;
            width: 0;
            height: 0;
            line-height: 0;
            color: #fff;
            transform-origin: center;
            transform: scale(0.5);
          }
        }
      }
    }
  }
}
</style>
