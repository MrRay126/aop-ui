<template>
  <div class="data-integration">
    <div class="left">
      <div class="left-title"><span>数据集成</span></div>
      <ul class="list-container">
        <li
          class="list-item"
          :class="{ focus: activeMenuItem === 'instruction' }"
          @click="handleMenuItemClick('instruction')"
        >
          <span class="svg-wrapper">
            <svg-icon icon-class="document" size="14"></svg-icon>
          </span>
          <span
            class="list-title"
            :class="{ focus: activeMenuItem === 'instruction' }"
            >数据接入说明</span
          >
        </li>
        <li
          class="list-item"
          :class="{ focus: activeMenuItem === 'integration' }"
          @click="handleMenuItemClick('integration')"
        >
          <span class="svg-wrapper">
            <svg-icon icon-class="data-integration" size="14"></svg-icon>
          </span>
          <span class="list-title">媒体渠道数据集成</span>
        </li>
      </ul>
    </div>
    <div class="right-content">
      <template v-if="activeMenuItem === 'instruction'">
        <instruction
          :loading="isLoadingMarkText"
          :markText="markText"
        ></instruction>
      </template>
      <template v-else>
        <template v-if="!isViewRuleConfig">
          <channel-list
            ref="channelList"
            :source="contentList"
            :pager="pager"
            :search="search"
            :loading="isLoadingChannel"
            @config="handleConfigRule"
            @getData="handleGetData"
          ></channel-list>
        </template>

        <template v-else>
          <rule-config
            :channel="curChannel"
            :contentType="curContentType"
            @back="handleViewDataIntegration"
          ></rule-config>
        </template>
      </template>
    </div>
  </div>
</template>
<script>
// import img from "@/assets/1.png";
import instruction from "./instruction.vue";
import ruleConfig from "./config.vue";

import channels from "./channels.vue";
export default {
  components: {
    instruction,
    channelList: channels,
    ruleConfig,
  },
  data() {
    return {
      isLoadingMarkText: false,
      markText: "",
      activeMenuItem: "integration", // instruction || integration
      channelName: "新浪微博",
      contentType: "博客",
      isViewRuleConfig: false,
      isLoadingChannel: false,

      contentList: [],
      pager: {
        pageSize: 10,
        curPage: 1,
        total: 0,
      },
      search: "",

      curChannel: {},
      curContentType: {},
    };
  },
  watch: {
    "$store.getters.appId": {
      immediate: true,
      handler(val) {
        if (val) {
          this.init();
        }
      },
    },
  },
  methods: {
    // 侧边菜单点击
    handleMenuItemClick(menuName) {
      this.activeMenuItem = menuName;
    },

    // 配置规则
    handleConfigRule(payload) {
      const { row, rowContentType } = payload;
      this.curChannel = row;
      this.curContentType = rowContentType;
      this.isViewRuleConfig = true;
    },

    handleGetData(payload) {
      const { pager, search } = payload;
      this.pager = pager;
      this.search = search;
      this.getPageData();
    },

    getPageData() {
      this.contentList = [];
      this.isLoadingChannel = true;
      const payload = {
        project_id: this.$store.getters.appId,
        curPage: this.pager.curPage,
        pageSize: this.pager.pageSize,
        search: this.search,
      };

      // api get
      this.$store
        .dispatch("dataIntegration/getIntegrationTableData", payload)
        .then((resData) => {
          this.contentList = resData.list;
          this.pager = { ...this.pager, total: resData.pager.total };
        })
        .catch(() => {
          // noop
        })
        .finally(() => {
          this.isLoadingChannel = false;
        });
    },

    getMarkedContent() {
      // api
      const payload = { project_id: this.$store.getters.appId };
      this.isLoadingMarkText = true;
      this.$store
        .dispatch("dataIntegration/getInstructionMarkdownText", payload)
        .then((resData) => {
          this.markText = resData;
        })
        .catch(() => {
          // noop
        })
        .finally(() => {
          this.isLoadingMarkText = false;
        });
    },

    handleViewDataIntegration() {
      this.isViewRuleConfig = false;
    },

    init() {
      this.pager = this.$options.data().pager;
      this.search = this.$options.data().search;

      this.getPageData();
      this.getMarkedContent();
    },
  },
};
</script>

<style scoped lang="scss">
@import "@/styles/index.scss";

.data-integration {
  display: flex;
  justify-content: flex-start;
  align-items: flex-start;
  padding: 20px;
  background-color: #f0f2f5;
  height: 100%;
  width: 100%;
  overflow: auto;

  ul,
  li {
    list-style: none;
    padding: 0;
    margin: 0;
  }

  .left {
    flex-shrink: 0;
    flex-grow: 0;
    width: 300px;
    height: 100%;
    background-color: #fff;
    color: $color-text;

    .left-title {
      padding: 20px;
      border-bottom: 1px solid $color-border;
    }

    .list-container {
      .list-item {
        padding: 15px 10px;
        margin-top: 5px;
        cursor: pointer;
        font-size: 14px;

        &.focus {
          background-color: #f3faff;
          color: $title-text-color;
        }

        &:hover {
          background-color: #f3faff;
        }

        .list-title {
          margin-left: 5px;
        }

        .svg-wrapper {
          vertical-align: middle;
        }
      }
    }
  }

  .right-content {
    flex-shrink: 1;
    flex-grow: 1;
    flex-basis: auto;

    min-width: 800px;
    height: 100%;

    margin-left: 20px;
    background-color: #fff;
  }
}
</style>
