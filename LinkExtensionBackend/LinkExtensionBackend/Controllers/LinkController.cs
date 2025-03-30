using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Linq;
using System.Threading.Tasks;
using LinkExtensionBackend.Data;
using LinkExtensionBackend.Models;
using System.Collections.Generic;
using Microsoft.Data.SqlClient;


namespace LinkExtensionBackend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class LinkController : ControllerBase
    {
        private readonly AppDbContext _context;

        public LinkController(AppDbContext context)
        {
            _context = context;
        }

        // GET: api/Link
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Link>>> GetLinks()
        {
            return await _context.Links.ToListAsync();
        }

        // POST: api/Link
        [HttpPost]
        public async Task<IActionResult> PostLink([FromBody] Link link)
{
            if (link == null)
            {
                return BadRequest("Invalid link data");
            }

            // Serialize SharedUserIds to JSON string before saving to the database (if using JSON column type)
            link.SharedUserIds = link.SharedUserIds ?? new List<int>();  // Ensure it's not null

            // Add the new Link to the database
            _context.Links.Add(link);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetLinkById), new { id = link.Id }, link);    
         }

        // GET: api/Link/linksList/{id}
        [HttpGet("linksList/{userId}")]
        public async Task<IActionResult> GetLinks(int userId)
        {
            var query = @"
                SELECT [l].[Id], [l].[CreatedAt], [l].[Description], [l].[SharedUserIds], 
                       [l].[Title], [l].[Url], [l].[UserId]
                FROM [Links] AS [l]
                WHERE @userId IN (
                    SELECT [s].[value]
                    FROM OPENJSON([l].[SharedUserIds]) WITH ([value] int '$') AS [s]
                )";

            var links = await _context.Links.FromSqlRaw(query, new SqlParameter("@userId", userId)).ToListAsync();

            if(links == null)
            {
                return NotFound(new { message = "Error" });
            }

            return Ok(links);
        }
        [HttpGet("{id}")]
        public async Task<IActionResult> GetLinkById(int id)
        {
            var link = await _context.Links.FindAsync(id);
            if (link == null)
            {
                return NotFound();
            }

            return Ok(link);
        }
    }
}
