/// <reference types="next" />
/// <reference types="next/image-types/global" />

declare global {
  namespace JSX {
    interface IntrinsicElements {
      "spline-viewer": React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement> & {
        url?: string;
        loading?: "lazy" | "eager";
        splash?: string;
        "splash-delay"?: number;
      };
    }
  }
}

export {};