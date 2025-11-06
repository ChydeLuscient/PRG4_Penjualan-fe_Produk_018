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

// Filter di frontend karena API get by ID tidak tersedia
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
    console.log('✅ Product added successfully');
    return response;
  } catch (error) {
    console.error('❌ Error adding product:', error);
    throw new Error(`Gagal menambah produk: ${error.message}`);
  }
};

// FIXED: Menggunakan PUT dengan ID di body (bukan query param)
export const updateProduk = async (id, updatedProduct) => {
  try {
    console.log('🔄 Updating product ID:', id);
    console.log('📦 Data to send:', updatedProduct);
    
    // Include ID in the request body
    const dataWithId = {
      id: id,
      ...updatedProduct
    };
    
    // Use PUT without query parameter - ID is in body
    const response = await axios.put(
      REST_API_BASE_URL + "update.php",  // No ?id= here
      dataWithId,
      {
        headers: {
          'Content-Type': 'application/json'
        }
      }
    );
    
    console.log('📥 Response:', response.data);
    
    // Check for success message
    if (response.data?.data?.message) {
      const message = response.data.data.message;
      
      // If message indicates failure
      if (message.toLowerCase().includes('tidak') || 
          message.toLowerCase().includes('gagal') ||
          message.toLowerCase().includes('error')) {
        throw new Error(message);
      }
      
      console.log('✅ Product updated successfully:', message);
    }
    
    return response;
    
  } catch (error) {
    console.error('❌ Error updating product:', error);
    
    // Handle different error types
    if (error.response?.data?.data?.message) {
      throw new Error(error.response.data.data.message);
    } else if (error.response?.data?.message) {
      throw new Error(error.response.data.message);
    } else if (error.message) {
      throw error;
    } else {
      throw new Error('Gagal update produk: Network error');
    }
  }
};

export const deleteProduk = async (id) => {
  try {
    const response = await axios.delete(REST_API_BASE_URL + `delete.php?id=${id}`);
    console.log('✅ Product deleted successfully');
    return response;
  } catch (error) {
    console.error('❌ Error deleting product:', error);
    throw new Error(`Gagal hapus produk: ${error.message}`);
  }
};