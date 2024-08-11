import { CategoryType } from './allModelTypes'

// A function to get all product categories
export async function getAllCategories(): Promise<CategoryType[]> {
  const response = await fetch('/api/categories', {
    next: { revalidate: 86400 } // Cache for 24 hours
  })
  if (!response.ok) {
    throw new Error('Failed to fetch categories')
  }
  return response.json()
}

// A function to get all product category by ID
export async function getCategoryById(id: number): Promise<CategoryType | null> {
  const response = await fetch(`/api/categories/${id}`, {
    next: { revalidate: 86400 } // Cache for 24 hours
  })
  if (!response.ok) {
    if (response.status === 404) {
      return null
    }
    throw new Error('Failed to fetch category')
  }
  return response.json()
}

// A function to create a product category
export async function createCategory(category: Omit<CategoryType, 'id' | 'products' | 'createdAt' | 'updatedAt'>): Promise<CategoryType> {
  try {
    const response = await fetch('/api/categories', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(category),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(`Failed to create category: ${errorData.message || response.statusText}`);
    }

    return response.json();
  } catch (error) {
    console.error('Error in createCategory:', error);
    throw error;
  }
}

// A function to update a product category
export async function updateCategory(category: Partial<Omit<CategoryType, 'products'>> & { id: number }): Promise<CategoryType> {
  try {
    const response = await fetch(`/api/categories/${category.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(category),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(`Failed to update category: ${errorData.message || response.statusText}`);
    }

    return response.json();
  } catch (error) {
    console.error('Error in updateCategory:', error);
    throw error;
  }
}

// A function to delete a product category
export async function deleteCategory(id: number): Promise<boolean> {
  const response = await fetch(`/api/categories/${id}`, {
    method: 'DELETE',
  })
  return response.ok
}

// A function to handle selecting a category image
export const handleImageFileChangeAddCategory = (
  event: React.ChangeEvent<HTMLInputElement>,
  setSelectedImageFile: React.Dispatch<React.SetStateAction<File | null | undefined>>,
  setCategory: React.Dispatch<React.SetStateAction<Omit<CategoryType, 'id' | 'products' | 'createdAt' | 'updatedAt'>>>
) => {
  const file = event.target.files?.[0];
  if (file) {
    setSelectedImageFile(file);
    setCategory(prevCategory => ({
      ...prevCategory,
      image: URL.createObjectURL(file)
    }));
  }
};

// A function to handle selecting a new category image during edit
export const handleImageFileChangeEditCategory = (
  event: React.ChangeEvent<HTMLInputElement>,
  setSelectedImageFile: React.Dispatch<React.SetStateAction<File | null | undefined>>,
  category: CategoryType | null,
  setCategory: React.Dispatch<React.SetStateAction<CategoryType | null>>
) => {
  const file = event.target.files?.[0];
  if (file && category) {
    setSelectedImageFile(file);
    setCategory({
      ...category,
      image: URL.createObjectURL(file)
    });
  }
};