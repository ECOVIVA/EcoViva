import React, { useRef } from 'react';

interface ImageUploaderProps {
  label: string;
  previewUrl: string;
  onImageSelect: (file: File, previewUrl: string) => void;
  imageStyle?: string;
  inputId: string;
}

export const ImageUploader: React.FC<ImageUploaderProps> = ({
  label,
  previewUrl,
  onImageSelect,
  imageStyle,
  inputId,
}) => {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const preview = URL.createObjectURL(file);
    onImageSelect(file, preview);
  };

  return (
    <>
      <input
        id={inputId}
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        className="hidden"
        ref={inputRef}
      />
      <div onClick={() => inputRef.current?.click()} className="cursor-pointer">
        <img src={previewUrl} alt={label} className={imageStyle} />
      </div>
    </>
  );
};
