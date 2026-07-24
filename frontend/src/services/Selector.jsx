import { createSelector } from '@reduxjs/toolkit';
import { productApi } from './Productapi';

// Create these ONCE, outside any selector function
const selectProductResult = productApi.endpoints.getProduct.select(undefined);

export const latestcollection = createSelector(
  [selectProductResult],
  (result = {}) => {
    if (!result.data || !result.data.message) {
      return [];
    }
    const messageData = [...result.data.message];
    const sortedproduct = messageData.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    return sortedproduct.slice(0, 12);
  }
);

export const bestsellercollection = createSelector(
  [selectProductResult],
  (result) => {
    if (!result.data || !result.data.message) {
      return [];
    }
    const bestsellers = result.data.message.filter(item => item.isbestseller === true);
    return bestsellers.slice(0, 6);
  }
);

export const filterAndSearchProducts = createSelector(
  [
    selectProductResult,
    (state) => state.user.category,
    (state) => state.user.subcategory,
    (state) => state.user.sort,
    (state) => state.user.search,
  ],
  (data, category, subcategory, sort, search) => {
    if (!data || !data.data || !data.data.message) {
      return [];
    }

    let filtprod = [...data.data.message];

    if (search && search.trim() !== '') {
      const searchLower = search.toLowerCase();
      filtprod = filtprod.filter(item =>
        item.name?.toLowerCase().includes(searchLower) ||
        item.description?.toLowerCase().includes(searchLower) ||
        item.category?.toLowerCase().includes(searchLower) ||
        item.subcategory?.toLowerCase().includes(searchLower)
      );
    }

    if (category && category.length > 0) {
      filtprod = filtprod.filter((item) => category.includes(item.category));
    }

    if (subcategory && subcategory.length > 0) {
      filtprod = filtprod.filter((item) => subcategory.includes(item.subcategory));
    }

    if (sort === "high-low") {
      filtprod = [...filtprod].sort((a, b) => b.price - a.price);
    } else if (sort === "low-high") {
      filtprod = [...filtprod].sort((a, b) => a.price - b.price);
    }

    return filtprod;
  }
);