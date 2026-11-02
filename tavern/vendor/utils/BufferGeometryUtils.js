// 精简版 BufferGeometryUtils（只实现 GLTFLoader 需要的 toTrianglesDrawMode）
// 完整版见 three/examples/jsm/utils/BufferGeometryUtils.js
import { TriangleFanDrawMode, TriangleStripDrawMode, TrianglesDrawMode } from 'three';

export function toTrianglesDrawMode(geometry, drawMode) {
  if (drawMode === TrianglesDrawMode) return geometry;
  if (drawMode !== TriangleFanDrawMode && drawMode !== TriangleStripDrawMode) return geometry;

  let index = geometry.getIndex();
  if (index === null) {
    const n = geometry.getAttribute('position').count;
    const arr = [];
    for (let i = 0; i < n; i++) arr.push(i);
    geometry.setIndex(arr);
    index = geometry.getIndex();
  }
  const idx = index.array;
  const out = [];
  if (drawMode === TriangleFanDrawMode) {
    for (let i = 1; i + 1 < idx.length; i++) out.push(idx[0], idx[i], idx[i + 1]);
  } else {
    for (let i = 0; i + 2 < idx.length; i++) {
      if (i % 2 === 0) out.push(idx[i], idx[i + 1], idx[i + 2]);
      else out.push(idx[i + 1], idx[i], idx[i + 2]);
    }
  }
  const ng = geometry.clone();
  ng.setIndex(out);
  ng.clearGroups();
  return ng;
}
