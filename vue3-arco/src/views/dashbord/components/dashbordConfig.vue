<template>
  <el-drawer
    title="看板设置"
    :visible="visible"
    @open="handleOpen"
    @close="handleClose"
    direction="rtl"
    size="500px"
  >
    <div class="bord-setting-container" v-loading="isLoading">
      <div class="update-type">
        <div class="update-type-title">更新方式</div>
        <div class="config-radio-container">
          <div class="radio-container">
            <span class="update-label">实时更新</span>
            <el-radio v-model="form.updateType" :label="1">&nbsp;</el-radio>
          </div>
          <div class="description">看板加载后实时更新数据</div>
        </div>

        <div class="config-radio-container">
          <div class="radio-container">
            <span class="update-label">定时更新</span>
            <el-radio v-model="form.updateType" :label="2">&nbsp;</el-radio>
          </div>
          <div class="time-description">
            <span>每日定时更新数据,或刷新看板更新数据</span>
            <el-time-select
              class="time-select"
              :disabled="form.updateType !== 2"
              v-model="form.updateTime"
              :picker-options="{
                start: '00:00',
                step: '01:00',
                end: '23:00',
              }"
              size="mini"
              placeholder="选择时间"
            >
            </el-time-select>
          </div>
        </div>
      </div>

      <div class="permission-container">
        <div class="update-type-title">权限设置</div>

        <div>
          <el-radio-group v-model="form.permission">
            <div class="setting-radio">
              <el-radio :label="1">私人</el-radio>
            </div>
            <div class="setting-radio">
              <el-radio :label="2">公开</el-radio>
            </div>
            <div class="setting-radio">
              <el-radio :label="3">群组</el-radio>
              <template v-if="form.permission === 3">
                <el-select v-model="form.group" :multiple="true" size="mini">
                  <template v-for="(item, index) in groupOptions">
                    <el-option
                      :label="item.label"
                      :value="item.value"
                      :key="index"
                    ></el-option>
                  </template>
                </el-select>
              </template>
            </div>
          </el-radio-group>
        </div>
      </div>

      <!-- <template v-if="isEdit">
        <div class="operation-btn-container">
          <el-button
            @click="handleConfigCommit"
            :loading="isSaving"
            type="primary"
            >保存</el-button
          >
        </div>
      </template> -->
    </div>
  </el-drawer>
</template>
<script>
export default {
  props: {
    dashbordId: Number,
    formData: {
      type: Object,
      default() {
        return {};
      },
    },

    isEdit: {
      type: Boolean,
      default: false,
    },

    visible: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      isLoading: false,

      form: {
        updateType: 1, // 实时更新:1  定时更新:2
        updateTime: "01:00", // 更新时间 "01:00"
        permission: 1, // 私人:1 公开:2 群组:3
        group: [],
      },
      groupOptions: [
        // { label: "", value: "" }
      ],
    };
  },
  watch: {
    form: {
      deep: true,
      handler() {
        if (!this.isLoading) {
          const payload = {
            id: this.dashbordId,
            project_id: this.$store.getters.appId,
            ...this.form,
          };
          this.$store
            .dispatch("dashbord/saveDashbordConfig", payload)
            .then(() => {
              // this.$message({
              //   message: "配置已保存!",
              //   duration: 1000,
              //   type: "success",
              // });
            });
        }
      },
    },
  },
  methods: {
    handleClose() {
      this.$emit("close");
    },
    handleOpen() {
      this.getGroupOptionsData();
      this.getDashbordConfig();
    },

    getGroupOptionsData() {
      const payload = {
        id: this.dashbordId,
        project_id: this.$store.getters.appId,
      };
      this.$store
        .dispatch("dashbord/getDashbordConfigGroupOptions", payload)
        .then((data) => {
          this.groupOptions = data;
        })
        .catch(() => {
          //noop
        });
    },

    getDashbordConfig() {
      this.isLoading = true;
      const payload = {
        id: this.dashbordId,
        project_id: this.$store.getters.appId,
      };
      this.$store
        .dispatch("dashbord/getDasbordConfig", payload)
        .then((data) => {
          this.form = data;
          this.form.updateTime = data.updateTime || "08:00";
          if (!this.form) {
            //如果没有保存的数据,说明是新建状态,则重置表单
            this.form = this.$options.data().form;
          }
        })
        .catch(() => {
          //noop
        })
        .finally(() => {
          this.isLoading = false;
        });
    },
  },
  created() {},
};
</script>
<style lang="scss" scoped>
@import "@/styles/index.scss";

.bord-setting-container {
  padding-left: 30px;
  height: 100%;
  position: relative;

  .radio-container {
    .update-label {
      font-size: 14px;
      //   font-weight: bold;
    }

    display: flex;
    align-items: center;
    justify-content: space-between;
  }

  .operation-btn-container {
    position: absolute;
    left: 50%;
    transform: translateX(-50%);
    bottom: 20px;
    text-align: center;
  }

  .update-type-title {
    padding: 10px;
  }

  .description {
    font-size: 14px;
    color: $color-disabled;
    margin-top: 10px;
  }

  .time-description {
    font-size: 14px;
    color: $color-disabled;
    margin-top: 10px;

    display: flex;
    justify-content: space-between;
    align-items: center;

    .time-select {
      width: 120px;
      margin-left: 10px;
    }
  }

  .config-radio-container {
    padding: 20px;

    &:hover {
      background: $light-background-color;
    }
  }

  .permission-container {
    .setting-radio {
      height: 40px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding-left: 20px;
    }
  }
}
</style>
