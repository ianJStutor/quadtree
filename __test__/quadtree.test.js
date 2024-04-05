import QuadTree from "../quadtree";

describe("QuadTree instantiation", () => {
    const rect1 = { w: 100, h: 100 };
    const rect2 = { width: 100, height: 100 };
    const rect3 = { x: 10, w: 100, height: 100 };
    const rect4 = { y: 10, width: 100, h: 100 };
    const rect5 = { x: 10, y: 10, w: 100, h: 100 };
    const rect6 = { x: 10, y: 10, width: 100, height: 100 };
    const defaultCapacity = 6;
    const minCapacity = 1;
    const capacity = 4;
    const invalidCapacity1 = "wrong";
    const invalidCapcity2 = "0";
    const defaultDepth = 1;
    const customDepth = 2;
    test("rect {w,h}", () => {
        const qt = new QuadTree(rect1);
        expect(qt).toBeInstanceOf(QuadTree);
        expect(qt.bounds).toMatchObject({ x: 0, y: 0, w: 100, h: 100 });
    });
    test("rect {width,height}", () => {
        const qt = new QuadTree(rect2);
        expect(qt).toBeInstanceOf(QuadTree);
        expect(qt.bounds).toMatchObject({ x: 0, y: 0, w: 100, h: 100 });
    });
    test("rect {x,w,height}", () => {
        const qt = new QuadTree(rect3);
        expect(qt).toBeInstanceOf(QuadTree);
        expect(qt.bounds).toMatchObject({ x: 10, y: 0, w: 100, h: 100 });
    });
    test("rect {y,width,h}", () => {
        const qt = new QuadTree(rect4);
        expect(qt).toBeInstanceOf(QuadTree);
        expect(qt.bounds).toMatchObject({ x: 0, y: 10, w: 100, h: 100 });
    });
    test("rect {x,y,w,h}", () => {
        const qt = new QuadTree(rect5);
        expect(qt).toBeInstanceOf(QuadTree);
        expect(qt.bounds).toMatchObject({ x: 10, y: 10, w: 100, h: 100 });
    });
    test("rect {x,y,width,height}", () => {
        const qt = new QuadTree(rect6);
        expect(qt).toBeInstanceOf(QuadTree);
        expect(qt.bounds).toMatchObject({ x: 10, y: 10, w: 100, h: 100 });
    });
    test("default capacity", () => {
        const qt = new QuadTree(rect1);
        expect(qt.capacity).toBe(defaultCapacity);
    });
    test("custom capacity", () => {
        const qt = new QuadTree(rect1, capacity);
        expect(qt.capacity).toBe(capacity);
    });
    test("invalid capacity (string)", () => {
        const qt = new QuadTree(rect1, invalidCapacity1);
        expect(qt.capacity).toBe(defaultCapacity);
    });
    test("invalid capcity (below min)", () => {
        const qt = new QuadTree(rect1, invalidCapcity2);
        expect(qt.capacity).toBe(minCapacity);
    });
    test("points array", () => {
        const qt = new QuadTree(rect1);
        expect(Array.isArray(qt.points)).toBe(true);
        expect(qt.points.length).toBe(0);
    });
    test("default depth", () => {
        const qt = new QuadTree(rect1);
        expect(qt.depth).toBe(defaultDepth);
    });
    test("custom depth", () => {
        const qt = new QuadTree(rect1, capacity, customDepth);
        expect(qt.depth).toBe(customDepth);
    });
});

describe("QuadTree point insertion", () => {
    const rect = { w: 100, h: 100 };
    const point1 = { x: 15, y: 15 };
    const point2 = { x: -15, y: 15 };
    const point3 = { x: 15, y: -15 };
    const point4 = { x: 115, y: 15 };
    const point5 = { x: 15, y: 115 };
    const point6 = { x: 15, y: 15, test: { works: true } };
    test("point in bounds", () => {
        const qt = new QuadTree(rect);
        expect(qt.insert(point1)).toBe(true);
        expect(qt.insert(point1)).toBe(true);
        expect(qt.points[0]).toMatchObject(point1);
    });
    test("point out of bounds", () => {
        const qt = new QuadTree(rect);
        expect(qt.bounds.contains(point2)).toBe(false);
        expect(qt.insert(point2)).toBe(false);
        expect(qt.bounds.contains(point3)).toBe(false);
        expect(qt.insert(point3)).toBe(false);
        expect(qt.bounds.contains(point4)).toBe(false);
        expect(qt.insert(point4)).toBe(false);
        expect(qt.bounds.contains(point5)).toBe(false);
        expect(qt.insert(point5)).toBe(false);
    });
    test("point has data", () => {
        const qt = new QuadTree(rect);
        expect(qt.insert(point6)).toBe(true);
        expect(qt.points[0].originalPoint).toMatchObject(point6);
    });
});

describe("QuadTree division", () => {
    const size = 100;
    const rect = { w: size, h: size };
    const points4 = Array(4)
        .fill()
        .map((_) => ({ x: Math.random() * size, y: Math.random() * size }));
    const points5 = Array(5)
        .fill()
        .map((_) => ({ x: Math.random() * size, y: Math.random() * size }));
    const points7 = Array(7)
        .fill()
        .map((_) => ({ x: Math.random() * size, y: Math.random() * size }));
    const points9 = Array(9)
        .fill()
        .map((_) => ({ x: Math.random(), y: Math.random() }));
    const customCapacity = 4;
    test("does not divide before capacity", () => {
        const qt = new QuadTree(rect);
        points4.forEach((p) => expect(qt.insert(p)).toBe(true));
        expect(Array.isArray(qt.points)).toBe(true);
        expect(qt.points.length).toBe(points4.length);
        qt.points.forEach((p, i) => expect(p).toMatchObject(points4[i]));
    });
    test("divides at capacity", () => {
        const qt = new QuadTree(rect);
        points7.forEach((p) => expect(qt.insert(p)).toBe(true));
        expect(qt.points).toBeNull();
        expect(qt.nw).toBeInstanceOf(QuadTree);
        expect(qt.ne).toBeInstanceOf(QuadTree);
        expect(qt.sw).toBeInstanceOf(QuadTree);
        expect(qt.se).toBeInstanceOf(QuadTree);
    });
    test("divides at custom capacity", () => {
        const qt = new QuadTree(rect, customCapacity);
        points5.forEach((p) => expect(qt.insert(p)).toBe(true));
        expect(qt.points).toBeNull();
        expect(qt.nw).toBeInstanceOf(QuadTree);
        expect(qt.ne).toBeInstanceOf(QuadTree);
        expect(qt.sw).toBeInstanceOf(QuadTree);
        expect(qt.se).toBeInstanceOf(QuadTree);
    });
    test("subdivides", () => {
        const qt = new QuadTree(rect, customCapacity);
        points9.forEach((p) => expect(qt.insert(p)).toBe(true));
        expect(qt.points).toBeNull();
        expect(qt.nw.points).toBeNull();
        expect(qt.nw.depth).toBe(2);
        expect(qt.nw.nw).toBeInstanceOf(QuadTree);
        expect(qt.nw.ne).toBeInstanceOf(QuadTree);
        expect(qt.nw.sw).toBeInstanceOf(QuadTree);
        expect(qt.nw.se).toBeInstanceOf(QuadTree);
    });
    test("does not exceed max depth", () => {
        const qt = new QuadTree(rect, customCapacity);
        points9.forEach((p) => expect(qt.insert(p)).toBe(true));
        expect(qt.depth).toBe(1);
        expect(qt.nw.depth).toBe(2);
        expect(qt.nw.nw.depth).toBe(3);
        expect(qt.nw.nw.nw.depth).toBe(4);
        expect(qt.nw.nw.nw.nw.depth).toBe(5);
        expect(qt.nw.nw.nw.nw.nw.depth).toBe(6);
        expect(qt.nw.nw.nw.nw.nw.nw.depth).toBe(7);
        expect(qt.nw.nw.nw.nw.nw.nw.nw.depth).toBe(8);
        expect(Array.isArray(qt.nw.nw.nw.nw.nw.nw.nw.points)).toBe(true);
        expect(qt.nw.nw.nw.nw.nw.nw.nw.nw).toBeUndefined();
        expect(qt.nw.nw.nw.nw.nw.nw.nw.ne).toBeUndefined();
        expect(qt.nw.nw.nw.nw.nw.nw.nw.sw).toBeUndefined();
        expect(qt.nw.nw.nw.nw.nw.nw.nw.se).toBeUndefined();
    });
});

describe("QuadTree undivided, get points", () => {
    const pt1 = { x: 50, y: 50 };
    const pt2 = { x: 1, y: 1 };
    const pt3 = { x: 50, y: 0 };
    const pt4 = { x: -5, y: -5 };
    const pt5 = { x: 50, y: -5 };
    const pt6 = { x: 50, y: -61 };
    const r = 60;
    const rect = { w: 100, h: 100 };
    const points = [
        { x: 0, y: 0 },
        { x: 100, y: 0 },
        { x: 100, y: 100 },
        { x: 0, y: 100 }
    ];
    const qt = new QuadTree(rect);
    points.forEach((p) => qt.insert(p));
    test("circle center in rect, no points found", () => {
        const result = qt.getPoints(pt1, r);
        expect(Array.isArray(result)).toBe(true);
        expect(result.length).toBe(0);
    });
    test("circle center in rect, one local point found", () => {
        const result = qt.getPoints(pt2, r);
        expect(Array.isArray(result)).toBe(true);
        expect(result.length).toBe(1);
        expect(result[0]).toMatchObject(points[0]);
    });
    test("circle center in rect, several local points found", () => {
        const result = qt.getPoints(pt3, r);
        expect(Array.isArray(result)).toBe(true);
        expect(result.length).toBe(2);
        expect(result[0]).toMatchObject(points[0]);
        expect(result[1]).toMatchObject(points[1]);
    });
    test("circle center not in rect, one local point found", () => {
        const result = qt.getPoints(pt4, r);
        expect(Array.isArray(result)).toBe(true);
        expect(result.length).toBe(1);
        expect(result[0]).toMatchObject(points[0]);
    });
    test("circle center not in rect, several local points found", () => {
        const result = qt.getPoints(pt5, r);
        expect(Array.isArray(result)).toBe(true);
        expect(result.length).toBe(2);
        expect(result[0]).toMatchObject(points[0]);
        expect(result[1]).toMatchObject(points[1]);
    });
    test("circle does not intersect with rect, no local points found", () => {
        const result = qt.getPoints(pt6, r);
        expect(Array.isArray(result)).toBe(true);
        expect(result.length).toBe(0);
    });
});

describe("QuadTree divided, get points", () => {
    const pt1 = { x: 50, y: 50 };
    const pt2 = { x: 0, y: 0 };
    const r = 50;
    const rect = { w: 100, h: 100 };
    const numPoints = 7;
    const points = Array(numPoints)
        .fill()
        .map((_) => ({ x: Math.random(), y: Math.random() }));
    const qt = new QuadTree(rect);
    points.forEach((p) => qt.insert(p));
    test("get no points", () => {
        const result = qt.getPoints(pt1, r);
        expect(Array.isArray(result)).toBe(true);
        expect(result.length).toBe(0);
    });
    test("get all points", () => {
        const result = qt.getPoints(pt2, r);
        expect(Array.isArray(result)).toBe(true);
        expect(result.length).toBe(numPoints);
        points.forEach((p) =>
            expect(result.some(({ x, y }) => x === p.x && y === p.y)).toBe(true)
        );
    });
});

describe("QuadTree empty", () => {
    const rect = { w: 100, h: 100 };
    const numPoints = 7;
    const points = Array(numPoints)
        .fill()
        .map((_) => ({ x: Math.random(), y: Math.random() }));
    const qt = new QuadTree(rect);
    points.forEach((p) => qt.insert(p));
    test("has points and divisions", () => {
        expect(qt.points).toBeNull();
        expect(qt.nw).toBeInstanceOf(QuadTree);
        expect(qt.ne).toBeInstanceOf(QuadTree);
        expect(qt.sw).toBeInstanceOf(QuadTree);
        expect(qt.se).toBeInstanceOf(QuadTree);
    });
    test("can empty", () => {
        expect(qt.empty()).toBe(true);
        expect(Array.isArray(qt.points)).toBe(true);
        expect(qt.nw).toBeUndefined();
        expect(qt.ne).toBeUndefined();
        expect(qt.sw).toBeUndefined();
        expect(qt.se).toBeUndefined();
    });
});

describe("QuadTree rects", () => {
    const rect = { w: 100, h: 100 };
    const points1 = [{ x: 0, y: 0 }];
    const rects1 = [{ x: 0, y: 0, w: 100, h: 100 }];
    const points2 = Array(7)
        .fill()
        .map((_) => ({ x: Math.random(), y: Math.random() }));
    const rects2 = [
        { x: 0, y: 0, w: 0.78125, h: 0.78125 },
        { x: 0.78125, y: 0, w: 0.78125, h: 0.78125 },
        { x: 0, y: 0.78125, w: 0.78125, h: 0.78125 },
        { x: 0.78125, y: 0.78125, w: 0.78125, h: 0.78125 },
        { x: 1.5625, y: 0, w: 1.5625, h: 1.5625 },
        { x: 0, y: 1.5625, w: 1.5625, h: 1.5625 },
        { x: 1.5625, y: 1.5625, w: 1.5625, h: 1.5625 },
        { x: 3.125, y: 0, w: 3.125, h: 3.125 },
        { x: 0, y: 3.125, w: 3.125, h: 3.125 },
        { x: 3.125, y: 3.125, w: 3.125, h: 3.125 },
        { x: 6.25, y: 0, w: 6.25, h: 6.25 },
        { x: 0, y: 6.25, w: 6.25, h: 6.25 },
        { x: 6.25, y: 6.25, w: 6.25, h: 6.25 },
        { x: 12.5, y: 0, w: 12.5, h: 12.5 },
        { x: 0, y: 12.5, w: 12.5, h: 12.5 },
        { x: 12.5, y: 12.5, w: 12.5, h: 12.5 },
        { x: 25, y: 0, w: 25, h: 25 },
        { x: 0, y: 25, w: 25, h: 25 },
        { x: 25, y: 25, w: 25, h: 25 },
        { x: 50, y: 0, w: 50, h: 50 },
        { x: 0, y: 50, w: 50, h: 50 },
        { x: 50, y: 50, w: 50, h: 50 }
    ];
    test("rects before dividing", () => {
        const qt = new QuadTree(rect);
        points1.forEach((p) => qt.insert(p));
        expect(qt.getRects()).toMatchObject(rects1);
    });
    test("rects after dividing", () => {
        const qt = new QuadTree(rect);
        points2.forEach((p) => qt.insert(p));
        expect(qt.getRects()).toMatchObject(rects2);
    });
});
