<template>
  <dynamic-table
    border
    :height="height"
    :dimension="dimension"
    :source="tableSource"
    :loading="loading"
  >
    <template v-slot:expand="{ row }">
      <div class="comments-container">
        <div class="comments-toolbar">
          <el-button size="mini" @click="loadComments(row)">加载评论</el-button>
        </div>
        <div class="comment-item" v-for="c in (commentsById[row.id] || [])" :key="c.id">
          <el-avatar class="avatar" :size="24">{{ (c.author || '')[0] || 'U' }}</el-avatar>
          <div class="comment-body">
            <div class="text">{{ c.content }}</div>
            <div class="trans" v-if="translateOn && showTranslation">
              <span class="trans-tag">译</span>
              <span class="trans-text">{{ c.translation }}</span>
            </div>
          </div>
        </div>
        <div class="comments-pager" v-if="commentsPager[row.id]">
          <el-pagination
            layout="prev, pager, next"
            small
            :total="commentsPager[row.id].total"
            :page-size="commentsPager[row.id].pageSize"
            :current-page="commentsPager[row.id].curPage"
            @current-change="changeCommentsPage(row, $event)"
          ></el-pagination>
        </div>
      </div>
    </template>
  </dynamic-table>
</template>
<script>
import dynamicTable from "@/views/components/dynamicTable";
export default {
  props: {
    source: { type: Array, default: () => [] },
    loading: { type: Boolean, default: false },
    height: { type: Number, default: 380 },
    translateOn: { type: Boolean, default: false },
    showTranslation: { type: Boolean, default: false },
  },
  components: { dynamicTable },
  data() {
    return {
      dimension: [
        { width: "50px", actionType: "expand" },
        { label: "内容", prop: "contentHtml", minWidth: "300px" },
        { label: "发布时间", prop: "publishTime", width: "160px" },
        { label: "赞同", prop: "voteups", width: "100px" },
        { label: "评论", prop: "commentsCount", width: "100px" },
      ],
      commentsPager: {},
      commentsById: {},
    };
  },
  computed: {
    tableSource() {
      return (this.source || []).map((item) => {
        const icon = `<i class=\"el-icon-link\" style=\"color:#409EFF;margin-right:6px;\"></i>`;
        const link = item.link ? `<a href=\"${item.link}\" target=\"_blank\" style=\"color:#409EFF;\">原文</a>` : '';
        const trans = this.translateOn && this.showTranslation && item.translation ? `<div style=\"color:#8591a1;margin-top:4px;\">${item.translation}</div>` : '';
        return { ...item, contentHtml: `${icon}${link} ${item.content || ''}${trans}` };
      });
    },
  },
  methods: {
    mockComments(id, pager) {
      const pageSize = (pager && pager.pageSize) ? pager.pageSize : 5;
      const curPage = (pager && pager.curPage) ? pager.curPage : 1;
      const total = 12;
      const list = Array.from({ length: pageSize }).map((_, idx) => {
        const content = `评论 ${id}-${curPage}-${idx}`;
        return { id: `${id}-${curPage}-${idx}`, content, translation: `[译] ${content}`, author: `U${idx}` };
      });
      return { list, pager: { curPage, pageSize, total } };
    },
    loadComments(row) {
      try {
        if (!row || !row.id) return;
        const pager = this.commentsPager[row.id] || { curPage: 1, pageSize: 5, total: 0 };
        const data = this.mockComments(row.id, pager);
        this.$set(this.commentsById, row.id, data.list);
        this.$set(this.commentsPager, row.id, data.pager);
      } catch (e) {
        console.error('loadComments error', e);
      }
    },
    changeCommentsPage(row, curPage) {
      try {
        if (!row || !row.id) return;
        const base = this.commentsPager[row.id] || { pageSize: 5, curPage: 1, total: 0 };
        const pager = Object.assign({}, base, { curPage });
        this.$set(this.commentsPager, row.id, pager);
        this.loadComments(row);
      } catch (e) {
        console.error('changeCommentsPage error', e);
      }
    },
  },
};
</script>
<style scoped>
.comments-container{padding:12px;border:1px solid #ebeef5;border-radius:6px;background:#f9fafb}
.comments-toolbar{display:flex;justify-content:flex-end;margin-bottom:8px}
.comment-item{display:flex;gap:8px;padding:10px 0;border-bottom:1px solid #f0f0f0}
.comment-item:last-child{border-bottom:none}
.avatar{background:#409EFF;color:#fff}
.comment-body{flex:1}
.comment-body .text{font-size:13px;line-height:1.6;color:#42546d}
.comment-body .trans{margin-top:6px;padding:6px 8px;background:#fff;border-left:3px solid #2d8cf0;border-radius:4px}
.trans-tag{display:inline-block;font-size:12px;color:#2d8cf0;margin-right:6px}
.trans-text{font-size:12px;color:#8591a1}
.comments-pager{border-top:1px solid #f0f0f0;margin-top:10px;padding-top:8px;display:flex;justify-content:flex-end}
</style>
