package main

import (
    "net/http"
    "os"
    "fmt"
)

func build() {
    
}

func serve() {
    http.Handle("/", http.FileServer(http.Dir("./")))
    http.ListenAndServe(":80", nil)
}

func main() {
    if len(os.Args) <= 1 {
        fmt.Println("expected mode")
        os.Exit(1)
    }
    switch os.Args[1] {
    case "serve":
        serve()
    }
}
