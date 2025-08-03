import type {SidebarsConfig} from '@docusaurus/plugin-content-docs';

const sidebars: SidebarsConfig = {
  docs: [
    {
      type: 'doc',
      id: 'README',
      label: 'Home',
    },
    {
      type: 'doc',
      id: 'getting-started',
      label: 'Getting started',
    },
    {
      type: 'doc',
      id: 'tutorial-demo-project',
      label: 'Tutorial: Demo Project',
    },
    {
      type: 'doc',
      id: 'entity-annotations',
      label: 'Entity Annotations',
    },
    {
      type: 'category',
      label: 'Android (Java/Kotlin)',
      link: {
        type: 'doc',
        id: 'android/README',
      },
      items: [
        {
          type: 'doc',
          id: 'android/android-local-unit-tests',
          label: 'Android Local Unit Tests',
        },
        {
          type: 'doc',
          id: 'android/livedata-architecture-components',
          label: 'LiveData (Arch. Comp.)',
        },
        {
          type: 'doc',
          id: 'android/paging-architecture-components',
          label: 'Paging (Arch. Comp.)',
        },
        {
          type: 'doc',
          id: 'android/app-bundle-and-split-apk',
          label: 'App Bundle, split APKs and LinkageError',
        },
        {
          type: 'doc',
          id: 'android/greendao-compat',
          label: 'greenDAO Compat',
        },
      ],
    },
    {
      type: 'doc',
      id: 'java-desktop-apps',
      label: 'Desktop Apps',
    },
    {
      type: 'doc',
      id: 'kotlin-support',
      label: 'Kotlin Support',
    },
    {
      type: 'doc',
      id: 'queries',
      label: 'ObjectBox Queries',
    },
    {
      type: 'doc',
      id: 'on-device-vector-search',
      label: 'On-Device Vector Search',
    },
    {
      type: 'doc',
      id: 'data-observers-and-rx',
      label: 'Data Observers & Rx',
    },
    {
      type: 'doc',
      id: 'relations',
      label: 'Relations',
    },
    {
      type: 'doc',
      id: 'data-browser',
      label: 'ObjectBox Admin',
    },
    {
      type: 'doc',
      id: 'transactions',
      label: 'Transactions',
    },
    {
      type: 'category',
      label: 'Advanced',
      link: {
        type: 'doc',
        id: 'advanced/README',
      },
      items: [
        {
          type: 'doc',
          id: 'advanced/advanced-setup',
          label: 'Advanced Setup',
        },
        {
          type: 'doc',
          id: 'advanced/object-ids',
          label: 'Object IDs',
        },
        {
          type: 'doc',
          id: 'advanced/custom-types',
          label: 'Custom Types',
        },
        {
          type: 'doc',
          id: 'advanced/entity-inheritance',
          label: 'Entity Inheritance',
        },
        {
          type: 'doc',
          id: 'advanced/data-model-updates',
          label: 'Data Model Updates',
        },
        {
          type: 'doc',
          id: 'advanced/meta-model-ids-and-uids',
          label: 'Meta Model, IDs, and UIDs',
        },
      ],
    },
    {
      type: 'doc',
      id: 'faq',
      label: 'FAQ',
    },
    {
      type: 'doc',
      id: 'troubleshooting',
      label: 'Troubleshooting',
    },
    {
      type: 'doc',
      id: 'changelogs',
      label: 'Changelogs',
    },
    {
      type: 'doc',
      id: 'release-history',
      label: 'Java Release History (≤ v1.5)',
    },
    // Separator for external links section
    {
      type: 'html',
      value: '<hr style="margin: 1rem 0; border: none; border-top: 1px solid #d1d5db;" />',
    },
    {
      type: 'link',
      label: 'Java API reference',
      href: 'https://objectbox.io/docfiles/java/current/',
    },
    {
      type: 'link',
      label: 'Dart API reference',
      href: 'https://pub.dev/documentation/objectbox/latest/',
    },
    {
      type: 'link',
      label: 'Python API reference',
      href: 'https://objectbox.io/docfiles/python/current/',
    },
    {
      type: 'link',
      label: 'Binary License',
      href: 'https://objectbox.io/license/',
    },
    {
      type: 'link',
      label: 'Data Sync',
      href: 'https://sync.objectbox.io/',
    },
    {
      type: 'link',
      label: 'Swift Database for iOS',
      href: 'https://swift.objectbox.io/',
    },
    {
      type: 'link',
      label: 'C++ Database Docs',
      href: 'https://cpp.objectbox.io/',
    },
  ],
};

export default sidebars;
