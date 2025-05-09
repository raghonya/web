"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
const loginForm = document.getElementById('loginForm');
if (loginForm) {
    loginForm.addEventListener('submit', (event) => __awaiter(void 0, void 0, void 0, function* () {
        event.preventDefault();
        const formData = new FormData(loginForm);
        const formValues = {};
        formData.forEach((value, key) => {
            if (typeof value === 'string') {
                formValues[key] = value;
            }
        });
        try {
            const response = yield fetch('https://pong/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formValues),
            });
            if (!response.ok) {
                throw new Error(`HTTPS error! Status: ${response.status}`);
            }
            const result = yield response.json();
            const username = result === null || result === void 0 ? void 0 : result.username;
            if (!username) {
                throw new Error("No username in login response.");
            }
            localStorage.setItem("currentUser", username);
            // const profileResponse = await fetch(`https://pong/users/${username}`, {
            // 	method: 'GET',
            // 	headers: {
            // 		'Authorization': `Bearer ${localStorage.getItem('jsonwebtoken')}`,
            // 		'Content-Type': 'application/json',
            // 	},
            // });
            // if (!profileResponse.ok) {
            // 	throw new Error(`Failed to fetch user profile. Status: ${profileResponse.status}`);
            // }
            // const profileData = await profileResponse.json();
            // console.log("Loaded user profile:", profileData);
            // location.hash = "#profile";
        }
        catch (error) {
            console.error('Login failed:', error);
        }
    }));
}
