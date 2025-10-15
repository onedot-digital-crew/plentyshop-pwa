<template>
  <div :style="inlineStyle" data-testid="category-data">
    <template v-for="key in content.fieldsOrder" :key="key">
      <template v-if="isFieldEnabled(key)">
        <h1
          v-if="key === 'name' && name"
          :key="key"
          class="font-bold typography-headline-3 md:typography-headline-2"
          data-testid="category-name"
        >
          {{ name }}
        </h1>

        <div
          v-if="key.toString() === 'image' && categoryImage"
          :key="key"
          class="mt-4 mb-6"
          data-testid="category-image"
        >
          <img
            :src="categoryImage"
            :alt="name"
            class="w-full h-auto rounded-lg shadow-sm"
            loading="lazy"
          />
        </div>
        <p
          v-if="key === 'description1' && description1"
          :key="key"
          data-testid="category-description-1"
          v-html="description1"
        />

        <p
          v-if="key === 'description2' && description2"
          :key="key"
          data-testid="category-description-2"
          v-html="description2"
        />

        <p
          v-if="key === 'shortDescription' && shortDescription"
          :key="key"
          data-testid="category-short-description"
          v-html="shortDescription"
        />
      </template>
    </template>
    <CategoryTree v-if="productsCatalog.category" :category="productsCatalog.category" />
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { type Category, categoryGetters } from '@plentymarkets/shop-api';
import { useRuntimeConfig } from 'nuxt/app';
import type { CategoryDataProps } from './types';

const props = defineProps<CategoryDataProps>();



// Use props.category directly for CategoryTree (Theme version includes it)
const productsCatalog = computed(() => ({
  category: props.category || null
}));

const category = computed(() => props.category || ({} as Category));

const name = computed(() => categoryGetters.getCategoryName(category.value) || '');
const description1 = computed(() => categoryGetters.getCategoryDescription1(category.value) || '');
const description2 = computed(() => categoryGetters.getCategoryDescription2(category.value) || '');
const shortDescription = computed(() => categoryGetters.getCategoryShortDescription(category.value) || '');

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
  return imagePath.startsWith('http') ? imagePath : domain + imagePath;
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
