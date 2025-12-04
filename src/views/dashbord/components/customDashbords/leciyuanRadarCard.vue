<template>
  <div class="radar-card">
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
              :filterable="true"
              clearable
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
    <div>
      <line-chart
        :height="cardHeight"
        :chartData="lineCardData"
        :needShadowLine="true"
        :needSmoothLine="false"
        :hasLegend="true"
        style="width: 60%; display: inline-block;"
      ></line-chart>
      <radar-chart
        :height="cardHeight"
        :chartData="radarCardData"
        :needShadowLine="true"
        :needSmoothLine="false"
        :hasLegend="true"
        style="width: 40%; display: inline-block;"
      ></radar-chart>
    </div>
  </div>
</template>
<script>
import radarChart from "@/views/dashbord/components/customDashbords/components/leciyuanRadar.vue";
import lineChart from "@/views/dashbord/components/customDashbords/components/leciyuanTrendLine.vue";
import { bigCardMixin } from "@/views/mixins/card.js";
import statistics from "@/views/dashbord/components/statistics.vue";
import TimeCalendar from "@/views/components/time-range-calendar";
import { height } from "../../data";

export default {
  mixins: [bigCardMixin],
  props: {
    cardConfigs: {
      type: Object,
      default() {
        return {};
      },
    },
    chartData: {
      type: Object,
      default() {
        return {};
      },
    },
    cardData: {
      type: Object,
      default() {
        return {
          radar: {
            dimensions: [],
            source: [],
          },
          line: {
            dimensions: [],
            source: [],
          },
          statistics: [
            { name: "发帖量", value: 0 },
            { name: "转发量", value: 0 },
            { name: "评论量", value: 0 },
            { name: "点赞量", value: 0 },
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
    radarChart,
    lineChart,
    statistics,
    TimeCalendar,
  },

  computed: {
    radarCardData() {
      return this.cardData.radar;
    },
    lineCardData() {
      return this.cardData.line
    },
    statistics() {
      return this.cardData.statistics;
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
          table: true,
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
.radar-card {
  height: 100%;
  width: 100%;
}
::v-deep .graphic {
  &>div::-webkit-scrollbar {
    width: 0;
    height: 0;
  }
  &>div:hover::-webkit-scrollbar {
    width: 0;
    height: 0;
  }
  &>div::-webkit-scrollbar-thumb {
    background-color: transparent;
  }
  &>div:hover::-webkit-scrollbar-track {
    background-color: transparent;
  }
}
</style>
<style lang="scss">
.statistics-container {
  width: 100%;
  height: 80px;
  padding-right: 16px;
}
</style>