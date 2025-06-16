"use strict";
function initWipeText() {
    document.querySelectorAll(".wipe-text").forEach((el) => {
        var _a;
        const text = ((_a = el.textContent) === null || _a === void 0 ? void 0 : _a.trim()) || "";
        el.innerHTML = "";
        el.style.display = "flex";
        text.split("").forEach((char, index) => {
            const span = document.createElement("span");
            span.textContent = char === " " ? "\u00A0" : char;
            span.style.opacity = "0";
            span.style.transition = `opacity 0.5s ease-out ${index * 0.1}s`;
            el.appendChild(span);
        });
        const observer = new IntersectionObserver((entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    el.querySelectorAll("span").forEach((span) => {
                        span.style.opacity = "1";
                    });
                }
            });
        }, { threshold: 0.5 });
        observer.observe(el);
    });
}
;
