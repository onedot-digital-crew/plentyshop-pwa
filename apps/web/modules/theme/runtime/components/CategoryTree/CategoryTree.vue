<template>
  <div
    v-if="parent || (categoryTreeItem && categoryTreeGetters.getItems(categoryTreeItem)?.length)"
    class="category-tree overflow-hidden"
  >
    <NarrowContainer class="!mt-0">
        <SfScrollable
            v-if="categoryTreeItem"
            buttons-placement="floating"
            class="pb-4 scrollbar-hidden"
            :wrapper-class="'test'"
            data-testid="categories"
        >
            <CategoryTreeItem
                v-for="(categoryItem, index) in categoryTreeGetters.getItems(categoryTreeItem)"
                :key="index"
                :name="categoryTreeGetters.getName(categoryItem)"
                :href="localePath(buildCategoryMenuLink(categoryItem, categoryTree))"
                :count="categoryTreeGetters.getCount(categoryItem)"
            />
        </SfScrollable>
    </NarrowContainer>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { categoryGetters, categoryTreeGetters, type CategoryTreeItem } from '@plentymarkets/shop-api';
import { SfScrollable } from '@storefront-ui/vue';
import type { CategoryTreeProps } from './types';

// Get category tree data from props or use empty array
interface ExtendedCategoryTreeProps extends CategoryTreeProps {
  categoryTreeData?: CategoryTreeItem[];
}

const props = defineProps<ExtendedCategoryTreeProps>();

// Use category tree from props if provided
const categoryTree = computed<CategoryTreeItem[]>(() => {
  return props.categoryTreeData || [];
});

// Generate category link that maintains the hierarchy
const buildCategoryMenuLink = (category: CategoryTreeItem, tree: CategoryTreeItem[]) => {
  // Use the categoryTreeGetters to generate the correct full path
  return categoryTreeGetters.generateCategoryLink(tree, category, '');
};

// Simplified localization functions
const localePath = (path: string) => path;
const t = (key: string) => {
  const translations: Record<string, string> = {
    category: 'Kategorie'
  };
  return translations[key] || key;
};

const categoryTreeItem = computed(() => {
  if (!categoryTree.value.length) return null;
  return categoryTreeGetters.findCategoryById(categoryTree.value, categoryGetters.getId(props.category));
});

const parent = computed(() => {
  if (!categoryTree.value.length) return null;
  return categoryTreeGetters.findCategoryById(categoryTree.value, categoryGetters.getParentId(props.category));
});
</script>