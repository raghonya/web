"use strict";
function showModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.classList.remove("hidden");
    }
}
function hideModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.classList.add("hidden");
    }
}
function initPersonaleData(username = null) {
    initWipeText();
    searchUsers();
    viewFriends(username);
    viewMatches(username);
    const editProfileBtn = document.getElementById("edit-profile-btn");
    const upcomingTournaments = document.getElementById("upcoming-tournaments");
    const friendRequestBtn = document.getElementById("friend-request-btn");
    const friendRequestListBtn = document.getElementById("friend-request-list-btn");
    const addTournamentPreviewBtn = document.getElementById("add-tournament-preview-btn");
    if (!editProfileBtn || !upcomingTournaments || !friendRequestBtn) {
        console.error("One or more required elements are missing in the DOM.");
        return;
    }
    if (username === getCurrentUser()) {
        editProfileBtn === null || editProfileBtn === void 0 ? void 0 : editProfileBtn.classList.remove("hidden");
        editProfile();
        upcomingTournaments === null || upcomingTournaments === void 0 ? void 0 : upcomingTournaments.classList.remove("hidden");
        initRequests(username);
        initTournaments();
        addTournament();
    }
    else {
        editProfileBtn === null || editProfileBtn === void 0 ? void 0 : editProfileBtn.classList.add("hidden");
        upcomingTournaments === null || upcomingTournaments === void 0 ? void 0 : upcomingTournaments.classList.add("hidden");
        friendRequestBtn === null || friendRequestBtn === void 0 ? void 0 : friendRequestBtn.classList.remove("hidden");
        friendRequestListBtn === null || friendRequestListBtn === void 0 ? void 0 : friendRequestListBtn.classList.add("hidden");
        addTournamentPreviewBtn === null || addTournamentPreviewBtn === void 0 ? void 0 : addTournamentPreviewBtn.classList.add("hidden");
    }
}
