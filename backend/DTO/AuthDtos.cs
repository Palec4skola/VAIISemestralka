namespace backend.DTO
{
    public record AuthDtos
    (
        string Name,
        string Email,
        string Password
    );
    public record LoginRequest
    (
        string Email,
        string Password
    );
}
