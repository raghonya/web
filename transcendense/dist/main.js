"use strict";
const mainWrapper = document.getElementById("wrapper");
function getCurrentUser() {
    return localStorage.getItem("currentUser");
}
const currentUser = getCurrentUser();
function loadTemplate(templateId, title) {
    if (!mainWrapper)
        return;
    const template = document.getElementById(templateId);
    if (!template) {
        console.warn(`Template "${templateId}" not found.`);
        return;
    }
    const clone = template.content.cloneNode(true);
    mainWrapper.innerHTML = '';
    mainWrapper.appendChild(clone);
    document.title = title;
    if (templateId != "profile-template")
        location.hash = `#${templateId.split('-')[0]}`;
}
function loadHomePage() {
    loadTemplate("home-template", "Welcome to Pong!");
    initWipeText();
}
function loadSignInForm() {
    loadTemplate("signin-template", "Sign In");
}
function loadSignUpForm() {
    loadTemplate("signup-template", "Sign Up");
}
function loadGamePage() {
    loadTemplate("game-template", "Pong Game");
    initializePongGame();
}
function loadProfilePage(username = null) {
    const currentUser = getCurrentUser();
    if (username === currentUser || username === null) {
        if (location.hash !== "#profile") {
            location.hash = "#profile";
            return;
        }
    }
    else {
        if (location.hash !== `#profile/${username}`) {
            location.hash = `#profile/${username}`;
            return;
        }
    }
    loadTemplate("profile-template", "Pong Profile");
    initPersonaleData(username);
}
const routes = {
    "#": loadHomePage,
    "#home": loadHomePage,
    "#signin": loadSignInForm,
    "#signup": loadSignUpForm,
    "#game": loadGamePage,
    "#profile": loadProfilePage,
};
function handleRouting() {
    const hash = location.hash;
    if (hash.startsWith("#profile/")) {
        const username = hash.split("/")[1];
        if (!username) {
            console.error("Invalid profile URL");
            loadHomePage();
            return;
        }
        loadProfilePage(username);
        return;
    }
    const route = routes[hash] || loadHomePage;
    route();
}
window.addEventListener("DOMContentLoaded", handleRouting);
window.addEventListener("hashchange", handleRouting);
