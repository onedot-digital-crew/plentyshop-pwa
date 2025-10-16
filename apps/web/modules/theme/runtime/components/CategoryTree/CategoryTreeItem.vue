<template>
  <SfListItem
    v-if="name.length > 0"
    size="lg"
    class="bg-secondary-500 hover:bg-secondary-800 transition !w-40 lg:!w-64 !p-0 shrink-0"
    data-testid="category-tree-item"
  >
    <NuxtLink :to="localePath(href)">
        <span class="aspect-video block w-full border-b-2 border-white relative overflow-hidden">
            <img
              v-if="categoryImage"
              :src="categoryImage"
              :alt="name"
              class="w-full h-full object-cover"
              loading="lazy"
            />
            <div v-else class="w-full h-full bg-gray-400 flex items-center justify-center text-gray-600">
              <span class="text-xs">No Image</span>
            </div>
        </span>
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
import { computed } from 'vue';
import { SfCounter, SfListItem } from '@storefront-ui/vue';
import { useRuntimeConfig } from 'nuxt/app';
import type { CategoryTreeItemType } from './types';

// Simplified localization for theme
const localePath = (path: string) => path;

const props = defineProps<CategoryTreeItemType>();

const runtimeConfig = useRuntimeConfig();
const domain = runtimeConfig.public?.domain ?? '';

const categoryImage = computed(() => {
  if (!props.category || !props.category.details || !props.category.details.length) return null;
  
  // Get the first detail entry (assuming it's the current language)
  const categoryDetail = props.category.details[0];
  let imagePath = '';
  
  // Check for image path in category details
  if (categoryDetail && categoryDetail.imagePath) {
    imagePath = categoryDetail.imagePath;
  } else if (categoryDetail && categoryDetail.image2Path) {
    imagePath = categoryDetail.image2Path;
  }
  
  if (!imagePath) return null;
  
  // Handle relative vs absolute URLs
  if (imagePath.startsWith('http')) {
    return imagePath;
  } else {
    // Ensure the path includes /documents/ before category/
    const cleanPath = imagePath.startsWith('/') ? imagePath.slice(1) : imagePath;
    return domain + '/documents/' + cleanPath;
  }
});
</script>