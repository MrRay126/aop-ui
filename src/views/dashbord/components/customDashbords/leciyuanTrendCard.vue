<template>
  <div class="trend-card">
    <el-row>
      <el-col :span="24"
         style="padding: 16px 0; display: flex;"
      >
        <div style="margin: 0 0 0 50px;">
          <time-calendar
            :timeData="time"
            :isTextTypeReference="false"
            :isAutoTriggerApplyTimeEvent="false"
            @applyTime="handleTimeChange"
          >
          </time-calendar>
        </div>
        <template v-for="(item, index) in dataSelectsFilters">
          <div style="margin: 0 0 0 16px; width: 250px; height: 28px;" :key="index" >
            <el-select
              v-model="filterValue[item.name]"
              :placeholder="item.placeholder"
              clearable
              :filterable="true"
              :multiple="item.multiple"
              collapse-tags
              size="mini"
              style="width: 100%;"
              @change="handleFilterChange"
            >
              <template v-for="(optionItem, oIndex) in item.options">
                <el-option
                  :key="oIndex" 
                  :label="optionItem.label"
                  :value="optionItem.value"
                ></el-option>
              </template>
            </el-select>
          </div>
      </template>
      </el-col>
    </el-row>
    <el-row style="margin: 0 34px 0 50px;">
      <el-col :span="6" v-for="(item, index) in statistics" :key="index"
            style="padding: 0 0 16px 0; display: flex; justify-content: center; align-items: center;"
          >
          <statistics :name="item.name" :value="item.value" statistics-class="statistics-container"></statistics>
      </el-col>
    </el-row>
    <line-chart
      :height="cardHeight"
      :chartData="line"
      :needShadowLine="true"
      :needSmoothLine="false"
      :hasLegend="true"
    ></line-chart>
  </div>
</template>
<script>
import lineChart from "@/views/dashbord/components/customDashbords/components/leciyuanTrendLine.vue";
import { bigCardMixin } from "@/views/mixins/card.js";
import statistics from "@/views/dashbord/components/statistics.vue";
import TimeCalendar from "@/views/components/time-range-calendar";

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
        return {
          dimensions: [
            // "time", "评论", "点赞", "转发"
          ],
          source: [
            // {
            //   time: "2022-01",
            //   评论: 100,
            //   点赞: 200,
            //   转发: 100,
            //   details: {
            //     xxx徽章: {
            //       评论: 10,
            //       点赞: 20,
            //       转发: 30,
            //     },
            //     xxx徽章2: {
            //       评论: 10,
            //       点赞: 20,
            //       转发: 30,
            //     },
            //   },
            // },
          ],
        };
      },
    },
    selectsFilters: {
      type: Array,
      default() {
        return [];
      },
    },
    height: {
      type: Number,
      default: 600,
    },
  },

  components: {
    lineChart,
    statistics,
    TimeCalendar,
  },

  computed: {
    line() {
      return this.cardData.line || {
        dimensions: [],
        source: [],
      };
    },
    statistics() {
      return this.cardData.statistics || [
        { name: "发帖量", value: 0 },
        { name: "转发量", value: 0 },
        { name: "评论量", value: 0 },
        { name: "点赞量", value: 0 },
      ];
    },
    dataSelectsFilters() {
      return this.selectsFilters;
    },
    cardHeight() {
      return this.height - 62 - 96;
    },
  },

  data() {
    return {
      isViewInfos: true, // 下载用
      time: {},
      filterValue: {},
    };
  },
  methods: {
    handleTimeChange(data) {
      this.time = {
        type: data.type,
        start: data.start,
        end: data.end,
        recent_day: data.recent_day,
      };
      this.handleFilterChange();
    },
    handleFilterChange() {
      this.$emit("action", {
        action: "filter",
        data: {
          time: this.time,
          filter: this.filterValue,
        },
        cb: () => {}
      });
    },
  },
  created() {},
  watch: {
    cardData: {
      immediate: true,
      handler(val) {},
    },
    cardConfigs: {
      immediate: true,
      handler(val) {
        for (let item of Object.keys(val.dashbordFilters)) {
          this.$set(this.filterValue, item, val.dashbordFilters[item]);
        }
        for (let item of Object.keys(val.time)) {
          this.$set(this.time, item, val.time[item]);
        }
      },
    },
  },
};
</script>

<style lang="scss" scoped>
.trend-card {
  height: 100%;
  width: 100%;
}
</style>
