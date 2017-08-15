let v = require('wee-core/styles/variables');
let register = require('postcss-variables/lib/register');

/**
 * Add and overwrite variables here
 *
 * Example: v.colors.primary = '#58a324';
 */

/**
 * You can also use destructuring to edit variables with cleaner syntax.
 * Just make sure that the imported value is an object and
 * that object is being modified, not overwritten
 *
 * Example:
 * let { colors } = require('wee-core/styles/variables');
 *
 * // Good
 * colors.primary = '#58a324';
 *
 * // Bad - loses reference to original object
 * colors = {
 *      primary: '#58a324'
 * };
 */

module.exports = register(v);