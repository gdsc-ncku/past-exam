'use client';
import { useAuthentication } from '@/hooks/useAuthentication';
import { Input } from '@/ui/Input';
import { Label } from '@/ui/Label';
import { Button } from '@/ui/Button';
import { AvatarUpload } from '@/app/components/AvatarUpload';
import { useState, useEffect } from 'react';
import { z } from 'zod';
import { userAPI } from '@/module/api';
import { toast } from 'sonner';
import { DepartmentSelector } from '@/app/components/DepartmentSelector';

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
  const [loading, setLoading] = useState(false);

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

  const handleAvatarUpdate = (newAvatarUrl: string) => {
    // Refresh user profile to get updated avatar
    handleRefreshProfile();
  };

  return (
    <div className="container mx-auto mt-16 flex flex-col gap-8 px-4 sm:mt-20 sm:gap-12 sm:px-8 lg:mt-24 lg:gap-16 lg:px-16">
      <div className="flex flex-col gap-6 sm:gap-8 lg:flex-row">
        <div className="flex w-full flex-col gap-6 sm:gap-8 lg:w-1/2">
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
            <DepartmentSelector
              value={department}
              onChange={(value) => {
                setDepartment(value);
                validateField('department', value);
              }}
              disabled={loading}
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
        <div className="w-full lg:w-1/2">
          <div className="flex h-full flex-col items-center gap-4 py-4 sm:py-6 lg:py-0">
            <AvatarUpload
              currentAvatar={currentUser?.avatar || ''}
              onAvatarUpdate={handleAvatarUpdate}
            />
          </div>
        </div>
      </div>
      <Button
        className="w-full self-center sm:w-auto sm:min-w-32 sm:self-end lg:w-1/6"
        onClick={handleSave}
        disabled={!!errors.userName || !!errors.department}
      >
        完成修改
      </Button>
    </div>
  );
}
