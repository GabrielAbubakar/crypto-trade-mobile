declare module "*.svg" {
  import type React from "react";
  import { type SvgProps } from "react-native-svg";
  const content: React.FC<SvgProps>;
  export default content;
}

declare module "*.jpg" {
  const value: any;
  export default value;
}

declare module "*.jpeg" {
  const value: any;
  export default value;
}

declare module "*.png" {
  const value: any;
  export default value;
}
