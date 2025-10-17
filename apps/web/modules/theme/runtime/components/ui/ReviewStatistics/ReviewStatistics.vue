<template>
  <div class="flex justify-center lg:justify-start mb-4 lg:mb-0" data-testid="average-section">
    <div class="md:flex w-full justify-between my-2">
      <div class="md:w-1/2 lg:mr-8">
        <p class="text-xs" data-testid="review-count">{{ totalReviews }} {{ t('reviews') }}</p>
        <div class="my-3 flex">
            <SfRating
                class="pb-2 !text-black"
                size="sm"
                :max="5"
                :value="reviewAverageStars || reviewAverageText"
                :half-increment="true"
            />
            <span class="ml-4 text-gray-600">{{ reviewAverageText }} {{ t('ofFiveStars') }}</span>
        </div>
        <UiButton
            data-testid="add-review-button"
            class="mt-2 mb-4 max-md:w-full block"
            size="lg"
            @click="openReviewModal(defaults.DEFAULT_REVIEW_MODAL_TYPES.createReview)"
        >
        {{ t('createCustomerReview') }}
        </UiButton>
      </div>

      <div class="flex flex-col gap-2 max-md:mt-6">
        <div v-for="(proportionalRating, key) in ratingPercentages" :key="key" class="flex items-center text-gray-600">
          <p class="w-1 text-center">{{ 5 - key }}</p>
          <SfIconStarFilled class="mx-1 pb-1 text-black" size="base" />
          <p class="lg:w-12 mx-1">(<span class="w-4 inline-block text-center">{{ splitRatings[key] }}</span>)</p>
          <SfProgressLinear
            class="self-center !bg-gray-100 !text-black !h-2.5"
            size="sm"
            :value="proportionalRating"
            aria-label="proportional-rating-in-percent"
          />
          <p class="ml-2 text-center w-10">
              {{ proportionalRating }}%
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { SfRating, SfProgressLinear, SfIconStarFilled } from '@storefront-ui/vue';
import type { ReviewStatisticsProps } from './types';
import { productGetters, reviewGetters } from '@plentymarkets/shop-api';
import { defaults } from '~/composables';

const props = defineProps<ReviewStatisticsProps>();

const productId = Number(productGetters.getItemId(props.product));

const { t } = useI18n();
const { data: productReviews, openReviewModal } = useProductReviews(productId);
const countsProductReviews = computed(() => reviewGetters.getReviewCounts(productReviews.value));

const reviewAverageText = computed(() => reviewGetters.getAverageRating(countsProductReviews.value, 'tenth'));
const reviewAverageStars = computed(() => reviewGetters.getAverageRating(countsProductReviews.value, 'half'));
const totalReviews = computed(() => reviewGetters.getTotalReviews(countsProductReviews.value));
const ratingPercentages = computed(() =>
  reviewGetters.getReviewCountsOrPercentagesByRatingDesc(countsProductReviews.value, true),
);
const splitRatings = computed(() => reviewGetters.getReviewCountsOrPercentagesByRatingDesc(countsProductReviews.value));
</script>