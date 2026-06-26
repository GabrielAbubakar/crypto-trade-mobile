import React, { forwardRef } from "react";
import { TouchableOpacity } from "react-native";
import type { TouchableOpacityProps } from "react-native";

/**
 * Base TouchableOpacity component with a default activeOpacity
 * and consistent behavior across the app.
 */
export interface BaseTouchableOpacityProps extends TouchableOpacityProps {
  children?: React.ReactNode;
}

export const BaseTouchableOpacity = forwardRef<any, BaseTouchableOpacityProps>(
  ({ activeOpacity = 0.7, style, children, ...props }, ref) => {
    return (
      <TouchableOpacity 
        ref={ref}
        activeOpacity={activeOpacity} 
        style={style} 
        {...props}
      >
        {children}
      </TouchableOpacity>
    );
  }
);

BaseTouchableOpacity.displayName = "BaseTouchableOpacity";

export type { TouchableOpacityProps as CustomTouchableOpacityProps };
