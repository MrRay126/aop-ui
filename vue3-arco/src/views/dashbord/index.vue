<template>
  <div class="dashbord" v-loading="isLoadingDashbordMenuList">
    <toolbar
      :title="viewBordTitle"
      :comment="comment"
      :isDashbordEditable="isDashbordEditable"
      :isTimeFilterDisabled="isFilterActionDisabled"
      :isConditionFilterDisabled="isFilterActionDisabled"
      :timeData="globalTime"
      :isGlobalTimeTextShow="isGlobalTimeTextShow"
      :filterData="globalFilter"
      :customFilter="customFilter"
      page="dashbord"
      :isUseShareBtn="true"
      @refresh="handleRefresh"
      @configDashbord="handleConfigDashbord"
      @editDashBord="handleEditDashbord"
      @applyTime="handleApplyGlobalFilterTime"
      @filterChange="handleApplyGlobalFilterCondition"
      @customFilterChange="handleCustomFilterChange"
      @share="handleShare"
    >
      <template v-if="!isMenuInEditing">
        <div class="top-search-section" :style="{ width: sideWidth + 'px' }">
          <el-input
            v-model="searchText"
            placeholder="搜索看板"
            :clearable="true"
            size="mini"
            @input="handleSearchInput"
            :style="{ width: sideWidth - 100 + 'px' }"
          >
            <template #prepend>
              <!-- <i class="el-icon-search"></i> -->
            </template>
          </el-input>
          <div class="icons-container">
            <div class="btn-container">
              <!-- <el-button
                @click="handleGoToBordManage"
                type="text"
                icon="el-icon-s-operation"
              ></el-button> -->
              <svg-icon
                @click="handleGoToBordManage"
                icon-class="list"
                style="vertical-align: middle"
              ></svg-icon>
            </div>
            <div class="btn-container">
              <el-dropdown @command="handleSelectMenu" trigger="click">
                <el-button
                  type="text"
                  icon="el-icon-plus"
                  class="plus-icon"
                ></el-button>

                <el-dropdown-menu slot="dropdown">
                  <el-dropdown-item command="newView"
                    >新建看板</el-dropdown-item
                  >
                  <el-dropdown-item command="newSpace"
                    >新建空间</el-dropdown-item
                  >
                </el-dropdown-menu>
              </el-dropdown>
            </div>
          </div>
        </div>
      </template>
      <template v-else>
        <div :style="{ width: sideWidth + 'px' }">
          <div class="top-edit-return" @click="handleMenuEditReturn">
            <i class="el-icon-arrow-left"></i>
            <span class="top-edit-return-title">管理我创建的看板</span>
          </div>
        </div>
      </template>
    </toolbar>
    <div class="main-section-outer-wrapper">
      <main-section>
        <template #left>
          <div class="menu-outer">
            <div class="bord-list-title">
              <span class="title">看板列表</span>
            </div>

            <div :style="{ width: sideWidth + 'px' }" class="menu-container">
              <!-- 菜单编辑状态操作区域 -->
              <template v-if="isMenuInEditing">
                <div class="edit-menu-search-container">
                  <el-input
                    v-model="searchText"
                    placeholder="搜索看板"
                    :clearable="true"
                    size="mini"
                    @input="handleSearchInput"
                  >
                    <template #prepend>
                      <!-- <i class="el-icon-search"></i> -->
                    </template>
                  </el-input>
                </div>
                <div class="edit-menu-operation-container">
                  <el-checkbox
                    v-model="isSelectAllMenu"
                    @change="handleSelectAllMenuChange"
                    label="全选"
                  ></el-checkbox>

                  <span>
                    <el-button
                      size="mini"
                      :disabled="isMenuOperationBtnDisabled"
                      @click="handleEditMenuMoveTo"
                      >移动至</el-button
                    >
                    <el-button
                      size="mini"
                      type="danger"
                      :disabled="isMenuOperationBtnDisabled"
                      @click="handleEditMenuDelete"
                      >删除</el-button
                    >
                  </span>
                </div>
              </template>
              <!-- menuListShow:{{ menuListShow }} -->
              <!-- 菜单项 -->
              <template v-if="isShowMenuList">
                <el-menu
                  :default-openeds="opendMenuIndexes"
                  :default-active="defaultActive"
                  :collapse="false"
                  @select="handleMenuClick"
                  @open="handleMenuOpen"
                  @close="handleMenuClose"
                  class="dashbord-menu-vertical"
                  size="mini"
                >
                  <template v-for="(menuItem, index) in menuListShow">
                    <template v-if="Array.isArray(menuItem.children)">
                      <el-submenu :index="String(index)" :key="index">
                        <template slot="title">
                          <div class="menu-parent-inner">
                            <div class="title-container">
                              <template v-if="isMenuInEditing">
                                <el-checkbox
                                  v-model="menuItem.checked"
                                  @change="handleFolderCheckedChange(menuItem)"
                                ></el-checkbox>
                              </template>
                              <span
                                class="folder-title"
                                :title="menuItem.title"
                                v-html="menuItem.name"
                              ></span>
                            </div>

                            <template
                              v-if="
                                !isMenuInEditing &&
                                isSpaceHasOperation(menuItem)
                              "
                            >
                              <span class="more-btn">
                                <el-dropdown
                                  trigger="click"
                                  @command="
                                    handleSelectFolderMenu($event, menuItem)
                                  "
                                >
                                  <i
                                    class="el-icon-more menu-operation"
                                    @click.stop=""
                                  ></i>
                                  <el-dropdown-menu slot="dropdown">
                                    <template v-if="menuItem.spacePerms.rename">
                                      <el-dropdown-item
                                        command="rename"
                                        :disabled="
                                          menuItem.type !==
                                          spaceType.myCreatedSpace
                                        "
                                      >
                                        重新命名
                                      </el-dropdown-item>
                                    </template>
                                    <template v-if="menuItem.spacePerms.move">
                                      <el-dropdown-item command="move"
                                        >移动至</el-dropdown-item
                                      >
                                    </template>
                                    <template v-if="menuItem.spacePerms.remove">
                                      <el-dropdown-item
                                        command="removeNameSpace"
                                        >删除空间</el-dropdown-item
                                      >
                                    </template>
                                  </el-dropdown-menu>
                                </el-dropdown>
                              </span>
                            </template>
                          </div>
                        </template>
                        <el-menu-item-group>
                          <template
                            v-for="(cItem, cIndex) in menuItem.children"
                          >
                            <el-menu-item
                              class="menu-item"
                              :disabled="isMenuInEditing"
                              :index="`${String(index)}-${String(cIndex)}`"
                              :key="cIndex"
                            >
                              <div class="menu-item-inner">
                                <div class="title-container">
                                  <template v-if="isMenuInEditing">
                                    <el-checkbox
                                      v-model="cItem.checked"
                                      @change="
                                        handleMunuItemChecked(menuItem, cItem)
                                      "
                                    ></el-checkbox>
                                  </template>
                                  <span
                                    class="title"
                                    :title="cItem.title"
                                    v-html="cItem.name"
                                  ></span>
                                </div>
                                <template
                                  v-if="
                                    !isMenuInEditing &&
                                    isDashbordHasOperation(cItem)
                                  "
                                >
                                  <span>
                                    <el-dropdown
                                      trigger="click"
                                      @command="
                                        handleSelectFolderMenu($event, cItem)
                                      "
                                    >
                                      <i
                                        class="el-icon-more menu-operation"
                                        @click.stop=""
                                      ></i>
                                      <el-dropdown-menu slot="dropdown">
                                        <template
                                          v-if="cItem.dashbordPerms.rename"
                                        >
                                          <el-dropdown-item command="rename"
                                            >重新命名</el-dropdown-item
                                          >
                                        </template>
                                        <template
                                          v-if="cItem.dashbordPerms.move"
                                        >
                                          <el-dropdown-item command="move"
                                            >移动至</el-dropdown-item
                                          >
                                        </template>
                                        <template
                                          v-if="cItem.dashbordPerms.remove"
                                        >
                                          <el-dropdown-item command="remove"
                                            >删除看板</el-dropdown-item
                                          >
                                        </template>
                                      </el-dropdown-menu>
                                    </el-dropdown>
                                  </span>
                                </template>
                              </div>
                            </el-menu-item>
                          </template>
                        </el-menu-item-group>
                      </el-submenu>
                    </template>
                  </template>
                </el-menu>
              </template>
              <template v-else>
                <div class="no-menu-data">暂无数据</div>
              </template>
            </div>
          </div>
        </template>
        <template #right>
          <template v-if="activeMenu.type === bordType.simple">
            <div>
              <div class="small-card-container">
                <div class="small-card">
                  <!-- 内容总量 -->
                  <total-card
                    title="内容总量"
                    comment="内容量混合统计了项目相关的已抓取渠道所有文本内容条数"
                    :isLoading="isLoadingTotalCard"
                    :cardData="totalCardData"
                    @timeChange="handleTimeChange"
                  ></total-card>
                </div>
                <div class="small-card">
                  <!-- 正向内容总量 -->
                  <total-card
                    title="正向内容总量"
                    comment="正向内容量仅统计整句情感倾向为正向的内容"
                    :isLoading="isLoadingPositiveCard"
                    :cardData="positiveCardData"
                    @timeChange="handleTimeChange"
                  ></total-card>
                </div>
                <div class="small-card">
                  <!-- 负向内容总量 -->
                  <total-card
                    title="负向内容总量"
                    comment="负向内容量仅统计整句情感倾向为负向的内容"
                    :isLoading="isLoadingNegativeCard"
                    :cardData="negativeCardData"
                    @timeChange="handleTimeChange"
                  ></total-card>
                </div>
                <div class="small-card">
                  <!-- pie 统计 -->
                  <pie-card
                    title="正负占比"
                    comment="统计所有内容中：正向、负向、中性的占比。空文本会按照中性进行处理"
                    :isLoading="isLoadingPieCard"
                    :cardData="pieCardData"
                    @timeChange="handleTimeChange"
                  ></pie-card>
                </div>
              </div>
              <div class="channel-card-container">
                <chanel-card
                  :isLoading="isLoadingChannelCard"
                  :cardData="channelCardData"
                  @timeChange="handleTimeChange"
                ></chanel-card>
              </div>
              <div class="words-card-container">
                <!-- hotPointCardData:{{ hotPointCardData }} -->
                <hot-point-card
                  :isLoading="isLoadingHotPointCard"
                  :cardData="hotPointCardData"
                  @timeChange="handleTimeChange"
                ></hot-point-card>
              </div>
            </div>
          </template>

          <template v-else-if="activeMenu.type === bordType.warn">
            <warn-dashbord
              :bordId="warnBordId"
              :warnRules="warnRulesDataInputQuery"
              ref="warnDashboard"
              @ruleChange="handleRuleChange"
            ></warn-dashbord>
          </template>

          <template v-else-if="activeMenu.type === bordType.opinion">
            <!-- 报表显示区域 -->
            <bord-viewer
              :dashboard="activeMenu"
              :cardListData="cardList"
              :loading="isLoadingDashbord"
              @addBord="handleAddBord"
            ></bord-viewer>
          </template>

          <template
            v-else-if="
              activeMenu.type === bordType.customWeibo ||
              activeMenu.type === bordType.customBZhan
            "
          >
            <!-- 微博b站看板 -->
            <custom-bzhan-weibo
              :dashboard="activeMenu"
              :loading="loadingCustomWBdashbord"
              :cardListData="customBWviewList"
            ></custom-bzhan-weibo>
          </template>

          <template v-else-if="activeMenu.type === bordType.customLeciyuan">
            <!-- 乐次元看板 -->
            <custom-leciyuan
              :dashboard="activeMenu"
              :loading="loadingLeciyuanDashbord"
              :configs="leciyuanConfigs"
            >
            </custom-leciyuan>
          </template>
          <template
            v-else-if="activeMenu.type === bordType.customLeciyuanKeyWord"
          >
            <custom-leciyuan-key-word
                :dashboard="activeMenu"
                :loading="loadingLeciyuanDashbord"
                :configs="leciyuanConfigs"
            >
            </custom-leciyuan-key-word>
          </template>
          <template v-else-if="activeMenu.type === bordType.customSilverPalace">
            <custom-silver-palace
              :dashboard="activeMenu"
              :loading="loadingLeciyuanDashbord"
              :configs="leciyuanConfigs"
            ></custom-silver-palace>
          </template>
        </template>
      </main-section>
    </div>
    <el-dialog
      title="移动至"
      :visible.sync="isMoveToDialogVisible"
      width="500px"
      @open="initMoveToDialog"
    >
      <el-form>
        <el-form-item label="移动至:">
          <el-select v-model="moveTo" :filterable="true" size="mini">
            <template v-for="(item, index) in moveToSpaceOptions">
              <el-option
                :key="index"
                :label="item.title"
                :value="item.id"
              ></el-option>
            </template>
          </el-select>
          <div class="move-descrition">*仅移动选中看板,不移动文件夹。</div>
        </el-form-item>
      </el-form>

      <div class="commit-btn-container">
        <el-button
          :loading="isCommitingMoveto"
          @click="handleMoveToCommit"
          size="mini"
          type="primary"
          >确定</el-button
        >
      </div>
    </el-dialog>

    <el-dialog
      title="重命名"
      :visible.sync="isShowRenameFolderDialog"
      width="500px"
      @open="initRenameFolderDialog"
    >
      <el-form>
        <el-form-item :label="`${isSpace(editMenu) ? '空间' : '看板'}名称:`">
          <el-input
            v-model="bordName"
            size="mini"
            style="width: 300px"
            placeholder="请输入看板名称"
          ></el-input>
        </el-form-item>
      </el-form>

      <div class="commit-btn-container">
        <el-button
          :loading="isCommitingRename"
          :disabled="isRenameBtnDisabled"
          @click="handleRenameCommit"
          size="mini"
          type="primary"
          >确定</el-button
        >
      </div>
    </el-dialog>

    <el-dialog
      title="新建看板"
      :visible.sync="isShowCreateDashbordDialog"
      width="450px"
      @open="initCreateDashbordDialog"
    >
      <el-form label-width="90px">
        <el-form-item label="看板名称:">
          <el-input
            v-model="newBordName"
            size="mini"
            style="width: 240px"
            placeholder="请输入看板名称"
          ></el-input>
        </el-form-item>
        <el-form-item label="添加至:">
          <el-select
            v-model="namespace"
            :filterable="true"
            size="mini"
            style="width: 240px"
          >
            <template v-for="(item, index) in newDashbordPlaceOptions">
              <el-option :label="item.title" :value="item.id" :key="index">
              </el-option>
            </template>
          </el-select>
        </el-form-item>
      </el-form>

      <div class="commit-btn-container">
        <el-button
          :loading="isCommitingCreateDashbord"
          :disabled="isCreateDashbordDisabled"
          @click="handleCreateDashbordCommit"
          size="mini"
          type="primary"
          >确定</el-button
        >
      </div>
    </el-dialog>

    <el-dialog
      title="新建空间"
      :visible.sync="isShowSpaceDialog"
      width="500px"
      @open="initSpaceDialog"
    >
      <el-form>
        <el-form-item label="空间名称:">
          <el-input
            v-model="spaceName"
            size="mini"
            style="width: 300px"
            placeholder="请输入空间名称"
          ></el-input>
        </el-form-item>
      </el-form>

      <div class="commit-btn-container">
        <el-button
          :loading="isCommitingSpace"
          :disabled="isSpaceBtnDisabled"
          @click="handleSpaceCommit"
          size="mini"
          type="primary"
          >确定</el-button
        >
      </div>
    </el-dialog>

    <!-- 看板属性配置 -->
    <dashbord-config
      :dashbordId="activeMenu.id"
      :visible="isShowDashbordConfig"
      @close="handleDashbordConfigClose"
    ></dashbord-config>

    <!-- 配置布局的看板 -->
    <opinion-dashbord-layout
      mode="edit"
      :dashbordId="activeMenu.id"
      :viewListData="viewList"
      :cardListData="cardList"
      :visible="isShowDashbordEditor"
      @close="handleCloseEditDashbord"
      @apply="handleApplyLayout"
    ></opinion-dashbord-layout>
  </div>
</template>
<script>
import toolbar from "../components/toolbar";
import mainSection from "../components/mainSection";
import totalCard from "./components/totalCard.vue";
import pieCard from "./components/pieCard.vue";
import chanelCard from "./components/chanelCard.vue";
import hotPointCard from "./components/hotPointCard.vue";
import numeral from "numeral";
import { cloneObject, param } from "@/utils";

import {
  panelType,
  spaceType,
  bordType,
  comments,
  OpinionType,
  MarketType,
  queryKeys,
} from "./data";
import dashbordConfig from "./components/dashbordConfig.vue";
import warnDashbord from "./components/warnDashbord.vue";
import opinionDashbordLayout from "./components/opinionDashbordLayout.vue";
import bordViewer from "./components/bordViewer.vue";
import customBzhanWeibo from "./components/customDashbords/customBzhanWeibo.vue";
import customLeciyuan from "@/views/dashbord/components/customDashbords/customLeciyuan.vue";
import customLeciyuanKeyWord from "@/views/dashbord/components/customDashbords/customLeciyuanKeyWord.vue";
import customSilverPalace from "@/views/dashbord/components/customDashbords/customSilverPalace.vue";

export default {
  components: {
    toolbar,
    mainSection,
    totalCard,
    pieCard,
    chanelCard,
    hotPointCard,
    dashbordConfig,
    warnDashbord,
    opinionDashbordLayout,
    bordViewer,
    customBzhanWeibo,
    customLeciyuan,
    customLeciyuanKeyWord,
    customSilverPalace,
  },

  data() {
    return {
      refreshing: false,
      //乐次元自定义看板
      loadingLeciyuanDashbord: false,
      leciyuanConfigs: {
        cardList: [],
        selectsFilters: [],
      },

      // 微博 & B站自定义内容看板
      loadingCustomWBdashbord: false,
      customBWviewList: null, //[], configs

      isGlobalTimeTextShow: false,
      warnRulesDataOutputQuery: null, // 保存预警看板输出的预警规则选项, 用于复制url
      warnRulesDataInputQuery: null,
      globalTime: null,
      globalFilter: null,

      customFilter: {
        content: "", // 关键字搜索  (筛选时为‘包含’逻辑)
        channel: [
          // 渠道查询参数 (筛选时为‘等于’ 逻辑)
        ],
      },

      comment: "",
      moveToSpaceOptions: [],
      opendMenuIndexes: [],
      openMenus: [],
      isLoadingDashbordMenuList: false,
      spaceType,
      deleteLoadingObj: null,
      isLoadingDashbord: false,
      viewList: [], //报表列表项数据
      cardList: [], // card列表数据(只包含配置,不包含显示部分)
      isShowDashbordEditor: false, //显示看板编辑弹窗
      isShowDashbordConfig: false, //显示看板配置弹窗

      warnBordId: null, //查看的报警看板id
      bordType,

      //新建空间
      isShowSpaceDialog: false,
      isCommitingSpace: false,
      spaceName: "",

      namespace: "",
      newBordName: "",
      isShowCreateDashbordDialog: false,
      isCommitingCreateDashbord: false,

      isCommitingRename: false,
      bordName: "", // 重命名的名称
      isShowRenameFolderDialog: false,
      editMenu: null, //当前移动、删除、重命名的菜单项

      isCommitingMoveto: false,
      isMoveToDialogVisible: false,
      moveTo: null,
      isSelectAllMenu: false,
      isMenuInEditing: false, //菜单是否在编辑中

      viewBordTitle: "",
      sideWidth: 300,
      searchText: "",
      activeMenu: { id: null, name: "", type: "", spaceType: "", title: "" }, //当前聚焦查看内容的看板项目
      defaultActive: "",
      defaultActiveSaved: "",
      isShowMenuList: false,
      dashBordMuneList: [],
      //[
      //   {
      //     title: "列表项1",
      //     name: "list1",
      //     children: [],
      //   },
      //   {
      //     title: "列表项2",
      //     name: "list2",
      //     children: [
      //       {
      //         title: "sub_list2",
      //         name: "sublist_2",
      //       },
      //     ],
      //   },
      // ],
      menuListShow: [],

      //总量数据
      isLoadingTotalCard: false,
      totalCardData: null,
      //{
      //   title: "总内容量", // 标题
      //   // 时间参数
      //   time: {
      //     type: "relative", // absolute|relative 绝对时间|相对时间
      //     start: "2021/8/1 0:0:0", //开始时间字符串
      //     end: "2021/8/30 23:59:59", //结束时间字符串
      //     recent_day: "0-0", //配置日期组件回显  昨日: ‘1-1’ | 今日: ’0-0’ | 上周: ‘W1’ |: 本周 W0 | 上月: M1 | 本月: M0 | 过去7天:  1-7 | 过去30天  1-30 | 过去某天至过去某天 2-7 | StartToNow （绝对时间自某日至今）
      //   },

      //   count: "8888", // 数量
      //   cardType: "total", //数据卡类型(总量 正向 负向)  total | positive |negative
      //   rate: {
      //     // 总量卡时的同环比数据
      //     week: { data: "11%", isUp: false }, //周
      //     day: { data: "11%", isUp: false }, // 日
      //   },
      //   avgCount: "12345", // 平均数据
      //   tooltipText: "toptip text", // tooltip提示内容
      // },

      //正向卡数据
      isLoadingPositiveCard: false,
      positiveCardData: null,
      // {
      //   title: "正向内容量", // 标题
      //   // 时间参数

      //   time: {
      //     type: "relative", // absolute|relative 绝对时间|相对时间
      //     start: "2021/8/1 0:0:0", //开始时间字符串
      //     end: "2021/8/30 23:59:59", //结束时间字符串
      //     recent_day: "0-0", //配置日期组件回显  昨日: ‘1-1’ | 今日: ’0-0’ | 上周: ‘W1’ |: 本周 W0 | 上月: M1 | 本月: M0 | 过去7天:  1-7 | 过去30天  1-30 | 过去某天至过去某天 2-7 | StartToNow （绝对时间自某日至今）
      //   },

      //   count: "8888", // 数量
      //   cardType: "positive", // total | positive |negative
      //   rate: {
      //     // 总量卡时的同环比数据
      //     week: { data: "11%", isUp: false },
      //     day: { data: "11%", isUp: false },
      //   },
      //   avgCount: "12345", // 平均数据
      //   tooltipText: "toptip text", // tooltip提示内容
      // },

      //负向卡数据
      isLoadingNegativeCard: false,
      negativeCardData: null,
      //{
      //   title: "负向内容量", // 标题
      //   // 时间参数
      //   time: {
      //     type: "relative", // absolute|relative 绝对时间|相对时间
      //     start: "2021/8/1 0:0:0", //开始时间字符串
      //     end: "2021/8/30 23:59:59", //结束时间字符串
      //     recent_day: "0-0", //配置日期组件回显  昨日: ‘1-1’ | 今日: ’0-0’ | 上周: ‘W1’ |: 本周 W0 | 上月: M1 | 本月: M0 | 过去7天:  1-7 | 过去30天  1-30 | 过去某天至过去某天 2-7 | StartToNow （绝对时间自某日至今）
      //   },

      //   count: "8888", // 数量
      //   cardType: "negative", // total | positive |negative
      //   rate: {
      //     // 总量卡时的同环比数据
      //     week: { data: "11%", isUp: false },
      //     day: { data: "11%", isUp: false },
      //   },
      //   avgCount: "12345", // 平均数据
      //   tooltipText: "toptip text", // tooltip提示内容
      // },
      isLoadingPieCard: false,
      pieCardData: null,
      //{
      //   title: "正负占比", // 标题
      //   tooltipText: "toptip text", // tooltip提示内容
      //   // 时间参数
      //   time: {
      //     type: "relative", // absolute|relative 绝对时间|相对时间
      //     start: "2021/8/1 0:0:0", //开始时间字符串
      //     end: "2021/8/30 23:59:59", //结束时间字符串
      //     recent_day: "0-0", //配置日期组件回显  昨日: ‘1-1’ | 今日: ’0-0’ | 上周: ‘W1’ |: 本周 W0 | 上月: M1 | 本月: M0 | 过去7天:  1-7 | 过去30天  1-30 | 过去某天至过去某天 2-7 | StartToNow （绝对时间自某日至今）
      //   },

      //   pie: [
      //     { value: 1048, name: "正向" },
      //     { value: 735, name: "负向" },
      //     { value: 580, name: "中性" },
      //   ],
      // },

      //频道card数据
      isLoadingChannelCard: false,
      channelCardData: null,
      //{
      //   time: {
      //     type: "relative", // absolute|relative 绝对时间|相对时间
      //     start: "2021/8/1 0:0:0", //开始时间字符串
      //     end: "2021/8/30 23:59:59", //结束时间字符串
      //     recent_day: "0-0", //配置日期组件回显  昨日: ‘1-1’ | 今日: ’0-0’ | 上周: ‘W1’ |: 本周 W0 | 上月: M1 | 本月: M0 | 过去7天:  1-7 | 过去30天  1-30 | 过去某天至过去某天 2-7 | StartToNow （绝对时间自某日至今）
      //   },

      //   chartData: {
      //     dimensions: ["product", "2015", "2016", "2017"],
      //     source: [
      //       { product: "Matcha Latte", 2015: 43.3, 2016: 85.8, 2017: 93.7 },
      //       { product: "Milk Tea", 2015: 83.1, 2016: 73.4, 2017: 55.1 },
      //       { product: "Cheese Cocoa", 2015: 86.4, 2016: 65.2, 2017: 82.5 },
      //       { product: "Walnut Brownie", 2015: 72.4, 2016: 53.9, 2017: 39.1 },
      //     ],
      //   },

      //   rankList: [
      //     { title: "名称名称名称名称名称名称名称", count: 121323 },
      //     { title: "名称", count: 121323 },
      //     { title: "名称", count: 121323 },
      //     { title: "名称", count: 121323 },
      //     { title: "名称", count: 121323 },
      //     { title: "名称", count: 121323 },
      //     { title: "名称", count: 121323 },
      //     { title: "名称", count: 121323 },
      //     { title: "名称", count: 121323 },
      //     { title: "名称", count: 121323 },
      //     { title: "名称", count: 121323 },
      //     { title: "名称", count: 121323 },
      //   ],
      // },

      //热点词汇card
      isLoadingHotPointCard: false,
      hotPointCardData: null,
      //   {
      //     configs: {
      //       aop_type: "hotPoint",
      //       time: {
      //         type: "relative", // absolute|relative 绝对时间|相对时间
      //         start: "2021/8/1 0:0:0", //开始时间字符串
      //         end: "2021/8/30 23:59:59", //结束时间字符串
      //         recent_day: "0-0", //配置日期组件回显  昨日: ‘1-1’ | 今日: ’0-0’ | 上周: ‘W1’ |: 本周 W0 | 上月: M1 | 本月: M0 | 过去7天:  1-7 | 过去30天  1-30 | 过去某天至过去某天 2-7 | StartToNow （绝对时间自某日至今）
      //       },
      //     },

      //     wordType: "高频词", //高频词汇  //
      //     chartData: {
      //       高频词: [
      //         {
      //           name: "Sam S Club",
      //           value: 10000,
      //         },
      //         {
      //           name: "Macys",
      //           value: 6181,
      //         },
      //         {
      //           name: "Amy Schumer",
      //           value: 4386,
      //         },
      //         {
      //           name: "Jurassic World",
      //           value: 4055,
      //         },
      //       ],
      //       突发词: [
      //         {
      //           name: "Amy Schumer",
      //           value: 4386,
      //         },
      //         {
      //           name: "Jurassic World",
      //           value: 4055,
      //         },
      //       ],
      //       新词: [
      //         {
      //           name: "Macys",
      //           value: 6181,
      //         },
      //         {
      //           name: "Amy Schumer",
      //           value: 4386,
      //         },
      //         {
      //           name: "Jurassic World",
      //           value: 4055,
      //         },
      //       ],
      //     },

      //     rankList: [
      //       {
      //         title: "名称名称名称名称名称名称名称",
      //         count: 121323,
      //         word: "Sam S Club",
      //       },
      //       {
      //         title: "名称名称名称名称名称名称名称",
      //         count: 121323,
      //         word: "Amy Schumer",
      //       },
      //     ],
      //   },
      cardDataProp: {
        [panelType.total]: "totalCardData",
        [panelType.positive]: "positiveCardData",
        [panelType.negative]: "negativeCardData",
        [panelType.pie]: "pieCardData",
        [panelType.channel]: "channelCardData",
        [panelType.hotPoint]: "hotPointCardData",
      },
    };
  },

  watch: {
    "$store.getters.appId": {
      immediate: true,
      handler(val) {
        if (val) {
          this.init();
        }
      },
    },
  },

  computed: {
    isFilterActionDisabled() {
      // 预警分析不支持全局时间和过滤条件筛选
      return (
        this.activeMenu.type === bordType.warn ||
        this.activeMenu.type.includes("custom")
      );
    },
    namespaceOptions() {
      const menuList = this.$store.state.dashbord.menuList;
      if (menuList.length > 0) {
        return menuList.map((spaceItem) => {
          return {
            title: spaceItem.title,
            id: spaceItem.id,
            spacePerms: spaceItem.spacePerms,
          };
        });
      }

      return [];
    },

    newDashbordPlaceOptions() {
      const menuList = this.$store.state.dashbord.menuList;
      if (menuList.length > 0) {
        return menuList.filter((spaceItem) => {
          return (
            spaceItem.type !== spaceType.systemSpace &&
            spaceItem.type !== spaceType.sharedToMe
          );
        });
      }
      return [];
    },

    isMenuOperationBtnDisabled() {
      let hasCheckedItem = false;
      this.menuListShow.forEach((item) => {
        if (item.checked) {
          hasCheckedItem = true;
        }
        if (item.children) {
          item.children.forEach((child) => {
            if (child.checked) {
              hasCheckedItem = true;
            }
          });
        }
      });
      return !hasCheckedItem;
    },

    isRenameBtnDisabled() {
      return !this.bordName.trim();
    },

    isCreateDashbordDisabled() {
      return !this.newBordName.trim() || typeof this.namespace !== "number";
    },

    isSpaceBtnDisabled() {
      return !this.spaceName.trim();
    },

    //看板是否可配置
    isDashbordEditable() {
      if (this.activeMenu) {
        return this.activeMenu.dashbordPerms?.edit;
      }
      return false;
    },
  },

  methods: {
    handleCustomFilterChange(data) {
      // this.customFilter = data;

      if (this.activeMenu.type === bordType.simple) {
        // 舆情概览看板
        for (let prop in panelType) {
          const cardDataProp = this.cardDataProp[prop];
          const cardData = this[cardDataProp];
          if (cardData && cardData.configs) {
            cardData.configs.custom_filters = data;
          }
        }

        this.getAllPanelData();
      }

      if (this.activeMenu.type === bordType.opinion) {
        // 用户配置的分析看板
        // kol分析 和 竟品分析不支持
        let oldList = this.cardList;
        this.cardList = [];
        //添加 globalFilter 配置 触发刷新
        this.$nextTick(() => {
          this.cardList = oldList.map((cardItem) => {
            cardItem.report.configs.custom_filters = data;
            return cardItem;
          });
        });
      }
    },

    handleApplyGlobalFilterCondition(data) {
      this.globalFilter = data;
      if (this.activeMenu.type === bordType.simple) {
        // 舆情概览看板
        for (let prop in panelType) {
          const cardDataProp = this.cardDataProp[prop];
          const cardData = this[cardDataProp];
          if (cardData && cardData.configs) {
            cardData.configs.globalFilter = data.filters;
          }
        }

        this.getAllPanelData();
      }

      if (this.activeMenu.type === bordType.opinion) {
        // 用户配置的分析看板
        // kol分析 和 竟品分析不支持
        let oldList = this.cardList;
        this.cardList = [];
        //添加 globalFilter 配置 触发刷新
        this.$nextTick(() => {
          this.cardList = oldList.map((cardItem) => {
            if (
              cardItem.report.type !== MarketType.kol &&
              cardItem.report.type !== OpinionType.competition
            ) {
              cardItem.report.configs.globalFilter = data;
            }
            return cardItem;
          });
        });
      }
    },

    handleApplyGlobalFilterTime(data) {
      this.isGlobalTimeTextShow = true;
      this.globalTime = data;
      // 舆情概览看板
      if (this.activeMenu.type === bordType.simple) {
        for (let prop in panelType) {
          const cardDataProp = this.cardDataProp[prop];
          const cardData = this[cardDataProp];
          if (cardData && cardData.configs) {
            cardData.configs.time = data;
          }
        }

        this.getAllPanelData();
      }

      // 用户配置的分析看板
      if (this.activeMenu.type === bordType.opinion) {
        // kol分析 和 竟品分析不支持
        let oldList = this.cardList;
        this.cardList = [];
        //添加 globalFilter 配置 触发刷新
        this.$nextTick(() => {
          this.cardList = oldList.map((cardItem) => {
            cardItem.report.configs.time = data;
            return cardItem;
          });
        });
      }
    },

    getMoveToSpaceOptions() {
      let menuList = this.isMenuInEditing
        ? this.menuListShow
        : this.$store.state.dashbord.menuList;

      const editMenu = this.editMenu;

      // const isEditingCheckedAll = this.isEditingCheckedAll;

      if (editMenu && !this.isMenuInEditing) {
        menuList = menuList.filter((item) => {
          if (this.isSpace(editMenu)) {
            //非当前操作的看板空间自身

            return item.name !== editMenu.name;
          } else {
            //非当前操作的看板所在空间
            const space = menuList.find((spaceItem) => {
              return (
                Array.isArray(spaceItem.children) &&
                spaceItem.children.some(
                  (menuItem) => menuItem.id === editMenu.id
                )
              );
            });
            if (space) {
              return item.name !== space.name;
            }
          }
        });
      }

      // console.log("menuList:", menuList);

      if (menuList.length > 0) {
        return menuList
          .filter((spaceItem) => {
            return spaceItem.spacePerms.move;
          })
          .map((spaceItem) => {
            return {
              title: spaceItem.title,
              id: spaceItem.id,
              spacePerms: spaceItem.spacePerms,
            };
          });
      }
      return [];
    },
    // 空间是否可操作
    isSpaceHasOperation(spaceItem) {
      const { rename, move, remove } = spaceItem.spacePerms;
      const enables = [rename, move, remove];
      return enables.includes(true);
    },

    // 看板项是否可操作
    isDashbordHasOperation(dashbordItem) {
      const { rename, move, remove } = dashbordItem.dashbordPerms;
      const enables = [rename, move, remove];
      return enables.includes(true);
    },

    isSpace(menuItem) {
      if (!menuItem) return;
      const spaceTypesValues = Object.values(spaceType);
      return spaceTypesValues.some((value) => value === menuItem.type);
    },

    //批量编辑时,获取能够移动和删除的文件夹和内部的看板项目
    getSpaceAndDashbordOfMultipleEdit(menus) {
      //处理看板空间
      const spaceMenus = menus.filter((item) => {
        return item.spacePerms.remove && item.spacePerms.move;
      });
      //处理内部的children
      spaceMenus.forEach((spaceItem) => {
        if (Array.isArray(spaceItem.children)) {
          spaceItem.children = spaceItem.children.filter((dashbordItem) => {
            return (
              dashbordItem.dashbordPerms.move &&
              dashbordItem.dashbordPerms.remove
            );
          });
        }
      });
      return spaceMenus;
    },

    getBordConfigs(id) {
      // 1 获取看板的配置列表
      // 2 根据看板列表的配置获取看板卡的显示数据
      this.cardList = [];
      this.isLoadingDashbord = true;
      return this.$store
        .dispatch("dashbord/getDashbordCardConfigs", {
          project_id: this.$store.getters.appId,
          id,
        })
        .then((data) => {
          this.cardList = data;
        })
        .catch(() => {
          // noop
        })
        .finally(() => {
          this.isLoadingDashbord = false;
        });
    },
    handleDashbordConfigClose() {
      this.isShowDashbordConfig = false;
    },
    //配置报表信息
    handleConfigDashbord() {
      this.isShowDashbordConfig = true;
    },

    handleCloseEditDashbord() {
      this.isShowDashbordEditor = false;
    },

    //应用布局配置
    handleApplyLayout(data) {
      //刷新当前看板
      this.getBordConfigs(this.activeMenu.id);
    },

    // 编辑
    handleEditDashbord() {
      this.isShowDashbordEditor = true;
    },

    //添加新报表
    handleAddBord() {
      this.handleEditDashbord();
      this.cardList = [];
    },

    openCreateSpaceDialog() {
      this.isShowSpaceDialog = true;
    },

    closeCreateSpaceDialog() {
      this.isShowSpaceDialog = false;
    },

    initSpaceDialog() {
      this.spaceName = "";
    },

    //api
    handleSpaceCommit() {
      const payload = {
        project_id: this.$store.getters.appId,
        name: this.spaceName,
      };
      this.isCommitingSpace = true;
      this.$store
        .dispatch("dashbord/createNameSpace", payload)
        .then(() => {
          this.$message({
            message: "空间新建成功!",
            type: "success",
            duration: 3000,
          });
          this.isShowSpaceDialog = false;
          this.refreshMenuList();
        })
        .catch(() => {
          //noop
        })
        .finally(() => {
          this.isCommitingSpace = false;
        });
    },

    openCreateDashbordDialog() {
      this.isShowCreateDashbordDialog = true;
    },
    closeCreateDashbordDialog() {
      this.isShowCreateDashbordDialog = false;
    },
    //api
    handleCreateDashbordCommit() {
      this.isCommitingCreateDashbord = true;
      const payload = {
        name: this.newBordName,
        space: this.namespace,
        project_id: this.$store.getters.appId,
      };
      this.$store
        .dispatch("dashbord/createDashbord", payload)
        .then(() => {
          this.$message({
            message: "看板创建成功!",
            type: "success",
            duration: 3000,
          });
          this.isShowCreateDashbordDialog = false;
          this.refreshMenuList();
        })
        .catch(() => {
          //noop
        })
        .finally(() => {
          this.isCommitingCreateDashbord = false;
        });
    },

    initCreateDashbordDialog() {
      this.newBordName = "";
      if (this.newDashbordPlaceOptions.length > 0) {
        this.namespace = this.newDashbordPlaceOptions[0].id;
      }
    },

    //api 确定重命名
    handleRenameCommit() {
      this.isCommitingRename = true;
      // console.log("this.editMenu::", this.editMenu);
      const payload = {
        project_id: this.$store.getters.appId,
        id: this.editMenu.id,
        title: this.bordName,
        type: this.isSpace(this.editMenu) ? "nameSpace" : "dashboard",
      };

      this.$store
        .dispatch("dashbord/renameDashbordOrSpace", payload)
        .then(() => {
          this.$message({
            message: "重命名成功!",
            duration: 3000,
            type: "success",
          });
          this.isShowRenameFolderDialog = false;
          this.refreshMenuList();
        })
        .catch(() => {
          //noop
        })
        .finally(() => {
          this.isCommitingRename = false;
        });
    },

    //非编辑状态下拉选项的选择操作,  menuItem 命名空间 | 看板项
    handleSelectFolderMenu(operationName, menuItem) {
      this.editMenu = menuItem;

      const Operations = {
        rename: () => {
          //重命名
          this.openRenameFolderDialog();
        },
        move: () => {
          //移动
          this.moveToSpaceOptions = this.getMoveToSpaceOptions();
          this.openMoveToDialog();
        },
        remove: () => {
          //删除看板
          this.$confirm("确定要删除吗?", "提示")
            .then(() => {
              const payload = {
                project_id: this.$store.getters.appId,
                dashbordList: [this.editMenu],
              };
              this.deleteDashbordMenu(payload);
            })
            .catch(() => {
              // noop
            });
        },

        removeNameSpace: () => {
          //删除看板空间
          this.$confirm("确定要删除看板空间吗?", "提示")
            .then(() => {
              const payload = {
                namespaceId: menuItem.id,
              };
              this.deleteDashbordMenu(payload, "nameSpace");
            })
            .catch(() => {
              //noop
            });
        },
      };

      Operations[operationName]();
    },

    // 编辑状态下删除看板项
    handleEditMenuDelete() {
      this.$confirm("确定要删除吗?", "提示")
        .then(() => {
          // 删除操作
          const payload = {
            project_id: this.$store.getters.appId,
            dashbordList: this.getAllCheckedMenuList(),
          };

          this.deleteDashbordMenu(payload);
        })
        .catch(() => {
          // noop
        });
    },

    // type:dashbord 看板  type: nameSpace 看板空间
    deleteDashbordMenu(payload, type = "dashbord") {
      const deleteActions = {
        dashbord: "dashbord/deleteDashbord",
        nameSpace: "dashbord/deleteNameSpace",
      };
      const action = deleteActions[type];

      this.deleteLoadingObj = this.$loading();
      this.$store
        .dispatch(action, payload)
        .then(() => {
          this.$message({
            message: "删除成功!",
            duration: 3000,
            type: "success",
          });

          // 如果当前显示的看板被删除则初始化显示舆情概览
          this.refreshMenuList().then(() => {
            if (!this.isMenuInEditing) {
              this.resetActiveMenuAndInitDashbord();
            } else {
              //编辑状态下设置全部qu
              // this.setAllMenuItemCheckedStatus(this.menuListShow, false);
            }
          });
        })
        .catch(() => {
          // noop
        })
        .finally(() => {
          this.deleteLoadingObj.close();
        });
    },

    //编辑完菜单项后 重新设置菜单焦点和对应的看板数据显示
    resetActiveMenuAndInitDashbord() {
      const isActiveMenuExist = this.setActiveMenuById(this.activeMenu.id);
      if (!isActiveMenuExist) {
        // 初始化显示舆情概览
        this.init();
      }
    },

    handleMunuItemChecked(folder) {
      this.setFolderCheckedStatus(folder);
      this.setAllCheckedStatus();
    },

    handleFolderCheckedChange(menuItem) {
      this.editMenu = menuItem;
      menuItem.children.forEach((item) => {
        this.$set(item, "checked", menuItem.checked);
      });
      this.setAllCheckedStatus();
    },

    //设置文件夹的选中状态
    setFolderCheckedStatus(folder) {
      let allFolderItemChecked = false;
      if (Array.isArray(folder.children) && folder.children.length > 0) {
        allFolderItemChecked = folder.children.every((item) => item.checked);
      }
      this.$set(folder, "checked", allFolderItemChecked);
    },

    //设置全部选项的选中状态
    setAllCheckedStatus() {
      let isAllChecked = this.menuListShow.every((folder) => {
        if (Array.isArray(folder.children)) {
          return (
            folder.checked && folder.children.every((child) => child.checked)
          );
        }
        return false;
      });

      this.isSelectAllMenu = isAllChecked;
    },

    //api
    // 1 移动一个命名空间 2 移动一个看板项  3 移动多个看板项
    handleMoveToCommit() {
      this.isCommitingMoveto = true;

      const payload = {
        distNamespace: this.moveTo,
        dashbordList: [], // 移动的项目
      };

      payload.dashbordList = this.isMenuInEditing
        ? this.getAllCheckedMenuList()
        : this.isSpace(this.editMenu)
        ? [...this.editMenu.children]
        : [this.editMenu];

      this.$store
        .dispatch("dashbord/moveDashbordOrSpace", payload)
        .then(() => {
          this.$message({
            message: "移动成功!",
            type: "success",
            duration: 3000,
          });
          this.closeMoveToDialog();
          this.refreshMenuList().then(() => {
            this.setActiveMenuById(this.activeMenu.id);
          });
        })
        .catch(() => {
          // noop
        })
        .finally(() => {
          this.isCommitingMoveto = false;
        });
      ///提交成功后
    },

    getAllCheckedMenuList() {
      if (this.isMenuInEditing) {
        const menuListShowCopy = cloneObject(this.menuListShow);

        let menuListOfCheckedAll = menuListShowCopy.filter((item) => {
          return item.checked;
        });

        let menuListOfCheckedSome = menuListShowCopy.filter((item) => {
          if (Array.isArray(item.children)) {
            item.children = item.children.filter((item) => item.checked);
            return !item.checked && item.children.length > 0;
          }
          return false;
        });

        const allChekedMenus = [
          ...menuListOfCheckedAll,
          ...menuListOfCheckedSome,
        ];

        const allCheckedDashboards = allChekedMenus.reduce((pre, item) => {
          return [...pre, ...item.children];
        }, []);

        return allCheckedDashboards;
      } else {
        //
        return [this.editMenu.id];
      }
    },

    async refreshMenuList() {
      await this.getDashBordMenuList();
      this.handleSearchInput();
    },

    openRenameFolderDialog() {
      this.isShowRenameFolderDialog = true;
    },

    closeRenameFolderDialog() {
      this.isShowRenameFolderDialog = false;
    },

    initRenameFolderDialog() {
      this.bordName = this.editMenu.title || "";
    },

    closeMoveToDialog() {
      this.isMoveToDialogVisible = false;
    },

    openMoveToDialog() {
      this.isMoveToDialogVisible = true;
    },

    initMoveToDialog() {
      if (this.moveToSpaceOptions.length > 0) {
        this.moveTo = this.moveToSpaceOptions[0].id;
      }
    },

    handleEditMenuMoveTo() {
      this.moveToSpaceOptions = this.getMoveToSpaceOptions();
      this.openMoveToDialog();
    },

    setAllMenuItemCheckedStatus(menuList, isChecked = true) {
      menuList.forEach((item) => {
        this.$set(item, "checked", isChecked);
        if (item.children) {
          item.children.forEach((child) => {
            this.$set(child, "checked", isChecked);
          });
        }
      });
    },

    handleSelectAllMenuChange() {
      const isChecked = this.isSelectAllMenu;
      this.setAllMenuItemCheckedStatus(this.menuListShow, isChecked);
    },

    //folder 编辑状态返回
    handleMenuEditReturn() {
      this.isMenuInEditing = false;
      this.setAllMenuItemCheckedStatus(this.menuListShow, false);
      this.resetActiveMenuAndInitDashbord();
    },

    // 开启folder编辑状态
    handleGoToBordManage() {
      this.isMenuInEditing = true;
      this.defaultActive = "";

      const folderOfMine = this.getFolderOfMine(this.menuListShow);

      this.menuListShow = this.getSpaceAndDashbordOfMultipleEdit(
        this.menuListShow
      );

      if (folderOfMine) {
        this.menuListShow.unshift(folderOfMine);
      }

      this.openFoldersIfExist(this.openMenus);
    },

    //获取 "我的看板" 文件夹
    getFolderOfMine(menus) {
      const folderOfMine = menus.find((spaceItem) => {
        return spaceItem.name === "我的看板";
      });
      return folderOfMine;
    },

    numeral(...args) {
      return numeral(...args);
    },

    getCardData(payload) {
      const loadingDict = {
        total: "isLoadingTotalCard",
        positive: "isLoadingPositiveCard",
        negative: "isLoadingNegativeCard",
        pie: "isLoadingPieCard",
        channel: "isLoadingChannelCard",
        hotPoint: "isLoadingHotPointCard",
      };
      const loadingProp = loadingDict[payload.aop_type];
      this[loadingProp] = true;
      return new Promise((res) => {
        this.$store
          .dispatch("dashbord/getDashbordCardData", payload)
          .then((data) => {
            res(data);
          })
          .catch(() => {
            //noop
          })
          .finally(() => {
            this[loadingProp] = false;
          });
      });
    },

    async handleTimeChange(payload, needMessage = true) {
      const { data, cardType } = payload;
      const cardDataProp = this.cardDataProp[cardType];
      const cardData = this[cardDataProp];

      if (cardData && cardData.configs) {
        //设置时间数据
        if (data) {
          cardData.configs.time = data;
        }

        //获取card数据
        const resData = await this.getCardData(cardData.configs);
        if (cardData.configs.aop_type === "pie") {
          let pie = [];

          if (resData.pie) {
            pie = this.getPiePercent(Object.values(resData.pie)); //[{ value: 1048, name: "正向" }]
          }

          // console.log("pie is:", pie);

          this[cardDataProp] = {
            ...this[cardDataProp],
            ...resData,
            pie: pie, //重写pie属性
          };
        } else {
          this[cardDataProp] = { ...this[cardDataProp], ...resData };
        }

        if (needMessage) {
          this.$message({
            message: "数据已更新",
            duration: 3000,
            type: "success",
          });
        }
      }
    },

    /**
     * @param <Array> pieDataList  @example [{ value: 1048, name: "正向" }]
     * @return <Array> @example [{ value: 1048, name: "正向10%" }]
     * */
    getPiePercent(pieDataList) {
      const total = pieDataList
        .map((item) => item.value)
        .reduce((pre, item) => {
          return pre + item;
        });
      // console.log("total:", total);
      if (total !== 0) {
        pieDataList = pieDataList.map((item) => {
          return {
            name: `${item.name} ${numeral(item.value / total).format("0.0%")}`,
            value: item.value,
          };
        });
      }

      return pieDataList;
    },

    //api
    async handleMenuClick(path, indexPath) {
      if (this.isMenuInEditing) return;
      this.isGlobalTimeTextShow = false;
      // path 当前路由点击项的index
      // indexPath 包含父子菜单的值
      const isOneDeep = indexPath.length === 1;
      const isTwoDeep = indexPath.length === 2;
      let curMenu = null;

      if (isOneDeep) {
        curMenu = this.dashBordMuneList[path];
      } else if (isTwoDeep) {
        const firstIndex = indexPath[1].split("-")[0];
        const secondIndex = indexPath[1].split("-")[1];
        curMenu = this.dashBordMuneList[firstIndex].children[secondIndex];
      }
      // console.log("curMenu:", curMenu, JSON.stringify(this.dashBordMuneList));
      this.activeMenu = curMenu;

      this.viewBordTitle = curMenu.title;

      // this.viewBordType = curMenu.type;

      this.getDashboardData(curMenu);
      this.resetGlobalTimeAndFilterData();
    },

    resetGlobalTimeAndFilterData() {
      this.globalTime = null;
      this.globalFilter = null;
      this.customFilter = this.$options.data().customFilter;
    },

    handleMenuOpen(index) {
      this.openMenus.push(this.menuListShow[index]);
    },

    handleMenuClose(index) {
      const menuItem = this.menuListShow[index];
      const pos = this.openMenus.indexOf(menuItem);
      if (pos !== -1) this.opendMenuIndexes.splice(pos, 1);
    },

    async getDashboardData(dashboard, isRefresh = false) {
      const dashbordType = dashboard.type;

      //舆情概览看板
      if (dashbordType === bordType.simple) {
        await this.getSimpleDashbordData(dashboard);
        await this.getAllPanelData();
      }

      // 报警看板  // 刷新查看带id的状态直接刷新即可使用ref 内部id, 否则设置id为null后,再执行刷新
      if (dashbordType === bordType.warn) {
        this.comment = comments.warn;

        if (isRefresh) {
          await this.$refs["warnDashboard"].refresh();
        } else {
          // 更新显示无id情况,设置id然后触发更新
          // 由有id切换为无具体id , 或由其他分析模块切换到预警分析
          this.$nextTick(() => {
            this.warnBordId = null;
            this.$nextTick(() => {
              this.$refs["warnDashboard"].__initViewOfWarnMenuClick();
            });
          });
        }
      }

      //常规舆情看板
      if (dashbordType === bordType.opinion) {
        await this.getBordConfigs(dashboard.id);
      }

      // 微博&B站内容看板
      if (
        dashbordType === bordType.customWeibo ||
        dashbordType === bordType.customBZhan
      ) {
        await this.getCusotomWeiBZhanData(dashboard.id);
      }

      //乐次元自定义看板
      if (dashbordType === bordType.customLeciyuan) {
        await this.getCustomLeciyuan(dashboard.id);
      }

      //乐次元关键词看板
      if (dashbordType === bordType.customLeciyuanKeyWord) {
        await this.getCustomLeciyuan(dashboard.id);
      }
    },

    getCusotomWeiBZhanData(id) {
      const payload = {
        id,
      };
      this.customBWviewList = [];
      this.loadingCustomWBdashbord = true;
      this.$store
        .dispatch("dashbord/getCustomDashboardCardConfigs", payload)
        .then((res) => {
          this.customBWviewList = res.panels;
        })
        .catch(() => {
          ///noop
        })
        .finally(() => {
          this.loadingCustomWBdashbord = false;
        });
    },

    getCustomLeciyuan(id) {
      const payload = {
        id,
      };
      this.leciyuanConfigs = this.$options.data().leciyuanConfigs;
      this.loadingLeciyuanDashbord = true;
      this.$store
        .dispatch("dashbord/getCustomDashboardCardConfigs", payload)
        .then((res) => {
          this.leciyuanConfigs = {
            cardList: res.panels,
            selectsFilters: res.selectsFilters,
          };
        })
        .catch(() => {
          ///noop
        })
        .finally(() => {
          this.loadingLeciyuanDashbord = false;
        });
    },

    handleRuleChange(payload) {
      this.warnRulesDataOutputQuery = payload;
    },

    handleShare() {
      const isSimpleDashboard = this.activeMenu.type === bordType.simple;
      const isWarnDashboard = this.activeMenu.type === bordType.warn;
      const isOpininDashboard = this.activeMenu.type === bordType.opinion;
      // 微博 B站 等看板
      const isWeiboDashbord = this.activeMenu.type === bordType.customWeibo;
      const isBZhanDashbord = this.activeMenu.type === bordType.customBZhan;

      const isLeciyuanDashbord =
        this.activeMenu.type === bordType.customLeciyuan;
      
      const isLeciyuanKeywordDashbord =
        this.activeMenu.type === bordType.customLeciyuanKeyWord;

      let query = "";
      let url = this.$route.path;

      if (isSimpleDashboard) {
        // 舆情看板
        query = param({
          [queryKeys.type]: bordType.simple,
          [queryKeys.projectId]: this.$store.getters.appId,
        });
      } else if (isWarnDashboard) {
        // 预警看板
        query = param({
          [queryKeys.type]: bordType.warn,
          [queryKeys.projectId]: this.$store.getters.appId,
          [queryKeys.warn]: JSON.stringify(this.warnRulesDataOutputQuery),
          [queryKeys.id]: this.$route.query[queryKeys.id] || "",
        });
      } else if (isOpininDashboard) {
        // 分析报表
        query = param({
          [queryKeys.type]: bordType.opinion,
          [queryKeys.projectId]: this.$store.getters.appId,
          [queryKeys.id]: this.activeMenu.id || "",
        });
      } else if (isWeiboDashbord || isBZhanDashbord || isLeciyuanDashbord || isLeciyuanKeywordDashbord) {
        // weibo bzhan leciyuan
        query = param({
          [queryKeys.type]: this.activeMenu.type,
          [queryKeys.projectId]: this.$store.getters.appId,
          [queryKeys.id]: this.activeMenu.id || "",
        });
      }

      this.$copyText(`${window.location.origin}/#${url}?${query}`).then(() => {
        this.$message({
          message: "复制成功",
          type: "success",
        });
      });
    },

    async handleRefresh() {
      clearTimeout(this.timo);
      this.timo = setTimeout(async () => {
        // 如果存在全局过滤条件或全局过滤时间则借用其函数进行刷新(有参数时可借用), 否则使用原有刷新重新获取数据
        if (this.globalFilter) {
          this.handleApplyGlobalFilterCondition(this.globalFilter);
        } else if (this.globalTime) {
          this.handleApplyGlobalFilterTime(this.globalTime);
        } else {
          const isRefresh = true;
          await this.getDashboardData(this.activeMenu, isRefresh);
        }

        this.$message({
          message: "刷新成功!",
          duration: 3000,
          type: "success",
        });
      }, 300);
    },

    //筛选左侧过滤条件
    handleSearchInput() {
      this.isSelectAllMenu = false;
      this.menuListShow = [];
      let list = cloneObject(this.dashBordMuneList);

      if (this.searchText) {
        list = list.filter((item) => {
          if (Array.isArray(item.children)) {
            item.children = item.children.filter((item) => {
              return item.title.includes(this.searchText);
            });
          }
          return item.children.length > 0;
        });
      }

      if (this.isMenuInEditing) {
        //我的看板
        const myboardList = this.getFolderOfMine(list);
        // 有权限的看板
        list = this.getSpaceAndDashbordOfMultipleEdit(list);

        if (myboardList) {
          list.unshift(myboardList);
        }
      }

      //搜索时设置取消menu选中项的选中状态,清空搜索时根据如果没有最新的选中项再还原
      this.defaultActive = this.getCurMenuActiveIndex();

      this.useMenuList(list, () => {
        this.setHighlightSearchTitle(list);
        if (this.searchText) {
          this.openAllMenus(list);
        } else {
          this.openAllMenus([]);
        }
      });
    },

    setHighlightSearchTitle(list) {
      list.forEach((parent) => {
        if (Array.isArray(parent.children) && parent.children.length > 0) {
          parent.children.forEach((child) => {
            child.name = child.name.replaceAll(
              this.searchText,
              `<span style="color:#409EFF;vertical-align: initial;">${this.searchText}</span>`
            );
          });
        }
      });
    },

    //完全清空显示的界面后,再显示
    useMenuList(list, cb) {
      this.menuListShow = [];

      this.$nextTick(() => {
        this.menuListShow = list;
        this.$nextTick(() => {
          this.isShowMenuList = this.menuListShow.length > 0;
          typeof cb === "function" && cb();
        });
      });
    },

    openFoldersIfExist(menus) {
      this.opendMenuIndexes = [];
      const menuListShowIds = this.menuListShow.map((item) => {
        return item.id;
      });
      menus.forEach((item) => {
        const pos = menuListShowIds.indexOf(item.id);

        if (pos !== -1) {
          this.opendMenuIndexes.push(String(pos));
        }
      });

      this.useMenuList(this.menuListShow); // 刷新显示
    },

    openAllMenus(list = []) {
      if (Array.isArray(list) && list.length > 0) {
        this.opendMenuIndexes = [];

        list.forEach((item, index) => {
          this.opendMenuIndexes.push(String(index));
        });
      } else {
        this.opendMenuIndexes = [];
      }
    },

    getMatchedMenuItem(list) {
      list = list.filter((item) => {
        if (Array.isArray(item.children)) {
          item.children = item.children.filter((item) => {
            return item.title.includes(this.searchText);
          });
        }
        return item.title.includes(this.searchText) || item.children.length > 0;
      });
      return list;
    },

    // api
    async getDashBordMenuList() {
      const appId = this.$store.getters.appId;
      //this.dashBordMuneList 保存原始的值用于切换
      this.isLoadingDashbordMenuList = true;
      this.dashBordMuneList = await this.$store.dispatch(
        "dashbord/getMenuList",
        appId
      );
      this.isLoadingDashbordMenuList = false;

      //取消全选 设置初始选择状态属性
      this.isSelectAllMenu = false;

      //完全清空显示的界面后,再显示
      const list = cloneObject(this.dashBordMuneList);
      this.useMenuList(list);
    },

    // api 获取面板所有数据
    async getSimpleDashbordData(menu) {
      for (let prop in panelType) {
        const cardDataProp = this.cardDataProp[prop];
        this[cardDataProp] = null;
      }

      let data = await this.$store.dispatch("dashbord/getDashbordData", {
        id: menu.id,
        project_id: this.$store.getters.appId,
      });
      const panels = data.panels;

      this.setPanelConfigOf(panelType.total, panels);
      this.setPanelConfigOf(panelType.positive, panels);
      this.setPanelConfigOf(panelType.negative, panels);
      this.setPanelConfigOf(panelType.pie, panels);
      this.setPanelConfigOf(panelType.channel, panels);
      this.setPanelConfigOf(panelType.hotPoint, panels);
    },
    //设置panel的配置数据
    setPanelConfigOf(panelType, data) {
      if (panelType && Array.isArray(data)) {
        const configs = data.find((item) => {
          return item.aop_type === panelType;
        });
        // 配置参数添加appid
        configs.project_id = this.$store.getters.appId;

        if (configs && this.cardDataProp[panelType]) {
          this[this.cardDataProp[panelType]] = {
            configs,
          };
        }
      } else {
        console.log("param error:", panelType, data);
      }
    },

    //添加看板
    handleSelectMenu(menu) {
      if (menu === "newView") {
        //新建看板
        this.openCreateDashbordDialog();
      } else if (menu === "newSpace") {
        //新建空间
        this.openCreateSpaceDialog();
      }
    },

    //获取全部panel的数据
    getAllPanelData() {
      const panelRequests = Object.values(panelType).map((cardType) => {
        return this.handleTimeChange({ cardType }, false);
      });
      return Promise.all(panelRequests);
    },

    getMenuItemAndSetActiveByIndex(menus, parentIndex = 0, childIndex = 0) {
      if (Array.isArray(menus)) {
        if (menus[parentIndex]?.children?.length > 0) {
          this.defaultActive = `${parentIndex}-${childIndex}`;
          return menus[parentIndex].children[childIndex];
        }
      }
      return null;
    },

    //获取看板列表中当前聚焦的项的pIndex+cIndex
    getCurMenuActiveIndex() {
      const id = this.activeMenu.id;
      let parentIndex = "";
      let childIndex = "";

      for (let i = 0, len = this.menuListShow.length; i < len; i++) {
        parentIndex = i;
        let pItem = this.menuListShow[i];
        if (Array.isArray(pItem.children) && pItem.children.length > 0) {
          for (let j = 0, lenj = pItem.children.length; j < lenj; j++) {
            childIndex = j;
            let cItem = pItem.children[j];
            if (cItem.id === id) {
              return `${parentIndex}-${childIndex}`;
            }
          }
        }
      }
    },

    //移动后重新设置当前的焦点项
    setActiveMenuById(id) {
      let parentIndex = null;
      let childIndex = null;
      this.menuListShow.forEach((menuItem, index) => {
        if (Array.isArray(menuItem.children)) {
          menuItem = menuItem.children.find((child, cIndex) => {
            if (child.id === id) {
              childIndex = cIndex;
              return true;
            }
          });
          if (menuItem) {
            parentIndex = index;
          }
        }
      });

      if (parentIndex !== null && childIndex !== null) {
        this.defaultActive = `${parentIndex}-${childIndex}`;
        return this.defaultActive;
      }
      return null;
    },

    // api 获取保存的看板列表
    getViewListData() {
      this.$store
        .dispatch("dashbord/getViewDataList", {
          project_id: this.$store.getters.appId,
        })
        .then((data) => {
          this.viewList = data;
        })
        .catch(() => {
          //noop
        });
    },
    /**
     *   获取某个看板空间在空间层级的index
     *   @param spaceType {String} 看板空间的类型
     *   @return {Number}
     */
    getSystemSpaceIndex(spaceType) {
      const index = this.menuListShow.findIndex((spaceItem) => {
        return spaceItem.type === spaceType;
      });
      return index;
    },
    /**
     * 获取看板在看板空间内的index
     * @param spaceType {String} 看板空间的类型
     * @param dashbordId {Number} 看板的id
     */
    getDashbordIndexByType(spaceType, dashbordType) {
      let index = null;
      const space = this.menuListShow.find((spaceItem) => {
        return spaceItem.type === spaceType;
      });

      if (space && space.children) {
        index = space.children.findIndex((dashbordItem) => {
          return dashbordItem.type === dashbordType;
        });
      }
      return index;
    },

    async init() {
      /**
       *
       * 涉及初始化的看板类型
       * 1 预警分析看板
       * 2 舆情概览看板
       * 3 舆情分析看板
       *
       * 舆情概览看板步骤:
       * 1 获取看板菜单数据
       * 2 获取看板的数据卡配置
       * 3 根据看板数据卡配置获取数据卡的数据
       */
      this.defaultActive = ""; // *清空后 切换app时默认值才会生效
      this.getViewListData(); // 侧边栏报表数据列表
      await this.getDashBordMenuList();

      const query = this.$route.query;
      const dashbordId = query[queryKeys.id]; // 报表id
      const viewBordType = query[queryKeys.type]; // readOnce(SessionKey.dashbordType);
      // 预警分析
      if (viewBordType === bordType.warn) {
        this.warnBordId = Number(query[queryKeys.id]); //  readOnce(SessionKey.warnBordId);
        const warnQuery = query[queryKeys.warn];
        if (warnQuery) {
          this.warnRulesDataInputQuery = JSON.parse(
            decodeURIComponent(warnQuery)
          );
        }

        let spaceIndex = this.getSystemSpaceIndex("system");
        let dashbordIndex = this.getDashbordIndexByType("system", "warn");
        // 根据menu类型显示对应页面模块 , 模块自身初始化
        this.activeMenu = this.getMenuItemAndSetActiveByIndex(
          this.dashBordMuneList,
          spaceIndex,
          dashbordIndex
        );

        // 预警分析的预警规则参数值 需要回显使用
        this.comment = comments.warn;
        const warnReportName = query[queryKeys.warnName]
          ? "-" + query[queryKeys.warnName]
          : "";
        this.viewBordTitle = this.activeMenu?.title + warnReportName;
      } else if (
        viewBordType === bordType.opinion ||
        viewBordType === bordType.customWeibo ||
        viewBordType === bordType.customBZhan ||
        viewBordType === bordType.customLeciyuan
      ) {
        //按url回显
        if (dashbordId) {
          const id = Number(dashbordId);

          const activeIndex = this.setActiveMenuById(id);
          const indexes = activeIndex.split("-");
          const path = indexes[0];
          const indexPath = [indexes[0], activeIndex];
          this.handleMenuClick(path, indexPath);
          // this.getBordConfigs(id);
        }
        this.viewBordTitle = this.activeMenu?.title || "";
      } else {
        //舆情概览 加载首页或按url切换project
        let spaceIndex = this.getSystemSpaceIndex("system");
        let dashbordIndex = this.getDashbordIndexByType("system", "simple");

        this.activeMenu = this.getMenuItemAndSetActiveByIndex(
          this.dashBordMuneList,
          spaceIndex,
          dashbordIndex
        );

        await this.getSimpleDashbordData(this.activeMenu);
        this.getAllPanelData();
        this.viewBordTitle = this.activeMenu?.title || "";
      }
    },
  },

  beforeRouteUpdate(to, from, next) {
    this.init();
    next();
  },

  created() {
    //初始化在watch
  },
};
</script>
<style lang="scss" scoped>
@import "@/styles/index.scss";
.dashbord {
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
  background: transparent;

  .plus-icon {
    color: #42546d;
    vertical-align: middle;

    &:hover {
      color: $color-primary;
    }
  }

  .move-descrition {
    color: $color-disabled;
  }

  .commit-btn-container {
    text-align: center;
    margin-top: 15px;
  }

  .edit-menu-search-container {
  }

  .edit-menu-operation-container {
    padding: 10px 0;
    margin-bottom: 10px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    // border-bottom: 1px solid $color-border;
  }

  ::v-deep(.el-menu-item:hover) {
    .menu-operation {
      display: inline;
    }
  }
  .menu-item-inner {
    display: flex;
    justify-content: space-between;
    align-items: center;

    &:hover {
      & .menu-operation {
        display: inline;
      }
    }

    .menu-operation {
      font-size: 12px;
      margin-right: -20px;
      display: none;

      &:hover {
        color: $color-primary;
      }
    }
  }

  .menu-parent-inner {
    display: flex;
    justify-content: space-between;
    align-items: center;
    width: 100%;
    margin-right: 12px;

    &:hover {
      & .menu-operation {
        display: inline-block;
        font-size: 15px;
      }
      & .more-btn {
        display: inline-block;
      }
    }

    .title-container {
      width: 100%;
      margin-right: 15px;
      overflow: hidden;
      text-overflow: ellipsis;
      flex: 1 1 auto;

      .title {
        vertical-align: -2px;
        margin-left: 5px;
      }

      .folder-title {
        vertical-align: -2px;
        margin-left: 5px;
        font-weight: 500;
        color: #303133;
      }
    }

    .more-btn {
      width: 40px;
      flex-grow: 0;
      margin-left: -10px;
      display: none;
    }

    .menu-operation {
      margin-right: 20px;
      margin-top: -5px;
      vertical-align: -2px;
      display: none;
    }
  }

  .title-container {
    width: 100%;
    overflow: hidden;
    text-overflow: ellipsis;

    .title {
      vertical-align: -2px;
      margin-left: 5px;
    }
  }

  .main-section-outer-wrapper {
    width: 100%;
    height: calc(100% - 50px);
    flex: 1;
    background: $background-color;

    .bord-list-title {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 10px 10px;
      height: 50px;
      border-bottom: 1px solid $color-border;

      .title {
        font-weight: bold;
        color: $color-text;
      }
    }

    .no-menu-data {
      margin-top: 20px;
      color: $color-desc;
      font-size: 14px;
      text-align: center;
    }
    .menu-container {
      height: calc(100% - 50px);
      overflow: auto;
      padding: 10px;
    }
    .menu-outer {
      height: 100%;
      background: #fff;
    }
  }

  .small-card-container {
    display: flex;
    align-items: center;
    justify-content: space-between;
    background: transparent;
    .small-card {
      width: calc(25% - 20px);
      // height: 200px;
      background: #fff;
    }
  }

  .channel-card-container {
    width: 100%;
    margin-top: 10px;
    background: #fff;
    height: 500px;
  }

  .words-card-container {
    width: 100%;
    height: 500px;
    margin-top: 10px;
    margin-bottom: 20px;
    background: #fff;

    .top-bar {
      height: 30px;
      width: 100%;
    }

    .words-container {
      height: 400px;
      width: 100%;
      margin-bottom: 10px;
    }
  }

  .top-edit-return {
    display: flex;
    justify-content: flex-start;
    align-items: center;
    padding-left: 5px;
    cursor: pointer;

    .top-edit-return-title {
      font-size: 14px;
      margin-left: 3px;
    }

    &:hover {
      // color: $color-primary;
    }
  }
  .top-search-section {
    width: 410px;
    padding-left: 10px;
    display: flex;
    align-items: center;
    justify-content: space-between;

    .icons-container {
      font-size: 14px;
      padding-right: 30px;
      i {
        margin-left: 10px;
      }

      .btn-container {
        display: inline-block;
        margin-left: 5px;
      }
    }
  }

  .dashbord-menu-vertical {
    // width: 200px;
    // min-height: 400px;
    border: none;

    ::v-deep(.el-submenu__title) {
      display: flex;
      align-items: center;
      justify-content: space-between;

      height: 40px;
      line-height: 40px;
    }

    ::v-deep(.el-menu-item) {
      text-align: left;
      height: 40px;
      line-height: 40px;
    }
    ::v-deep(.el-menu-item-group__title) {
      padding: 2px;
    }

    ::v-deep(.el-menu-item.is-disabled) {
      opacity: 1;
    }
  }
}
</style>
