'use client';

import React, { useState, useTransition } from 'react';
import Image from 'next/image';
import {
  FolderTree,
  Plus,
  Edit,
  Trash2,
  X,
  AlertCircle,
  Package,
} from 'lucide-react';
import { slugify } from '@/lib/utils';
import {
  createCategory,
  updateCategory,
  deleteCategory,
} from '@/actions/admin';

interface CategoryItem {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  image: string | null;
  sortOrder: number;
  isActive: boolean;
  _count: {
    products: number;
  };
}

interface CategoriesManagerProps {
  initialCategories: CategoryItem[];
}

const PRESET_CATEGORY_IMAGES = [
  '/images/categories/bouquets.svg',
  '/images/categories/jumbo-bouquets.svg',
  '/images/categories/flower-pots.svg',
  '/images/categories/gift-boxes.svg',
  '/images/categories/hair-accessories.svg',
  '/images/categories/character-gifts.svg',
];

export function CategoriesManager({ initialCategories }: CategoriesManagerProps) {
  const [categories, setCategories] = useState(initialCategories);
  const [isPending, startTransition] = useTransition();

  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<CategoryItem | null>(null);
  const [deletingCategoryId, setDeletingCategoryId] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    description: '',
    image: PRESET_CATEGORY_IMAGES[0],
    sortOrder: 1,
    isActive: true,
  });

  const resetForm = () => {
    setFormData({
      name: '',
      slug: '',
      description: '',
      image: PRESET_CATEGORY_IMAGES[0],
      sortOrder: categories.length + 1,
      isActive: true,
    });
    setErrorMsg(null);
  };

  const openCreateModal = () => {
    resetForm();
    setIsCreateModalOpen(true);
  };

  const openEditModal = (cat: CategoryItem) => {
    setEditingCategory(cat);
    setFormData({
      name: cat.name,
      slug: cat.slug,
      description: cat.description || '',
      image: cat.image || PRESET_CATEGORY_IMAGES[0],
      sortOrder: cat.sortOrder,
      isActive: cat.isActive,
    });
    setErrorMsg(null);
  };

  const handleNameChange = (val: string) => {
    setFormData((prev) => ({
      ...prev,
      name: val,
      slug: !editingCategory ? slugify(val) : prev.slug,
    }));
  };

  const handleSaveCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    startTransition(async () => {
      try {
        if (editingCategory) {
          const res = await updateCategory({
            id: editingCategory.id,
            name: formData.name,
            slug: formData.slug,
            description: formData.description,
            image: formData.image,
            sortOrder: formData.sortOrder,
            isActive: formData.isActive,
          });

          if (res.success && res.category) {
            setCategories((prev) =>
              prev.map((c) =>
                c.id === res.category.id
                  ? {
                      ...c,
                      ...res.category,
                    }
                  : c
              )
            );
            setEditingCategory(null);
          }
        } else {
          const res = await createCategory({
            name: formData.name,
            slug: formData.slug,
            description: formData.description,
            image: formData.image,
            sortOrder: formData.sortOrder,
            isActive: formData.isActive,
          });

          if (res.success && res.category) {
            const newCat: CategoryItem = {
              ...res.category,
              _count: { products: 0 },
            };
            setCategories((prev) => [...prev, newCat]);
            setIsCreateModalOpen(false);
          }
        }
      } catch (err) {
        setErrorMsg(err instanceof Error ? err.message : 'Failed to save category');
      }
    });
  };

  const handleDelete = (id: string) => {
    startTransition(async () => {
      try {
        const res = await deleteCategory(id);
        if (res.success) {
          setCategories((prev) => prev.filter((c) => c.id !== id));
          setDeletingCategoryId(null);
        }
      } catch (err) {
        alert(err instanceof Error ? err.message : 'Failed to delete category');
      }
    });
  };

  return (
    <div className="space-y-6">
      {/* Top Action Bar */}
      <div className="flex items-center justify-between">
        <p className="text-xs sm:text-sm text-stone-500">
          Showing {categories.length} artisan collections
        </p>

        <button
          type="button"
          onClick={openCreateModal}
          className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-primary hover:bg-primary-hover text-white text-xs sm:text-sm font-medium shadow-sm transition-all"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Category</span>
        </button>
      </div>

      {/* Categories Table */}
      <div className="bg-white rounded-2xl border border-stone-200/80 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs sm:text-sm">
            <thead className="bg-stone-50 border-b border-stone-200 text-[11px] uppercase font-semibold text-stone-500">
              <tr>
                <th className="py-3.5 px-5">Category</th>
                <th className="py-3.5 px-4">Description</th>
                <th className="py-3.5 px-4">Products</th>
                <th className="py-3.5 px-4">Sort Order</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100 text-stone-800">
              {categories.map((cat) => (
                <tr key={cat.id} className="hover:bg-stone-50/60 transition-colors">
                  <td className="py-4 px-5">
                    <div className="flex items-center gap-3">
                      <div className="relative w-12 h-12 rounded-xl bg-stone-100 overflow-hidden border border-stone-200 flex-shrink-0">
                        {cat.image ? (
                          <Image
                            src={cat.image}
                            alt={cat.name}
                            fill
                            className="object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-stone-400">
                            <FolderTree className="w-5 h-5" />
                          </div>
                        )}
                      </div>
                      <div>
                        <p className="font-semibold text-stone-900">{cat.name}</p>
                        <p className="text-[11px] text-stone-400 font-mono">
                          /{cat.slug}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-4 text-stone-600 max-w-sm truncate text-xs">
                    {cat.description || 'No description provided'}
                  </td>
                  <td className="py-4 px-4">
                    <span className="inline-block px-2.5 py-0.5 rounded-full text-xs font-mono font-bold bg-stone-100 text-stone-800">
                      {cat._count.products} products
                    </span>
                  </td>
                  <td className="py-4 px-4 font-mono text-stone-700">
                    {cat.sortOrder}
                  </td>
                  <td className="py-4 px-4">
                    <span
                      className={`px-2.5 py-0.5 rounded-full text-[11px] font-semibold ${
                        cat.isActive
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                          : 'bg-stone-100 text-stone-500 border border-stone-200'
                      }`}
                    >
                      {cat.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td className="py-4 px-5 text-right">
                    <div className="inline-flex items-center gap-1.5">
                      <button
                        type="button"
                        onClick={() => openEditModal(cat)}
                        title="Edit Category"
                        className="p-1.5 text-stone-500 hover:text-primary hover:bg-stone-100 rounded-lg transition-colors"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        type="button"
                        onClick={() => setDeletingCategoryId(cat.id)}
                        disabled={cat._count.products > 0}
                        title={
                          cat._count.products > 0
                            ? 'Cannot delete category with associated products'
                            : 'Delete Category'
                        }
                        className="p-1.5 text-stone-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Create / Edit Modal */}
      {(isCreateModalOpen || editingCategory) && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-xl w-full p-6 sm:p-8 shadow-2xl border border-stone-200 my-8 relative">
            <div className="flex items-center justify-between pb-4 border-b border-stone-100 mb-6">
              <h2 className="text-xl font-semibold tracking-tight text-stone-900 flex items-center gap-2">
                <FolderTree className="w-5 h-5 text-primary" />
                <span>{editingCategory ? 'Edit Collection' : 'Create New Collection'}</span>
              </h2>
              <button
                type="button"
                onClick={() => {
                  setIsCreateModalOpen(false);
                  setEditingCategory(null);
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

            <form onSubmit={handleSaveCategory} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-stone-500 mb-1">
                    Category Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => handleNameChange(e.target.value)}
                    placeholder="e.g. Everlasting Bouquets"
                    className="w-full px-3.5 py-2 rounded-xl border border-stone-200 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-stone-500 mb-1">
                    Slug
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.slug}
                    onChange={(e) => setFormData({ ...formData, slug: slugify(e.target.value) })}
                    placeholder="everlasting-bouquets"
                    className="w-full px-3.5 py-2 rounded-xl border border-stone-200 text-xs sm:text-sm font-mono focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-stone-500 mb-1">
                  Description
                </label>
                <textarea
                  rows={3}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Artisan description of this collection..."
                  className="w-full px-3.5 py-2 rounded-xl border border-stone-200 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                />
              </div>

              {/* Image Preset Selector */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-stone-500 mb-1">
                  Category Icon Asset
                </label>
                <div className="flex items-center gap-3 mb-2">
                  <div className="relative w-12 h-12 rounded-xl bg-stone-100 overflow-hidden border border-stone-200 flex-shrink-0">
                    <Image
                      src={formData.image}
                      alt="Category image"
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
                  {PRESET_CATEGORY_IMAGES.map((preset) => (
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

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-stone-500 mb-1">
                    Sort Order
                  </label>
                  <input
                    type="number"
                    min={0}
                    value={formData.sortOrder}
                    onChange={(e) =>
                      setFormData({ ...formData, sortOrder: Number(e.target.value) })
                    }
                    className="w-full px-3.5 py-2 rounded-xl border border-stone-200 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                  />
                </div>

                <div className="flex items-center pt-6">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.isActive}
                      onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                      className="w-4 h-4 rounded text-primary focus:ring-primary"
                    />
                    <span className="text-xs font-medium text-stone-700">Active (Visible in menu)</span>
                  </label>
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-stone-100">
                <button
                  type="button"
                  onClick={() => {
                    setIsCreateModalOpen(false);
                    setEditingCategory(null);
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
                  {isPending ? 'Saving...' : editingCategory ? 'Save Changes' : 'Create Category'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deletingCategoryId && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-sm w-full p-6 shadow-xl border border-stone-200 text-center">
            <Trash2 className="w-10 h-10 text-red-600 mx-auto mb-3" />
            <h3 className="text-lg font-semibold tracking-tight text-stone-900">
              Confirm Category Deletion
            </h3>
            <p className="text-xs text-stone-500 mt-1 leading-relaxed">
              Are you sure you want to remove this category? Only categories with 0 associated products can be removed.
            </p>
            <div className="mt-5 flex items-center justify-center gap-3">
              <button
                type="button"
                onClick={() => setDeletingCategoryId(null)}
                className="px-4 py-2 rounded-xl border border-stone-200 text-stone-700 text-xs font-medium hover:bg-stone-50"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={isPending}
                onClick={() => handleDelete(deletingCategoryId)}
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
