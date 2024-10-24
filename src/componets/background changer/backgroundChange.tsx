import React, { ChangeEvent } from "react";

interface BackgroundChangerProps {
  setBackground: (url: string) => void;
}

const BackgroundChanger: React.FC<BackgroundChangerProps> = ({
  setBackground,
}) => {
  const handleUrlChange = (event: ChangeEvent<HTMLInputElement>) => {
    const url = event.target.value;
    if (url) {
      try {
        new URL(url);
        setBackground(url);
      } catch {
        console.log("Invalid URL");
      }
    }
  };

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const fileUrl = URL.createObjectURL(file);
      setBackground(fileUrl);
      // Clean up the object URL when no longer needed
      return () => URL.revokeObjectURL(fileUrl);
    }
  };

  return (
    <div className="bg-white p-4 rounded-lg space-y-4 mb-0 ">
      <div>
        <input
          type="text"
          onChange={handleUrlChange}
          placeholder="Enter image URL"
          className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>
      <div className="relative">
        <label className="block">
          <span className="sr-only">Choose background image</span>
          <div className="relative">
            <input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="block w-full text-sm text-slate-500
                file:mr-4 file:py-2 file:px-4
                file:rounded-md file:border-0
                file:text-sm file:font-semibold
                file:bg-blue-50 file:text-blue-700
                hover:file:bg-blue-100
                cursor-pointer
                [&::file-selector-button]:mr-10"
            />
          </div>
        </label>
      </div>
    </div>
  );
};

export default BackgroundChanger;
