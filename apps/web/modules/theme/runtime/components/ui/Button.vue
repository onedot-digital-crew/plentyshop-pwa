<template>
  <component
    :is="tagWithDefaults"
    :type="type"
    :disabled="disabled"
    :class="[
      'inline-flex items-center justify-center transition text-xs focus-visible:outline focus-visible:outline-offset disabled:shadow-none disabled:ring-0 disabled:cursor-not-allowed',
      sizeClasses,
      variantClasses[variant],
    ]"
    data-testid="button"
  >
    <slot v-if="$slots.prefix" name="prefix" />
    <slot />
    <slot v-if="$slots.suffix" name="suffix" />
  </component>
</template>

<script lang="ts" setup>
import { type ConcreteComponent, type PropType, toRefs, computed } from 'vue';
import { useAttrsRef, SfButtonSize, SfButtonVariant } from '@storefront-ui/vue';

const props = defineProps({
  size: {
    type: String as PropType<`${SfButtonSize}`>,
    default: SfButtonSize.base,
  },
  variant: {
    type: String as PropType<`${SfButtonVariant}`>,
    default: SfButtonVariant.primary,
  },
  disabled: {
    type: Boolean,
    default: false,
  },
  square: {
    type: Boolean,
    default: false,
  },
  tag: {
    type: [String, Object] as PropType<string | ConcreteComponent>,
    default: undefined,
  },
});

const { size, tag, square } = toRefs(props);

const sizeClasses = computed(() => {
  switch (size.value) {
    case SfButtonSize.sm: {
      return [square.value ? 'p-1.5' : 'leading-5 text-sm py-1.5 px-3', 'gap-1.5'];
    }
    case SfButtonSize.lg: {
      return [square.value ? 'p-4' : 'leading-6 py-3 px-6 lg:py-5', 'gap-3'];
    }
    default: {
      return [square.value ? 'p-2' : 'leading-6 py-3 px-6', 'gap-2'];
    }
  }
});
const tagWithDefaults = computed(() => tag?.value || 'button');

const attrs = useAttrsRef();
const type = computed(
  () =>
    attrs.value.type ??
    (typeof tagWithDefaults.value === 'string' && tagWithDefaults.value.toLowerCase() === 'button'
      ? 'button'
      : undefined),
);

const variantClasses = {
  [SfButtonVariant.primary]:
    'bg-black text-white hover:bg-gray-900',
  [SfButtonVariant.secondary]:
    'bg-white text-black hover:bg-gray-200',
  [SfButtonVariant.tertiary]:
    'text-black',
};
</script>
