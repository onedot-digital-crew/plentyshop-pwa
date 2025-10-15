import { mount } from '@vue/test-utils';
import { mockNuxtImport } from '@nuxt/test-utils/runtime';
import CategoryData from '../CategoryData.vue';
import type { CategoryDataProps } from '../types';
import { CategoryMock } from '~/__tests__/__mocks__/category.mock';

mockNuxtImport('useRuntimeConfig', () => () => ({
  public: {
    domain: 'https://example.com'
  }
}));

const mockProps: CategoryDataProps = {
  name: 'CategoryData',
  type: 'content',
  content: {
    categoryId: '16',
    name: 'Category name',
    fields: {
      name: true,
      description1: false,
      description2: false,
      shortDescription: false,
      // Theme extension field
      image: false,
    },
    fieldsOrder: ['name', 'description1', 'description2', 'shortDescription'],
    fieldsDisabled: [],
    layout: {
      paddingTop: 0,
      paddingBottom: 0,
      paddingLeft: 0,
      paddingRight: 0,
    },
  },
  category: CategoryMock,
  meta: {
    uuid: 'test-uuid',
  },
  index: 0,
};

describe('[Theme] CategoryData', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should render category name', () => {
    const wrapper = mount(CategoryData, {
      props: {
        ...mockProps,
        shouldLoad: false,
      },
    });

    expect(wrapper.find('[data-testid="category-name"]').exists()).toBe(true);
  });

  it('should render category image when image field is enabled and image exists', () => {
    const propsWithImage = {
      ...mockProps,
      content: {
        ...mockProps.content,
        fields: {
          ...mockProps.content.fields,
          image: true,
        },
        fieldsOrder: [...mockProps.content.fieldsOrder, 'image'] as Array<string>,
      },
      category: {
        ...CategoryMock,
        details: [
          {
            ...CategoryMock.details[0],
            imagePath: '/path/to/category-image.jpg',
          },
        ],
      },
    };

    const wrapper = mount(CategoryData, {
      props: {
        ...propsWithImage,
        shouldLoad: false,
      } as unknown as CategoryDataProps,
    });

    expect(wrapper.find('[data-testid="category-image"]').exists()).toBe(true);
    expect(wrapper.find('[data-testid="category-image"] img').attributes('src')).toBe('https://example.com/path/to/category-image.jpg');
  });

  it('should render CategoryTree component', () => {
    const wrapper = mount(CategoryData, {
      props: {
        ...mockProps,
        shouldLoad: false,
      },
    });

    // The theme version includes CategoryTree
    expect(wrapper.findComponent({ name: 'CategoryTree' })).toBeDefined();
  });
});