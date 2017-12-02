import { map as _map, each as _each } from 'lodash';

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

/**
 * Format Currency
 * https://stackoverflow.com/a/16233919/83916
 */
export const formatCurrency = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  minimumFractionDigits: 0,
  // the default value for minimumFractionDigits depends on the currency
  // and is usually already 2
}).format;

/**
 * Convert state between short and long form
 */
export const convertState = (word, to) => {
  const states = [
    { name: 'Alabama', abbreviation: 'AL' }, { name: 'Alaska', abbreviation: 'AK' }, { name: 'Arizona', abbreviation: 'AZ' },
    { name: 'Arkansas', abbreviation: 'AR' }, { name: 'California', abbreviation: 'CA' }, { name: 'Colorado', abbreviation: 'CO' },
    { name: 'Connecticut', abbreviation: 'CT' }, { name: 'Delaware', abbreviation: 'DE' }, { name: 'Florida', abbreviation: 'FL' },
    { name: 'Georgia', abbreviation: 'GA' }, { name: 'Hawaii', abbreviation: 'HI' }, { name: 'Idaho', abbreviation: 'ID' },
    { name: 'Illinois', abbreviation: 'IL' }, { name: 'Indiana', abbreviation: 'IN' }, { name: 'Iowa', abbreviation: 'IA' },
    { name: 'Kansas', abbreviation: 'KS' }, { name: 'Kentucky', abbreviation: 'KY' }, { name: 'Louisiana', abbreviation: 'LA' },
    { name: 'Maine', abbreviation: 'ME' }, { name: 'Maryland', abbreviation: 'MD' }, { name: 'Massachusetts', abbreviation: 'MA' },
    { name: 'Michigan', abbreviation: 'MI' }, { name: 'Minnesota', abbreviation: 'MN' }, { name: 'Mississippi', abbreviation: 'MS' },
    { name: 'Missouri', abbreviation: 'MO' }, { name: 'Montana', abbreviation: 'MT' }, { name: 'Nebraska', abbreviation: 'NE' },
    { name: 'Nevada', abbreviation: 'NV' }, { name: 'New Hampshire', abbreviation: 'NH' }, { name: 'New Jersey', abbreviation: 'NJ' },
    { name: 'New Mexico', abbreviation: 'NM' }, { name: 'New York', abbreviation: 'NY' }, { name: 'North Carolina', abbreviation: 'NC' },
    { name: 'North Dakota', abbreviation: 'ND' }, { name: 'Ohio', abbreviation: 'OH' }, { name: 'Oklahoma', abbreviation: 'OK' },
    { name: 'Oregon', abbreviation: 'OR' }, { name: 'Pennsylvania', abbreviation: 'PA' }, { name: 'Rhode Island', abbreviation: 'RI' },
    { name: 'South Carolina', abbreviation: 'SC' }, { name: 'South Dakota', abbreviation: 'SD' }, { name: 'Tennessee', abbreviation: 'TN' },
    { name: 'Texas', abbreviation: 'TX' }, { name: 'Utah', abbreviation: 'UT' }, { name: 'Vermont', abbreviation: 'VT' },
    { name: 'Virginia', abbreviation: 'VA' }, { name: 'Washington', abbreviation: 'WA' }, { name: 'West Virginia', abbreviation: 'WV' },
    { name: 'Wisconsin', abbreviation: 'WI' }, { name: 'Wyoming', abbreviation: 'WY' },
  ];

  const selectedState = states.find((state) => {
    if (to === 'abbreviation') {
      return state.name.toUpperCase() === word.toUpperCase();
    }

    if (to === 'name') {
      return state.abbreviation === word.toUpperCase();
    }

    return false;
  });

  // Return the state in the version requested (name or abbreviation)
  return selectedState[to];
};
