package main

import (
	"fmt"
	"log"
	"net/http"
	"io/ioutil"
)

func main() {
	http.HandleFunc("/", handler)
	log.Fatal(http.ListenAndServe(":8080", nil))
}

func handler(w http.ResponseWriter, r *http.Request) {
	body, _ := ioutil.ReadFile("index.html")
	fmt.Fprintf(w, "%s", body)
}