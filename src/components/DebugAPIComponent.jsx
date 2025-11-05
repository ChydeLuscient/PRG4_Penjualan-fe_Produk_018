import React, { useState, useEffect } from 'react';
import axios from 'axios';

function DebugAPIComponent() {
  const [apiResults, setApiResults] = useState({});
  const [loading, setLoading] = useState(false);

  const REST_API_BASE_URL = "https://api.roniprsty.com/produk/";

  const testAllEndpoints = async () => {
    setLoading(true);
    const results = {};

    try {
      // Test 1: Get all products
      console.log('🧪 Testing: Get all products');
      const allResponse = await axios.get(REST_API_BASE_URL + "read.php");
      results.getAll = {
        url: REST_API_BASE_URL + "read.php",
        status: 'success',
        data: allResponse.data,
        fullResponse: allResponse
      };
      console.log('✅ Get all products:', allResponse.data);
    } catch (error) {
      results.getAll = {
        url: REST_API_BASE_URL + "read.php",
        status: 'error',
        error: error.message,
        fullError: error
      };
      console.error('❌ Get all products failed:', error);
    }

    // Test 2: Get product by ID (test dengan beberapa ID)
    const testIds = ['1', '2', '38', '999'];
    for (const id of testIds) {
      try {
        console.log(`🧪 Testing: Get product by ID ${id}`);
        const byIdResponse = await axios.get(REST_API_BASE_URL + `read.php?id=${id}`);
        results[`getById_${id}`] = {
          url: REST_API_BASE_URL + `read.php?id=${id}`,
          status: 'success',
          data: byIdResponse.data,
          fullResponse: byIdResponse
        };
        console.log(`✅ Get by ID ${id}:`, byIdResponse.data);
      } catch (error) {
        results[`getById_${id}`] = {
          url: REST_API_BASE_URL + `read.php?id=${id}`,
          status: 'error',
          error: error.message,
          fullError: error
        };
        console.error(`❌ Get by ID ${id} failed:`, error);
      }
    }

    // Test 3: Test create endpoint (GET method dulu untuk lihat response)
    try {
      console.log('🧪 Testing: Create endpoint (GET method)');
      const createResponse = await axios.get(REST_API_BASE_URL + "create.php");
      results.createGet = {
        url: REST_API_BASE_URL + "create.php",
        status: 'success',
        data: createResponse.data,
        fullResponse: createResponse
      };
      console.log('✅ Create endpoint (GET):', createResponse.data);
    } catch (error) {
      results.createGet = {
        url: REST_API_BASE_URL + "create.php",
        status: 'error',
        error: error.message,
        fullError: error
      };
      console.error('❌ Create endpoint (GET) failed:', error);
    }

    setApiResults(results);
    setLoading(false);
  };

  useEffect(() => {
    testAllEndpoints();
  }, []);

  return (
    <div className="container mt-4">
      <h2>🔧 Debug API Endpoints</h2>
      <p className="text-muted">Testing semua endpoint API untuk mengetahui masalah</p>
      
      <button 
        className="btn btn-primary mb-3"
        onClick={testAllEndpoints}
        disabled={loading}
      >
        {loading ? 'Testing...' : '🔁 Test Semua Endpoint'}
      </button>

      {loading && (
        <div className="alert alert-info">
          <div className="spinner-border spinner-border-sm me-2"></div>
          Testing semua endpoint API...
        </div>
      )}

      <div className="row">
        {Object.entries(apiResults).map(([key, result]) => (
          <div key={key} className="col-md-6 mb-3">
            <div className={`card ${result.status === 'success' ? 'border-success' : 'border-danger'}`}>
              <div className={`card-header ${result.status === 'success' ? 'bg-success text-white' : 'bg-danger text-white'}`}>
                <strong>{key}</strong>
              </div>
              <div className="card-body">
                <p><strong>URL:</strong> <code>{result.url}</code></p>
                <p><strong>Status:</strong> 
                  <span className={`badge ${result.status === 'success' ? 'bg-success' : 'bg-danger'}`}>
                    {result.status}
                  </span>
                </p>
                
                {result.status === 'success' ? (
                  <div>
                    <p><strong>Response Data:</strong></p>
                    <pre className="bg-light p-2 small">
                      {JSON.stringify(result.data, null, 2)}
                    </pre>
                    <p><strong>Headers:</strong></p>
                    <pre className="bg-light p-2 small">
                      {JSON.stringify(result.fullResponse.headers, null, 2)}
                    </pre>
                  </div>
                ) : (
                  <div>
                    <p><strong>Error:</strong> {result.error}</p>
                    <p><strong>Full Error:</strong></p>
                    <pre className="bg-light p-2 small">
                      {JSON.stringify(result.fullError, null, 2)}
                    </pre>
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default DebugAPIComponent;