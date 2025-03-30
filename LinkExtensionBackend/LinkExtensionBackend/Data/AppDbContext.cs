using Microsoft.EntityFrameworkCore;
using LinkExtensionBackend.Models;  // Import your model namespace

namespace LinkExtensionBackend.Data  // Change this to your actual namespace
{
    public class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options)
        {
        }

        // Define DbSet properties for your entities (tables)
        public DbSet<User> Users { get; set; }  // Represents the Users table

        public DbSet<Link> Links { get; set; } // Represents the Links Table
        // Optionally, override OnModelCreating for additional configuration
        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);
            // Additional configuration, such as relationships, goes here
        }
    }
}
