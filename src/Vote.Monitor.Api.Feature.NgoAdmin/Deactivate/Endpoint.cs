﻿using Vote.Monitor.Api.Feature.NgoAdmin.Specifications;

namespace Vote.Monitor.Api.Feature.NgoAdmin.Deactivate;

public class Endpoint : Endpoint<Request, Results<NoContent, NotFound>>
{
     readonly IRepository<NgoAdminAggregate> _repository;

    public Endpoint(IRepository<NgoAdminAggregate> repository)
    {
        _repository = repository;
    }

    public override void Configure()
    {
        Post("/api/ngos/{ngoId}/admins/{id}:deactivate");
        DontAutoTag();
        Options(x => x.WithTags("ngo-admins"));
        Description(x => x.Accepts<Request>());
    }

    public override async Task<Results<NoContent, NotFound>> ExecuteAsync(Request req, CancellationToken ct)
    {
        var specification = new GetNgoAdminByIdSpecification(req.NgoId, req.Id);
        var ngoAdmin = await _repository.SingleOrDefaultAsync(specification, ct);

        if (ngoAdmin is null)
        {
            return TypedResults.NotFound();
        }

        ngoAdmin.Deactivate();
        await _repository.SaveChangesAsync(ct);

        return TypedResults.NoContent();
    }
}
