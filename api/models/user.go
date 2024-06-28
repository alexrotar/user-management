package models

import (
	"time"
)

type User struct {
	ID          uint      `gorm:"primaryKey;autoIncrement" json:"id"`
	Firstname   string    `gorm:"type:varchar(50);not null" json:"firstname"`
	Lastname    string    `gorm:"type:varchar(50);not null" json:"lastname"`
	Email       string    `gorm:"type:varchar(100);not null;unique" json:"email"`
	Profession  string    `gorm:"type:varchar(50);not null" json:"profession"`
	DateCreated time.Time `gorm:"type:date;not null" json:"dateCreated"`
	Country     string    `gorm:"type:varchar(100);not null" json:"country"`
	City        string    `gorm:"type:varchar(100);not null" json:"city"`
}
