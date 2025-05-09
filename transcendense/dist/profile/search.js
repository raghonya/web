"use strict";
function searchUsers() {
    const searchModalBtn = document.getElementById("search-modal-btn");
    const listContainer = document.getElementById("search-users-list");
    const closeModalBtn = document.getElementById("close-search-modal");
    if (!searchModalBtn || !listContainer || !closeModalBtn) {
        console.error("One or more required elements are missing in the DOM.");
        return;
    }
    searchModalBtn.addEventListener("click", () => {
        showModal("search-users-modal");
    });
    closeModalBtn.addEventListener("click", () => {
        hideModal("search-users-modal");
    });
}
