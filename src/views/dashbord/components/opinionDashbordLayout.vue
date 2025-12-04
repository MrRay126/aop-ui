<template>
  <div class="dashbord-edit-container">
    <el-dialog
      title="管理看板内容"
      :visible="visible"
      @open="handleOpen"
      @close="handleClose"
      width="800px"
    >
      <div class="opinion-dashbord-edit" v-loading="isLoading">
        <div
          class="left-side"
          @drop="handleDragDrop"
          @dragover="handleDragOver"
        >
          <div class="top-title">
            <span>调整布局</span>
            <span>图表数 {{ cardList.length }}/{{ maxCount }} </span>
          </div>
          <div class="content">
            <grid-layout
              ref="q-grid-layout"
              :layout.sync="cardList"
              :col-num="colNumber"
              :row-height="2"
              :maxRows="(maxCount + 1) * cardHeight"
              :is-draggable="true"
              :is-resizable="true"
              :is-mirrored="false"
              :vertical-compact="true"
              :margin="[10, 10]"
              :use-css-transforms="true"
              :breakpoints="{ lg: 1200, md: 996, sm: 768, xs: 480, xxs: 0 }"
              :cols="{ lg: 12, md: 10, sm: 6, xs: 4, xxs: 2 }"
            >
              <template v-for="(cardItem, index) in cardList">
                <grid-item
                  :key="index"
                  class="echarts_box"
                  :x="cardItem.x"
                  :y="cardItem.y"
                  :w="cardItem.w"
                  :h="cardItem.h"
                  :i="cardItem.i"
                  :is-resizable="false"
                >
                  <div class="card-item">
                    <!-- {{ getSizeOptions(cardItem.report.type, cardItem) }} -->
                    <div class="operation">
                      <el-dropdown
                        @command="handleCardSizeChange(cardItem, $event)"
                        trigger="click"
                      >
                        <span class="operation-more">
                          <i class="el-icon-more"></i>
                        </span>
                        <el-dropdown-menu>
                          <template
                            v-for="(typeItem, index) in getSizeOptions(
                              cardItem.report.type,
                              cardItem
                            )"
                          >
                            <el-dropdown-item
                              :command="typeItem.value"
                              :key="index"
                            >
                              <span
                                :class="{
                                  focus:
                                    cardItem.report.cardSize === typeItem.value,
                                }"
                              >
                                {{ typeItem.label }}
                              </span>
                            </el-dropdown-item>
                          </template>
                        </el-dropdown-menu>
                      </el-dropdown>
                      <span>
                        <i
                          class="el-icon-delete"
                          @click="handleCardRemove(index)"
                        ></i
                      ></span>
                    </div>
                    <div class="title">{{ cardItem.report.name }}</div>
                  </div>
                </grid-item>
              </template>
            </grid-layout>
          </div>
        </div>
        <div class="right-side">
          <reports-list-pannel
            :listData="viewListData"
            :usedList="cardList"
            @onDragstart="handleDragStart"
            @apply="handleApply"
            @cancel="handleCancel"
          ></reports-list-pannel>
        </div>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import { GridLayout, GridItem } from "vue-grid-layout"; // vue 项目中
import {
  cardItem,
  // getCardItem,
  colNumber,
  big,
  middle,
  height,
  getSizeOptions,
  OpinionType,
} from "../data";
import { cloneObject } from "@/utils";
import reportsListPannel from "./reportsListPannel.vue";

export default {
  props: {
    dashbordId: Number,
    //布局数据
    cardListData: {
      type: Array,
      default() {
        return [];
      },
    },

    //是否显示
    visible: {
      type: Boolean,
      default: false,
    },

    //报表列表项数据
    viewListData: {
      type: Array,
      default() {
        return [];
      },
    },
  },

  components: {
    GridLayout,
    GridItem,
    reportsListPannel,
  },
  data() {
    return {
      cardHeight: height,
      maxCount: 20,
      colNumber,
      cardItem,
      cardList: [
        // cardItem in data.js
      ],
      isLoading: false,
    };
  },

  watch: {},
  methods: {
    getSizeOptions,

    handleClose() {
      this.$emit("close");
    },

    handleOpen() {
      if (Array.isArray(this.cardListData)) {
        //处理卡片显示的宽和高
        this.cardList = this.cardListData.map((cardItem) => {
          return {
            // ...cardItem,
            x: cardItem.x,
            y: cardItem.y,
            h: height,
            w: cardItem.report.cardSize === "big" ? big : middle,
            i: cardItem.i,
            report: cardItem.report,
          };
        });
      }
    },

    handleCardRemove(index) {
      this.$confirm("确定要删除吗?", "提示")
        .then(() => {
          this.cardList.splice(index, 1);
        })
        .catch(() => {
          // noop
        });
    },

    //去除操作过程中产生的参数,保持原有数据定义
    clearReportListData(data) {
      const reportProps = ["x", "y", "h", "w", "i", "report"];
      const list = data.map((reportItem) => {
        let clearedItem = {};
        reportProps.forEach((propItem) => {
          clearedItem[propItem] = reportItem[propItem];
        });
        return clearedItem;
      });
      return list;
    },

    // 确定看板编辑
    handleApply() {
      if (this.cardList.length === 0) {
        this.$message({
          message: "未添加报表项!",
          type: "warning",
          duration: 3000,
        });
        return;
      }

      this.isLoading = true;
      const payload = {
        id: this.dashbordId,
        project_id: this.$store.getters.appId,
        reportList: this.clearReportListData(this.cardList),
      };

      this.$store
        .dispatch("dashbord/saveDashbordReprots", payload)
        .then(() => {
          this.$message({
            message: "保存成功!",
            type: "success",
            duration: 3000,
          });

          this.$emit("apply");
          this.handleCancel();
        })
        .catch(() => {
          //noop
        })
        .finally(() => {
          this.isLoading = false;
        });
    },

    // 取消看板编辑
    handleCancel() {
      this.cardList = [];
      this.handleClose();
    },

    addCardItem(dragItem, size = "big") {
      const card = cloneObject(cardItem); //getCardItem(dragItem.type); //cloneObject(cardItem);
      card.i = `${this.cardList.length + 1}`;
      card.y = this.getCardY(card); //决定新加入项的位置,大的排序靠后
      card.w = size === "big" ? big : middle;

      card.report.project_id = this.$store.getters.appId;
      card.report.dashboard_id = this.dashbordId;
      card.report.id = dragItem.id;

      card.report.cardSize = size;
      card.report.name = dragItem.name || "";
      card.report.type = dragItem.type;

      // 竞品分析 需要根据分析类型判断生成 大卡、小卡选项
      if (dragItem.type === OpinionType.competition) {
        card.report.configs = {
          anylysisType: dragItem.anylysisType,
        };
      }
      this.cardList.unshift(card);
    },

    getCardY() {
      const cardCopies = cloneObject(this.cardList);

      cardCopies.sort((pre, next) => {
        return next.y - pre.y;
      });

      if (cardCopies[0]) {
        return cardCopies[0].y + 15;
      } else {
        return 0;
      }
    },
    //放大布局的单元
    handleCardSizeChange(cardItem, size) {
      cardItem.report.cardSize = size;
      if (size === "big") {
        cardItem.x = 0;
        cardItem.w = big;
      } else if (size === "middle") {
        cardItem.w = middle;
      }

      this.$refs["q-grid-layout"].layoutUpdate();
    },

    handleDragStart(item) {
      this.dragItem = item;
      return false;
    },

    handleDragOver(event) {
      event.preventDefault();
    },

    handleDragDrop() {
      const dragItem = this.dragItem;
      const alreadyHasTheItem = this.cardList.some((cardItem) => {
        return cardItem.report.id === dragItem.id;
      });

      if (!alreadyHasTheItem) {
        if (this.cardList.length >= this.maxCount) {
          this.$message({
            message: "添加失败!以达到最大图表数:" + this.maxCount + "个!",
            type: "warning",
            duration: 3000,
          });
          return;
        }
        this.addCardItem(dragItem);
      } else {
        this.$message({
          message: "报表添加重复!",
          type: "warning",
        });
      }
    },
  },
  created() {},
};
</script>
<style lang="scss" scoped>
@import "@/styles/index.scss";

.el-icon-delete {
  margin-left: 10px;
}

.focus {
  color: $color-primary;
}

.right-side {
  height: 100%;
}

.opinion-dashbord-edit {
  display: flex;
  align-items: flex-start;
  justify-content: flex-start;
  height: 600px;

  .left-side {
    width: 500px;
    height: 100%;
    overflow-y: auto;
    margin-right: 20px;
    background: $light-background-color;

    .top-title {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 10px;
      background: #fff;
    }

    .content {
      width: 100%;
      height: 560px;
      padding: 10px;
      overflow-y: auto;

      // background: red;
      .card-item {
        height: 100%;
        background: #fff;

        .operation {
          display: flex;
          align-items: center;
          justify-content: flex-end;
          font-size: 14px;
          padding: 10px 10px;
        }

        .title {
          height: 60px;
          // line-height: 60px;
          text-align: left;
          padding-left: 10px;
        }

        border: 1px solid $color-border;

        box-shadow: 3px 3px 3px #ccc;
      }
    }
  }
}
</style>
