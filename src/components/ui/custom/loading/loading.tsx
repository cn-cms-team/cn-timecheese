'use client';
import '@/styles/loading.css';

import { useLoading } from '@/components/context/app-context';

const Loading = () => {
  const { isLoading } = useLoading();
  if (!isLoading) return <></>;
  return (
    <div className="fixed top-0 left-0 w-full h-full flex items-center justify-center bg-[#ffffff24] backdrop-blur-sm z-999">
      <div className="loader-container">
        <svg className="mouse-shadow-group" width="40" height="10">
          <ellipse className="shadow" cx="20" cy="5" rx="18" ry="5" />
        </svg>

        <svg className="cheese-shadow">
          <ellipse className="shadow" cx="15" cy="5" rx="15" ry="5" />
        </svg>

        <svg className="cheese-group" viewBox="0 0 50 50">
          <g className="cheese-body">
            <path d="M5,45 L25,10 L45,45 Z" fill="#FFD700" />
            <circle cx="20" cy="35" r="3" fill="#E6C200" />
            <circle cx="30" cy="30" r="2.5" fill="#E6C200" />
            <circle cx="25" cy="40" r="2" fill="#E6C200" />
          </g>
          <g transform="translate(25, 30)">
            {' '}
            <circle className="crumb c1" r="2" cx="0" cy="0" />
            <circle className="crumb c2" r="1.5" cx="0" cy="0" />
            <circle className="crumb c3" r="2" cx="0" cy="0" />
          </g>
        </svg>

        <div className="mouse-wrapper">
          <svg className="mouse-character" viewBox="0 0 60 40">
            <path className="mouse-tail" d="M5,15 Q-5,15 -5,5" />
            <circle className="mouse-ear" cx="35" cy="5" r="5" />
            <circle className="mouse-ear" cx="15" cy="5" r="5" />
            <ellipse className="mouse-body" cx="25" cy="15" rx="20" ry="12" />
            <circle className="mouse-eye" cx="40" cy="12" r="1.5" />
          </svg>
        </div>
      </div>
    </div>
  );
};

export default Loading;
