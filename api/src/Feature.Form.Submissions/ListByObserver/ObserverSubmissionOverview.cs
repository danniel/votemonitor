﻿namespace Feature.Form.Submissions.ListByObserver;

public record ObserverSubmissionOverview
{
    public Guid MonitoringObserverId { get; init; }
    public string FirstName { get; init; } = default!;
    public string LastName { get; init; } = default!;
    public string Email { get; init; } = default!;
    public string PhoneNumber { get; init; } = default!;
    public string[] Tags { get; init; } = [];
    public int NumberOfFlaggedAnswers { get; init; }
    public int NumberOfLocations { get; init; }
    public int NumberOfFormsSubmitted { get; init; }
}