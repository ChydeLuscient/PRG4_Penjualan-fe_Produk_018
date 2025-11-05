import React, { useState, useEffect } from 'react';
import { getProdukById, updateProduk } from '../../services/ProdukService';
import { Link, useNavigate, useParams } from 'react-router-dom';

function EditProdukComponent() {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    nama_produk: '',
    jenis_produk: '',
    stok: '',
    harga_beli: '',
    harga_jual: '',
    status: 'Aktif'
  });
  
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const fetchProduk = async () => {
      try {
        setLoading(true);
        setError(null);
        
        if (!id) {
          throw new Error('ID produk tidak valid');
        }

        console.log('🔄 Fetching product with ID:', id);
        
        const response = await getProdukById(id);
        const produkData = response.data;
        
        console.log('✅ Product data received:', produkData);

        setFormData({
          nama_produk: produkData.nama_produk || '',
          jenis_produk: produkData.jenis_produk || '',
          stok: produkData.stok || '',
          harga_beli: produkData.harga_beli || '',
          harga_jual: produkData.harga_jual || '',
          status: produkData.status || 'Aktif'
        });
        
      } catch (error) {
        console.error("❌ Error fetching product:", error);
        setError(error.message || "Gagal mengambil data produk.");
      } finally {
        setLoading(false);
      }
    };

    fetchProduk();
  }, [id]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccessMessage(null);

    // Validation
    if (!formData.nama_produk.trim()) {
      setError('Nama produk harus diisi');
      return;
    }
    if (!formData.jenis_produk.trim()) {
      setError('Jenis produk harus diisi');
      return;
    }
    if (parseFloat(formData.harga_jual) <= parseFloat(formData.harga_beli)) {
      setError('Harga jual harus lebih besar dari harga beli');
      return;
    }

    setIsSubmitting(true);

    try {
      const updatedProduct = {
        nama_produk: formData.nama_produk.trim(),
        jenis_produk: formData.jenis_produk.trim(),
        stok: parseInt(formData.stok) || 0,
        harga_beli: parseFloat(formData.harga_beli) || 0,
        harga_jual: parseFloat(formData.harga_jual) || 0,
        status: formData.status,
      };
      
      console.log('🔄 Updating product ID:', id, 'with data:', updatedProduct);
      
      await updateProduk(id, updatedProduct);
      setSuccessMessage('✅ Produk berhasil diperbarui! Mengalihkan...');
      
      setTimeout(() => {
        navigate('/list-produk');
      }, 1500);
      
    } catch (error) {
      console.error("❌ Error updating product:", error);
      setError(error.message || "Gagal memperbarui produk. Silakan coba lagi.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="container mt-5 text-center">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
        <h4 className="text-muted mt-3">Memuat data produk...</h4>
        <p>ID: {id}</p>
      </div>
    );
  }

  if (error && !loading) {
    return (
      <div className="container mt-4">
        <div className="alert alert-danger">
          <h5>❌ Error</h5>
          <p>{error}</p>
          <div className="mt-3">
            <Link to="/list-produk" className="btn btn-secondary me-2">
              ← Kembali ke List Produk
            </Link>
            <button 
              className="btn btn-primary"
              onClick={() => window.location.reload()}
            >
              🔄 Refresh Halaman
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mt-4">
      <div className="row justify-content-center">
        <div className="col-md-8">
          <div className="card shadow-sm">
            <div className="card-header bg-warning text-dark">
              <div className="d-flex justify-content-between align-items-center">
                <h4 className="mb-0">✏️ Edit Produk</h4>
                <div>
                  <small className="me-3">ID: {id}</small>
                  <Link to="/list-produk" className="btn btn-dark btn-sm">
                    ← Kembali
                  </Link>
                </div>
              </div>
            </div>
            
            <div className="card-body">
              {error && (
                <div className="alert alert-danger">
                  {error}
                </div>
              )}
              
              {successMessage && (
                <div className="alert alert-success">
                  {successMessage}
                </div>
              )}
              
              <form onSubmit={handleSubmit}>
                <div className="row">
                  <div className="col-md-6">
                    <div className="mb-3">
                      <label htmlFor="nama_produk" className="form-label fw-semibold">
                        Nama Produk *
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        id="nama_produk"
                        name="nama_produk"
                        value={formData.nama_produk}
                        onChange={handleInputChange}
                        disabled={isSubmitting}
                        required
                      />
                    </div>
                  </div>
                  
                  <div className="col-md-6">
                    <div className="mb-3">
                      <label htmlFor="jenis_produk" className="form-label fw-semibold">
                        Jenis Produk *
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        id="jenis_produk"
                        name="jenis_produk"
                        value={formData.jenis_produk}
                        onChange={handleInputChange}
                        disabled={isSubmitting}
                        required
                      />
                    </div>
                  </div>
                </div>

                <div className="row">
                  <div className="col-md-4">
                    <div className="mb-3">
                      <label htmlFor="stok" className="form-label fw-semibold">
                        Stok *
                      </label>
                      <input
                        type="number"
                        className="form-control"
                        id="stok"
                        name="stok"
                        value={formData.stok}
                        onChange={handleInputChange}
                        min="0"
                        disabled={isSubmitting}
                        required
                      />
                    </div>
                  </div>
                  
                  <div className="col-md-4">
                    <div className="mb-3">
                      <label htmlFor="harga_beli" className="form-label fw-semibold">
                        Harga Beli (IDR) *
                      </label>
                      <input
                        type="number"
                        className="form-control"
                        id="harga_beli"
                        name="harga_beli"
                        value={formData.harga_beli}
                        onChange={handleInputChange}
                        min="0"
                        step="1000"
                        disabled={isSubmitting}
                        required
                      />
                    </div>
                  </div>
                  
                  <div className="col-md-4">
                    <div className="mb-3">
                      <label htmlFor="harga_jual" className="form-label fw-semibold">
                        Harga Jual (IDR) *
                      </label>
                      <input
                        type="number"
                        className="form-control"
                        id="harga_jual"
                        name="harga_jual"
                        value={formData.harga_jual}
                        onChange={handleInputChange}
                        min="0"
                        step="1000"
                        disabled={isSubmitting}
                        required
                      />
                    </div>
                  </div>
                </div>

                <div className="mb-4">
                  <label htmlFor="status" className="form-label fw-semibold">Status</label>
                  <select
                    className="form-control"
                    id="status"
                    name="status"
                    value={formData.status}
                    onChange={handleInputChange}
                    disabled={isSubmitting}
                  >
                    <option value="Aktif">🟢 Aktif</option>
                    <option value="Tidak Aktif">🔴 Tidak Aktif</option>
                  </select>
                </div>

                <div className="d-grid gap-2 d-md-flex justify-content-md-end">
                  <Link to="/list-produk" className="btn btn-secondary me-md-2">
                    Batal
                  </Link>
                  <button 
                    type="submit" 
                    className="btn btn-warning text-dark"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <>
                        <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                        Memperbarui...
                      </>
                    ) : (
                      '💾 Update Produk'
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default EditProdukComponent;