<template>
  <div :style="inlineStyle" data-testid="category-data">
    <template v-for="key in content.fieldsOrder" :key="key">
      <template v-if="isFieldEnabled(key)">
        <div class="bg-gray-800 py-10 relative lg:-mt-14 lg:pt-5">
          <div
            v-if="key.toString() === 'image' || categoryImage"
            :key="key"
            class="absolute inset-0"
            data-testid="category-image"
          >
            <img
              :src="categoryImage || undefined"
              :alt="name"
              class="w-full h-full object-cover"
              loading="lazy"
            />
          </div>
          <div class="bg-gradient-to-b from-black/60 to-black/95 absolute inset-0"/>
          <NarrowContainer class="!mt-0 relative z-20 text-white">
            <div v-if="breadcrumbs?.length" class="mb-10 max-lg:hidden">
              <UiBreadcrumbs :whitecolor="true" :breadcrumbs="breadcrumbs" />
            </div>
            <h1
              v-if="key === 'name' && name"
              :key="key"
              class="font-bold text-m uppercase mb-2"
              data-testid="category-name"
            >
              {{ name }}
            </h1>
            <p
              v-if="key === 'description1' || description1"
              :key="key"
              data-testid="category-description-1"
              class="max-w-2xl text-white text-base max-md:line-clamp-3"
              v-html="description1"
            />
          </NarrowContainer>
        </div>

        <!-- <p
          v-if="key === 'description2' || description2"
          :key="key"
          data-testid="category-description-2"
          v-html="description2"
        />

        <p
          v-if="key === 'shortDescription' || shortDescription"
          :key="key"
          data-testid="category-short-description"
          v-html="shortDescription"
        /> -->
      </template>
    </template>
    <CategoryTree
      v-if="productsCatalog.category"
      :category="productsCatalog.category"
      :category-tree-data="categoryTreeState.data"
      class="mt-5 lg:mt-16"
    />
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { type Category, categoryGetters, type CategoryTreeItem } from '@plentymarkets/shop-api';
import { useRuntimeConfig, useRoute, useState } from 'nuxt/app';
import type { CategoryDataProps } from '~/components/blocks/CategoryData/types';

const props = defineProps<CategoryDataProps>();

// Get the real category tree data from the same state as the core app uses
const categoryTreeState = useState<{ data: CategoryTreeItem[] }>('useCategoryTree', () => ({ data: [] }));

// Use props.category directly for CategoryTree (Theme version includes it)
const productsCatalog = computed(() => ({
  category: props.category && Object.keys(props.category).length > 0 ? props.category : null
}));

const category = computed(() => props.category || ({} as Category));

const name = computed(() => categoryGetters.getCategoryName(category.value) || '');
const description1 = computed(() => categoryGetters.getCategoryDescription1(category.value) || '');

// Simple breadcrumbs fallback
const route = useRoute();

const breadcrumbs = computed(() => {
  // Generate simple breadcrumbs if we have category data
  if (category.value) {
    const breadcrumb = [];
    const categoryName = categoryGetters.getCategoryName(category.value);

    // Add home link
    breadcrumb.push({ name: 'Home', link: '/' });

    // Add current category
    if (categoryName) {
      breadcrumb.push({ name: categoryName, link: route.path });
    }

    return breadcrumb;
  }

  return [];
});

const runtimeConfig = useRuntimeConfig();
const domain = runtimeConfig.public?.domain ?? '';

const categoryImage = computed(() => {
  const categoryDetails = categoryGetters.getCategoryDetails(category.value);
  let imagePath = '';

  // Check for image path in category details
  if (categoryDetails && categoryDetails.imagePath) {
    imagePath = categoryDetails.imagePath;
  } else if (categoryDetails && categoryDetails.plenty_category_details_image_path) {
    imagePath = categoryDetails.plenty_category_details_image_path;
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

// Helper function to check if a field is enabled (supports both core and theme data structures)
const isFieldEnabled = (key: string) => {
  return Boolean(props.content.fields[key as keyof typeof props.content.fields]);
};

const inlineStyle = computed(() => {
  const layout = props.content.layout || {
    paddingTop: 0,
    paddingBottom: 0,
    paddingLeft: 0,
    paddingRight: 0,
  };

  return {
    marginTop: layout.paddingTop ? `${layout.paddingTop}px` : 0,
    marginBottom: layout.paddingBottom ? `${layout.paddingBottom}px` : 0,
    marginLeft: layout.paddingLeft ? `${layout.paddingLeft}px` : 0,
    marginRight: layout.paddingRight ? `${layout.paddingRight}px` : 0,
  };
});
</script>
