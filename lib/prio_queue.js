"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.display_queue = exports.dequeue = exports.head = exports.enqueue = exports.is_empty = exports.empty = void 0;
/**
 * Constructs a priority queue without any elements.
 * @template T type of all queue elements
 * @returns Returns an empty queue.
 */
function empty() {
    return [0, 0, []];
}
exports.empty = empty;
/**
 * Checks whether a priority queue is empty.
 * @template T type of all queue elements
 * @param q queue to check for emptiness
 * @returns Returns true, if q has elements, false otherwise.
 */
function is_empty(q) {
    return q[0] === q[1];
}
exports.is_empty = is_empty;
/**
 * Adds an element to a priority queue.
 * @template T type of all queue elements
 * @param prio priority of the new element (larger means higher priority)
 * @param e element to add
 * @param q queue to add element to
 * @modifies q such that e is added with priority prio
 */
function enqueue(prio, e, q) {
    const tail_index = q[1];
    q[2][tail_index] = [prio, e];
    if (!is_empty(q)) {
        // we have at least one element
        const head_index = q[0];
        const elems = q[2];
        elems[tail_index] = [prio, e];
        // swap elements until we find the right spot
        for (let i = tail_index; i > head_index; i = i - 1) {
            if (elems[i - 1][0] >= elems[i][0]) {
                break;
            }
            else { //swap
                swap(elems, i, i - 1);
            }
        }
    }
    else { }
    q[1] = tail_index + 1; // update tail index
}
exports.enqueue = enqueue;
function swap(A, i, j) {
    const tmp = A[i];
    A[i] = A[j];
    A[j] = tmp;
}
/**
 * Retrieves the element with the highest priority from the queue.
 * If two elements have the same priority the one that was
 * enqueued first is returned.
 * @precondition Assumes q to be non-empty
 * @template T type of all queue elements
 * @param q queue to get the highest-priority element of
 * @returns Returns the element of the queue that has the highest priority.
 */
function head(q) {
    const head_index = q[0];
    return q[2][head_index][1];
}
exports.head = head;
/**
 * Removes the element with highest priority from a queue.
 * If two elements have the same priority the one that was
 * enqueued first is dequeued first.
 * @precondition Assumes q to be non-empty
 * @template T type of all queue elements
 * @param q queue to remove the element from
 * @modifies q such that the element with the highest priority is removed
 */
function dequeue(q) {
    const head_index = q[0];
    q[0] = head_index + 1;
}
exports.dequeue = dequeue;
/**
 * Pretty-prints the contents of a queue to standard output.
 * @template T type of all queue elements
 * @param q queue to pretty-print
 */
function display_queue(q) {
    console.log(q[2].slice(q[0], q[1]));
}
exports.display_queue = display_queue;
