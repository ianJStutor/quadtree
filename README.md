# QuadTree

[![License: GPL v3](https://img.shields.io/badge/License-GPLv3-blue.svg)](https://www.gnu.org/licenses/gpl-3.0)

## Live Site

> [https://ianjstutor.github.io/quadtree/](https://ianjstutor.github.io/quadtree/)

## Description

2D data structure for efficiently comparing points distributed in a rectangular area. Comparing every point to every other point is O(n^2) time while using a QuadTree is much more efficient at O(log n) time. (See [Wikipedia: QuadTree](https://en.wikipedia.org/wiki/Quadtree) for more.)

Built with vanilla JavaScript, my favorite flavor!

## Usage

Include <code>quadtree.js</code> in your project. Import the JS into your main JavaScript file and call <code>new QuadTree({x,y,w,h})</code>, where {x,y} defines the upper-left corner of the canvas (defaults to {0,0}) and {w,h} ({width,height} also works) defines the width and height of the canvas.

### JavaScript

```js
//main.js
import QuadTree from "./quadtree.js";
const canvas = document.querySelector("canvas");
const myQT = new QuadTree(canvas);
myQT.insert({x: 50, y: 50});
myQT.getPoints({x: 0, y: 0}, 100); //[{x: 50, y: 50}]
```

## Author

> [Ian Marshall](https://ianjstutor.github.io/ian-marshall/)
