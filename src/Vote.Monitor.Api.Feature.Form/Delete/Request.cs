﻿namespace Vote.Monitor.Api.Feature.Form.Delete;

public class Request
{
    public Guid ElectionRoundId { get; set; }
    public Guid MonitoringNgoId { get; set; }
    public Guid Id { get; set; }
}
