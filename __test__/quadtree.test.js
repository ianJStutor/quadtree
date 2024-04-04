import QuadTree from "../quadtree";

describe("QuadTree instantiation", () => {
    const rect1 = {w: 100, h: 100};
    const rect2 = {width: 100, height: 100};
    const rect3 = {x: 10, w: 100, height: 100};
    const rect4 = {y: 10, width: 100, h: 100};
    const rect5 = {x: 10, y: 10, w: 100, h: 100};
    const rect6 = {x: 10, y: 10, width: 100, height: 100};
    test("rect1 version", () => {
        const qt = new QuadTree(rect1);
        expect(qt).toBeInstanceOf(QuadTree);
        expect(qt.bounds.toObject()).toMatchObject({x: 0, y: 0, w: 100, h: 100});
    });
    test("rect2 version", () => {
        const qt = new QuadTree(rect2);
        expect(qt).toBeInstanceOf(QuadTree);
        expect(qt.bounds.toObject()).toMatchObject({x: 0, y: 0, w: 100, h: 100});
    });
    test("rect3 version", () => {
        const qt = new QuadTree(rect3);
        expect(qt).toBeInstanceOf(QuadTree);
        expect(qt.bounds.toObject()).toMatchObject({x: 10, y: 0, w: 100, h: 100});
    });
    test("rect4 version", () => {
        const qt = new QuadTree(rect4);
        expect(qt).toBeInstanceOf(QuadTree);
        expect(qt.bounds.toObject()).toMatchObject({x: 0, y: 10, w: 100, h: 100});
    });
    test("rect5 version", () => {
        const qt = new QuadTree(rect5);
        expect(qt).toBeInstanceOf(QuadTree);
        expect(qt.bounds.toObject()).toMatchObject({x: 10, y: 10, w: 100, h: 100});
    });
    test("rect6 version", () => {
        const qt = new QuadTree(rect6);
        expect(qt).toBeInstanceOf(QuadTree);
        expect(qt.bounds.toObject()).toMatchObject({x: 10, y: 10, w: 100, h: 100});
    });
});