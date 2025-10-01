import {
  useLogger,
  defineNuxtModule,
  createResolver,
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
        (config.theme.extend.colors as TailwindColors)['primary']['500'] = '#000';
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
        uiButton.filePath = resolve('./runtime/components/UiButton.vue');
      }
      const textContent = components.find((c) => c.pascalName === 'TextContent');
      if (textContent) {
        textContent.filePath = resolve('./runtime/components/TextContent.vue');
      }
    });
  },
});
