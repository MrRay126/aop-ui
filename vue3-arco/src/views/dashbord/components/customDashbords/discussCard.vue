<template>
  <div class="discuss">
    <template v-if="!isViewXiaZuan">
      <div class="radio-options-container">
        <el-radio-group
          size="mini"
          v-model="classification"
          @change="handleContentTypeChange"
        >
          <template v-for="(item, index) in classifyOptions">
            <el-radio-button :label="item.value" :key="index">
              {{ item.label }}
            </el-radio-button>
          </template>
        </el-radio-group>
      </div>
      <div class="table-container">
        <template v-if="detailTableVisible">
          <detail-table
            ref="detailTable"
            :height="500"
            :configs="{
              ...cardConfigs,
              classification,
              project_id: $store.getters.appId,
            }"
            apiAction="dashbord/getCustomDashboardCardData"
            @event="handleDetailTableEvent"
          ></detail-table>
        </template>
      </div>
    </template>
    <template v-else>
      <div class="xia-zuan-info">
        <div style="padding-left: 10px">
          <el-button @click="handleXiaZuanReturn" type="text">
            &lt;返回
          </el-button>
        </div>
        <xia-zuan-info
          ref="xiaZuanInfo"
          :viewConfigs="{
            wordChartHeight: 400,
            wordTableHeight: 400,
            spreadChartHeight: 400,
            spreadTableHeight: 400,
            isTimeLineVisible: false,
          }"
          :datas="{
            ...cardConfigs,
            row: xiaZuanRow,
            project_id: $store.getters.appId,
          }"
        ></xia-zuan-info>
      </div>
    </template>
  </div>
</template>
<script>
import detailTable from "@/views/components/anylysisDetailTable/index.vue";
import xiaZuanInfo from "@/views/components/xiaZuan/info.vue";
import { bigCardMixin } from "@/views/mixins/card.js";

export default {
  mixins: [bigCardMixin],
  props: {
    cardConfigs: {
      type: Object,
      default() {
        return {};
      },
    },
    cardData: {
      type: Object,
      default() {
        return {};
      },
    },
  },
  components: {
    detailTable,
    xiaZuanInfo,
  },

  data() {
    return {
      detailTableVisible: false,
      classifyOptions: [],
      isViewXiaZuan: false,
      xiaZuanRow: {},
      classification: "play",
      isViewInfos: true, //下载使用
    };
  },
  methods: {
    handleXiaZuanReturn() {
      this.isViewXiaZuan = false;
    },

    handleDetailTableEvent({ action, data }) {
      if (action === "xiaZuan") {
        this.isViewXiaZuan = true;
        this.xiaZuanRow = data;
      }
    },

    handleContentTypeChange() {
      this.$refs["detailTable"]?.getTableData();
    },

    refresh(cb) {
      // detailtable可见后自动调用接口
      this.detailTableVisible = false;
      this.$store
        .dispatch("dashbord/getDiscussCardClassifications")
        .then((res) => {
          this.classifyOptions = res;
          this.classification = this.classifyOptions[0].value;
          this.detailTableVisible = this.classification.length > 0;
          cb && cb();
        });
    },
  },
  created() {},
};
</script>
<style lang="scss" scoped>
.discuss {
  height: 100%;

  .xia-zuan-info {
    width: 100%;
    height: 100%;

    ::v-deep {
      .info {
        background-color: #fff;
        height: calc(100% - 10px);
        padding-top: 0;

        .page {
          background-color: #fff;

          .right {
            margin-top: 0;
          }
        }

        .left {
          padding-top: 0;
        }

        .top-tools {
          padding: 0 0 8px 20px;
        }
      }

      .more-contents-table-container {
        padding: 0;
      }

      .top-path {
        padding-top: 8px;
      }

      .btns-container {
        display: none;
      }

      .cloud-chart {
        min-height: initial;
      }

      .bottom-content-top {
        height: calc(100% - 10px);
      }
    }
  }

  .radio-options-container {
    padding: 15px;
  }

  .table-container {
    height: calc(100% - 60px);
  }
}
</style>
