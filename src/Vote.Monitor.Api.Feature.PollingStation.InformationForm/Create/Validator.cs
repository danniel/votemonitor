﻿namespace Vote.Monitor.Api.Feature.PollingStation.InformationForm.Create;

public class Validator : Validator<Request>
{
    public Validator()
    {
        RuleFor(x => x.ElectionRoundId).NotEmpty();
    }
}
