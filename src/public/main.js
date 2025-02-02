"use strict";

const GET_INTERVAL = 5000;

const REQUEST_URL = "http://localhost:3000/posts";

setInterval(getPosts, GET_INTERVAL);

function getPosts() {
    const xhr = new XMLHttpRequest();
    xhr.open("GET", REQUEST_URL);
    xhr.send();
    xhr.addEventListener("load", () => {
	if (xhr.status === 200) {
	    showResponse(JSON.parse(xhr.response));
	}
    });
}

function showResponse(response) {
    const timeline = document.getElementById("timeline");
    timeline.innerHTML = "";
    response.forEach((post) => {
	const newdiv = document.createElement("div");
	const meta = document.createElement("p");
	const content = document.createElement("p");
	newdiv.className = "border border-radius";
	meta.textContent = post.User.username + " " + post.createdAt.slice(0, 10).replaceAll("-", "/") + " " + post.createdAt.slice(11, 16);
	content.style.cssText = "white-space:pre-line";
	content.textContent = post.content;
	newdiv.appendChild(meta);
	newdiv.appendChild(content);
	timeline.appendChild(newdiv);
    });
}
