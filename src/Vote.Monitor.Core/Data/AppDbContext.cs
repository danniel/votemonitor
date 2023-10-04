﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Hosting;
using Vote.Monitor.Core.Models;

namespace Vote.Monitor.Core.Data;
public class AppDbContext: DbContext
{
    public DbSet<PollingStationModel> PollingStations { get; set; }
    public DbSet<TagModel> Tags { get; set; }    

    public AppDbContext(DbContextOptions<AppDbContext> options) : base(options)
    {
    }   

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<PollingStationModel>()
            .HasMany(p => p.Tags)
            .WithMany(t => t.PollingStations)
            .UsingEntity(
            "PollingStationTag",
            l => l.HasOne(typeof(TagModel)).WithMany().HasForeignKey("TagId").HasPrincipalKey(nameof(TagModel.Id)),
            r => r.HasOne(typeof(PollingStationModel)).WithMany().HasForeignKey("PollingStationId").HasPrincipalKey(nameof(PollingStationModel.Id)),
            j => j.HasKey("PollingStationId", "TagId"))
            .Navigation(e=>e.Tags).AutoInclude();
        
    }

}
