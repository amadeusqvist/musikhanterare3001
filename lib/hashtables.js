"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ph_keys = exports.ph_delete = exports.ph_insert = exports.ph_lookup = exports.ph_empty = exports.probe_double = exports.probe_quadratic = exports.probe_linear = exports.ch_keys = exports.ch_delete = exports.ch_insert = exports.ch_lookup = exports.ch_empty = exports.hash_id = void 0;
var list_1 = require("./list");
/**
 * The identity function as a hash function
 * Do not use except for learning about hash tables
 * @param key the key
 * @returns key
 */
var hash_id = function (key) { return key; };
exports.hash_id = hash_id;
/**
 * Create an empty chaining hash table
 * @template K the type of keys
 * @template V the type of values
 * @param size the number of chains (should be close to max expected size)
 * @param hash the hash function
 * @precondition the type of values does not contain undefined
 * @returns an empty hash table
 */
function ch_empty(size, hash) {
    var arr = new Array(size);
    for (var i = 0; i < size; i++) {
        arr[i] = null;
    }
    return { arr: arr, hash: hash };
}
exports.ch_empty = ch_empty;
/**
 * Scan an association list for the given key.
 * @template K the type of keys
 * @template V the type of values
 * @param xs the list to scan
 * @param key the key to scan for
 * @returns the associated value, or undefined if it does not exist.
 */
function scan(xs, key) {
    return (0, list_1.is_null)(xs)
        ? undefined
        : key === (0, list_1.head)((0, list_1.head)(xs))
            ? (0, list_1.tail)((0, list_1.head)(xs))
            : scan((0, list_1.tail)(xs), key);
}
/**
 * Search a hash table for the given key.
 * @template K the type of keys
 * @template V the type of values
 * @param table the hash table to scan
 * @param key the key to scan for
 * @returns the associated value, or undefined if it does not exist.
 */
function ch_lookup(_a, key) {
    var arr = _a.arr, hash = _a.hash;
    return scan(arr[hash(key) % arr.length], key);
}
exports.ch_lookup = ch_lookup;
/**
 * Insert a key-value pair into a chaining hash table.
 * Overwrites the existing value associated with the key, if any.
 * @template K the type of keys
 * @template V the type of values
 * @param table the hash table
 * @param key the key to insert at
 * @param value the value to insert
 * @returns true iff the key already existed
 */
function ch_insert(_a, key, value) {
    var arr = _a.arr, hash = _a.hash;
    var index = hash(key) % arr.length;
    if (scan(arr[index], key) === undefined) {
        arr[index] = (0, list_1.pair)((0, list_1.pair)(key, value), arr[index]);
        return false;
    }
    else {
        arr[index] = (0, list_1.map)(function (kv) { return key === (0, list_1.head)(kv) ? (0, list_1.pair)(key, value) : kv; }, arr[index]);
        return true;
    }
}
exports.ch_insert = ch_insert;
/**
 * Delete a key-value pair from a chaining hash table.
 * @template K the type of keys
 * @template V the type of values
 * @param table the hash table
 * @param key the key to delete
 * @returns true iff the key existed
 */
function ch_delete(_a, key) {
    var arr = _a.arr, hash = _a.hash;
    var index = hash(key) % arr.length;
    if (scan(arr[index], key) === undefined) {
        return false;
    }
    else {
        arr[index] = (0, list_1.filter)(function (kv) { return (0, list_1.head)(kv) !== key; }, arr[index]);
        return true;
    }
}
exports.ch_delete = ch_delete;
/**
 * Get all keys in a chaining hash table.
 * @template K the type of keys
 * @template V the type of values
 * @param table the hash table
 * @returns all keys in the table
 */
function ch_keys(tab) {
    return (0, list_1.map)(list_1.head, (0, list_1.flatten)((0, list_1.build_list)(function (i) { return tab.arr[i]; }, tab.arr.length)));
}
exports.ch_keys = ch_keys;
// linear probing with a given hash function
function probe_linear(hash) {
    return function (length, key, i) { return (hash(key) + i) % length; };
}
exports.probe_linear = probe_linear;
//quadratic probing with a given hash function
function probe_quadratic(hash) {
    return function (length, key, i) { return (hash(key) + i * i) % length; };
}
exports.probe_quadratic = probe_quadratic;
//double hashing
function probe_double(base_hash, probe_hash) {
    return function (length, key, i) {
        return (base_hash(key) + i * probe_hash(key)) % length;
    };
}
exports.probe_double = probe_double;
/**
 * Create an empty probing hash table
 * @template K the type of keys
 * @template V the type of values
 * @param length the maximum number of elements to accomodate
 * @param hash the hash function
 * @precondition the key type K contains neither null nor undefined
 * @returns an empty hash table
 */
function ph_empty(length, probe) {
    return { keys: new Array(length), data: new Array(length), probe: probe, size: 0 };
}
exports.ph_empty = ph_empty;
// helper function implementing probing from a given probe index i
function probe_from(_a, key, i) {
    var keys = _a.keys, probe = _a.probe;
    function step(i) {
        var index = probe(keys.length, key, i);
        return i === keys.length || keys[index] === undefined
            ? undefined
            : keys[index] === key
                ? index
                : step(i + 1);
    }
    return step(i);
}
/**
 * Search a hash table for the given key.
 * @template K the type of keys
 * @template V the type of values
 * @param table the hash table to scan
 * @param key the key to scan for
 * @returns the associated value, or undefined if it does not exist.
 */
function ph_lookup(tab, key) {
    var index = probe_from(tab, key, 0);
    return index === undefined
        ? undefined
        : tab.data[index];
}
exports.ph_lookup = ph_lookup;
/**
 * Insert a key-value pair into a probing hash table.
 * Overwrites the existing value associated with the key, if any.
 * @template K the type of keys
 * @template V the type of values
 * @param table the hash table
 * @param key the key to insert at
 * @param value the value to insert
 * @returns true iff the insertion succeeded (the hash table was not full)
 */
function ph_insert(tab, key, value) {
    function insertAt(index) {
        tab.keys[index] = key;
        tab.data[index] = value;
        tab.size = tab.size + 1;
        return true;
    }
    function insertFrom(i) {
        var index = tab.probe(tab.keys.length, key, i);
        if (tab.keys[index] === key || tab.keys[index] === undefined) {
            return insertAt(index);
        }
        else if (tab.keys[index] === null) {
            var location_1 = probe_from(tab, key, i);
            return insertAt(location_1 === undefined ? index : location_1);
        }
        else {
            return insertFrom(i + 1);
        }
    }
    return tab.keys.length === tab.size ? false : insertFrom(0);
}
exports.ph_insert = ph_insert;
/**
 * Delete a key-value pair from a probing hash table.
 * @template K the type of keys
 * @template V the type of values
 * @param table the hash table
 * @param key the key to delete
 * @returns true iff the key existed
 */
function ph_delete(tab, key) {
    var index = probe_from(tab, key, 0);
    if (index === undefined) {
        return false;
    }
    else {
        tab.keys[index] = null;
        tab.size = tab.size - 1;
        return true;
    }
}
exports.ph_delete = ph_delete;
/**
 * Filters out nulls and undefined values from a list, and from its element type
 * @template T the element type of the resulting list
 * @param xs a list with nulls and undefined values
 * @returns the input list without nulls and undefined values
 */
function filterNulls(xs) {
    if ((0, list_1.is_null)(xs)) {
        return null;
    }
    else {
        var x = (0, list_1.head)(xs);
        if (x === undefined || x === null) {
            return filterNulls((0, list_1.tail)(xs));
        }
        else {
            return (0, list_1.pair)(x, filterNulls((0, list_1.tail)(xs)));
        }
    }
}
/**
 * Extract all the keys of a probing hash table
 * @template K
 * @template V
 * @param {ProbingHashtable<K,V>} tab
 * @returns all the keys of the table
 */
function ph_keys(tab) {
    return filterNulls((0, list_1.build_list)(function (i) { return tab.keys[i]; }, tab.keys.length));
}
exports.ph_keys = ph_keys;
