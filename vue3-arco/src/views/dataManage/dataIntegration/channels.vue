<template>
  <div class="channels" v-loading="loading">
    <div class="right-top">
      <span class="title">媒体渠道数据集成</span>
      <el-input
        size="mini"
        class="search-input"
        placeholder="请输入媒体渠道名称"
        v-model="searchText"
        @input="handleInput"
      >
        <template slot="append">
          <el-button icon="el-icon-search"></el-button>
        </template>
      </el-input>
    </div>

    <ul class="list-content">
      <template v-if="source.length > 0">
        <template v-for="(item, index) in source">
          <li class="content-list-item" :key="index">
            <div class="list-wrapper">
              <div class="content-wrapper">
                <div class="logo-container">
                  <div
                    class="logo-image"
                    :style="{
                      backgroundImage: 'url(' + item.logoPicture + ')',
                    }"
                    :alt="item.channelName"
                    :title="item.channelName"
                  ></div>
                </div>

                <div class="channel">
                  <div class="tag">
                    <el-tag size="mini">{{ item.channelTag }}</el-tag>
                  </div>
                  <div class="channel-title">{{ item.channelName }}</div>
                </div>

                <div class="connected-status">
                  <div
                    class="tag"
                    :class="{
                      'is-connected': item.isConnected,
                      'not-conneted': !item.isConnected,
                    }"
                  >
                    {{ item.isConnected ? "已接入" : "未接入" }}
                  </div>
                  <div class="connected-content-tags">
                    <template
                      v-for="(
                        contentItem, contentIndex
                      ) in item.connectedContents"
                    >
                      <el-tag
                        class="connect-content-tag"
                        :key="contentIndex"
                        size="mini"
                        type="primary"
                      >
                        {{ contentItem }}
                      </el-tag>
                    </template>
                  </div>
                </div>
              </div>

              <div class="btn-container">
                <el-button
                  size="mini"
                  icon="el-icon-setting"
                  class="set-btn"
                  @click="handleViewContent(item)"
                >
                  集成内容
                </el-button>
              </div>
            </div>
            <ul
              class="content-type-container"
              :style="{
                height:
                  item.contentTypes.length === 1
                    ? item.isViewContent
                      ? '100px'
                      : '0'
                    : item.isViewContent
                    ? 68 * item.contentTypes.length + 'px'
                    : '0',
              }"
            >
              <template v-for="(contentTypeItem, tIndex) in item.contentTypes">
                <li class="content-type-item" :key="tIndex">
                  <div class="content-type-wrapper">
                    <div class="content-type">
                      <div class="tag-wrapper">
                        <el-tag size="mini">内容类型</el-tag>
                      </div>
                      <div class="type-title">
                        {{ contentTypeItem.contentType }}
                      </div>
                    </div>
                    <div class="comment">
                      <div class="tag-warpper">
                        <el-tag size="mini">备注说明</el-tag>
                      </div>
                      <div class="comment-text">
                        {{ contentTypeItem.comment }}
                      </div>
                    </div>
                  </div>
                  <div class="btn-container">
                    <el-button
                      plain
                      size="mini"
                      icon="el-icon-setting"
                      class="meta-manage"
                      @click="jumpToMetaManagement(item, contentTypeItem)"
                      >元数据管理</el-button
                    >
                    <el-button
                      size="mini"
                      type="primary"
                      icon="el-icon-setting"
                      @click="handleConfigRule(item, contentTypeItem)"
                      >采集规则</el-button
                    >
                  </div>
                </li>
              </template>
            </ul>
          </li>
        </template>
      </template>
      <template v-else>
        <li class="no-data">暂无数据</li>
      </template>
    </ul>

    <div class="pagination-container">
      <el-pagination
        class="pagination"
        layout="sizes,total,  prev, pager, next, jumper"
        background
        @current-change="handleChangePage"
        @size-change="handleSizeChange"
        :current-page.sync="pagerData.curPage"
        :page-size.sync="pagerData.pageSize"
        :total="pagerData.total"
      ></el-pagination>
    </div>
  </div>
</template>
<script>
export default {
  props: {
    source: {
      type: Array,
      default() {
        return [];
      },
    },

    pager: {
      type: Object,
      default() {
        return {
          curPage: 1,
          pageSize: 10,
          total: 0,
        };
      },
    },

    search: {
      type: String,
      default: "",
    },

    loading: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      pagerData: {
        curPage: 1,
        pageSize: 10,
        total: 0,
      },
      searchText: "",
    };
  },
  watch: {
    pager: {
      immediate: true,
      handler(val) {
        this.pagerData = val;
      },
    },
    search: {
      immediate: true,
      handler(val) {
        this.searchText = val;
      },
    },
  },
  methods: {
    handleViewContent(list) {
      // this.contentList.forEach((listItem) => {
      //   listItem.isViewContent = false;
      // });
      this.$set(list, "isViewContent", !list.isViewContent);
    },

    handleInput() {
      clearTimeout(this.timer);
      this.timer = setTimeout(() => {
        this.getPageData();
      }, 300);
    },

    handleChangePage() {
      this.getPageData();
    },

    handleSizeChange() {
      this.getPageData();
    },

    getPageData() {
      this.$emit("getData", {
        pager: this.pager,
        search: this.searchText,
      });
    },

    // 配置规则
    handleConfigRule(row, rowContentType) {
      this.$emit("config", {
        row,
        rowContentType,
      });
    },

    // 元数据管理
    jumpToMetaManagement(row, rowContentType) {
      this.$router.push({
        name: "metaData",
        query: {
          channel: row.id,
          contentType: rowContentType.id,
        },
      });
    },
  },
  created() {},
};
</script>
<style lang="scss" scoped>
@import "@/styles/index.scss";

.channels {
  height: 100%;

  ul,
  li {
    list-style: none;
    margin: 0;
    padding: 0;
  }

  .right-top {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 17px;
    border-bottom: 1px solid $color-border;
    color: $color-text;

    .search-input {
      width: 300px;
    }

    .title {
      font-weight: bold;
      font-size: 14px;
    }
  }

  .list-content {
    height: calc(100% - 150px);
    margin-top: 5px;
    overflow: auto;
    color: $color-text;
    position: relative;
    padding: 0 10px;

    .no-data {
      text-align: center;
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
    }

    .content-list-item {
      .list-wrapper {
        display: flex;
        justify-content: space-between;
        align-items: center;
        border-bottom: 1px solid $color-border;
        background-color: #f9f9f9;

        .content-wrapper {
          display: flex;
          justify-content: flex-start;
          align-items: center;

          .logo-container {
            padding: 20px;

            .logo-image {
              height: 40px;
              width: 120px;
              background-size: contain;
              background-position: left center;
              background-repeat: no-repeat;
            }
          }

          .channel {
            padding: 10px;
            margin-left: 20px;
            min-width: 100px;

            .tag {
              padding-bottom: 5px;
            }

            .channel-title {
              font-size: 14px;
              counter-reset: $color-text;
            }
          }

          .connected-status {
            padding: 20px;
            margin-left: 20px;

            .tag {
              padding-bottom: 2px;
            }

            .is-connected {
              color: $color-primary;
              font-size: 12px;
            }

            .not-conneted {
              color: $color-disabled;
              font-size: 12px;
            }

            .connect-content-tag {
              margin-right: 5px;
            }
          }
        }

        .btn-container {
          margin-right: 20px;
        }
      }

      .content-type-container {
        height: 0;
        max-height: 300px;

        overflow: auto;

        transition: height 0.3s ease-in;

        .content-type-item {
          display: flex;
          justify-content: space-between;
          align-items: center;
          border-bottom: 1px solid $color-border;
          padding: 10px 5px;

          .content-type-wrapper {
            display: flex;
            justify-content: flex-start;
            align-items: center;

            .content-type {
              padding: 0 20px;
              width: 200px;
              flex: 1 0 auto;

              .tag-wrapper {
                margin-bottom: 5px;
              }

              .type-title {
                font-size: 12px;
              }
            }

            .comment {
              flex: 1 1 auto;

              .tag-warpper {
                margin-bottom: 5px;
              }

              .comment-text {
                font-size: 14px;
                color: $color-text;
              }
            }
          }

          .btn-container {
            width: 300px;
            text-align: right;
            flex-shrink: 0;

            .meta-manage {
              margin-left: 20px;
            }
          }
        }
      }
    }
  }

  .pagination-container {
    padding-top: 20px;
    text-align: center;
  }
}
</style>
