export const WEEK = 604800
export const YEAR = 31536000
export const PAGE_SIZE = 50

export const PREV_TOKEN_COOKIE = 'prev_token'
export const TOKEN_COOKIE = 'token'
export const REFRESH_TOKEN_COOKIE = 'refresh_token'
export const LOCALE_COOKIE = 'lang'
//(?=.*[$@$!%*?&])
export const PASSWORD_PATTERN = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[A-Za-z\d$@$!%*?&]{8,256}/

export const VOLUME_UNITS = ['l', 'ml', 'qt', 'gal', 'floz', 'cup', 'pnt', 'Tbs', 'tsp']
export const LENGTH_UNITS = ["inch","m", "mm", "cm"]
export const MASS_UNITS = ['kg', 'g', 'mg', 'oz', 'lb']

// Raw material units
const _RAWMATERIAL_UNITS = [...VOLUME_UNITS, ...MASS_UNITS]
_RAWMATERIAL_UNITS.sort(function (a, b) {
    return a.toLowerCase().localeCompare(b.toLowerCase());
});
export const RAWMATERIAL_UNITS = ['drops', ..._RAWMATERIAL_UNITS]

// Component units
const _COMPONENT_UNITS = [...VOLUME_UNITS, ...MASS_UNITS, ...LENGTH_UNITS]
_COMPONENT_UNITS.sort(function (a, b) {
    return a.toLowerCase().localeCompare(b.toLowerCase());
});
export const COMPONENT_UNITS = ['pce', ..._COMPONENT_UNITS]

export const CURRENCIES = [
  {
    label: 'EUR',
    key: 'EUR',
    symbol: ['€', ''],
  },
  {
    label: 'USD',
    key: 'USD',
    symbol: ['$', ''],
  },
  {
    label: 'GBP',
    key: 'GBP',
    symbol: ['£', ''],
  },
]
