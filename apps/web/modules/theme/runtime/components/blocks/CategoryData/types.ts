// Import Core types to extend them properly
import type { 
  CategoryDataFieldKey as CoreFieldKey,
  CategoryDataFieldsVisibility as CoreFieldsVisibility,
  CategoryDataProps as CoreCategoryDataProps,
  CategoryDataContent as CoreCategoryDataContent
} from '../../../../../../components/blocks/CategoryData/types';

// Extended field keys for theme (optional)
export type ExtendedCategoryDataFieldKey = 'image';
// Combined field keys (core + theme)
export type CategoryDataFieldKey = CoreFieldKey | ExtendedCategoryDataFieldKey;

// Extended fields visibility that includes core fields + optional theme extensions  
export type CategoryDataFieldsVisibility = CoreFieldsVisibility & 
  Partial<Record<ExtendedCategoryDataFieldKey, boolean>>;

// Theme content type that extends core content
export type CategoryDataContent = CoreCategoryDataContent & {
  fields: CategoryDataFieldsVisibility;
  fieldsOrder: CategoryDataFieldKey[];
};

// Theme props that extend core props to be compatible with both
export type CategoryDataProps = CoreCategoryDataProps & {
  content: CategoryDataContent;
};
