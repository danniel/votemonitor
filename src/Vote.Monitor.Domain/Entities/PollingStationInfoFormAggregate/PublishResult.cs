﻿using FluentValidation.Results;

namespace Vote.Monitor.Domain.Entities.PollingStationInfoFormAggregate;

public abstract record PublishResult
{
    public record Published : PublishResult;
    public record InvalidFormTemplate(ValidationResult Problems) : PublishResult;

    private PublishResult()
    {
    }
}
