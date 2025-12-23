export const px = (value: number) => String(value) + "px";
export const pxbr = (br: DOMRect) => ({
  left: px(br.left),
  top: px(br.top),
  width: px(br.width),
  height: px(br.height),
});
