'use client';

interface IProps {
  width?: number;
  height?: number;
}

const UserProfileImage = ({ width = 80, height = 80 }: IProps) => {
  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 80 80"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <rect
        x="0.75"
        y="0.75"
        width="78.5"
        height="78.5"
        rx="39.25"
        fill="white"
        stroke="black"
        stroke-width="1.5"
      />
      <path
        d="M55.9508 60.5079V55.9506C55.9508 53.5332 54.9906 51.2149 53.2812 49.5056C51.5719 47.7962 49.2536 46.8359 46.8362 46.8359H33.1642C30.7469 46.8359 28.4285 47.7962 26.7192 49.5056C25.0099 51.2149 24.0496 53.5332 24.0496 55.9506V60.5079"
        stroke="black"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
      <path
        d="M40.0002 37.7212C45.0341 37.7212 49.1149 33.6405 49.1149 28.6066C49.1149 23.5727 45.0341 19.4919 40.0002 19.4919C34.9663 19.4919 30.8856 23.5727 30.8856 28.6066C30.8856 33.6405 34.9663 37.7212 40.0002 37.7212Z"
        stroke="black"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
    </svg>
  );
};

export default UserProfileImage;
