'use client';
import { iconsMap } from '@/ui/iconsMap';
import React from 'react';
import { useFormContext } from 'react-hook-form';

export default function UploadForm() {
  const { register, formState } = useFormContext();

  const FolderClosedIcon = iconsMap['folder-closed'];

  return (
    <div className="flex flex-col gap-[20px] bg-white">
      <div className="flex h-10 items-center ">
        <FolderClosedIcon className="size-10" />
        <h1 className="text-3xl font-bold text-black">上傳項目</h1>
      </div>

      <div className="flex items-center gap-x-7">
        {/* Year Input */}
        <div className="flex flex-col  gap-1">
          <div className="flex gap-4">
            <label htmlFor="year" className="self-center">
              年分
            </label>
            <input
              type="number"
              {...register('year', { valueAsNumber: true })}
              className="w-20 rounded-md border"
              defaultValue={113}
            />
          </div>
          {formState.errors.year?.message && (
            <p className="text-red-500">
              {String(formState.errors.year.message)}
            </p>
          )}
        </div>

        {/* Semester Selection */}
        <div className="flex flex-col gap-1">
          <div className="flex gap-7">
            <label>
              <input
                type="radio"
                {...register('semester')}
                value="firstSemester"
              />{' '}
              上學期
            </label>
            <label>
              <input
                type="radio"
                {...register('semester')}
                value="secondSemester"
              />{' '}
              下學期
            </label>
          </div>
          {formState.errors.semester?.message && (
            <p className="text-red-500">
              {String(formState.errors.semester.message)}
            </p>
          )}
        </div>
      </div>

      {/* Course Name */}
      <div className="flex flex-col gap-1">
        <div className="flex gap-4">
          <label className="self-center" htmlFor="courseName">
            課程名稱
          </label>
          <input
            type="text"
            {...register('courseName')}
            className="rounded-md border"
          />
        </div>
        {formState.errors.courseName?.message && (
          <p className="text-red-500">
            {String(formState.errors.courseName.message)}
          </p>
        )}
      </div>

      {/* Course Code */}
      <div className="flex flex-col gap-1">
        <div className="flex gap-4">
          <label className="self-center" htmlFor="courseCode">
            課程代碼
          </label>
          <input
            type="text"
            {...register('courseCode')}
            className="rounded-md border"
          />
        </div>
        {formState.errors.courseCode?.message && (
          <p className="text-red-500">
            {String(formState.errors.courseCode.message)}
          </p>
        )}
      </div>

      {/* Instructor */}
      <div className="flex flex-col gap-1">
        <div className="flex gap-4">
          <label className="self-center" htmlFor="courseInstructor">
            教課教師
          </label>
          <input
            type="text"
            {...register('courseInstructor')}
            className="rounded-md border"
          />
        </div>
        {formState.errors.courseInstructor?.message && (
          <p className="text-red-500">
            {String(formState.errors.courseInstructor.message)}
          </p>
        )}
      </div>

      {/* Exam Type */}
      <div className="flex gap-4">
        <label htmlFor="examType">考試類型</label>
        <div className="flex gap-4">
          <label>
            <input type="radio" {...register('examType')} value="midtermExam" />{' '}
            期中考
          </label>
          <label>
            <input type="radio" {...register('examType')} value="termExam" />{' '}
            期末考
          </label>
          <label>
            <input type="radio" {...register('examType')} value="quizExam" />{' '}
            小考
          </label>
          <label>
            <input type="radio" {...register('examType')} value="other" /> 其他
          </label>
        </div>
        {formState.errors.examType?.message && (
          <p className="text-red-500">
            {String(formState.errors.examType.message)}
          </p>
        )}
      </div>

      {/* Exam Range */}
      <div className="flex flex-col gap-1">
        <div className="flex gap-4">
          <label className="self-center" htmlFor="examRange">
            試題範圍
          </label>
          <input
            type="text"
            {...register('examRange')}
            className="rounded-md border"
            placeholder="（選填）"
          />
        </div>
      </div>

      {/* Anonymous Selection */}
      <div className="flex gap-4">
        <label htmlFor="isAnonymous">是否匿名</label>
        <div className="flex gap-4">
          <label>
            <input
              type="radio"
              {...register('isAnonymous')}
              value="anonymous"
            />{' '}
            是，匿名貢獻
          </label>
          <label>
            <input
              type="radio"
              {...register('isAnonymous')}
              value="noAnonymous"
            />{' '}
            否，具名貢獻
          </label>
        </div>
        {formState.errors.isAnonymous?.message && (
          <p className="text-red-500">
            {String(formState.errors.isAnonymous.message)}
          </p>
        )}
      </div>
    </div>
  );
}
