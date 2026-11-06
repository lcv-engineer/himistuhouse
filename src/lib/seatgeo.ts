// Vị trí từng chỗ ngồi trên 4 ảnh sơ đồ public/images/maps (toạ độ theo pixel của ảnh).
// Mỗi ảnh (tầng × ngôn ngữ) bố trí hơi khác nhau nên có toạ độ riêng. Một chỗ có thể gồm nhiều hình (vd. U1 = bàn giữa + sofa chữ U).
export type Shape = { id: string; kind: "circle"; cx: number; cy: number; r: number } | { id: string; kind: "rect"; x: number; y: number; w: number; h: number };
export type Geo = { w: number; h: number; shapes: Shape[] };

const c = (id: string, cx: number, cy: number, r = 31): Shape => ({ id, kind: "circle", cx, cy, r });
const r = (id: string, x0: number, y0: number, x1: number, y1: number): Shape => ({ id, kind: "rect", x: x0, y: y0, w: x1 - x0, h: y1 - y0 });

export const GEO: Record<string, Geo> = {
  "f1-en": {
    w: 1445, h: 1088,
    shapes: [
      c("B1", 905, 461), c("B2", 828, 461), c("B3", 751, 461), c("B4", 674, 461), c("B5", 597, 461),
      c("B6", 528, 523), c("B7", 528, 594), c("B8", 528, 665), c("B9", 528, 735), c("B10", 528, 805),
      c("B11", 866, 867), c("B12", 945, 867), c("B13", 1025, 867),
      r("W1", 320, 482, 438, 558), r("W2", 320, 769, 438, 845), r("O1", 191, 531, 253, 591), r("O2", 191, 653, 253, 713),
    ],
  },
  "f1-vi": {
    w: 1445, h: 1088,
    shapes: [
      c("B1", 926, 453), c("B2", 847, 453), c("B3", 767, 453), c("B4", 688, 453), c("B5", 609, 453),
      c("B6", 538, 519), c("B7", 538, 590), c("B8", 538, 663), c("B9", 538, 735), c("B10", 538, 808),
      c("B11", 879, 868), c("B12", 964, 868), c("B13", 1048, 868),
      r("W1", 328, 467, 440, 551), r("W2", 328, 764, 440, 847), r("O1", 202, 511, 265, 577), r("O2", 202, 643, 265, 710),
    ],
  },
  "f2-en": {
    w: 1427, h: 1102,
    shapes: [
      r("U2", 266, 347, 472, 436), r("U3", 537, 347, 737, 436), r("U4", 235, 515, 323, 748),
      r("U1", 882, 666, 994, 845), r("U1", 795, 594, 862, 950), r("U1", 1014, 594, 1081, 950), r("U1", 862, 878, 1014, 950),
    ],
  },
  "f2-vi": {
    w: 1426, h: 1103,
    shapes: [
      r("U2", 281, 341, 474, 425), r("U3", 544, 341, 732, 425), r("U4", 243, 511, 328, 744),
      r("U1", 873, 655, 983, 836), r("U1", 785, 584, 854, 932), r("U1", 1001, 584, 1070, 932), r("U1", 854, 862, 1001, 932),
    ],
  },
};
