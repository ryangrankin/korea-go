import Image from "next/image";

// A wide strip of the unit's photo along the top of a lesson.
// The photos are already cropped to 12:5, so nothing important gets cut off.
export default function LessonPhoto({ src, alt }: { src: string; alt: string }) {
  return (
    <Image
      className="lesson-photo"
      src={src}
      alt={alt}
      width={1200}
      height={500}
      sizes="(min-width: 900px) 656px, 100vw"
      priority
    />
  );
}
