import {
  useLogger,
  defineNuxtModule,
  createResolver,
  addPlugin,
} from '@nuxt/kit';
import type { TailwindColors } from './types';
import type { Config as TailwindConfig } from 'tailwindcss/types/config';

export default defineNuxtModule({
  meta: {
    name: '@plentymarkets/pwa-module-boilerplate',
    configKey: 'pwa-module-boilerplate',
  },
  defaults: {},
  async setup(options, nuxt) {
    const { resolve } = createResolver(import.meta.url);
    const logger = useLogger('pwa-module-boilerplate');

    // Add custom CSS file
    nuxt.options.css.push(resolve('./runtime/assets/styles.css'));

    /**
     * Hook to modify the TailwindCSS configuration
     */
    nuxt.hook('tailwindcss:config', (config: Partial<TailwindConfig>) => {
      // Add the runtime components to the TailwindCSS content to enable Tailwind classes in the components
      if (config.content && Array.isArray(config.content)) {
        (config.content as string[]).push(resolve('./runtime/**/*.{vue,mjs,ts}'));
        (config.content as string[]).push(resolve('./runtime/**/*.{mjs,js,ts}'));
      }

      // Override the primary-500 color
      if (config?.theme?.extend?.colors) {
        // Ensure gray object exists
        if (!(config.theme.extend.colors as TailwindColors)['gray']) {
          (config.theme.extend.colors as TailwindColors)['gray'] = {};
        }
        (config.theme.extend.colors as TailwindColors)['gray']['100'] = '#F7F7F7';
        (config.theme.extend.colors as TailwindColors)['gray']['200'] = '#D6D6D6';
        (config.theme.extend.colors as TailwindColors)['gray']['300'] = '#ACACAC';
        (config.theme.extend.colors as TailwindColors)['gray']['600'] = '#6A6A6A';
        (config.theme.extend.colors as TailwindColors)['gray']['800'] = '#5A5A5A';
      }

      // Set custom font sizes
      if (config?.theme?.extend) {
        if (!config.theme.extend.fontSize) {
          config.theme.extend.fontSize = {};
        }
        (config.theme.extend.fontSize as Record<string, [string, string]>)['72'] = ['72px', '1.111em'];
        (config.theme.extend.fontSize as Record<string, [string, string]>)['56'] = ['56px', '1.143em'];
        (config.theme.extend.fontSize as Record<string, [string, string]>)['48'] = ['48px', '1.167em'];
        (config.theme.extend.fontSize as Record<string, [string, string]>)['44'] = ['44px', '1.227em'];
        (config.theme.extend.fontSize as Record<string, [string, string]>)['36'] = ['36px', '1.222em'];
        (config.theme.extend.fontSize as Record<string, [string, string]>)['34'] = ['34px', '1.294em'];
        (config.theme.extend.fontSize as Record<string, [string, string]>)['28'] = ['28px', '1.214em'];
        (config.theme.extend.fontSize as Record<string, [string, string]>)['26'] = ['26px', '1.385em'];
        (config.theme.extend.fontSize as Record<string, [string, string]>)['24'] = ['24px', '1.5em'];
        (config.theme.extend.fontSize as Record<string, [string, string]>)['22'] = ['22px', '1.182em'];
        (config.theme.extend.fontSize as Record<string, [string, string]>)['18'] = ['18px', '1.333em'];
        (config.theme.extend.fontSize as Record<string, [string, string]>)['16'] = ['16px', '1.5em'];
        (config.theme.extend.fontSize as Record<string, [string, string]>)['14'] = ['14px', '1.429em'];
        (config.theme.extend.fontSize as Record<string, [string, string]>)['12'] = ['12px', '1.667em'];
      }

      // Set custom transition duration to 400ms
      if (config?.theme?.extend) {
        if (!config.theme.extend.transitionDuration) {
          config.theme.extend.transitionDuration = {};
        }
        (config.theme.extend.transitionDuration as Record<string, string>)['DEFAULT'] = '400ms';
      }

      // Set custom width for w-88
      if (config?.theme?.extend) {
        if (!config.theme.extend.width) {
          config.theme.extend.width = {};
        }
        (config.theme.extend.width as Record<string, string>)['88'] = '22rem';
      }
    });

    /**
     * Register the module specific language files to the existing i18n module
     */
    nuxt.hook('i18n:registerModule', (register) => {
      register({
        langDir: resolve('./runtime/lang'),
        locales: [
          {
            code: 'en',
            file: 'en.json',
          },
          {
            code: 'de',
            file: 'de.json',
          },
        ],
      });
    });

    /**
     * Ready hook to log a message when the module is ready
     */
    nuxt.hook('ready', () => {
      logger.info('pwa-module-boilerplate is ready');
    });

    nuxt.hook('components:extend', (components) => {
      const uiButton = components.find((c) => c.pascalName === 'UiButton');
      if (uiButton) {
        uiButton.filePath = resolve('./runtime/components/ui/Button.vue');
      }
      const uiProductCard = components.find((c) => c.pascalName === 'UiProductCard');
      if (uiProductCard) {
        uiProductCard.filePath = resolve('./runtime/components/ui/ProductCard.vue');
      }
      const blocksBannerCarouselBanner = components.find((c) => c.pascalName === 'BlocksBannerCarouselBanner');
      if (blocksBannerCarouselBanner) {
        blocksBannerCarouselBanner.filePath = resolve('./runtime/components/blocks/BannerCarousel/Banner.vue');
      }
      const blocksStructureMultiGrid = components.find((c) => c.pascalName === 'BlocksStructureMultiGrid');
      if (blocksStructureMultiGrid) {
        blocksStructureMultiGrid.filePath = resolve('./runtime/components/blocks/structure/MultiGrid.vue');
      }
      const blocksItemGrid = components.find((c) => c.pascalName === 'BlocksItemGrid');
      if (blocksItemGrid) {
        blocksItemGrid.filePath = resolve('./runtime/components/blocks/ItemGrid/ItemGrid.vue');
      }
      const blocksSortFilter = components.find((c) => c.pascalName === 'BlocksSortFilter');
      if (blocksSortFilter) {
        blocksSortFilter.filePath = resolve('./runtime/components/blocks/SortFilter/SortFilter.vue');
      }
      const categorySorting = components.find((c) => c.pascalName === 'CategorySorting');
      if (categorySorting) {
        categorySorting.filePath = resolve('./runtime/components/CategorySorting.vue');
      }
      const textContent = components.find((c) => c.pascalName === 'TextContent');
      if (textContent) {
        textContent.filePath = resolve('./runtime/components/TextContent.vue');
      }
      const categoryFiltersSort = components.find((c) => c.pascalName === 'CategoryFiltersSort');
      if (categoryFiltersSort) {
        categoryFiltersSort.filePath = resolve('./runtime/components/CategoryFilters/Sort.vue');
      }
      const categoryFiltersSortSections = components.find((c) => c.pascalName === 'CategoryFiltersSortSections');
      if (categoryFiltersSortSections) {
        categoryFiltersSortSections.filePath = resolve('./runtime/components/CategoryFilters/SortSections.vue');
      }
      const categoryFiltersCategoryFilter = components.find((c) => c.pascalName === 'CategoryFiltersCategoryFilter');
      if (categoryFiltersCategoryFilter) {
        categoryFiltersCategoryFilter.filePath = resolve('./runtime/components/CategoryFilters/CategoryFilter.vue');
      }
      const categoryFiltersFilter = components.find((c) => c.pascalName === 'CategoryFiltersFilter');
      if (categoryFiltersFilter) {
        categoryFiltersFilter.filePath = resolve('./runtime/components/CategoryFilters/Filter.vue');
      }
      const categorySidebar = components.find((c) => c.pascalName === 'CategorySidebar');
      if (categorySidebar) {
        categorySidebar.filePath = resolve('./runtime/components/CategorySidebar.vue');
      }
      const productSlider = components.find((c) => c.pascalName === 'ProductSlider');
      if (productSlider) {
        productSlider.filePath = resolve('./runtime/components/ProductSlider.vue');
      }
    });
  },
});
