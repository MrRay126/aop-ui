<template>
  <div class="ai-summary">
    <ai @submit="handleCalcSubmit"></ai>
    <assistant
      :visible="assVisible"
      :configs="{
        ...configs,
        summaryType,
        promptWords,
      }"
      @close="handleCloseView"
    ></assistant>
  </div>
</template>
<script>
import ai from "./aiCalc.vue";
import assistant from "./aiAsisstant.vue";
import recentDay from "@/utils/timeData.js";

export default {
  props: {
    configs: {
      type: Object,
      default() {
        return {
          time: {
            type: "absolute", // absolute|relative 绝对时间|相对时间
            start: recentDay["1-7"].start, //开始时间字符串
            end: recentDay["1-7"].end, //结束时间字符串
            recent_day: "1-7", //配置日期组件回显  昨日: ‘1-1’ | 今日: ’0-0’ | 上周: ‘W1’ |: 本周 W0 | 上月: M1 | 本月: M0 | 过去7天:  1-7 | 过去30天  1-30 | 过去某天至过去某天 2-7 | StartToNow （绝对时间自某日至今）
          },

          filters: {
            relTag: "and",
            children: [
              {
                id: "3f5084d4-1a07-426a-def8-a46e70db0f6f",
                key: "id",
                relation: "eq",
                value: ["4947275568644481"],
              },
            ],
          },
        };
      },
    },
  },
  components: {
    ai,
    assistant,
  },
  data() {
    return {
      assVisible: false,
      summaryType: "",
      promptWords: "",
    };
  },
  methods: {
    handleCalcSubmit(data) {
      this.aiCalcVisible = false;
      this.assVisible = true;
      this.summaryType = data.summaryType;
      this.promptWords = data.promptWords;
    },

    handleCloseView() {
      this.assVisible = false;
    },

    handleAiCalcShow(visible) {
      this.aiCalcVisible = visible;
    },
  },
};
</script>
<style lang="scss" scoped>
.ai-summary {
  display: inline-block;
}
</style>
