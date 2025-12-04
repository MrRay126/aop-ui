<template>
  <div class="trend-line-chart">
    <graph :options="options" :height="height"></graph>
  </div>
</template>
<script>
import graph from "@/views/components/graph.vue";
import { lineOption } from "@/views/components/charts/chartData.js";
import numeral from "numeral";

export default {
  props: {
    chartData: {
      type: Object,
      default() {
        return {
          dimensions: ["time", "评论", "点赞", "转发"],
          source: [
            {
              time: "2022-01",
              评论: 100,
              点赞: 200,
              转发: 100,

              details: {
                xxx徽章: {
                  评论: 10,
                  点赞: 20,
                  转发: 30,
                },

                xxx徽章2: {
                  评论: 10,
                  点赞: 20,
                  转发: 30,
                },
              },
            },
          ],
        };
      },
    },

    height: {
      type: Number,
      default: 400,
    },

    //是否开启热帖模式
    hotModeOpened: {
      type: Boolean,
      default: false,
    },

    hasLegend: {
      type: Boolean,
      default: false,
    },
  },
  components: { graph },
  data() {
    return {
      options: null,
      tooltipHeight: 200,
    };
  },
  watch: {
    chartData: {
      immediate: true,
      handler(val) {
        if (val && val.dimensions) {
          this.updateChart();
        }
      },
    },

    hotModeOpened: {
      immediate: false,
      handler() {
        this.updateChart();
      },
    },
  },
  methods: {
    numeral,
    updateChart() {
      const tooltip = {
        appendToBody: false,
        trigger: "axis",
        textStyle: {
          color: "#9d9e9f",
          fontSize: 14,
        },

        enterable: true, // 鼠标是否可进入提示框浮层中
        hideDelay: 200, // 浮层隐藏的延迟
        confine: true,
        backgroundColor: "rgba(255,255,255, 1)",

        formatter: (params) => {
          if (!params || params.length === 0) return '';
          
          const souceIndex = params[0].dataIndex;
          const sourceItem = this.chartData.source[souceIndex];
          
          // 如果有details属性，使用原来的详细展示逻辑
          if (sourceItem && sourceItem.details) {
            const detail = sourceItem.details;
            let strArr = [];
            for (let prop in detail) {
              strArr.push(
                `<div style="padding:5px;"><span style="font-weight:bold">${prop}:</span> ${getCounts(
                  detail[prop]
                )}</div>`
              );
            }
            return strArr.join("");
          }
          
          // 否则使用简单的tooltip显示（适用于关键词看板）
          let html = `<div style="padding:10px;color:#333;">`;
          html += `<div style="margin-bottom:8px;font-weight:bold;">${params[0].name}</div>`;
          
          params.forEach(param => {
            const color = param.color;
            const seriesName = param.seriesName;
            // 从源数据中获取实际值
            const actualValue = sourceItem[seriesName];
            
            html += `<div style="margin-bottom:4px;">`;
            html += `<span style="display:inline-block;width:10px;height:10px;background:${color};border-radius:50%;margin-right:5px;"></span>`;
            html += `<span style="font-weight:500;">${seriesName}:</span> `;
            html += `<span style="font-weight:bold;color:#409eff;">${numeral(actualValue).format('0,0')}</span>`;
            html += `</div>`;
          });
          
          html += `</div>`;
          return html;

          function getCounts(data) {
            let strArr = [];
            for (let prop in data) {
              strArr.push(`${prop}${data[prop]}`);
            }
            return strArr.join(", ");
          }
        },
      };

      // // 获取系列的数据
      // function getSeriesData(sourceData, seriesName) {
      //   return {
      //     value: sourceData[seriesName],
      //   };
      // }

      const options = JSON.parse(JSON.stringify(lineOption));

      options.tooltip = tooltip;
      options.dataset = {
        dimensions: this.chartData.dimensions,
        source: this.chartData.source,
      };

      // options.series
      options.series = this.chartData.dimensions
        .filter((_, index) => {
          return index !== 0;
        })
        .map(() => {
          const seriesItem = {
            type: "line",
          };
          return seriesItem;
        });

      //legend
      if (this.hasLegend) {
        options.legend.show = true;
        options.grid.bottom = "100"; // 设置底边高度
      }

      //x-axis
      options.xAxis[0].data = this.chartData.source.map((item) => {
        return item[this.chartData.dimensions[0]];
      });

      this.options = options;
    },
  },
  created() {},
};
</script>
<style lang="scss" scoped>
</style>
