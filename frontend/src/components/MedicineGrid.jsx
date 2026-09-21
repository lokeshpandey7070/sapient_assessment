export default function MedicineGrid({ medicines, onSellClick }) {
  const isExpiringWithin30Days = (expiryDateStr) => {
    if (!expiryDateStr) return false;
    const now = new Date();
    const expiry = new Date(expiryDateStr);
    const diffDays = (expiry - now) / (1000 * 60 * 60 * 24);
    return diffDays >= 0 && diffDays < 30;
  };

  const getRowClass = (medicine) => {
    if (isExpiringWithin30Days(medicine.expiryDate)) {
      return 'row-expiry-warning'; // Red background
    }
    if (medicine.quantity < 10) {
      return 'row-stock-warning';  // Yellow background
    }
    return '';
  };

  return (
    <table className="medicine-table">
      <thead>
        <tr>
          <th>Full Name</th>
          <th>Brand</th>
          <th>Price</th>
          <th>Quantity</th>
          <th>Expiry Date</th>
          <th>Action</th>
        </tr>
      </thead>
      <tbody>
        {medicines.length === 0 ? (
          <tr>
            <td colSpan="6" style={{ textAlign: 'center' }}>No medicines found.</td>
          </tr>
        ) : (
          medicines.map((med) => (
            <tr key={med.id} className={getRowClass(med)}>
              <td>{med.fullName}</td>
              <td>{med.brand}</td>
              <td>${Number(med.price).toFixed(2)}</td>
              <td>{med.quantity}</td>
              <td>{new Date(med.expiryDate).toLocaleDateString()}</td>
              <td>
                <button
                  onClick={() => onSellClick(med)}
                  disabled={med.quantity <= 0}
                  className="btn-sell"
                >
                  Sell
                </button>
              </td>
            </tr>
          ))
        )}
      </tbody>
    </table>
  );
}