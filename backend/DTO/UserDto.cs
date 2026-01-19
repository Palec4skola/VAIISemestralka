public record UserProfileDto(
    int Id,
    string Email,
    string Name
);

public record UpdateUserProfileDto(
    string Name
);
