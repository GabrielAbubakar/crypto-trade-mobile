import { useGetAssetDetailsQuery } from "@/store";

interface UseAssetIconUrlResult {
  iconUrl: string | undefined;
  isLoading: boolean;
}

export function useAssetIconUrl(assetSymbol: string): UseAssetIconUrlResult {
  const { data: assetDetails, isLoading } = useGetAssetDetailsQuery(assetSymbol, {
    skip: !assetSymbol,
  });

  const iconUrl = assetDetails?.iconUrl;
  if (!iconUrl) {
    return { iconUrl: undefined, isLoading };
  }

  const resolvedUrl = iconUrl.startsWith("http")
    ? iconUrl
    : process.env.EXPO_PUBLIC_API_URL
      ? `${process.env.EXPO_PUBLIC_API_URL}${iconUrl}`
      : iconUrl;

  return { iconUrl: resolvedUrl, isLoading };
}
