<template>
  <div>
    <label :for="'attribute-' + productAttributeGetters.getAttributeId(attribute)" class="text-xs mb-4 text-zinc-900">
      <span>{{ productAttributeGetters.getAttributeName(attribute) }}</span>
      <span v-if="value"
        >: <b>{{ selectedAttributeValueName }}</b></span
      >
    </label>
    <div :id="'attribute-' + productAttributeGetters.getAttributeId(attribute)" class="w-full flex gap-4 flex-wrap">
      <SfTooltip
        v-for="item in productAttributeGetters.getAttributeValues(attribute)"
        :key="productAttributeGetters.getAttributeValueId(item)"
        :label="getLabel(item)"
        strategy="absolute"
        :show-arrow="true"
        placement="top"
      >
        <div
          class="p-2 border border-zinc-400 cursor-pointer hover:border-zinc-500"
          :class="{
            'text-zinc-300 border-dashed': productAttributeGetters.isAttributeValueDisabled(item),
            '!border-primary-500': value === productAttributeGetters.getAttributeValueId(item),
            '!ring-negative-700 !border-negative-700 ring-1': Boolean(errors['selectedValue']),
          }"
          @click="doUpdateValue(item)"
        >
          <NuxtImg
            :src="getImagePath(item)"
            :alt="productAttributeGetters.getAttributeValueName(item)"
            loading="lazy"
          />
        </div>
      </SfTooltip>
    </div>
    <ErrorMessage as="span" name="selectedValue" class="flex text-negative-700 text-sm mt-2" />
  </div>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue';
import { SfTooltip } from '@storefront-ui/vue';
import type { AttributeSelectProps } from './types';
import type { VariationMapProductAttributeValue } from '@plentymarkets/shop-api';
import { productAttributeGetters } from '@plentymarkets/shop-api';
import { object, number } from 'yup';
import { useForm, ErrorMessage } from 'vee-validate';
import { toTypedSchema } from '@vee-validate/yup';
import { useI18n } from 'vue-i18n';
import { useRuntimeConfig } from 'nuxt/app';
import { useProductAttributes } from '../../../../../composables/useProductAttributes';
import { useValidatorAggregator } from '../../../../../composables/useValidatorAggregator';

const { updateValue, getValue } = useProductAttributes();
const { registerValidator, registerInvalidFields } = useValidatorAggregator('attributes');
const props = defineProps<AttributeSelectProps>();
const value = computed(() => getValue(props.attribute.attributeId));
const { t } = useI18n();
const selectedAttributeValueName = ref<string>('');
const runtimeConfig = useRuntimeConfig();
const domain = runtimeConfig.public?.domain ?? '';

const getLabel = (item: VariationMapProductAttributeValue): string => {
  return productAttributeGetters.isAttributeValueDisabled(item)
    ? t('productAttributes.seeAvailableOptions')
    : productAttributeGetters.getAttributeValueName(item);
};

const getImagePath = (item: VariationMapProductAttributeValue): string => {
  const path = productAttributeGetters.getAttributeValueImageUrl(item);
  return path.startsWith('http') ? path : domain + path;
};

const validationSchema = toTypedSchema(
  object({
    selectedValue: number().required(t('errorMessages.requiredField')),
  }),
);

const { errors, defineField, validate, meta } = useForm({
  validationSchema: validationSchema,
});

registerValidator(validate);

const [selectedValue] = defineField('selectedValue');

const doUpdateValue = (attribute: VariationMapProductAttributeValue) => {
  updateValue(
    productAttributeGetters.getAttributeId(props.attribute),
    productAttributeGetters.getAttributeValueId(attribute),
  );
  selectedValue.value = getValue(props.attribute.attributeId);
  selectedAttributeValueName.value = productAttributeGetters.getAttributeValueName(attribute);
};

const setValue = (value: number | undefined) => {
  const getAttributeValue = productAttributeGetters.getAttributeValueById(props.attribute, value || -1);
  selectedValue.value = value;
  selectedAttributeValueName.value = getAttributeValue
    ? productAttributeGetters.getAttributeValueName(getAttributeValue)
    : '';
};

setValue(value.value);

watch(
  () => value.value,
  () => {
    setValue(value.value);
  },
);

watch(
  () => meta.value,
  () => {
    registerInvalidFields(
      meta.value.valid,
      `prop-${productAttributeGetters.getAttributeId(props.attribute)}`,
      productAttributeGetters.getAttributeName(props.attribute),
    );
  },
);
</script>
