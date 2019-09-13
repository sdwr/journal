import {api} from './api.js';

const app = new Vue({
	el: '#app',
	data: {
		message: "Journal builder 0.1",
		posts: [],
		currentPost: {Title:"", CreatedAt: "", Content: "", ID:null}
	},
	created: function() {
		this.loadPosts();
	},
	methods: {
		loadPosts: function() {
			api.getPosts()
				.then(response => response.json())
				.then(json => {
				this.posts = JSON.parse(JSON.stringify(json));
				let currentIndex = this.findPost(this.currentPost);
				if(currentIndex > -1) {
					this.openPost(this.posts[currentIndex])
				} else if(this.posts.length > 0) {
					this.openPost(this.posts[0])
				}
			})
		},
		newPost: function() {
			this.savePost(this.currentPost);
			this.createPost();
		},
		createPost: function() {
			api.createPost(createNewPost())
				.then(_ => this.loadPosts());
		},
		savePost: function(post) {
			api.updatePost(post)
				.then(_ => this.loadPosts());
		},
		openPost: function(post) {
			this.currentPost = post;
			editor.content.innerHTML = this.currentPost.Content;
		},
		deletePost: function(post) {
			api.deletePost(post.ID)
				.then(_ => this.loadPosts());
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
		ID: null,
		Title: "New post",
		Content: ""
	}
}