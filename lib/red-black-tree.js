"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.display_tree = exports.get_all_values = exports.get_all_keys = exports.build_tree = exports.insert = exports.search = exports.deep_equals = exports.is_empty_tree = exports.make_empty_tree = exports.right_branch = exports.left_branch = exports.value = exports.key = exports.is_red = void 0;
const list_1 = require("./list");
const black = false;
const red = true;
/**
 * Check whether a tree node is red.
 * @template T type of data stored in the red-black tree
 * @param node node to check
 * @returns Returns true if the node is red, false otherwise.
 */
function is_red(node) {
    return node[0];
}
exports.is_red = is_red;
/**
 * Get the key from a tree node.
 * @template T type of data stored in the red-black tree
 * @param node node to get the key from
 * @returns Returns the key from node.
 */
function key(node) {
    return node[1];
}
exports.key = key;
/**
 * Get the value from a tree node.
 * @template T type of data stored in the red-black tree
 * @param node node to get the value from
 * @returns Returns the value from node.
 */
function value(node) {
    return node[2];
}
exports.value = value;
/**
 * Get the left branch from a non-empty tree.
 * @template T type of data stored in the red-black tree
 * @param node tree node to get the left branch from
 * @returns Returns the tree corresponding to the left branch of node.
 */
function left_branch(node) {
    return node[3];
}
exports.left_branch = left_branch;
/**
 * Get the right branch from a non-empty tree.
 * @template T type of data stored in the red-black tree
 * @param node tree node to get the left branch from
 * @returns Returns the tree corresponding to the right branch of node.
 */
function right_branch(node) {
    return node[4];
}
exports.right_branch = right_branch;
/**
 * Create an empty red-black tree.
 * @template T type of data stored in the red-black tree
 * @returns Returns an empty red-black tree.
 */
function make_empty_tree() {
    return null;
}
exports.make_empty_tree = make_empty_tree;
/**
 * Check whether a tree is empty.
 * @template T type of data stored in the red-black tree
 * @param tree tree to check
 * @returns Returns true if tree is empty, false otherwise.
 */
function is_empty_tree(tree) {
    return tree === null;
}
exports.is_empty_tree = is_empty_tree;
// creates a leaf node with a specified color
function make_leaf(color, key, value) {
    return make_tree(color, key, value, make_empty_tree(), make_empty_tree());
}
// creates a tree node
function make_tree(color, key, value, left, right) {
    return [color, key, value, left, right];
}
/**
 * Compares two trees for structural equality.
 * @precondition Assumes that the values in the tree can be compared with '==='
 * @template T type of data stored in the red-black trees
 * @param tree1 one of the trees to compare
 * @param tree2 the other tree to compare
 * @returns Returns true if the trees have the same shape and the keys and
 *     values match at corresponding nodes.
 */
function deep_equals(tree1, tree2) {
    if (is_empty_tree(tree1) && is_empty_tree(tree2)) {
        return true;
    }
    else if (!is_empty_tree(tree1) && !is_empty_tree(tree2)) {
        if (key(tree1) === key(tree2) && value(tree1) === value(tree2)) {
            return deep_equals(left_branch(tree1), left_branch(tree2)) &&
                deep_equals(right_branch(tree1), right_branch(tree2));
        }
    }
    // all other cases, the trees are not the same
    return false;
}
exports.deep_equals = deep_equals;
/**
 * Looks up the value corresponding to a key.
 * @template T type of data stored in the red-black tree
 * @param tree tree to search
 * @param key key of the requested value
 * @returns Returns the value corresponding to the key k, or undefined if
 *      the key does not exists in tree.
 */
function search(tree, k) {
    if (is_empty_tree(tree)) {
        return undefined;
    }
    else if (key(tree) === k) {
        return value(tree);
    }
    else {
        return key(tree) > k
            ? search(left_branch(tree), k)
            : search(right_branch(tree), k);
    }
}
exports.search = search;
/**
 * Insert a key-value pair into the tree.
 * @template T type of data stored in the red-black tree
 * @param tree tree to insert into
 * @param new_key key to be inserted
 * @param new_value value corresponding to the key
 * @returns Returns a new tree with the key-value pair inserted, or if the key already exists
 *          updates the value to new_value.
 */
function insert(tree, new_key, new_value) {
    // last step: recolor root note black
    return recolor(insert_helper(tree, new_key, new_value), black);
}
exports.insert = insert;
function insert_helper(tree, new_key, new_value) {
    if (is_empty_tree(tree)) {
        return make_leaf(red, new_key, new_value);
    }
    else if (key(tree) === new_key) { // key already exists
        return make_tree(is_red(tree), new_key, new_value, left_branch(tree), right_branch(tree));
    }
    else {
        const k = key(tree);
        const left = left_branch(tree);
        const right = right_branch(tree);
        return k > new_key
            ? balance_left(is_red(tree), k, value(tree), insert_helper(left, new_key, new_value), right)
            : balance_right(is_red(tree), k, value(tree), left, insert_helper(right, new_key, new_value));
    }
}
// case 1 and 2, when new node is inserted on the left side
function balance_left(parent_color, parent_key, parent_value, left_tree, right_tree) {
    // parent is the z node
    // if z is red we don't need to do anything
    if (parent_color === black && is_red(left_tree)) {
        const left_left_tree = left_branch(left_tree);
        const right_left_tree = right_branch(left_tree);
        const left_left_red = !is_empty_tree(left_left_tree) && is_red(left_left_tree);
        const right_left_red = !is_empty_tree(right_left_tree) && is_red(right_left_tree);
        //the uncle is red, only need to recolor
        if (!is_empty_tree(right_tree) && is_red(right_tree) &&
            (left_left_red || right_left_red)) {
            return make_tree(red, parent_key, parent_value, recolor(left_tree, black), recolor(right_tree, black));
        }
        else if (left_left_red) {
            // case 1
            const y = left_tree;
            const x = left_left_tree;
            const a = left_branch(x);
            const b = right_branch(x);
            const c = right_branch(y);
            const d = right_tree;
            return make_tree(black, key(y), value(y), make_tree(red, key(x), value(x), a, b), // we could use recolor here
            make_tree(red, parent_key, parent_value, c, d));
        }
        else if (right_left_red) {
            // case 2
            const x = left_tree;
            const y = right_left_tree;
            const a = left_branch(x);
            const b = left_branch(y);
            const c = right_branch(y);
            const d = right_tree;
            return make_tree(black, key(y), value(y), make_tree(red, key(x), value(x), a, b), make_tree(red, parent_key, parent_value, c, d));
        }
    }
    // nothing to do
    return make_tree(parent_color, parent_key, parent_value, left_tree, right_tree);
}
// case 3 or 4, when new node is inserted on the left side
function balance_right(parent_color, parent_key, parent_value, left_tree, right_tree) {
    // parent is the x node
    // if x is red we don't need to do anything
    if (parent_color === black && is_red(right_tree)) {
        const left_right_tree = left_branch(right_tree);
        const right_right_tree = right_branch(right_tree);
        const left_right_red = !is_empty_tree(left_right_tree) && is_red(left_right_tree);
        const right_right_red = !is_empty_tree(right_right_tree) && is_red(right_right_tree);
        // the uncle is red, only need to recolor
        if (!is_empty_tree(left_tree) && is_red(left_tree) &&
            (left_right_red || right_right_red)) {
            return make_tree(red, parent_key, parent_value, recolor(left_tree, black), recolor(right_tree, black));
        }
        else if (left_right_red) {
            // case 3
            const y = left_right_tree;
            const z = right_tree;
            const a = left_tree;
            const b = left_branch(y);
            const c = right_branch(y);
            const d = right_right_tree;
            return make_tree(black, key(y), value(y), make_tree(red, parent_key, parent_value, a, b), make_tree(red, key(z), value(z), c, d));
        }
        else if (right_right_red) {
            // case 4
            const y = right_tree;
            const z = right_right_tree;
            const a = left_tree;
            const b = left_right_tree;
            const c = left_branch(z);
            const d = right_branch(z);
            return make_tree(black, key(y), value(y), make_tree(red, parent_key, parent_value, a, b), make_tree(red, key(z), value(z), c, d));
        }
    }
    // nothing to do
    return make_tree(parent_color, parent_key, parent_value, left_tree, right_tree);
}
function recolor(tree, new_color) {
    return make_tree(new_color, key(tree), value(tree), left_branch(tree), right_branch(tree));
}
/**
 * Construct a red-black tree from a list of data.
 * @template T type of data stored in the red-black tree
 * @param elements list of key-value pairs
 * @returns Returns a red-black tree with all data inserted; if there are duplicate
 *          keys, the last corresponding value will be added.
 */
function build_tree(elements) {
    function build(tree, elements) {
        return (0, list_1.is_null)(elements)
            ? tree
            : build(insert(tree, (0, list_1.head)(elements)[0], (0, list_1.head)(elements)[1]), (0, list_1.tail)(elements));
    }
    return build(make_empty_tree(), elements);
}
exports.build_tree = build_tree;
/**
 * Returns the in-sorted values of a tree.
 * @template T type of data stored in the red-black tree
 * @param tree tree to get values of
 * @returns Returns a list of values from the tree following an in-order traversal.
 */
function get_all_keys(tree) {
    return is_empty_tree(tree)
        ? (0, list_1.list)()
        : (0, list_1.append)((0, list_1.append)(get_all_keys(left_branch(tree)), (0, list_1.list)(key(tree))), get_all_keys(right_branch(tree)));
}
exports.get_all_keys = get_all_keys;
/**
 * Returns the in-sorted values of a tree.
 * @template T type of data stored in the red-black tree
 * @param tree tree to get values of
 * @returns Returns a list of values from the tree following an in-order traversal.
 */
function get_all_values(tree) {
    return is_empty_tree(tree)
        ? (0, list_1.list)()
        : (0, list_1.append)((0, list_1.append)(get_all_values(left_branch(tree)), (0, list_1.list)(value(tree))), get_all_values(right_branch(tree)));
}
exports.get_all_values = get_all_values;
/**
 * Convenience function to print a tree in a textual format to the console.
 * Red nodes are marked with asterisk (*node*).
 * @template T type of data stored in the red-black tree
 * @param tree tree to print
 */
function display_tree(tree) {
    display_tree_helper(tree, "", true);
}
exports.display_tree = display_tree;
function display_tree_helper(tree, path, leftmost) {
    if (tree === null) {
        return; // don't print the nulls
    }
    else {
        // print tree label, with indentation pre-fixed
        if (is_red(tree)) {
            console.log(path + "├─ *" + key(tree) + ": " + value(tree) + "*");
        }
        else {
            console.log(path + "├─ " + key(tree) + ": " + value(tree) + "");
        }
        // print right node first, then left
        if (leftmost) {
            display_tree_helper(right_branch(tree), "   " + path, false);
            display_tree_helper(left_branch(tree), "   " + path, leftmost);
        }
        else {
            display_tree_helper(right_branch(tree), path + "|  ", false);
            display_tree_helper(left_branch(tree), path + "|  ", leftmost);
        }
    }
}
