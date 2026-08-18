import { useState, useCallback } from "react";
import Cropper, { type Area } from "react-easy-crop";
import getCroppedImg from "@/lib/cropImage";

interface ImageCropperModalProps {
  imageSrc: string;
  onCropCompleteAction: (croppedFile: File) => void;
  onCancel: () => void;
  aspectRatio?: number;
}

export function ImageCropperModal({ imageSrc, onCropCompleteAction, onCancel, aspectRatio = 21 / 9 }: ImageCropperModalProps) {
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const onCropComplete = useCallback((_croppedArea: Area, croppedAreaPixels: Area) => {
    setCroppedAreaPixels(croppedAreaPixels);
  }, []);

  const handleApply = async () => {
    if (!croppedAreaPixels) return;
    setIsProcessing(true);
    try {
      const croppedFile = await getCroppedImg(imageSrc, croppedAreaPixels, 0);
      if (croppedFile) {
        onCropCompleteAction(croppedFile);
      }
    } catch (e) {
      console.error(e);
      alert("Failed to crop image.");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div style={{
      position: "fixed", top: 0, left: 0, right: 0, bottom: 0,
      background: "rgba(0,0,0,0.8)", zIndex: 9999,
      display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center"
    }}>
      <div style={{
        background: "var(--studio-surface)", width: "90%", maxWidth: 800,
        height: "80vh", borderRadius: "var(--studio-r-lg)",
        display: "flex", flexDirection: "column", overflow: "hidden"
      }}>
        {/* Header */}
        <div style={{ padding: "16px 24px", borderBottom: "1px solid var(--studio-border)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <h3 style={{ margin: 0, color: "var(--studio-text-1)", fontSize: "1.25rem", fontWeight: 600 }}>Adjust Image</h3>
          <button onClick={onCancel} style={{ background: "none", border: "none", color: "var(--studio-text-2)", cursor: "pointer", fontSize: "1.5rem" }}>&times;</button>
        </div>

        {/* Cropper Area */}
        <div style={{ position: "relative", flex: 1, background: "#111" }}>
          <Cropper
            image={imageSrc}
            crop={crop}
            zoom={zoom}
            aspect={aspectRatio}
            onCropChange={setCrop}
            onCropComplete={onCropComplete}
            onZoomChange={setZoom}
          />
        </div>

        {/* Controls */}
        <div style={{ padding: "24px", borderTop: "1px solid var(--studio-border)", display: "flex", alignItems: "center", gap: 24 }}>
          <div style={{ flex: 1, display: "flex", alignItems: "center", gap: 12 }}>
            <span style={{ fontSize: "0.875rem", color: "var(--studio-text-2)" }}>Zoom</span>
            <input
              type="range"
              value={zoom}
              min={1}
              max={3}
              step={0.1}
              aria-labelledby="Zoom"
              onChange={(e) => setZoom(Number(e.target.value))}
              style={{ flex: 1 }}
            />
          </div>

          <div style={{ display: "flex", gap: 12 }}>
            <button onClick={onCancel} disabled={isProcessing} className="cms-btn cms-btn-ghost">
              Cancel
            </button>
            <button onClick={handleApply} disabled={isProcessing} className="cms-btn cms-btn-primary">
              {isProcessing ? "Processing..." : "Apply & Upload"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
