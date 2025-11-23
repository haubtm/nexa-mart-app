/**
 * Extract barcode from image URL
 * Pattern: https://image.hovinhduy.id.vn/barcodes/products/product_image_20251123_205456_3ef7333d.png
 * Returns: barcode number from filename
 */
export const extractBarcodeFromUrl = (imageUrl: string): string | null => {
  try {
    // Extract filename from URL
    const urlParts = imageUrl.split('/');
    const filename = urlParts[urlParts.length - 1];

    // Remove extension
    const nameWithoutExt = filename.replace(/\.[^/.]+$/, '');

    // Pattern: product_image_YYYYMMDD_HHMMSS_[BARCODE].png
    // Extract the barcode part (after last underscore)
    const parts = nameWithoutExt.split('_');
    if (parts.length >= 4) {
      const barcode = parts[parts.length - 1];
      // Barcode should be alphanumeric
      if (/^[a-zA-Z0-9]+$/.test(barcode)) {
        return barcode;
      }
    }

    return null;
  } catch (error) {
    console.error('Error extracting barcode from URL:', error);
    return null;
  }
};

/**
 * Extract barcode from barcode image
 * This function would use image recognition to extract barcode
 * For now, we'll use a simple regex pattern matcher
 */
export const extractBarcodeFromImage = async (
  imagePath: string
): Promise<string | null> => {
  try {
    // If it's a URL, extract from URL pattern
    if (imagePath.startsWith('http')) {
      return extractBarcodeFromUrl(imagePath);
    }

    // For local images, we would need additional image processing
    // This is a placeholder for future implementation
    return null;
  } catch (error) {
    console.error('Error extracting barcode from image:', error);
    return null;
  }
};
