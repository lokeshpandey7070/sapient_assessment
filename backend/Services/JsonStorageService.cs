using System.Text.Json;
using backend.Models;

namespace backend.Services;

public class JsonStorageService : IJsonStorageService
{
    private readonly string _medicinesPath;
    private readonly string _salesPath;
    private static readonly SemaphoreSlim _lock = new(1, 1);
    private readonly JsonSerializerOptions _jsonOptions = new() { WriteIndented = true, PropertyNameCaseInsensitive = true };

    public JsonStorageService(IWebHostEnvironment env)
    {
        var dataDir = Path.Combine(env.ContentRootPath, "Data");
        Directory.CreateDirectory(dataDir);
        _medicinesPath = Path.Combine(dataDir, "medicines.json");
        _salesPath = Path.Combine(dataDir, "sales.json");

        if (!File.Exists(_medicinesPath)) File.WriteAllText(_medicinesPath, "[]");
        if (!File.Exists(_salesPath)) File.WriteAllText(_salesPath, "[]");
    }

    public async Task<List<Medicine>> GetMedicinesAsync()
    {
        await _lock.WaitAsync();
        try
        {
            var json = await File.ReadAllTextAsync(_medicinesPath);
            return JsonSerializer.Deserialize<List<Medicine>>(json, _jsonOptions) ?? new List<Medicine>();
        }
        finally
        {
            _lock.Release();
        }
    }

    public async Task AddMedicineAsync(Medicine medicine)
    {
        await _lock.WaitAsync();
        try
        {
            var json = await File.ReadAllTextAsync(_medicinesPath);
            var medicines = JsonSerializer.Deserialize<List<Medicine>>(json, _jsonOptions) ?? new List<Medicine>();
            
            medicine.Id = Guid.NewGuid();
            medicine.Price = Math.Round(medicine.Price, 2);
            medicines.Add(medicine);

            await File.WriteAllTextAsync(_medicinesPath, JsonSerializer.Serialize(medicines, _jsonOptions));
        }
        finally
        {
            _lock.Release();
        }
    }

    public async Task<bool> RecordSaleAsync(CreateSaleDto saleDto)
    {
        await _lock.WaitAsync();
        try
        {
            var medJson = await File.ReadAllTextAsync(_medicinesPath);
            var medicines = JsonSerializer.Deserialize<List<Medicine>>(medJson, _jsonOptions) ?? new List<Medicine>();
            
            var medicine = medicines.FirstOrDefault(m => m.Id == saleDto.MedicineId);
            if (medicine == null || medicine.Quantity < saleDto.QuantitySold)
            {
                return false;
            }

            // Deduct inventory
            medicine.Quantity -= saleDto.QuantitySold;

            // Log sale record
            var salesJson = await File.ReadAllTextAsync(_salesPath);
            var sales = JsonSerializer.Deserialize<List<SaleRecord>>(salesJson, _jsonOptions) ?? new List<SaleRecord>();

            var saleRecord = new SaleRecord
            {
                Id = Guid.NewGuid(),
                MedicineId = medicine.Id,
                MedicineName = medicine.FullName,
                QuantitySold = saleDto.QuantitySold,
                UnitPrice = medicine.Price,
                TotalPrice = Math.Round(medicine.Price * saleDto.QuantitySold, 2),
                SaleDate = DateTime.UtcNow
            };
            sales.Add(saleRecord);

            // Persist changes
            await File.WriteAllTextAsync(_medicinesPath, JsonSerializer.Serialize(medicines, _jsonOptions));
            await File.WriteAllTextAsync(_salesPath, JsonSerializer.Serialize(sales, _jsonOptions));

            return true;
        }
        finally
        {
            _lock.Release();
        }
    }

    public async Task<List<SaleRecord>> GetSalesAsync()
    {
        await _lock.WaitAsync();
        try
        {
            var json = await File.ReadAllTextAsync(_salesPath);
            return JsonSerializer.Deserialize<List<SaleRecord>>(json, _jsonOptions) ?? new List<SaleRecord>();
        }
        finally
        {
            _lock.Release();
        }
    }
}