﻿namespace Vote.Monitor.Api.Feature.Notifications.ListSent;

public class Request
{
    public Guid ElectionRoundId { get; set; }

    [FromClaim("NgoId")]
    public Guid NgoId { get; set; }
}
