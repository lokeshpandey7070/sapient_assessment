import { useState, useEffect } from 'react';
import SearchBar from './components/SearchBar';
import MedicineGrid from './components/MedicineGrid';
import AddMedicineModal from './components/AddMedicineModal';
import { getMedicines, addMedicine, recordSale } from './services/api';
import './App.css';

export default function App() {
  const [medicines, setMedicines] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);

  const loadMedicines = async () => {
    try {
      const data = await getMedicines();
      setMedicines(data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    loadMedicines();
  }, []);

  const handleAddMedicine = async (newMed) => {
    try {
      await addMedicine(newMed);
      await loadMedicines();
    } catch (err) {
      alert('Error adding medicine: ' + err.message);
    }
  };

  const handleSell = async (medicine) => {
    const qtyStr = prompt(`Enter quantity to sell for ${medicine.fullName}:`, '1');
    if (!qtyStr) return;
    const qty = parseInt(qtyStr, 10);
    if (isNaN(qty) || qty <= 0 || qty > medicine.quantity) {
      alert('Invalid quantity entered.');
      return;
    }

    try {
      await recordSale(medicine.id, qty);
      await loadMedicines();
    } catch (err) {
      alert('Error recording sale: ' + err.message);
    }
  };

  const filteredMedicines = medicines.filter((m) =>
    m.fullName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="app-container">
      <header className="header-row">
        <h2>ABC Pharmacy - Medicine Inventory</h2>
        <button onClick={() => setIsModalOpen(true)} className="btn-primary">
          + Add Medicine
        </button>
      </header>

      <SearchBar searchTerm={searchTerm} onSearchChange={setSearchTerm} />

      <MedicineGrid medicines={filteredMedicines} onSellClick={handleSell} />

      <AddMedicineModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onAddSuccess={handleAddMedicine}
      />
    </div>
  );
}