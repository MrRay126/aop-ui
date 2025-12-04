<template>
  <div class="spread-chart">
    <graph
      :options="options"
      :height="height"
      :chartClickHandler="handleWordClick"
    ></graph>
  </div>
</template>
<script>
import graph from "@/views/components/graph.vue";
import numeral from "numeral";
import { colors } from "./chartData.js";

export default {
  props: {
    chartData: {
      type: Object,
      default() {
        return null;
        // {
        //   nodes: [
        //     {
        //       id: "0",
        //       name: "Myriel",
        //       symbolSize: 19.12381,
        //       x: -266.82776,
        //       y: 299.6904,
        //       value: 28.685715,
        //       category: 0,
        //     },
        //   ],
        //   links: [
        //     {
        //       source: "1",
        //       target: "0",
        //     },
        //   ],
        //   categories: [
        //     {
        //       name: "A",
        //     },
        //   ],
        // };
      },
    },
    height: {
      type: Number,
      default: 300,
    },
  },
  components: { graph },
  data() {
    return {
      options: null,
      categoryColorDict: {}, //{ categoryName: colorValue}
      colorIndex: -1,
    };
  },
  watch: {
    chartData: {
      immediate: true,
      handler(val) {
        if (val) {
          this.updateChart(val);
        }
      },
    },
  },
  methods: {
    updateChart(chartData) {
      const options = {
        // colors,
        tooltip: {},

        // legend: [
        //   {
        //     data: chartData.categories.map(function (a) {
        //       return a.name;
        //     }),
        //   },
        // ],
        series: [
          {
            name: "Les Miserables",
            type: "graph",
            // layout: "circular",
            layout: "force",
            animation: false,
            data: this.initNodes(chartData.nodes, "reposts_count"),
            links: chartData.links,
            categories: chartData.categories,
            roam: true,
            label: {
              show: true,
              position: "right",
              formatter: "{b}",
            },
            labelLayout: {
              hideOverlap: true,
            },

            scaleLimit: {
              min: 0.1,
              max: 2,
            },
            zoom: 0.3, // 初始缩放比例

            force: {
              // initLayout: null,
              // repulsion: [0, 50],
              // gravity: 0.1,
              // friction: 0.6,  // 摩擦力
              // edgeLength: 800,
              // layoutAnimation: false,
              edgeLength: 40,
              repulsion: 200, // 排斥力
              gravity: 0.2,
              layoutAnimation: false,
            },

            lineStyle: {
              color: "target",
              curveness: 0.3,
            },

            tooltip: {
              appendToBody: true,
              confine: true,
              formatter: (params) => {
                if (params.dataType === "node") {
                  return this.getTooltipContent(params.data);
                }
              },
            },
          },
        ],
      };
      this.options = options;
    },

    /**
     * @description 根据prop设置节点的大小
     * @param nodes {Array} 节点数组
     * @param prop {String} 计算大小使用的属性
     */
    initNodes(nodes, prop) {
      nodes.forEach((nodeItem) => {
        nodeItem.symbolSize = this.getNodeSize(nodeItem, prop);
        // nodeItem.itemStyle = {
        //   color: this.getNodeColor(nodeItem),
        // };
        // delete nodeItem.category; // 不使用分类属性, 如果不配置categories属性但是在node中保留则会报错
      });
      return nodes;
    },

    /* @description 根据规则获取节点大小
     * @param node {Object} node节点
     * @param prop {String} 计算大小使用的属性
     */
    getNodeSize(node, prop) {
      const value = node[prop];
      let size = 0;
      if (value < 10) {
        size = 5;
      } else if (value >= 10 && value < 100) {
        size = 10;
      } else if (value >= 100 && value < 1000) {
        size = 15;
      } else if (value >= 1000 && value < 10000) {
        size = 20;
      } else if (value >= 10000) {
        size = 25;
      }

      return size;
    },

    // 获取node点的分组颜色
    getNodeColor(node) {
      // const nodeCate
      if (!this.categoryColorDict[node.category]) {
        this.colorIndex++;
        this.categoryColorDict[node.category] = colors[this.colorIndex];
      }

      return this.categoryColorDict[node.category];
    },

    getTooltipContent(node) {
      let name = node.name;
      const datas = [
        {
          title: "关注量",
          data: numeral(node.followers_count).format("0,00"),
          color: "#e30039", // 红
        },
        {
          title: "点赞量",
          data: numeral(node.attitudes_count).format("0,00"),
          color: "#99cc00", // 绿
        },
        {
          title: "转发量",
          data: numeral(node.reposts_count).format("0,00"),
          color: "#fad300", // 黄
        },
        {
          title: "评论量",
          data: numeral(node.comments_count).format("0,00"),
          color: "#00a8e1", // 蓝
        },
        {
          title: "内容",
          data: getContent(node.content),
          color: "#ccc", // ccc
        },
      ];

      //将节点的内容处理成</br>分行显示
      function getContent(content) {
        let index = 0;
        const lines = [];
        const count = 20;
        while (index < content.length) {
          const str = content.substr(index, count);
          index += count;
          lines.push(str);
        }
        return `<span style="font-size:12px;padding-left:15px;display:inline-block;">${lines.join(
          "</br>"
        )}</span>`;
      }

      const start = `<div style="min-width: 240px; padding: 10px; display: inline-block">`;
      const title = `<div style="font-size: 16px; margin-bottom: 5px">${name}</div>`;
      const list = getList(datas);
      const end = ` </div>`;

      return start + title + list + end;

      function getList(listData) {
        let result = "";
        listData.forEach((item) => {
          result += `
               <div style="
                    margin-bottom: 5px;
                    display: flex;
                    justify-content: space-between;
                    align-items: flex-start;
                  "
                  >
                  <span>
                    <span
                      style="
                        display: inline-block;
                        width: 8px;
                        height: 8px;
                        border-radius: 4px;
                        background-color: ${item.color};
                        margin-right: 5px;
                      "
                    ></span>
                    <span style="font-size: 14px">${item.title}: </span>
                  </span>
                  <span style="font-size: 14px; font-weight: bold">${item.data}</span>
                </div>`;
        });
        return result;
      }
    },

    //
    handleWordClick(item) {
      this.$emit("click", item);
    },
  },
  created() {},
};
</script>
<style lang="scss" scoped>
.spread-chart {
}
</style>
