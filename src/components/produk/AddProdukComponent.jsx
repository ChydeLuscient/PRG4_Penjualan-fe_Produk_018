import React, { useState } from 'react';
import { addProduk } from '../../services/ProdukService';
import { Link, useNavigate } from 'react-router-dom';

function AddProdukComponent() {
  const [namaProduk, setNamaProduk] = useState('');
  const [jenisProduk, setJenisProduk] = useState('');
  const [stok, setStok] = useState('');
  const [hargaBeli, setHargaBeli] = useState('');
  const [hargaJual, setHargaJual] = useState('');
  const [status, setStatus] = useState('Aktif');
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);
  const [validationErrors, setValidationErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const navigate = useNavigate();

  const validateForm = () => {
    const errors = {};

    // Nama Produk validation
    if (!namaProduk.trim()) {
      errors.namaProduk = 'Nama produk harus diisi';
    } else if (namaProduk.length < 2) {
      errors.namaProduk = 'Nama produk minimal 2 karakter';
    } else if (namaProduk.length > 100) {
      errors.namaProduk = 'Nama produk maksimal 100 karakter';
    }

    // Jenis Produk validation
    if (!jenisProduk.trim()) {
      errors.jenisProduk = 'Jenis produk harus diisi';
    } else if (jenisProduk.length < 2) {
      errors.jenisProduk = 'Jenis produk minimal 2 karakter';
    } else if (jenisProduk.length > 50) {
      errors.jenisProduk = 'Jenis produk maksimal 50 karakter';
    }

    // Stok validation
    if (!stok) {
      errors.stok = 'Stok harus diisi';
    } else if (parseInt(stok) < 0) {
      errors.stok = 'Stok tidak boleh negatif';
    } else if (parseInt(stok) > 999999) {
      errors.stok = 'Stok terlalu besar (maksimal 999.999)';
    }

    // Harga Beli validation
    if (!hargaBeli) {
      errors.hargaBeli = 'Harga beli harus diisi';
    } else if (parseFloat(hargaBeli) <= 0) {
      errors.hargaBeli = 'Harga beli harus lebih besar dari 0';
    } else if (parseFloat(hargaBeli) > 999999999999) {
      errors.hargaBeli = 'Harga beli terlalu besar';
    }

    // Harga Jual validation
    if (!hargaJual) {
      errors.hargaJual = 'Harga jual harus diisi';
    } else if (parseFloat(hargaJual) <= 0) {
      errors.hargaJual = 'Harga jual harus lebih besar dari 0';
    } else if (parseFloat(hargaJual) > 999999999999) {
      errors.hargaJual = 'Harga jual terlalu besar';
    } else if (parseFloat(hargaJual) <= parseFloat(hargaBeli)) {
      errors.hargaJual = 'Harga jual harus lebih besar dari harga beli';
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccessMessage(null);
    setValidationErrors({});

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      const newProduct = {
        nama_produk: namaProduk.trim(),
        jenis_produk: jenisProduk.trim(),
        stok: parseInt(stok),
        harga_beli: parseFloat(hargaBeli),
        harga_jual: parseFloat(hargaJual),
        status: status,
      };
      
      await addProduk(newProduct);
      setSuccessMessage('✅ Produk berhasil ditambahkan!');
      
      // Reset form
      setTimeout(() => {
        setNamaProduk('');
        setJenisProduk('');
        setStok('');
        setHargaBeli('');
        setHargaJual('');
        setStatus('Aktif');
        setSuccessMessage(null);
        navigate('/list-produk');
      }, 2000);
      
    } catch (error) {
      console.error("Error adding product:", error);
      setError("❌ Gagal menambahkan produk. Silakan coba lagi.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container mt-4">
      <div className="row justify-content-center">
        <div className="col-md-8">
          <div className="card shadow-sm">
            <div className="card-header bg-primary text-white">
              <div className="d-flex justify-content-between align-items-center">
                <h4 className="mb-0">➕ Tambah Produk Baru</h4>
                <Link to="/list-produk" className="btn btn-light btn-sm">
                  ← Kembali
                </Link>
              </div>
            </div>
            
            <div className="card-body">
              {error && (
                <div className="alert alert-danger d-flex align-items-center">
                  <div>{error}</div>
                </div>
              )}
              
              {successMessage && (
                <div className="alert alert-success d-flex align-items-center">
                  <div>{successMessage}</div>
                </div>
              )}
              
              <form onSubmit={handleSubmit}>
                <div className="row">
                  <div className="col-md-6">
                    <div className="mb-3">
                      <label htmlFor="namaProduk" className="form-label fw-semibold">
                        Nama Produk <span className="text-danger">*</span>
                      </label>
                      <input
                        type="text"
                        className={`form-control ${validationErrors.namaProduk ? 'is-invalid' : ''}`}
                        id="namaProduk"
                        value={namaProduk}
                        onChange={(e) => setNamaProduk(e.target.value)}
                        placeholder="Contoh: Laptop Gaming"
                        disabled={isSubmitting}
                      />
                      {validationErrors.namaProduk && (
                        <div className="invalid-feedback">{validationErrors.namaProduk}</div>
                      )}
                    </div>
                  </div>
                  
                  <div className="col-md-6">
                    <div className="mb-3">
                      <label htmlFor="jenisProduk" className="form-label fw-semibold">
                        Jenis Produk <span className="text-danger">*</span>
                      </label>
                      <input
                        type="text"
                        className={`form-control ${validationErrors.jenisProduk ? 'is-invalid' : ''}`}
                        id="jenisProduk"
                        value={jenisProduk}
                        onChange={(e) => setJenisProduk(e.target.value)}
                        placeholder="Contoh: Elektronik"
                        disabled={isSubmitting}
                      />
                      {validationErrors.jenisProduk && (
                        <div className="invalid-feedback">{validationErrors.jenisProduk}</div>
                      )}
                    </div>
                  </div>
                </div>

                <div className="row">
                  <div className="col-md-4">
                    <div className="mb-3">
                      <label htmlFor="stok" className="form-label fw-semibold">
                        Stok <span className="text-danger">*</span>
                      </label>
                      <input
                        type="number"
                        className={`form-control ${validationErrors.stok ? 'is-invalid' : ''}`}
                        id="stok"
                        value={stok}
                        onChange={(e) => setStok(e.target.value)}
                        min="0"
                        max="999999"
                        placeholder="0"
                        disabled={isSubmitting}
                      />
                      {validationErrors.stok && (
                        <div className="invalid-feedback">{validationErrors.stok}</div>
                      )}
                    </div>
                  </div>
                  
                  <div className="col-md-4">
                    <div className="mb-3">
                      <label htmlFor="hargaBeli" className="form-label fw-semibold">
                        Harga Beli (IDR) <span className="text-danger">*</span>
                      </label>
                      <input
                        type="number"
                        className={`form-control ${validationErrors.hargaBeli ? 'is-invalid' : ''}`}
                        id="hargaBeli"
                        value={hargaBeli}
                        onChange={(e) => setHargaBeli(e.target.value)}
                        min="0"
                        step="1"
                        placeholder="0"
                        disabled={isSubmitting}
                      />
                      {validationErrors.hargaBeli && (
                        <div className="invalid-feedback">{validationErrors.hargaBeli}</div>
                      )}
                    </div>
                  </div>
                  
                  <div className="col-md-4">
                    <div className="mb-3">
                      <label htmlFor="hargaJual" className="form-label fw-semibold">
                        Harga Jual (IDR) <span className="text-danger">*</span>
                      </label>
                      <input
                        type="number"
                        className={`form-control ${validationErrors.hargaJual ? 'is-invalid' : ''}`}
                        id="hargaJual"
                        value={hargaJual}
                        onChange={(e) => setHargaJual(e.target.value)}
                        min="0"
                        step="1"
                        placeholder="0"
                        disabled={isSubmitting}
                      />
                      {validationErrors.hargaJual && (
                        <div className="invalid-feedback">{validationErrors.hargaJual}</div>
                      )}
                    </div>
                  </div>
                </div>

                <div className="mb-4">
                  <label htmlFor="status" className="form-label fw-semibold">Status</label>
                  <select
                    className="form-control"
                    id="status"
                    value={status}
                    onChange={(e) => setStatus(e.target.value)}
                    disabled={isSubmitting}
                  >
                    <option value="Aktif">🟢 Aktif</option>
                    <option value="Tidak Aktif">🔴 Tidak Aktif</option>
                  </select>
                </div>

                <div className="d-grid gap-2 d-md-flex justify-content-md-end">
                  <Link to="/list-produk" className="btn btn-secondary me-md-2" disabled={isSubmitting}>
                    Batal
                  </Link>
                  <button 
                    type="submit" 
                    className="btn btn-primary"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <>
                        <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                        Menyimpan...
                      </>
                    ) : (
                      '💾 Simpan Produk'
                    )}
                  </button>
                </div>
                
                <div className="mt-3">
                  <small className="text-muted">
                    <span className="text-danger">*</span> Menandakan field wajib diisi
                  </small>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AddProdukComponent;