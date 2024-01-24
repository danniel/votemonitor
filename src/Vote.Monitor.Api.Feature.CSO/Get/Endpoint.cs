﻿namespace Vote.Monitor.Api.Feature.CSO.Get;

public class Endpoint(IReadRepository<CSOAggregate> repository) : Endpoint<Request, Results<Ok<CSOModel>, NotFound>>
{
    public override void Configure()
    {
        Get("/api/csos/{id}");
    }

    public override async Task<Results<Ok<CSOModel>, NotFound>> ExecuteAsync(Request req, CancellationToken ct)
    {
        var CSO = await repository.GetByIdAsync(req.Id, ct);

        if (CSO is null)
        {
            return TypedResults.NotFound();
        }

        return TypedResults.Ok(new CSOModel
        {
            Id = CSO.Id,
            Name = CSO.Name,
            Status = CSO.Status,
            CreatedOn = CSO.CreatedOn,
            LastModifiedOn = CSO.LastModifiedOn
        });
    }
}
