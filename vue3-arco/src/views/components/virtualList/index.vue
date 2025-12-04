<template>
  <div
    class="virtual-scroll-wrapper"
    :class="{ 'row-direction-wrapper': direction === 'row' }"
  >
    <div
      ref="viewPort"
      class="view-port"
      :style="{ width: viewportWidth + 'px', height: viewportHeight + 'px' }"
    >
      <div
        class="scroll-container"
        :style="{
          height:
            typeof scrollContainerHeight === 'number'
              ? scrollContainerHeight + 'px'
              : scrollContainerHeight,
          width:
            typeof scrollContainerWidth === 'number'
              ? scrollContainerWidth + 'px'
              : scrollContainerWidth,
        }"
      >
        <div class="data-list" ref="dataList">
          <template v-for="(item, index) in viewList">
            <div
              class="list-item"
              :class="{ 'is-row-direction': direction === 'row' }"
              :key="index"
              :style="{
                height: direction === 'column' ? listItemHeight + 'px' : 'auto',
                width: direction === 'row' ? listItemWidth + 'px' : 'auto',
              }"
            >
              <slot name="default" :data="{ item, index }">
                {{ item.label }}
              </slot>
            </div>
          </template>

          <!-- <div class="list-item" :key="index">
            <slot name="default" :data="{ item, index }">
              {{ item.label }}
            </slot>
          </div>
         -->
        </div>
      </div>

      <template v-if="loading">
        <div
          class="loading-text"
          :class="{ 'row-direction': direction === 'row' }"
        >
          <span>{{ loadingText }}</span>
          <i class="el-icon-loading"></i>
        </div>
      </template>
      <template v-else-if="noMoreData">
        <div
          class="no-more-text"
          :class="{ 'row-direction': direction === 'row' }"
        >
          {{ noDataText }}
        </div>
      </template>
    </div>
  </div>
</template>
<script>
export default {
  props: {
    listData: {
      type: Array,
      default() {
        return [];
      },
    },

    //视口高度
    viewportHeight: {
      type: Number,
      default: 400,
    },

    //视口宽度
    viewportWidth: {
      type: Number,
      default: 400,
    },

    direction: {
      type: String,
      default: "column", // column:垂直方向 ,  row: 水平方向
    },

    listItemHeight: {
      type: [Number, String],
      default: 40,
    },

    listItemWidth: {
      type: [Number, String],
      default: 80,
    },

    onReachBottom: {
      type: Function,
      default: null,
    },

    // 设置一个数量避免快速上下滑动时产生上下方空白 , 五个一步切换显示
    overscroll: {
      type: Number,
      default: 5,
    },

    loadingText: {
      type: String,
      default: "加载中",
    },

    noDataText: {
      type: String,
      default: "暂无更多数据~",
    },
  },
  data() {
    return {
      loading: false,
      noMoreData: false,
      list: [],
      viewList: [],
    };
  },

  computed: {
    scrollContainerHeight() {
      if (this.direction === "column") {
        return this.list.length * this.listItemHeight;
      } else {
        return "100%";
      }
    },

    scrollContainerWidth() {
      if (this.direction === "row") {
        return this.list.length * this.listItemWidth;
      } else {
        return "100%";
      }
    },
    // 设置一个数量避免快速上下滑动时产生上下方空白 , 五个一步切换显示
    overScrollCount() {
      return this.overscroll;
    },
  },
  watch: {
    listData: {
      immediate: true,
      handler(val) {
        if (Array.isArray(val)) {
          this.list = val;
          this.init();
        }
      },
    },

    viewportHeight: {
      immediate: true,
      handler() {
        this.init();
      },
    },

    listItemHeight: {
      immediate: true,
      handler() {
        this.init();
      },
    },
  },

  methods: {
    initViewListData() {
      if (this.direction === "column") {
        this.showCount =
          Math.floor(this.viewportHeight / this.listItemHeight) +
          this.overScrollCount; // 避免快速滑动时产生下方空白
      } else {
        this.showCount =
          Math.floor(this.viewportWidth / this.listItemWidth) +
          this.overScrollCount; // 避免快速滑动时产生下方空白
      }

      this.viewList = this.list.slice(0, this.showCount);
    },

    handleViewPortScroll() {
      if (this.direction === "column") {
        this.handleScrollTop();
      } else {
        this.handleScrollLeft();
      }
    },

    // 上下滚动
    handleScrollTop() {
      const viewPortScrollTop = this.$refs["viewPort"].scrollTop;
      const offset =
        viewPortScrollTop -
        (viewPortScrollTop % (this.listItemHeight * this.overScrollCount));

      //设置位置和数据
      // clearTimeout(this.timer);

      // this.timer = setTimeout(() => {
      this.$refs["dataList"].style.marginTop = offset + "px";

      const scrollCount =
        Math.floor(
          viewPortScrollTop / (this.listItemHeight * this.overScrollCount)
        ) * this.overScrollCount;

      this.viewList = this.list.slice(
        scrollCount,
        scrollCount + this.showCount
      );

      //触底事件处理 请求数据
      const isReachBottom =
        viewPortScrollTop + this.viewportHeight === this.scrollContainerHeight; // 有border时会导致大于

      if (isReachBottom) {
        if (!this.reachBottom) {
          this.reachBottom = true;

          // 数据请求回调
          const cb = (moreListData) => {
            if (moreListData) {
              this.list = this.list.concat(moreListData);
              // 触底无数据后不再发起请求
              this.reachBottom = false;
              this.handleViewPortScroll();

              this.noMoreData = false;
              this.loading = false;
            } else {
              // 没有更多数据
              this.noMoreData = true;
              this.loading = false;
            }
          };

          if (typeof this.onReachBottom === "function") {
            this.loading = true;
            this.onReachBottom(cb);
          }
        }
      }
    },

    //左右滚动
    handleScrollLeft() {
      const viewPortScrollLeft = this.$refs["viewPort"].scrollLeft;
      const offset =
        viewPortScrollLeft -
        (viewPortScrollLeft % (this.listItemWidth * this.overScrollCount));

      //设置位置和数据
      this.$refs["dataList"].style.marginLeft = offset + "px";

      const scrollCount =
        Math.floor(
          viewPortScrollLeft / (this.listItemWidth * this.overScrollCount)
        ) * this.overScrollCount;

      this.viewList = this.list.slice(
        scrollCount,
        scrollCount + this.showCount
      );

      //触底事件处理 请求数据
      const isReachRightEnd =
        viewPortScrollLeft + this.viewportWidth === this.scrollContainerWidth; // 有border时会导致大于

      if (isReachRightEnd) {
        if (!this.reachRightEnd) {
          this.reachRightEnd = true;

          // 数据请求回调
          const cb = (moreListData) => {
            if (moreListData) {
              this.list = this.list.concat(moreListData);
              // 触底无数据后不再发起请求
              this.reachRightEnd = false;
              this.handleViewPortScroll();

              this.noMoreData = false;
              this.loading = false;
            } else {
              // 没有更多数据
              this.noMoreData = true;
              this.loading = false;
            }
          };

          if (typeof this.onReachBottom === "function") {
            this.loading = true;
            this.onReachBottom(cb);
          }
        }
      }
    },

    initEvent() {
      const viewPort = this.$refs["viewPort"];
      if (viewPort) {
        viewPort.addEventListener("scroll", this.handleViewPortScroll, false);
      }
    },

    init() {
      this.initViewListData();
    },
  },

  mounted() {
    this.initEvent();
  },
};
</script>
<style lang="scss" scoped>
.virtual-scroll-wrapper {
  position: relative;
  display: inline-block;
  padding: 0 0 20px 0;

  &.row-direction-wrapper {
    padding: 0 20px 0 0;
  }

  .row-direction {
    position: absolute;
    right: 0;
    top: 50%;
    transform: translateY(-50%);

    margin-left: 10px;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
    width: 20px;
  }

  .loading-text {
    text-align: center;
    font-size: 14px;
    margin-top: 10px;
    color: rgb(102, 101, 101);
  }

  .no-more-text {
    text-align: center;
    font-size: 14px;
    margin-top: 10px;
    color: rgb(102, 101, 101);
  }

  .view-port {
    border: 0px solid #ccc;
    overflow: auto;
    margin-right: 20px;

    .scroll-container {
      width: 100%;
      overflow: auto;

      .list-item {
        // height: 40px;

        &.is-row-direction {
          display: inline-block;
          height: 100%;
        }
      }
    }
  }
}
</style>
