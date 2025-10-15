<template>
  <div class="text-2xl py-1 flex space-x-4">
    <span class="mr-2 text-zinc-900 font-bold" data-testid="price">
      <span>{{ format(price) }}</span>
      <span>{{ t('asterisk') }} </span>
    </span>
    <span v-if="crossedPrice && differentPrices" class="font-medium text-neutral-500 line-through">
      {{ format(crossedPrice) }}
    </span>
  </div>
</template>

<script setup lang="ts">
import type { PriceProps } from '~/components/Price/types';

const props = defineProps<PriceProps>();

const { format } = usePriceFormatter();
const { t } = useI18n();

const differentPrices = computed(() => {
  return props.crossedPrice
    ? Math.round(props.price * 100) / 100 !== Math.round(props.crossedPrice * 100) / 100
    : false;
});
</script>
