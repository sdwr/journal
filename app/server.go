package main

import (
	"fmt"
	"log"
	"net/http"
	"io/ioutil"
    "encoding/json"
    "os"

    "github.com/gorilla/mux"

    "database"
)

type Post = database.Post
type Model = database.Model

func getPosts(w http.ResponseWriter, r *http.Request) {
    var posts []Post
    database.DB.Find(&posts)
    json.NewEncoder(w).Encode(posts)
}

func createPost(w http.ResponseWriter, r *http.Request) {
    var newPost Post
    body, err := ioutil.ReadAll(r.Body)
    if err != nil {
        fmt.Fprintf(w, "Error reading post data")
    }

    json.Unmarshal(body, &newPost)
    database.DB.Create(&newPost)

    w.WriteHeader(http.StatusCreated)
    json.NewEncoder(w).Encode(newPost)
}

func getOnePost(w http.ResponseWriter, r *http.Request) {
    postID := mux.Vars(r)["id"]
    var post Post

    database.DB.Find(&post, postID)
    json.NewEncoder(w).Encode(post)

}

func updatePost(w http.ResponseWriter, r *http.Request) {
    var post Post
    body, err := ioutil.ReadAll(r.Body)
    if err != nil {
        fmt.Fprintf(w, "Error reading post data")
    }

    json.Unmarshal(body, &post)
    database.DB.Save(&post)
}

func deletePost(w http.ResponseWriter, r *http.Request) {
    postID := mux.Vars(r)["id"]
    database.DB.Table("posts").Where("ID = ?", postID).Delete(&Post{})

}

func indexHandler(w http.ResponseWriter, r *http.Request) {
    body, _ := ioutil.ReadFile("./web/index.html")
    fmt.Fprintf(w, "%s", body)
}

func main() {
    defer database.DB.Close()

    router := mux.NewRouter()
	router.HandleFunc("/", indexHandler)
    router.HandleFunc("/posts", getPosts).Methods("GET")
    router.HandleFunc("/posts", createPost).Methods("POST")
    router.HandleFunc("/posts/{id}", getOnePost).Methods("GET")
    router.HandleFunc("/posts/{id}", updatePost).Methods("PATCH")
    router.HandleFunc("/posts/{id}", deletePost).Methods("DELETE")


    fs := http.FileServer(http.Dir("./web/"))
    prefixHandler := http.StripPrefix("/web/", fs)

    router.PathPrefix("/web/").Handler(prefixHandler)

    initDB()
    
    env := os.Getenv("APP_ENV")
    log.Println("running server in " + env + " mode")
    log.Fatal(http.ListenAndServe(":4404", router))
}

func initDB() {
    _, err := database.Init()
    if err != nil {
        log.Println("connection to DB failed, shutting down...")
        log.Fatal(err)
    }

    log.Println("connected to DB")
}