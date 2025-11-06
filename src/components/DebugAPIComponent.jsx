import React, { useState } from 'react';
import axios from 'axios';

function DebugAPIComponent() {
  const [testId, setTestId] = useState('3');
  const [response, setResponse] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [availableIds, setAvailableIds] = useState([]);

  const BASE_URL = "https://api.roniprsty.com/produk/";

  const testGetAll = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await axios.get(BASE_URL + "read.php");
      
      if (res.data && Array.isArray(res.data)) {
        const ids = res.data.map(item => item.id);
        setAvailableIds(ids);
      }
      
      setResponse({
        method: 'GET ALL',
        status: res.status,
        totalProducts: res.data?.length || 0,
        availableIds: res.data?.map(p => ({ id: p.id, nama: p.nama_produk })),
        data: res.data
      });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const testGetById = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await axios.get(BASE_URL + `read.php?id=${testId}`);
      setResponse({
        method: 'GET BY ID',
        url: BASE_URL + `read.php?id=${testId}`,
        status: res.status,
        data: res.data
      });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Test UPDATE dengan method PUT
  const testUpdatePUT = async () => {
    setLoading(true);
    setError(null);
    try {
      const testData = {
        nama_produk: "Test PUT " + new Date().getTime(),
        jenis_produk: "Testing PUT",
        stok: 100,
        harga_beli: 50000,
        harga_jual: 75000,
        status: "Aktif"
      };
      
      const res = await axios.put(
        BASE_URL + `update.php?id=${testId}`, 
        testData,
        {
          headers: {
            'Content-Type': 'application/json'
          }
        }
      );
      
      setResponse({
        method: 'UPDATE (PUT)',
        url: BASE_URL + `update.php?id=${testId}`,
        sentData: testData,
        status: res.status,
        responseStatus: res.data?.status,
        message: res.data?.data?.message || res.data?.message,
        data: res.data
      });
    } catch (err) {
      setError(err.response?.data || err.message);
      setResponse({
        method: 'UPDATE (PUT) - ERROR',
        error: err.response?.data,
        status: err.response?.status,
        message: err.message
      });
    } finally {
      setLoading(false);
    }
  };

  // Test UPDATE dengan method POST (kadang API PHP butuh POST)
  const testUpdatePOST = async () => {
    setLoading(true);
    setError(null);
    try {
      const testData = {
        id: testId, // Include ID in body
        nama_produk: "Test POST " + new Date().getTime(),
        jenis_produk: "Testing POST",
        stok: 99,
        harga_beli: 45000,
        harga_jual: 70000,
        status: "Aktif"
      };
      
      const res = await axios.post(
        BASE_URL + `update.php?id=${testId}`, 
        testData,
        {
          headers: {
            'Content-Type': 'application/json'
          }
        }
      );
      
      setResponse({
        method: 'UPDATE (POST)',
        url: BASE_URL + `update.php?id=${testId}`,
        sentData: testData,
        status: res.status,
        responseStatus: res.data?.status,
        message: res.data?.data?.message || res.data?.message,
        data: res.data
      });
    } catch (err) {
      setError(err.response?.data || err.message);
      setResponse({
        method: 'UPDATE (POST) - ERROR',
        error: err.response?.data,
        status: err.response?.status,
        message: err.message
      });
    } finally {
      setLoading(false);
    }
  };

  // Test UPDATE dengan ID di body (bukan query param)
  const testUpdateBodyID = async () => {
    setLoading(true);
    setError(null);
    try {
      const testData = {
        id: testId, // ID in body instead of URL
        nama_produk: "Test Body ID " + new Date().getTime(),
        jenis_produk: "Testing Body",
        stok: 88,
        harga_beli: 40000,
        harga_jual: 65000,
        status: "Aktif"
      };
      
      const res = await axios.put(
        BASE_URL + `update.php`, // No ID in URL
        testData,
        {
          headers: {
            'Content-Type': 'application/json'
          }
        }
      );
      
      setResponse({
        method: 'UPDATE (Body ID)',
        url: BASE_URL + `update.php`,
        note: 'ID sent in request body, not URL',
        sentData: testData,
        status: res.status,
        responseStatus: res.data?.status,
        message: res.data?.data?.message || res.data?.message,
        data: res.data
      });
    } catch (err) {
      setError(err.response?.data || err.message);
      setResponse({
        method: 'UPDATE (Body ID) - ERROR',
        error: err.response?.data,
        status: err.response?.status,
        message: err.message
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mt-4">
      <div className="card shadow">
        <div className="card-header bg-warning">
          <h4 className="mb-0">🔧 API Debug Tool - Advanced</h4>
        </div>
        <div className="card-body">
          {availableIds.length > 0 && (
            <div className="alert alert-info">
              <strong>📋 Available IDs:</strong> {availableIds.join(', ')}
              <br />
              <small>Total: {availableIds.length} products</small>
            </div>
          )}

          <div className="mb-3">
            <label className="form-label fw-bold">Test ID:</label>
            <div className="input-group">
              <input 
                type="text" 
                className="form-control" 
                value={testId}
                onChange={(e) => setTestId(e.target.value)}
                placeholder="Enter ID"
              />
              {availableIds.length > 0 && (
                <select 
                  className="form-select"
                  onChange={(e) => setTestId(e.target.value)}
                  value={testId}
                >
                  <option value="">-- Pilih ID --</option>
                  {availableIds.map(id => (
                    <option key={id} value={id}>ID: {id}</option>
                  ))}
                </select>
              )}
            </div>
          </div>

          <div className="row mb-3">
            <div className="col-12 mb-2">
              <h6 className="text-muted">📖 Read Operations:</h6>
            </div>
            <div className="col-md-6 mb-2">
              <button 
                className="btn btn-primary w-100" 
                onClick={testGetAll}
                disabled={loading}
              >
                📋 Test GET All
              </button>
            </div>
            <div className="col-md-6 mb-2">
              <button 
                className="btn btn-info w-100" 
                onClick={testGetById}
                disabled={loading}
              >
                🔍 Test GET by ID
              </button>
            </div>
          </div>

          <div className="row mb-3">
            <div className="col-12 mb-2">
              <h6 className="text-muted">✏️ Update Operations (Try All):</h6>
            </div>
            <div className="col-md-4 mb-2">
              <button 
                className="btn btn-warning w-100" 
                onClick={testUpdatePUT}
                disabled={loading}
              >
                PUT (Query Param)
              </button>
            </div>
            <div className="col-md-4 mb-2">
              <button 
                className="btn btn-warning w-100" 
                onClick={testUpdatePOST}
                disabled={loading}
              >
                POST (Query Param)
              </button>
            </div>
            <div className="col-md-4 mb-2">
              <button 
                className="btn btn-warning w-100" 
                onClick={testUpdateBodyID}
                disabled={loading}
              >
                PUT (Body ID)
              </button>
            </div>
          </div>

          {loading && (
            <div className="alert alert-info">
              <div className="spinner-border spinner-border-sm me-2"></div>
              Loading...
            </div>
          )}

          {error && (
            <div className="alert alert-danger">
              <h6>❌ Error:</h6>
              <pre style={{maxHeight: '300px', overflow: 'auto', backgroundColor: '#f8d7da', padding: '10px', borderRadius: '5px'}}>
                {typeof error === 'string' ? error : JSON.stringify(error, null, 2)}
              </pre>
            </div>
          )}

          {response && (
            <div className={`alert ${response.method.includes('ERROR') ? 'alert-danger' : 'alert-success'}`}>
              <div className="d-flex justify-content-between align-items-start mb-2">
                <h6>📥 Response: <strong>{response.method}</strong></h6>
                <button 
                  className="btn btn-sm btn-outline-secondary"
                  onClick={() => setResponse(null)}
                >
                  Clear
                </button>
              </div>
              
              {response.message && (
                <div className={`alert ${response.message.includes('tidak') || response.message.includes('gagal') ? 'alert-danger' : 'alert-success'} mb-2`}>
                  <strong>💬 Message:</strong> {response.message}
                </div>
              )}
              
              {response.note && (
                <div className="alert alert-info mb-2">
                  <strong>ℹ️ Note:</strong> {response.note}
                </div>
              )}
              
              <pre style={{
                maxHeight: '500px', 
                overflow: 'auto',
                backgroundColor: response.method.includes('ERROR') ? '#f8d7da' : '#d1e7dd',
                fontSize: '11px',
                padding: '15px',
                borderRadius: '5px'
              }}>
                {JSON.stringify(response, null, 2)}
              </pre>
            </div>
          )}

          <div className="mt-4">
            <div className="card border-info">
              <div className="card-header bg-info text-white">
                <strong>💡 Troubleshooting Guide</strong>
              </div>
              <div className="card-body">
                <h6>Jika UPDATE gagal dengan "ID tidak ditemukan":</h6>
                <ol className="mb-3">
                  <li>Pastikan ID ada dengan klik <strong>"Test GET All"</strong></li>
                  <li>Coba semua metode UPDATE:
                    <ul>
                      <li><strong>PUT (Query Param)</strong> - Standard REST</li>
                      <li><strong>POST (Query Param)</strong> - Alternative method</li>
                      <li><strong>PUT (Body ID)</strong> - ID di dalam body</li>
                    </ul>
                  </li>
                  <li>Lihat response detail untuk error message</li>
                  <li>Jika salah satu berhasil, gunakan metode itu di ProdukService.js</li>
                </ol>

                <h6>Kemungkinan Masalah Backend:</h6>
                <ul className="mb-0">
                  <li>API tidak membaca parameter <code>?id=</code> dengan benar</li>
                  <li>API mengharapkan ID di dalam request body</li>
                  <li>API hanya support POST, bukan PUT</li>
                  <li>Ada bug di <code>update.php</code> backend</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default DebugAPIComponent;