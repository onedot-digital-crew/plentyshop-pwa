<template>
  <div class="flex items-center gap-4 w-full md:w-1/2 md:max-w-80" data-testid="category-sorting">
    <span
      class="text-base shrink-0"
    >
      {{ t('sortBy') }}
    </span>
    <div class="w-full">
      <SfSelect id="sortBy" v-model="selected" :aria-label="t('sortBy')" data-testid="select-sort-by">
        <option v-for="option in options" :key="option" :value="option">
          {{ t(`sortType.${option}`) }}
        </option>
      </SfSelect>
    </div>
  </div>
</template>

<script setup lang="ts">
import { SfSelect } from '@storefront-ui/vue';
import { isPageOfType } from '~/utils/pathHelper';

const { updateSorting } = useCategoryFilter();
const { t } = useI18n();
const { getJsonSetting: availableSortingOptions } = useSiteSettings('availableSortingOptions');
const { getSetting: defaultSortingSearch } = useSiteSettings('defaultSortingSearch');
const { getSetting: defaultSortingOption } = useSiteSettings('defaultSortingOption');

const options = computed(() => availableSortingOptions());

const defaultOption = computed(() => (isPageOfType('search') ? defaultSortingSearch() : defaultSortingOption()));

const selected = computed({
  get: () => {
    return (useNuxtApp().$router.currentRoute.value.query.sort || defaultOption.value || options.value[0]) as string;
  },
  set: (selectedOption) => {
    updateSorting(selectedOption);
  },
});
</script>
