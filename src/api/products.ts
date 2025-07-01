import axios from 'axios';
const base = `https://api-frontend-production.up.railway.app/api`;

export const getProduct = async (id: string) => {
    try {
        const response = await axios.get(`${base}/products/${id}`);
        console.log('API Response:', response.data);
        
        const productArray = response.data;
        if (Array.isArray(productArray) && productArray.length > 0) {
            return productArray[0];
        }
        
        console.error('API returned empty array or invalid format');
        return null;
    } catch (err) {
        console.error('Error al obtener el producto: ', err);
        return null;
    }
};

export const getRelatedProducts = async () => {
    try {
        const response = await axios.get(`${base}/products?ft=tenis`);
        
        let data = response.data;
        console.log('Related products:', data);

        if (Array.isArray(data) && data.length > 4) {
            data = data.slice(3, 6);
        }

        return Array.isArray(data) ? data : [];
    } catch (err) {
        console.error('Error al obtener productos relacionados: ', err);
        return [];
    }
};