
export const uploadImageToPublic = async (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    
    reader.onload = (event) => {
      const result = event.target?.result as string;
      
      // Create a unique filename
      const timestamp = Date.now();
      const randomStr = Math.random().toString(36).substring(2);
      const fileExt = file.name.split('.').pop() || 'jpg';
      const fileName = `restaurant-${timestamp}-${randomStr}.${fileExt}`;
      
      // For demo purposes, we'll use the data URL directly
      // In a real deployment, you'd save this to your server
      resolve(result);
    };
    
    reader.onerror = () => {
      reject(new Error('Failed to read file'));
    };
    
    reader.readAsDataURL(file);
  });
};

export const validateImageFile = (file: File): { valid: boolean; error?: string } => {
  // Check file type
  if (!file.type.startsWith('image/')) {
    return { valid: false, error: 'Por favor selecciona un archivo de imagen válido.' };
  }
  
  // Check file size (max 5MB)
  if (file.size > 5 * 1024 * 1024) {
    return { valid: false, error: 'La imagen es muy grande. Por favor selecciona una imagen menor a 5MB.' };
  }
  
  return { valid: true };
};
