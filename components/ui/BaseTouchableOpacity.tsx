import React from "react";
import {
  TouchableOpacity as RNTouchableOpacity,
  TouchableOpacityProps,
} from "react-native";

/**
 * Base TouchableOpacity component with a default activeOpacity
 * and consistent behavior across the app.
 */
export interface BaseTouchableOpacityProps extends TouchableOpacityProps {
  children?: React.ReactNode;
}

export const BaseTouchableOpacity: React.FC<BaseTouchableOpacityProps> = ({
  activeOpacity = 0.7,
  style,
  children,
  ...props
}) => {
  return (
    <RNTouchableOpacity 
      activeOpacity={activeOpacity} 
      style={style} 
      {...props}
    >
      {children}
    </RNTouchableOpacity>
  );
};

export type { TouchableOpacityProps as CustomTouchableOpacityProps };
