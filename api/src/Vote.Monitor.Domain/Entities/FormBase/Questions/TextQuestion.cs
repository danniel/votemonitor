﻿using System.Text.Json.Serialization;
using Vote.Monitor.Core.Models;

namespace Vote.Monitor.Domain.Entities.FormBase.Questions;

public record TextQuestion : BaseQuestion
{
    public TranslatedString? InputPlaceholder { get; private set; }

    [JsonConstructor]
    internal TextQuestion(Guid id,
        string code,
        TranslatedString text,
        TranslatedString? helptext,
        TranslatedString? inputPlaceholder) : base(id, code, text, helptext)
    {
        InputPlaceholder = inputPlaceholder;
    }

    public static TextQuestion Create(Guid id,
        string code,
        TranslatedString text,
        TranslatedString? helptext = null,
        TranslatedString? inputPlaceholder = null)
        => new(id, code, text, helptext, inputPlaceholder);

    protected override void AddTranslationsInternal(string languageCode)
    {
        InputPlaceholder?.AddTranslation(languageCode);

    }

    protected override void RemoveTranslationInternal(string languageCode)
    {
        InputPlaceholder?.RemoveTranslation(languageCode);
    }
}
