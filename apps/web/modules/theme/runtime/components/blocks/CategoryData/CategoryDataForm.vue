<template>
  <div>
    <UiAccordionItem
      v-model="textOpen"
      summary-active-class="bg-neutral-100 border-t-0"
      summary-class="w-full hover:bg-neutral-100 px-4 py-5 flex justify-between items-center select-none border-b"
      data-testid="item-grid-card"
    >
      <template #summary>
        <h2>{{ getEditorTranslation('item-card-label') }}</h2>
      </template>

      <div class="py-4">
        <draggable
          v-if="categoryDataBlock.fieldsOrder.length"
          v-model="categoryDataBlock.fieldsOrder"
          item-key="meta.uuid"
          handle=".drag-slides-handle"
          class="rounded"
          :filter="'.no-drag'"
        >
          <template #item="{ element: elem, index }: { element: CategoryDataFieldKey; index: number }">
            <div :key="elem" class="flex items-center justify-between drag-slides-handle cursor-move">
              <div class="flex items-center gap-3">
                <button
                  class="drag-slides-handle top-2 left-2 z-50 cursor-grab p-2 hover:bg-gray-100 rounded-full"
                  :aria-label="getEditorTranslation('drag-reorder-aria')"
                  :data-testid="`actions-drag-slide-handle-${index}`"
                >
                  <NuxtImg width="18" height="18" :src="dragIcon" />
                </button>

                <span>{{ fieldLabels[elem] }}</span>
              </div>
              <SfSwitch
                v-model="categoryDataBlock.fields[elem]"
                :disabled="categoryDataBlock.fieldsDisabled?.includes(elem)"
                :data-testid="`item-grid-field-${elem}`"
              />
            </div>
          </template>
        </draggable>
      </div>

      <div class="py-2">
        <UiFormLabel>{{ getEditorTranslation('padding-label') }}</UiFormLabel>
        <div class="grid grid-cols-4 gap-px rounded-md overflow-hidden border border-gray-300">
          <div class="flex items-center justify-center gap-1 px-2 py-1 bg-white border-r">
            <span><SfIconArrowUpward /></span>
            <input
              v-model.number="categoryDataBlock.layout.paddingTop"
              type="number"
              class="w-12 text-center outline-none"
              data-testid="padding-top"
            />
          </div>
          <div class="flex items-center justify-center gap-1 px-2 py-1 bg-white border-r">
            <span><SfIconArrowDownward /></span>
            <input
              v-model.number="categoryDataBlock.layout.paddingBottom"
              type="number"
              class="w-12 text-center outline-none"
              data-testid="padding-bottom"
            />
          </div>
          <div class="flex items-center justify-center gap-1 px-2 py-1 bg-white border-r">
            <span><SfIconArrowBack /></span>
            <input
              v-model.number="categoryDataBlock.layout.paddingLeft"
              type="number"
              class="w-12 text-center outline-none"
              data-testid="padding-left"
            />
          </div>
          <div class="flex items-center justify-center gap-1 px-2 py-1 bg-white">
            <span><SfIconArrowForward /></span>
            <input
              v-model.number="categoryDataBlock.layout.paddingRight"
              type="number"
              class="w-12 text-center outline-none"
              data-testid="padding-right"
            />
          </div>
        </div>
        <div class="px-4 py-3">
          <span class="typography-text-xs text-neutral-700">
            {{ getEditorTranslation('spacing-around') }}
          </span>
        </div>
      </div>
    </UiAccordionItem>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import type { CategoryDataContent, CategoryDataFieldKey } from './types';
import {
  SfIconArrowBack,
  SfIconArrowDownward,
  SfIconArrowForward,
  SfIconArrowUpward,
  SfSwitch,
} from '@storefront-ui/vue';
import draggable from 'vuedraggable/src/vuedraggable';

// Mock drag icon data URI (kleines Drag-Symbol)
const dragIcon = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTgiIGhlaWdodD0iMTgiIHZpZXdCb3g9IjAgMCAxOCAxOCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHBhdGggZD0iTTcgNEM3IDMuNDQ3NzIgNy40NDc3MiAzIDggM0M4LjU1MjI4IDMgOSAzLjQ0NzcyIDkgNEM5IDQuNTUyMjggOC41NTIyOCA1IDggNUM3LjQ0NzcyIDUgNyA0LjU1MjI4IDcgNFoiIGZpbGw9IiM2QjczODAiLz4KPHBhdGggZD0iTTcgOUM3IDguNDQ3NzIgNy40NDc3MiA4IDggOEM4LjU1MjI4IDggOSA4LjQ0NzcyIDkgOUM5IDkuNTUyMjggOC41NTIyOCAxMCA4IDEwQzcuNDQ3NzIgMTAgNyA5LjU1MjI4IDcgOVoiIGZpbGw9IiM2QjczODAiLz4KPHBhdGggZD0iTTcgMTRDNyAxMy40NDc3IDcuNDQ3NzIgMTMgOCAxM0M4LjU1MjI4IDEzIDkgMTMuNDQ3NyA5IDE0QzkgMTQuNTUyMyA4LjU1MjI4IDE1IDggMTVDNy40NDc3MiAxNSA3IDE0LjU1MjMgNyAxNFoiIGZpbGw9IiM2QjczODAiLz4KPHBhdGggZD0iTTEyIDRDMTIgMy40NDc3MiAxMi40NDc3IDMgMTMgM0MxMy41NTIzIDMgMTQgMy40NDc3MiAxNCA0QzE0IDQuNTUyMjggMTMuNTUyMyA1IDEzIDVDMTIuNDQ3NyA1IDEyIDQuNTUyMjggMTIgNFoiIGZpbGw9IiM2QjczODAiLz4KPHBhdGggZD0iTTEyIDlDMTIgOC40NDc3MiAxMi40NDc3IDggMTMgOEMxMy41NTIzIDggMTQgOC40NDc3MiAxNCA5QzE0IDkuNTUyMjggMTMuNTUyMyAxMCAxMyAxMEMxMi40NDc3IDEwIDEyIDkuNTUyMjggMTIgOVoiIGZpbGw9IiM2QjczODAiLz4KPHBhdGggZD0iTTEyIDE0QzEyIDEzLjQ0NzcgMTIuNDQ3NyAxMyAxMyAxM0MxMy41NTIzIDEzIDE0IDEzLjQ0NzcgMTQgMTRDMTQgMTQuNTUyMyAxMy41NTIzIDE1IDEzIDE1QzEyLjQ0NzcgMTUgMTIgMTQuNTUyMyAxMiAxNFoiIGZpbGw9IiM2QjczODAiLz4KPC9zdmc+';

// Theme-spezifische Implementierung ohne externe Composables
const textOpen = ref(true);

// Mock data für Theme-Demo
const categoryDataBlock = ref({
  fieldsOrder: ['name', 'image', 'description1', 'description2', 'shortDescription'] as CategoryDataFieldKey[],
  fields: {
    name: true,
    image: false,
    description1: false,
    description2: false,
    shortDescription: false,
  } as Record<CategoryDataFieldKey, boolean>,
  fieldsDisabled: [] as CategoryDataFieldKey[],
  layout: {
    paddingTop: 40,
    paddingBottom: 40,
    paddingLeft: 0,
    paddingRight: 0,
  },
});

// Übersetzungen aus internen i18n - getEditorTranslation Mock
const getEditorTranslation = (key: string) => {
  const translations: Record<string, string> = {
    'item-card-label': 'Category text',
    'category-name': 'Category name',
    'category-image': 'Category image',
    'category-description-1': 'Category description 1',
    'category-description-2': 'Category description 2',
    'short-description': 'Short description',
    'drag-reorder-aria': 'Drag to reorder',
    'padding-label': 'Padding',
    'spacing-around': 'Spacing around the text elements',
  };
  return translations[key] || key;
};

const fieldLabels: Record<CategoryDataFieldKey, string> = {
  name: getEditorTranslation('category-name'),
  image: getEditorTranslation('category-image'),
  description1: getEditorTranslation('category-description-1'),
  description2: getEditorTranslation('category-description-2'),
  shortDescription: getEditorTranslation('short-description'),
};</script>

<i18n lang="json">
{
  "en": {
    "item-card-label": "Category text",
    "category-placeholder": "Category name",
    "category-name": "Category name",
    "category-image": "Category image",
    "category-description-1": "Category description 1",
    "category-description-2": "Category description 2",
    "short-description": "Short description",
    "drag-reorder-aria": "Drag to reorder",
    "padding-label": "Padding",
    "spacing-around": "Spacing around the text elements"
  },
  "de": {
    "item-card-label": "Category text",
    "category-placeholder": "Category name",
    "category-name": "Kategoriename",
    "category-image": "Kategoriebild",
    "category-description-1": "Kategoriebeschreibung 1",
    "category-description-2": "Kategoriebeschreibung 2",
    "short-description": "Kurzbeschreibung",
    "drag-reorder-aria": "Zum Neu-Anordnen ziehen",
    "padding-label": "Padding",
    "spacing-around": "Abstand um die Textelemente"
  }
}
</i18n>