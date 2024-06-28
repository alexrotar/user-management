package routes

import (
	"fmt"
	"log"
	"net/http"
	"net/url"
	"strings"
	"time"

	"github.com/alexrotar/user-management/api/models"
	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
)

func SearchRoute(router *gin.Engine, db *gorm.DB) {

	router.GET("/api/users/search", func(c *gin.Context) {
		rawQuery := c.Query("q")
		query, err := url.QueryUnescape(rawQuery)
		if err != nil {
			log.Printf("Error decoding query parameter: %v", err)
			c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid query parameter"})
			return
		}

		query = strings.TrimSpace(query)

		var results []models.User
		if query == "" {
			c.JSON(http.StatusOK, gin.H{"data": results})
			return
		}

		tsQuery := strings.Join(strings.Fields(query), " | ")
		searchQuery := fmt.Sprintf("%%%s%%", query)

		result := db.Raw(
			`SELECT id, firstname, lastname, email, profession, date_created, country, city
             FROM users
             WHERE tsv @@ to_tsquery(?)
                OR firstname ILIKE ?
                OR lastname ILIKE ?
                OR email ILIKE ?
                OR profession ILIKE ?
                OR country ILIKE ?
                OR city ILIKE ?
             ORDER BY date_created ASC`,
			tsQuery, searchQuery, searchQuery, searchQuery, searchQuery, searchQuery, searchQuery).Scan(&results)
		if result.Error != nil {
			log.Printf("Error querying database: %v", result.Error)
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Search query error"})
			return
		}

		c.JSON(http.StatusOK, gin.H{"data": results})
	})

	router.GET("/api/users/search/date-range", func(c *gin.Context) {
		startDateStr := c.Query("startDate")
		endDateStr := c.Query("endDate")

		var startDate, endDate time.Time
		var err error

		if startDateStr == "" {
			startDate = time.Now()
		} else {
			startDate, err = time.Parse("2006-01-02", startDateStr)
			if err != nil {
				c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid start date"})
				return
			}
		}

		if endDateStr == "" {
			endDate = time.Now()
		} else {
			endDate, err = time.Parse("2006-01-02", endDateStr)
			if err != nil {
				c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid end date"})
				return
			}
		}

		var users []models.User
		result := db.Where("date_created BETWEEN ? AND ?", startDate, endDate).Order("date_created ASC").Find(&users)
		if result.Error != nil {
			log.Printf("Error querying database: %v", result.Error)
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Error retrieving users"})
			return
		}

		c.JSON(http.StatusOK, gin.H{"data": users})
	})
}
