<template>
  <nav
    class="flex justify-center items-end mt-10 gap-1"
    role="navigation"
    :aria-label="t('pagination')"
    data-testid="pagination"
  >
    <UiButton
      :aria-label="t('prevAriaLabel')"
      :disabled="pagination.selectedPage <= 1 || disabled"
      variant="tertiary"
      data-testid="pagination-previous"
      class="!p-2 size-12 border border-gray-600"
      @click="previousPage"
    >
      <template #prefix>
        <SfIconChevronLeft />
      </template>
      <span class="sr-only">{{ t('prev') }}</span>
    </UiButton>
    <ul class="flex justify-center">
      <li v-if="!pagination.pages.includes(1)">
        <div
          :class="[
            'flex pt-1 border-t-4 border-transparent',
            { 'font-medium border-t-4 !border-primary-500': pagination.selectedPage === 1 },
          ]"
        >
          <button
            type="button"
            :class="[
              'p-2 size-12 border border-gray-600',
              {
                'hover:bg-gray-600 hover:!text-white active:bg-black active:!text-white transition': !disabled,
              }
            ]"
            :aria-current="pagination.selectedPage === 1 || disabled"
            :aria-label="getAriaLabel(pagination.selectedPage === 1 || disabled, 1)"
            @click="setPage(1)"
          >
            1
          </button>
        </div>
      </li>
      <li v-if="pagination.startPage > 2">
        <div class="flex pt-1 border-t-4 border-transparent">
          <button type="button" disabled aria-hidden="true" class="px-4 py-3 md:w-12 rounded-md text-neutral-500">
            ...
          </button>
        </div>
      </li>
      <li v-if="shouldDisplayPreviousLink">
        <div class="flex pt-1 border-t-4 border-transparent">
          <button
            type="button"
            :class="[
              'p-2 size-12 border border-gray-600',
              {
                'hover:bg-gray-600 hover:!text-white active:bg-black active:!text-white transition': !disabled,
              }
            ]"
            :aria-current="pagination.endPage - 1 === pagination.selectedPage"
            :aria-label="getAriaLabel(pagination.endPage - 1 === pagination.selectedPage, pagination.endPage - 1)"
            :disabled="disabled"
            @click="setPage(pagination.endPage - 1)"
          >
            {{ pagination.endPage - 1 }}
          </button>
        </div>
      </li>
      <li v-for="page in pagination.pages" :key="`page-${page}`">
        <div
          :class="[
            'flex',
            { 'font-medium': pagination.selectedPage === page },
          ]"
        >
          <button
            type="button"
            :class="[
              'p-2 size-12 border border-gray-600',
              {
                'hover:bg-gray-600 hover:!text-white active:bg-black active:!text-white transition': !disabled,
              },
              {
                '!text-white !bg-black !border-black': pagination.selectedPage === page,
              },
            ]"
            :aria-current="pagination.selectedPage === page"
            :aria-label="getAriaLabel(pagination.selectedPage === page, page)"
            :disabled="disabled"
            @click="setPage(page)"
          >
            {{ page }}
          </button>
        </div>
      </li>
      <li v-if="shouldDisplayNextLink">
        <div class="flex pt-1 border-t-4 border-transparent">
          <button
            type="button"
            :class="[
              'p-2 size-12 border border-gray-600',
              {
                'hover:bg-gray-600 hover:!text-white active:bg-black active:!text-white transition': !disabled,
              }
            ]"
            :aria-label="t('goToPage', { page: 2 })"
            :disabled="disabled"
            @click="setPage(2)"
          >
            2
          </button>
        </div>
      </li>
      <li v-if="pagination.endPage < pagination.totalPages - 1">
        <div class="flex pt-1 border-t-4 border-transparent">
          <button type="button" disabled aria-hidden="true" class="px-4 py-3 md:w-12 rounded-md text-neutral-500">
            ...
          </button>
        </div>
      </li>
      <li v-if="!pagination.pages.includes(pagination.totalPages)">
        <div
          :class="[
            'flex pt-1 border-t-4 border-transparent',
            { 'font-medium border-t-4 !border-primary-500': pagination.selectedPage === pagination.totalPages },
          ]"
        >
          <button
            type="button"
            :class="[
              'p-2 size-12 border border-gray-600',
              {
                'hover:bg-gray-600 hover:!text-white active:bg-black active:!text-white transition': !disabled,
              }
            ]"
            :aria-current="pagination.totalPages === pagination.selectedPage"
            :aria-label="getAriaLabel(pagination.totalPages === pagination.selectedPage, pagination.selectedPage)"
            :disabled="disabled"
            @click="setPage(pagination.totalPages)"
          >
            {{ pagination.totalPages }}
          </button>
        </div>
      </li>
    </ul>
    <UiButton
      :aria-label="t('nextAriaLabel')"
      :disabled="pagination.selectedPage >= pagination.totalPages || disabled"
      variant="tertiary"
      data-testid="pagination-next"
      class="!p-2 size-12 border border-gray-600"
      @click="nextPage"
    >
      <span class="sr-only">{{ t('next') }}</span>
      <template #suffix>
        <SfIconChevronRight />
      </template>
    </UiButton>
  </nav>
</template>

<script setup lang="ts">
import { SfIconChevronLeft, SfIconChevronRight, usePagination } from '@storefront-ui/vue';
import type { PaginationProps } from '~/components/ui/Pagination/types';

const { updatePage } = useCategoryFilter();
const { t } = useI18n();

const {
  currentPage,
  currentPageName = 'page',
  pageSize,
  totalItems,
  maxVisiblePages: maxVisiblePagesProperty,
  disabled = false,
} = defineProps<PaginationProps>();

const pagination = computed(() =>
  reactive(
    usePagination({
      totalItems: totalItems,
      currentPage: currentPage,
      pageSize: pageSize,
      maxPages: maxVisiblePagesProperty,
    }),
  ),
);

const getAriaLabel = (isCurrent: boolean, page: number) => {
  return t(isCurrent ? 'currentPage' : 'goToPage', { page });
};

const setPage = (page: number) => {
  updatePage(page.toString(), currentPageName);
  pagination.value.setPage(page);
};

const previousPage = () => {
  setPage(pagination.value.selectedPage - 1);
};

const nextPage = () => {
  setPage(pagination.value.selectedPage + 1);
};

const shouldDisplayPreviousLink: boolean =
  maxVisiblePagesProperty === 1 &&
  pagination.value.totalPages > 1 &&
  pagination.value.selectedPage === pagination.value.totalPages;

const shouldDisplayNextLink: boolean =
  maxVisiblePagesProperty === 1 && pagination.value.totalPages > 1 && pagination.value.selectedPage === 1;
</script>
