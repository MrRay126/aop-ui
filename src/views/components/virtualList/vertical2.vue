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
          <div class="list-item" style="min-height: 40px" :key="index">
            <slot name="default" :data="{ item, index }">
              {{ item.label }}
            </slot>
          </div>
        </template>
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
import { HeightManager } from "./utils.js";

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
      default: 2,
    },
  },
  data() {
    return {
      loading: false,
      noMoreData: false,
      list: [],
      viewList: [],
      scrollContainerHeight: 0,
      minHeight: 40, // 列表项最小高度
      heights: [], // 每个项目的height
      groupHeights: [], // 每十个项目的 height

      containerScrollEndStep: 50,
      stepCount: 0,
    };
  },

  computed: {
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
          // 每个scroll步骤显示的数据
          this.viewList = val.slice(
            this.stepCount * this.containerScrollEndStep,
            this.containerScrollEndStep
          );

          this.list = val;

          if (this.isMounted) {
            this.$nextTick(() => {
              HeightManager.heights = [];
              HeightManager.groupHeights = [];

              this.setScrollContainerHeight();

              HeightManager.initHeightStore(this.$refs["dataList"].childNodes);

              this.initViewListData();
            });
          }
        }
      },
    },

    viewportHeight: {
      immediate: true,
      handler() {},
    },
  },

  methods: {
    setScrollContainerHeight() {
      // 小于200时直接获取高度 大于200时直接按200获取高度
      // 滚动到第200条时 获取下一个200条的高度,加和计算在现有高度上, 如此循环,如果不够200条则按不够处理

      this.$refs["viewPort"].scrollTop = 0;
      this.scrollContainerHeight = this.$refs["dataList"].offsetHeight;
    },

    initViewListData() {
      this.showCount =
        Math.floor(this.viewportHeight / 40) + this.overScrollCount; // 避免快熟滑动时产生下方空白

      this.viewList = this.list.slice(0, this.showCount);

      this.$nextTick(() => {
        HeightManager.init(this.$refs["dataList"].children);
      });
    },

    getPreNListItemHeight(n) {
      let heightAll = 0;
      const childNodes = this.$refs["dataList"].childNodes;
      for (let i = 0; i < n; i++) {
        heightAll += childNodes[i].offsetHeight;
      }
      return heightAll;
    },

    handleViewPortScroll() {
      const viewPortScrollTop = this.$refs["viewPort"].scrollTop;
      const hiddenHeight = this.getPreNListItemHeight(this.overScrollCount);
      const offset = viewPortScrollTop - (viewPortScrollTop % hiddenHeight);

      //设置位置和数据
      // clearTimeout(this.timer);

      // this.timer = setTimeout(() => {
      this.$refs["dataList"].style.marginTop = offset + "px";

      //获取当前显示的数据位置  ////
      const scrollCount =
        Math.floor(viewPortScrollTop / hiddenHeight) * this.overScrollCount;

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
          } else {
            // 显示一个虚拟的加载中(仅仅是视觉效果)
            setTimeout(() => {
              cb();
            }, 1000);
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
  },

  mounted() {
    this.initEvent();

    if (this.list.length > 0) {
      // 每个scroll步骤显示的数据

      //1 记录首批滚动50个的高度
      //2 初始化显示部分的数据
      this.viewList = this.list.slice(
        this.stepCount * this.containerScrollEndStep,
        this.containerScrollEndStep
      );

      this.$nextTick(() => {
        HeightManager.heights = [];
        HeightManager.groupHeights = [];

        this.setScrollContainerHeight();

        HeightManager.initHeightStore(this.$refs["dataList"].childNodes);

        this.initViewListData();
      });
    }

    this.isMounted = true;
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
