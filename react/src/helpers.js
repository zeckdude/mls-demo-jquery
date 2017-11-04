import { map as _map } from 'lodash';

/**
 * Create encoded URL string for key/value pairs in an object
 * @param  {object} object - An object of which its key/value pairs will become a URL encoded string
 * @example <caption>Example usage of createQueryStringFromObject.</caption>
 * const object = {
 *   color: 'red',
 *   size: 'large',
 *   distance: 40
 * }
 * createQueryStringFromObject(object);
 * // returns "color=red&size=large&distance=40"
 * @return {string} - URL encoded string of all key/value pairs in the object
 */
export const createQueryStringFromObject = object =>
  _map(object, (value, key) => `${encodeURIComponent(key)}=${encodeURIComponent(value)}`)
    .join('&');

/**
 * Create encoded URL string for for key/value pairs in multiple objects within an array
 * @param  {array} array - An array of objects of which their key/value pairs will become a URL encoded string
 * @example <caption>Example usage of createQueryStringFromArray.</caption>
 * const array = [
 *   { color: 'red' },
 *   { size: 'large' },
 *   { distance: 40 },
 *   { color: 'blue' }
 * ]
 * createQueryStringFromArray(array);
 * // returns "color=red&size=large&distance=40&color=blue"
 * @return {string} - URL encoded string of all key/value pairs in each object within the array
 */
export const createQueryStringFromArray = array =>
  _map(array, object => createQueryStringFromObject(object))
    .join('&');
