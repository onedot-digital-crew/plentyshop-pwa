<template>
  <div>
    <label :for="'attribute-' + productAttributeGetters.getAttributeId(attribute)" class="text-xs mb-4 text-zinc-900">
      {{ productAttributeGetters.getAttributeName(attribute) }}
    </label>
    <SfSelect
      :id="'attribute-' + productAttributeGetters.getAttributeId(attribute)"
      v-model="value"
      size="lg"
      class="custom-attribute-select"
      wrapper-class="attribute-wrapper"
      :placeholder="t('pleaseSelect')"
      :invalid="Boolean(errors['selectedValue'])"
      @update:model-value="handleUpdateValue"
    >
      <option :value="undefined">{{ t('pleaseSelect') }}</option>
      <option
        v-for="item in productAttributeGetters.getAttributeValues(attribute)"
        :key="productAttributeGetters.getAttributeValueId(item)"
        :value="productAttributeGetters.getAttributeValueId(item)"
        :disabled="productAttributeGetters.isAttributeValueDisabled(item)"
      >
        {{ productAttributeGetters.getAttributeValueName(item) }}
      </option>
    </SfSelect>
    <ErrorMessage as="span" name="selectedValue" class="flex text-negative-700 text-sm mt-2" />
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue';
import { SfSelect } from '@storefront-ui/vue';
import type { AttributeSelectProps } from './types';
import { productAttributeGetters } from '@plentymarkets/shop-api';
import { number, object } from 'yup';
import { useForm, ErrorMessage } from 'vee-validate';
import { toTypedSchema } from '@vee-validate/yup';

const { t } = useI18n();
const { attribute } = defineProps<AttributeSelectProps>();
const { updateValue, getValue } = useProductAttributes();
const { registerValidator, registerInvalidFields } = useValidatorAggregator('attributes');
const value = ref<string | undefined>(
  getValue(productAttributeGetters.getAttributeId(attribute))?.toString() ?? undefined,
);

watch(
  () => getValue(productAttributeGetters.getAttributeId(attribute)),
  () => {
    value.value = getValue(productAttributeGetters.getAttributeId(attribute))?.toString() ?? undefined;
  },
);

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

const handleUpdateValue = (event: string | number) => {
  const numericValue = Number(event);
  updateValue(attribute.attributeId, numericValue);
  selectedValue.value = getValue(attribute.attributeId);
};

const setValue = (value: string | undefined) => {
  selectedValue.value = value ? Number(value) : undefined;
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
      `prop-${productAttributeGetters.getAttributeId(attribute)}`,
      productAttributeGetters.getAttributeName(attribute),
    );
  },
);
</script>

<style scoped>
.custom-attribute-select {
  transition: all 0.2s ease-in-out;
}

.custom-attribute-select:hover {
  border-color: #10b981;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
}

.custom-attribute-select:focus {
  border-color: #059669;
  box-shadow: 0 0 0 3px rgba(16, 185, 129, 0.1);
}

.attribute-wrapper {
  position: relative;
}

/* StorefrontUI Override für Dropdown-Styling */
:deep(.sf-select) {
  border-radius: 8px;
  border-width: 1px;
  transition: all 0.2s ease-in-out;
}

:deep(.sf-select:hover) {
  border-color: #10b981;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

:deep(.sf-select:focus) {
  outline: none;
  border-color: #059669;
  box-shadow: 0 0 0 3px rgba(16, 185, 129, 0.1);
}

:deep(.sf-select__dropdown) {
  border-radius: 6px;
  border: 1px solid #e5e7eb;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
  margin-top: 4px;
}

:deep(.sf-select option:hover) {
  background-color: #f3f4f6;
}
</style>
