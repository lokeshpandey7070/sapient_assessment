import { useState } from 'react';

export default function AddMedicineModal({ isOpen, onClose, onAddSuccess }) {
  const [formData, setFormData] = useState({
    fullName: '',
    brand: '',
    price: '',
    quantity: '',
    expiryDate: '',
    notes: '',
  });

  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onAddSuccess({
      ...formData,
      price: parseFloat(formData.price),
      quantity: parseInt(formData.quantity, 10),
    });
    onClose();
  };

  return (
    <div className="modal-backdrop">
      <div className="modal-box">
        <h3>Add New Medicine</h3>
        <form onSubmit={handleSubmit}>
          <div>
            <label>Full Name:</label>
            <input name="fullName" required value={formData.fullName} onChange={handleChange} />
          </div>
          <div>
            <label>Brand:</label>
            <input name="brand" required value={formData.brand} onChange={handleChange} />
          </div>
          <div>
            <label>Price (2 decimals):</label>
            <input
              type="number"
              step="0.01"
              name="price"
              required
              value={formData.price}
              onChange={handleChange}
            />
          </div>
          <div>
            <label>Quantity:</label>
            <input
              type="number"
              name="quantity"
              required
              value={formData.quantity}
              onChange={handleChange}
            />
          </div>
          <div>
            <label>Expiry Date:</label>
            <input
              type="date"
              name="expiryDate"
              required
              value={formData.expiryDate}
              onChange={handleChange}
            />
          </div>
          <div>
            <label>Notes:</label>
            <textarea name="notes" value={formData.notes} onChange={handleChange} />
          </div>
          <div className="modal-actions">
            <button type="submit">Save</button>
            <button type="button" onClick={onClose}>Cancel</button>
          </div>
        </form>
      </div>
    </div>
  );
}