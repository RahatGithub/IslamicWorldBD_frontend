// apiHandler.js

// Base URL for the APIs
const BASE_URL = "http://127.0.0.1:8000/categories/";

/**
 * Fetch all categories.
 * @returns {Promise<Array>} List of all categories.
 */
export async function fetchAllCategories() {
  const url = `${BASE_URL}`;
  return fetchAPI(url);
}

/**
 * Fetch subcategories or resources of a category by ID.
 * @param {number} id - The ID of the category.
 * @returns {Promise<Array>} List of subcategories or resources.
 */
export async function fetchCategoryDetails(id) {
  const url = `${BASE_URL}?id=${id}`;
  return fetchAPI(url);
}

/**
 * Check if a category has resources.
 * @param {number} id - The ID of the category.
 * @returns {Promise<boolean>} True if the category has resources, otherwise false.
 */
export async function hasResources(id) {
  const url = `${BASE_URL}${id}/has-resources`;
  const data = await fetchAPI(url);
  return data.has_resources;
}

/**
 * Fetch top-level categories.
 * @returns {Promise<Array>} List of top-level categories.
 */
export async function fetchTopLevelCategories() {
  const url = `${BASE_URL}?is_top_level=true`;
  return fetchAPI(url);
}

/**
 * Generic function to fetch data from an API.
 * @param {string} url - API URL.
 * @returns {Promise<any>} Parsed JSON response.
 */
async function fetchAPI(url) {
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error(`Error fetching data from ${url}:`, error);
    throw error;
  }
}
