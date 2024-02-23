import { type Queue, empty, is_empty, enqueue, dequeue, head as qhead } from '../lib/queue_array';
import { type List, for_each, filter, enum_list  } from '../lib/list';
import { type ListGraph, type MatrixGraph } from '../lib/graphs'


// Build an array based on a function computing the item at each index
function build_array<T>(size: number, content: (i: number) => T): Array<T> {
    const result = Array<T>(size);
    for (var i = 0; i < size; i = i + 1) {
        result[i] = content(i);
    }
    return result;
}

/**
 * Node colours for traversal algorithms
 * @constant white an unvisited node
 * @constant grey a visited but not finished node
 * @constant black a finished node
 */
const white = 1;
const grey = 2;
const black = 3;


/**
 * Get the visit order of a breadth-first traversal of a ListGraph.
 * @param lg the list graph
 * @param initial the id of the starting node. Default 0.
 * @returns A queue with the visited nodes in visiting order.
 */
export function lg_bfs_visit_order({adj, size}: ListGraph, initial: number = 0): Queue<number> {     
    const result  = empty<number>();
    const pending = empty<number>();
    const colour  = build_array(size, _ => white);

    // visit a white node
    function bfs_visit(current: number) {
        colour[current] = grey;
        enqueue(current, result);
        enqueue(current, pending);
    }

    bfs_visit(initial);

    while (!is_empty(pending)) {
        const current = qhead(pending);
        dequeue(pending);
        for_each(bfs_visit, filter(node => colour[node] === white, adj[current]));
        colour[current] = black;
    }

    return result;
}

/**
 * Get the visit order of a depth-first traversal of a ListGraph.
 * @param lg the list graph
 * @param restart_order the order of nodes to restart the traversal in.
 *      Default: in numeric order 0, 1, 2, ...
 * @returns A queue with the visited nodes in visiting order.
 */
export function lg_dfs_visit_order({adj, size}: ListGraph, restart_order: List<number> = null): Queue<number> {        
    const result = empty<number>();
    const colour = build_array(size, _ => white);
    if (restart_order === null) {
        restart_order = enum_list(0, size - 1);
    } else {}

    // visit a node.  Each node is processed at most once.
    function dfs_visit(current: number) {
        if (colour[current] === white) {
            colour[current] = grey;
            enqueue(current, result);
            for_each(dfs_visit, adj[current]);
            colour[current] = black;
        } else {}
    }

    for_each(dfs_visit, restart_order);

    return result;
}

/**
 * Get the visit order of a depth-first traversal of a MatrixGraph.
 * @param mg the graph
 * @param restart_order the order of nodes to restart the traversal in.
 *      Default: in numeric order 0, 1, 2, ...
 * @returns A queue with the visited nodes in visiting order.
 */
export function mg_dfs_visit_order({adj, size}: MatrixGraph, restart_order: List<number> = null): Queue<number> {        
    const result = empty<number>();
    const colour = build_array(size, _ => white);
    if (restart_order === null) {
        restart_order = enum_list(0, size - 1);
    } else {}

    // visit a node. Each node is processed at most once.
    function dfs_visit(current: number) {
        if (colour[current] === white) {
            colour[current] = grey;
            enqueue(current, result);
            for (var sink = 0; sink < size; sink = sink + 1) {
                if(adj[current][sink]) {
                    dfs_visit(sink);
                } else {}
            }
            colour[current] = black;
        } else {}
    }

    for_each(dfs_visit, restart_order);

    return result;
}
