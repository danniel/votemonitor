﻿using FastEndpoints;
using FluentValidation;
using Vote.Monitor.Core.Validation;

namespace Vote.Monitor.Domain.Entities.FormBase.Validation;

internal class SectionValidator : Validator<FormSection>
{
    internal SectionValidator()
    {
        RuleFor(x => x.Title)
            .SetValidator(new TranslatedStringValidator());

        RuleForEach(x => x.Questions)
            .SetInheritanceValidator(v =>
            {
                v.Add(new TextQuestionValidator());
                v.Add(new NumberQuestionValidator());
                v.Add(new DateQuestionValidator());
                v.Add(new SingleSelectQuestionValidator());
                v.Add(new MultiSelectQuestionValidator());
                v.Add(new RatingQuestionValidator());
            });
    }
}
