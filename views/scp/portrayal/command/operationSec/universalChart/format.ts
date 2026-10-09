
export const fmtPieUsedLegendMap = (legendMap: any, seriesDataMap: any) => {
  let usedLegendMap: Map<string, { label: string; key?: string; color: string }> = new Map();
  const isMap: boolean = legendMap instanceof Map;
  if (!isMap) {
    if (legendMap) {
      for (let key in legendMap) {
        usedLegendMap.set(key, { ...legendMap[key] });
      }
    } else {
      Object.keys(seriesDataMap).forEach((key, idx) => {
        usedLegendMap.set(key, { label: key, color: "grey" });
      });
    }
  } else {
    usedLegendMap = legendMap;
  }
  return usedLegendMap;
};
