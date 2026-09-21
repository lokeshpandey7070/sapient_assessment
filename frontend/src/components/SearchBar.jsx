export default function SearchBar({ searchTerm, onSearchChange }) {
  return (
    <div style={{ marginBottom: '16px' }}>
      <input
        type="text"
        placeholder="Search medicine by name..."
        value={searchTerm}
        onChange={(e) => onSearchChange(e.target.value)}
        style={{ padding: '8px 12px', width: '320px', borderRadius: '4px', border: '1px solid #ccc' }}
      />
    </div>
  );
}