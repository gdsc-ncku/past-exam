'use client';
import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import Button from '@/ui/button';
import { Input } from '@/ui/input';
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from '@/ui/Form';

// Define the validation schema using Zod
const ProfileSchema = z.object({
  email: z.string().email({ message: '無效的電子郵件地址' }),
  avatar: z
    .instanceof(FileList)
    .or(z.undefined())
    .refine((fileList) => !fileList || fileList.length === 1, {
      message: '請選擇一個圖片檔案',
    })
    .refine(
      (fileList) => {
        if (!fileList) return true;
        const file = fileList[0];
        return file.type.startsWith('image/');
      },
      { message: '請上傳有效的圖片檔案' },
    ),
  username: z
    .string()
    .min(1, { message: '使用者名稱為必填項目' })
    .max(20, { message: '使用者名稱不得超過 20 個字元' })
    .regex(/^[a-zA-Z0-9_]+$/, { message: '使用者名稱僅允許字母、數字和底線' }),
});

type ProfileFormData = z.infer<typeof ProfileSchema>;

export default function ProfileEdit() {
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<ProfileFormData>({
    resolver: zodResolver(ProfileSchema),
    defaultValues: {
      email: '',
      username: '',
      avatar: undefined,
    },
  });

  const [isLoading, setIsLoading] = useState(true);
  useEffect(() => {
    let mounted = true;
    const fetchUserData = async () => {
      try {
        setIsLoading(true);
        const userData = await mockFetchUserData();
        if (!mounted) return;
        setValue('email', userData.email);
        setValue('username', userData.username);
      } catch (error) {
        console.error('Failed to fetch user data:', error);
        // Use proper error notification system
      } finally {
        if (mounted) setIsLoading(false);
      }
    };
    fetchUserData();
    return () => {
      mounted = false;
    };
  }, [setValue]);

  const onSubmit = async (data: ProfileFormData) => {
    try {
      const validatedData = ProfileSchema.parse(data);
      let updates = [];

      if (data.avatar && data.avatar.length > 0) {
        updates.push(mockUploadAvatar(data.avatar[0]));
      }

      updates.push(mockUpdateUsername(data.username));

      // Wait for all async operations to complete
      await Promise.all(updates);

      // Use proper toast/notification system instead of alert
      console.log('驗證通過:', validatedData);
      // Example: Toast.success('個人資料更新成功！');
    } catch (error) {
      console.error(error);

      if (error instanceof z.ZodError) {
        console.error('Validation error:', error.errors);
      } else if (error instanceof Error) {
        console.error('Update error:', error.message);
      }

      // Example: Toast.error('更新個人資料失敗');
    }
  };

  return (
    <Form>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="space-y-4"
        aria-busy={isSubmitting}
      >
        {/* Email 欄位（僅顯示，不可編輯） */}
        <FormField>
          <FormItem>
            <FormLabel htmlFor="email">Email</FormLabel>
            <FormControl>
              <Input
                id="email"
                type="email"
                {...register('email')}
                disabled
                aria-readonly="true"
                aria-label="Email address"
                className="mt-1 block w-full rounded border border-gray-300 p-2 text-black"
              />
            </FormControl>
            <FormMessage role="alert">{errors.email?.message}</FormMessage>
          </FormItem>
        </FormField>

        {/* Avatar 上傳欄位 */}
        <FormField>
          <FormItem>
            <FormLabel htmlFor="avatar">Avatar</FormLabel>
            <FormControl>
              <input
                type="file"
                accept="image/*"
                {...register('avatar')}
                disabled={isSubmitting}
                className="mt-1 block w-full rounded border border-gray-300 p-2"
              />
            </FormControl>
            <FormMessage>{errors.avatar?.message}</FormMessage>
          </FormItem>
        </FormField>

        {/* Username 編輯欄位 */}
        <FormField>
          <FormItem>
            <FormLabel htmlFor="username">Username</FormLabel>
            <FormControl>
              <Input
                className="mt-1 block w-full rounded border border-gray-300 p-2 text-black"
                type="text"
                {...register('username')}
                disabled={isSubmitting}
                placeholder="輸入您的使用者名稱"
              />
            </FormControl>
            <FormMessage>{errors.username?.message}</FormMessage>
          </FormItem>
        </FormField>

        {/* 提交按鈕 */}
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? (
            <>
              <span className="loading-spinner" aria-hidden="true" />
              <span>儲存中...</span>
            </>
          ) : (
            '儲存變更'
          )}
        </Button>
      </form>
    </Form>
  );
}

// 模擬 Avatar 上傳 API
const mockUploadAvatar = (file: File): Promise<void> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      console.log('Avatar uploaded:', file);
      resolve();
    }, 2000);
  });
};

// 模擬 Username 更新 API
const mockUpdateUsername = (username: string): Promise<void> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      console.log('Username updated to:', username);
      resolve();
    }, 1000);
  });
};

// 模擬獲取使用者資料 API
const mockFetchUserData = (): Promise<{ email: string; username: string }> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        email: 'user@example.com',
        username: 'user_name',
      });
    }, 1000);
  });
};
