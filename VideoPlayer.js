// components/VideoPlayer.js
import React from 'react';

export default function VideoPlayer({ lectureTitle, resolutions }) {
  // هنا يجب دمج مشغل فيديو فعلي (مثل video.js أو <video>)
  // لكن لأغراض البناء، نستخدم مكانًا بسيطًا
  return (
    <div className="bg-black aspect-video rounded-xl overflow-hidden shadow-2xl">
      <div className="h-full flex flex-col justify-center items-center p-4">
        <h4 className="text-white text-lg mb-4">{lectureTitle}</h4>
        <div className="w-full bg-gray-700 h-64 flex justify-center items-center">
           <p className="text-white/70">مشغل الفيديو (يجب دمجه هنا)</p>
        </div>
        <div className="mt-3">
          <span className="text-sm text-white mr-2">الدقة:</span>
          {resolutions.map((res, index) => (
            <button key={index} className="text-xs text-white bg-gray-600 hover:bg-gray-500 px-3 py-1 rounded-full mr-1">
              {res.quality}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
