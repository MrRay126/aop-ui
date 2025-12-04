<template>
  <div class="trend-line-chart">
    <graph :options="options" :height="height"></graph>
  </div>
</template>
<script>
import graph from "@/views/components/graph.vue";
import { lineOption } from "./chartData.js";
import numeral from "numeral";
import $ from "jquery";

export default {
  props: {
    chartData: {
      type: Object,
      default() {
        return {
          dimensions: [
            // "product", "2015", "2016", "2017"
          ],
          source: [
            // { product: "Matcha Latte", 2015: 43.3, 2016: 85.8, 2017: 93.7 },
            // { product: "Milk Tea", 2015: 83.1, 2016: 73.4, 2017: 55.1 },
            // { product: "Cheese Cocoa", 2015: 86.4, 2016: 65.2, 2017: 82.5 },
            // { product: "Walnut Brownie", 2015: 72.4, 2016: 53.9, 2017: 39.1 },
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
        position: (point, params, dom, rect, size) => {
          // 鼠标坐标和提示框位置的参考坐标系是：以外层div的左上角那一点为原点，x轴向右，y轴向下
          // 提示框位置
          var x = 0; // x坐标位置
          var y = 0; // y坐标位置

          // 当前鼠标位置
          var pointX = point[0];
          var pointY = point[1];

          const xAdjustDistance = -0; // 缩减至鼠标的距离
          const yAdjustDistance = -0;

          // 外层div大小
          var viewWidth = size.viewSize[0];
          var viewHeight = size.viewSize[1];

          // 提示框大小
          var boxWidth = size.contentSize[0];
          var boxHeight = size.contentSize[1];

          // 在左侧
          if (pointX + boxWidth > viewWidth) {
            x = pointX - boxWidth + xAdjustDistance;
          } else {
            // 右侧
            x = pointX - xAdjustDistance;
          }

          // 在上方
          if (pointY + boxHeight > viewHeight) {
            y = pointY - boxHeight + yAdjustDistance;
          } else {
            // 下方
            y = pointY - yAdjustDistance;
          }

          return [x, y];
        },

        // formatter() {},

        formatter: (params) => {
          const getTooltipData = (params, markPoints) => {
            const getTooltipList = (series) => {
              let str = "";
              for (var i = 0; i < series.length; i++) {
                const seriesItem = series[i];
                const seriesName = seriesItem.seriesName;
                let markPointsOfSeriesXValue = null;

                if (this.hotModeOpened) {
                  markPointsOfSeriesXValue = this.findMarkPointOfXValue(
                    seriesName,
                    seriesItem.axisValue
                  );
                }

                str += `<div  class="trend-line-chart-title" onclick="handleTrendChartTooltipClick('${seriesName}','${
                  seriesItem.axisValue
                }')"
                style="position:relative;color: #666;display:flex; align-items:center;justify-content:space-between;padding:3px 10px;">
                            <span>${seriesItem.marker}</span>
                            <span style="vertical-align:middle;flex: 1;display: flex;align-items: center;justify-content: space-between;">
                               <span>
                                  <span class="series-name"  style="padding-left:3px;display:inline-block; max-width:200px;overflow:hidden;text-overflow:ellipsis;white-space:no-wrap;margin-right:10px;
                                    text-decoration: ${
                                      markPointsOfSeriesXValue
                                        ? "underline"
                                        : "none"
                                    };
                                    cursor:${
                                      markPointsOfSeriesXValue
                                        ? "pointer"
                                        : "default"
                                    };vertical-align:middle;">
                                      ${seriesName}
                                  </span>


                                  <span style="vertical-align:middle">${
                                    markPointsOfSeriesXValue &&
                                    Array.isArray(markPointsOfSeriesXValue.data)
                                      ? `(${markPointsOfSeriesXValue.data.length})`
                                      : ""
                                  }</span>

                                </span>
                                <span>${numeral(
                                  seriesItem.value[seriesName]
                                ).format("0,000")}</span>
                            </span>
                       </div>`;
              }
              return str;
            };

            return `
            <div class="tooltip-container">
              <div class="trend-tooltip-detail-container">
                <p>${params[0].axisValue}</p>
                <div style="padding-right:12px;max-height: ${
                  this.tooltipHeight
                }px;overflow-y: auto;">
                  ${getTooltipList(params, markPoints)}
                </div>
              </div>
              <div class="trend-paste-detail-container" style="min-height:${
                this.tooltipHeight
              }px;max-height:450px;display:none;max-width:450px;">
              </div>
            </div>`;
          };

          return getTooltipData(params, this.chartData.markPoints);
        },
      };

      const options = JSON.parse(JSON.stringify(lineOption));

      options.tooltip = tooltip;
      options.dataset = {
        dimensions: this.chartData.dimensions,
        source: this.chartData.source,
      };

      // options.series
      const markPoints = this.chartData.markPoints;

      options.series = this.chartData.dimensions
        .filter((item, index) => {
          return index !== 0;
        })
        .map((item) => {
          const seriesItem = {
            type: "line",
          };

          if (this.hotModeOpened && markPoints[item]) {
            seriesItem.markPoint = {
              data: markPoints[item],
            };
          }
          return seriesItem;
        });

      //legend
      if (this.hasLegend) {
        options.legend.show = true;
        options.grid.bottom = "100"; // 设置底边高度
      }

      this.options = options;
    },

    registerFunctionOfTooltip() {
      const _self = this;

      window.handleTrendChartTooltipClick = function (seriesName, xValue) {
        if (_self.hotModeOpened) {
          const pastesContainer = $(".trend-paste-detail-container");
          const tooltipContainer = $(".trend-tooltip-detail-container");
          tooltipContainer.hide();
          pastesContainer.show();
          let markPoint = _self.findMarkPointOfXValue(seriesName, xValue);
          pastesContainer.html(getHtml({ seriesName, xValue }, markPoint.data));
        }
      };

      window.handlePasteDetailReturnToTooltip = function () {
        if (_self.hotModeOpened) {
          const pastesContainer = $(".trend-paste-detail-container");
          const tooltipContainer = $(".trend-tooltip-detail-container");
          tooltipContainer.show();
          pastesContainer.hide();
        }
      };

      function getHtml(tooltip, list) {
        let str = `
                  <div style="padding:10px;border-bottom:1px solid #eee;color:#666;">
                    <span  onclick="handlePasteDetailReturnToTooltip()" style="font-size:16px;cursor:pointer;margin-right:5px;text-decoration:underline;color:#000">返回 </span>
                    <span style="font-size:14px;">${tooltip.xValue}</span>
                    <span> / </span>
                    <span style="font-size:14px;display:inline-block;max-width:200px;overflow:hidden;text-overflow:ellipsis;white-space:no-wrap;vertical-align:middle;" title="${tooltip.seriesName}">${tooltip.seriesName}</span>
                  </div>`;

        str += `<div style="height:200px;overflow:auto;color:#666;padding-right:5px;">`;

        list.forEach((listItem) => {
          str += getListItem(listItem);
        });

        str += "</div>";

        return str;

        function getListItem(data) {
          return `
                <div style="padding: 10px; background-color: #fff;border-bottom: 1px solid rgb(232, 232, 232);">
                    <div style="margin-bottom:10px; display: flex;justify-content: space-between;align-items: flex-start;">
                        <span style="margin-right: 10px;"><span style="font-weight: bold;vertical-align:top;">内容: </span><span style="font-size:12px;display:inline-block;width:200px;white-space: break-spaces;word-break:break-word;vertical-align:top;" >${data.content}</span></span>
                        <span ><span style="font-weight: bold;vertical-align:top;">作者:</span> <span style="font-size:12px;max-width: 105px;white-space: break-spaces; word-break:break-all;display: inline-block;overflow:hidden;vertical-align:top;">${data.author}</span></span>
                    </div>
                    <div style="display: flex;justify-content: space-between;align-items: center;font-size:12px;">
                        <span>
                            <span style="vertical-align:middle;">转发: <span style="font-weight: bold;display:inline-block;max-width:50px;overflow:hidden;text-overflow:ellipsis;white-space:no-wrap;vertical-align:middle;" title="${data.repeat}">${data.repeat}</span></span>
                            <span style="vertical-align:middle;">赞: <span style="font-weight: bold;display:inline-block;max-width:50px;overflow:hidden;text-overflow:ellipsis;white-space:no-wrap;vertical-align:middle;" title="${data.up}">${data.up}</span></span>
                            <span style="vertical-align:middle;">评论: <span style="font-weight: bold;display:inline-block;max-width:50px;overflow:hidden;text-overflow:ellipsis;white-space:no-wrap;vertical-align:middle;" title="${data.comment}">${data.comment}</span></span>
                        </span>
                        <span>${data.time}</span>
                    </div>
                </div>`;
        }
      }
    },

    findMarkPointOfXValue(seriesName, xValue) {
      const mksOfSeries = this.chartData.markPoints[seriesName];
      let markPoints = null;
      if (Array.isArray(mksOfSeries)) {
        markPoints = mksOfSeries.find((item) => {
          return item.xAxis === xValue;
        });
      }
      return markPoints;
    },
  },
  created() {
    this.registerFunctionOfTooltip();
  },
};
</script>
<style lang="scss" scoped>
.trend-line-chart {
  //
}
</style>
