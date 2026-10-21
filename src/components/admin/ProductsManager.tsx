'use client';

import React, { useState, useTransition } from 'react';
import Image from 'next/image';
import {
  Flower2,
  Plus,
  Edit,
  Trash2,
  Search,
  Check,
  X,
  AlertCircle,
  Package,
  Sparkles,
} from 'lucide-react';
import { formatINR, slugify } from '@/lib/utils';
import {
  createProduct,
  updateProduct,
  deleteProduct,
  type CreateProductInput,
} from '@/actions/admin';

interface ProductItem {
  id: string;
  name: string;
  slug: string;
  description: string;
  details?: string | null;
  categoryId: string;
  price: number; // in paise
  compareAtPrice: number | null;
  stockQuantity: number;
  isActive: boolean;
  isFeatured: boolean;
  tags: string;
  images: string;
  category: {
    id: string;
    name: string;
  };
}

interface CategoryItem {
  id: string;
  name: string;
}

interface ProductsManagerProps {
  initialProducts: ProductItem[];
  categories: CategoryItem[];
}

const PRESET_IMAGES = [
  '/images/products/blushing-peony-rose-1.svg',
  '/images/products/eternal-sunshine-sunflower-1.svg',
  '/images/products/lavender-dreams-wildflower-1.svg',
  '/images/products/scarlet-romance-rose-lily-1.svg',
  '/images/products/celestial-twilight-jumbo-1.svg',
  '/images/products/royal-sovereign-jumbo-1.svg',
  '/images/products/blooming-succulent-cactus-pot-1.svg',
  '/images/products/smiling-tulip-pot-1.svg',
  '/images/products/cozy-cottage-daisy-pot-1.svg',
  '/images/products/sweet-serenade-gift-box-1.svg',
  '/images/products/golden-memories-wooden-hamper-1.svg',
  '/images/products/dainty-cherry-blossom-hairpins-1.svg',
  '/images/products/strawberry-blossom-claw-clip-1.svg',
  '/images/products/vintage-floral-headband-1.svg',
  '/images/products/barnaby-bear-amigurumi-1.svg',
  '/images/products/pip-bunny-amigurumi-1.svg',
];

export function ProductsManager({ initialProducts, categories }: ProductsManagerProps) {
  const [products, setProducts] = useState(initialProducts);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [isPending, startTransition] = useTransition();

  // Modal States
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<ProductItem | null>(null);
  const [deletingProductId, setDeletingProductId] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Form Fields for Create / Edit
  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    categoryId: categories[0]?.id || '',
    priceRupees: 899,
    compareAtPriceRupees: 1199,
    stockQuantity: 15,
    description: '',
    details: '',
    tags: 'handcrafted, crochet, gift',
    image: PRESET_IMAGES[0],
    isActive: true,
    isFeatured: false,
  });

  const resetForm = () => {
    setFormData({
      name: '',
      slug: '',
      categoryId: categories[0]?.id || '',
      priceRupees: 899,
      compareAtPriceRupees: 1199,
      stockQuantity: 15,
      description: '',
      details: '',
      tags: 'handcrafted, crochet, gift',
      image: PRESET_IMAGES[0],
      isActive: true,
      isFeatured: false,
    });
    setErrorMsg(null);
  };

  const openCreateModal = () => {
    resetForm();
    setIsCreateModalOpen(true);
  };

  const openEditModal = (product: ProductItem) => {
    let parsedImage = PRESET_IMAGES[0];
    try {
      const arr = JSON.parse(product.images);
      if (Array.isArray(arr) && arr.length > 0) parsedImage = arr[0];
    } catch {
      // fallback
    }

    setEditingProduct(product);
    setFormData({
      name: product.name,
      slug: product.slug,
      categoryId: product.categoryId,
      priceRupees: Math.round(product.price / 100),
      compareAtPriceRupees: product.compareAtPrice ? Math.round(product.compareAtPrice / 100) : 0,
      stockQuantity: product.stockQuantity,
      description: product.description,
      details: product.details || '',
      tags: product.tags,
      image: parsedImage,
      isActive: product.isActive,
      isFeatured: product.isFeatured,
    });
    setErrorMsg(null);
  };

  const handleNameChange = (val: string) => {
    setFormData((prev) => ({
      ...prev,
      name: val,
      slug: !editingProduct ? slugify(val) : prev.slug,
    }));
  };

  const handleSaveProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    startTransition(async () => {
      try {
        if (editingProduct) {
          // Update
          const res = await updateProduct({
            id: editingProduct.id,
            name: formData.name,
            slug: formData.slug,
            categoryId: formData.categoryId,
            priceInRupees: formData.priceRupees,
            compareAtPriceInRupees: formData.compareAtPriceRupees || undefined,
            stockQuantity: formData.stockQuantity,
            description: formData.description,
            details: formData.details,
            tags: formData.tags,
            image: formData.image,
            isActive: formData.isActive,
            isFeatured: formData.isFeatured,
          });

          if (res.success && res.product) {
            const cat = categories.find((c) => c.id === res.product.categoryId);
            setProducts((prev) =>
              prev.map((p) =>
                p.id === res.product.id
                  ? {
                      ...p,
                      ...res.product,
                      category: cat || p.category,
                    }
                  : p
              )
            );
            setEditingProduct(null);
          }
        } else {
          // Create
          const res = await createProduct({
            name: formData.name,
            slug: formData.slug,
            categoryId: formData.categoryId,
            priceInRupees: formData.priceRupees,
            compareAtPriceInRupees: formData.compareAtPriceRupees || undefined,
            stockQuantity: formData.stockQuantity,
            description: formData.description,
            details: formData.details,
            tags: formData.tags,
            image: formData.image,
            isActive: formData.isActive,
            isFeatured: formData.isFeatured,
          });

          if (res.success && res.product) {
            const cat = categories.find((c) => c.id === res.product.categoryId);
            const newProd: ProductItem = {
              ...res.product,
              category: cat || { id: res.product.categoryId, name: 'Category' },
            };
            setProducts((prev) => [newProd, ...prev]);
            setIsCreateModalOpen(false);
          }
        }
      } catch (err) {
        setErrorMsg(err instanceof Error ? err.message : 'Failed to save product');
      }
    });
  };

  const handleDelete = (id: string) => {
    startTransition(async () => {
      try {
        const res = await deleteProduct(id);
        if (res.success) {
          setProducts((prev) => prev.filter((p) => p.id !== id));
          setDeletingProductId(null);
        }
      } catch (err) {
        alert(err instanceof Error ? err.message : 'Failed to delete product');
      }
    });
  };

  // Filter products by category and query
  const filteredProducts = products.filter((p) => {
    const matchesCategory =
      selectedCategory === 'all' || p.categoryId === selectedCategory;
    const matchesQuery =
      searchQuery === '' ||
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.slug.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.tags.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesQuery;
  });

  return (
    <div className="space-y-6">
      {/* Top Action Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 flex-1">
          {/* Search bar */}
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search products by title, tag, or slug..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-stone-200 bg-white text-xs sm:text-sm text-stone-900 placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
            />
          </div>

          {/* Category Dropdown */}
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="py-2.5 px-3.5 rounded-xl border border-stone-200 bg-white text-xs sm:text-sm text-stone-700 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
          >
            <option value="all">All Categories ({products.length})</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
        </div>

        {/* Add Product Button */}
        <button
          type="button"
          onClick={openCreateModal}
          className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-primary hover:bg-primary-hover text-white text-xs sm:text-sm font-medium shadow-sm transition-all"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Product</span>
        </button>
      </div>

      {/* Products Table */}
      <div className="bg-white rounded-2xl border border-stone-200/80 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs sm:text-sm">
            <thead className="bg-stone-50 border-b border-stone-200 text-[11px] uppercase font-semibold text-stone-500">
              <tr>
                <th className="py-3.5 px-5">Product</th>
                <th className="py-3.5 px-4">Category</th>
                <th className="py-3.5 px-4">Price</th>
                <th className="py-3.5 px-4">Stock</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100 text-stone-800">
              {filteredProducts.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-stone-400">
                    <Package className="w-8 h-8 mx-auto mb-2 opacity-60" />
                    <p>No products match your criteria.</p>
                  </td>
                </tr>
              ) : (
                filteredProducts.map((p) => {
                  let primaryImg = '/images/products/blushing-peony-rose-1.svg';
                  try {
                    const arr = JSON.parse(p.images);
                    if (Array.isArray(arr) && arr[0]) primaryImg = arr[0];
                  } catch {
                    // fallback
                  }

                  return (
                    <tr key={p.id} className="hover:bg-stone-50/60 transition-colors">
                      <td className="py-4 px-5">
                        <div className="flex items-center gap-3">
                          <div className="relative w-12 h-12 rounded-xl bg-stone-100 overflow-hidden border border-stone-200 flex-shrink-0">
                            <Image
                              src={primaryImg}
                              alt={p.name}
                              fill
                              className="object-cover"
                            />
                          </div>
                          <div className="min-w-0 max-w-xs">
                            <p className="font-semibold text-stone-900 truncate">{p.name}</p>
                            <p className="text-[11px] text-stone-400 font-mono truncate">
                              /{p.slug}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-4 text-stone-600 font-medium">
                        {p.category.name}
                      </td>
                      <td className="py-4 px-4">
                        <div className="font-bold text-stone-900">
                          {formatINR(p.price)}
                        </div>
                        {p.compareAtPrice && (
                          <div className="text-[11px] text-stone-400 line-through">
                            {formatINR(p.compareAtPrice)}
                          </div>
                        )}
                      </td>
                      <td className="py-4 px-4">
                        <span
                          className={`inline-block px-2.5 py-0.5 rounded-full text-xs font-mono font-bold ${
                            p.stockQuantity <= 5
                              ? 'bg-amber-100 text-amber-900 border border-amber-300'
                              : 'bg-stone-100 text-stone-700'
                          }`}
                        >
                          {p.stockQuantity} units
                        </span>
                      </td>
                      <td className="py-4 px-4">
                        <div className="flex items-center gap-1.5">
                          <span
                            className={`px-2.5 py-0.5 rounded-full text-[11px] font-semibold ${
                              p.isActive
                                ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                                : 'bg-stone-100 text-stone-500 border border-stone-200'
                            }`}
                          >
                            {p.isActive ? 'Active' : 'Draft'}
                          </span>
                          {p.isFeatured && (
                            <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-blush text-primary">
                              Featured
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="py-4 px-5 text-right">
                        <div className="inline-flex items-center gap-1.5">
                          <button
                            type="button"
                            onClick={() => openEditModal(p)}
                            title="Edit Product"
                            className="p-1.5 text-stone-500 hover:text-primary hover:bg-stone-100 rounded-lg transition-colors"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button
                            type="button"
                            onClick={() => setDeletingProductId(p.id)}
                            title="Delete Product"
                            className="p-1.5 text-stone-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Create / Edit Modal */}
      {(isCreateModalOpen || editingProduct) && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl border border-stone-200 my-8 relative">
            <div className="flex items-center justify-between pb-4 border-b border-stone-100 mb-6">
              <h2 className="text-xl font-semibold tracking-tight text-stone-900 flex items-center gap-2">
                <Flower2 className="w-5 h-5 text-primary" />
                <span>{editingProduct ? 'Edit Artisan Product' : 'Add New Product'}</span>
              </h2>
              <button
                type="button"
                onClick={() => {
                  setIsCreateModalOpen(false);
                  setEditingProduct(null);
                }}
                className="p-2 text-stone-400 hover:text-stone-700 hover:bg-stone-100 rounded-full"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {errorMsg && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded-xl flex items-center gap-2">
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                <span>{errorMsg}</span>
              </div>
            )}

            <form onSubmit={handleSaveProduct} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-stone-500 mb-1">
                    Product Title *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => handleNameChange(e.target.value)}
                    placeholder="e.g. Blushing Peony Everlasting Rose"
                    className="w-full px-3.5 py-2 rounded-xl border border-stone-200 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-stone-500 mb-1">
                    URL Slug
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.slug}
                    onChange={(e) => setFormData({ ...formData, slug: slugify(e.target.value) })}
                    placeholder="blushing-peony-everlasting-rose"
                    className="w-full px-3.5 py-2 rounded-xl border border-stone-200 text-xs sm:text-sm font-mono focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-stone-500 mb-1">
                    Category *
                  </label>
                  <select
                    value={formData.categoryId}
                    onChange={(e) => setFormData({ ...formData, categoryId: e.target.value })}
                    className="w-full px-3.5 py-2 rounded-xl border border-stone-200 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary bg-white"
                  >
                    {categories.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-stone-500 mb-1">
                    Price (INR ₹) *
                  </label>
                  <input
                    type="number"
                    required
                    min={1}
                    value={formData.priceRupees}
                    onChange={(e) =>
                      setFormData({ ...formData, priceRupees: Number(e.target.value) })
                    }
                    className="w-full px-3.5 py-2 rounded-xl border border-stone-200 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-stone-500 mb-1">
                    MRP / Strikethrough (₹)
                  </label>
                  <input
                    type="number"
                    min={0}
                    value={formData.compareAtPriceRupees}
                    onChange={(e) =>
                      setFormData({ ...formData, compareAtPriceRupees: Number(e.target.value) })
                    }
                    className="w-full px-3.5 py-2 rounded-xl border border-stone-200 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-stone-500 mb-1">
                    Stock Quantity *
                  </label>
                  <input
                    type="number"
                    required
                    min={0}
                    value={formData.stockQuantity}
                    onChange={(e) =>
                      setFormData({ ...formData, stockQuantity: Number(e.target.value) })
                    }
                    className="w-full px-3.5 py-2 rounded-xl border border-stone-200 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-stone-500 mb-1">
                    Tags (Comma Separated)
                  </label>
                  <input
                    type="text"
                    value={formData.tags}
                    onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                    placeholder="rose, bouquet, gift"
                    className="w-full px-3.5 py-2 rounded-xl border border-stone-200 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-stone-500 mb-1">
                  Product Description *
                </label>
                <textarea
                  required
                  rows={3}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Artisanal description of the handcrafted crochet flowers..."
                  className="w-full px-3.5 py-2 rounded-xl border border-stone-200 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                />
              </div>

              {/* Image Preset Selector */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-stone-500 mb-1">
                  Product Image Asset
                </label>
                <div className="flex items-center gap-3 mb-2">
                  <div className="relative w-12 h-12 rounded-xl bg-stone-100 overflow-hidden border border-stone-200 flex-shrink-0">
                    <Image
                      src={formData.image}
                      alt="Selected asset"
                      fill
                      className="object-cover"
                    />
                  </div>
                  <input
                    type="text"
                    value={formData.image}
                    onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                    className="flex-1 px-3.5 py-2 rounded-xl border border-stone-200 text-xs font-mono focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                  />
                </div>
                <div className="flex gap-2 overflow-x-auto py-1">
                  {PRESET_IMAGES.slice(0, 8).map((preset) => (
                    <button
                      key={preset}
                      type="button"
                      onClick={() => setFormData({ ...formData, image: preset })}
                      className={`relative w-10 h-10 rounded-lg overflow-hidden border-2 flex-shrink-0 ${
                        formData.image === preset ? 'border-primary ring-2 ring-primary/20' : 'border-stone-200'
                      }`}
                    >
                      <Image src={preset} alt="preset" fill className="object-cover" />
                    </button>
                  ))}
                </div>
              </div>

              {/* Toggles */}
              <div className="flex items-center gap-6 pt-2">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.isActive}
                    onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                    className="w-4 h-4 rounded text-primary focus:ring-primary"
                  />
                  <span className="text-xs font-medium text-stone-700">Active (Visible in catalog)</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.isFeatured}
                    onChange={(e) => setFormData({ ...formData, isFeatured: e.target.checked })}
                    className="w-4 h-4 rounded text-primary focus:ring-primary"
                  />
                  <span className="text-xs font-medium text-stone-700">Feature on Homepage</span>
                </label>
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-stone-100">
                <button
                  type="button"
                  onClick={() => {
                    setIsCreateModalOpen(false);
                    setEditingProduct(null);
                  }}
                  className="px-4 py-2 rounded-xl border border-stone-200 text-stone-700 text-xs font-medium hover:bg-stone-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isPending}
                  className="px-5 py-2 rounded-xl bg-primary hover:bg-primary-hover text-white text-xs font-medium shadow-sm transition-all disabled:opacity-50"
                >
                  {isPending ? 'Saving...' : editingProduct ? 'Save Changes' : 'Create Product'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deletingProductId && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-sm w-full p-6 shadow-xl border border-stone-200 text-center">
            <Trash2 className="w-10 h-10 text-red-600 mx-auto mb-3" />
            <h3 className="text-lg font-semibold tracking-tight text-stone-900">
              Confirm Product Deletion
            </h3>
            <p className="text-xs text-stone-500 mt-1 leading-relaxed">
              Are you sure you want to remove this product from the catalog? This cannot be undone.
            </p>
            <div className="mt-5 flex items-center justify-center gap-3">
              <button
                type="button"
                onClick={() => setDeletingProductId(null)}
                className="px-4 py-2 rounded-xl border border-stone-200 text-stone-700 text-xs font-medium hover:bg-stone-50"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={isPending}
                onClick={() => handleDelete(deletingProductId)}
                className="px-4 py-2 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-medium shadow-sm disabled:opacity-50"
              >
                {isPending ? 'Deleting...' : 'Delete'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
