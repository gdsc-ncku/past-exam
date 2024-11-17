'use client';

import './card.css';
import { useState } from 'react';
import { dummyFiles } from '@/lib/DummyData/dummyData';
import { formatDate } from '@/lib/utils';
import { downloadFile } from '@/lib/utils';

export const ExamCard = () => {
  // 定義檔案的型別
  type FileType = {
    filename: string;
    uploader: string;
    uploadedTime: Date;
    downloads: number;
    fileLocation: string;
  };

  const [currentIndex, setCurrentIndex] = useState(-1); // -1 表示顯示完整列表

  const handleNext = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex < dummyFiles.length - 1 ? prevIndex + 1 : 0,
    );
  };

  const handlePrevious = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex > 0 ? prevIndex - 1 : dummyFiles.length - 1,
    );
  };

  const toggleList = () => {
    setCurrentIndex((prevIndex) => (prevIndex === -1 ? 0 : -1));
  };

  // 將檔案資訊顯示邏輯提取成獨立的 FileInfo 子組件
  const FileInfo = ({
    file,
    showDetails = false,
  }: {
    file: FileType;
    showDetails?: boolean;
  }) => (
    <div className="mb-4">
      <p>Filename: {file.filename}</p>
      <p>Uploader: {file.uploader}</p>
      <p>Uploaded Time: {formatDate(file.uploadedTime)}</p>
      {showDetails && <p>Downloads: {file.downloads}</p>}
      <button
        className="button-secondary"
        onClick={() => downloadFile(file.fileLocation, file.filename)}
      >
        Download
      </button>
    </div>
  );

  return (
    <div className="card rounded-lg bg-white p-6 shadow-md">
      <h1 className="text-lg font-medium text-gray-800">Past Exam Files</h1>
      {/* 切換按鈕 */}
      <button className="toggle" onClick={toggleList}>
        {currentIndex === -1 ? 'Show Individual File' : 'Show All Files'}
      </button>
      {/* 檔案列表 */}
      {currentIndex === -1 ? (
        <ul className="text-black">
          {dummyFiles.map((file) => (
            <li className="card" key={file.filename}>
              <FileInfo file={file} />
            </li>
          ))}
        </ul>
      ) : (
        <ul>
          <li key={dummyFiles[currentIndex].filename} className="text-black">
            <FileInfo file={dummyFiles[currentIndex]} showDetails />
            <div className="mt-4 flex justify-between">
              <button onClick={handlePrevious} className="button-switch">
                Previous
              </button>
              <button onClick={handleNext} className="button-switch">
                Next
              </button>
            </div>
          </li>
        </ul>
      )}
    </div>
  );
};
