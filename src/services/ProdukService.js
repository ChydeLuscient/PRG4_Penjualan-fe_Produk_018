import axios from "axios"

const REST_API_BASE_URL = "https://api.roniprsty.com/produk/";

export const listProduk = async () => {
  try {
    const response = await axios.get(REST_API_BASE_URL + "read.php");
    console.log('✅ Get all products success');
    return response;
  } catch (error) {
    console.error('❌ Error fetching products:', error);
    throw new Error(`Gagal mengambil data: ${error.message}`);
  }
};

// Karena API get by ID tidak bekerja, kita filter di frontend
export const getProdukById = async (id) => {
  try {
    console.log('🔍 Getting product by ID (via frontend filter):', id);
    
    // Ambil semua data
    const response = await listProduk();
    let allData = response.data;
    
    // Cari produk berdasarkan ID
    const produk = allData.find(item => item.id == id);
    
    if (!produk) {
      throw new Error(`Produk dengan ID ${id} tidak ditemukan`);
    }
    
    console.log('✅ Found product:', produk);
    return { data: produk };
    
  } catch (error) {
    console.error('❌ Error finding product by ID:', error);
    throw error;
  }
};

export const addProduk = async (newProduct) => {
  try {
    const response = await axios.post(REST_API_BASE_URL + "create.php", newProduct, {
      headers: {
        'Content-Type': 'application/json'
      }
    });
    return response;
  } catch (error) {
    console.error('Error adding product:', error);
    throw new Error(`Gagal menambah produk: ${error.message}`);
  }
};

export const updateProduk = async (id, updatedProduct) => {
  try {
    const response = await axios.put(REST_API_BASE_URL + `update.php?id=${id}`, updatedProduct, {
      headers: {
        'Content-Type': 'application/json'
      }
    });
    return response;
  } catch (error) {
    console.error('Error updating product:', error);
    throw new Error(`Gagal update produk: ${error.message}`);
  }
};

export const deleteProduk = async (id) => {
  try {
    const response = await axios.delete(REST_API_BASE_URL + `delete.php?id=${id}`);
    return response;
  } catch (error) {
    console.error('Error deleting product:', error);
    throw new Error(`Gagal hapus produk: ${error.message}`);
  }
};