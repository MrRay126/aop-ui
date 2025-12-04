<template>
  <div class="filter-and-collector">
    <el-tabs v-model="activeTab">
      <el-tab-pane label="指标筛选" name="filter">
        <filters
          :configData="filtersData"
          :optionsData="filterOpionsData"
          :valueComponentConfig="filterValueComponentConfig"
          @change="handleFilterChange"
        ></filters>
      </el-tab-pane>
      <el-tab-pane label="收藏" name="collect">
        <filter-collector
          @action="handleCollectorAction"
          :listData="listData"
          :isLoading="isLoadingListData"
        ></filter-collector>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>
<script>
import filterCollector from "../filterCollector";
import filters from "../filters";

export default {
  props: {
    filters: {
      type: Object,
      default() {
        return {};
      },
    },

    filterOpionsData: {
      type: Array,
      default() {
        return [];
      },
    },

    filterValueComponentConfig: {
      type: Object,
      default() {
        return {};
      },
    },
  },
  components: { filterCollector, filters },
  data() {
    return {
      activeTab: "filter",

      filtersData: {
        relTag: "and", // or | and
        children: [],
      },

      listData: [],
      isLoadingListData: false,
    };
  },
  watch: {
    filters: {
      immediate: true,

      handler(val) {
        if (val) {
          this.filtersData = val;
        }
      },
    },
  },
  methods: {
    handleFilterChange(data) {
      this.filtersData = data;
      this.$emit("action", { name: "filterChange", data: this.filtersData });
    },

    handleCollectorAction({ name, data }) {
      if (name === "rename") {
        // api rename

        const payload = {
          project_id: this.$store.getters.appId,
          userId: this.$store.state.auth.userInfo.id,
          id: data.id,
          title: data.rename,
        };
        this.$store
          .dispatch("common/renameCollectFilter", payload)
          .then(() => {
            this.$message({
              message: "重命名成功!",
              type: "success",
            });
          })
          .finally(() => {
            this.getListData();
          });
      } else if (name === "remove") {
        // api remove
        const payload = {
          project_id: this.$store.getters.appId,
          userId: this.$store.state.auth.userInfo.id,
          id: data.id,
        };
        this.$store
          .dispatch("common/deleteCollectFilter", payload)
          .then(() => {
            this.$message({
              message: "删除成功!",
              type: "success",
            });
          })
          .finally(() => {
            this.getListData();
          });
      } else if (name === "apply") {
        // api apply
        this.activeTab = "filter";
        // this.$message({
        //   message: "已应用指标!",
        //   type: "success",
        // });
        this.$emit("action", { name: "apply", data: data.filterData });
      }
    },

    getListData() {
      this.isLoadingListData = true;
      // api get
      const payload = {
        project_id: this.$store.getters.appId,
        userId: this.$store.state.auth.userInfo.id,
      };
      this.$store
        .dispatch("common/getCollectFilterData", payload)
        .then((data) => {
          this.listData = data;
        })
        .finally(() => {
          this.isLoadingListData = false;
        });
    },
  },
  created() {
    this.getListData();
  },
};
</script>
<style lang="scss" scoped>
.filter-and-collector {
}
</style>
