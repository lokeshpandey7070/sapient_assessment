using backend.Models;
using backend.Services;
using Microsoft.AspNetCore.Mvc;

namespace backend.Controllers;

[ApiController]
[Route("api/[controller]")]
public class MedicinesController : ControllerBase
{
    private readonly IJsonStorageService _storageService;

    public MedicinesController(IJsonStorageService storageService)
    {
        _storageService = storageService;
    }

    [HttpGet]
    public async Task<IActionResult> GetAll([FromQuery] string? search)
    {
        var medicines = await _storageService.GetMedicinesAsync();

        if (!string.IsNullOrWhiteSpace(search))
        {
            medicines = medicines
                .Where(m => m.FullName.Contains(search, StringComparison.OrdinalIgnoreCase))
                .ToList();
        }

        return Ok(medicines);
    }

    [HttpPost]
    public async Task<IActionResult> Create([FromBody] Medicine medicine)
    {
        if (!ModelState.IsValid)
        {
            return BadRequest(ModelState);
        }

        await _storageService.AddMedicineAsync(medicine);
        return CreatedAtAction(nameof(GetAll), new { id = medicine.Id }, medicine);
    }
}