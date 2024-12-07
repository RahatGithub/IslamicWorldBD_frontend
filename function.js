// function.js
import {
    fetchAllCategories,
    fetchCategoryDetails,
    hasResources,
    fetchTopLevelCategories,
  } from "./apiHandler.js";

// function.js
import { createDynamicNavbar } from "./navbar.js";

document.addEventListener("DOMContentLoaded", async () => {
  try {
    // Create the dynamic navbar
    await createDynamicNavbar();
  } catch (error) {
    console.error("Error initializing the application:", error);
  }
});

  
document.addEventListener("DOMContentLoaded", async () => {
const container = document.getElementById("category-data");

try {
    // Example: Fetch and display top-level categories
    const topLevelCategories = await fetchTopLevelCategories();
    displayCategories(topLevelCategories, "Top-Level Categories");

    // Example: Fetch and display details of a specific category (ID = 1)
    const categoryId = 29; // Change as needed
    const categoryHasResources = await hasResources(categoryId);

    if (categoryHasResources) {
    const resources = await fetchCategoryDetails(categoryId);
    displayResources(resources, `Resources for Category ${categoryId}`);
    } else {
    const subcategories = await fetchCategoryDetails(categoryId);
    displayCategories(subcategories, `Subcategories for Category ${categoryId}`);
    }
} catch (error) {
    container.innerHTML = `<p>Error loading data. Please try again later.</p>`;
}
});

// Function to display categories
function displayCategories(categories, title) {
const container = document.getElementById("category-data");
container.innerHTML = `<h2>${title}</h2>`;
categories.forEach((category) => {
    container.innerHTML += `
    <div class="category-item">
        <p><strong>ID:</strong> ${category.id}</p>
        <p><strong>Name:</strong> ${category.name}</p>
        <p><strong>Parent:</strong> ${category.parent_category || "None"}</p>
    </div>
    <hr>
    `;
});
}
  
  // Function to display resources
  function displayResources(resources, title) {
    const container = document.getElementById("category-data");
    container.innerHTML = `<h2>${title}</h2>`;
    resources.forEach((resource) => {
      container.innerHTML += `
        <div class="resource-item">
          <p><strong>ID:</strong> ${resource.id}</p>
          <p><strong>Name:</strong> ${resource.name}</p>
          <p><strong>Link:</strong> <a href="${resource.link}" target="_blank">${resource.link}</a></p>
          <p><strong>Category:</strong> ${resource.category}</p>
        </div>
        <hr>
      `;
    });
  }
  