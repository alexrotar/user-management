package main

import (
	"log"
	"os"

	"github.com/alexrotar/user-management/api/routes"
	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
	"gorm.io/driver/postgres"
	"gorm.io/gorm"
	"gorm.io/gorm/logger"
)

func main() {
	connStr := os.Getenv("POSTGRES_CONNECTION_STRING")
	db, err := gorm.Open(postgres.Open(connStr), &gorm.Config{
		Logger: logger.Default.LogMode(logger.Silent),
	})
	if err != nil {
		log.Fatal(err)
	}

	// Run migrations
	runMigrations()

	router := gin.Default()

	// Set up CORS middleware
	router.Use(cors.New(cors.Config{
		AllowOrigins: []string{"http://localhost:3000"},
		AllowMethods: []string{"GET", "POST", "PUT", "DELETE"},
	}))

	routes.SearchRoute(router, db)
	routes.UsersRoute(router, db)

	router.Run(":8080")
}
