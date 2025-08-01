declare module "*.json" {
  const value: any;
  export default value;
}

// Types pour les animations Lottie
export interface LottieAnimationData {
  v: string;
  fr: number;
  ip: number;
  op: number;
  w: number;
  h: number;
  nm: string;
  ddd: number;
  assets: any[];
  layers: any[];
}

// Props pour le composant LottieAnimation
export interface LottieAnimationProps {
  animationData: LottieAnimationData;
  width?: number | string;
  height?: number | string;
  loop?: boolean;
  autoplay?: boolean;
  className?: string;
  style?: React.CSSProperties;
} 