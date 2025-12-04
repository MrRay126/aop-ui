module.exports = function(app) {
  const express = require('express');
  app.use(express.json());
  function ok(data) { return { code: 0, data, message: '' }; }
  function rand(min, max) { return Math.floor(Math.random() * (max - min + 1)) + min; }
  function dateList(n) {
    const now = new Date();
    const arr = [];
    for (let i = n - 1; i >= 0; i--) {
      const d = new Date(now.getTime() - i * 24 * 60 * 60 * 1000);
      const s = `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`;
      arr.push(s);
    }
    return arr;
  }
  app.post('/api/silver-palace/statistics', (req, res) => {
    function item(name, min, max) {
      return { name, value: rand(min, max), wow: rand(-20, 20), dod: rand(-10, 10) };
    }
    const data = [
      item('内容总量', 1500, 5000),
      item('一级贴文', 800, 2000),
      item('总曝光', 100000, 500000),
      item('评论量', 5000, 20000),
      item('互动量', 15000, 60000),
      item('正向内容总量', 500, 2000),
      item('负向内容总量', 400, 1800),
      item('中性内容总量', 600, 2200),
      item('正负向占比', 30, 70),
    ];
    res.json(ok(data));
  });
  app.post('/api/silver-palace/trend', (req, res) => {
    const times = dateList(30);
    const source = times.map(t => ({
      time: t,
      曝光: rand(1000, 10000),
      互动量: rand(300, 3000),
      评论量: rand(100, 1200),
      正向: rand(50, 600),
      负向: rand(40, 500),
      中性: rand(60, 700),
    }));
    res.json(ok({ dimensions: ['time', '曝光', '互动量', '评论量', '正向', '负向', '中性'], source }));
  });
  app.post('/api/silver-palace/contents', (req, res) => {
    const list = Array.from({ length: 10 }).map((_, i) => {
      const channels = ['微博', 'B站', '知乎', '抖音', '小红书'];
      const ch = channels[rand(0, channels.length - 1)];
      const sentiments = [
        { label: '正向', value: 'positive' },
        { label: '负向', value: 'negative' },
        { label: '中性', value: 'neutral' },
      ];
      const s = sentiments[rand(0, 2)];
      const d = new Date(Date.now() - rand(0, 20) * 86400000);
      const publishTime = `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')} ${String(d.getHours()).padStart(2,'0')}:${String(d.getMinutes()).padStart(2,'0')}:00`;
      return {
        id: `sp-${Date.now()}-${i}`,
        channel: ch,
        content: '示例TOP内容文案片段...',
        publishTime,
        exposure: rand(5000, 200000),
        commentsCount: rand(50, 2000),
        interactions: rand(200, 8000),
        sentiment: s.value,
        sentimentLabel: s.label,
        link: 'https://www.example.com/content/' + i,
      };
    });
    res.json(ok({ list, pager: { curPage: 1, pageSize: 10, total: 200 } }));
  });
};
