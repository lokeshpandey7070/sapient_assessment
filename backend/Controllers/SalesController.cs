using backend.Models;
using backend.Services;
using Microsoft.AspNetCore.Mvc;

namespace backend.Controllers;

[ApiController]
[Route("api/[controller]")]
public class SalesController : ControllerBase
{
    private readonly IJsonStorageService _storageService;

    public SalesController(IJsonStorageService storageService)
    {
        _storageService = storageService;
    }

    [HttpPost]
    public async Task<IActionResult> CreateSale([FromBody] CreateSaleDto saleDto)
    {
        if (!ModelState.IsValid)
        {
            return BadRequest(ModelState);
        }

        var success = await _storageService.RecordSaleAsync(saleDto);
        if (!success)
        {
            return BadRequest(new { message = "Insufficient stock or invalid medicine ID." });
        }

        return Ok(new { message = "Sale recorded successfully." });
    }

    [HttpGet]
    public async Task<IActionResult> GetSales()
    {
        var sales = await _storageService.GetSalesAsync();
        return Ok(sales);
    }
}