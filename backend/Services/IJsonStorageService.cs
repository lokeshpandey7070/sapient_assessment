using backend.Models;

namespace backend.Services;

public interface IJsonStorageService
{
    Task<List<Medicine>> GetMedicinesAsync();
    Task AddMedicineAsync(Medicine medicine);
    Task<bool> RecordSaleAsync(CreateSaleDto saleDto);
    Task<List<SaleRecord>> GetSalesAsync();
}