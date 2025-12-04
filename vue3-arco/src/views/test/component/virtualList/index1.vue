<template>
  <div
    ref="viewPort"
    class="view-port"
    :style="{ width: viewportWidth + 'px', height: viewportHeight + 'px' }"
  >
    <div
      class="scroll-container"
      :style="{ height: scrollContainerHeight + 'px' }"
    >
      <div class="data-list" ref="dataList">
        <template v-for="(item, index) in viewList">
          <div class="list-item" :key="index">
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
      <div class="loading-text">加载中<i class="el-icon-loading"></i></div>
    </template>
    <template v-else-if="noMoreData">
      <div class="no-more-text">暂无更多数据~</div>
    </template>
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

    listItemHeight: {
      type: Number,
      default: 40,
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
      return this.list.length * this.listItemHeight;
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
    // setScrollContainerHeight() {
    //   this.scrollContainerHeight = this.listData.length * this.listItemHeight;
    // },

    initViewListData() {
      this.showCount =
        Math.floor(this.viewportHeight / this.listItemHeight) +
        this.overScrollCount; // 避免快熟滑动时产生下方空白

      this.viewList = this.list.slice(0, this.showCount);
    },

    handleViewPortScroll() {
      // if()
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
      // console.log(
      //   viewPortScrollTop + this.viewportHeight,
      //   this.scrollContainerHeight
      // );

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
.view-port {
  border: 0px solid #ccc;
  overflow: auto;

  .scroll-container {
    width: 100%;
    overflow: hidden;

    .list-item {
      // height: 40px;
    }
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
}
</style>
