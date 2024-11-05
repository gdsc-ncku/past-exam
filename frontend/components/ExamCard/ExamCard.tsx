'use client';

import './card.css';
import { useState } from 'react';
import { dummyFiles } from '../../lib/DummyData/dummyData';

export const ExamCard = () => {
  // 定義檔案的型別
  type FileType = {
    filename: string;
    uploader: string;
    uploadedTime: Date;
    downloads: number;
    fileLocation: string;
  };

  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFirstList, setIsFirstList] = useState(true);
  const [listName, setListName] = useState('Show Individual File');

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
    setIsFirstList((prevState) => !prevState);
    setListName(isFirstList ? 'Show All Files' : 'Show Individual File');
  };

  const downloadFile = (fileUrl: string, fileName: string) => {
    const link = document.createElement('a');
    link.href = fileUrl;
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const formatDate = (date: Date) => {
    return date.toLocaleString('zh-TW', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      weekday: 'long',
      hour: '2-digit',
      minute: '2-digit',
    });
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

  const file = dummyFiles[currentIndex];

  return (
    <div className="card rounded-lg bg-white p-6 shadow-md">
      <h1 className="text-lg font-medium text-gray-800">Past Exam Files</h1>
      {/* 切換按鈕 */}
      <button className="toggle" onClick={toggleList}>
        {listName}
      </button>
      {/* 檔案列表 */}
      {!isFirstList && (
        <ul>
          <li key={file.filename} className="text-black">
            <FileInfo file={file} showDetails />
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
      {isFirstList && (
        <ul className="text-black">
          {dummyFiles.map((file) => (
            <li className="card" key={file.filename}>
              <FileInfo file={file} />
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};
