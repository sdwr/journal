const SERVER_URL = 'http://localhost:4404'

function getPosts() {
    const options = {}
    options.method = 'GET';
    options.mode = 'cors';
    options.headers = {'Content-Type': 'application/json'}
    return fetch(SERVER_URL + "/posts", options)
}

function createPost(post) {
    const options = {}
    options.method = 'POST';
    options.mode = 'cors';
    options.headers = {'Content-Type': 'application/json'}
    options.body = JSON.stringify(post);
    return fetch(SERVER_URL + "/posts", options)
}

function getOnePost(postID) {
    const options = {}
    options.method = 'GET';
    options.mode = 'cors';
    options.headers = {'Content-Type': 'application/json'}
    return fetch(SERVER_URL + `/posts/${postID}`, options)
}

function updatePost(post) {
    const options = {}
    options.method = 'PATCH';
    options.mode = 'cors';
    options.headers = {'Content-Type': 'application/json'}
    options.body = JSON.stringify(post);
    return fetch(SERVER_URL + `/posts/${post.ID}`, options);
}

function deletePost(postID) {
    const options = {}
    options.method = 'DELETE';
    options.mode = 'cors';
    options.headers = {'Content-Type': 'application/json'}
    return fetch(SERVER_URL + `/posts/${postID}`, options);
}

export const api = {getPosts, createPost, getOnePost, updatePost, deletePost};