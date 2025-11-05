import React, { useEffect, useState } from 'react';
import { listProduk, deleteProduk } from '../../services/ProdukService';
import { Link } from 'react-router-dom';

function ListProdukComponent() {
  const [produkData, setProdukData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchProduk();
  }, []);

  const fetchProduk = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await listProduk();
      console.log('✅ Products loaded:', response.data);
      
      setProdukData(response.data);
      
    } catch (error) {
      console.error('❌ Error fetching products:', error);
      setError(`Gagal mengambil data: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id, namaProduk) => {
    if (window.confirm(`Apakah Anda yakin ingin menghapus produk "${namaProduk}"?`)) {
      try {
        await deleteProduk(id);
        fetchProduk();
      } catch (error) {
        console.error("Error deleting product:", error);
        alert('Gagal menghapus produk. Silakan coba lagi.');
      }
    }
  };

  const formatCurrency = (amount) => {
    if (!amount || isNaN(amount)) return 'Rp 0';
    
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(parseFloat(amount));
  };

  if (loading) {
    return (
      <div className="container mt-5 text-center">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
        <h4 className="text-muted mt-3">Memuat data produk...</h4>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mt-4">
        <div className="alert alert-danger">
          <h5>❌ Error</h5>
          <p>{error}</p>
          <button className="btn btn-outline-danger" onClick={fetchProduk}>
            🔄 Coba Lagi
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mt-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h2 className="mb-1">📦 Daftar Produk</h2>
          <p className="text-muted">Kelola produk toko Anda dengan mudah</p>
        </div>
        <Link to="/tambah-produk" className="btn btn-primary">
          ➕ Tambah Produk
        </Link>
      </div>

      <div className="card shadow-sm">
        <div className="card-body p-0">
          <div className="table-responsive">
            <table className="table table-hover mb-0">
              <thead className="table-dark">
                <tr>
                  <th className="text-center">ID</th>
                  <th>Nama Produk</th>
                  <th>Jenis Produk</th>
                  <th className="text-end">Stok</th>
                  <th className="text-end">Harga Beli</th>
                  <th className="text-end">Harga Jual</th>
                  <th className="text-center">Status</th>
                  <th className="text-center">Aksi</th>
                </tr>
              </thead>
              <tbody>
                {produkData && produkData.length > 0 ? (
                  produkData.map((item) => (
                    <tr key={item.id}>
                      <td className="text-center fw-bold">{item.id}</td>
                      <td className="fw-semibold">{item.nama_produk || '-'}</td>
                      <td>
                        <span className="badge bg-info text-dark">
                          {item.jenis_produk || '-'}
                        </span>
                      </td>
                      <td className="text-end">
                        <span className={`badge ${(parseInt(item.stok) || 0) > 10 ? 'bg-success' : 'bg-warning'}`}>
                          {parseInt(item.stok) || 0}
                        </span>
                      </td>
                      <td className="text-end text-danger fw-semibold">
                        {formatCurrency(item.harga_beli)}
                      </td>
                      <td className="text-end text-success fw-semibold">
                        {formatCurrency(item.harga_jual)}
                      </td>
                      <td className="text-center">
                        <span className={`badge ${(item.status === 'Aktif' || item.status === 'Tersedia') ? 'bg-success' : 'bg-danger'}`}>
                          {(item.status === 'Aktif' || item.status === 'Tersedia') ? '🟢 Aktif' : '🔴 Tidak Aktif'}
                        </span>
                      </td>
                      <td className="text-center">
                        <div className="btn-group" role="group">
                          <Link 
                            to={`/edit-produk/${item.id}`} 
                            className="btn btn-sm btn-outline-warning"
                            title="Edit Produk"
                          >
                            ✏️ Edit
                          </Link>
                          <button 
                            className="btn btn-sm btn-outline-danger"
                            onClick={() => handleDelete(item.id, item.nama_produk)}
                            title="Hapus Produk"
                          >
                            🗑️ Hapus
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="8" className="text-center py-5">
                      <div className="text-muted">
                        <div style={{ fontSize: '3rem' }}>📦</div>
                        <h5 className="mt-2">Tidak ada produk ditemukan</h5>
                        <p className="mb-3">Mulai dengan menambahkan produk pertama Anda</p>
                        <Link to="/tambah-produk" className="btn btn-primary">
                          ➕ Tambah Produk Pertama
                        </Link>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
      
      {produkData && produkData.length > 0 && (
        <div className="mt-3 text-muted text-center">
          <small>Menampilkan {produkData.length} produk</small>
        </div>
      )}
    </div>
  );
}

export default ListProdukComponent;