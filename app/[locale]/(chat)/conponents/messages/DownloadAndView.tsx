import { UseImageActions } from '@/hooks/imageAction';
import React from 'react'
import { IoIosExpand } from 'react-icons/io';
import { IoCloudDownloadOutline } from 'react-icons/io5';

const DownloadAndView = ({ url }: { url: any }) => {
  const { handleDownload, handlePreviewToggle } = UseImageActions();
    
  return (
    <>
      {" "}
      <div className="z-20 absolute bg-gray-800 rounded p-2 -bottom-2 right-2 flex flex-row gap-2 ">
        <a onClick={() => handleDownload(url)} className="">
          <IoCloudDownloadOutline className="text-[8px] text-blue-500 md:text-[10px] cursor-pointer" />
        </a>
        <a onClick={() => handlePreviewToggle(url)}>
          <IoIosExpand className="text-[8px]  md:text-[10px cursor-pointer" />
        </a>
      </div>
    </>
  );
};

export default DownloadAndView