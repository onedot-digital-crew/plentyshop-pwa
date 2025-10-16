import { mount } from '@vue/test-utils';
import { mockNuxtImport } from '@nuxt/test-utils/runtime';
import CategoryTreeItem from '../CategoryTreeItem.vue';
import type { CategoryTreeItem as CategoryTreeItemType } from '@plentymarkets/shop-api';

// Mock Nuxt imports
mockNuxtImport('useRuntimeConfig', () => {
  return () => ({
    public: {
      domain: 'https://example.com'
    }
  });
});

describe('CategoryTreeItem', () => {
  const mockCategoryWithImage: CategoryTreeItemType = {
    id: 1,
    type: 'item',
    childCount: 0,
    right: 'all',
    itemCount: [],
    details: [
      {
        lang: 'de',
        name: 'Test Category',
        nameUrl: 'test-category',
        metaTitle: 'Test Category Title',
        imagePath: '/path/to/image.jpg',
        image2Path: null,
      }
    ]
  };

  const mockCategoryWithoutImage: CategoryTreeItemType = {
    id: 2,
    type: 'item',
    childCount: 0,
    right: 'all',
    itemCount: [],
    details: [
      {
        lang: 'de',
        name: 'Test Category Without Image',
        nameUrl: 'test-category-without-image',
        metaTitle: 'Test Category Without Image Title',
        imagePath: null,
        image2Path: null,
      }
    ]
  };

  it('should render component with category image', () => {
    const wrapper = mount(CategoryTreeItem, {
      props: {
        name: 'Test Category',
        href: '/test-category',
        count: 5,
        category: mockCategoryWithImage
      },
    });

    expect(wrapper.find('[data-testid="category-tree-item"]').exists()).toBe(true);
    expect(wrapper.find('img').exists()).toBe(true);
    expect(wrapper.find('img').attributes('src')).toBe('https://example.com/documents/path/to/image.jpg');
    expect(wrapper.find('img').attributes('alt')).toBe('Test Category');
  });

  it('should render component without category image', () => {
    const wrapper = mount(CategoryTreeItem, {
      props: {
        name: 'Test Category',
        href: '/test-category',
        count: 5,
        category: mockCategoryWithoutImage
      },
    });

    expect(wrapper.find('[data-testid="category-tree-item"]').exists()).toBe(true);
    expect(wrapper.find('img').exists()).toBe(false);
    expect(wrapper.find('div').text()).toContain('No Image');
  });

  it('should render component without category prop', () => {
    const wrapper = mount(CategoryTreeItem, {
      props: {
        name: 'Test Category',
        href: '/test-category',
        count: 5
      },
    });

    expect(wrapper.find('[data-testid="category-tree-item"]').exists()).toBe(true);
    expect(wrapper.find('img').exists()).toBe(false);
    expect(wrapper.find('div').text()).toContain('No Image');
  });

  it('should handle absolute image URLs', () => {
    const mockCategoryWithAbsoluteImage: CategoryTreeItemType = {
      ...mockCategoryWithImage,
      details: [
        {
          ...mockCategoryWithImage.details[0],
          imagePath: 'https://external.com/image.jpg'
        }
      ]
    };

    const wrapper = mount(CategoryTreeItem, {
      props: {
        name: 'Test Category',
        href: '/test-category',
        count: 5,
        category: mockCategoryWithAbsoluteImage
      },
    });

    expect(wrapper.find('img').attributes('src')).toBe('https://external.com/image.jpg');
  });

  it('should use image2Path as fallback', () => {
    const mockCategoryWithImage2: CategoryTreeItemType = {
      ...mockCategoryWithImage,
      details: [
        {
          ...mockCategoryWithImage.details[0],
          imagePath: null,
          image2Path: '/path/to/image2.jpg'
        }
      ]
    };

    const wrapper = mount(CategoryTreeItem, {
      props: {
        name: 'Test Category',
        href: '/test-category',
        count: 5,
        category: mockCategoryWithImage2
      },
    });

    expect(wrapper.find('img').attributes('src')).toBe('https://example.com/documents/path/to/image2.jpg');
  });
});