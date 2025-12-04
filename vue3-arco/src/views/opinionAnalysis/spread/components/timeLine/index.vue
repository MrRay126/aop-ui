<template>
  <!-- 传播时间轴 -->
  <div
    class="spread-time-line"
    :style="{ width: containerWidth + 'px' }"
    ref="timeLineContainer"
    id="el"
  >
    <template v-for="(item, index) in timeLineData">
      <div
        class="data-item"
        :style="{
          left: item.position + 'px',
        }"
        :key="index"
      >
        <el-popover placement="top-start" title="" width="500" trigger="hover">
          <template>
            <!-- 弹出内容 -->
            <div class="popover-info">
              <template v-for="(authorItem, aIndex) in item.data">
                <div class="author-info-container" :key="aIndex">
                  <div class="author-name-wrapper">
                    {{ authorItem.author_name }}
                  </div>
                  <ul class="info-list">
                    <template
                      v-for="(messageItem, mIndex) in authorItem.messages"
                    >
                      <li class="info-wrapper" :key="mIndex">
                        <div class="content">
                          <span class="content-title">内容 : </span>
                          <span>{{ messageItem.content || "-" }}</span>
                        </div>
                        <div class="content-data">
                          <div class="data-wrapper">
                            <div>
                              转发 :
                              <span class="data-num">{{
                                isNumber(messageItem.repeat)
                                  ? messageItem.repeat
                                  : "-"
                              }}</span>
                            </div>
                            <span>&nbsp;,&nbsp;</span>
                            <div>
                              赞 :
                              <span class="data-num">{{
                                isNumber(messageItem.up) ? messageItem.up : "-"
                              }}</span>
                            </div>
                            <span>&nbsp;,&nbsp;</span>
                            <div>
                              评论 :
                              <span class="data-num">{{
                                isNumber(messageItem.comment)
                                  ? messageItem.comment
                                  : "-"
                              }}</span>
                            </div>
                          </div>
                          <div class="date-time-text">
                            {{ messageItem.datetime }}
                          </div>
                        </div>
                      </li>
                    </template>
                  </ul>
                </div>
              </template>
            </div>
          </template>

          <div
            slot="reference"
            class="authors-list"
            :class="{
              'not-full':
                item.config &&
                item.config.listHeight - 20 * item.data.length > 0,
            }"
            :style="{
              left: item.position + 'px',
              height: item.config && item.config.listHeight + 'px',
            }"
          >
            <template v-for="(listItem, index) in item.data">
              <span class="author-name" :key="index">
                {{ listItem.author_name }}
              </span>
            </template>
          </div>
        </el-popover>
        <div class="clock-icon">
          <i class="el-icon-time" :style="{ color: item.config.iconColor }"></i>
        </div>
        <template v-if="item.config && item.config.timeVisible">
          <div
            class="time-label"
            :class="{ 'italic-label': item.config.timeLabelItalic }"
          >
            <span :style="{ color: item.config.timeColor }">{{
              item.timeLabel
            }}</span>
          </div>
        </template>
      </div>
    </template>
  </div>
</template>
<script>
import { cloneObject } from "@/utils";
export default {
  props: {
    timeLine: {
      type: Array,
      default() {
        return [];
        // return [
        //   {
        //     time: "2022-01-01",
        //     data: [
        //       {
        //         author_name:
        //           "很长的作者昵称很长的作者昵称很长的作者昵称很长的作者昵称很长的作者昵称",
        //         messages: [
        //           {
        //             content:
        //               "很长的内容部分很长的内容部分很长的内容部分很长的内容部分很长的内容部分很长的内容部分很长的内容部分很长的内容部分很长的内容部分很长的内容部分很长的内容部分,很长的内容部分很长的内容部分很长的内容部分很长的内容部分很长的内容部分很长的内容部分很长的内容部分很长的内容部分很长的内容部分很长的内容部分很长的内容部分,很长的内容部分很长的内容部分很长的内容部分很长的内容部分很长的内容部分很长的内容部分很长的内容部分很长的内容部分很长的内容部分很长的内容部分很长的内容部分,很长的内容部分很长的内容部分很长的内容部分很长的内容部分很长的内容部分很长的内容部分很长的内容部分很长的内容部分很长的内容部分很长的内容部分很长的内容部分",
        //             repeat: 100, // 转发数
        //             up: 10, // 点赞数
        //             comment: 10, // 评论数
        //             datetime: "2022-01-01 12:00:00", //具体时间
        //           },
        //         ],
        //       },
        //     ],
        //     // 时间点的样式配置
        //     config: {
        //       listHeight: 60, // 用户显示容器的高度
        //       iconColor: "#409eff", // 时间图标的颜色
        //       timeColor: "#000", // 时间字体的颜色
        //       timeVisible: true, // 时间标签是否可见
        //       timeLabelItalic: true,
        //     },
        //     position: 0,
        //   },

        //   {
        //     time: "2022-01-02",
        //     data: [
        //       {
        //         author_name: "作者昵称1",
        //         messages: [
        //           {
        //             content: "内容1",
        //             repeat: 100, // 转发数
        //             up: 10, // 点赞数
        //             comment: 10, // 评论数
        //             datetime: "2022-01-02 12:00:00", //具体时间
        //           },
        //         ],
        //       },
        //     ],
        //     config: {
        //       listHeight: 60,
        //       iconColor: "#409eff",
        //       timeColor: "#000",
        //       timeVisible: true,
        //       timeLabelItalic: true,
        //     },
        //     position: 100,
        //   },

        //   {
        //     time: "2022-01-03",
        //     data: [
        //       {
        //         author_name: "作者昵称1",
        //         messages: [
        //           {
        //             content: "内容1",
        //             repeat: 100, // 转发数
        //             up: 10, // 点赞数
        //             comment: 10, // 评论数
        //             datetime: "2022-01-02 12:00:00", //具体时间
        //           },
        //         ],
        //       },
        //     ],
        //     config: {
        //       listHeight: 60,
        //       iconColor: "#409eff",
        //       timeColor: "#000",
        //       timeVisible: true,
        //       timeLabelItalic: true,
        //     },
        //     position: 100,
        //   },
        //   {
        //     time: "2022-01-06",
        //     data: [
        //       {
        //         author_name: "作者昵称1",
        //         messages: [
        //           {
        //             content: "内容1",
        //             repeat: 100, // 转发数
        //             up: 10, // 点赞数
        //             comment: 10, // 评论数
        //             datetime: "2022-01-02 12:00:00", //具体时间
        //           },
        //         ],
        //       },
        //     ],
        //     config: {
        //       listHeight: 60,
        //       iconColor: "#409eff",
        //       timeColor: "#000",
        //       timeVisible: true,
        //       timeLabelItalic: true,
        //     },
        //     position: 100,
        //   },
        // ];
      },
    },
  },

  data() {
    return {
      lineLength: 1,
      timeLineData: [],
      containerWidth: 0,
    };
  },
  watch: {
    timeLine: {
      immediate: true,
      handler(val) {
        if (Array.isArray(val)) {
          if (val.length > 0) {
            this.sortedCopy = cloneObject(val).sort((pre, next) => {
              const time1 = new Date(pre.time);
              const time2 = new Date(next.time);
              return time1 - time2;
            });

            this.setListPosition(this.sortedCopy);
          } else {
            this.timeLineData = [];
          }
        }
      },
    },
  },
  methods: {
    // 设置时间轴列表项的位置
    /**
     * 初始化思路 : 0 时间轴节点的位置根据容器的宽度和时间总跨度按比例计算
     * 1 容器的最小宽度为100%; 但是当时间节点过多时会出现容器拥挤的情况 ,所以默认一个时间节点宽度为20,设置容器总宽度为20*时间节点数; 容器宽度确定后按步骤0执行;
     * 2 按0计算后由于有的时间节点时间过于接近而出现重叠,所以默认设置x坐标最小距离为20; 如果距离小于20则设置后一个节点为pre节点的x+20;
     * 3 正常是最后一个节点在容器最后位置,经过步骤2的计算移动后可能最后一个节点会超出容器,所以如果容器宽度小于最后一个节点的x值,则设置容器宽度为最后一个节点的位置.
     */
    setListPosition(list) {
      this.timeLineData = [];

      list = cloneObject(list);
      this.containerWidth = list.length * 20;

      if (list.length === 1) {
        const item = list[0];
        item.position = 0;
        item.timeLabel = item.time.substr(5, 5); //取月日
        item.config = {
          listHeight: 60,
          iconColor: "#409eff",
          timeColor: "#000",
          timeVisible: true,
          timeLabelItalic: true,
        };
        this.timeLineData = list;
      } else if (list.length > 1) {
        this.$nextTick(() => {
          const first = list[0];
          const last = list[list.length - 1];
          const containerWidth = this.$refs["timeLineContainer"]?.offsetWidth;

          // console.log("containerWidth:", containerWidth);
          const firstTime = new Date(first.time).getTime();
          const lastTime = new Date(last.time).getTime();
          const dateLong = lastTime - firstTime;

          list.forEach((item, index) => {
            const itemTime = new Date(item.time).getTime();
            item.position =
              ((itemTime - firstTime) / dateLong) * containerWidth;

            // 避免相邻的点间隔过近
            if (index > 0 && item.position - list[index - 1].position < 20) {
              item.position = list[index - 1].position + 20;
            }
            item.timeLabel = item.time.substr(5, 5);
            //配置显示样式
            item.config = {
              listHeight: 60,
              iconColor: "#409eff",
              timeColor: "#000",
              timeVisible: true,
              timeLabelItalic: true,
            };
          });
          this.timeLineData = list;

          // 最后一个元素位置大于容器宽度时 宽度按最后元素的位置再计算一次
          const lastItem = list[list.length - 1];
          if (lastItem.position > containerWidth) {
            // this.setListPosition(list, Math.ceil(lastItem.position));
            this.containerWidth = Math.ceil(lastItem.position);
          }
        });
      }
    },

    registerResizeEvent() {
      window.addEventListener(
        "resize",
        () => {
          clearTimeout(this.timer);
          this.timer = setTimeout(() => {
            this.setListPosition(this.sortedCopy);
          }, 300);
        },
        false
      );
    },

    isNumber(data) {
      return typeof data === "number";
    },
  },

  mounted() {
    // this.timeLineData = this.setListPosition(this.timeLine);
    this.registerResizeEvent();
  },
};
</script>
<style lang="scss" scoped>
@import "@/styles/index.scss";
.spread-time-line {
  color: $color-text;
  position: relative;

  height: 100px;
  min-width: calc(100% - 150px);
  margin: 0 20px;
  margin-right: 120px;
  border-bottom: 1px solid $color-border;

  .data-item {
    bottom: 0;
    position: absolute;
    border-left: 1px dashed $color-border;

    .clock-icon {
      position: absolute;
      bottom: 0;
      transform: translate(-50%, 50%);
      background-color: #fff;
    }

    .time-label {
      position: absolute;
      bottom: 0;
      transform: translate(-50%, 120%);

      &.italic-label {
        transform-origin: left center;
        transform: translate(5px, 93%) rotate(55deg);
      }

      span {
        white-space: pre;
        font-size: 12px;
      }
    }

    .authors-list {
      display: flex;
      flex-direction: column;
      align-items: flex-start;
      justify-content: flex-start;
      height: 60px;
      overflow: hidden;
      margin-bottom: 10px;
      cursor: pointer;
      background: #fff;

      .author-name {
        font-size: 12px;
        margin-bottom: 3px;
        line-height: 17px;
        color: $color-text;
        padding-left: 12px;
        display: inline-block;
        max-width: 100px;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        flex: 0 0 auto;
      }

      &:not(.not-full):after {
        content: "...";
        position: absolute;
        bottom: 0;
        left: 15px;
      }
    }
  }
}

.popover-info {
  max-height: 500px;
  overflow: auto;
  padding-right: 10px;

  .author-info-container {
    width: 100%;

    color: $color-text;
    margin-bottom: 10px;

    .author-name-wrapper {
      padding: 10px 5px;
      font-size: 16px;
      border-bottom: 1px solid $color-border;
    }

    .info-list {
      padding: 10px;
      margin: 0;
      color: $color-text;

      .info-wrapper {
        list-style: none;
        padding: 0;
        margin: 0;
        margin-bottom: 10px;
        border-bottom: 1px dashed $color-border;

        .content {
          font-size: 12px;
          padding: 0px 0 10px 0;

          .content-title {
            font-weight: bold;
          }
        }

        .content-data {
          display: flex;
          justify-content: space-between;
          align-items: center;
          font-size: 12px;

          .data-wrapper {
            display: flex;
            justify-content: flex-start;
            align-items: center;
            padding-bottom: 5px;

            .data-num {
              font-weight: bold;
            }
          }

          .date-time-text {
            color: $color-desc;
          }
        }
      }
    }
  }
}
</style>
