'use client';
import { useAuthentication } from '@/hooks/useAuthentication';
import { Input } from '@/ui/Input';
import { Label } from '@/ui/Label';
import { Button } from '@/ui/Button';
import Image from 'next/image';
import { useState } from 'react';
import { z } from 'zod';
import { userAPI } from '@/module/api';
import { toast } from 'sonner';

const userSchema = z.object({
  userName: z.string().min(1, '姓名不能為空').max(50, '姓名不能超過50個字'),
  department: z.string().min(1, '系所不能為空').max(100, '系所不能超過100個字'),
});

export default function SettingPage() {
  const { currentUser, handleRefreshProfile } = useAuthentication();
  const [userName, setUserName] = useState(currentUser?.userName || '');
  const [department, setDepartment] = useState(currentUser?.department || '');
  const [errors, setErrors] = useState<{
    userName?: string;
    department?: string;
  }>({});

  const validateField = (field: 'userName' | 'department', value: string) => {
    try {
      userSchema.shape[field].parse(value);
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    } catch (error) {
      if (error instanceof z.ZodError) {
        setErrors((prev) => ({ ...prev, [field]: error.errors[0].message }));
      }
    }
  };

  const handleSave = async () => {
    const res = await userAPI.updateProfile({
      username: userName,
      department: department,
    });
    if (res.data.status === 'success') {
      toast('修改成功');
      handleRefreshProfile();
    } else {
      toast('修改失敗');
    }
  };

  return (
    <div className="container mx-auto mt-24 flex flex-col gap-16 px-16">
      <div className="flex gap-8">
        <div className="flex w-1/2 flex-col gap-8">
          <div className="flex flex-col gap-2">
            <Label>姓名</Label>
            <Input
              placeholder="請輸入姓名"
              value={userName}
              onChange={(e) => {
                setUserName(e.target.value);
                validateField('userName', e.target.value);
              }}
              variant={errors.userName ? 'error' : 'default'}
              className="w-full"
            />
            {errors.userName && (
              <span className="text-sm text-red-500">{errors.userName}</span>
            )}
          </div>
          <div className="flex flex-col gap-2">
            <Label>系所</Label>
            <Input
              placeholder="請輸入系所"
              value={department}
              onChange={(e) => {
                setDepartment(e.target.value);
                validateField('department', e.target.value);
              }}
              variant={errors.department ? 'error' : 'default'}
              className="w-full"
            />
            {errors.department && (
              <span className="text-sm text-red-500">{errors.department}</span>
            )}
          </div>
          <div className="flex flex-col gap-2">
            <Label className="w-full">Email</Label>
            <Input
              value={currentUser?.email || ''}
              disabled={true}
              className="w-full"
            />
          </div>
        </div>
        <div className="w-1/2">
          <div className="flex h-full flex-col items-center gap-4">
            <div className="relative">
              <Image
                src={currentUser?.avatar || ''}
                alt="user"
                width={250}
                height={250}
                className="rounded-lg"
              />
              <button className="absolute inset-x-0 bottom-0 flex h-1/5 items-center justify-center bg-black/30 text-white transition-opacity duration-200">
                更換頭像
              </button>
            </div>
          </div>
        </div>
      </div>
      <Button
        className="w-1/6 self-end"
        onClick={handleSave}
        disabled={!!errors.userName || !!errors.department}
      >
        完成修改
      </Button>
    </div>
  );
}
