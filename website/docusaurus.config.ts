import {themes as prismThemes} from 'prism-react-renderer';
import type {Config} from '@docusaurus/types';
import type * as Preset from '@docusaurus/preset-classic';

const config: Config = {
  title: 'Java, Kotlin, Flutter / Dart Docs for ObjectBox Database',
  tagline: 'Efficiently persist data on Android, any mobile, or edge system - minimal resource use with maximum speed',
  favicon: 'img/favicon.ico',

  url: 'https://docs.objectbox.io/',
  baseUrl: '/',

  organizationName: 'objectbox', 
  projectName: 'objectbox-java-kotlin-flutter-dart-docs',

  onBrokenLinks: 'throw',
  onBrokenMarkdownLinks: 'warn',

  i18n: {
    defaultLocale: 'en',
    locales: ['en'],
  },

 presets: [
  [
    'classic',
    {
      docs: {
        routeBasePath: '/',                      // serve docs at /
        sidebarPath: require.resolve('./sidebars.ts'),
        editUrl:
          'https://github.com/objectbox/objectbox-c-cpp-docs/blob/main/website/',
      },
      // If you don't need a blog, you can disable it:
      blog: false,
      theme: {
        customCss: [
          require.resolve('./src/css/custom.css'),
        ],
      },
      gtag: {                    
        trackingID: 'G-PNBER16ZJB',
        anonymizeIP: true,
      },
    } satisfies Preset.Options,
  ],
],

themes: [
  [
    '@easyops-cn/docusaurus-search-local',
    {
      hashed: true,
      language: ['en'],
      highlightSearchTermsOnTargetPage: true,
      explicitSearchResultPath: false,  // Changed from true - this can cause 404s
      indexDocs: true,
      indexBlog: false,
      indexPages: true,
      docsRouteBasePath: '/',
      searchResultLimits: 8,
      searchResultContextMaxLength: 50,
      ignoreFiles: [],
    },
  ],
],



themeConfig: {
  image: 'img/objectbox-social-card.jpg',
  navbar: {
    title: 'ObjectBox Java, Kotlin, and Flutter / Dart',
    logo: {
      alt: 'ObjectBox Logo',
      src: 'img/objectbox-logo.jpg',
      srcDark: 'img/objectbox-logo-dm.png', // Logo for dark mode
    },
    items: [
      // Right side items in the order you want them to appear:
      {
        href: 'https://objectbox.io',
        label: 'ObjectBox.io',
        position: 'right',
        //target: '_self', // ← This prevents external link behavior
      },
      {
        href: 'https://docs.objectbox.io/sync',
        label: 'Data Sync Docs', 
        position: 'right',
        //  target: '_self', // ← This prevents external link behavior
      },
      {
        href: 'https://objectbox.io/blog/',
        label: 'Blog',
        position: 'right',
        //target: '_self', // ← This prevents external link behavior
      },
      {
        href: 'https://twitter.com/objectbox_io',
        label: 'Follow us',
        position: 'right',
        //target: '_self', // ← This prevents external link behavior
      },
      {
        href: 'https://github.com/objectbox',
        label: 'GitHub',
        position: 'right',
        //target: '_self', // ← This prevents external link behavior
      },
      
    ],
  },
  copyright: `© ${new Date().getFullYear()} ObjectBox`,
  prism: {
    theme: prismThemes.github,
    darkTheme: prismThemes.dracula,
    additionalLanguages: [
      'cmake', 'bash', 'c', 'cpp',
      'swift', 'kotlin', 'java', 'python', 
      'dart', 'go', 'protobuf'
    ],
  },

  } satisfies Preset.ThemeConfig,
};

export default config;
