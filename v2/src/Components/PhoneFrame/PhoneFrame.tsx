import React from "react";
import Image, { ImageProps } from "next/image";
import iPhoneFrame from "./iphone.png";

interface Props {
  src: ImageProps["src"];
  alt: string;
  className?: string;
  priority?: boolean;
  placeholder?: ImageProps["placeholder"];
  sizes?: string;
}

export default function PhoneFrame({
  src,
  alt,
  className = "",
  priority,
  placeholder,
  sizes = "(max-width: 768px) 50vw, 300px",
}: Props) {
  return (
    <div className={`relative aspect-[1406/2822] ${className}`}>
      <div
        className="absolute overflow-hidden bg-black"
        style={{
          top: "2.7%",
          bottom: "2.7%",
          left: "6%",
          right: "6%",
          borderRadius: "10% / 5%",
        }}
      >
        <Image
          src={src}
          alt={alt}
          fill
          sizes={sizes}
          className="object-cover object-top"
          priority={priority}
          placeholder={placeholder}
        />
      </div>
      <Image
        src={iPhoneFrame}
        alt=""
        fill
        sizes={sizes}
        className="object-contain pointer-events-none select-none"
        aria-hidden
      />
    </div>
  );
}
