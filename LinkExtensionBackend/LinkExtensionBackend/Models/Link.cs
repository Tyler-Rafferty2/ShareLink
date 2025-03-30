using System.Collections.Generic;
using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace LinkExtensionBackend.Models
{
    public class Link
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int Id { get; set; }

        [Required]
        public string? Url { get; set; }  // URL of the link

        public string? Title { get; set; }  // Title of the link

        public string? Description { get; set; }  // Optional description

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;  // Date when the link was created

        // Foreign Key to User (creator of the link)
       public int UserId { get; set; }  // This should be an integer, not a User object

        // Navigation Property to User (creator of the link)
        public User? User { get; set; }  // This is the navigation property to the User

        // List of UserIds to whom the link should be shared
        public List<int> SharedUserIds { get; set; }

        public Link()
        {
            SharedUserIds = new List<int>(); // Initialize list
        }
    }
}
