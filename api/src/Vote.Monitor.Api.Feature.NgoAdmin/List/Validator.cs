﻿namespace Vote.Monitor.Api.Feature.NgoAdmin.List;

public class Validator : Validator<Request>
{
    public Validator()
    {
        RuleFor(x => x.NgoId).NotEmpty();

        RuleFor(x => x.PageNumber)
            .GreaterThanOrEqualTo(1);

        RuleFor(x => x.PageSize).InclusiveBetween(1, 100);
    }
}
