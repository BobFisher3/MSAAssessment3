namespace HotelBooking.Domain.Request.Account
{
    //Get / sets for legin requests
    public class LoginRequest
    {
        public string Email { get; set; }
        public string Password { get; set; }
    }
}