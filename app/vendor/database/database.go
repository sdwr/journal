package database

import(
    "time"

    "github.com/jinzhu/gorm"
    _ "github.com/jinzhu/gorm/dialects/postgres"

)

var DB *gorm.DB
var err error

type Model struct {
    ID uint `gorm:"primary_key";"AUTO_INCREMENT"`
    CreatedAt time.Time
    UpdatedAt time.Time
    DeletedAt *time.Time
}

type Post struct {
    gorm.Model
    Title string
    Content string
    Author string
}

func Init() (*gorm.DB, error) {
    connectionParams := "user=docker password=docker sslmode=disable host=db"
    for i := 0; i < 5; i++ {
        DB, err = gorm.Open("postgres", connectionParams)
        if err == nil {
            break
        }
        time.Sleep(1 * time.Second)
    }

    if err != nil {
        return DB, err
    }

    DB.AutoMigrate(&Post{})

    testPost := Post{Title: "Test post", Content: "Content goes here", Author: ""}
    DB.Create(&testPost)

    return DB, err
}