import React from "react";
import classes from "./FolderPlaceholder.module.css";

export const FolderPlaceholder = () => {
  const iconSize = "400px";
  const color = "#81a1c1";

  return (
    <div className={classes.folderPlaceholder}>
      <div className={classes.folderIconContainer}>
        <svg
          className={classes.folderIcon}
          width={iconSize}
          height={iconSize}
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Основная часть папки */}
          <path
            d="M10 4H4C2.89543 4 2 4.89543 2 6V18C2 19.1046 2.89543 20 4 20H20C21.1046 20 22 19.1046 22 18V8C22 6.89543 21.1046 6 20 6H12L10 4Z"
            fill={color}
            stroke="#333"
            strokeWidth="1.5"
          />

          {/* Складки на папке для реалистичности */}
          <path
            d="M10 4L12 6H20C20.5523 6 21 6.44772 21 7V7.5C21 8.05228 20.5523 8.5 20 8.5H4C3.44772 8.5 3 8.05228 3 7.5V6C3 5.44772 3.44772 5 4 5H9.17157C9.70201 5 10.2107 5.21071 10.5858 5.58579L10 4Z"
            fill={color}
            fillOpacity="0.8"
          />

          {/* Декор - линии на папке */}
          <rect
            x="6"
            y="10"
            width="12"
            height="1"
            rx="0.5"
            fill="#333"
            fillOpacity="0.3"
          />
          <rect
            x="6"
            y="13"
            width="8"
            height="1"
            rx="0.5"
            fill="#333"
            fillOpacity="0.3"
          />
          <rect
            x="6"
            y="16"
            width="10"
            height="1"
            rx="0.5"
            fill="#333"
            fillOpacity="0.3"
          />
        </svg>
      </div>
    </div>
  );
};
