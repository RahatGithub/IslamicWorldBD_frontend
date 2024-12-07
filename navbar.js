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
              <a href="http://127.0.0.1:8000/categories/?id=${category.id}" class="nav-link">${category.name}</a>
            </li>
          `;
        } else {
          // Fetch subcategories if no resources are present
          const subcategories = await fetchCategoryDetails(category.id);

          // Generate dropdown menu
          const dropdownItems = await Promise.all(
            subcategories.map(async (sub) => {
              // Check if subcategory has further subcategories
              const subSubcategories = await fetchCategoryDetails(sub.id);
              const subDropdown = subSubcategories.length
                ? `<ul class="dropdown-menu">${subSubcategories
                    .map(
                      (subSub) => `
                        <li class="nav-item dropdown">
                          <a href="#" class="dropdown-item">${subSub.name}</a>
                          <ul class="dropdown-menu">
                            ${subSubcategories
                              .map(
                                (subSubSub) => `
                                  <li><a href="#" class="dropdown-item">${subSubSub.name}</a></li>
                                `
                              )
                              .join("")}
                          </ul>
                        </li>`
                    )
                    .join("")}</ul>`
                : "";
              return `
                <li class="nav-item dropdown">
                  <a href="#" class="nav-link dropdown-toggle">${sub.name}</a>
                  ${subDropdown}
                </li>
              `;
            })
          );

          return `
            <li class="nav-item dropdown">
              <a href="http://127.0.0.1:8000/categories/?id=${category.id}" class="nav-link dropdown-toggle">${category.name}</a>
              <ul class="dropdown-menu">
                ${dropdownItems.join("")}
              </ul>
            </li>
          `;
        }
      })
    );

    // Append all navbar items to the navbar
    navbar.innerHTML = `<ul class="nav">${navbarItems.join("")}</ul>`;

    // Apply sticky styles after the navbar is generated
    navbar.classList.add("sticky-navbar");
  } catch (error) {
    console.error("Error creating navbar:", error);
  }
}
