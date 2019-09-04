let nextID = initIDGenerator()

const app = new Vue({
	el: '#app',
	data: {
		message: "Journal builder 0.1",
		posts: [],
		currentPost: createNewPost()
	},
	created: function() {
		let post = createNewPost();
		this.savePost(post);
		this.openPost(post);
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
			editor.content.innerHTML = post.content;
		},
		deletePost: function(post) {
			let postIndex = this.findPost(post);
			if(postIndex >= 0 && this.posts.length > 0) {
				this.posts.splice(postIndex, 1);
				this.openPost(this.posts[0])
			}
		},
		findPost: function(post) {
			return this.posts.findIndex(p => p.id === post.id);
		},
		isSelected: function(post) {
			return this.currentPost.id === post.id;
		}

	}
});

pell.init({
	element: document.getElementById('editor'),
	onChange: function(html) {app.currentPost.content = html}
});

//helpers

function createNewPost() {
	return {
		id: nextID(),
		title: "New post",
		timestamp: new Date().toDateString(),
		content: ""
	}
}

function initIDGenerator() {
	let next = 1;
	let idGenerator = function() {
		return next++;
	}
	return idGenerator;
}