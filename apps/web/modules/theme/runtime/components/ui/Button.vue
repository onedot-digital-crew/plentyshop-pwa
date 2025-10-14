<template>
  <component
    :is="tagWithDefaults"
    :type="type"
    :disabled="disabled"
    :class="[
      'inline-flex items-center justify-center transition text-xs py-5 px-6 focus-visible:outline focus-visible:outline-offset disabled:shadow-none disabled:ring-0 disabled:cursor-not-allowed',
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
      return [square.value ? 'p-4' : 'py-3 leading-6 px-6', 'gap-3'];
    }
    default: {
      return [square.value ? 'p-2' : 'py-2 leading-6 px-4', 'gap-2'];
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
    'text-white shadow hover:shadow-md active:shadow bg-primary-500 hover:bg-primary-600 active:bg-primary-600 disabled:bg-disabled-300',
  [SfButtonVariant.secondary]:
    'bg-white text-black p-4 hover:bg-gray-200',
  [SfButtonVariant.tertiary]:
    'text-red-500 hover:bg-red-100 hover:text-red-800 active:bg-red-200 active:text-red-900 disabled:bg-transparent',
};
</script>
