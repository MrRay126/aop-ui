import { getLabelvalueList, getLabelMap } from "@/utils";

export const types = {
  0: "评论趋势",
  1: "转发趋势",
  2: "评论词云",
  3: "转发词云",
  4: "传播分析",
};

export const typeMapCn = getLabelMap(types, true);
export const typesList = getLabelvalueList(types, true);
