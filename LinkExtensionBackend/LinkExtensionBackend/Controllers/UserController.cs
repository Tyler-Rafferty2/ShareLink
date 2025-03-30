using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Linq;
using System.Threading.Tasks;
using LinkExtensionBackend.Data;
using LinkExtensionBackend.Models;

namespace LinkExtensionBackend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class UserController : ControllerBase
    {
        private readonly AppDbContext _context;

        public UserController(AppDbContext context)
        {
            _context = context;
        }

        // GET: api/User
        [HttpGet]
        public async Task<ActionResult<IEnumerable<User>>> GetUsers()
        {
            return await _context.Users.ToListAsync();
        }

        // GET: api/User/byDisplayName/{displayName}
        [HttpGet("byDisplayName/{displayName}")]
        public async Task<ActionResult<User>> GetUserByDisplayName(string displayName)
        {
            var user = await _context.Users.FirstOrDefaultAsync(u => u.DisplayName == displayName);

            if (user == null)
            {
                return NotFound();
            }

            return user;
        }



        // POST: api/User
        [HttpPost]
        public async Task<IActionResult> PostUser(User user)
        {
            var existingUser = await _context.Users.FirstOrDefaultAsync(u => u.Email == user.Email);

            if (existingUser != null)
            {
                return Conflict(new { message = "User with this email already exists." });
            }

            _context.Users.Add(user);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetUser), new { id = user.Id }, user);
        }

        // PUT: api/user/addFriendRequest/{id}
        [HttpPut("addFriendRequest/{id}")]
        public async Task<IActionResult> AddFriendRequest(int id, [FromBody] int friendId)
        {
            var user = await _context.Users.FirstOrDefaultAsync(u => u.Id == id);
            var friendUser = await _context.Users.FirstOrDefaultAsync(u => u.Id == friendId);

            if (user == null || friendUser == null)
            {
                return NotFound(new { message = "User not found" });
            }

            if (!user.FriendRequests.Contains(friendId) && !user.Friends.Contains(friendId))
            {
                user.FriendRequests.Add(friendId);
                await _context.SaveChangesAsync();
                return Ok(new { message = "Friend request sent successfully" });
            }

            return Ok(new { message = "Already sent request" });
        }

        // PUT: api/user/addFriendRequestSent/{id}
        [HttpPut("addFriendRequestSent/{id}")]
        public async Task<IActionResult> AddFriendRequestSent(int id, [FromBody] int friendId)
        {
            var user = await _context.Users.FirstOrDefaultAsync(u => u.Id == id);
            var friendUser = await _context.Users.FirstOrDefaultAsync(u => u.Id == friendId);

            if (user == null || friendUser == null)
            {
                return NotFound(new { message = "User not found" });
            }

            if (!user.FriendRequestsSent.Contains(friendId) && !user.Friends.Contains(friendId))
            {
                user.FriendRequestsSent.Add(friendId);
                await _context.SaveChangesAsync();
                return Ok(new { message = "Friend request sent successfully" });
            }

            return Ok(new { message = "Already sent request" });
        }

        // PUT: api/user/addFriend/{id}
        [HttpPut("addFriend/{id}")]
        public async Task<IActionResult> AddFriend(int id, [FromBody] int friendId)
        {
            var user = await _context.Users.FirstOrDefaultAsync(u => u.Id == id);
            var userFriend = await _context.Users.FirstOrDefaultAsync(u => u.Id == friendId);

            if (user == null || userFriend == null)
            {
                return NotFound(new { message = "User not found" });
            }

            if (!user.Friends.Contains(friendId))
            {
                user.Friends.Add(friendId);
                userFriend.Friends.Add(id);
                await _context.SaveChangesAsync();
                return Ok(new { message = "Friend added successfully" });
            }

            return Ok(new { message = "Already friends" });
        }

        // PUT: api/user/removeRequest/{id}
        [HttpPut("removeRequest/{id}")]
        public async Task<IActionResult> RemoveRequest(int id, [FromBody] int friendId)
        {
            var user = await _context.Users.FirstOrDefaultAsync(u => u.Id == id);
            var userFriend = await _context.Users.FirstOrDefaultAsync(u => u.Id == friendId);

            if (user == null || userFriend == null)
            {
                return NotFound(new { message = "User not found" });
            }

            user.FriendRequestsSent?.Remove(friendId);
            user.FriendRequests?.Remove(friendId);

            userFriend.FriendRequestsSent?.Remove(id);
            userFriend.FriendRequests?.Remove(id);

            await _context.SaveChangesAsync();

            return Ok(new { message = "Friend request removed successfully" });
        }

        // DELETE: api/User/{id}
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteUser(int id)
        {
            var user = await _context.Users.FirstOrDefaultAsync(u => u.Id == id);
            if (user == null)
            {
                return NotFound();
            }

            _context.Users.Remove(user);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        // GET: api/User/{id}
        [HttpGet("{id}")]
        public async Task<IActionResult> GetUser(int id)
        {
            var user = await _context.Users.FirstOrDefaultAsync(u => u.Id == id);
            if (user == null)
            {
                return NotFound();
            }

            return Ok(user);
        }
        // GET: api/User/email/{email}
        [HttpGet("email/{email}")]
        public async Task<IActionResult> GetUser(string email)
        {
            var user = await _context.Users.FirstOrDefaultAsync(u => u.Email == email);
            if (user == null)
            {
                return NotFound();
            }

            return Ok(user);
        }
        // GET: api/User/byEmail/{email}
        [HttpGet("byEmail/{email}")]
        public async Task<IActionResult> GetUserByEmail(string email)
        {
            var user = await _context.Users.FirstOrDefaultAsync(u => u.Email == email);

            if (user == null)
            {
                return NotFound(new { message = "User not found" });
            }

            return Ok(user);
        }
        // GET: api/User/byUserId/{userId}
        [HttpGet("byUserId/{userId}")]
        public async Task<IActionResult> GetUserByUserId(int userId)
        {
            var user = await _context.Users.FirstOrDefaultAsync(u => u.Id == userId);

            if (user == null)
            {
                return NotFound(new { message = "User not found" });
            }

            return Ok(user);
        }

        [HttpGet("friendsEmail/{userId}")]
        public async Task<IActionResult> GetFriends(int userId)
        {
            var links = await _context.Links
                .Where(link => link.SharedUserIds.Contains(userId))
                .ToListAsync();

            if (!links.Any())
            {
                return NotFound(new { message = "No links found for this user." });
            }

            return Ok(links);
        }
    }
}
