// navbar.js
import { fetchTopLevelCategories, fetchCategoryDetails, hasResources } from "./apiHandler.js";

/**
 * Create a dynamic navbar with dropdown menus for subcategories.
 * @returns {Promise<void>}
 */
export async function createDynamicNavbar() {
  const navbar = document.getElementById("navbar");
  if (!navbar) {
    console.error("Navbar container not found in the HTML.");
    return;
  }

  try {
    // Fetch top-level categories
    const topLevelCategories = await fetchTopLevelCategories();

    // Generate navbar items dynamically
    const navbarItems = await Promise.all(
      topLevelCategories.map(async (category) => {
        const hasResourcesFlag = await hasResources(category.id);

        if (hasResourcesFlag) {
          // Return a simple nav item if the category has resources
          return `
            <li class="nav-item">
              <a href="#" class="nav-link">${category.name}</a>
            </li>
          `;
        } else {
          // Fetch subcategories if no resources are present
          const subcategories = await fetchCategoryDetails(category.id);

          // Generate dropdown menu
          const dropdownItems = subcategories
            .map(
              (sub) => `
                <li>
                  <a href="#" class="dropdown-item">${sub.name}</a>
                </li>
              `
            )
            .join("");

          return `
            <li class="nav-item dropdown">
              <a href="#" class="nav-link dropdown-toggle">${category.name}</a>
              <ul class="dropdown-menu">
                ${dropdownItems}
              </ul>
            </li>
          `;
        }
      })
    );

    // Append all navbar items to the navbar
    navbar.innerHTML = `<ul class="nav">${navbarItems.join("")}</ul>`;
  } catch (error) {
    console.error("Error creating navbar:", error);
  }
}
