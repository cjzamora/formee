(function(global, factory) {
    'use strict';

    if(typeof module === 'object' && typeof module.exports === 'object') {
        module.exports = function(window) {
            return factory(global);
        };
    } else {
        factory(global);
    }
})(typeof window !== 'undefined' ? window : this, function(window) {
    /**
     * Formee constructor that accepts
     * a form object to be parsed on later.
     *
     * @constructor
     * @param {string} form
     * @return {Object}
     */
    var Formee = function(form) {
        // short hand initialization
        if(!(this instanceof Formee)) {
            return new Formee(form);
        }

        // set ofrm
        this.form = form;

        return this;
    }, fn = Formee.prototype;

    /**
     * Form Object
     *
     * @type {Object}
     */
    fn.form = null;

    /**
     * Set's the target form.
     *
     * @param {Object} form
     * @return {Object}
     */
    fn.setForm = function(form) {
        // set the target form
        this.form = form;

        return this;
    };

    /**
     * Parses the inputs from the current
     * target form and convert it to url
     * encoded query string.
     *
     * @return {string}
     */
    fn.toQuery = function() {
        // get all the inputs
        var inputs = this.form.querySelectorAll('input,select,textarea');

        // holds the pairs
        var query  = [];

        // iterate on each inputs
        for(var i in inputs) {
            // get the input
            var input = inputs[i];

            // is input not an object?
            if(typeof input !== 'object') {
                continue;
            }

            // if input has name
            if(input.name) {
                // push it on our query
                query.push([
                    encodeURIComponent(input.name), 
                    encodeURIComponent(input.value)
                ].join('='));
            }
        }

        return query.join('&');
    };

    /**
     * Parses the inputs from the current
     * target form and convert it to a json
     * object.
     *
     * @return {Object}
     */
    fn.toJson = function() {
        // convert the current form to query
        var query = this.toQuery();

        // get the pairs by splitting it
        var pairs = query.split('&');

        // holds the result json
        var json  = {};

        // iterate on each pairs
        for(var i in pairs) {
            // split the pair by key -> value
            var pair = pairs[i].split('=');

            // decode the key
            var key = decodeURIComponent(pair.shift());
            // decode the value
            var value = decodeURIComponent(pair.shift());

            // convert to dot path
            // ex: a[b][c] -> a.b.c
            key = toDot(key);

            // split the keys
            var keys = key.split('.');

            // recurse on each keys
            recurse(json, value, keys, 0, keys.length);
        }

        return json;
    };

    /**
     * Recursively create the given keys to
     * the given object and then set the final
     * value in the end.
     *
     * @param {Object} object
     * @param {*mixed} value
     * @param {Array<string>} keys
     * @param {number} index
     * @param {number} max
     * @return Object
     */
    var recurse = function(object, value, keys, index, max) {
        // get the current key
        var key = keys[index];

        // check if current object is an array
        var isArray = isObjectArray(object);

        // check if key is an index
        var isArrayNext = isIndex(keys[index + 1]);

        // are we on the last part?
        if(index === (max - 1)) {
            // is it an array?      
            if(isArray) {
                // key is an index?
                if(!isNaN(key)) {
                    // set the index and value
                    object[key] = value;
                } else {
                    // push the value instead
                    object.push(value);
                }
            // else just set it
            } else {
                // set key + value
                object[key] = value;
            }

            return object;
        }

        // the current array index
        var current = 0;

        // are we in the first index?
        if(!isArray && !(key in object)) {
            if(!isArrayNext) {
                // set blank object
                object[key] = {};
            } else {
                // set an array
                object[key] = [];
            }
        } else if(isArray) {
            // get the current object length
            current = isArray && key !== '__index__' ? key : object.length;

            // is next object an array?
            if(!isArrayNext) {
                // set as object
                object[current] = {};
            } else {
                // set as array
                object[current] = [];
            }
        }

        // re-iterate the process
        recurse(isArray ? object[current] : object[key], value, keys, ++index, max);
        
        return object;
    };

    /**
     * Check's if the current object is an array
     *
     * @param {Object} object
     * @return {boolean}
     */
    var isObjectArray = function(object) {
        return Object.prototype.toString.call(object) === '[object Array]' ? true : false;
    }

    /**
     * Check's if the current string is an index
     *
     * @param {string} string
     * @return {boolean}
     */
    var isIndex = function(string) {
        return string === '__index__' || !isNaN(string) ? true : false;
    }

    /**
     * Converts a string that looks like an
     * array or object structure into a dot
     * separated keys.
     *
     * Ex: a[b][c] -> a.b.c | a[][c] -> a.__index__.c
     *
     * @param {string} string
     * @return {string}
     */
    var toDot = function(string) {
        // replace empty brackets with __index__
        string = string.replace(/\[\]/g, '.__index__');

        // open [ index
        var open = 0;
        // close ] index
        var close = 0;

        // number of skips from
        // the first open [
        var openSkips = 0;

        // number of skips until
        // the last ], it should be
        // equal with openSkips
        var closeSkips = 0;

        // current character index
        var index = 0;

        // split string into characters
        var chars = string.split('');

        // current character
        var char = null;

        // temporary hold characters
        var temp = chars;

        // while we still have characeters
        while(char = chars[index]) {
            // if it's an open bracket
            if(char == '[' && open == 0) {
                // get the index
                open = index;
            }

            // if it's an open bracket, increment
            if(char == '[') {
                // increment ...
                openSkips++;
            }

            // if it's a close bracket
            if(char == ']') {
                // increment ...
                closeSkips++;
            }

            // do we find the closing bracket of the first
            // open bracket that we've found?
            if(openSkips == closeSkips && closeSkips != 0) {
                // get the closing bracket index
                close = index;

                // replace [ with .
                temp[open] = '.';

                // if we are on the last index
                if(index == chars.length - 1) {
                    // set an empty string
                    temp[close] = '';

                // else
                } else {
                    // just put a .
                    temp[close] = '.';
                }

                // reset skips
                openSkips = 0;
                // reset skips
                closeSkips = 0;

                // reset open index
                open = 0;
                // reset close index
                close = 0;
            }

            index ++;
        }

        return temp.join('').replace(/\.\./g, '.');
    };

    // expose globally
    window.Formee = Formee;

    return Formee();
});