<template>
  <div>
    <div class="text-xs mb-4 text-zinc-900">
      {{ productAttributeGetters.getAttributeName(attribute) }}
    </div>

    <div class="w-full flex gap-4 flex-wrap">
      <div
        v-for="item in productAttributeGetters.getAttributeValues(attribute)"
        :key="productAttributeGetters.getAttributeValueId(item)"
        class="border border-zinc-400 cursor-pointer hover:border-zinc-500"
        :class="{
          'text-zinc-400 border-zinc-100': productAttributeGetters.isAttributeValueDisabled(item),
          '!border-primary-500 ': value === productAttributeGetters.getAttributeValueId(item),
          '!ring-negative-700 !border-negative-700 ring-1': Boolean(errors['selectedValue']),
        }"
        @click="doUpdateValue(productAttributeGetters.getAttributeValueId(item))"
      >
        <SfTooltip :label="getLabel(item)" strategy="absolute" :show-arrow="true" placement="top">
          <div class="font-medium flex items-center px-5 py-5">
            {{ productAttributeGetters.getAttributeValueName(item) }}
          </div>
        </SfTooltip>
      </div>
    </div>
    <ErrorMessage as="span" name="selectedValue" class="flex text-negative-700 text-sm mt-2" />
  </div>
</template>

<script setup lang="ts">
import { SfTooltip } from '@storefront-ui/vue';
import type { AttributeSelectProps } from '../types';
import type { VariationMapProductAttributeValue } from '@plentymarkets/shop-api';
import { productAttributeGetters } from '@plentymarkets/shop-api';
import { object, number } from 'yup';
import { useForm, ErrorMessage } from 'vee-validate';
import { toTypedSchema } from '@vee-validate/yup';

const { updateValue, getValue } = useProductAttributes();
const { registerValidator, registerInvalidFields } = useValidatorAggregator('attributes');
const props = defineProps<AttributeSelectProps>();
const value = computed(() => getValue(props.attribute.attributeId));
const { t } = useI18n();

const getLabel = (item: VariationMapProductAttributeValue): string => {
  return productAttributeGetters.isAttributeValueDisabled(item) ? t('productAttributes.seeAvailableOptions') : '';
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

const doUpdateValue = (value: number) => {
  updateValue(props.attribute.attributeId, value);
  selectedValue.value = getValue(props.attribute.attributeId);
};

const setValue = (value: number | undefined) => {
  selectedValue.value = value;
};

watch(
  value,
  (newVal) => {
    if (newVal) {
      setValue(newVal);
    }
  },
  { immediate: true },
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
