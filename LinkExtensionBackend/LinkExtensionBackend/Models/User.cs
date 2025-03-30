using System.Collections.Generic;
using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace LinkExtensionBackend.Models
{
    public class User
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)] // Auto-generate Id
        public int Id { get; set; }

        [Required]
        [EmailAddress]
        public string? Email { get; set; }

        public string? DisplayName { get; set; }

        // Storing user IDs instead of emails for better relationships
        public List<int> Friends { get; set; }
        public List<int> FriendRequests { get; set; }
        public List<int> FriendRequestsSent { get; set; }

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        public List<Link>? Links { get; set; } // Each user can have multiple links

        public User()
        {
            Friends = new List<int>();
            FriendRequests = new List<int>();
            FriendRequestsSent = new List<int>();
        }
    }
}
