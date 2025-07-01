import { useEffect, useState } from "react";
import { useCart } from '../../context/CartContext';
import { getProduct, getRelatedProducts } from "../../api/products";
import './Product.css';

interface Product {
    productId: string;
    productName: string;
    brand: string;
    productReferenceCode: string;
    description?: string;
    categories: string[];
    items: {
        itemId: string;
        images: {
            imageUrl: string;
            imageText: string;
        }[];
        Talla: string[];
        Color: string[];
        sellers: {
            commertialOffer: {
                Price: number;
                ListPrice: number;
                IsAvailable: boolean;
            };
        }[];
    }[];
}

interface CartItem {
    id: string;
    title: string;
    price: number;
    size: string;
    color: string;
    image: string;
}

const ProductDetail = () => {
    const { addToCart } = useCart();
    const [product, setProduct] = useState<Product | null>(null);
    const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
    const [selectedSize, setSelectedSize] = useState<string>('');
    const [selectedColor, setSelectedColor] = useState<string>('');
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const load = async () => {
            try {
                setLoading(true);
                setError(null);

                // const productData = await getProduct('125829258'); // PARA PROBAR ERRORES
                const productData = await getProduct('125829257');
                console.log('Product data received:', productData);
                
                if (!productData) {
                    setError('No se pudo cargar el producto');
                    return;
                }
                
                setProduct(productData);

                const related = await getRelatedProducts();
                console.log('Related products received:', related);
                setRelatedProducts(related || []);

            } catch (err) {
                console.error('Error loading product:', err);
                setError('Error al cargar el producto');
            } finally {
                setLoading(false);
            }
        };

        load();
    }, []);

    if (loading) {
        return (
            <div className='product-loading'>
                <div className='product-loading-side'></div>
                <div className='product-loading-image'></div>
                <div className='product-loading-content'>
                    <div className="product-loading-content-title"></div>
                    <div className="product-loading-content-price"></div>
                    <div className="product-loading-content-selector"></div>
                    <div className="product-loading-content-selector"></div>
                    <div className="product-loading-content-cart"></div>
                    <div className="product-loading-content-about"></div>
                </div>
            </div>
        );
    }

    if (error) {
        return <div className="product-error">Error: {error}</div>;
    }

    if (!product) {
        return <div className="product-error">Producto no encontrado</div>;
    }

    const availableSizes = Array.from(new Set(
        product.items
            ?.filter(item => item.Talla && Array.isArray(item.Talla))
            .flatMap(item => item.Talla) || []
    )).sort();
    
    const availableColors = Array.from(new Set(
        product.items
            ?.filter(item => item.Color && Array.isArray(item.Color))
            .flatMap(item => item.Color) || []
    ));

    // Get available items for selected size and color combination
    // const getAvailableItems = () => {
    //     return product.items?.filter(item =>
    //         (!selectedSize || item.Talla?.includes(selectedSize)) &&
    //         (!selectedColor || item.Color?.includes(selectedColor)) &&
    //         item.sellers?.[0]?.commertialOffer?.IsAvailable
    //     ) || [];
    // };

    const handleAddToCart = () => {
        if (!product || !selectedSize || !selectedColor) {
            alert('Por favor selecciona talla y color');
            return;
        }

        const selectedItem = product.items?.find(item => 
            item.Talla?.includes(selectedSize) && 
            item.Color?.includes(selectedColor) &&
            item.sellers?.[0]?.commertialOffer?.IsAvailable
        );

        if (!selectedItem) {
            alert('Combinación de talla y color no disponible o sin stock');
            return;
        }

        const price = selectedItem.sellers?.[0]?.commertialOffer?.Price || 0;
        const image = selectedItem.images?.[0]?.imageUrl || '';

        const cartItem: CartItem = {
            id: selectedItem.itemId,
            title: product.productName,
            price: price,
            size: selectedSize,
            color: selectedColor,
            image: image
        };

        addToCart(cartItem);

        console.log(cartItem)
        alert('Producto añadido al carrito');
    };

    const firstAvailableItem = product.items?.find(item => 
        item.sellers?.[0]?.commertialOffer?.IsAvailable
    ) || product.items?.[0];

    const currentPrice = firstAvailableItem?.sellers?.[0]?.commertialOffer?.Price || 0;
    const listPrice = firstAvailableItem?.sellers?.[0]?.commertialOffer?.ListPrice || 0;

    const isSelectedCombinationAvailable = () => {
        if (!selectedSize || !selectedColor) return true;
        
        const matchingItem = product.items?.find(item =>
            item.Talla?.includes(selectedSize) &&
            item.Color?.includes(selectedColor)
        );
        
        return matchingItem?.sellers?.[0]?.commertialOffer?.IsAvailable || false;
    };

    const breadcrumbTranslate = product.categories[0].replace(/\//g, ' > ');
    const breadcrumb = breadcrumbTranslate.replace('>', '');

    return (
        <>
            <p className='breadcrumb'>{breadcrumb}</p>
            <div className='product'>
                <div className='product-view'>
                    <div className='product-side'>
                        {firstAvailableItem?.images?.length > 0 ? (
                            firstAvailableItem.images.map((image, index) => (
                                <img
                                    key={index}
                                    className='product-side-image'
                                    src={image.imageUrl} 
                                    alt={image.imageText || product.productName}
                                    onError={(e) => {
                                        const target = e.target as HTMLImageElement;
                                        target.style.display = 'none';
                                    }}
                                />
                            ))
                        ) : (
                            <div className="product-side-noimage">No image</div>
                        )}
                    </div>

                    <div className='product-images'>
                        {firstAvailableItem?.images?.length > 0 ? (
                            firstAvailableItem.images.map((image, index) => (
                                <img
                                    key={index}
                                    className='product-images-image'
                                    src={image.imageUrl} 
                                    alt={image.imageText || product.productName}
                                    onError={(e) => {
                                        const target = e.target as HTMLImageElement;
                                        target.style.display = 'none';
                                    }}
                                />
                            ))
                        ) : (
                            <div className="product-side-noimage">Sin imagen disponible</div>
                        )}
                    </div>
                </div>
                
                <div className='product-info'>
                    <p className='product-info-brand'>{product.brand}</p>
                    <h1 className='product-info-name'>{product.productName}</h1>

                    <div className='product-price'>
                        <span className='product-price-current'>
                            ${(currentPrice).toLocaleString('es-CO')}
                        </span>

                        {listPrice > currentPrice && (
                            <span className='product-price-original'>
                                ${(listPrice).toLocaleString('es-CO')}
                            </span>
                        )}
                    </div>
                    
                    {/* Size selection */}
                    {availableSizes.length > 0 && (
                        <div className='product-selector'>
                            <p>Escoge la talla:</p>
                            <div className="product-selector-options">
                                {availableSizes.map(size => (
                                    <button
                                        key={size}
                                        className={`size-btn ${selectedSize === size ? 'selected' : ''}`}
                                        onClick={() => setSelectedSize(size)}
                                    >
                                        {size}
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Color selection */}
                    {availableColors.length > 0 && (
                        <div className='product-selector'>
                            <p>Escoge el color:</p>
                            <div className="product-selector-options">
                                {availableColors.map(color => (
                                    <button
                                        key={color}
                                        className={`color-btn ${selectedColor === color ? 'selected' : ''}`}
                                        onClick={() => setSelectedColor(color)}
                                    >
                                        {color}
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}
                    
                    <div className='product-add'>
                        <p><i className='fi fi-rr-check'></i> Pago 100% seguro</p>
                        <button 
                            onClick={handleAddToCart}
                            disabled={
                                !selectedSize || 
                                !selectedColor || 
                                !isSelectedCombinationAvailable()
                            }
                            className={`product-addtoCart ${
                                (!selectedSize || !selectedColor || !isSelectedCombinationAvailable()) 
                                    ? 'disabled' : ''
                            }`}
                        >
                            {!selectedSize || !selectedColor 
                                ? 'Selecciona talla y color' 
                                : !isSelectedCombinationAvailable()
                                    ? 'Sin stock'
                                    : 'Añadir al carrito'
                            }
                        </button>
                    </div>

                    <div className="product-info-about">
                        <h3><i className='fi fi-rr-info'></i> Acerca del producto</h3>
                        {product.description && (
                            <div className="product-info-description">
                                <p>{product.description}</p>
                            </div>
                        )}

                        <div className='product-info-ref'>
                            <p>Código de referencia: {product.productReferenceCode}</p>
                        </div>
                    </div>
                </div>
            </div>

            <div className="related">
                {relatedProducts.length > 0 && (
                    <div className='related-products'>
                        <h2>Productos relacionados</h2>
                        <div className='related-products-grid'>
                            {relatedProducts.map(related => (
                                <div key={related.productId} className='related-products-item'>
                                    <div className="related-products-item-image-wrapper">
                                        {related.items?.[0]?.images?.[0]?.imageUrl ? (
                                            <img
                                                className='related-products-item-image image-blend'
                                                src={related.items[0].images[0].imageUrl} 
                                                alt={related.productName}
                                                onError={(e) => {
                                                    const target = e.target as HTMLImageElement;
                                                    target.style.display = 'none';
                                                }}
                                            />
                                        ) : (
                                            <div className="no-image">Sin imagen</div>
                                        )}
                                    </div>
                                    <div className="related-products-item-text">
                                        <p className="brand">{related.brand}</p>
                                        <h3 className="title">{related.productName}</h3>
                                        {related.items?.[0]?.sellers?.[0]?.commertialOffer?.Price && (
                                            <p className="price">
                                                ${(related.items[0].sellers[0].commertialOffer.Price).toLocaleString('es-CO')}
                                            </p>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </>
    );
};

export default ProductDetail;