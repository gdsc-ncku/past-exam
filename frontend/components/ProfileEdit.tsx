// /components/ProfileEdit.tsx
'use client';
import React, { useEffect } from 'react';
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

const ProfileSchema = z.object({
  email: z.string().email({ message: '無效的電子郵件地址' }),
  // 使用 FileList 或 File | undefined 類型
  avatar: z
    .instanceof(FileList)
    .or(z.undefined())
    .refine((fileList) => !fileList || fileList.length === 0),
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

  useEffect(() => {
    // 模擬從 API 獲取使用者資料
    const fetchUserData = async () => {
      const userData = await mockFetchUserData();
      setValue('email', userData.email);
      setValue('username', userData.username);
    };

    fetchUserData();
  }, [setValue]);

  const onSubmit = async (data: ProfileFormData) => {
    try {
      const validatedData = ProfileSchema.parse(data);
      // 處理 Avatar 上傳
      if (data.avatar && data.avatar.length > 0) {
        await mockUploadAvatar(data.avatar[0]);
      }

      // 處理 Username 更新
      await mockUpdateUsername(data.username);

      alert('個人資料更新成功！');
      console.log('驗證通過:', validatedData);
    } catch (error) {
      console.error(error);
      alert('更新個人資料失敗。');
    }
  };

  return (
    <Form>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {/* Email 欄位（僅顯示，不可編輯） */}
        <FormField>
          <FormItem>
            <FormLabel>Email</FormLabel>
            <FormControl>
              <Input
                type="email"
                {...register('email')}
                disabled
                className="mt-1 block w-full rounded border border-gray-300 p-2 text-black"
              />
            </FormControl>
            <FormMessage>{errors.email?.message}</FormMessage>
          </FormItem>
        </FormField>

        {/* Avatar 上傳欄位，使用標準的 input 元件 */}
        <FormField>
          <FormItem>
            <FormLabel>Avatar</FormLabel>
            <FormControl>
              <input
                type="file"
                accept="image/*"
                {...register('avatar')}
                className="mt-1 block w-full rounded border border-gray-300 p-2"
              />
            </FormControl>
            <FormMessage>{errors.avatar?.message}</FormMessage>
          </FormItem>
        </FormField>

        {/* Username 編輯欄位 */}
        <FormField>
          <FormItem>
            <FormLabel>Username</FormLabel>
            <FormControl>
              <Input
                className="mt-1 block w-full rounded border border-gray-300 p-2 text-black"
                type="text"
                {...register('username')}
                placeholder="輸入您的使用者名稱"
              />
            </FormControl>
            <FormMessage>{errors.username?.message}</FormMessage>
          </FormItem>
        </FormField>

        {/* 提交按鈕 */}
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? '儲存中...' : '儲存變更'}
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
