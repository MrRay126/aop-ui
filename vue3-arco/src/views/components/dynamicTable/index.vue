<template>
  <div class="dynamic-table-container" ref="container" v-loading="loading">
    <!-- <template v-if="!loading"> -->
    <vxe-table
      ref="xTable"
      class="dynamic-table"
      :data="source"
      :height="typeof height === 'number' ? height + 'px' : height"
      :max-height="typeof maxHeight === 'number' ? maxHeight + 'px' : maxHeight"
      :checkbox-config="{
        checkMethod: ifCheckBoxCheckable,
        visibleMethod: ifCheckBoxVisible,
      }"
      @checkbox-all="selectAllEvent"
      @checkbox-change="selectChangeEvent"
      @scroll="handleTableScroll"
      v-bind="$attrs"
      v-on="$listeners"
    >
      <template v-for="(headerItem, index) in dimension">
        <template v-if="headerItem.actionType === 'selection'">
          <vxe-table-column
            type="checkbox"
            :title="headerItem.label"
            :min-width="headerItem.minWidth"
            :width="headerItem.width || ''"
            :key="index"
            :fixed="headerItem.fixed || ''"
          >
          </vxe-table-column>
        </template>

        <template v-else-if="headerItem.actionType === 'expand'">
          <vxe-table-column
            type="expand"
            :min-width="headerItem.minWidth"
            :width="headerItem.width || ''"
            :key="index"
            :fixed="headerItem.fixed || ''"
          >
            <template #content="{ row, rowIndex }">
              <div class="expand-content-container">
                <!-- 使用slot或header -->
                <slot name="expand" :row="row" :rowIndex="rowIndex">
                  <div
                    class="expand-content-container"
                    v-html="
                      headerItem.expandContentHtmlHandler(
                        headerItem,
                        row,
                        rowIndex
                      )
                    "
                  ></div>
                </slot>
              </div>
            </template>
          </vxe-table-column>
        </template>

        <template v-else>
          <vxe-table-column
            :key="index"
            :width="headerItem.width || ''"
            :min-width="headerItem.minWidth"
            :fixed="headerItem.fixed || ''"
          >
            <template #header>
              <div class="sortable-header">
                <span
                  @click.self="handleHeaderClick(headerItem)"
                  :style="{
                    cursor:
                      headerItem.actionType === 'sort' ||
                      (Array.isArray(headerItem.actionType) &&
                        headerItem.actionType.includes('sort'))
                        ? 'pointer'
                        : 'default',
                  }"
                >
                  {{ headerItem.label }}
                </span>

                <template
                  v-if="
                    headerItem.actionType === 'info' ||
                    (Array.isArray(headerItem.actionType) &&
                      headerItem.actionType.includes('info'))
                  "
                >
                  <el-tooltip
                    :content="headerItem.tip"
                    effect="light"
                    placement="top-start"
                  >
                    <i class="el-icon-question"></i>
                  </el-tooltip>
                </template>

                <template
                  v-if="
                    headerItem.actionType === 'search' ||
                    (Array.isArray(headerItem.actionType) &&
                      headerItem.actionType.includes('search'))
                  "
                >
                  <el-popover
                    placement="top-start"
                    width="300"
                    v-model="searchPoperVisible"
                  >
                    <div class="search-container">
                      <el-input
                        :ref="'searchInput' + headerItem.prop"
                        class="search-input"
                        v-model="searchData[headerItem.prop]"
                        size="mini"
                        clearable
                        placeholder="请输入"
                      >
                      </el-input>
                      <el-button
                        class="search-btn"
                        type="primary"
                        size="mini"
                        @click="handleSearch"
                        >搜索</el-button
                      >
                    </div>
                    <i
                      slot="reference"
                      class="el-icon-search"
                      @click="
                        handleSearchReferenceClick(
                          'searchInput' + headerItem.prop
                        )
                      "
                    ></i>
                  </el-popover>
                </template>

                <template
                  v-if="
                    headerItem.actionType === 'sort' ||
                    (Array.isArray(headerItem.actionType) &&
                      headerItem.actionType.includes('sort'))
                  "
                >
                  <span class="sort-container">
                    <span
                      class="el-icon-caret-top"
                      :class="{
                        'focus-sort':
                          filterData[headerItem.prop] === 'ascending',
                      }"
                      @click.stop="handleSort(headerItem, 'ascending')"
                    ></span>
                    <span
                      class="el-icon-caret-bottom"
                      :class="{
                        'focus-sort':
                          filterData[headerItem.prop] === 'descending',
                      }"
                      @click.stop="handleSort(headerItem, 'descending')"
                    ></span>
                  </span>
                </template>

                <template
                  v-if="
                    headerItem.actionType === 'filter' ||
                    (Array.isArray(headerItem.actionType) &&
                      headerItem.actionType.includes('filter'))
                  "
                >
                  <el-dropdown @command="handleSort(headerItem, $event)">
                    <span>
                      <svg-icon
                        icon-class="filter-fill"
                        size="14"
                        class="filter-icon"
                        :class="{
                          'filter-focus':
                            (!!filterData[headerItem.prop] ||
                              filterData[headerItem.prop] === 0 ||
                              filterData[headerItem.prop] === false) &&
                            !['null', 'all'].includes(
                              filterData[headerItem.prop]
                            ),
                        }"
                      ></svg-icon>
                    </span>

                    <el-dropdown-menu slot="dropdown">
                      <template
                        v-if="getTableFilterOptions(headerItem.prop).length > 0"
                      >
                        <template
                          v-for="(item, index) in getTableFilterOptions(
                            headerItem.prop
                          )"
                        >
                          <el-dropdown-item :command="item.value" :key="index">
                            <span
                              :class="{
                                'focus-drop-down-item':
                                  filterData[headerItem.prop] == item.value,
                              }"
                              :style="{
                                color:
                                  filterData[headerItem.prop] == item.value
                                    ? '#2d8cf0'
                                    : '',
                              }"
                            >
                              {{ item.label }}
                            </span>
                          </el-dropdown-item>
                        </template>
                      </template>

                      <template v-else>
                        <el-dropdown-item>
                          <span style="color: #8591a1"> 暂无数据 </span>
                        </el-dropdown-item>
                      </template>
                    </el-dropdown-menu>
                  </el-dropdown>
                </template>
              </div>
            </template>

            <template #default="scope">
              <div
                class="value-container"
                :style="{
                  'white-space':
                    contentTypeHandler(
                      headerItem.contentType,
                      scope.row,
                      headerItem
                    ) === 'tags'
                      ? 'pre-wrap'
                      : 'pre',
                }"
              >
                <template v-if="headerItem.isActionColumn">
                  <template v-for="(actionItem, aIndex) in headerItem.actions">
                    <template v-if="ifShow(actionItem, scope.row)">
                      <el-button
                        :type="actionItem.type || 'text'"
                        :key="aIndex"
                        :disabled="ifDisabled(actionItem, scope.row)"
                        :loading="
                          scope.row[actionItem.loadingRowTag] ||
                          scope.row[actionItem.name]
                        "
                        @click="handleAction(actionItem, scope.row, headerItem)"
                      >
                        {{
                          typeof actionItem.label === "function"
                            ? actionItem.label(scope.row)
                            : actionItem.label
                        }}
                      </el-button>
                    </template>
                  </template>
                </template>

                <template
                  v-else-if="
                    contentTypeHandler(
                      headerItem.contentType,
                      scope.row,
                      headerItem
                    ) === 'tags'
                  "
                >
                  <template v-if="Array.isArray(scope.row[headerItem.prop])">
                    <template
                      v-for="(tagItem, index) in scope.row[headerItem.prop]"
                    >
                      <el-tag
                        class="tag-item"
                        :key="index"
                        :type="
                          headerItem.tagType[tagItem] ||
                          headerItem.tagType.default
                        "
                      >
                        {{
                          getFormattedNumberOrText(
                            headerItem,
                            scope.row,
                            tagItem
                          )
                        }}
                      </el-tag>
                    </template>
                  </template>
                  <template v-else-if="scope.row[headerItem.prop]">
                    <template v-if="scope.row[headerItem.prop]">
                      <el-tag
                        :type="
                          headerItem.tagType[scope.row[headerItem.prop]] ||
                          headerItem.tagType.default
                        "
                      >
                        {{
                          getFormattedNumberOrText(
                            headerItem,
                            scope.row,
                            scope.row[headerItem.prop]
                          )
                        }}
                      </el-tag>
                    </template>
                    <template v-else>
                      <span>-</span>
                    </template>
                  </template>
                </template>

                <template
                  v-else-if="
                    contentTypeHandler(
                      headerItem.contentType,
                      scope.row,
                      headerItem
                    ) === 'component'
                  "
                >
                  <template
                    v-if="
                      componentHandler(
                        headerItem.contentComponent.handler,
                        scope.row,
                        headerItem
                      ) === 'select' && headerItem.contentComponent.options
                    "
                  >
                    <el-select
                      v-model="
                        scope.row[
                          headerItem.contentComponent.modelProp ||
                            headerItem.prop
                        ]
                      "
                      @change="
                        handleContentComponentEvent(
                          headerItem.contentComponent.onChange,
                          scope.row,
                          headerItem
                        )
                      "
                      value-key="value"
                      v-bind="
                        componentConfigHandler(
                          headerItem.contentComponent.config,
                          scope.row,
                          headerItem
                        )
                      "
                    >
                      <template
                        v-for="(optionItem, oIndex) in headerItem
                          .contentComponent.options"
                      >
                        <el-option
                          :key="oIndex"
                          :label="optionItem.label"
                          :value="optionItem"
                          :disabled="optionItem.disabled"
                        ></el-option>
                      </template>
                    </el-select>
                  </template>

                  <template
                    v-else-if="
                      componentHandler(
                        headerItem.contentComponent.handler,
                        scope.row,
                        headerItem
                      ) === 'input'
                    "
                  >
                    <el-input
                      v-model="
                        scope.row[
                          headerItem.contentComponent.modelProp ||
                            headerItem.prop
                        ]
                      "
                      @change="
                        handleContentComponentEvent(
                          headerItem.contentComponent.onChange,
                          scope.row,
                          headerItem
                        )
                      "
                    ></el-input>
                  </template>

                  <template v-else>
                    <span>{{ scope.row[headerItem.prop] }} </span>
                  </template>
                </template>

                <template
                  v-else-if="
                    (typeof headerItem.hasTooltip === 'function' &&
                      headerItem.hasTooltip(scope.row, headerItem)) ||
                    (typeof headerItem.hasTooltip === 'boolean' &&
                      headerItem.hasTooltip)
                  "
                >
                  <overflow-tip>
                    <template slot="content">
                      <div
                        class="tooltip-content-inner"
                        v-html="
                          getFormattedNumberOrText(
                            headerItem,
                            scope.row,
                            scope.row[headerItem.prop]
                          )
                        "
                      ></div>
                    </template>

                    <span
                      class="content-wrapper"
                      :class="{
                        'has-data':
                          scope.row[headerItem.prop] &&
                          contentTypeHandler(
                            headerItem.contentType,
                            scope.row,
                            headerItem
                          ) === 'data',
                      }"
                      @click="handleRowClick(scope.row, headerItem)"
                      v-html="
                        getFormattedNumberOrText(
                          headerItem,
                          scope.row,
                          scope.row[headerItem.prop]
                        )
                      "
                    >
                    </span>
                  </overflow-tip>
                  <!-- <el-tooltip placement="top-start" effect="light">
                    <div
                      slot="content"
                      class="tooltip-content-inner"
                      v-html="
                        getFormattedNumberOrText(
                          headerItem,
                          scope.row,
                          scope.row[headerItem.prop]
                        )
                      "
                    ></div>
                    <span
                      class="content-wrapper"
                      :class="{
                        'has-data':
                          scope.row[headerItem.prop] &&
                          contentTypeHandler(
                            headerItem.contentType,
                            scope.row,
                            headerItem
                          ) === 'data',
                      }"
                      @click="handleRowClick(scope.row, headerItem)"
                      v-html="
                        getFormattedNumberOrText(
                          headerItem,
                          scope.row,
                          scope.row[headerItem.prop]
                        )
                      "
                    >
                    </span>
                  </el-tooltip> -->
                </template>

                <template v-else>
                  <span
                    class="no-tooltip-content-wrapper"
                    :class="{
                      'has-data':
                        scope.row[headerItem.prop] &&
                        contentTypeHandler(
                          headerItem.contentType,
                          scope.row,
                          headerItem
                        ) === 'data',
                    }"
                    @click="handleRowClick(scope.row, headerItem)"
                    v-html="
                      getFormattedNumberOrText(
                        headerItem,
                        scope.row,
                        scope.row[headerItem.prop]
                      )
                    "
                  >
                  </span>
                </template>
              </div>
            </template>
          </vxe-table-column>
        </template>
      </template>
    </vxe-table>
    <!-- </template> -->
    <template v-if="hasPagination">
      <div class="pagination-container">
        <el-pagination
          class="pagination"
          layout="sizes,total,  prev, pager, next, jumper"
          background
          @current-change="handleChangePage"
          @size-change="handleSizeChange"
          :current-page.sync="pagerData.curPage"
          :page-size.sync="pagerData.pageSize"
          :total="pagerData.total"
        ></el-pagination>
      </div>
    </template>
  </div>
</template>
<script>
/**
 * @event getTableData 获取表格数据 payload: {pagerData ,tableFilter}
 * @event rowClick 点击表格的行 payload: row
 * @selectChange 表格有复选框时 触发的选中事件 payload: 选中的行
 */
import numeral from "numeral";
import { cloneObject } from "@/utils";
import overflowTip from "@/views/components/overflowTip/index.vue";
export default {
  name: "dynamicTable",
  props: {
    /**
     * 例如:
       [
          // 复选框组件
          {
            label: "",
            prop: "",
            width: "50px",
            actionType: "selection",

            ifDisabled(row) {
              return !row.perms.edit;
            },

            ifVisible(row) {
              return row.perms.edit;
            },
          },

          //展开行
          {
            width: "50px",
            actionType: "expand", // 展开行的内容配置在table的 slot中
          },

         {
          label: "发起时间",
          prop: "startTime",
          actionType: "sort", // sort 排序类型 , filter 选项过滤器  ,info: 文本提示 , search: 搜索框,
          contentType: "tags",  // tag标签:tags   格式化可点击数据: data
          tagType: {
            day: "success",
            hour: "primary",
            oneByOne: "warning",
            default: "primary",
          },

          width: "180px", // 宽度
          minWidth:"180px", // 最小宽度
          hasTooltip: false, // 是否有tooltip,  boolean || function (row,header){ return boolean }
         },
         {
          label: "操作",
          prop: "",
          width: "",

          isActionColumn: true, // 是否是操作列 查看、删除等



          *  @type: fn || string:
          *
          * @values:
          *
          * 1.tag标签:'tags'
          * 2.格式化可点击数据: 'data' (header.numberFormat设置具体的numeral格式)
          * 3.组件: 'component'
          *
          *

          contentType() {
            return !this.hasAuditPerm ? "tags" : "component";
          },

          //内容组件, 设置content 支持 select input (使用coponent需先指定contentType为 'component')
          contentComponent: {
            handler(row, header) {
              if (row.inEditing) {

                 // this 指向自身
                return "select";
              }
            },

            modelProp: "rolesData",

            //组件配置项
            config(row) {
              return {
                // multiple: true,
                filterable: true,
                disabled: row.committing,
                "value-key": "value",
              };
            },

            onChange(row) {
              row.roles = row.rolesData.label;
            },

            // select 组件的options
            options: [],
          },
          actions: [
            {
                name: "cancel",  // 操作过程使用手动设置loading的情况 $set(row,'cancel',true)
                loadingRowTag: "", // 操作过程自动loading设置任意值
                //函数或字符串
                type:'', // element-ui 按钮类型 primary / success / warning / danger / info / text
                label(row) {
                   // this指向dynamic-table的父组件
                  return "取消";
                },

                ifShow(row) {
                   // this指向dynamic-table的父组件
                  return row.inEditing;
                },

                ifDisabled(row) {
                   // this指向dynamic-table的父组件
                  return false;
                },

                action(row) {
                   // this指向dynamic-table的父组件
                  return this.handleCancel(row);
                },
            },

            {
              name: "cancel",  // 操作过程使用手动设置loading的情况 $set(row,'cancel',true)
              label: "下载",  // 名称
              loadingRowTag: "", // 操作过程自动loading设置任意值
              ifShow: (row) => {  // 计算是否显示
                // this指向dynamic-table的父组件
                return true;
              },
              ifDisabled: (row) => {  // 计算disabled
               // this指向dynamic-table的父组件
                return false;
              },
              action: (row) => {      // 操作动作
                // this指向dynamic-table的父组件
                return new Promise()

              },
            },
          ],
         },
        ],
     */

    dimension: {
      type: Array,
      default() {
        return [];
      },
    },

    source: {
      type: Array,
      default() {
        return [];
      },
    },

    /**
    {
        curPage: 1,
        pageSize: 10,
        total: 0,
    }
   */
    pager: {
      type: Object,
      default() {
        return null;
      },
    },

    filter: {
      type: Object,
      default() {
        return null;
      },
    },

    // 过滤选项数据
    filterOptions: {
      type: Object,
      default() {
        return null;
      },
    },

    search: {
      type: Object,
      default() {
        return null;
      },
    },

    loading: {
      type: Boolean,
      default: false,
    },

    height: {
      type: [Number, String], // number auto px %
      default: "auto",
    },

    maxHeight: {
      type: [Number, String], // number auto px %
      default: "",
    },

    // Function param header: 表头对象
    // Function param content: 表格内容str
    // @return {String} 返回处理后的content
    contentHandler: {
      type: Function,
      default: null,
    },

    expandContentHandler: {
      type: Function,
      default: null,
    },

    hasPagination: {
      type: Boolean,
      default: true,
    },

    // 选中的 table Checkbox
    selections: {
      type: Array,
      default() {
        return [];
      },
    },

    // 只允许单独一个排序列: "single" ,  允许多个排序列: "multiple"
    sortMode: {
      type: String,
      default: "multiple",
    },

    parentRef: {
      type: String,
      default: "",
    },
  },
  components: {
    overflowTip,
  },
  data() {
    return {
      currentRow: {},
      visible: true,
      filterOptionsData: {},
      filterData: {},
      searchData: {},

      pagerData: {
        curPage: 1,
        pageSize: 10,
        total: 0,
      },

      searchPoperVisible: false,
    };
  },
  watch: {
    pager: {
      immediate: true,
      handler(val) {
        if (val) {
          this.pagerData = val;
        }
      },
    },
    filter: {
      immediate: true,
      handler(val) {
        if (val) {
          this.filterData = val;
        }
      },
    },
    search: {
      immediate: true,
      handler(val) {
        if (val) {
          this.searchData = cloneObject(val);
        }
      },
    },

    filterOptions: {
      immediate: true,
      handler(val) {
        if (val) {
          this.filterOptionsData = val;
        }
      },
    },

    selections: {
      handler(val) {
        if (Array.isArray(val)) {
          this.setCheckBoxSelectedStatus(val);
        }
      },
    },
  },

  methods: {
    handleTableScroll() {
      this.searchPoperVisible = false;
    },

    handleSearchReferenceClick(inputRef) {
      setTimeout(() => {
        this.$refs[inputRef][0].focus();
      }, 500);
    },
    //确定搜索
    handleSearch() {
      this.getTableData();
    },

    componentHandler(fn, row, header) {
      return fn.call(this.$parent, row, header);
    },

    componentConfigHandler(fn, row, header) {
      return fn.call(this.$parent, row, header);
    },

    handleContentComponentEvent(event, row, headerItem) {
      event.call(this.$parent, row, headerItem);
    },

    contentTypeHandler(contentType, row, header) {
      if (typeof contentType === "function") {
        return contentType.call(this.$parent, row, header);
      } else {
        return contentType;
      }
    },

    // checkbox 是否非disabled状态
    ifCheckBoxCheckable({ row }) {
      if (
        this.dimension.length > 0 &&
        this.dimension[0]?.actionType === "selection"
      ) {
        const headerItem = this.dimension[0];
        if (typeof headerItem.ifDisabled === "function") {
          return !headerItem.ifDisabled.call(this.$parent, row);
        }
      }

      return true;
    },

    // checkbox是否可见
    ifCheckBoxVisible({ row }) {
      if (
        this.dimension.length > 0 &&
        this.dimension[0]?.actionType === "selection"
      ) {
        const headerItem = this.dimension[0];
        if (typeof headerItem.ifVisible === "function") {
          return headerItem.ifVisible.call(this.$parent, row);
        }
      }

      return true;
    },

    setCheckBoxSelectedStatus() {
      if (
        Array.isArray(this.dimension) &&
        this.dimension[0]?.actionType === "selection"
      ) {
        this.$refs.xTable.clearCheckboxRow();
        this.$refs.xTable.setCheckboxRow(this.selections, true);
      }
    },

    selectAllEvent({ checked }) {
      const checkedRecords = this.$refs.xTable.getCheckboxRecords();
      this.$emit("selectChange", checkedRecords);
    },

    selectChangeEvent({ checked }) {
      const checkedRecords = this.$refs.xTable.getCheckboxRecords();
      this.$emit("selectChange", checkedRecords);
    },

    numeral,

    ifShow(actionItem, row) {
      if (typeof actionItem.ifShow === "function") {
        return actionItem.ifShow.call(this.$parent, row);
      }
    },

    ifDisabled(actionItem, row) {
      if (typeof actionItem.ifDisabled === "function") {
        return actionItem.ifDisabled.call(this.$parent, row);
      }
    },

    async handleAction(actionItem, row, header) {
      if (typeof actionItem.action === "function") {
        if (actionItem.loadingRowTag) {
          this.$set(row, actionItem.loadingRowTag, true);
        }

        await actionItem.action.call(this.$parent, row, header);

        if (actionItem.loadingRowTag) {
          this.$set(row, actionItem.loadingRowTag, false);
        }
      }
    },

    handleChangePage() {
      this.getTableData();
    },

    handleSizeChange() {
      this.pagerData.curPage = 1;
      this.getTableData();
    },

    //api获取更多详情数据
    getTableData() {
      const filter = {};
      for (let prop in this.filterData) {
        if (this.filterData[prop] !== "none") {
          filter[prop] = this.filterData[prop];
        }
      }
      const payload = {
        pager: this.pagerData,
        filter: filter,
        search: this.searchData,
      };

      this.$emit("getTableData", payload);
    },

    getTableFilterOptions(prop) {
      return this.filterOptionsData[prop] || [];
    },

    handleHeaderClick(headerItem) {
      // 处理sort类型,点击标题进行排序
      const isSortableHeader =
        headerItem.actionType === "sort" ||
        (Array.isArray(headerItem.actionType) &&
          headerItem.actionType.includes("sort"));

      const prop = headerItem.prop;

      if (isSortableHeader) {
        // 如果是只能使用单个排序,则只保留当前这个排序设置
        if (isSortableHeader && this.sortMode === "single") {
          this.keepOneSortFilter(prop);
        }
        // 切换状态
        const statusDict = {
          ascending: "descending",
          descending: "none",
          none: "ascending",
        };

        if (this.filterData[prop]) {
          const nextSort = statusDict[this.filterData[prop]];
          this.$set(this.filterData, prop, nextSort);
        } else {
          this.$set(this.filterData, prop, "ascending");
        }
        this.getTableData();
      }
    },

    //处理table分类操作
    handleSort(headerItem, value) {
      const prop = headerItem.prop;

      const isSortableHeader =
        headerItem.actionType === "sort" ||
        (Array.isArray(headerItem.actionType) &&
          headerItem.actionType.includes("sort"));

      // 如果是只能使用单个排序,则只保留当前这个排序设置
      if (isSortableHeader && this.sortMode === "single") {
        this.keepOneSortFilter(prop);
      }

      if (isSortableHeader && value === this.filterData[prop]) {
        //重复点击取消选中状态
        this.$set(this.filterData, prop, "");
      } else {
        this.$set(this.filterData, prop, value);
      }

      this.getTableData();
    },

    keepOneSortFilter(prop) {
      const allSortTypesProps = this.dimension
        .filter((item) => {
          return (
            item.actionType === "sort" ||
            (Array.isArray(item.actionType) && item.actionType.includes("sort"))
          );
        })
        .map((item) => item.prop);

      allSortTypesProps.forEach((propItem) => {
        if (propItem !== prop) {
          delete this.filterData[propItem];
        }
      });
    },

    //点击表格
    handleRowClick(row, headerItem) {
      this.$emit("rowClick", { row, header: headerItem });
    },

    setTableHeight() {
      window.addEventListener(
        "resize",
        () => {
          if (this.$refs["container"]) {
            this.tableHeight =
              this.$refs["container"].getBoundingClientRect().height - 80;
          }
        },
        false
      );

      this.$nextTick(() => {
        if (this.$refs["container"]) {
          this.tableHeight =
            this.$refs["container"].getBoundingClientRect().height - 80;
        }
      });
    },

    getFormattedNumberOrText(header, row, content) {
      //let content = contentValue || scope.row[headerItem.prop];

      if (typeof this.contentHandler === "function") {
        content = this.contentHandler(header, content);
      }

      // 下划线可点击的data
      if (
        this.contentTypeHandler(header.contentType, row, header) === "data" &&
        typeof content === "number"
      ) {
        return header.numberFormat
          ? numeral(content).format(header.numberFormat)
          : content;
      }

      // 其他类型的数据包括number
      if (typeof content === "undefined" || content === null) {
        return "-";
      } else {
        return content;
      }
    },
  },

  mounted() {
    this.setTableHeight();

    //设置选中的项
    if (Array.isArray(this.selections)) {
      this.setCheckBoxSelectedStatus(this.selections);
    }
    // this.getTableData();
  },
};
</script>
<style lang="scss" scoped>
@import "@/styles/index.scss";

.expand-content-container {
  white-space: pre-wrap;
  font-size: 14px;
}

.search-container {
  .search-input {
    width: 200px;
  }

  .search-btn {
    margin-left: 5px;
  }
}

.tag-item {
  margin: 0 0 5px 5px;
}

.content-wrapper {
  // display: inline-block;
  // overflow: hidden;
  // text-overflow: ellipsis;
  // white-space: nowrap;

  // width: 100%;
}

.has-data {
  text-decoration: underline;
  cursor: pointer;
}

.no-tooltip-content-wrapper {
  display: inline-block;
  width: 100%;
  word-break: break-all;
  white-space: initial;
}

.tooltip-content-inner {
  max-width: 400px;
  max-height: 300px;
  overflow-y: auto;
}

.dynamic-table-container {
  height: 100%;
  min-height: 50px;
  width: 100%;

  .pagination-container {
    padding: 15px;
    text-align: center;
    overflow-x: auto;
  }

  .value-container {
    width: 100%;

    white-space: pre;
    text-overflow: ellipsis;
    overflow: hidden;
  }

  .focus-drop-down-item {
    color: $color-primary;
  }

  .focus-sort {
    color: $color-primary;
  }

  .sortable-header {
    display: flex;
    align-items: center;
    justify-content: flex-start;

    .el-icon-search {
      margin-left: 3px;
      cursor: pointer;
    }

    .el-icon-question {
      margin-left: 3px;
    }

    .sort-container {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      flex-direction: column;

      & > span {
        &:hover {
          color: $color-primary;
        }
      }

      .el-icon-caret-top {
        line-height: 5px;
        margin-bottom: 2px;
      }

      .el-icon-caret-bottom {
        line-height: 5px;
      }

      .filter-container {
        vertical-align: middle;
      }
    }

    .filter-icon {
      vertical-align: -2px;
      margin-left: 2px;
      cursor: pointer;
      color: #909399;

      &.filter-focus {
        color: $color-primary;
      }
    }
  }
}
</style>
