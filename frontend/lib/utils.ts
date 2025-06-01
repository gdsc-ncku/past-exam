import { twMerge } from 'tailwind-merge';
import clsx, { ClassValue } from 'clsx';

export const cn = (...inputs: ClassValue[]) => {
  return twMerge(clsx(inputs));
};

export const formatDate = (date: Date) => {
  return date.toLocaleString('zh-TW', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    weekday: 'long',
    hour: '2-digit',
    minute: '2-digit',
  });
};

export const getAvatarUrl = (avatarPath: string, bustCache = false) => {
  // Check if avatarPath is already a full URL
  const isFullUrl =
    avatarPath.startsWith('http://') || avatarPath.startsWith('https://');

  let baseUrl: string;
  if (isFullUrl) {
    baseUrl = avatarPath;
  } else {
    // Construct avatar URL using file server endpoint + avatar path
    const fileServerURL =
      process.env.NEXT_PUBLIC_FILE_SERVER_URL || 'https://s3.ncku-pastexam.ccns.io';
    baseUrl = `${fileServerURL}${avatarPath}`;
  }

  // Add cache busting parameter if requested
  if (bustCache) {
    const separator = baseUrl.includes('?') ? '&' : '?';
    return `${baseUrl}${separator}t=${Date.now()}`;
  }

  return baseUrl;
};

// Cache management utilities
export const invalidateAvatarCache = (avatarUrl: string) => {
  if (typeof window !== 'undefined') {
    // Clear browser cache for the specific avatar URL
    const img = new Image();
    img.src = getAvatarUrl(avatarUrl, true); // Force reload with cache busting

    // Clear any existing cached versions
    const cachesToClear = [
      avatarUrl,
      getAvatarUrl(avatarUrl),
      getAvatarUrl(avatarUrl, true),
    ];

    // Preload the new image to warm the cache
    cachesToClear.forEach((url) => {
      const preloadImg = new Image();
      preloadImg.src = url;
    });
  }
};

// Force reload avatar images on the page
export const refreshAvatarImages = () => {
  if (typeof window !== 'undefined') {
    const avatarImages = document.querySelectorAll(
      'img[alt="Avatar"], img[alt*="avatar"]',
    );
    avatarImages.forEach((img) => {
      const htmlImg = img as HTMLImageElement;
      const originalSrc = htmlImg.src;

      // Add cache busting parameter
      const separator = originalSrc.includes('?') ? '&' : '?';
      htmlImg.src = `${originalSrc}${separator}refresh=${Date.now()}`;
    });
  }
};

export const downloadFile = async (fileLocation: string, filename: string) => {
  try {
    // Check if fileLocation is already a full URL
    const isFullUrl =
      fileLocation.startsWith('http://') || fileLocation.startsWith('https://');

    let downloadUrl: string;
    if (isFullUrl) {
      // Use the fileLocation as-is if it's already a full URL
      downloadUrl = fileLocation;
    } else {
      // Construct download URL using file server endpoint + file location
      const fileServerURL =
        process.env.NEXT_PUBLIC_FILE_SERVER_URL || 'https://s3.ncku-pastexam.ccns.io';
      downloadUrl = `${fileServerURL}/exam-files/${fileLocation}`;
    }

    // Fetch the file as a blob to ensure proper filename handling
    const response = await fetch(downloadUrl);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const blob = await response.blob();

    // Create a temporary URL for the blob
    const blobUrl = window.URL.createObjectURL(blob);

    // Create a temporary link element to trigger download
    const link = document.createElement('a');
    link.href = blobUrl;
    link.download = filename; // This will force the correct filename
    link.style.display = 'none';

    // Add to DOM, click, and remove
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    // Clean up the blob URL
    window.URL.revokeObjectURL(blobUrl);
  } catch (error) {
    console.error('Download error:', error);

    // Fallback to direct link method if fetch fails
    try {
      // Check if fileLocation is already a full URL for fallback too
      const isFullUrl =
        fileLocation.startsWith('http://') ||
        fileLocation.startsWith('https://');

      let downloadUrl: string;
      if (isFullUrl) {
        downloadUrl = fileLocation;
      } else {
        const fileServerURL =
          process.env.NEXT_PUBLIC_FILE_SERVER_URL || 'https://s3.ncku-pastexam.ccns.io';
        downloadUrl = `${fileServerURL}/exam-files/${fileLocation}`;
      }

      const link = document.createElement('a');
      link.href = downloadUrl;
      link.download = filename;
      link.target = '_blank';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (fallbackError) {
      console.error('Fallback download error:', fallbackError);
    }
  }
};
