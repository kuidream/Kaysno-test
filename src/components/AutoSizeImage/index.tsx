import React from 'react';
import { Image } from '@ray-js/ray';

interface Props {
  src: string;
  className?: string;
  style?: React.CSSProperties;
  onClick?: () => void;
}

/**
 * AutoSizeImage renders an image using its intrinsic pixel size as rpx.
 * This keeps UI fully consistent with design exports without manual width/height.
 */
const AutoSizeImage: React.FC<Props> = ({ src, className, style, onClick }) => {
  const [size, setSize] = React.useState<{ width: number; height: number } | null>(null);

  const handleLoad = (e: any) => {
    const w = e?.detail?.width ?? e?.currentTarget?.width ?? e?.target?.width;
    const h = e?.detail?.height ?? e?.currentTarget?.height ?? e?.target?.height;
    if (typeof w === 'number' && typeof h === 'number' && w > 0 && h > 0) {
      setSize({ width: w, height: h });
    }
  };

  return (
    <Image
      src={src}
      className={className}
      style={{
        ...style,
        width: size ? `${size.width}rpx` : undefined,
        height: size ? `${size.height}rpx` : undefined,
      }}
      onLoad={handleLoad}
      onClick={onClick}
    />
  );
};

export default AutoSizeImage;
