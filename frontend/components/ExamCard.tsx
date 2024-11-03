'use client';

import '../styles/card.css';
import { useState } from 'react';
import { dummyFiles } from '../lib/DummyData/dummyData';

export const ExamCard = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFirstList, setIsFirstList] = useState(true);
  const [list_name, setlist_name] = useState('Show Individual File');

  const handleNext = () => {
    if (currentIndex < dummyFiles.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      setCurrentIndex(0);
    }
    console.log(currentIndex);
  };

  const handlePrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    } else {
      setCurrentIndex(dummyFiles.length - 1);
    }
    console.log(currentIndex);
  };

  const toggleList = () => {
    setIsFirstList(!isFirstList);
    if (isFirstList) {
      setlist_name('Show All Files');
    } else {
      setlist_name('Show Individual File');
    }
  };

  const Download = (fileUrl: string, fileName: string) => {
    console.log('Download');
    const link = document.createElement('a');
    link.href = fileUrl;
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const file = dummyFiles[currentIndex];

  return (
    <div className="card rounded-lg bg-white p-6 shadow-md">
      <h1 className="text-lg font-medium text-gray-800">Past Exam Files</h1>
      {/* 切換按鈕 */}
      <button
        onClick={toggleList}
        className="mt-4 rounded bg-gray-500 px-4 py-2 text-white hover:bg-gray-700"
      >
        {list_name}
      </button>
      {!isFirstList && (
        <ul>
          {
            <li key={file.filename} className="text-black">
              <h3>Filename: {file.filename}</h3>
              <p>Uploader: {file.uploader}</p>
              <p>
                Uploaded Time:{'  '}
                {file.uploadedTime.toLocaleString('zh-TW', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                  weekday: 'long',
                  hour: '2-digit',
                  minute: '2-digit',
                })}
              </p>
              <p>Downloads: {file.downloads}</p>
              <button
                className="rounded bg-blue-500 px-4 py-2 font-bold text-white hover:bg-blue-700"
                onClick={() => Download(file.fileLocation, file.filename)}
              >
                Download
              </button>
              <div className="mt-4 flex justify-between">
                <button
                  onClick={handlePrevious}
                  className="rounded bg-gray-500 px-4 py-2 text-white hover:bg-gray-700"
                >
                  Previous
                </button>
                <button
                  onClick={handleNext}
                  className="rounded bg-gray-500 px-4 py-2 text-white hover:bg-gray-700"
                >
                  Next
                </button>
              </div>
            </li>
          }
        </ul>
      )}
      {isFirstList && (
        <ul className="text-black">
          {dummyFiles.map((file) => (
            <li className="card" key={file.filename}>
              <p>File： {file.filename}</p>
              <p>
                Uploaded Time:{'  '}
                {file.uploadedTime.toLocaleString('zh-TW', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                  weekday: 'long',
                  hour: '2-digit',
                  minute: '2-digit',
                })}
              </p>
              <p>uploader： {file.uploader}</p>
              <button
                className="rounded bg-blue-500 px-4 py-2 font-bold text-white hover:bg-blue-700"
                onClick={() => Download(file.fileLocation, file.filename)}
              >
                Download
              </button>
              <br />
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

// What you need to do:
// 1. Show the file's properties (name, size, type and other properties listed in dummyData.ts)
// 2. add a button to download the file
// 3. Map multiple files to the exam card using the data from dummyData.ts
// 4. Style the exam card whatever you want with tailwind
