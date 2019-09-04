import {api} from './api.js';

let nextID = initIDGenerator()

const app = new Vue({
	el: '#app',
	data: {
		message: "Journal builder 0.1",
		posts: [],
		currentPost: {Title:"new post", CreatedAt: "2222", Content: "hi"}
	},
	created: function() {
		api.getPosts()
			.then(response => response.json())
			.then(json => {
				this.posts = JSON.parse(JSON.stringify(json))
				this.currentPost = this.posts[0];
			})
	},
	methods: {
		newPost: function() {
			this.savePost(this.currentPost);
			this.createPost();
		},
		createPost: function() {
			this.savePost(createNewPost());
		},
		savePost: function(post) {
			let postCopy = {};
			Object.assign(postCopy, post);
			let postIndex = this.findPost(postCopy);
			if(postIndex >= 0) {
				this.posts[postIndex] = postCopy;
				this.posts.push({});
				this.posts.pop();
			} else {
				this.posts.push(postCopy);
			}
		},
		openPost: function(post) {
			Object.assign(this.currentPost, post);
			editor.content.innerHTML = post.Content;
		},
		deletePost: function(post) {
			let postIndex = this.findPost(post);
			if(postIndex >= 0 && this.posts.length > 0) {
				this.posts.splice(postIndex, 1);
				this.openPost(this.posts[0])
			}
		},
		findPost: function(post) {
			return this.posts.findIndex(p => p.ID === post.ID);
		},
		isSelected: function(post) {
			return this.currentPost.ID === post.ID;
		}

	}
});

pell.init({
	element: document.getElementById('editor'),
	onChange: function(html) {app.currentPost.Content = html}
});

//helpers

function createNewPost() {
	return {
		ID: nextID(),
		Title: "New post",
		Content: ""
	}
}

function initIDGenerator() {
	let next = 1;
	let idGenerator = function() {
		return next++;
	}
	return idGenerator;
}