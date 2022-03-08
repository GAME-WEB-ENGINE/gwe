let { Utils } = require('../helpers');

class BoundingBox {
  constructor(min = [0, 0, 0], max = [0, 0, 0]) {
    this.min = min;
    this.max = max;
  }

  static createFromVertices(vertices) {
    let min = vertices.slice(0, 3);
    let max = vertices.slice(0, 3);
    for (let i = 0; i < vertices.length; i += 3) {
      for (let j = 0; j < 3; j++) {
        let v = vertices[i + j];
        min[j] = Math.min(v, min[j]);
        max[j] = Math.max(v, max[j]);
      }
    }

    return new BoundingBox(min, max);
  }

  getCenter() {
    let w = this.max[0] - this.min[0];
    let h = this.max[1] - this.min[1];
    let d = this.max[2] - this.min[2];
    let x = this.min[0] + (w * 0.5);
    let y = this.min[1] + (h * 0.5);
    let z = this.min[2] + (d * 0.5);
    return [x, y, z];
  }

  getSize() {
    let w = this.max[0] - this.min[0];
    let h = this.max[1] - this.min[1];
    let d = this.max[2] - this.min[2];
    return { w, h, d };
  }

  getPerimeter() {
    let w = this.max[0] - this.min[0];
    let d = this.max[2] - this.min[2];
    return w + w + d + d;
  }

  getVolume() {
    return (this.max[0] - this.min[0]) * (this.max[1] - this.min[1]) * (this.max[2] - this.min[2]);
  }

  transform(matrix) {
    let points = [];
    points.push(this.min[0], this.min[1], this.min[2]);
    points.push(this.max[0], this.min[1], this.min[2]);
    points.push(this.max[0], this.max[1], this.min[2]);
    points.push(this.min[0], this.max[1], this.min[2]);
    points.push(this.min[0], this.max[1], this.max[2]);
    points.push(this.max[0], this.max[1], this.max[2]);
    points.push(this.max[0], this.min[1], this.max[2]);
    points.push(this.min[0], this.min[1], this.max[2]);

    let transformedPoints = points.map((p) => {
      return Utils.MAT4_MULTIPLY_BY_VEC4(matrix, [p[0], p[1], p[2], 1]);
    });

    let min = transformedPoints[0].slice();
    let max = transformedPoints[0].slice();
    for (let i = 0; i < transformedPoints.length; i++) {
      for (let j = 0; j < 3; j++) {
        let v = transformedPoints[i][j];
        min[j] = Math.min(v, min[j]);
        max[j] = Math.max(v, max[j]);
      }
    }

    return new BoundingBox(min, max);
  }

  isPointInside(x, y, z) {
    return (
      (x >= this.min[0] && x <= this.max[0]) &&
      (y >= this.min[1] && y <= this.max[1]) &&
      (z >= this.min[2] && z <= this.max[2])
    );
  }

  intersectBoundingBox(aabb) {
    return (
      (this.min[0] <= aabb.max[0] && this.max[0] >= aabb.min[0]) &&
      (this.min[1] <= aabb.max[1] && this.max[1] >= aabb.min[1]) &&
      (this.min[2] <= aabb.max[2] && this.max[2] >= aabb.min[2])
    );
  }

  intersectBoundingSphere(x, y, z, radius) {
    let closestX = Math.max(this.min[0], Math.min(x, this.max[0]));
    let closestY = Math.max(this.min[1], Math.min(y, this.max[1]));
    let closestZ = Math.max(this.min[2], Math.min(z, this.max[2]));
    let distance = Math.sqrt((closestX - x) * (closestX - x) + (closestY - y) * (closestY - y) + (closestZ - z) * (closestZ - z));
    return distance < radius;
  }
}

module.exports.BoundingBox = BoundingBox;