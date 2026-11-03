import React, { useState, useRef, useEffect, useCallback } from 'react';
import {
  X,
  ZoomIn,
  ZoomOut,
  Check,
  Move,
  RotateCcw,
  Maximize2,
  Minimize2,
  User,
  Sliders,
} from 'lucide-react';

interface ImageCropperModalProps {
  isOpen: boolean;
  imageSrc: string;
  defaultAspectRatio?: number; // e.g. 16/10 or 16/9
  title: string;
  onCropComplete: (croppedDataUrl: string) => void;
  onClose: () => void;
}

type AspectRatioOption = {
  id: string;
  label: string;
  value: number; // width / height
};

const ASPECT_OPTIONS: AspectRatioOption[] = [
  { id: '16-10', label: '16:10 Wide', value: 16 / 10 },
  { id: '16-9', label: '16:9 Cinema', value: 16 / 9 },
  { id: '4-3', label: '4:3 Standard', value: 4 / 3 },
  { id: '3-4', label: '3:4 Portrait', value: 3 / 4 },
  { id: '1-1', label: '1:1 Square', value: 1 },
];

export const ImageCropperModal: React.FC<ImageCropperModalProps> = ({
  isOpen,
  imageSrc,
  defaultAspectRatio = 16 / 10,
  title,
  onCropComplete,
  onClose,
}) => {
  const [selectedRatio, setSelectedRatio] = useState<number>(defaultAspectRatio);
  const [scale, setScale] = useState(1);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [naturalSize, setNaturalSize] = useState({ width: 0, height: 0 });
  const [bgColor, setBgColor] = useState<'#111111' | '#F7F7F4' | '#000000'>('#111111');

  const containerRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);

  // When imageSrc changes, compute natural dimensions and reset
  useEffect(() => {
    if (!imageSrc) return;
    const img = new Image();
    img.src = imageSrc;
    img.onload = () => {
      setNaturalSize({ width: img.naturalWidth, height: img.naturalHeight });

      // Automatically determine best initial framing so head & shoulders are not cut off
      const imgAspect = img.naturalWidth / img.naturalHeight;
      const targetAspect = selectedRatio;

      if (imgAspect < targetAspect) {
        // Portrait or taller image placed into landscape frame:
        // Default to "Focus Head & Top" so the head is never chopped off
        const fitScale = 1;
        setScale(fitScale);
        setPosition({ x: 0, y: 0 });
      } else {
        setScale(1);
        setPosition({ x: 0, y: 0 });
      }
    };
  }, [imageSrc, selectedRatio]);

  // Quick Preset: Fit Entire Image (Zero cropping - full head, shoulders, edges)
  const fitEntireImage = () => {
    if (!containerRef.current || naturalSize.width === 0) return;
    const cw = containerRef.current.clientWidth;
    const ch = containerRef.current.clientHeight;
    const imgAspect = naturalSize.width / naturalSize.height;
    const boxAspect = cw / ch;

    // Scale so both dimensions fit completely inside container
    if (imgAspect > boxAspect) {
      // Image is wider than container: width matches container
      setScale(1);
    } else {
      // Image is taller than container: scale down so entire height fits
      const ratio = imgAspect / boxAspect;
      setScale(Math.max(0.3, ratio));
    }
    setPosition({ x: 0, y: 0 });
  };

  // Quick Preset: Focus Head & Shoulders (Fills frame width, aligns image top so head is in frame)
  const focusHeadAndShoulders = () => {
    if (!containerRef.current || naturalSize.width === 0) return;
    const cw = containerRef.current.clientWidth;
    const ch = containerRef.current.clientHeight;
    const imgAspect = naturalSize.width / naturalSize.height;
    const boxAspect = cw / ch;

    if (imgAspect < boxAspect) {
      // Taller portrait image:
      // Fill width (scale = 1). Base height will be cw / imgAspect.
      // Top of image should touch top of box, so position.y is positioned at top
      setScale(1.1);
      const renderedH = (cw / naturalSize.width) * naturalSize.height * 1.1;
      const topY = (renderedH - ch) / 2;
      // Position slightly down so top has slight breathing room
      setPosition({ x: 0, y: Math.max(0, topY * 0.75) });
    } else {
      setScale(1.15);
      setPosition({ x: 0, y: 0 });
    }
  };

  // Quick Preset: Fill & Center
  const fillFrame = () => {
    if (!containerRef.current || naturalSize.width === 0) return;
    const cw = containerRef.current.clientWidth;
    const ch = containerRef.current.clientHeight;
    const imgAspect = naturalSize.width / naturalSize.height;
    const boxAspect = cw / ch;

    if (imgAspect < boxAspect) {
      setScale(boxAspect / imgAspect);
    } else {
      setScale(1.1);
    }
    setPosition({ x: 0, y: 0 });
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsDragging(true);
    setDragStart({
      x: e.clientX - position.x,
      y: e.clientY - position.y,
    });
  };

  const handleMouseMove = useCallback(
    (e: MouseEvent) => {
      if (!isDragging) return;
      setPosition({
        x: e.clientX - dragStart.x,
        y: e.clientY - dragStart.y,
      });
    },
    [isDragging, dragStart]
  );

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
  }, []);

  const handleTouchStart = (e: React.TouchEvent) => {
    if (e.touches.length === 1) {
      const touch = e.touches[0];
      setIsDragging(true);
      setDragStart({
        x: touch.clientX - position.x,
        y: touch.clientY - position.y,
      });
    }
  };

  const handleTouchMove = useCallback(
    (e: TouchEvent) => {
      if (!isDragging || e.touches.length !== 1) return;
      const touch = e.touches[0];
      setPosition({
        x: touch.clientX - dragStart.x,
        y: touch.clientY - dragStart.y,
      });
    },
    [isDragging, dragStart]
  );

  const handleTouchEnd = useCallback(() => {
    setIsDragging(false);
  }, []);

  useEffect(() => {
    if (isDragging) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
      window.addEventListener('touchmove', handleTouchMove);
      window.addEventListener('touchend', handleTouchEnd);
    }
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
      window.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('touchend', handleTouchEnd);
    };
  }, [isDragging, handleMouseMove, handleMouseUp, handleTouchMove, handleTouchEnd]);

  // Export high resolution crop from canvas
  const handleSaveCrop = () => {
    if (!containerRef.current || !imageRef.current || naturalSize.width === 0) return;

    const container = containerRef.current;
    const containerRect = container.getBoundingClientRect();

    const outputWidth = 1920;
    const outputHeight = Math.round(outputWidth / selectedRatio);

    const canvas = document.createElement('canvas');
    canvas.width = outputWidth;
    canvas.height = outputHeight;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Draw chosen background
    ctx.fillStyle = bgColor;
    ctx.fillRect(0, 0, outputWidth, outputHeight);

    const scaleToCanvas = outputWidth / containerRect.width;
    const img = imageRef.current;
    const imgRect = img.getBoundingClientRect();

    const relativeX = (imgRect.left - containerRect.left) * scaleToCanvas;
    const relativeY = (imgRect.top - containerRect.top) * scaleToCanvas;
    const renderedWidth = imgRect.width * scaleToCanvas;
    const renderedHeight = imgRect.height * scaleToCanvas;

    ctx.drawImage(img, relativeX, relativeY, renderedWidth, renderedHeight);

    const croppedUrl = canvas.toDataURL('image/jpeg', 0.94);
    onCropComplete(croppedUrl);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="bg-[#141414] border border-[#2E2E2E] rounded-3xl w-full max-w-2xl overflow-hidden shadow-2xl flex flex-col text-white max-h-[92vh]">
        {/* Modal Header */}
        <div className="px-5 py-3.5 border-b border-[#252525] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sliders className="w-4 h-4 text-[#CCCCCC]" />
            <div>
              <h3 className="text-sm sm:text-base font-medium text-white">{title}</h3>
              <p className="text-[11px] text-[#888888]">
                Position full head &amp; shoulders or zoom out to show the complete photo
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-[#252525] text-[#888888] hover:text-white transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Framing & Quick Presets Toolbar */}
        <div className="px-5 py-2.5 bg-[#181818] border-b border-[#252525] flex flex-wrap items-center justify-between gap-2 text-xs">
          {/* Quick Framing Presets */}
          <div className="flex items-center gap-1.5 flex-wrap">
            <span className="text-[11px] text-[#777777] font-medium mr-1">Presets:</span>

            <button
              type="button"
              onClick={focusHeadAndShoulders}
              className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-white/10 hover:bg-white/20 text-white text-[11px] font-medium transition-colors cursor-pointer"
              title="Align photo so head and shoulders are never cut off"
            >
              <User className="w-3 h-3 text-[#E0E0E0]" />
              <span>Head &amp; Shoulders</span>
            </button>

            <button
              type="button"
              onClick={fitEntireImage}
              className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-white/10 hover:bg-white/20 text-white text-[11px] font-medium transition-colors cursor-pointer"
              title="Show entire uncropped photo"
            >
              <Minimize2 className="w-3 h-3 text-[#E0E0E0]" />
              <span>Fit Full Photo</span>
            </button>

            <button
              type="button"
              onClick={fillFrame}
              className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-white/10 hover:bg-white/20 text-white text-[11px] font-medium transition-colors cursor-pointer"
              title="Fill entire crop box"
            >
              <Maximize2 className="w-3 h-3 text-[#E0E0E0]" />
              <span>Fill Frame</span>
            </button>
          </div>

          {/* Aspect Ratio Switcher */}
          <div className="flex items-center gap-1">
            <span className="text-[11px] text-[#777777] font-medium mr-1">Frame:</span>
            {ASPECT_OPTIONS.map((opt) => (
              <button
                key={opt.id}
                type="button"
                onClick={() => setSelectedRatio(opt.value)}
                className={`px-2 py-0.5 rounded text-[11px] font-medium transition-colors cursor-pointer ${
                  Math.abs(selectedRatio - opt.value) < 0.05
                    ? 'bg-white text-black font-semibold'
                    : 'text-[#888888] hover:text-white bg-[#222222]'
                }`}
              >
                {opt.id}
              </button>
            ))}
          </div>
        </div>

        {/* Viewport / Crop Box */}
        <div className="p-4 sm:p-6 flex flex-col items-center justify-center bg-[#0A0A0A] overflow-hidden select-none">
          <div
            ref={containerRef}
            style={{
              aspectRatio: `${selectedRatio}`,
              backgroundColor: bgColor,
            }}
            className="w-full max-h-[48vh] relative overflow-hidden rounded-2xl border-2 border-white/25 cursor-grab active:cursor-grabbing shadow-2xl transition-all"
            onMouseDown={handleMouseDown}
            onTouchStart={handleTouchStart}
          >
            {/* Rule-of-Thirds Grid Overlay */}
            <div className="absolute inset-0 pointer-events-none z-10 grid grid-cols-3 grid-rows-3 border border-white/15">
              <div className="border-r border-b border-white/10" />
              <div className="border-r border-b border-white/10" />
              <div className="border-b border-white/10" />
              <div className="border-r border-b border-white/10" />
              <div className="border-r border-b border-white/10" />
              <div className="border-b border-white/10" />
              <div className="border-r border-white/10" />
              <div className="border-r border-white/10" />
              <div className="border-white/10" />
            </div>

            {/* Photo with Full Transformation */}
            <div
              className="absolute inset-0 flex items-center justify-center pointer-events-none"
              style={{
                transform: `translate(${position.x}px, ${position.y}px)`,
              }}
            >
              <img
                ref={imageRef}
                src={imageSrc}
                alt="Framing preview"
                draggable={false}
                style={{
                  transform: `scale(${scale})`,
                  transformOrigin: 'center center',
                  maxWidth: 'none',
                  maxHeight: 'none',
                  width:
                    naturalSize.width > 0 && containerRef.current
                      ? `${containerRef.current.clientWidth}px`
                      : '100%',
                  height: 'auto',
                }}
                className="select-none pointer-events-none transition-transform duration-75"
              />
            </div>
          </div>

          <div className="mt-2.5 flex items-center gap-1.5 text-[11px] text-[#777777]">
            <Move className="w-3 h-3 text-[#999999]" />
            <span>Drag photo to position head &amp; body exactly where you want</span>
          </div>
        </div>

        {/* Bottom Controls: Zoom Slider + Canvas Background + Actions */}
        <div className="px-5 py-4 bg-[#141414] border-t border-[#222222] space-y-3.5">
          {/* Zoom Slider + Background Choice */}
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-3 flex-1 min-w-[240px]">
              <button
                type="button"
                onClick={() => setScale((s) => Math.max(0.2, Number((s - 0.1).toFixed(2))))}
                className="p-1.5 rounded-lg bg-[#222222] text-[#AAAAAA] hover:text-white transition-colors cursor-pointer"
                title="Zoom out (see more)"
              >
                <ZoomOut className="w-3.5 h-3.5" />
              </button>

              <input
                type="range"
                min="0.2"
                max="3.0"
                step="0.02"
                value={scale}
                onChange={(e) => setScale(parseFloat(e.target.value))}
                className="flex-1 accent-white h-1.5 bg-[#2B2B2B] rounded-lg cursor-pointer"
              />

              <button
                type="button"
                onClick={() => setScale((s) => Math.min(3.0, Number((s + 0.1).toFixed(2))))}
                className="p-1.5 rounded-lg bg-[#222222] text-[#AAAAAA] hover:text-white transition-colors cursor-pointer"
                title="Zoom in"
              >
                <ZoomIn className="w-3.5 h-3.5" />
              </button>

              <span className="text-[11px] text-[#888888] font-mono min-w-9 text-right">
                {Math.round(scale * 100)}%
              </span>

              <button
                type="button"
                onClick={() => {
                  setScale(1);
                  setPosition({ x: 0, y: 0 });
                }}
                className="p-1.5 rounded-lg bg-[#222222] text-[#888888] hover:text-white transition-colors cursor-pointer"
                title="Reset position"
              >
                <RotateCcw className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Background color choice when zoomed out */}
            <div className="flex items-center gap-2 text-xs">
              <span className="text-[11px] text-[#777777]">Canvas BG:</span>
              <button
                type="button"
                onClick={() => setBgColor('#111111')}
                className={`w-5 h-5 rounded-full border cursor-pointer ${
                  bgColor === '#111111' ? 'border-white scale-110' : 'border-[#444444]'
                } bg-[#111111]`}
                title="Dark (#111111)"
              />
              <button
                type="button"
                onClick={() => setBgColor('#F7F7F4')}
                className={`w-5 h-5 rounded-full border cursor-pointer ${
                  bgColor === '#F7F7F4' ? 'border-white scale-110' : 'border-[#444444]'
                } bg-[#F7F7F4]`}
                title="Warm Paper (#F7F7F4)"
              />
              <button
                type="button"
                onClick={() => setBgColor('#000000')}
                className={`w-5 h-5 rounded-full border cursor-pointer ${
                  bgColor === '#000000' ? 'border-white scale-110' : 'border-[#444444]'
                } bg-black`}
                title="Pure Black"
              />
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex items-center justify-between pt-1">
            <span className="text-[11px] text-[#666666] hidden sm:inline">
              Tip: Click &quot;Head &amp; Shoulders&quot; to automatically keep head in frame.
            </span>

            <div className="flex items-center gap-2.5 ml-auto">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded-full border border-[#3E3E3E] text-[#BBBBBB] text-xs font-medium hover:bg-[#222222] hover:text-white transition-colors cursor-pointer"
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={handleSaveCrop}
                className="inline-flex items-center gap-1.5 px-5 py-2 rounded-full bg-white text-[#111111] text-xs font-semibold hover:bg-[#EDEDED] transition-colors shadow-sm cursor-pointer"
              >
                <Check className="w-3.5 h-3.5 text-[#111111]" />
                <span>Apply Photo</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
