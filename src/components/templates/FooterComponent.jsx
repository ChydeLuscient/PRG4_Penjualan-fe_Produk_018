import React from 'react';
import { Link } from 'react-router-dom';

function FooterComponent() {
  return (
    <footer className="bg-dark text-light py-4 mt-5">
      <div className="container">
        <div className="row">
          <div className="col-md-6 text-center text-md-start">
            <h6 className="text-uppercase fw-bold mb-3">🛍️ Toko Informatika</h6>
            <p className="mb-0">
              © {new Date().getFullYear()} Toko Informatika. All rights reserved.
            </p>
          </div>
          <div className="col-md-6 text-center text-md-end">
            <div className="d-flex justify-content-center justify-content-md-end">
              <Link to="/" className="text-light text-decoration-none me-3">Home</Link>
              <Link to="/list-produk" className="text-light text-decoration-none me-3">Produk</Link>
              <Link to="/tambah-produk" className="text-light text-decoration-none">Tambah Produk</Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default FooterComponent;