<template>
  <div class="custom-silver-palace" v-loading="loading">
    <div class="filter-container">
      <time-calendar
        :timeData="time"
        :isTextTypeReference="false"
        :isAutoTriggerApplyTimeEvent="false"
        @applyTime="handleTimeChange"
      ></time-calendar>
      <el-select
        size="mini"
        placeholder="渠道筛选"
        v-model="channel"
        multiple
        filterable
        clearable
        collapseTags
        style="width: 240px"
        @change="handleFilterChange"
      >
        <el-option
          v-for="item in channelOptions"
          :key="item.value"
          :label="item.label"
          :value="item.value"
        ></el-option>
      </el-select>
      <el-select
        size="mini"
        v-model="languages"
        multiple
        filterable
        clearable
        style="width: 240px"
        placeholder="语言筛选"
        @change="handleFilterChange"
      >
        <el-option
          v-for="item in languageOptions"
          :key="item.value"
          :label="item.label"
          :value="item.value"
        ></el-option>
      </el-select>
      <el-select
        size="mini"
        v-model="sentiments"
        clearable
        style="width: 240px"
        placeholder="数据口径"
        @change="handleFilterChange"
      >
        <el-option v-for="item in sentimentOptions" :key="item.value" :label="item.label" :value="item.value"></el-option>
      </el-select>
      <el-button icon="el-icon-search" size="mini" type="primary" @click="handleSearch">搜索</el-button>
      <el-button icon="el-icon-refresh" size="mini" @click="handleRefreshMock">刷新</el-button>
    </div>

    <div class="statistics-container" v-loading="cardLoading">
      <div class="mini-grid">
        <div class="mini-col" v-for="(item, index) in statisticsData" :key="index">
          <metrics-mini-card :name="item.name" :value="item.value" :wow="item.wow || 0" :dod="item.dod || 0" />
        </div>
    
      </div>
    </div>

    <div class="chart-card">
      <div class="card-header">
        <span class="card-title">热度趋势折线图</span>
      </div>
      <div class="card-body">
        <line-chart
          v-loading="trendLoading"
          :height="400"
          :chartData="trendChartData"
          :needShadowLine="true"
          :needSmoothLine="false"
          :hasLegend="true"
        ></line-chart>
      </div>
    </div>

    <div class="table-card">
      <div class="card-header">
        <span class="card-title">平台TOP内容</span>
      </div>
      <div class="card-body platform-top">
        <div class="platform-toolbar">
          <el-button size="mini" @click="toggleAllCollapse(false)">展开全部</el-button>
          <el-button size="mini" @click="toggleAllCollapse(true)">折叠全部</el-button>
          <el-button size="mini" type="primary" @click="translateAll()">一键翻译</el-button>
          <el-button size="mini" @click="toggleShowTranslation()">{{ showTranslationAll ? '隐藏译文' : '显示译文' }}</el-button>
        </div>
        <div v-if="groupedTop.weibo.length" class="platform-card">
          <template v-if="!collapsed.weibo">
            <div class="section-header">
              <span class="sub-title">微博</span>
              <el-tag size="mini" type="info" effect="plain">共 {{ groupedTop.weibo.length }} 条</el-tag>
              <div class="section-actions">
                <el-button size="mini" @click="toggleCollapse('weibo')">{{ collapsed.weibo ? '展开' : '折叠' }}</el-button>
                <el-button size="mini" type="primary" @click="translatePlatform('weibo')">一键翻译</el-button>
                <el-button size="mini" @click="toggleShowTranslation('weibo')">{{ showTranslation.weibo ? '隐藏译文' : '显示译文' }}</el-button>
              </div>
            </div>
            <div>
              <top-weibo :source="groupedTop.weibo" :loading="isLoadingTable" :height="360" :translateOn="translateOn.weibo" :showTranslation="showTranslation.weibo" />
            </div>
          </template>
          <template v-else>
            <div class="collapse-header">
              <div class="collapse-title">
                <span class="name">微博</span>
                <span class="total">共 {{ groupedTop.weibo.length }} 条</span>
              </div>
              <i class="el-icon-arrow-down" @click="toggleCollapse('weibo')"></i>
            </div>
            <div class="collapse-summary">
              <div class="summary-item">
                <i class="el-icon-document"></i>
                <div class="label">总帖子数</div>
                <div class="value">{{ groupedTop.weibo.length }}</div>
              </div>
              <div class="summary-item">
                <i class="el-icon-message"></i>
                <div class="label">总评论数</div>
                <div class="value">{{ sumBy(groupedTop.weibo, 'commentsCount') }}</div>
              </div>
            </div>
          </template>
        </div>

        <div v-if="groupedTop.bilibili.length" class="platform-card">
          <template v-if="!collapsed.bilibili">
            <div class="section-header">
              <span class="sub-title">B站</span>
              <el-tag size="mini" type="info" effect="plain">共 {{ groupedTop.bilibili.length }} 条</el-tag>
              <div class="section-actions">
                <el-button size="mini" @click="toggleCollapse('bilibili')">{{ collapsed.bilibili ? '展开' : '折叠' }}</el-button>
                <el-button size="mini" type="primary" @click="translatePlatform('bilibili')">一键翻译</el-button>
                <el-button size="mini" @click="toggleShowTranslation('bilibili')">{{ showTranslation.bilibili ? '隐藏译文' : '显示译文' }}</el-button>
              </div>
            </div>
            <div>
              <top-bilibili :source="groupedTop.bilibili" :loading="isLoadingTable" :height="360" :translateOn="translateOn.bilibili" :showTranslation="showTranslation.bilibili" />
            </div>
          </template>
          <template v-else>
            <div class="collapse-header">
              <div class="collapse-title">
                <span class="name">B站</span>
                <span class="total">共 {{ groupedTop.bilibili.length }} 条</span>
              </div>
              <i class="el-icon-arrow-down" @click="toggleCollapse('bilibili')"></i>
            </div>
            <div class="collapse-summary">
              <div class="summary-item">
                <i class="el-icon-document"></i>
                <div class="label">总帖子数</div>
                <div class="value">{{ groupedTop.bilibili.length }}</div>
              </div>
              <div class="summary-item">
                <i class="el-icon-message"></i>
                <div class="label">总评论数</div>
                <div class="value">{{ sumBy(groupedTop.bilibili, 'commentsCount') }}</div>
              </div>
            </div>
          </template>
        </div>

        <div v-if="groupedTop.zhihu.length" class="platform-card">
          <template v-if="!collapsed.zhihu">
            <div class="section-header">
              <span class="sub-title">知乎</span>
              <el-tag size="mini" type="info" effect="plain">共 {{ groupedTop.zhihu.length }} 条</el-tag>
              <div class="section-actions">
                <el-button size="mini" @click="toggleCollapse('zhihu')">{{ collapsed.zhihu ? '展开' : '折叠' }}</el-button>
                <el-button size="mini" type="primary" @click="translatePlatform('zhihu')">一键翻译</el-button>
                <el-button size="mini" @click="toggleShowTranslation('zhihu')">{{ showTranslation.zhihu ? '隐藏译文' : '显示译文' }}</el-button>
              </div>
            </div>
            <div>
              <top-zhihu :source="groupedTop.zhihu" :loading="isLoadingTable" :height="360" :translateOn="translateOn.zhihu" :showTranslation="showTranslation.zhihu" />
            </div>
          </template>
          <template v-else>
            <div class="collapse-header">
              <div class="collapse-title">
                <span class="name">知乎</span>
                <span class="total">共 {{ groupedTop.zhihu.length }} 条</span>
              </div>
              <i class="el-icon-arrow-down" @click="toggleCollapse('zhihu')"></i>
            </div>
            <div class="collapse-summary">
              <div class="summary-item">
                <i class="el-icon-document"></i>
                <div class="label">总帖子数</div>
                <div class="value">{{ groupedTop.zhihu.length }}</div>
              </div>
              <div class="summary-item">
                <i class="el-icon-message"></i>
                <div class="label">总评论数</div>
                <div class="value">{{ sumBy(groupedTop.zhihu, 'commentsCount') }}</div>
              </div>
            </div>
          </template>
        </div>

        <div v-if="groupedTop.douyin.length" class="platform-card">
          <template v-if="!collapsed.douyin">
            <div class="section-header">
              <span class="sub-title">抖音</span>
              <el-tag size="mini" type="info" effect="plain">共 {{ groupedTop.douyin.length }} 条</el-tag>
              <div class="section-actions">
                <el-button size="mini" @click="toggleCollapse('douyin')">{{ collapsed.douyin ? '展开' : '折叠' }}</el-button>
                <el-button size="mini" type="primary" @click="translatePlatform('douyin')">一键翻译</el-button>
                <el-button size="mini" @click="toggleShowTranslation('douyin')">{{ showTranslation.douyin ? '隐藏译文' : '显示译文' }}</el-button>
              </div>
            </div>
            <div>
              <top-douyin :source="groupedTop.douyin" :loading="isLoadingTable" :height="360" :translateOn="translateOn.douyin" :showTranslation="showTranslation.douyin" />
            </div>
          </template>
          <template v-else>
            <div class="collapse-header">
              <div class="collapse-title">
                <span class="name">抖音</span>
                <span class="total">共 {{ groupedTop.douyin.length }} 条</span>
              </div>
              <i class="el-icon-arrow-down" @click="toggleCollapse('douyin')"></i>
            </div>
            <div class="collapse-summary">
              <div class="summary-item">
                <i class="el-icon-document"></i>
                <div class="label">总帖子数</div>
                <div class="value">{{ groupedTop.douyin.length }}</div>
              </div>
              <div class="summary-item">
                <i class="el-icon-message"></i>
                <div class="label">总评论数</div>
                <div class="value">{{ sumBy(groupedTop.douyin, 'commentsCount') }}</div>
              </div>
            </div>
          </template>
        </div>

        <div v-if="groupedTop.xhs.length" class="platform-card">
          <template v-if="!collapsed.xhs">
            <div class="section-header">
              <span class="sub-title">小红书</span>
              <el-tag size="mini" type="info" effect="plain">共 {{ groupedTop.xhs.length }} 条</el-tag>
              <div class="section-actions">
                <el-button size="mini" @click="toggleCollapse('xhs')">{{ collapsed.xhs ? '展开' : '折叠' }}</el-button>
                <el-button size="mini" type="primary" @click="translatePlatform('xhs')">一键翻译</el-button>
                <el-button size="mini" @click="toggleShowTranslation('xhs')">{{ showTranslation.xhs ? '隐藏译文' : '显示译文' }}</el-button>
              </div>
            </div>
            <div>
              <top-xhs :source="groupedTop.xhs" :loading="isLoadingTable" :height="360" :translateOn="translateOn.xhs" :showTranslation="showTranslation.xhs" />
            </div>
          </template>
          <template v-else>
            <div class="collapse-header">
              <div class="collapse-title">
                <span class="name">小红书</span>
                <span class="total">共 {{ groupedTop.xhs.length }} 条</span>
              </div>
              <i class="el-icon-arrow-down" @click="toggleCollapse('xhs')"></i>
            </div>
            <div class="collapse-summary">
              <div class="summary-item">
                <i class="el-icon-document"></i>
                <div class="label">总帖子数</div>
                <div class="value">{{ groupedTop.xhs.length }}</div>
              </div>
              <div class="summary-item">
                <i class="el-icon-message"></i>
                <div class="label">总评论数</div>
                <div class="value">{{ sumBy(groupedTop.xhs, 'commentsCount') }}</div>
              </div>
            </div>
          </template>
        </div>
            <div v-if="groupedTop.X.length" class="platform-card">
          <template v-if="!collapsed.X">
            <div class="section-header">
              <span class="sub-title">X</span>
              <el-tag size="mini" type="info" effect="plain">共 {{ groupedTop.X.length }} 条</el-tag>
              <div class="section-actions">
                <el-button size="mini" @click="toggleCollapse('X')">{{ collapsed.X ? '展开' : '折叠' }}</el-button>
                <el-button size="mini" type="primary" @click="translatePlatform('X')">一键翻译</el-button>
                <el-button size="mini" @click="toggleShowTranslation('X')">{{ showTranslation.X ? '隐藏译文' : '显示译文' }}</el-button>
              </div>
            </div>
            <div>
              <top-x :source="groupedTop.X" :loading="isLoadingTable" :height="360" :translateOn="translateOn.X" :showTranslation="showTranslation.X" />
            </div>
          </template>
          <template v-else>
            <div class="collapse-header">
              <div class="collapse-title">
                <span class="name">X</span>
                <span class="total">共 {{ groupedTop.X.length }} 条</span>
              </div>
              <i class="el-icon-arrow-down" @click="toggleCollapse('X')"></i>
            </div>
            <div class="collapse-summary">
              <div class="summary-item">
                <i class="el-icon-document"></i>
                <div class="label">总帖子数</div>
                <div class="value">{{ groupedTop.X.length }}</div>
              </div>
              <div class="summary-item">
                <i class="el-icon-message"></i>
                <div class="label">总评论数</div>
                <div class="value">{{ sumBy(groupedTop.X, 'repliesCount') }}</div>
              </div>
            </div>
          </template>
        </div>
        <div v-if="groupedTop.YouTube.length" class="platform-card">
          <template v-if="!collapsed.YouTube">
            <div class="section-header">
              <span class="sub-title">YouTube</span>
              <el-tag size="mini" type="info" effect="plain">共 {{ groupedTop.YouTube.length }} 条</el-tag>
              <div class="section-actions">
                <el-button size="mini" @click="toggleCollapse('YouTube')">{{ collapsed.YouTube ? '展开' : '折叠' }}</el-button>
                <el-button size="mini" type="primary" @click="translatePlatform('YouTube')">一键翻译</el-button>
                <el-button size="mini" @click="toggleShowTranslation('YouTube')">{{ showTranslation.YouTube ? '隐藏译文' : '显示译文' }}</el-button>
              </div>
            </div>
            <div>
              <top-you-tube :source="groupedTop.YouTube" :loading="isLoadingTable" :height="360" :translateOn="translateOn.YouTube" :showTranslation="showTranslation.YouTube" />
            </div>
          </template>
          <template v-else>
            <div class="collapse-header">
              <div class="collapse-title">
                <span class="name">YouTube</span>
                <span class="total">共 {{ groupedTop.YouTube.length }} 条</span>
              </div>
              <i class="el-icon-arrow-down" @click="toggleCollapse('YouTube')"></i>
            </div>
            <div class="collapse-summary">
              <div class="summary-item">
                <i class="el-icon-document"></i>
                <div class="label">总帖子数</div>
                <div class="value">{{ groupedTop.YouTube.length }}</div>
              </div>
              <div class="summary-item">
                <i class="el-icon-message"></i>
                <div class="label">总评论数</div>
                <div class="value">{{ sumBy(groupedTop.YouTube, 'commentsCount') }}</div>
              </div>
            </div>
          </template>
        </div>
        <div v-if="groupedTop.Facebook.length" class="platform-card">
          <template v-if="!collapsed.Facebook">
            <div class="section-header">
              <span class="sub-title">Facebook</span>
              <el-tag size="mini" type="info" effect="plain">共 {{ groupedTop.Facebook.length }} 条</el-tag>
              <div class="section-actions">
                <el-button size="mini" @click="toggleCollapse('Facebook')">{{ collapsed.Facebook ? '展开' : '折叠' }}</el-button>
                <el-button size="mini" type="primary" @click="translatePlatform('Facebook')">一键翻译</el-button>
                <el-button size="mini" @click="toggleShowTranslation('Facebook')">{{ showTranslation.Facebook ? '隐藏译文' : '显示译文' }}</el-button>
              </div>
            </div>
            <div>
              <top-facebook :source="groupedTop.Facebook" :loading="isLoadingTable" :height="360" :translateOn="translateOn.Facebook" :showTranslation="showTranslation.Facebook" />
            </div>
          </template>
          <template v-else>
            <div class="collapse-header">
              <div class="collapse-title">
                <span class="name">Facebook</span>
                <span class="total">共 {{ groupedTop.Facebook.length }} 条</span>
              </div>
              <i class="el-icon-arrow-down" @click="toggleCollapse('Facebook')"></i>
            </div>
            <div class="collapse-summary">
              <div class="summary-item">
                <i class="el-icon-document"></i>
                <div class="label">总帖子数</div>
                <div class="value">{{ groupedTop.Facebook.length }}</div>
              </div>
              <div class="summary-item">
                <i class="el-icon-message"></i>
                <div class="label">总评论数</div>
                <div class="value">{{ sumBy(groupedTop.Facebook, 'commentsCount') }}</div>
              </div>
            </div>
          </template>
        </div>
        <div v-if="groupedTop.TikTok.length" class="platform-card">
          <template v-if="!collapsed.TikTok">
            <div class="section-header">
              <span class="sub-title">TikTok</span>
              <el-tag size="mini" type="info" effect="plain">共 {{ groupedTop.TikTok.length }} 条</el-tag>
              <div class="section-actions">
                <el-button size="mini" @click="toggleCollapse('TikTok')">{{ collapsed.TikTok ? '展开' : '折叠' }}</el-button>
                <el-button size="mini" type="primary" @click="translatePlatform('TikTok')">一键翻译</el-button>
                <el-button size="mini" @click="toggleShowTranslation('TikTok')">{{ showTranslation.TikTok ? '隐藏译文' : '显示译文' }}</el-button>
              </div>
            </div>
            <div>
              <top-tik-tok :source="groupedTop.TikTok" :loading="isLoadingTable" :height="360" :translateOn="translateOn.TikTok" :showTranslation="showTranslation.TikTok" />
            </div>
          </template>
          <template v-else>
            <div class="collapse-header">
              <div class="collapse-title">
                <span class="name">TikTok</span>
                <span class="total">共 {{ groupedTop.TikTok.length }} 条</span>
              </div>
              <i class="el-icon-arrow-down" @click="toggleCollapse('TikTok')"></i>
            </div>
            <div class="collapse-summary">
              <div class="summary-item">
                <i class="el-icon-document"></i>
                <div class="label">总帖子数</div>
                <div class="value">{{ groupedTop.TikTok.length }}</div>
              </div>
              <div class="summary-item">
                <i class="el-icon-message"></i>
                <div class="label">总评论数</div>
                <div class="value">{{ sumBy(groupedTop.TikTok, 'commentsCount') }}</div>
              </div>
            </div>
          </template>
        </div>
        <div v-if="groupedTop.Reddit.length" class="platform-card">
          <template v-if="!collapsed.Reddit">
            <div class="section-header">
              <span class="sub-title">Reddit</span>
              <el-tag size="mini" type="info" effect="plain">共 {{ groupedTop.Reddit.length }} 条</el-tag>
              <div class="section-actions">
                <el-button size="mini" @click="toggleCollapse('Reddit')">{{ collapsed.Reddit ? '展开' : '折叠' }}</el-button>
                <el-button size="mini" type="primary" @click="translatePlatform('Reddit')">一键翻译</el-button>
                <el-button size="mini" @click="toggleShowTranslation('Reddit')">{{ showTranslation.Reddit ? '隐藏译文' : '显示译文' }}</el-button>
              </div>
            </div>
            <div>
              <top-reddit :source="groupedTop.Reddit" :loading="isLoadingTable" :height="360" :translateOn="translateOn.Reddit" :showTranslation="showTranslation.Reddit" />
            </div>
          </template>
          <template v-else>
            <div class="collapse-header">
              <div class="collapse-title">
                <span class="name">Reddit</span>
                <span class="total">共 {{ groupedTop.Reddit.length }} 条</span>
              </div>
              <i class="el-icon-arrow-down" @click="toggleCollapse('Reddit')"></i>
            </div>
            <div class="collapse-summary">
              <div class="summary-item">
                <i class="el-icon-document"></i>
                <div class="label">总帖子数</div>
                <div class="value">{{ groupedTop.Reddit.length }}</div>
              </div>
              <div class="summary-item">
                <i class="el-icon-message"></i>
                <div class="label">总评论数</div>
                <div class="value">{{ sumBy(groupedTop.Reddit, 'commentsCount') }}</div>
              </div>
            </div>
          </template>
        </div>
        <div v-if="groupedTop.Discord.length" class="platform-card">
          <template v-if="!collapsed.Discord">
            <div class="section-header">
              <span class="sub-title">Discord</span>
              <el-tag size="mini" type="info" effect="plain">共 {{ groupedTop.Discord.length }} 条</el-tag>
              <div class="section-actions">
                <el-button size="mini" @click="toggleCollapse('Discord')">{{ collapsed.Discord ? '展开' : '折叠' }}</el-button>
                <el-button size="mini" type="primary" @click="translatePlatform('Discord')">一键翻译</el-button>
                <el-button size="mini" @click="toggleShowTranslation('Discord')">{{ showTranslation.Discord ? '隐藏译文' : '显示译文' }}</el-button>
              </div>
            </div>
            <div>
              <top-discord :source="groupedTop.Discord" :loading="isLoadingTable" :height="360" :translateOn="translateOn.Discord" :showTranslation="showTranslation.Discord" />
            </div>
          </template>
          <template v-else>
            <div class="collapse-header">
              <div class="collapse-title">
                <span class="name">Discord</span>
                <span class="total">共 {{ groupedTop.Discord.length }} 条</span>
              </div>
              <i class="el-icon-arrow-down" @click="toggleCollapse('Discord')"></i>
            </div>
            <div class="collapse-summary">
              <div class="summary-item">
                <i class="el-icon-document"></i>
                <div class="label">总帖子数</div>
                <div class="value">{{ groupedTop.Discord.length }}</div>
              </div>
              <div class="summary-item">
                <i class="el-icon-message"></i>
                <div class="label">总评论数</div>
                <div class="value">{{ sumBy(groupedTop.Discord, 'repliesCount') }}</div>
              </div>
            </div>
          </template>
        </div>
        <div v-if="groupedTop.NaverLounge.length" class="platform-card">
          <template v-if="!collapsed.NaverLounge">
            <div class="section-header">
              <span class="sub-title">Naver Lounge</span>
              <el-tag size="mini" type="info" effect="plain">共 {{ groupedTop.NaverLounge.length }} 条</el-tag>
              <div class="section-actions">
                <el-button size="mini" @click="toggleCollapse('NaverLounge')">{{ collapsed.NaverLounge ? '展开' : '折叠' }}</el-button>
                <el-button size="mini" type="primary" @click="translatePlatform('NaverLounge')">一键翻译</el-button>
                <el-button size="mini" @click="toggleShowTranslation('NaverLounge')">{{ showTranslation.NaverLounge ? '隐藏译文' : '显示译文' }}</el-button>
              </div>
            </div>
            <div>
              <top-naver-lounge :source="groupedTop.NaverLounge" :loading="isLoadingTable" :height="360" :translateOn="translateOn.NaverLounge" :showTranslation="showTranslation.NaverLounge" />
            </div>
          </template>
          <template v-else>
            <div class="collapse-header">
              <div class="collapse-title">
                <span class="name">Naver Lounge</span>
                <span class="total">共 {{ groupedTop.NaverLounge.length }} 条</span>
              </div>
              <i class="el-icon-arrow-down" @click="toggleCollapse('NaverLounge')"></i>
            </div>
            <div class="collapse-summary">
              <div class="summary-item">
                <i class="el-icon-document"></i>
                <div class="label">总帖子数</div>
                <div class="value">{{ groupedTop.NaverLounge.length }}</div>
              </div>
              <div class="summary-item">
                <i class="el-icon-message"></i>
                <div class="label">总评论数</div>
                <div class="value">{{ sumBy(groupedTop.NaverLounge, 'commentsCount') }}</div>
              </div>
            </div>
          </template>
        </div>
        <div v-if="groupedTop.Pixiv.length" class="platform-card">
          <template v-if="!collapsed.Pixiv">
            <div class="section-header">
              <span class="sub-title">Pixiv</span>
              <el-tag size="mini" type="info" effect="plain">共 {{ groupedTop.Pixiv.length }} 条</el-tag>
              <div class="section-actions">
                <el-button size="mini" @click="toggleCollapse('Pixiv')">{{ collapsed.Pixiv ? '展开' : '折叠' }}</el-button>
                <el-button size="mini" type="primary" @click="translatePlatform('Pixiv')">一键翻译</el-button>
                <el-button size="mini" @click="toggleShowTranslation('Pixiv')">{{ showTranslation.Pixiv ? '隐藏译文' : '显示译文' }}</el-button>
              </div>
            </div>
            <div>
              <top-pixiv :source="groupedTop.Pixiv" :loading="isLoadingTable" :height="360" :translateOn="translateOn.Pixiv" :showTranslation="showTranslation.Pixiv" />
            </div>
          </template>
          <template v-else>
            <div class="collapse-header">
              <div class="collapse-title">
                <span class="name">Pixiv</span>
                <span class="total">共 {{ groupedTop.Pixiv.length }} 条</span>
              </div>
              <i class="el-icon-arrow-down" @click="toggleCollapse('Pixiv')"></i>
            </div>
            <div class="collapse-summary">
              <div class="summary-item">
                <i class="el-icon-document"></i>
                <div class="label">总帖子数</div>
                <div class="value">{{ groupedTop.Pixiv.length }}</div>
              </div>
              <div class="summary-item">
                <i class="el-icon-message"></i>
                <div class="label">总评论数</div>
                <div class="value">{{ sumBy(groupedTop.Pixiv, 'commentsCount') }}</div>
              </div>
            </div>
          </template>
        </div>
      </div>
    </div>
  </div>
  </template>
<script>
import TimeCalendar from "views/components/time-range-calendar/index.vue";
import recentDay from "@/utils/timeData";
import { fitListData } from "views/components/filters/data";
import lineChart from "@/views/dashbord/components/customDashbords/components/leciyuanTrendLine.vue";
import metricsMiniCard from "@/views/dashbord/components/customDashbords/components/metricsMiniCard.vue";
import topWeibo from "@/views/dashbord/components/customDashbords/components/topContents/topWeibo.vue";
import topBilibili from "@/views/dashbord/components/customDashbords/components/topContents/topBilibili.vue";
import topZhihu from "@/views/dashbord/components/customDashbords/components/topContents/topZhihu.vue";
import topDouyin from "@/views/dashbord/components/customDashbords/components/topContents/topDouyin.vue";
import topXhs from "@/views/dashbord/components/customDashbords/components/topContents/topXhs.vue";
import topX from "@/views/dashbord/components/customDashbords/components/topContents/topX.vue";
import topYouTube from "@/views/dashbord/components/customDashbords/components/topContents/topYouTube.vue";
import topFacebook from "@/views/dashbord/components/customDashbords/components/topContents/topFacebook.vue";
import topTikTok from "@/views/dashbord/components/customDashbords/components/topContents/topTikTok.vue";
import topReddit from "@/views/dashbord/components/customDashbords/components/topContents/topReddit.vue";
import topDiscord from "@/views/dashbord/components/customDashbords/components/topContents/topDiscord.vue";
import topNaverLounge from "@/views/dashbord/components/customDashbords/components/topContents/topNaverLounge.vue";
import topPixiv from "@/views/dashbord/components/customDashbords/components/topContents/topPixiv.vue";
import request from "@/utils/request.js";
import { uuid } from "@/utils";

export default {
  props: {
    dashboard: {
      type: Object,
      default() {
        return { id: 0, dashbordPerms: {} };
      },
    },
    configs: {
      type: Object,
      default: () => {
        return {};
      },
    },
    loading: {
      type: Boolean,
      default: false,
    },
  },
  components: {
    TimeCalendar,
    lineChart,
    metricsMiniCard,
    topWeibo,
    topBilibili,
    topZhihu,
    topDouyin,
    topXhs,
    topX,
    topYouTube,
    topFacebook,
    topTikTok,
    topReddit,
    topDiscord,
    topNaverLounge,
    topPixiv,
  },
  data() {
    return {
      channel: [],
      languages: [],
      sentiments: [],
      useMock: true,
      cardLoading: false,
      trendLoading: false,
      channelOptions: [],
      languageOptions: [],
      sentimentOptions: [
        { label: "3天", value: 3 },
        { label: "5天", value: 5 },
        { label: "7天", value: 7 },
      ],
      time: {
        type: "relative",
        start: recentDay["1-31"].start,
        end: recentDay["1-31"].end,
        recent_day: "1-31",
      },
      statisticsData: [
        { name: "内容总量", value: 0 },
        { name: "一级贴文", value: 0 },
        { name: "总曝光", value: 0 },
        { name: "评论量", value: 0 },
        { name: "互动量", value: 0 },
        { name: "正向内容总量", value: 0 },
        { name: "负向内容总量", value: 0 },
        { name: "中性内容总量", value: 0 },
        { name: "正负向占比", value: 0 },
      ],
      trendChartData: {
        dimensions: ["time", "曝光", "互动量", "评论量", "正向", "负向", "中性"],
        source: [],
      },
      tableData: [],
      isLoadingTable: false,
      pager: {
        curPage: 1,
        pageSize: 10,
        total: 0,
      },
      tableDimension: [],
      tableOptionsData: [],
      filterOpionsData: [],
      filterValueComponentConfig: {},
      collapsed: { weibo: true, bilibili: true, zhihu: true, douyin: true, xhs: true, X: true, YouTube: true, Facebook: true, TikTok: true, Reddit: true, Discord: true, NaverLounge: true, Pixiv: true },
      translateOn: { weibo: false, bilibili: false, zhihu: false, douyin: false, xhs: false, X: false, YouTube: false, Facebook: false, TikTok: false, Reddit: false, Discord: false, NaverLounge: false, Pixiv: false },
      showTranslation: { weibo: false, bilibili: false, zhihu: false, douyin: false, xhs: false, X: false, YouTube: false, Facebook: false, TikTok: false, Reddit: false, Discord: false, NaverLounge: false, Pixiv: false },
      showTranslationAll: false,
    };
  },
  methods: {
    handleTimeChange(data) {
      this.time = {
        type: data.type,
        start: data.start,
        end: data.end,
        recent_day: data.recent_day,
      };
    },
    handleFilterChange() {},
    handleSearch() {
      if (this.useMock) {
        this.mockStatistics();
        this.mockTrend();
        this.mockContents();
      } else {
        this.getStatistics();
        this.getTrendData();
        this.getTableData();
      }
    },
    handleRefreshMock() {
      this.mockStatistics();
      this.mockTrend();
      this.mockContents();
    },
    getData(url) {
      const body = {
        time: this.time,
        project_id: this.$store.getters.appId,
        pager: this.pager,
      };
      const filterChildren = [];
      if (this.channel.length > 0) {
        filterChildren.push(this.buildChannelFilter(this.channel));
      }
      if (this.languages.length > 0) {
        filterChildren.push({
          relTag: "or",
          children: this.languages.map(v => ({ id: uuid(), key: "language", relation: "eq", value: v }))
        });
      }
      if (this.sentiments.length > 0) {
        filterChildren.push({
          relTag: "or",
          children: this.sentiments.map(v => ({ id: uuid(), key: "sentiment_rough", relation: "eq", value: v }))
        });
      }
      if (filterChildren.length > 0) {
        body.filters = { relTag: "and", children: filterChildren };
      }
      return request({ url, method: "post", data: body });
    },
    getStatistics() {
      this.cardLoading = true;
      this.getData("/api/silver-palace/statistics").then(res => {
        this.statisticsData = res.data.data;
        this.cardLoading = false;
      }).catch(() => { this.cardLoading = false; });
    },
    getTrendData() {
      this.trendLoading = true;
      this.getData("/api/silver-palace/trend").then(res => {
        this.trendChartData = res.data.data;
        this.trendLoading = false;
      }).catch(() => { this.trendLoading = false; });
    },
    getTableData() {
      this.isLoadingTable = true;
      this.getData("/api/silver-palace/contents").then(res => {
        this.tableData = (res.data.data.list || []).map(item => ({
          ...item,
          sentimentLabel: item.sentimentLabel || item.sentiment || "",
        }));
        this.pager.total = res.data.data.pager.total;
        this.isLoadingTable = false;
      }).catch(() => { this.isLoadingTable = false; });
    },
    handleJumpLink(row) {
      if (row.link) {
        window.open(row.link);
      }
    },
    buildChannelFilter(pairs) {
      return {
        relTag: "or",
        children: pairs.map(([channel, content_type]) => ({
          relTag: "and",
          children: [
            { id: uuid(), key: "channel", relation: "eq", value: channel },
            { id: uuid(), key: "content_type", relation: "eq", value: content_type },
          ],
        })),
      };
    },
    handleGetTableData(event) {
      if (event && event.pager) {
        this.pager = event.pager;
      }
      this.getTableData();
    },
    rand(min, max) {
      return Math.floor(Math.random() * (max - min + 1)) + min;
    },
    dateList(n) {
      const now = new Date();
      const arr = [];
      for (let i = n - 1; i >= 0; i--) {
        const d = new Date(now.getTime() - i * 24 * 60 * 60 * 1000);
        const s = `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`;
        arr.push(s);
      }
      return arr;
    },
    mockStatistics() {
      const item = (name, min, max) => ({ name, value: this.rand(min, max), wow: this.rand(-20, 20), dod: this.rand(-10, 10) });
      this.statisticsData = [
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
    },
    mockTrend() {
      const times = this.dateList(30);
      this.trendChartData = {
        dimensions: ['time', '曝光', '互动量', '评论量', '正向', '负向', '中性'],
        source: times.map(t => ({
          time: t,
          曝光: this.rand(1000, 10000),
          互动量: this.rand(300, 3000),
          评论量: this.rand(100, 1200),
          正向: this.rand(50, 600),
          负向: this.rand(40, 500),
          中性: this.rand(60, 700),
        })),
      };
    },
    mockContents() {
      const channels = ['微博', 'B站', '知乎', '抖音', '小红书', 'X', 'YouTube', 'Discord', 'Naver Lounge', 'Facebook', 'TikTok', 'Reddit', 'Pixiv'];
      const sentiments = [
        { label: '正向', value: 'positive' },
        { label: '负向', value: 'negative' },
        { label: '中性', value: 'neutral' },
      ];
      const list = Array.from({ length: 30 }).map((_, i) => {
        const ch = channels[this.rand(0, channels.length - 1)];
        const s = sentiments[this.rand(0, sentiments.length - 1)];
        const d = new Date(Date.now() - this.rand(0, 20) * 86400000);
        const publishTime = `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')} ${String(d.getHours()).padStart(2,'0')}:${String(d.getMinutes()).padStart(2,'0')}:00`;
        const base = {
          id: `sp-${Date.now()}-${i}`,
          channel: ch,
          content: '示例TOP内容文案片段...',
          publishTime,
          sentiment: s.value,
          sentimentLabel: s.label,
          link: 'https://www.example.com/content/' + i,
        };
        if (ch === '微博') {
          return { ...base, repostsCount: this.rand(100, 5000), commentsCount: this.rand(50, 2000), attitudesCount: this.rand(100, 8000) };
        }
        if (ch === 'B站') {
          return { ...base, plays: this.rand(5000, 200000), danmaku: this.rand(50, 5000), favorites: this.rand(100, 20000), likes: this.rand(100, 50000), shares: this.rand(10, 5000) };
        }
        if (ch === '知乎') {
          return { ...base, voteups: this.rand(100, 30000), commentsCount: this.rand(10, 2000) };
        }
        if (ch === '抖音') {
          return { ...base, plays: this.rand(10000, 500000), likes: this.rand(100, 80000), commentsCount: this.rand(10, 5000), shares: this.rand(10, 10000) };
        }
        if (ch === '小红书') {
          return { ...base, likes: this.rand(100, 50000), collects: this.rand(50, 20000), commentsCount: this.rand(10, 3000) };
        }
        if (ch === 'X') {
          return { ...base, retweetsCount: this.rand(50, 5000), repliesCount: this.rand(10, 2000), likes: this.rand(50, 10000) };
        }
        if (ch === 'YouTube') {
          return { ...base, views: this.rand(5000, 1000000), likes: this.rand(50, 50000), commentsCount: this.rand(10, 5000) };
        }
        if (ch === 'Discord') {
          return { ...base, repliesCount: this.rand(10, 3000), likes: this.rand(10, 1000) };
        }
        if (ch === 'Naver Lounge') {
          return { ...base, likes: this.rand(10, 10000), commentsCount: this.rand(5, 3000) };
        }
        if (ch === 'Facebook') {
          return { ...base, shares: this.rand(10, 10000), likes: this.rand(50, 50000), commentsCount: this.rand(10, 5000) };
        }
        if (ch === 'TikTok') {
          return { ...base, plays: this.rand(5000, 800000), likes: this.rand(50, 80000), commentsCount: this.rand(10, 5000), shares: this.rand(10, 10000) };
        }
        if (ch === 'Reddit') {
          return { ...base, upvotes: this.rand(50, 50000), commentsCount: this.rand(10, 5000) };
        }
        if (ch === 'Pixiv') {
          return { ...base, likes: this.rand(50, 50000), favorites: this.rand(50, 50000), commentsCount: this.rand(5, 2000) };
        }
        return base;
      });
      this.tableData = list;
      this.pager = { curPage: 1, pageSize: 10, total: 200 };
    },
    getFilterOptions() {
      const payload = { project_id: this.$store.getters.appId };
      return this.$store.dispatch("trend/getFilterOptions", payload).then((data) => {
        this.tableOptionsData = fitListData(data);
        const curTable = this.tableOptionsData[0];
        if (curTable) {
          this.filterOpionsData = curTable.keyList || [];
          const channel = this.filterOpionsData.find((i) => i.label === "渠道");
          if (channel) {
            this.channelOptions = channel.choices || [];

          }
          const language = this.filterOpionsData.find((i) => i.label === "语言");
          if (language) {
            this.languageOptions = (language.choices || []).map(c => ({ label: c.title || c.label, value: c.code || c.value }));
          } else {
            this.languageOptions = [
              { label: "简中", value: "zh" },
              { label: "繁中", value: "zh-tw"},
              { label: "英文", value: "en" },
              { label: "日文", value: "ja" },
              { label: "韩文", value: "ko" },
            ];
          }
        }
      });
    },
    sumBy(list, key) {
      return (list || []).reduce((sum, item) => sum + (Number(item[key]) || 0), 0);
    },
    toggleCollapse(platform) {
      this.$set(this.collapsed, platform, !this.collapsed[platform]);
    },
    toggleAllCollapse(toCollapse) {
      Object.keys(this.collapsed).forEach(k => { this.$set(this.collapsed, k, !!toCollapse) });
    },
    translatePlatform(platform) {
      this.translateOn[platform] = true;
      this.$set(this.showTranslation, platform, true);
      const group = this.groupedTop[platform] || [];
      group.forEach(item => { item.translation = this.mockTranslate(item.content) });
    },
    translateAll() {
      Object.keys(this.translateOn).forEach(k => { this.translateOn[k] = true });
      Object.keys(this.showTranslation).forEach(k => { this.$set(this.showTranslation, k, true) });
      this.showTranslationAll = true;
      this.tableData.forEach(item => { item.translation = this.mockTranslate(item.content) });
    },
    toggleShowTranslation(platform) {
      if (platform) {
        this.$set(this.showTranslation, platform, !this.showTranslation[platform]);
      } else {
        this.showTranslationAll = !this.showTranslationAll;
        Object.keys(this.showTranslation).forEach(k => { this.$set(this.showTranslation, k, this.showTranslationAll) });
      }
    },
    mockTranslate(text) {
      if (!text) return '';
      return `[译] ${text}`;
    },
  },
  computed: {
    groupedTop() {
      const result = { weibo: [], bilibili: [], zhihu: [], douyin: [], xhs: [], X: [], YouTube: [], Facebook: [], TikTok: [], Reddit: [], Discord: [], NaverLounge: [], Pixiv: [] };
      this.tableData.forEach(item => {
        if (item.channel === '微博') result.weibo.push(item);
        else if (item.channel === 'B站') result.bilibili.push(item);
        else if (item.channel === '知乎') result.zhihu.push(item);
        else if (item.channel === '抖音') result.douyin.push(item);
        else if (item.channel === '小红书') result.xhs.push(item);
        else if (item.channel === 'X') result.X.push(item);
        else if (item.channel === 'YouTube') result.YouTube.push(item);
        else if (item.channel === 'Facebook') result.Facebook.push(item);
        else if (item.channel === 'TikTok') result.TikTok.push(item);
        else if (item.channel === 'Reddit') result.Reddit.push(item);
        else if (item.channel === 'Discord') result.Discord.push(item);
        else if (item.channel === 'Naver Lounge') result.NaverLounge.push(item);
        else if (item.channel === 'Pixiv') result.Pixiv.push(item);
      });
      return result;
    },
  },
  created() {
    this.getFilterOptions();
    this.$nextTick(() => { this.handleSearch(); });
  },
};
</script>
<style lang="scss" scoped>
@import "@/styles/index.scss";

.custom-silver-palace {
  background: white;
  height: auto;
  overflow: auto;
  padding: 20px;

  .filter-container {
    display: flex;
    gap: 10px;
    align-items: center;
    margin-bottom: 20px;
    padding: 15px;
    background: #f5f7fa;
    border-radius: 4px;
  }

  .statistics-container {
    position: relative;
    overflow: visible;
    margin-bottom: 60px;
    padding-bottom: 8px;
    min-height: 120px;

    .mini-grid {
      display: flex;
      flex-wrap: wrap;
      gap: 8px;
      margin-bottom: 8px;
    }
    .mini-col {
      flex: 0 0 calc((100% - 32px) / 5);
    }
    .mini-col ::v-deep(.mini-card) { min-height: 84px; }
    .platform-card { display: none !important; }
  }
  .chart-card { margin-top: 24px; clear: both; position: relative; z-index: 0; }
  .chart-card .card-header { background: #fff; }
  .chart-card .card-body { padding-top: 10px; overflow: visible; }

  .chart-card,
  .table-card {
    background: white;
    border: 1px solid #ebeef5;
    border-radius: 4px;
    margin-bottom: 20px;

    .card-header {
      padding: 15px 20px;
      border-bottom: 1px solid #ebeef5;
      display: flex;
      justify-content: space-between;
      align-items: center;
      .card-title { font-size: 16px; font-weight: 500; color: $color-text; }
    }

    .card-body { padding: 20px; }
    .platform-top { display: grid; grid-template-columns: 1fr; gap: 16px; }
    .platform-top .platform-card { border: 1px solid #ebeef5; border-radius: 8px; background: #fff; overflow: hidden; }
    .platform-top .section-header { display: flex; justify-content: space-between; align-items: center; padding: 12px 16px; border-bottom: 1px solid #ebeef5; }
    .platform-top .sub-title { font-size: 16px; font-weight: 600; color: #1f2d3d; }

    .platform-top .collapse-header { display: flex; align-items: center; justify-content: space-between; padding: 12px 16px; background: linear-gradient(90deg, #7b60ff 0%, #6a96ff 100%); color: #fff; }
    .platform-top .collapse-title { display: flex; align-items: center; gap: 12px; }
    .platform-top .collapse-title .name { font-size: 16px; font-weight: 600; }
    .platform-top .collapse-title .total { font-size: 13px; opacity: 0.9; }
    .platform-top .collapse-header .el-icon-arrow-down { cursor: pointer; color: #fff; }

    .platform-top .collapse-summary { display: grid; grid-template-columns: repeat(2, 1fr); gap: 12px; padding: 16px; background: #fff; }
    .platform-top .summary-item { display: flex; align-items: center; gap: 12px; padding: 8px 12px; border-radius: 8px; background: #f9fafb; box-shadow: 0 2px 8px rgba(0,0,0,0.04); }
    .platform-top .summary-item i { font-size: 18px; color: #6a96ff; }
    .platform-top .summary-item .label { color: #8591a1; font-size: 12px; }
    .platform-top .summary-item .value { color: #1f2d3d; font-size: 18px; font-weight: 600; }
  }
}
</style>
