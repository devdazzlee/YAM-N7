'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Header from '../components/Header';
import Footer from '../components/Footer';
import Services from '../components/Services';
import Loader from '../components/Loader';
import { X, ShoppingCart, Star, Search } from 'lucide-react';
import Link from 'next/link';
import { productApi } from '../../lib/api/productApi';
import { mapApiProducts, DisplayProduct } from '../../lib/utils/productHelpers';

export default function ComparePage() {
  const [products, setProducts] = useState<DisplayProduct[]>([]);
  const [allProducts, setAllProducts] = useState<DisplayProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [showSearch, setShowSearch] = useState(false);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const result = await productApi.listProducts({ fetch_all: true });
        const mapped = mapApiProducts(result.data);
        setAllProducts(mapped);
      } catch (err) {
        console.error('Error fetching products:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  const removeProduct = (id: string) => {
    setProducts(products.filter((p) => p.id !== id));
  };

  const addProduct = (product: DisplayProduct) => {
    if (!products.find((p) => p.id === product.id)) {
      setProducts([...products, product]);
    }
    setShowSearch(false);
    setSearchQuery('');
  };

  const filteredProducts = allProducts.filter(
    (p) =>
      !products.find((cp) => cp.id === p.id) &&
      p.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <section className="page-banner text-foreground page-offset py-16">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center"
          >
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Compare Products</h1>
            <p className="text-xl text-foreground/90">Compare features and prices side by side</p>
          </motion.div>
        </div>
      </section>

      <section className="py-12 bg-card">
        <div className="container mx-auto px-4">
          {loading ? (
            <Loader size="lg" text="Loading products..." />
          ) : (
            <>
              <div className="mb-8 text-center">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setShowSearch(!showSearch)}
                  className="bg-primary hover:bg-primary-dark text-primary-foreground px-6 py-3 rounded-full font-semibold transition-colors inline-flex items-center space-x-2"
                >
                  <Search className="w-5 h-5" />
                  <span>Add Product to Compare</span>
                </motion.button>
              </div>

              {showSearch && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="max-w-xl mx-auto mb-8"
                >
                  <input
                    type="text"
                    placeholder="Search products to compare..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-border-strong focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none"
                    autoFocus
                  />
                  {searchQuery && (
                    <div className="mt-2 bg-card border border-border rounded-xl shadow-lg max-h-60 overflow-y-auto">
                      {filteredProducts.slice(0, 10).map((product) => (
                        <button
                          key={product.id}
                          onClick={() => addProduct(product)}
                          className="w-full text-left px-4 py-3 hover:bg-surface-muted transition-colors flex items-center space-x-3 border-b last:border-b-0"
                        >
                          <img
                            src={product.image}
                            alt={product.name}
                            className="w-10 h-10 rounded-lg object-cover"
                          />
                          <div>
                            <p className="font-semibold text-foreground">{product.name}</p>
                            <p className="text-sm text-muted">Rs. {product.price.toLocaleString()}</p>
                          </div>
                        </button>
                      ))}
                      {filteredProducts.length === 0 && (
                        <p className="px-4 py-3 text-muted">No products found</p>
                      )}
                    </div>
                  )}
                </motion.div>
              )}

              {products.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse">
                    <thead>
                      <tr className="bg-surface-muted">
                        <th className="p-4 text-left font-semibold text-foreground">Features</th>
                        {products.map((product) => (
                          <th key={product.id} className="p-4 text-center">
                            <div className="flex flex-col items-center space-y-2">
                              <button
                                onClick={() => removeProduct(product.id)}
                                className="ml-auto text-muted hover:text-red-500 transition-colors"
                              >
                                <X className="w-5 h-5" />
                              </button>
                              <div className="w-32 h-32 rounded-xl overflow-hidden bg-surface-muted">
                                <img
                                  src={product.image}
                                  alt={product.name}
                                  className="w-full h-full object-cover"
                                />
                              </div>
                              <Link href={`/products/${product.id}`}>
                                <h3 className="font-semibold text-foreground hover:text-primary">
                                  {product.name}
                                </h3>
                              </Link>
                            </div>
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      <tr className="border-b">
                        <td className="p-4 font-semibold text-foreground">Price</td>
                        {products.map((product) => (
                          <td key={product.id} className="p-4 text-center">
                            <div>
                              <span className="text-xl font-bold text-foreground">
                                Rs. {product.price.toLocaleString()}
                              </span>
                              {product.originalPrice && (
                                <span className="block text-sm text-muted line-through">
                                  Rs. {product.originalPrice.toLocaleString()}
                                </span>
                              )}
                            </div>
                          </td>
                        ))}
                      </tr>
                      <tr className="border-b bg-surface-muted">
                        <td className="p-4 font-semibold text-foreground">Category</td>
                        {products.map((product) => (
                          <td key={product.id} className="p-4 text-center text-muted">
                            {product.category || 'N/A'}
                          </td>
                        ))}
                      </tr>
                      {products.some((p) => p.weight) && (
                        <tr className="border-b">
                          <td className="p-4 font-semibold text-foreground">Weight</td>
                          {products.map((product) => (
                            <td key={product.id} className="p-4 text-center text-muted">
                              {product.weight || 'N/A'}
                            </td>
                          ))}
                        </tr>
                      )}
                      {products.some((p) => p.origin) && (
                        <tr className="border-b bg-surface-muted">
                          <td className="p-4 font-semibold text-foreground">Origin</td>
                          {products.map((product) => (
                            <td key={product.id} className="p-4 text-center text-muted">
                              {product.origin || 'N/A'}
                            </td>
                          ))}
                        </tr>
                      )}
                      <tr>
                        <td className="p-4 font-semibold text-foreground">Action</td>
                        {products.map((product) => (
                          <td key={product.id} className="p-4 text-center">
                            <Link href={`/products/${product.id}`}>
                              <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                className="bg-primary hover:bg-primary-dark text-primary-foreground px-6 py-2 rounded-full font-semibold transition-colors flex items-center space-x-2 mx-auto"
                              >
                                <ShoppingCart className="w-4 h-4" />
                                <span>View Product</span>
                              </motion.button>
                            </Link>
                          </td>
                        ))}
                      </tr>
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="text-center py-16">
                  <p className="text-muted text-lg mb-8">
                    No products to compare. Use the button above to add products.
                  </p>
                  <Link href="/shop">
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="bg-primary hover:bg-primary-dark text-primary-foreground px-8 py-4 rounded-full font-semibold transition-colors"
                    >
                      Start Shopping
                    </motion.button>
                  </Link>
                </div>
              )}
            </>
          )}
        </div>
      </section>
      <Services />
      <Footer />
    </div>
  );
}
