<template>
  <nav 
    data-testid="breadcrumbs" 
    class="inline-flex items-center text-sm font-normal"
    :class="{ 'text-white': whitecolor }"
  >
    <ol class="flex w-auto leading-none group md:flex-wrap">
      <li class="flex items-center sm:hidden z-9" :class="whitecolor ? 'text-white/70' : 'text-neutral-500'">
        <NuxtLazyHydrate :on-interaction="['click', 'touchstart']">
          <SfDropdown v-model="dropdownOpened" strategy="absolute" placement="bottom-start" @update:model-value="close">
            <template #trigger>
              <UiButton
                class="relative w-5 h-5 !p-0 rounded-sm outline-secondary-600 hover:bg-transparent active:bg-transparent"
                :aria-label="t('breadcrumbsDropdownText')"
                variant="tertiary"
                square
                data-testid="breadcrumbs-dropdown-button"
                @click="toggle"
              >
                <template #prefix>
                  <SfIconMoreHoriz
                    size="sm"
                    :class="whitecolor ? 'text-white/70 hover:text-white active:text-white' : 'text-neutral-500 hover:text-primary-500 active:text-primary-800'"
                    class="active:bg-transparent"
                  />
                </template>
              </UiButton>
            </template>
            <ol class="px-4 py-2 rounded-md shadow-md border-neutral-100 bg-white" data-testid="breadcrumbs-dropdown">
              <li v-for="item in breadcrumbs" :key="item.name" class="py-2 last-of-type:hidden">
                <SfLink
                  :tag="NuxtLink"
                  :to="localePath(item.link)"
                  variant="secondary"
                  class="leading-5 no-underline text-inherit hover:underline active:underline whitespace-nowrap outline-secondary-600"
                >
                  {{ item.name }}
                </SfLink>
              </li>
            </ol>
          </SfDropdown>
        </NuxtLazyHydrate>
      </li>
      <li
        v-for="(item, index) in breadcrumbs"
        :key="item.name"
        class="peer hidden sm:flex items-center peer-[:nth-of-type(even)]:before:content-['/'] peer-[:nth-of-type(even)]:before:px-2 peer-[:nth-of-type(even)]:before:leading-5 last-of-type:flex last-of-type:before:font-normal last-of-type:font-medium"
        :class="[
          whitecolor 
            ? 'text-white/70 last-of-type:text-white last-of-type:before:text-white/50' 
            : 'text-neutral-500 last-of-type:text-neutral-900 last-of-type:before:text-neutral-500'
        ]"
      >
        <SfLink
          v-if="index < breadcrumbs.length - 1"
          :tag="NuxtLink"
          :to="localePath(item.link)"
          variant="secondary"
          class="leading-5 no-underline hover:underline active:underline whitespace-nowrap outline-secondary-600 text-inherit"
        >
          {{ item.name }}
        </SfLink>
        <span v-else>
          {{ item.name }}
        </span>
      </li>
    </ol>
  </nav>
</template>

<script setup lang="ts">
import { ref, resolveComponent } from 'vue';
import { SfDropdown, SfLink, SfIconMoreHoriz } from '@storefront-ui/vue';
import { useRoute, useHead } from 'nuxt/app';
import type { BreadcrumbsProps } from './types';

const { breadcrumbs, whitecolor = false } = defineProps<BreadcrumbsProps>();

// Simplified localization - you can enhance this later
const localePath = (path: string) => path;
const t = (key: string) => {
  const translations: Record<string, string> = {
    breadcrumbsDropdownText: 'Show all breadcrumbs'
  };
  return translations[key] || key;
};

const dropdownOpened = ref(false);
const close = () => {
  dropdownOpened.value = false;
};
const toggle = () => {
  dropdownOpened.value = !dropdownOpened.value;
};

const NuxtLink = resolveComponent('NuxtLink');
const route = useRoute();
const items = route.path.split('/');
const itemListElement = [] as Array<unknown>;
let name = '';
items.forEach((item, index) => {
  name += item;
  if (index === 0) {
    itemListElement.push({
      '@type': 'ListItem',
      position: 1,
      item: {
        '@id': '/',
        name: 'Home',
      },
    });
  } else {
    itemListElement.push({
      '@type': 'ListItem',
      position: index,
      item: {
        '@id': `/${name}/`,
        name: `${item}`,
      },
    });
  }
});

const structuredData = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement,
};
useHead({
  script: [
    {
      type: 'application/ld+json',
      innerHTML: JSON.stringify(structuredData),
    },
  ],
});
</script>