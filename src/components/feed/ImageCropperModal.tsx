"use client";
import { useState, useCallback } from "react";
import Cropper from "react-easy-crop";
import { X, Check } from "lucide-react";
import getCroppedImg from "@/lib/cropImage";

interface ImageCropperModalProps {
  imageSrc: string;
  aspectRatio: number;
  onCancel: () => void;
  onCropSave: (croppedBlob: Blob) => Promise<void>;
}

export default function ImageCropperModal({ imageSrc, aspectRatio, onCancel, onCropSave }: ImageCropperModalProps) {
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);
  const [saving, setSaving] = useState(false);

  const onCropComplete = useCallback((croppedArea: any, croppedAreaPixels: any) => {
    setCroppedAreaPixels(croppedAreaPixels);
  }, []);

  const handleSave = async () => {
    if (!croppedAreaPixels) return;
    setSaving(true);
    try {
      const croppedBlob = await getCroppedImg(imageSrc, croppedAreaPixels);
      await onCropSave(croppedBlob);
    } catch (e) {
      console.error(e);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
      <div className="w-full max-w-lg rounded-2xl flex flex-col overflow-hidden" style={{ backgroundColor: "#16181c", border: "1px solid #2f3336" }}>
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3" style={{ borderBottom: "1px solid #2f3336" }}>
          <div className="flex items-center gap-4">
            <button
              onClick={onCancel}
              className="p-2 -ml-2 rounded-full hover:bg-white/10 transition-colors"
              disabled={saving}
            >
              <X className="w-5 h-5 text-white" />
            </button>
            <h2 className="text-xl font-bold" style={{ color: "#e7e9ea" }}>Edit media</h2>
          </div>
          <button
            onClick={handleSave}
            disabled={saving}
            className="px-4 py-1.5 rounded-full font-bold text-sm bg-white text-black hover:bg-zinc-200 transition-colors disabled:opacity-50 flex items-center gap-2"
          >
            {saving ? "Saving..." : "Apply"}
          </button>
        </div>

        {/* Cropper Container */}
        <div className="relative w-full h-[60vh] bg-black">
          <Cropper
            image={imageSrc}
            crop={crop}
            zoom={zoom}
            aspect={aspectRatio}
            cropShape={aspectRatio === 1 ? "round" : "rect"}
            onCropChange={setCrop}
            onCropComplete={onCropComplete}
            onZoomChange={setZoom}
            showGrid={false}
          />
        </div>

        {/* Zoom Controls */}
        <div className="px-6 py-4 flex items-center gap-4">
          <span className="text-xs text-zinc-400">Zoom</span>
          <input
            type="range"
            value={zoom}
            min={1}
            max={3}
            step={0.1}
            aria-labelledby="Zoom"
            onChange={(e) => {
              setZoom(Number(e.target.value));
            }}
            className="flex-1 h-1 bg-zinc-700 rounded-lg appearance-none cursor-pointer"
          />
        </div>
      </div>
    </div>
  );
}
