import React, { useCallback } from "react";
import { useRouter } from "expo-router";
import { BaseTouchableOpacity } from '@/components/ui';
import { MarketCoinRow } from "./MarketCoinRow";

interface MarketListItemProps {
  item: any;
}

export const MarketListItem = React.memo(({ item }: MarketListItemProps) => {
  const router = useRouter();

  const handlePress = useCallback(() => {
    router.push(`/markets/${item.symbol}` as any);
  }, [item.symbol, router]);

  return (
    <BaseTouchableOpacity onPress={handlePress}>
      <MarketCoinRow {...item} />
    </BaseTouchableOpacity>
  );
});

MarketListItem.displayName = "MarketListItem";
