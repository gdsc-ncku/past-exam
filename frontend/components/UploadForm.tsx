'use client';
import { iconsMap } from '@/ui/iconsMap';
import React from 'react';
export default function UploadForm() {
  const FolderClosedIcon = iconsMap['folder-closed'];
  return (
    <form className="">
      <div className=" flex flex-col gap-[20px] bg-white">
        <div className="flex h-10 items-center ">
          <FolderClosedIcon className="size-10" />
          <h1 className="text-3xl font-bold text-black">上傳項目</h1>
        </div>
        <div className="flex gap-7">
          <div className="flex gap-4">
            <label htmlFor="year">年分</label>
            <input type="number" name="year" className="w-20 rounded-md" />
          </div>
          <div className="flex items-center gap-2 self-center">
            <input
              type="radio"
              name="semester"
              id="firstSemester"
              value="firstSemester"
            />
            <label htmlFor="firstSemester" className="option">
              上學期
            </label>
          </div>
          <div className="flex items-center gap-2 self-center">
            <input
              type="radio"
              name="semester"
              id="secondSemester"
              value="secondSemester"
            />
            <label htmlFor="secondSemester" className="option">
              下學期
            </label>
          </div>
        </div>
        <div className="flex gap-4">
          <label htmlFor="courseName">課程名稱</label>
          <input
            type="text"
            name="courseName"
            placeholder="快速搜尋"
            className="rounded-md"
          />
        </div>
        <div className="flex gap-4">
          <label htmlFor="courseCode">課程代碼</label>
          <input type="text" name="courseCode" className="rounded-md" />
        </div>
        <div className="flex gap-4">
          <label htmlFor="courseInstructor">教課教師</label>
          <input type="text" name="courseInstructor" className="rounded-md" />
        </div>
        <div className="flex gap-4">
          <label htmlFor="examType">考試類型</label>
          <div className="flex items-center gap-2 self-center">
            <input
              type="radio"
              name="examType"
              id="midtermExam"
              value="midtermExam"
            />
            <label htmlFor="midtermExam" className="option">
              期中考
            </label>
          </div>
          <div className="flex items-center gap-2 self-center">
            <input
              type="radio"
              name="examType"
              id="termExam"
              value="termExam"
            />
            <label htmlFor="termExam" className="option">
              期末考
            </label>
          </div>
          <div className="flex items-center gap-2 self-center">
            <input
              type="radio"
              name="examType"
              id="quizExam"
              value="quizExam"
            />
            <label htmlFor="quizExam" className="option">
              小考
            </label>
          </div>
          <div className="flex items-center gap-2 self-center">
            <input type="radio" name="examType" id="other" value="other" />
            <label htmlFor="other" className="option">
              其他
            </label>
          </div>
        </div>
        <div className="flex gap-4">
          <label htmlFor="examRange">試題範圍</label>
          <input
            type="text"
            name="examRange"
            placeholder="(選填)"
            className="rounded-md"
          />
        </div>
        <div className="flex gap-4">
          <label htmlFor="isAnonymous">是否匿名</label>
          <div className="flex gap-7">
            <div className="flex items-center gap-2 self-center">
              <input
                type="radio"
                name="isAnonymous"
                id="anonymous"
                value="anonymous"
              />
              <label htmlFor="anonymous" className="option">
                是，匿名貢獻
              </label>
            </div>
            <div className="flex items-center gap-2 self-center">
              <input
                type="radio"
                name="isAnonymous"
                id="noAnonymous"
                value="noAnonymous"
              />
              <label htmlFor="noAnonymous" className="option">
                否，具名貢獻
              </label>
            </div>
          </div>
        </div>
      </div>
    </form>
  );
}
