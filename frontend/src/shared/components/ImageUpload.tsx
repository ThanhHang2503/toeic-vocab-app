import React, { forwardRef, useState, useRef } from 'react';
import { UploadCloud, X } from 'lucide-react';

interface ImageUploadProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  defaultPreview?: string | null;
}

export const ImageUpload = forwardRef<HTMLInputElement, ImageUploadProps>(
  ({ label = 'Ảnh minh họa (Không bắt buộc)', defaultPreview = null, onChange, ...props }, ref) => {
    const [preview, setPreview] = useState<string | null>(defaultPreview);
    const [isDragging, setIsDragging] = useState(false);
    
    const inputRef = useRef<HTMLInputElement | null>(null);

    const handleFile = (file: File) => {
      if (file && file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onloadend = () => {
          setPreview(reader.result as string);
        };
        reader.readAsDataURL(file);
      }
    };

    const handleDragOver = (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragging(true);
    };

    const handleDragLeave = (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragging(false);
    };

    const handleDrop = (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragging(false);
      
      const file = e.dataTransfer.files?.[0];
      if (file) {
        handleFile(file);
        
        if (inputRef.current) {
          const dataTransfer = new DataTransfer();
          dataTransfer.items.add(file);
          inputRef.current.files = dataTransfer.files;
          
          if (onChange) {
            onChange({
              target: inputRef.current,
              type: 'change'
            } as any);
          }
        }
      }
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) {
        handleFile(file);
      } else {
        setPreview(null);
      }
      if (onChange) {
        onChange(e);
      }
    };

    const handleRemove = (e: React.MouseEvent) => {
      e.preventDefault();
      e.stopPropagation();
      setPreview(null);
      if (inputRef.current) {
        inputRef.current.value = '';
        if (onChange) {
          onChange({
            target: inputRef.current,
            type: 'change'
          } as any);
        }
      }
    };

    // Update internal preview if default preview changes (useful when opening modal for edit)
    React.useEffect(() => {
      setPreview(defaultPreview);
    }, [defaultPreview]);

    return (
      <div className="space-y-2">
        {label && <label className="text-sm font-medium text-gray-700">{label}</label>}
        <div 
          className={`relative border-2 border-dashed rounded-xl p-6 transition-all duration-200 ease-in-out cursor-pointer flex flex-col items-center justify-center min-h-[160px]
            ${isDragging ? 'border-primary bg-primary/5' : 'border-gray-300 hover:border-primary/50 bg-gray-50 hover:bg-gray-50/80'}
            ${preview ? 'p-2' : ''}
          `}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={() => inputRef.current?.click()}
        >
          <input 
            type="file" 
            className="hidden" 
            accept="image/*"
            ref={(e) => {
              inputRef.current = e;
              if (typeof ref === 'function') {
                ref(e);
              } else if (ref) {
                ref.current = e;
              }
            }}
            onChange={handleInputChange}
            {...props} 
          />
          
          {preview ? (
            <div className="relative w-full h-40 group">
              <img src={preview} alt="Preview" className="w-full h-full object-contain rounded-lg" />
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center">
                <button 
                  type="button"
                  onClick={handleRemove}
                  className="p-2 bg-danger text-white rounded-full hover:bg-danger/90 transform hover:scale-110 transition-all shadow-lg"
                  title="Xóa ảnh"
                >
                  <X size={20} />
                </button>
              </div>
            </div>
          ) : (
            <>
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-3 text-primary">
                <UploadCloud size={24} />
              </div>
              <p className="text-sm font-medium text-gray-700 text-center">
                Kéo thả ảnh vào đây, hoặc <span className="text-primary hover:underline">duyệt qua tệp</span>
              </p>
              <p className="text-xs text-gray-400 mt-2 text-center">
                Hỗ trợ PNG, JPG, GIF (Tối đa 5MB)
              </p>
            </>
          )}
        </div>
      </div>
    );
  }
);
ImageUpload.displayName = 'ImageUpload';
