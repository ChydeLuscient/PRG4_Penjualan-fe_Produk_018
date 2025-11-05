import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import HeaderComponent from './components/templates/HeaderComponent';
import FooterComponent from './components/templates/FooterComponent';
import ListProdukComponent from './components/produk/ListProdukComponent';
import AddProdukComponent from './components/produk/AddProdukComponent';
import EditProdukComponent from './components/produk/EditProdukComponent';

function App() {
  return (
    <Router>
      <div className="d-flex flex-column min-vh-100">
        <HeaderComponent />
        <div className="flex-grow-1">
          <Routes>
            <Route path="/" element={<ListProdukComponent />} />
            <Route path="/list-produk" element={<ListProdukComponent />} />
            <Route path="/tambah-produk" element={<AddProdukComponent />} />
            <Route path="/edit-produk/:id" element={<EditProdukComponent />} />
          </Routes>
        </div>
        <FooterComponent />
      </div>
    </Router>
  );
}

export default App;