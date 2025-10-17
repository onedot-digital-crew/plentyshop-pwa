<template>
  <div v-if="haveBadges" data-testid="badges" class="z-[2]">
    <ul>
      <template v-if="tagsEnabled && productTags.length > 0">
        <SfListItem
          v-for="(tag, index) in productTags"
          :key="index"
          size="sm"
          class="text-micro !font-semibold select-none !w-fit !px-3 mr-2 mb-2 cursor-pointer"
          :class="[
            tagGetters.getAgenciesTagCLass(tag),
            tagGetters.getTagTextColorIsDark(tag) ? 'text-dark' : 'text-white',
          ]"
          :style="{ backgroundColor: tagGetters.getTagBackgroundColor(tag) }"
          @click="onTagClick(tag)"
        >
          {{ tagGetters.getTagName(tag) }}
        </SfListItem>
      </template>
    </ul>
  </div>
</template>

<script setup lang="ts">
import { SfListItem } from '@storefront-ui/vue';
import { type ProductTag, productGetters, tagGetters } from '@plentymarkets/shop-api';
import type { BadgesProps } from '~/components/ui/Badges/types';

const localePath = useLocalePath();

const { product, useTags = true, useAvailability = false } = defineProps<BadgesProps>();
const productTags = ref([] as ProductTag[]);
const availabilityStyles = ref({});

const availabilityEnabled = useAvailability;
if (availabilityEnabled) {
  availabilityStyles.value = {
    backgroundColor: productGetters.getAvailabilityBackgroundColor(product),
    color: productGetters.getAvailabilityTextColor(product),
  };
}

const tagsEnabled = useTags;
if (tagsEnabled) {
  productTags.value = tagGetters.getTags(product);
}

const haveBadges = computed(
  () =>
    (tagsEnabled && productTags.value.length > 0) ||
    (availabilityEnabled && productGetters.getAvailabilityName(product)),
);

const onTagClick = (tag: ProductTag) => {
  navigateTo(localePath(`/tag/${tagGetters.getTagName(tag)}_${tagGetters.getTagId(tag)}`));
};
</script>
