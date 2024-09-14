"use strict";
const timeline = document.querySelector("#timeline");
const startDate = 0;
const endDate = 10;
const startTime = 11;
const endTime = 16;

document.addEventListener("DOMContentLoaded", () => {
    fetch("http://localhost:3000/posts")
	.then(response => response.json())
	.then(posts => {
	    posts.forEach((post) => {
		const newDiv = document.createElement("div");
		const meta = document.createElement("p");
		const content = document.createElement("p");
		newDiv.className = "border border-radius";
		meta.textContent = post.User.username + " " + post.createdAt.slice(startDate, endDate).replaceAll("-", "/") + " " + post.createdAt.slice(startTime, endTime);
		content.textContent = post.content;
		newDiv.appendChild(meta);
		newDiv.appendChild(content);
		timeline.appendChild(newDiv);
	    });
	})
	.catch(error => console.error(error));
});
