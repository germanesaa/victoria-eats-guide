
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
  // Block SVG uploads to prevent XSS via embedded scripts
  if (file.type === 'image/svg+xml') {
    return { valid: false, error: 'Por razones de seguridad, no se permiten archivos SVG.' };
  }

  // Only allow safe image formats
  const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
  if (!allowedTypes.includes(file.type)) {
    return { valid: false, error: 'Solo se permiten imágenes JPG, PNG, GIF o WebP.' };
  }
  
  // Check file size (max 5MB)
  if (file.size > 5 * 1024 * 1024) {
    return { valid: false, error: 'La imagen es muy grande. Por favor selecciona una imagen menor a 5MB.' };
  }
  
  return { valid: true };
};
