﻿namespace Vote.Monitor.Feature.PollingStation.GetTagValues;

public class Validator : Validator<Request>
{
    public Validator()
    {
        RuleFor(x => x.SelectTag)
            .NotEmpty();

        RuleFor(x=>x.Filter)
            .Must(filter =>
            {
                return filter!.Keys.All(tag => !string.IsNullOrWhiteSpace(tag));
            })
            .When(x => x.Filter != null && x.Filter.Any());
    }
}
