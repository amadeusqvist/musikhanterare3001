"use strict";
// NOTE: these heaps are MIN-heaps, meaning that the smallest element is on top.
Object.defineProperty(exports, "__esModule", { value: true });
exports.ah_remove = exports.ah_top = exports.ah_insert = exports.ah_is_empty = exports.ah_empty = exports.th_remove = exports.th_top = exports.th_insert = exports.th_shrub = exports.th_is_empty = exports.th_empty = void 0;
const list_1 = require("../lib/list");
/**
 * The empty tree heap
 * Convenience function, with given key and data types.
 * @template Key The type of keys
 * @template Data the type of data
 * @returns The empty tree heap (null)
 */
function th_empty() {
    return null;
}
exports.th_empty = th_empty;
/**
 * Is this the empty tree heap?
 * @template Key The type of keys
 * @template Data the type of data
 * @returns true iff th is null
 */
function th_is_empty(th) {
    return th === null;
}
exports.th_is_empty = th_is_empty;
/**
 * Generate a tree heap with a single item (a shrub).
 * Convenience function
 * @template Key The type of keys
 * @template Data the type of data
 * @param key the key of the item
 * @param data the data of the item
 * @returns a tree heap with a single item
 */
function th_shrub(key, data) {
    return { key, data, left_child: th_empty(), right_child: th_empty() };
}
exports.th_shrub = th_shrub;
/**
 * Insert an item into a heap
 * Duplicate keys are allowed.
 * @template Key The type of keys
 * @template Data the type of data
 * @param th the tree heap
 * @param key the key of the item
 * @param data the data of the item
 * @returns a tree heap where the item has been added.
 */
function th_insert(th, new_key, new_data) {
    return th_is_empty(th)
        ? th_shrub(new_key, new_data)
        : new_key < th.key
            ? { key: new_key, data: new_data, left_child: th, right_child: null }
            : th_is_empty(th.left_child)
                ? { key: th.key, data: th.data,
                    left_child: th_shrub(new_key, new_data),
                    right_child: th.right_child }
                : th_is_empty(th.right_child)
                    ? { key: th.key, data: th.data,
                        left_child: th_shrub(new_key, new_data),
                        right_child: th.right_child }
                    : th.left_child.key < th.right_child.key
                        ? th_insert(th.right_child, new_key, new_data)
                        : th_insert(th.left_child, new_key, new_data);
}
exports.th_insert = th_insert;
/**
 * Read the item on top of the heap
 * Note that this is a min-heap, so the key is the smallest one in the heap
 * @template Key The type of keys
 * @template Data the type of data
 * @param th the tree heap
 * @returns a pair of the key and the data
 */
function th_top({ key, data }) {
    return (0, list_1.pair)(key, data);
}
exports.th_top = th_top;
/**
 * Remove the item on top of the heap
 * @template Key The type of keys
 * @template Data the type of data
 * @param th the tree heap
 * @returns a new heap where the item is removed.
 */
function th_remove({ left_child, right_child }) {
    return th_is_empty(left_child)
        ? right_child
        : th_is_empty(right_child)
            ? left_child
            : left_child.key < right_child.key
                ? { key: left_child.key,
                    data: left_child.data,
                    left_child: th_remove(left_child),
                    right_child }
                : { key: right_child.key,
                    data: left_child.data,
                    left_child,
                    right_child: th_remove(right_child) };
}
exports.th_remove = th_remove;
/**
 * Create an empty array heap
 * @template Key The type of keys
 * @returns A new empty array heap
 */
function ah_empty() {
    return { arr: [], size: 0 };
}
exports.ah_empty = ah_empty;
/**
 * Is this an empty array heap?
 * @template Key The type of keys
 * @param ah the array heap
 * @returns true iff ah is empty
 */
function ah_is_empty(ah) {
    return ah.size === 0;
}
exports.ah_is_empty = ah_is_empty;
// the left child of the item with the given index
function left_child(i) {
    return i * 2 + 1;
}
// the right child of the item with the given index
function right_child(i) {
    return i * 2 + 2;
}
// the parent of the item with the given index
// @precondition i is not 0
function parent_of(i) {
    return i % 2 === 0 ? i / 2 - 1 : (i - 1) / 2;
}
/**
 * Insert an item into a heap
 * Duplicate keys are allowed.
 * @template Key The type of keys
 * @param ah the array heap
 * @param key the key of the item
 */
function ah_insert(ah, key) {
    function bubbleUp(i) {
        if (ah.arr[parent_of(i)] > ah.arr[i]) {
            [ah.arr[i], ah.arr[parent_of(i)]] = [ah.arr[parent_of(i)], ah.arr[i]];
            bubbleUp(parent_of(i));
        }
        else { } // The heap property is restored
    }
    ah.arr[ah.size] = key;
    ah.size = ah.size + 1;
    bubbleUp(ah.size - 1);
}
exports.ah_insert = ah_insert;
/**
 * Read the item on top of the heap
 * Note that this is a min-heap, so the key is the smallest one in the heap
 * @template Key The type of keys
 * @template Data the type of data
 * @param ah the array heap
 * @returns a pair of the key and the data
 */
function ah_top(ah) {
    return ah.arr[0];
}
exports.ah_top = ah_top;
/**
 * Remove the item on top of the heap
 * @template Key The type of keys
 * @template Data the type of data
 * @param ah the array heap
 * @returns true iff there was an item to remove (the heap was not empty).
 */
function ah_remove(ah) {
    function bubbleDown(i) {
        if (right_child(i) < ah.size && ah.arr[right_child(i)] < ah.arr[i]) {
            // We know that i < left_child(i) < right_child(i) < ah.size
            if (ah.arr[left_child(i)] < ah.arr[i]) {
                if (ah.arr[left_child(i)] < ah.arr[right_child(i)]) {
                    [ah.arr[i], ah.arr[left_child(i)]] = [ah.arr[left_child(i)], ah.arr[i]];
                    bubbleDown(left_child(i));
                }
                else {
                    [ah.arr[i], ah.arr[right_child(i)]] = [ah.arr[right_child(i)], ah.arr[i]];
                    bubbleDown(right_child(i));
                }
            }
            else {
                [ah.arr[i], ah.arr[right_child(i)]] = [ah.arr[right_child(i)], ah.arr[i]];
                bubbleDown(right_child(i));
            }
        }
        else if (left_child(i) < ah.size && ah.arr[left_child(i)] < ah.arr[i]) {
            [ah.arr[i], ah.arr[left_child(i)]] = [ah.arr[left_child(i)], ah.arr[i]];
            bubbleDown(left_child(i));
        }
        else { } // The heap property is restored
    }
    if (ah.size === 0) {
        return false;
    }
    else {
        const key = ah.arr[0];
        ah.size = ah.size - 1;
        ah.arr[0] = ah.arr[ah.size];
        bubbleDown(0);
        return true;
    }
}
exports.ah_remove = ah_remove;
