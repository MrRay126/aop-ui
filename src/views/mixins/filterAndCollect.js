import { fitListData } from "@/views/components/filters/data.js";
import { cloneObject } from "@/utils";
export const filterCollectMixins = {
  data() {
    return {
      filter: {
        value: "",
        filters: {
          relTag: "and", // or | and
          children: [],
        },
      },
      filterOpionsData: [],
      filterValueComponentConfig: {},
      isCollectting: false,
      isCollectPopoverVisible: false,
      collectName: "",
    };
  },
  methods: {
    handleCancelCollect() {
      this.isCollectPopoverVisible = false;
    },

    handleCommitCollect() {
      if (!this.collectName) {
        this.$message({
          message: "请输入收藏名称!",
          type: "warning",
        });
        return;
      }
      this.saveCollectData();
    },

    // getListData() {
    //   this.isLoadingListData = true;
    //   // api get
    //   const payload = {
    //     project_id: this.$store.getters.appId,
    //     userId: this.$store.state.auth.userInfo.id,
    //   };
    //   this.$store
    //     .dispatch("common/getCollectFilterData", payload)
    //     .then((data) => {
    //       this.listData = data;
    //     })
    //     .finally(() => {
    //       this.isLoadingListData = false;
    //     });
    // },

    getFilterOptions() {
      const payload = {
        project_id: this.$store.getters.appId,
      };
      return this.$store
        .dispatch("trend/getFilterOptions", payload)
        .then((data) => {
          this.tableOptionsData = fitListData(data);
          const curTable = this.tableOptionsData[0];
          this.filter.value = curTable.value;
          this.filterOpionsData = curTable.keyList || [];
          this.filterValueComponentConfig = curTable.valueComponentConfig;
          this.groupperOptions = curTable.groups || [];
        });
    },

    handleCollectFilterBtn() {
      const collectedFilterCount =
        this.$refs["filterAndCollector"]?.listData.length;

      if (collectedFilterCount >= 20) {
        this.$message({
          message:
            "最多可收藏20个筛选指标,当前收藏指标个数为" +
            collectedFilterCount +
            "个!",
          type: "info",
        });
        return;
      }

      if (this.filter.filters.children.length === 0) {
        this.$message({
          message: "收藏的筛选指标不存在,请添加后收藏!",
          type: "info",
        });
        return;
      }

      this.collectName = "";
      this.isCollectPopoverVisible = true;
    },

    saveCollectData() {
      this.isCollectting = true;
      const payload = {
        project_id: this.$store.getters.appId,
        userId: this.$store.state.auth.userInfo.id,
        filterData: this.filter.filters,
        title: this.collectName,
      };
      this.$store
        .dispatch("common/saveCollectFilterData", payload)
        .then(() => {
          this.$message({
            message: "收藏成功!",
            type: "success",
          });
          this.isCollectPopoverVisible = false;

          this.$refs["filterAndCollector"].getListData();
        })
        .finally(() => {
          this.isCollectting = false;
        });
    },

    handleFilterAndCollectorAction({ name, data }) {
      if (name === "filterChange" || name === "apply") {
        this.filter.filters = cloneObject(data);
      }
      this.alreadyCalculated = false;
    },
  },
};
