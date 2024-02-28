import './image-dropper.scss';

export const ImageDropper = ({ onImageDrop }: { onImageDrop: (image: HTMLImageElement) => void }) => {
  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();

    const file = e.dataTransfer.files[0];
    if (!file) {
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => onImageDrop(img);
      img.src = e.target!.result as string;
    };
    reader.readAsDataURL(file);
  }

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
  }

  return (
    <div
      onDrop={handleDrop}
      onDragOver={handleDragOver}
      className="image-dropper"
    >
      Drop an image here
    </div>
  );
}
