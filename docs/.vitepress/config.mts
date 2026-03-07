import { defineConfigWithTheme, type HeadConfig, type DefaultTheme } from 'vitepress'
import { generateSidebar } from 'vitepress-sidebar'
import { withMermaid } from 'vitepress-plugin-mermaid'
import timeline from "vitepress-markdown-timeline"
import taskLists from 'markdown-it-task-lists'
import { VitePWA } from 'vite-plugin-pwa'
import { readFile, stat, writeFile } from 'fs/promises'
import { isAbsolute as isAbsolutePath, join as joinPath, relative as relativePath } from 'path'

// 导入模块化工具
import {
  stripFrontmatter,
  parseSimpleFrontmatter,
  extractDescriptionFromMarkdown,
  estimateReadingTime,
  urlPathForPage,
  safeJsonLd,
  escapeXml,
  safeCdata
} from './modules/utils'
import { buildBreadcrumbList } from './modules/seo'
import { generateRobotsTxt, buildRssXml, extractRssItem, type RssItem } from './modules/feed'
import { buildFAQSchema, tutorialFAQs } from './modules/faq'
import { buildImageSitemap } from './modules/sitemap'
import { generateAutoDescription, inferDifficulty, generateRelatedPages, getLastUpdatedHint } from './modules/defaults'

// 全局类型声明：支持 Vite 的 import.meta.env
declare global {
  interface ImportMetaEnv {
    DEV?: boolean
    MODE?: string
    BASE_URL?: string
    PROD?: boolean
    SSR?: boolean
  }
  interface ImportMeta {
    env?: ImportMetaEnv
  }
}

const SITE_TITLE = "VibeVibe"
const SITE_TITLE_FRIENDLY = "Vibe Vibe"  // 用于显示的友好名称
const SITE_DESCRIPTION = "Vibe Coding 全栈实战教程 - 从 Next.js 到 AI 辅助开发，用 Vibe Coding 的方式重塑你的编程工作流。涵盖零基础入门、全栈开发、数据库、部署运维等核心主题。"
const SITE_URL_FALLBACK = 'https://www.vibevibe.cn'

function normalizeSiteUrl(url: string): string {
  return url.trim().replace(/\/+$/, '');
}

function resolveSiteUrl(): string {
  const raw =
    process.env.SITE_URL || 
    process.env.EDGEONE_PAGES_URL || 
    process.env.DEPLOY_URL ||
    process.env.URL ||
    (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : '') ||
    SITE_URL_FALLBACK;

  const normalized = normalizeSiteUrl(raw);
  if (/^https?:\/\//i.test(normalized)) return normalized;
  return `https://${normalized}`;
}

const SITE_URL = resolveSiteUrl();

export default withMermaid(defineConfigWithTheme<DefaultTheme.Config>({
  lang: 'zh-CN',
  title: SITE_TITLE,
  description: SITE_DESCRIPTION,
  
  // 排除 docs/docs 目录不构建
  srcExclude: ['**/docs/**'],
  
  head: [
    // 搜索引擎验证
    ['meta', { name: 'baidu-site-verification', content: 'codeva-DyDGMBlEJg' }],
    ['meta', { name: 'google-site-verification', content: 'your-google-verification-code' }],
    ['meta', { name: 'msvalidate.01', content: 'your-bing-verification-code' }],

    // SEO 基础标签
    ['meta', { name: 'keywords', content: 'Vibe Coding, 全栈开发, Next.js, TypeScript, React, Prisma, AI编程, Cursor, Claude' }],
    ['meta', { name: 'author', content: 'Eyre' }],
    ['meta', { name: 'robots', content: 'index,follow,max-image-preview:large,max-snippet:-1,max-video-preview:-1' }],

    // 移动端和 PWA 配置
    ['meta', { name: 'theme-color', content: '#ffffff' }],
    ['meta', { name: 'mobile-web-app-capable', content: 'yes' }],
    ['meta', { name: 'apple-mobile-web-app-capable', content: 'yes' }],
    ['meta', { name: 'apple-mobile-web-app-status-bar-style', content: 'default' }],
    ['meta', { name: 'apple-mobile-web-app-title', content: SITE_TITLE }],

    // Open Graph 基础标签
    ['meta', { property: 'og:type', content: 'website' }],
    ['meta', { property: 'og:site_name', content: SITE_TITLE_FRIENDLY }],

    // 微信分享专用标签
    ['meta', { name: 'weixin:description', content: SITE_DESCRIPTION }],

    // 图标
    ['link', { rel: 'icon', href: '/logo.png', type: 'image/png' }],
    ['link', { rel: 'shortcut icon', href: '/logo.png', type: 'image/png' }],
    ['link', { rel: 'apple-touch-icon', href: '/logo.png' }],

    // RSS 和 Manifest
    ['link', { rel: 'alternate', type: 'application/rss+xml', title: SITE_TITLE, href: '/rss.xml' }],
    ['link', { rel: 'manifest', href: '/manifest.webmanifest' }],

    // 语言和作者链接（SEO增强）
    ['link', { rel: 'alternate', hreflang: 'zh-CN', href: SITE_URL }],
    ['link', { rel: 'alternate', hreflang: 'x-default', href: SITE_URL }],
    ['link', { rel: 'author', href: 'https://github.com/datawhalechina/vibe-vibe/graphs/contributors' }],

    // DNS 预解析 - 提前解析外部域名
    ['link', { rel: 'dns-prefetch', href: '//u.vibevibe.cn' }],
    ['link', { rel: 'dns-prefetch', href: '//github.com' }],
    ['link', { rel: 'dns-prefetch', href: '//www.googletagmanager.com' }],

    // Preconnect - 比 DNS预解析更强，建立 TCP+TLS 连接
    ['link', { rel: 'preconnect', href: 'https://u.vibevibe.cn' }],
    ['link', { rel: 'preconnect', href: 'https://github.com', crossorigin: 'anonymous' }],

    // Preload 关键资源 - 优先加载重要资源
    ['link', { rel: 'preload', href: '/logo.png', as: 'image' }],

    // 统计脚本
    [
      'script',
      {
        defer: '',
        src: 'https://u.vibevibe.cn/script.js',
        'data-website-id': 'a1b0c652-8f34-4bc2-8c42-40fcaf521c9d'
      }
    ],
  ],

  ...(SITE_URL ? { sitemap: { hostname: SITE_URL } } : {}),

  transformHead: ({ pageData }): HeadConfig[] | void => {
    if (!SITE_URL) return;

    const url = `${SITE_URL}${urlPathForPage(pageData.relativePath)}`;
    const frontmatter = pageData.frontmatter;
    const frontmatterTitle = typeof frontmatter?.title === 'string' ? frontmatter.title : undefined;
    const frontmatterDescription =
      typeof frontmatter?.description === 'string' ? frontmatter.description : undefined;

    const title = frontmatterTitle || pageData.title || SITE_TITLE;
    const description = frontmatterDescription || pageData.description || SITE_DESCRIPTION;
    const frontmatterImage = typeof frontmatter?.image === 'string' ? frontmatter.image : undefined;
    const image = frontmatterImage
      ? (/^https?:\/\//i.test(frontmatterImage) ? frontmatterImage : `${SITE_URL}${frontmatterImage.startsWith('/') ? '' : '/'}${frontmatterImage}`)
      : `${SITE_URL}/logo.png`;

    const urlPath = urlPathForPage(pageData.relativePath);
    const breadcrumbList = buildBreadcrumbList(urlPath, url);

    // 判断是否为文章类型（非首页且在文档目录中）
    const isArticle = pageData.relativePath !== 'index.md' &&
                      (pageData.relativePath.startsWith('Basic/') ||
                       pageData.relativePath.startsWith('Advanced/') ||
                       pageData.relativePath.startsWith('Practice/'));

    // 自动分类：根据路径生成 section 名称
    const articleSection = pageData.relativePath.startsWith('Basic/') ? '基础篇' :
                          pageData.relativePath.startsWith('Advanced/') ? '进阶篇' :
                          pageData.relativePath.startsWith('Practice/') ? '实践篇' :
                          pageData.relativePath.startsWith('Articles/') ? '优质文章' : '编程教程';

    // 动态关键词生成
    const generateKeywords = (path: string, pageTitle: string): string => {
      const baseKeywords = ['Vibe Coding', 'AI编程', 'Cursor', 'Claude', 'Next.js'];

      if (path.startsWith('Basic/')) {
        return [...baseKeywords, '零基础', '编程入门', 'AI辅助开发', 'MVP'].join(', ');
      } else if (path.startsWith('Advanced/')) {
        return [...baseKeywords, '全栈开发', 'TypeScript', 'React', 'Tailwind CSS', '数据库', '部署'].join(', ');
      } else if (path.startsWith('Practice/')) {
        return [...baseKeywords, '项目实战', '全栈项目', 'AI Agent', '实战案例'].join(', ');
      } else if (path.startsWith('Articles/')) {
        return ['AI编程', '技术博客', 'OpenAI', 'Anthropic', 'Vercel', '开发资源'].join(', ');
      }

      return baseKeywords.join(', ');
    };

    const pageKeywords = generateKeywords(pageData.relativePath, title);

    // 增强的结构化数据
    const jsonLdGraph: Array<Record<string, unknown>> = [
      {
        '@type': 'WebSite',
        '@id': `${SITE_URL}/#website`,
        url: SITE_URL,
        name: SITE_TITLE,
        alternateName: SITE_TITLE_FRIENDLY,
        description: SITE_DESCRIPTION,
        inLanguage: 'zh-CN',
        publisher: {
          '@type': 'Organization',
          '@id': `${SITE_URL}/#organization`,
          name: 'Datawhale',
          url: 'https://github.com/datawhalechina',
          logo: {
            '@type': 'ImageObject',
            url: `${SITE_URL}/logo.png`,
            width: 512,
            height: 512
          },
          sameAs: [
            'https://github.com/datawhalechina',
            'https://github.com/datawhalechina/vibe-vibe'
          ]
        },
        // 站内搜索框
        potentialAction: {
          '@type': 'SearchAction',
          target: {
            '@type': 'EntryPoint',
            urlTemplate: `${SITE_URL}/search?q={search_term_string}`
          },
          'query-input': 'required name=search_term_string'
        }
      },
      // 组织详细结构化数据
      {
        '@type': 'Organization',
        '@id': `${SITE_URL}/#organization`,
        name: 'Datawhale',
        url: SITE_URL,
        logo: {
          '@type': 'ImageObject',
          url: `${SITE_URL}/logo.png`
        },
        description: '让每个人都能成为 Builder - AI 时代的开源学习社区',
        sameAs: [
          'https://github.com/datawhalechina',
          'https://github.com/datawhalechina/vibe-vibe'
        ]
      },
      // 作者 Profile Schema
      {
        '@type': 'Person',
        '@id': `${SITE_URL}/#author`,
        name: 'Eyre',
        url: SITE_URL,
        description: 'Vibe Vibe 项目发起人 & 核心贡献者',
        knowsAbout: [
          'Vibe Coding',
          'AI Programming',
          'Next.js',
          'TypeScript',
          'Full-stack Development'
        ],
        worksFor: {
          '@type': 'Organization',
          name: 'Datawhale'
        }
      },
      {
        '@type': 'WebPage',
        '@id': `${url}#webpage`,
        url,
        name: title,
        description,
        isPartOf: { '@id': `${SITE_URL}/#website` },
        inLanguage: 'zh-CN',
        ...(pageData.readingTime && {
          timeRequired: `PT${pageData.readingTime}M`
        })
      }
    ];

    // 如果是文章类型，添加 Article 结构化数据
    if (isArticle) {
      const datePublished = typeof frontmatter?.date === 'string' ? frontmatter.date : undefined;
      const dateModified = typeof frontmatter?.updated === 'string' ? frontmatter.updated : undefined;

      jsonLdGraph.push({
        '@type': 'Article',
        '@id': `${url}#article`,
        url,
        headline: title,
        description,
        isPartOf: { '@id': `${SITE_URL}/#website` },
        inLanguage: 'zh-CN',
        ...(datePublished && { datePublished }),
        ...(dateModified && { dateModified }),
        author: {
          '@type': 'Person',
          name: 'Eyre'
        },
        publisher: {
          '@type': 'Organization',
          name: 'Datawhale',
          logo: {
            '@type': 'ImageObject',
            url: `${SITE_URL}/logo.png`
          }
        },
        mainEntityOfPage: {
          '@type': 'WebPage',
          '@id': url
        }
      });
    }

    if (breadcrumbList) jsonLdGraph.push(breadcrumbList);

    // 为首页和 FAQ 页面添加 FAQ 结构化数据
    const isFAQPage = pageData.relativePath.includes('faq') ||
                       pageData.relativePath.includes('99-appendix') ||
                       pageData.relativePath === 'index.md';

    if (isFAQPage) {
      const faqSchema = buildFAQSchema(tutorialFAQs, url, SITE_TITLE);
      jsonLdGraph.push(faqSchema);
    }

    const jsonLd = {
      '@context': 'https://schema.org',
      '@graph': jsonLdGraph
    };

    // 增强的 meta 标签
    const headConfigs: HeadConfig[] = [
      ['link', { rel: 'canonical', href: url }],

      // Open Graph 基础标签
      ['meta', { property: 'og:site_name', content: SITE_TITLE_FRIENDLY }],
      ['meta', { property: 'og:locale', content: 'zh_CN' }],
      ['meta', { property: 'og:url', content: url }],
      ['meta', { property: 'og:title', content: title }],
      ['meta', { property: 'og:description', content: description }],
      ['meta', { property: 'og:image', content: image }],
      ['meta', { property: 'og:image:width', content: '1200' }],
      ['meta', { property: 'og:image:height', content: '630' }],
      ['meta', { property: 'og:image:alt', content: title }],
      ...(isArticle ? [
        ['meta', { property: 'og:type', content: 'article' }],
        ['meta', { property: 'article:published_time', content: new Date().toISOString() }],
        ['meta', { property: 'article:author', content: 'Eyre' }],
        ['meta', { property: 'article:section', content: articleSection }]
      ] : [
        ['meta', { property: 'og:type', content: 'website' }]
      ]),

      // Twitter Card
      ['meta', { name: 'twitter:card', content: 'summary_large_image' }],
      ['meta', { name: 'twitter:site', content: '@datawhalechina' }],
      ['meta', { name: 'twitter:creator', content: '@eyre' }],
      ['meta', { name: 'twitter:title', content: title }],
      ['meta', { name: 'twitter:description', content: description }],
      ['meta', { name: 'twitter:image', content: image }],
      ['meta', { name: 'twitter:image:alt', content: title }],

      // 微信分享专用标签
      ['meta', { name: 'weixin:title', content: title }],
      ['meta', { name: 'weixin:description', content: description }],
      ['meta', { name: 'weixin:image', content: image }],

      // 其他社交平台
      ['meta', { property: 'weibo:webpage:title', content: title }],
      ['meta', { property: 'weibo:webpage:description', content: description }],
      ['meta', { property: 'weibo:webpage:image', content: image }],

      // 动态关键词 - 根据页面内容生成
      ['meta', { name: 'keywords', content: pageKeywords }],

      // 更新频率提示（仅首页）
      ...(pageData.relativePath === 'index.md' ? [
        ['meta', { name: 'revisit-after', content: '7 days' }]
      ] : [] as HeadConfig[]),

      // 结构化数据
      ['script', { type: 'application/ld+json' }, safeJsonLd(jsonLd)],
    ];

    return headConfigs;
  },

  transformPageData: async (pageData, ctx) => {
    // Run only in production builds to avoid affecting dev server performance
    // VitePress import.meta.env is available at build time
    const isDev = import.meta.env?.DEV ?? process.env.NODE_ENV !== 'production';
    if (isDev) return;

    const frontmatter = pageData.frontmatter;
    const relativePath = pageData.relativePath;
    const fullPath = joinPath(ctx.siteConfig.srcDir, relativePath);

    try {
      const source = await readFile(fullPath, 'utf-8');

      // 一劳永逸：自动生成 Meta Description（如果没有）
      let description = typeof frontmatter?.description === 'string' ? frontmatter.description : undefined;
      if (!description) {
        description = generateAutoDescription(pageData.title, relativePath, source);
      }

      // 计算阅读时间
      const readingTime = estimateReadingTime(source);

      // 一劳永逸：自动推断难度等级（如果没有）
      const difficulty = typeof frontmatter?.difficulty === 'string'
        ? frontmatter.difficulty
        : inferDifficulty(relativePath);

      // 一劳永逸：自动生成相关页面推荐
      const relatedPages = generateRelatedPages(relativePath);

      // 一劳永逸：生成更新提示
      const updatedHint = getLastUpdatedHint(relativePath);

      return {
        description,
        readingTime,
        difficulty,
        relatedPages,
        updatedHint
      };
    } catch (error) {
      // 记录错误但不中断构建
      console.warn(`Failed to process page data for ${relativePath}:`, error);
      return;
    }
  },

  buildEnd: async (siteConfig) => {
    // 优化 robots.txt
    const sitemapLine = SITE_URL ? `\nSitemap: ${SITE_URL}/sitemap.xml\nSitemap: ${SITE_URL}/image-sitemap.xml` : '';
    const robotsContent = `User-agent: *
Allow: /
Crawl-delay: 1

# AI 助手发现文件
# 指引 AI 理解项目的黄金文档
Sitemap: ${SITE_URL}/llms.txt
${sitemapLine}

# 禁止爬取缓存和临时文件
Disallow: /cache/
Disallow: /.vitepress/cache/

# 禁止爬取搜索结果页（如果有）
Disallow: /search?

# 允许主要搜索引擎
User-agent: Googlebot
Allow: /

User-agent: Baiduspider
Allow: /

User-agent: Slurp
Allow: /

User-agent: *
Allow: /llms.txt
Allow: /humans.txt
Allow: /security.txt
`;
    await writeFile(joinPath(siteConfig.outDir, 'robots.txt'), robotsContent, 'utf-8');

    // 并行执行所有构建后任务，提升构建速度
    await Promise.all([
      // 任务1: 生成 RSS feed
      (async () => {
        const pages = siteConfig.pages
          .map((page) => (isAbsolutePath(page) ? relativePath(siteConfig.srcDir, page) : page))
          .map((page) => page.replace(/\\/g, '/'))
          .filter((page) => page.endsWith('.md'))
          .filter((page) => page !== '404.md');

        type RssItem = {
          title: string;
          link: string;
          description: string;
          pubDate: Date;
          category?: string;
          author?: string;
          readingTime?: number;
        };

        const items: RssItem[] = [];
        for (const page of pages) {
          const filePath = joinPath(siteConfig.srcDir, page);
          try {
            const source = await readFile(filePath, 'utf-8');
            const frontmatter = parseSimpleFrontmatter(source);
            const contentSource = stripFrontmatter(source);

            const title =
              frontmatter.title ||
              (contentSource.match(/^#\s+(.+)\s*$/m)?.[1]?.trim() || '') ||
              page.replace(/\/index\.md$/i, '').replace(/\.md$/i, '');

            const description =
              frontmatter.description ||
              extractDescriptionFromMarkdown(source) ||
              SITE_DESCRIPTION;

            const link = `${SITE_URL}${urlPathForPage(page)}`;

            const fileStats = await stat(filePath);
            const pubDateCandidate = frontmatter.date ? new Date(frontmatter.date) : undefined;
            const pubDate = pubDateCandidate && !Number.isNaN(pubDateCandidate.getTime()) ? pubDateCandidate : fileStats.mtime;

            // 提取分类信息
            let category: string | undefined;
            if (page.startsWith('Basic/')) category = '基础篇';
            else if (page.startsWith('Advanced/')) category = '进阶篇';
            else if (page.startsWith('Practice/')) category = '实践篇';
            else if (page.startsWith('Articles/')) category = '优质文章';

            // 计算阅读时间
            const readingTime = estimateReadingTime(source);

            items.push({
              title,
              link,
              description,
              pubDate,
              category,
              author: 'Eyre',
              readingTime
            });
          } catch (error) {
            // 记录错误但不中断构建
            console.warn(`Failed to process ${page} for RSS feed:`, error);
            continue;
          }
        }

        items.sort((a, b) => b.pubDate.getTime() - a.pubDate.getTime());

        const lastBuildDate = items[0]?.pubDate ?? new Date();
        const rssItemsXml = items
          .slice(0, 200)
          .map((item) => {
            const title = escapeXml(item.title);
            const link = escapeXml(item.link);
            const pubDate = escapeXml(item.pubDate.toUTCString());
            const description = safeCdata(item.description);
            const category = item.category ? `<category>${escapeXml(item.category)}</category>` : '';
            const author = item.author ? `<author>${escapeXml(item.author)}</author>` : '';
            const readingTime = item.readingTime ? `<docs:readingTime>${item.readingTime}</docs:readingTime>` : '';

            return [
              '<item>',
              `<title>${title}</title>`,
              `<link>${link}</link>`,
              `<guid isPermaLink="true">${link}</guid>`,
              `<pubDate>${pubDate}</pubDate>`,
              `<description><![CDATA[${description}]]></description>`,
              category,
              author,
              readingTime,
              '</item>'
            ].join('');
          })
          .join('');

        const channelTitle = escapeXml(SITE_TITLE);
        const channelLink = escapeXml(SITE_URL);
        const channelDescription = safeCdata(SITE_DESCRIPTION);
        const channelLanguage = 'zh-CN';
        const channelLastBuildDate = escapeXml(lastBuildDate.toUTCString());
        const channelManagingEditor = 'Eyre (contact@vibevibe.cn)';
        const channelWebMaster = 'Eyre (contact@vibevibe.cn)';
        const channelCategory = '编程教程';

        const rssXml = [
          '<?xml version="1.0" encoding="UTF-8"?>',
          '<rss version="2.0" xmlns:docs="http://example.com/docs">',
          '<channel>',
          `<title>${channelTitle}</title>`,
          `<link>${channelLink}</link>`,
          `<description><![CDATA[${channelDescription}]]></description>`,
          `<language>${channelLanguage}</language>`,
          `<lastBuildDate>${channelLastBuildDate}</lastBuildDate>`,
          `<managingEditor>${channelManagingEditor}</managingEditor>`,
          `<webMaster>${channelWebMaster}</webMaster>`,
          `<category>${channelCategory}</category>`,
          `<docs>https://www.rssboard.org/rss-specification</docs>`,
          `<generator>VibeVibe RSS Generator</generator>`,
          `<ttl>60</ttl>`,  // 缓存时间（分钟）
          rssItemsXml,
          '</channel>',
          '</rss>'
        ].join('');

        await writeFile(joinPath(siteConfig.outDir, 'rss.xml'), rssXml, 'utf-8');
      })(),

      // 任务2: 生成图片 sitemap
      buildImageSitemap(SITE_URL, joinPath(siteConfig.srcDir, 'public'), siteConfig.outDir)
    ]);
  },

  // 1. Markdown 增强配置
  markdown: {
    // 开启数学公式 ($$ E=mc^2 $$)
    math: true,
    // 语言别名，消除 gitignore/env 警告
    languageAlias: {
      'gitignore': 'ini',
      'env': 'properties'
    },
    // 注册插件
    config: (md) => {
      md.use(timeline);
      md.use(taskLists, { enabled: true });
    },
  },

  // 2. Mermaid 配置
  mermaid: {
    // refer to mermaid config options
  },


  vue: {
    template: {
      compilerOptions: {
        // 抑制 <tr> cannot be child of <table> 警告（已手动添加 <tbody>）
        onWarn(warning, defaultHandler) {
          if (warning.message.includes('cannot be child of')) return
          defaultHandler(warning)
        }
      }
    }
  },

  vite: {
    plugins: [
      
      VitePWA({
        registerType: 'autoUpdate',
        injectRegister: 'auto',
        manifestFilename: 'manifest.webmanifest',
        includeAssets: ['logo.png', 'logo.svg'],
        devOptions: {
          enabled: false
        },
        workbox: {
          maximumFileSizeToCacheInBytes: 10 * 1024 * 1024
        },
        manifest: {
          name: SITE_TITLE,
          short_name: SITE_TITLE_FRIENDLY,
          description: SITE_DESCRIPTION,
          theme_color: '#ffffff',
          background_color: '#ffffff',
          display: 'standalone',
          start_url: '/',
          scope: '/',
          icons: [
            {
              src: '/logo.svg',
              sizes: 'any',
              type: 'image/svg+xml',
              purpose: 'any'
            },
            {
              src: '/logo.png',
              sizes: '512x512',
              type: 'image/png',
              purpose: 'any'
            }
          ]
        }
      })
      
    ],
    ssr: {
      noExternal: ['vitepress-plugin-mermaid', 'mermaid']
    },
    server: {
      host: '0.0.0.0',
      port: 5173,
      strictPort: false,
      allowedHosts: true
    }
  },

  themeConfig: {
    logo: '/logo.png',
    siteTitle: SITE_TITLE_FRIENDLY,
    
    nav: [
      { text: '首页', link: '/' },

      {
        text: '基础篇',
        items: [
          { text: '欢迎来到基础版', link: '/Basic/' },
          { text: '0. 序章', link: '/Basic/00-preface/' },
          { text: '1. 觉醒：为什么现在是编程最好的时代', link: '/Basic/01-awakening/' },
          { text: '2. 心法：像产品经理一样思考', link: '/Basic/02-mindset/' },
          { text: '3. 技术：从想法到产品', link: '/Basic/03-technique/' },
          { text: '4. 从 0 到 1 实战', link: '/Basic/04-practice-0-to-1/' },
          { text: '5. 精进技能', link: '/Basic/05-advanced/' },
          { text: '附录', link: '/Basic/99-appendix/' },
          { text: '结语', link: '/Basic/100-epilogue/' },
          { text: '下部预告', link: '/Basic/101-next-part/' },
        ]
      },

      {
        text: '进阶篇',
        items: [
          { text: '序-从想法到产品的100小时', link: '/Advanced/' },
          { text: '01-环境搭建', link: '/Advanced/01-environment-setup/' },
          { text: '02-AI怎么用', link: '/Advanced/02-ai-tuning-guide/' },
          { text: '03-从需求到文档', link: '/Advanced/03-prd-doc-driven/' },
          { text: '04-必须知道的开发知识', link: '/Advanced/04-dev-fundamentals/' },
          { text: '05-好看好用的界面', link: '/Advanced/05-ui-ux/' },
          { text: '06-数据存在哪里', link: '/Advanced/06-data-persistence-database/' },
          { text: '07-连接前后端', link: '/Advanced/07-backend-api/' },
          { text: '08-谁能访问我的数据', link: '/Advanced/08-auth-security/' },
          { text: '09-功能测试', link: '/Advanced/09-testing-automation/' },
          { text: '10-公网访问', link: '/Advanced/10-localhost-public-access/' },
          { text: '11-协作开发', link: '/Advanced/11-git-collaboration/' },
          { text: '12-无服务器自动部署', link: '/Advanced/12-serverless-deploy-cicd/' },
          { text: '13-域名解析与接入', link: '/Advanced/13-domain-dns/' },
          { text: '14-部署到服务器', link: '/Advanced/14-vps-ops-deploy/' },
          { text: '15-SEO、分享与数据统计', link: '/Advanced/15-seo-analytics/' },
          { text: '16-用户反馈与产品迭代', link: '/Advanced/16-user-feedback-iteration/' },
          { text: 'Next Level', link: '/Advanced/99-next-level/' },
        ]
      },

      {
        text: '优质文章篇',
        items: [
          { text: '总览', link: '/Articles/' },
          { text: '核心概念与范式演进', link: '/Articles/01-core-concepts/' },
          { text: '基础技术与架构设计', link: '/Articles/02-technical-architecture/' },
          { text: '工具链与开发框架', link: '/Articles/03-toolchain-frameworks/' },
          { text: '工程实施与质量保障', link: '/Articles/04-engineering-practices/' },
          { text: '安全、合规与局限性', link: '/Articles/05-security-compliance/' },
          { text: '商业应用与行业趋势', link: '/Articles/06-business-trends/' },
        ]
      },

      {
        text: '实践案例篇',
        link: '/Practice/'
      },
    ],
    
    // 核心：自动生成侧边栏
    sidebar: generateSidebar({
      documentRootPath: 'docs',
      useTitleFromFrontmatter: true,
      useTitleFromFileHeading: true,
      useFolderTitleFromIndexFile: true, 
      useFolderLinkFromIndexFile: true,
      hyphenToSpace: true,
      sortMenusByFrontmatterOrder: true,
      frontmatterOrderDefaultValue: 9999,
      
      manualSortFileNameByPriority: [
        'Basic', 'Advanced', 'Practice', 'Articles',
        'Basic/00-preface', 'Basic/01-awakening', 'Basic/02-mindset', 'Basic/03-technique',
        'Basic/04-practice-0-to-1', 'Basic/05-advanced', 'Basic/06-learning-paths',
        'Basic/99-appendix', 'Basic/100-epilogue', 'Basic/101-next-part',
        'Advanced/01-environment-setup', 'Advanced/02-ai-tuning-guide', 'Advanced/03-prd-doc-driven',
        'Advanced/04-dev-fundamentals', 'Advanced/05-ui-ux', 'Advanced/06-data-persistence-database',
        'Advanced/07-backend-api', 'Advanced/08-auth-security', 'Advanced/09-testing-automation',
        'Advanced/10-localhost-public-access', 'Advanced/11-git-collaboration', 'Advanced/12-serverless-deploy-cicd',
        'Advanced/13-domain-dns', 'Advanced/14-vps-ops-deploy', 'Advanced/15-seo-analytics', 'Advanced/16-user-feedback-iteration',
        'Advanced/99-next-level',
        'Practice/01-for-liberal-arts', 'Practice/02-for-stem', 'Practice/03-for-professionals',
        'Practice/10-core-skills', 'Practice/11-ai-agents', 'Practice/12-fullstack-projects', 'Practice/13-tools-integration',
        'Articles/01-core-concepts', 'Articles/02-technical-architecture', 'Articles/03-toolchain-frameworks',
        'Articles/04-engineering-practices', 'Articles/05-security-compliance', 'Articles/06-business-trends'
      ],
      
      collapsed: true,
      excludePattern: ['public', 'assets', 'docs'], 
    }),

    // editLink: {
    //   pattern: 'https://github.com/Eyre921/awesone-vibe-coding-tutorial/edit/main/docs/:path',
    //   text: '在 GitHub 上编辑此页'
    // },

    lastUpdated: {
      text: '最后更新于',
      formatOptions: {
        dateStyle: 'short',
        timeStyle: 'short'
      }
    },

    docFooter: {
      prev: '上一篇',
      next: '下一篇'
    },

    outline: {
      label: '页面导航',
      level: [2, 3]
    },

    returnToTopLabel: '回到顶部',
    sidebarMenuLabel: '菜单',
    darkModeSwitchLabel: '主题',
    lightModeSwitchTitle: '切换到浅色模式',
    darkModeSwitchTitle: '切换到深色模式',

    search: {
      provider: 'local',
      options: {
        translations: {
          button: {
            buttonText: '搜索文档',
            buttonAriaLabel: '搜索文档'
          },
          modal: {
            noResultsText: '无法找到相关结果',
            resetButtonTitle: '清除查询条件',
            footer: {
              selectText: '选择',
              navigateText: '切换'
            }
          }
        }
      }
    },

    socialLinks: [
      { icon: 'github', link: 'https://github.com/datawhalechina/vibe-vibe' }
    ],

    // footer: {
    //   message: '',
    //   copyright: ''
    // },
  }
}))
