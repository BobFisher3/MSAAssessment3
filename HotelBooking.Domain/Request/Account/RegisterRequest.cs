using HotelBooking.Domain.User;

namespace HotelBooking.Domain.Request.Account
{
    //Get / sets for register requests
    public class RegisterRequest
    {
        public string Email { get; set; }
        public string Password { get; set; }
        public string Avatar { get; set; }
        public string Name { get; set; }
        public string PhoneNumber { get; set; }
        public Gender Gender { get; set; }
    }
}