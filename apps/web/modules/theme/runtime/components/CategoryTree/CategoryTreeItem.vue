<template>
  <SfListItem
    v-if="name.length > 0"
    size="lg"
    class="bg-secondary-500 hover:bg-secondary-800 transition !w-40 lg:!w-64 !p-0"
    data-testid="category-tree-item"
  >
    <NuxtLink :to="localePath(href)">
    <span class="aspect-video block w-full border-b-2 border-white"/>
      <span class="flex gap-2 items-center text-xs uppercase text-white justify-center p-3">
        <span class="flex text-white items-center" data-testid="list-item-menu-label">
          <slot />
          {{ name }}
        </span>
        <SfCounter v-if="Number(count) > -1" class="text-white">{{ count }}</SfCounter>
      </span>
    </NuxtLink>
  </SfListItem>
</template>

<script setup lang="ts">
import { SfCounter, SfIconCheck, SfListItem } from '@storefront-ui/vue';
import type { CategoryTreeItemType } from './types';
// Simplified localization for theme
const localePath = (path: string) => path;

defineProps<CategoryTreeItemType>();
</script>