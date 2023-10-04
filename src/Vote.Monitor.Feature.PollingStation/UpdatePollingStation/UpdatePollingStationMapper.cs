﻿using FastEndpoints;
using Vote.Monitor.Core.Models;
using Vote.Monitor.Feature.PollingStation.GetPollingStation;

namespace Vote.Monitor.Feature.PollingStation.UpdatePollingStation;
internal class UpdatePollingStationMapper : Mapper<PollingStationUpdateRequestDTO, PollingStationReadDto, PollingStationModel>
{
    public override PollingStationModel ToEntity(PollingStationUpdateRequestDTO source)
    {
        var model =  new PollingStationModel()
        {
            Address = source.Address,
            DisplayOrder = source.DisplayOrder
           
        };
        foreach(var tag in source.Tags)
        {
            model.Tags.Add(new TagModel()
            {
                Key = tag.Key,
                Value = tag.Value
            });
        }
        return model;
    }
}
