'use client';

import { useState, useRef, useEffect } from 'react';
import { Button } from '@/ui/Button';
import { Camera, Upload, X, Loader2 } from 'lucide-react';
import Image from 'next/image';
import { userAPI } from '@/module/api/user';
import { toast } from 'sonner';
import {
  getAvatarUrl,
  invalidateAvatarCache,
  refreshAvatarImages,
} from '@/lib/utils';

interface AvatarUploadProps {
  currentAvatar?: string;
  onAvatarUpdate: (newAvatarUrl: string) => void;
  className?: string;
}

export const AvatarUpload = ({
  currentAvatar,
  onAvatarUpdate,
  className = '',
}: AvatarUploadProps) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [updating, setUpdating] = useState(false);
  const [avatarKey, setAvatarKey] = useState(Date.now()); // For cache busting
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Cleanup preview URL on unmount
  useEffect(() => {
    return () => {
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);

  // Force avatar refresh when currentAvatar changes
  useEffect(() => {
    setAvatarKey(Date.now());
  }, [currentAvatar]);

  // Validate file before upload
  const validateFile = (file: File): string | null => {
    const maxSize = 5 * 1024 * 1024; // 5MB
    const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];

    if (!allowedTypes.includes(file.type)) {
      return '只支援 JPG, PNG, GIF, WebP 格式的圖片';
    }

    if (file.size > maxSize) {
      return '圖片大小不能超過 5MB';
    }

    return null;
  };

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const error = validateFile(file);
    if (error) {
      toast.error(error);
      return;
    }

    setSelectedFile(file);

    // Create preview URL
    const url = URL.createObjectURL(file);
    setPreviewUrl(url);
  };

  const handleRemoveFile = () => {
    setSelectedFile(null);
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
      setPreviewUrl(null);
    }
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleUploadAndUpdate = async () => {
    if (!selectedFile) return;

    try {
      setUploading(true);

      // Step 1: Upload avatar image
      const uploadResponse = await userAPI.uploadAvatar(selectedFile);

      if (
        uploadResponse.data.status === 'success' &&
        uploadResponse.data.data
      ) {
        const avatarUrl = uploadResponse.data.data.avatar_url;

        setUpdating(true);

        // Step 2: Update user profile with new avatar URL
        const updateResponse = await userAPI.updateProfile({
          avatar: avatarUrl,
        });

        if (updateResponse.data.status === 'success') {
          // Success! Force cache invalidation and update parent component
          setAvatarKey(Date.now()); // Update cache busting key
          handleRemoveFile(); // Clear selection

          // Invalidate cache for the new avatar
          invalidateAvatarCache(avatarUrl);

          // Refresh all avatar images on the page
          setTimeout(() => {
            refreshAvatarImages();
          }, 100);

          toast.success('頭像更新成功！');

          // Update parent component with cache busting
          onAvatarUpdate(avatarUrl);
        } else {
          toast.error('更新個人資料失敗');
        }
      } else {
        toast.error(uploadResponse.data.message || '上傳失敗');
      }
    } catch (error) {
      console.error('Avatar upload error:', error);
      toast.error('上傳頭像時發生錯誤');
    } finally {
      setUploading(false);
      setUpdating(false);
    }
  };

  const isLoading = uploading || updating;

  // Get avatar URL with cache busting
  const getDisplayAvatarUrl = () => {
    if (previewUrl) {
      return previewUrl; // Use preview for selected file
    }

    if (currentAvatar) {
      // Use cache busting for current avatar to ensure fresh load
      return getAvatarUrl(currentAvatar, true);
    }

    return '/default-avatar.svg';
  };

  return (
    <div className={`flex flex-col items-center space-y-4 ${className}`}>
      {/* Avatar Display */}
      <div className="relative">
        <div className="relative h-64 w-64 overflow-hidden rounded-lg border-2 border-gray-200">
          <Image
            key={avatarKey} // Force re-render when key changes
            src={getDisplayAvatarUrl()}
            alt="Avatar"
            fill
            className="object-cover"
            priority
            unoptimized // Disable Next.js optimization to ensure fresh loads
            onError={() => {
              // Handle broken image
              console.warn('Failed to load avatar image');
            }}
          />

          {/* Overlay for file selection */}
          {!selectedFile && (
            <div
              className="absolute inset-0 flex cursor-pointer items-center justify-center bg-black/30 opacity-0 transition-opacity duration-200 hover:opacity-100"
              onClick={() => fileInputRef.current?.click()}
            >
              <div className="text-center text-white">
                <Camera className="mx-auto mb-2 h-8 w-8" />
                <span className="text-sm font-medium">更換頭像</span>
              </div>
            </div>
          )}
        </div>

        {/* Remove preview button */}
        {selectedFile && (
          <button
            onClick={handleRemoveFile}
            className="absolute -right-2 -top-2 rounded-full bg-red-500 p-1 text-white shadow-lg hover:bg-red-600"
            disabled={isLoading}
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>

      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileSelect}
        className="hidden"
        disabled={isLoading}
      />

      {/* Action Buttons */}
      <div className="flex flex-col space-y-2">
        {selectedFile ? (
          // Upload and update buttons when file is selected
          <div className="flex space-x-2">
            <Button
              onClick={handleUploadAndUpdate}
              disabled={isLoading}
              className="flex items-center space-x-2"
            >
              {isLoading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span>
                    {uploading
                      ? '上傳中...'
                      : updating
                        ? '更新中...'
                        : '處理中...'}
                  </span>
                </>
              ) : (
                <>
                  <Upload className="h-4 w-4" />
                  <span>確認更新</span>
                </>
              )}
            </Button>

            <Button
              variant="secondary"
              onClick={handleRemoveFile}
              disabled={isLoading}
            >
              取消
            </Button>
          </div>
        ) : (
          // Select file button when no file is selected
          <Button
            variant="secondary"
            onClick={() => fileInputRef.current?.click()}
            disabled={isLoading}
            className="flex items-center space-x-2"
          >
            <Camera className="h-4 w-4" />
            <span>選擇新頭像</span>
          </Button>
        )}
      </div>

      {/* File info */}
      {selectedFile && (
        <div className="text-center text-sm text-gray-500">
          <p>檔案: {selectedFile.name}</p>
          <p>大小: {(selectedFile.size / 1024 / 1024).toFixed(2)} MB</p>
        </div>
      )}

      {/* Upload requirements */}
      <div className="text-center text-xs text-gray-400">
        <p>支援 JPG、PNG、GIF、WebP 格式</p>
        <p>檔案大小不超過 5MB</p>
      </div>
    </div>
  );
};
