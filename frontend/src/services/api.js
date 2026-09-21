const BASE_URL = 'http://localhost:5000/api'; // Adjust port to match your .NET Web API

export const getMedicines = async (search = '') => {
  const query = search ? `?search=${encodeURIComponent(search)}` : '';
  const response = await fetch(`${BASE_URL}/medicines${query}`);
  if (!response.ok) throw new Error('Failed to fetch medicines');
  return response.json();
};

export const addMedicine = async (medicineData) => {
  const response = await fetch(`${BASE_URL}/medicines`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(medicineData),
  });
  if (!response.ok) throw new Error('Failed to add medicine');
  return response.json();
};

export const recordSale = async (medicineId, quantity) => {
  const response = await fetch(`${BASE_URL}/sales`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ medicineId, quantitySold: Number(quantity) }),
  });
  if (!response.ok) throw new Error('Failed to record sale');
  return response.json();
};