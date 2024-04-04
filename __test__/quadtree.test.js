import QuadTree from "../quadtree";

describe("QuadTree instantiation", () => {
    const rect1 = {w: 100, h: 100};
    const rect2 = {width: 100, height: 100};
    const rect3 = {x: 10, w: 100, height: 100};
    const rect4 = {y: 10, width: 100, h: 100};
    const rect5 = {x: 10, y: 10, w: 100, h: 100};
    const rect6 = {x: 10, y: 10, width: 100, height: 100};
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
        expect(qt.bounds).toMatchObject({x: 0, y: 0, w: 100, h: 100});
    });
    test("rect {width,height}", () => {
        const qt = new QuadTree(rect2);
        expect(qt).toBeInstanceOf(QuadTree);
        expect(qt.bounds).toMatchObject({x: 0, y: 0, w: 100, h: 100});
    });
    test("rect {x,w,height}", () => {
        const qt = new QuadTree(rect3);
        expect(qt).toBeInstanceOf(QuadTree);
        expect(qt.bounds).toMatchObject({x: 10, y: 0, w: 100, h: 100});
    });
    test("rect {y,width,h}", () => {
        const qt = new QuadTree(rect4);
        expect(qt).toBeInstanceOf(QuadTree);
        expect(qt.bounds).toMatchObject({x: 0, y: 10, w: 100, h: 100});
    });
    test("rect {x,y,w,h}", () => {
        const qt = new QuadTree(rect5);
        expect(qt).toBeInstanceOf(QuadTree);
        expect(qt.bounds).toMatchObject({x: 10, y: 10, w: 100, h: 100});
    });
    test("rect {x,y,width,height}", () => {
        const qt = new QuadTree(rect6);
        expect(qt).toBeInstanceOf(QuadTree);
        expect(qt.bounds).toMatchObject({x: 10, y: 10, w: 100, h: 100});
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

describe("Point insertion", () => {
    const rect = {w: 100, h: 100};
    const point1 = {x: 15, y: 15};
    const point2 = {x: -15, y: 15};
    const point3 = {x: 15, y: -15};
    const point4 = {x: 115, y: 15};
    const point5 = {x: 15, y: 115};
    const point6 = {x: 15, y: 15, data: {works: true}};
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
        expect(qt.points[0]).toMatchObject(point6);
    });
});

describe("QuadTree division", () => {
    const size = 100;
    const rect = {w: size, h: size};
    const points4 = Array(4).fill().map(_ => ({x: Math.random()*size, y: Math.random()*size}));
    const points5 = Array(5).fill().map(_ => ({x: Math.random()*size, y: Math.random()*size}));
    const points7 = Array(7).fill().map(_ => ({x: Math.random()*size, y: Math.random()*size}));
    const points9 = Array(9).fill().map(_ => ({x: Math.random(), y: Math.random()}));
    const customCapacity = 4;
    test("does not divide before capacity", () => {
        const qt = new QuadTree(rect);
        points4.forEach(p => expect(qt.insert(p)).toBe(true));
        expect(Array.isArray(qt.points)).toBe(true);
        expect(qt.points.length).toBe(points4.length);
        qt.points.forEach((p,i) => expect(p).toMatchObject(points4[i]));
    });
    test("divides at capacity", () => {
        const qt = new QuadTree(rect);
        points7.forEach(p => expect(qt.insert(p)).toBe(true));
        expect(qt.points).toBeNull();
        expect(qt.nw).toBeInstanceOf(QuadTree);
        expect(qt.ne).toBeInstanceOf(QuadTree);
        expect(qt.sw).toBeInstanceOf(QuadTree);
        expect(qt.se).toBeInstanceOf(QuadTree);
    });
    test("divides at custom capacity", () => {
        const qt = new QuadTree(rect, customCapacity);
        points5.forEach(p => expect(qt.insert(p)).toBe(true));
        expect(qt.points).toBeNull();
        expect(qt.nw).toBeInstanceOf(QuadTree);
        expect(qt.ne).toBeInstanceOf(QuadTree);
        expect(qt.sw).toBeInstanceOf(QuadTree);
        expect(qt.se).toBeInstanceOf(QuadTree);
    });
    test("subdivides", () => {
        const qt = new QuadTree(rect, customCapacity);
        points9.forEach(p => expect(qt.insert(p)).toBe(true));
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
        points9.forEach(p => expect(qt.insert(p)).toBe(true));
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