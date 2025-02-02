"use strict";

const button = document.getElementById("submitButton");
const warning = document.getElementById("warning");
const content = document.getElementById("content");
const max_length = 140;

button.addEventListener("click", (event) => {
    if (isEmptyString(content.value) === true) {
	event.preventDefault();
	warning.innerText = "空白文字のみの投稿は禁止されています";
    } else if (exceedLength(content.value) === true) {
	event.preventDefault();
	warning.innerText = "140字を超えた投稿は禁止されています";
    } else {
	warning.innerText = "";
    }
});

function isEmptyString(content) {
    const pattern = /^\s*$/;
    return pattern.test(content);
}

function exceedLength(content) {
    return content.length > max_length;
}
