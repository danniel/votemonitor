﻿using System.Text.Json.Serialization;
using Ardalis.SmartEnum.SystemTextJson;
using Vote.Monitor.Domain.Entities.ExportedDataAggregate;

namespace Feature.Form.Submissions.GetExportedDataDetails;

public class ExportedDataDetails
{
    [JsonConverter(typeof(SmartEnumNameConverter<ExportedDataStatus, string>))]
    public ExportedDataStatus ExportStatus { get; set; }
    public Guid ExportedDataId { get; set; }
    public string FileName { get; set; }
    public DateTime StartedAt { get; set; }
    public DateTime? CompletedAt { get; set; }
}
