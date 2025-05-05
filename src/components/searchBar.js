// components/SearchBar.jsx
const SearchBar = ({ searchTerm, onSearch }) => {
  return (
    <div className="mb-6">
      <input
        type="text"
        placeholder="Cari surat berdasarkan jenis, tanggal, perihal, pengirim, atau penerima..."
        value={searchTerm}
        onChange={(e) => onSearch(e.target.value)}
        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:border-blue-300"
      />
    </div>
  );
};

export default SearchBar;
