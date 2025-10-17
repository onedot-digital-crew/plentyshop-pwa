<template>
  <div data-testid="product-accordion">
    <UiAccordionItem
      v-if="productGetters.getDescription(product)?.length"
      v-model="productDetailsOpen"
      summary-class="w-full py-6 px-4 flex justify-between items-center select-none"
      class="border-b transition"
      :class="[
          productDetailsOpen ? 'border-gray-600' : 'border-gray-200'
      ]"
    >
      <template #summary>
        <h2 
            class="font-bold text-xs transition hover:text-black"
            :class="[
                productDetailsOpen ? 'text-black' : 'text-gray-600'
            ]"
        >
          {{ t('productDetails') }}
        </h2>
      </template>
      <div class="no-preflight" v-html="productGetters.getDescription(product)" />
    </UiAccordionItem>
    <UiAccordionItem
      v-if="productGetters.getTechnicalData(product)?.length"
      v-model="technicalDataOpen"
      summary-class="w-full py-6 px-4 flex justify-between items-center select-none"
      class="border-b"
      :class="[
          technicalDataOpen ? 'border-gray-600' : 'border-gray-200'
      ]"
    >
      <template #summary>
        <h2 
            class="font-bold text-xs transition hover:text-black"
            :class="[
                technicalDataOpen ? 'text-black' : 'text-gray-600'
            ]"
        >
          {{ t('technicalData') }}
        </h2>
      </template>
      <div class="no-preflight" v-html="productGetters.getTechnicalData(product)" />
    </UiAccordionItem>
  </div>
</template>

<script setup lang="ts">
import { productGetters } from '@plentymarkets/shop-api';
import type { ProductAccordionPropsType } from './types';

const props = defineProps<ProductAccordionPropsType>();

const { product } = toRefs(props);
const { t } = useI18n();

const productDetailsOpen = ref(true);
const technicalDataOpen = ref(false);
</script>