"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.lg_transpose = exports.lg_from_edges = exports.lg_new = exports.mg_from_edges = exports.mg_new = exports.build_array = exports.undirected = void 0;
const list_1 = require("../lib/list");
/**
 * Add all reverse edges to an edge list, and remove all self loops.
 * @param el an edge list
 * @returns el with all reverse edges present, and all self loops removed
 */
function undirected(el) {
    if ((0, list_1.is_null)(el)) {
        return el;
    }
    else if ((0, list_1.head)((0, list_1.head)(el)) === (0, list_1.tail)((0, list_1.head)(el))) {
        return undirected((0, list_1.tail)(el));
    }
    else {
        const source = (0, list_1.head)((0, list_1.head)(el));
        const target = (0, list_1.tail)((0, list_1.head)(el));
        return (0, list_1.pair)((0, list_1.pair)(target, source), undirected((0, list_1.filter)(edge => (0, list_1.head)(edge) !== target
            || (0, list_1.tail)(edge) !== source, (0, list_1.tail)(el))));
    }
}
exports.undirected = undirected;
// Build an array based on a function computing the item at each index
function build_array(size, content) {
    const result = Array(size);
    for (var i = 0; i < size; i = i + 1) {
        result[i] = content(i);
    }
    return result;
}
exports.build_array = build_array;
/**
 * Create a new matrix graph with no edges
 * @param size the number of nodes
 * @returns the new matrix graph, where each inner array entry is false.
 */
function mg_new(size) {
    return { size,
        adj: build_array(size, _ => build_array(size, _ => false)) };
}
exports.mg_new = mg_new;
/**
 * Create a new matrix graph with a given set of edges
 * @param size the number of nodes
 * @param edges an edge list
 * @invariant all node ids in the edge list are < size.
 * @returns the new matrix graph, with the given edges.
 */
function mg_from_edges(size, edges) {
    const result = mg_new(size);
    (0, list_1.for_each)(p => result.adj[(0, list_1.head)(p)][(0, list_1.tail)(p)] = true, edges);
    return result;
}
exports.mg_from_edges = mg_from_edges;
/**
 * Create a new ListGraph with no edges
 * @param size the number of nodes in the list graph
 * @returns a new list graph with size edges.
 */
function lg_new(size) {
    return { size, adj: build_array(size, _ => null) };
}
exports.lg_new = lg_new;
/**
 * Create a new ListGraph with a given set of edges
 * @param size the number of nodes in the list graph
 * @param edges an edge list
 * @invariant all node ids in the edge list are < size.
 * @returns the new ListGraph, with the given edges.
 */
function lg_from_edges(size, edges) {
    const result = lg_new(size);
    (0, list_1.for_each)(p => result.adj[(0, list_1.head)(p)] = (0, list_1.pair)((0, list_1.tail)(p), result.adj[(0, list_1.head)(p)]), edges);
    return result;
}
exports.lg_from_edges = lg_from_edges;
/**
 * Transpose a list graph
 * @param adj a list graph
 * @returns the transpose of adj
 */
function lg_transpose({ size, adj }) {
    const result = lg_new(size);
    for (var i = 0; i < size; i = i + 1) {
        (0, list_1.for_each)(p => result.adj[p] = (0, list_1.pair)(i, result.adj[p]), adj[i]);
    }
    return result;
}
exports.lg_transpose = lg_transpose;
