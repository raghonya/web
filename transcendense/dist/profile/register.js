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
const registrationForm = document.getElementById('registrationForm');
if (registrationForm) {
    registrationForm.addEventListener('submit', (event) => __awaiter(void 0, void 0, void 0, function* () {
        event.preventDefault();
        const formData = new FormData(registrationForm);
        const formValues = {};
        formData.forEach((value, key) => {
            if (typeof value === 'string') {
                formValues[key] = value;
            }
        });
        try {
            const response = yield fetch('https://pong/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formValues),
            });
            // if (!response.ok) {
            // 	throw new Error(`HTTP error! Status: ${response.status}`);
            // }
            // const result = await response.json();
            // loadProfile();
            // console.log('Registration successful:', result);
        }
        catch (error) {
            console.error('Registration failed:', error);
        }
    }));
}
// Authorization: `Bearer ${localStorage.getItem('jsonwebtoken')}`,
