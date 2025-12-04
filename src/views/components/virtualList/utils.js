export const HeightManager = {
  groupStep: 10,
  start: 0, // 数据终止位置
  step: 2, // 每次增加的步数

  heights: [],
  groupHeights: [],

  startPos: 0, // 下一次计算groupHeight的起点

  initHeightStore(nodes) {
    this.setHeights(nodes);
    this.setGroupHeights();
  },

  // 获取当前展示区域的起始位置
  getStartPosition(spaceHeight) {
    const heights = this.heights;
    const heightLength = this.heights.length;
    if (heightLength > 500) {
      let { index: groupIndex, preSum: sum } = this.getGroupIndex(spaceHeight);

      // group之后继续加法
      const heightStartIndex = groupIndex * this.groupStep;
      const len = (heightStartIndex + 1) * this.groupStep;

      for (let i = heightStartIndex; i < len; i++) {
        const h = heights[i];
        sum += h;
        if (sum === spaceHeight) {
          return heightStartIndex + i + 1;
        }
      }
    } else {
      return this.getHeightsIndex(spaceHeight);
    }
  },

  getGroupIndex(spaceHeight) {
    let sum = 0;
    for (let i = 0, len = this.groupHeights.length; i < len; i++) {
      sum += this.groupHeights[i];
      if (sum > spaceHeight) {
        return {
          index: i,
          preSum: i === 0 ? 0 : sum - this.groupHeights[i],
        };
      }
    }
  },

  // 获取当前滚动项的位置
  getHeightIndex(spaceHeight) {
    let heights = this.heights;
    let sum = 0;
    for (let i = 0, len = heights.length; i < len; i++) {
      sum += heights[i];
      if (sum === spaceHeight) {
        return i + 1;
      }
    }
    return 0;
  },

  setGroupHeights() {
    let sum = 0;

    const groupHeightLen = this.groupHeights.length;

    // 最后一个项可能是不足10个数的和 所以从新计算满足10个的数据
    if (groupHeightLen > 0) {
      this.groupHeights.pop();
      const restLength = this.groupHeights.length;
      this.startPos = restLength * this.step;
    }

    for (let i = this.startPos, len = this.heights.length; i < len; i++) {
      const index = i;
      const item = this.heights[i];

      sum += item;
      if ((index - this.startPos) % 10 === 0 && index !== len - 1) {
        this.groupHeights.push(sum);
        sum = 0;
      } else if (index === len - 1) {
        this.groupHeights.push(sum);
      }
    }
  },

  setHeights(nodes) {
    this.tmpHeights = Array.from(nodes).map((node) => {
      return node.offsetHeight;
    });

    this.heights = this.heights.concat(this.tmpHeights);
  },
};
