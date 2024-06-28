package routes

import (
	"log"
	"net/http"
	"strconv"

	"github.com/alexrotar/user-management/api/models"
	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
)

func UsersRoute(router *gin.Engine, db *gorm.DB) {

	router.GET("/api/users", func(c *gin.Context) {
		var users []models.User
		result := db.Raw("SELECT * FROM users LIMIT 10").Scan(&users)
		if result.Error != nil {
			log.Printf("Error querying database: %v", result.Error)
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Error retrieving users"})
			return
		}

		c.JSON(http.StatusOK, gin.H{"data": users})
	})

	router.GET("/api/users/:id", func(c *gin.Context) {
		userID := c.Param("id")
		id, err := strconv.Atoi(userID)
		if err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid user ID"})
			return
		}

		var user models.User
		result := db.First(&user, id)
		if result.Error != nil {
			if result.Error == gorm.ErrRecordNotFound {
				c.JSON(http.StatusNotFound, gin.H{"error": "User not found"})
			} else {
				log.Printf("Error retrieving user: %v", result.Error)
				c.JSON(http.StatusInternalServerError, gin.H{"error": "Error retrieving user"})
			}
			return
		}

		c.JSON(http.StatusOK, gin.H{"data": user})
	})

	router.DELETE("/api/users/:id", func(c *gin.Context) {
		userID := c.Param("id")
		id, err := strconv.Atoi(userID)
		if err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid user ID"})
			return
		}

		result := db.Delete(&models.User{}, id)
		if result.Error != nil {
			log.Printf("Error deleting user: %v", result.Error)
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Error deleting user"})
			return
		}

		if result.RowsAffected == 0 {
			c.JSON(http.StatusNotFound, gin.H{"error": "User not found"})
			return
		}

		c.JSON(http.StatusOK, gin.H{"message": "User deleted"})
	})

	router.GET("/api/users/professions", func(c *gin.Context) {
		var professions []string
		result := db.Raw("SELECT DISTINCT profession FROM users").Scan(&professions)
		if result.Error != nil {
			log.Printf("Error querying database for professions: %v", result.Error)
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Error retrieving professions"})
			return
		}

		c.JSON(http.StatusOK, gin.H{"data": professions})
	})

	router.GET("/api/users/professions/:professionName", func(c *gin.Context) {
		profession := c.Param("professionName")

		var users []models.User
		result := db.Raw("SELECT * FROM users WHERE profession = ?", profession).Scan(&users)
		if result.Error != nil {
			log.Printf("Error querying database for users by profession: %v", result.Error)
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Error retrieving users"})
			return
		}

		c.JSON(http.StatusOK, gin.H{"data": users})
	})
}
