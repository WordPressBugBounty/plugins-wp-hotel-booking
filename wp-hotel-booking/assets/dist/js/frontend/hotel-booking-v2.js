/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./assets/js/frontend/flatpickr-locale-utils.js"
/*!******************************************************!*\
  !*** ./assets/js/frontend/flatpickr-locale-utils.js ***!
  \******************************************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   FLATPICKR_RANGE_SEPARATOR: () => (/* binding */ FLATPICKR_RANGE_SEPARATOR),
/* harmony export */   applyFlatpickrLocaleConfig: () => (/* binding */ applyFlatpickrLocaleConfig),
/* harmony export */   applyMinEndDateToDayElement: () => (/* binding */ applyMinEndDateToDayElement),
/* harmony export */   buildLocaleCandidates: () => (/* binding */ buildLocaleCandidates),
/* harmony export */   createBookingDateHelpers: () => (/* binding */ createBookingDateHelpers),
/* harmony export */   createFlatpickrConfig: () => (/* binding */ createFlatpickrConfig),
/* harmony export */   createFlatpickrLocaleConfig: () => (/* binding */ createFlatpickrLocaleConfig),
/* harmony export */   createMinEndDateDayCreateHandler: () => (/* binding */ createMinEndDateDayCreateHandler),
/* harmony export */   formatDateRangeValue: () => (/* binding */ formatDateRangeValue),
/* harmony export */   getBookingDateFields: () => (/* binding */ getBookingDateFields),
/* harmony export */   getBrowserLocales: () => (/* binding */ getBrowserLocales),
/* harmony export */   getFlatpickrFirstDayOfWeekFromObject: () => (/* binding */ getFlatpickrFirstDayOfWeekFromObject),
/* harmony export */   getMinBookingDays: () => (/* binding */ getMinBookingDays),
/* harmony export */   getMinEndDateFromStartDate: () => (/* binding */ getMinEndDateFromStartDate),
/* harmony export */   mapBookingTimestampsToDates: () => (/* binding */ mapBookingTimestampsToDates),
/* harmony export */   normalizeBookingDateFieldsForSubmit: () => (/* binding */ normalizeBookingDateFieldsForSubmit),
/* harmony export */   normalizeBookingDateInputValue: () => (/* binding */ normalizeBookingDateInputValue),
/* harmony export */   parseDateStrict: () => (/* binding */ parseDateStrict),
/* harmony export */   parseDateStringStrict: () => (/* binding */ parseDateStringStrict),
/* harmony export */   resolveBrowserLocaleConfig: () => (/* binding */ resolveBrowserLocaleConfig),
/* harmony export */   splitDateRangeValue: () => (/* binding */ splitDateRangeValue),
/* harmony export */   syncBookingDateFieldsForUi: () => (/* binding */ syncBookingDateFieldsForUi),
/* harmony export */   validateBookingDateRange: () => (/* binding */ validateBookingDateRange)
/* harmony export */ });
const FLATPICKR_RANGE_SEPARATOR = '-';
const FLATPICKR_BROWSER_LOCALE_ALIASES = {
  // flatpickr uses `vn` for Vietnamese instead of `vi`.
  vi: 'vn',
  'vi-vn': 'vn',
  vi_vn: 'vn'
};

/**
 * Normalize locale keys so matching works across `vi_VN`, `vi-vn`, `VI-vn`, etc.
 */
const normalizeLocaleKey = localeKey => String(localeKey || '').trim().replace(/_/g, '-').toLowerCase();

/**
 * Detect a single locale config object (has month/week labels) rather than a locale map.
 */
const isFlatpickrSingleLocaleConfig = localeConfig => Boolean(localeConfig && typeof localeConfig === 'object' && (localeConfig.weekdays || localeConfig.months));

/**
 * Detect a locale map object where keys are locale ids (`en`, `fr`, `vn`, ...).
 */
const isFlatpickrLocaleMap = localeMap => Boolean(localeMap && typeof localeMap === 'object' && !isFlatpickrSingleLocaleConfig(localeMap) && Object.keys(localeMap).length > 0);

/**
 * Unwrap locale modules that may be nested by bundler interop (`default.default`).
 */
const unwrapFlatpickrLocaleModule = (flatpickrLocales = {}) => {
  let localeSource = flatpickrLocales;
  let maxDepth = 5;

  // Support nested UMD/ESM interop wrappers such as `default.default`.
  while (maxDepth > 0 && localeSource && typeof localeSource === 'object' && localeSource.default && typeof localeSource.default === 'object') {
    const rootKeys = Object.keys(localeSource).filter(key => key !== '__esModule');
    const defaultLocaleSource = localeSource.default;
    const defaultLooksLikeLocaleSource = isFlatpickrLocaleMap(defaultLocaleSource) || isFlatpickrSingleLocaleConfig(defaultLocaleSource);
    const shouldUnwrapBySingleDefaultKey = rootKeys.length === 1 && rootKeys[0] === 'default';
    const shouldUnwrapByNonLocaleWrapper = !isFlatpickrLocaleMap(localeSource) && defaultLooksLikeLocaleSource;
    if (!shouldUnwrapBySingleDefaultKey && !shouldUnwrapByNonLocaleWrapper) {
      break;
    }
    localeSource = defaultLocaleSource;
    maxDepth--;
  }
  return localeSource;
};

/**
 * Return a normalized locale map regardless of module export shape.
 */
const extractFlatpickrLocalesMap = (flatpickrLocales = {}) => {
  let localeSource = unwrapFlatpickrLocaleModule(flatpickrLocales);
  if (localeSource && typeof localeSource === 'object' && localeSource.default && typeof localeSource.default === 'object') {
    const rootLooksLikeLocaleMap = isFlatpickrLocaleMap(localeSource);
    const defaultLooksLikeLocaleMap = isFlatpickrLocaleMap(localeSource.default);

    // Use default export only when the root object is a module wrapper.
    if (!rootLooksLikeLocaleMap && defaultLooksLikeLocaleMap) {
      localeSource = localeSource.default;
    }
  }
  if (isFlatpickrSingleLocaleConfig(localeSource)) {
    return {
      default: localeSource,
      en: localeSource
    };
  }
  if (isFlatpickrLocaleMap(localeSource)) {
    return localeSource;
  }
  return {};
};

/**
 * Preserve insertion order while removing duplicates.
 */
const uniq = values => values.filter((value, index) => values.indexOf(value) === index);

/**
 * Convert and validate first day of week from admin settings (0..6).
 */
const getFlatpickrFirstDayOfWeekFromObject = (firstDayOfWeek, fallback = 1) => {
  const parsed = Number.parseInt(firstDayOfWeek, 10);
  if (Number.isNaN(parsed) || parsed < 0 || parsed > 6) {
    return fallback;
  }
  return parsed;
};

/**
 * Read browser locale preferences in priority order.
 */
const getBrowserLocales = () => {
  if (typeof navigator === 'undefined') {
    return [];
  }
  if (Array.isArray(navigator.languages) && navigator.languages.length) {
    return navigator.languages;
  }
  if (navigator.language) {
    return [navigator.language];
  }
  return [];
};

/**
 * Build locale lookup candidates from browser locales:
 * full locale -> alias -> base locale -> base alias -> `en`.
 */
const buildLocaleCandidates = (browserLocales = []) => {
  const localeList = Array.isArray(browserLocales) ? browserLocales : [browserLocales];
  const candidates = [];
  localeList.forEach(localeItem => {
    const normalized = normalizeLocaleKey(localeItem);
    if (!normalized) {
      return;
    }
    candidates.push(normalized);
    const alias = FLATPICKR_BROWSER_LOCALE_ALIASES[normalized];
    if (alias) {
      candidates.push(alias);
    }
    const baseLocale = normalized.split('-')[0];
    if (baseLocale && baseLocale !== normalized) {
      // Example: `fr-CA` -> `fr` fallback when region-specific key is missing.
      candidates.push(baseLocale);
      const baseAlias = FLATPICKR_BROWSER_LOCALE_ALIASES[baseLocale];
      if (baseAlias) {
        candidates.push(baseAlias);
      }
    }
  });
  candidates.push('en');
  return uniq(candidates);
};

/**
 * Resolve the best matching locale config from browser locales.
 */
const resolveBrowserLocaleConfig = (flatpickrLocales = {}, browserLocales = []) => {
  const rawLocales = extractFlatpickrLocalesMap(flatpickrLocales);
  const localeConfigMap = {};
  Object.keys(rawLocales).forEach(localeKey => {
    localeConfigMap[normalizeLocaleKey(localeKey)] = rawLocales[localeKey];
  });

  // Pick the first matched browser locale, then fallback to English.
  const candidates = buildLocaleCandidates(browserLocales);
  const matchedLocaleKey = candidates.find(candidate => localeConfigMap[candidate]) || 'en';
  const matchedLocaleConfig = localeConfigMap[matchedLocaleKey] || localeConfigMap.en || rawLocales.en || {};
  return {
    localeKey: matchedLocaleKey,
    localeConfig: {
      ...matchedLocaleConfig
    }
  };
};

/**
 * Create final flatpickr locale config merged with admin-controlled values.
 */
const createFlatpickrLocaleConfig = (flatpickrLocales = {}, firstDayOfWeek = 1) => {
  const {
    localeConfig
  } = resolveBrowserLocaleConfig(flatpickrLocales, getBrowserLocales());
  const parsedFirstDayOfWeek = getFlatpickrFirstDayOfWeekFromObject(firstDayOfWeek, 1);
  return {
    ...localeConfig,
    firstDayOfWeek: parsedFirstDayOfWeek,
    rangeSeparator: FLATPICKR_RANGE_SEPARATOR
  };
};

/**
 * Apply locale config globally and ensure current defaults keep week start/separator.
 */
const applyFlatpickrLocaleConfig = (flatpickrInstance, localeConfig = {}) => {
  if (!flatpickrInstance || !localeConfig) {
    return;
  }
  flatpickrInstance.localize(localeConfig);
  if (flatpickrInstance.l10ns && flatpickrInstance.l10ns.default) {
    flatpickrInstance.l10ns.default.firstDayOfWeek = localeConfig.firstDayOfWeek;
    flatpickrInstance.l10ns.default.rangeSeparator = localeConfig.rangeSeparator;
  }
};

/**
 * Strictly parse date by format and verify by format round-trip.
 */
const parseDateStrict = (flatpickrInstance, value, format) => {
  if (!flatpickrInstance || !value || !format) {
    return null;
  }
  const parsed = flatpickrInstance.parseDate(value, format, true);
  if (!parsed) {
    return null;
  }

  // Round-trip validation prevents ambiguous dates like 03/04/2026 from being misread.
  return flatpickrInstance.formatDate(parsed, format) === value ? parsed : null;
};

/**
 * Strictly parse supported booking date formats without depending on flatpickr runtime.
 */
const parseDateStringStrict = (value, format) => {
  const dateValue = String(value || '').trim();
  const dateFormat = String(format || '').trim();
  if (!dateValue || !dateFormat) {
    return null;
  }
  let regexPattern = '';
  const escapedRegexChar = /[.*+?^${}()|[\]\\]/g;
  for (let i = 0; i < dateFormat.length; i++) {
    const token = dateFormat[i];
    if (token === 'Y') {
      regexPattern += '(?<year>\\d{4})';
    } else if (token === 'm') {
      regexPattern += '(?<month>\\d{1,2})';
    } else if (token === 'd') {
      regexPattern += '(?<day>\\d{1,2})';
    } else {
      regexPattern += token.replace(escapedRegexChar, '\\$&');
    }
  }
  const matched = dateValue.match(new RegExp(`^${regexPattern}$`));
  if (!matched || !matched.groups) {
    return null;
  }
  const year = Number.parseInt(matched.groups.year || '', 10);
  const month = Number.parseInt(matched.groups.month || '', 10);
  const day = Number.parseInt(matched.groups.day || '', 10);
  if (!year || !month || !day) {
    return null;
  }
  const parsed = new Date(year, month - 1, day);
  if (parsed.getFullYear() !== year || parsed.getMonth() !== month - 1 || parsed.getDate() !== day) {
    return null;
  }
  return parsed;
};

/**
 * Normalize a raw booking date string into internal submit format.
 */
const normalizeBookingDateInputValue = (value, frontendDateFormat, internalDateFormat = 'Y/m/d') => {
  const dateValue = String(value || '').trim();
  if (!dateValue) {
    return '';
  }
  const formats = [frontendDateFormat, internalDateFormat].filter((format, index, arr) => format && arr.indexOf(format) === index);
  for (let i = 0; i < formats.length; i++) {
    const parsed = parseDateStringStrict(dateValue, formats[i]);
    if (parsed) {
      const year = parsed.getFullYear();
      const month = String(parsed.getMonth() + 1).padStart(2, '0');
      const day = String(parsed.getDate()).padStart(2, '0');
      return `${year}/${month}/${day}`;
    }
  }
  return '';
};
const getBookingDateFieldSelector = (selector, fallback) => String(selector || fallback || '').trim() || fallback;

/**
 * Read check-in/check-out inputs from a form or any container node.
 */
const getBookingDateFields = (container, {
  checkInSelector = 'input[name="check_in_date"]',
  checkOutSelector = 'input[name="check_out_date"]'
} = {}) => {
  if (!container || typeof container.querySelector !== 'function') {
    return {
      checkInField: null,
      checkOutField: null
    };
  }
  return {
    checkInField: container.querySelector(getBookingDateFieldSelector(checkInSelector, 'input[name="check_in_date"]')),
    checkOutField: container.querySelector(getBookingDateFieldSelector(checkOutSelector, 'input[name="check_out_date"]'))
  };
};

/**
 * Normalize booking inputs into canonical submit format and write back to the fields.
 */
const normalizeBookingDateFieldsForSubmit = (container, frontendDateFormat, internalDateFormat = 'Y/m/d', selectors = {}, {
  writeBack = true
} = {}) => {
  const {
    checkInField,
    checkOutField
  } = getBookingDateFields(container, selectors);
  const checkInDate = normalizeBookingDateInputValue(checkInField?.value, frontendDateFormat, internalDateFormat);
  const checkOutDate = normalizeBookingDateInputValue(checkOutField?.value, frontendDateFormat, internalDateFormat);
  if (writeBack && checkInField && checkInDate) {
    checkInField.value = checkInDate;
  }
  if (writeBack && checkOutField && checkOutDate) {
    checkOutField.value = checkOutDate;
  }
  return {
    checkInField,
    checkOutField,
    checkInDate,
    checkOutDate
  };
};

/**
 * Build parse/format helpers for booking fields and submit payloads.
 */
const createBookingDateHelpers = (flatpickrInstance, frontendDateFormat, internalDateFormat) => {
  const parseBookingDateValue = value => {
    const dateValue = String(value || '').trim();
    if (!dateValue) {
      return null;
    }
    const formats = [frontendDateFormat, internalDateFormat].filter((format, index, arr) => format && arr.indexOf(format) === index);
    for (let i = 0; i < formats.length; i++) {
      const parsed = parseDateStrict(flatpickrInstance, dateValue, formats[i]);
      if (parsed) {
        return parsed;
      }
    }
    return null;
  };

  // Reuse strict parser first, then fallback to flatpickr parser for UI operations.
  const parseFlatpickrDate = (value, format) => {
    if (value instanceof Date) {
      return value;
    }
    const parsed = parseBookingDateValue(value);
    if (parsed) {
      return parsed;
    }
    return flatpickrInstance.parseDate(value, format || frontendDateFormat, true);
  };
  const formatBookingDate = (date, format = frontendDateFormat) => flatpickrInstance.formatDate(date, format);
  const formatBookingDateForUi = date => flatpickrInstance.formatDate(date, frontendDateFormat);
  const formatBookingDateForSubmit = date => flatpickrInstance.formatDate(date, internalDateFormat);
  return {
    parseBookingDateValue,
    parseFlatpickrDate,
    formatBookingDate,
    formatBookingDateForUi,
    formatBookingDateForSubmit
  };
};

/**
 * Normalize prefilled booking inputs into the active UI format before flatpickr binds.
 */
const syncBookingDateFieldsForUi = ({
  checkInField = null,
  checkOutField = null,
  rangeField = null,
  rangeSeparator = FLATPICKR_RANGE_SEPARATOR
}, {
  parseBookingDateValue,
  formatBookingDateForUi
}) => {
  const parsedCheckInDate = parseBookingDateValue?.(checkInField?.value);
  const parsedCheckOutDate = parseBookingDateValue?.(checkOutField?.value);
  if (parsedCheckInDate && checkInField) {
    checkInField.value = formatBookingDateForUi(parsedCheckInDate);
  }
  if (parsedCheckOutDate && checkOutField) {
    checkOutField.value = formatBookingDateForUi(parsedCheckOutDate);
  }
  if (rangeField && parsedCheckInDate && parsedCheckOutDate) {
    rangeField.value = formatDateRangeValue(formatBookingDateForUi(parsedCheckInDate), formatBookingDateForUi(parsedCheckOutDate), rangeSeparator);
  }
  return {
    parsedCheckInDate,
    parsedCheckOutDate
  };
};

/**
 * Validate booking dates with strict parsing and optionally rewrite inputs for submit.
 */
const validateBookingDateRange = (container, {
  parseBookingDateValue,
  formatBookingDateForSubmit,
  checkInSelector = 'input[name="check_in_date"]',
  checkOutSelector = 'input[name="check_out_date"]',
  emptyCheckInMessage = 'Please select check in date.',
  emptyCheckOutMessage = 'Please select check out date.',
  invalidRangeMessage = 'Check out date must be greater than the check in.',
  toggleErrorClass = false,
  normalizeFieldValues = false
} = {}) => {
  const {
    checkInField,
    checkOutField
  } = getBookingDateFields(container, {
    checkInSelector,
    checkOutSelector
  });
  if (!checkInField || !checkOutField) {
    return {
      ok: false,
      error: invalidRangeMessage,
      checkInField,
      checkOutField,
      checkInDate: '',
      checkOutDate: ''
    };
  }
  if (toggleErrorClass) {
    checkInField.classList.remove('error');
    checkOutField.classList.remove('error');
  }
  const checkInDateObject = parseBookingDateValue?.(checkInField.value);
  if (!checkInDateObject) {
    if (toggleErrorClass) {
      checkInField.classList.add('error');
    }
    return {
      ok: false,
      error: emptyCheckInMessage,
      checkInField,
      checkOutField,
      checkInDate: '',
      checkOutDate: ''
    };
  }
  const checkOutDateObject = parseBookingDateValue?.(checkOutField.value);
  if (!checkOutDateObject) {
    if (toggleErrorClass) {
      checkOutField.classList.add('error');
    }
    return {
      ok: false,
      error: emptyCheckOutMessage,
      checkInField,
      checkOutField,
      checkInDate: '',
      checkOutDate: ''
    };
  }
  const checkInDate = formatBookingDateForSubmit?.(checkInDateObject) || '';
  const checkOutDate = formatBookingDateForSubmit?.(checkOutDateObject) || '';
  if (!checkInDate || !checkOutDate || checkOutDate <= checkInDate) {
    if (toggleErrorClass) {
      checkInField.classList.add('error');
      checkOutField.classList.add('error');
    }
    return {
      ok: false,
      error: invalidRangeMessage,
      checkInField,
      checkOutField,
      checkInDate,
      checkOutDate
    };
  }
  if (normalizeFieldValues) {
    checkInField.value = checkInDate;
    checkOutField.value = checkOutDate;
  }
  return {
    ok: true,
    error: '',
    checkInField,
    checkOutField,
    checkInDate,
    checkOutDate
  };
};

/**
 * Build a standard flatpickr config so all pickers share parser, locale, and defaults.
 */
const createFlatpickrConfig = ({
  dateFormat,
  parseDate,
  locale,
  disableMobile = true
} = {}, overrides = {}) => ({
  dateFormat,
  parseDate,
  disableMobile,
  locale,
  ...overrides
});

/**
 * Join two date values into one range string using configured separator.
 */
const formatDateRangeValue = (startDateValue = '', endDateValue = '', rangeSeparator = FLATPICKR_RANGE_SEPARATOR) => `${String(startDateValue || '')}${String(rangeSeparator || FLATPICKR_RANGE_SEPARATOR)}${String(endDateValue || '')}`;

/**
 * Split a range string into date parts while handling regex-special separators safely.
 */
const splitDateRangeValue = (dateRangeValue = '', rangeSeparator = FLATPICKR_RANGE_SEPARATOR) => {
  const rawValue = String(dateRangeValue || '').trim();
  if (!rawValue) {
    return [];
  }

  // Escape separators like `-`, `.`, `|` before building the split regex.
  const escapedSeparator = String(rangeSeparator || FLATPICKR_RANGE_SEPARATOR).replace(/[-/\\^$*+?.()|[\]{}]/g, '\\$&');
  const splitBySeparatorRegex = new RegExp(`\\s*${escapedSeparator}\\s*`);
  return rawValue.split(splitBySeparatorRegex).map(value => value.trim()).filter(Boolean);
};

/**
 * Convert Unix timestamps (seconds) into calendar-only Date objects for flatpickr disable lists.
 */
const mapBookingTimestampsToDates = (timestamps = []) => (Array.isArray(timestamps) ? timestamps : []).map(timestamp => {
  const parsedTimestamp = Number.parseInt(timestamp, 10);
  if (Number.isNaN(parsedTimestamp)) {
    return null;
  }
  const date = new Date(parsedTimestamp * 1000);
  return new Date(date.getFullYear(), date.getMonth(), date.getDate());
}).filter(Boolean);

/**
 * Normalize min-stay settings so `0` or invalid values fall back to one night.
 */
const getMinBookingDays = (minBookingDate, fallback = 1) => {
  const parsedValue = Number.parseInt(minBookingDate, 10);
  if (Number.isNaN(parsedValue) || parsedValue <= 0) {
    return fallback;
  }
  return parsedValue;
};

/**
 * Compute the earliest allowed end date for a selected start date.
 */
const getMinEndDateFromStartDate = (startDate, minBookingDays = 1) => {
  if (!(startDate instanceof Date) || Number.isNaN(startDate.getTime())) {
    return null;
  }
  const minEndDate = new Date(startDate);
  minEndDate.setDate(minEndDate.getDate() + getMinBookingDays(minBookingDays));
  return minEndDate;
};

/**
 * Disable calendar cells that fall before the current minimum end date.
 */
const applyMinEndDateToDayElement = (dayElem, minEndDate) => {
  if (!dayElem || !dayElem.dateObj || !minEndDate || !(minEndDate instanceof Date) || Number.isNaN(minEndDate.getTime())) {
    return;
  }
  if (dayElem.dateObj < minEndDate) {
    dayElem.classList.add('flatpickr-disabled');
    dayElem.setAttribute('aria-disabled', 'true');
  }
};

/**
 * Create an `onDayCreate` handler that reads min-end-date state from a callback.
 */
const createMinEndDateDayCreateHandler = getMinEndDate => (dObj, dStr, fpInstance, dayElem) => {
  applyMinEndDateToDayElement(dayElem, getMinEndDate?.() || null);
};

/***/ },

/***/ "./assets/js/utils.js"
/*!****************************!*\
  !*** ./assets/js/utils.js ***!
  \****************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   addQueryArgs: () => (/* binding */ addQueryArgs),
/* harmony export */   className: () => (/* binding */ className),
/* harmony export */   fetchAPI: () => (/* binding */ fetchAPI),
/* harmony export */   getCurrentURLNoParam: () => (/* binding */ getCurrentURLNoParam),
/* harmony export */   listenElementCreated: () => (/* binding */ listenElementCreated),
/* harmony export */   listenElementViewed: () => (/* binding */ listenElementViewed),
/* harmony export */   onElementReady: () => (/* binding */ onElementReady),
/* harmony export */   setLoadingEl: () => (/* binding */ setLoadingEl),
/* harmony export */   showHideEl: () => (/* binding */ showHideEl),
/* harmony export */   wphbRenderPrice: () => (/* binding */ wphbRenderPrice)
/* harmony export */ });
/**
 * Utils functions
 * Copy from learnpress
 *
 * @param url
 * @param data
 * @param functions
 * @since 1.0.0
 * @version 1.0.0
 */
const className = {
  hidden: 'wphb-hidden',
  loading: 'wphb-loading',
  targetAjax: 'wphb-target-ajax'
};
const fetchAPI = (url, data = {}, functions = {}) => {
  if ('function' === typeof functions.before) {
    functions.before();
  }
  fetch(url, {
    method: 'GET',
    ...data
  }).then(response => response.json()).then(response => {
    if ('function' === typeof functions.success) {
      functions.success(response);
    }
  }).catch(err => {
    if ('function' === typeof functions.error) {
      functions.error(err);
    }
  }).finally(() => {
    if ('function' === typeof functions.completed) {
      functions.completed();
    }
  });
};

/**
 * Get current URL without params.
 *
 * @since 4.2.5.1
 */
const getCurrentURLNoParam = () => {
  let currentUrl = window.location.href;
  const hasParams = currentUrl.includes('?');
  if (hasParams) {
    currentUrl = currentUrl.split('?')[0];
  }
  return currentUrl;
};
const addQueryArgs = (endpoint, args) => {
  const url = new URL(endpoint);
  Object.keys(args).forEach(arg => {
    url.searchParams.set(arg, args[arg]);
  });
  return url;
};

/**
 * Listen element viewed.
 *
 * @param el
 * @param callback
 * @since 4.2.5.8
 */
const listenElementViewed = (el, callback) => {
  const observerSeeItem = new IntersectionObserver(function (entries) {
    for (const entry of entries) {
      if (entry.isIntersecting) {
        callback(entry);
      }
    }
  });
  observerSeeItem.observe(el);
};

/**
 * Listen element created.
 *
 * @param callback
 * @since 4.2.5.8
 */
const listenElementCreated = callback => {
  const observerCreateItem = new MutationObserver(function (mutations) {
    mutations.forEach(function (mutation) {
      if (mutation.addedNodes) {
        mutation.addedNodes.forEach(function (node) {
          if (node.nodeType === 1) {
            callback(node);
          }
        });
      }
    });
  });
  observerCreateItem.observe(document, {
    childList: true,
    subtree: true
  });
  // End.
};

/**
 * Listen element created.
 *
 * @param selector
 * @param callback
 * @since 4.2.7.1
 */
const onElementReady = (selector, callback) => {
  const element = document.querySelector(selector);
  if (element) {
    callback(element);
    return;
  }
  const observer = new MutationObserver((mutations, obs) => {
    const element = document.querySelector(selector);
    if (element) {
      obs.disconnect();
      callback(element);
    }
  });
  observer.observe(document.documentElement, {
    childList: true,
    subtree: true
  });
};

// status 0: hide, 1: show
const showHideEl = (el, status = 0) => {
  if (!el) {
    return;
  }
  if (!status) {
    el.classList.add(className.hidden);
  } else {
    el.classList.remove(className.hidden);
  }
};

// status 0: hide, 1: show
const setLoadingEl = (el, status) => {
  if (!el) {
    return;
  }
  if (!status) {
    el.classList.remove(className.loading);
  } else {
    el.classList.add(className.loading);
  }
};
const wphbRenderPrice = price => {
  const currencySymbol = hotel_settings.currency_symbol || '';
  const currencyPosition = hotel_settings.currency_position || 'left';
  price = wphbRenderPriceNumber(price);
  switch (currencyPosition) {
    case 'left':
      price = currencySymbol + price;
      break;
    case 'right':
      price = price + currencySymbol;
      break;
    case 'left_with_space':
      price = currencySymbol + ' ' + price;
      break;
    case 'right_with_space':
      price = price + ' ' + currencySymbol;
      break;
    default:
      break;
  }
  return price;
};
const wphbRenderPriceNumber = price => {
  const numberDecimals = hotel_settings.number_decimal || 0;
  const thousandsSeparator = hotel_settings.thousands_separator || '';
  price = (price / 1).toFixed(numberDecimals);
  price = price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, thousandsSeparator);
  return price;
};


/***/ }

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		if (!(moduleId in __webpack_modules__)) {
/******/ 			delete __webpack_module_cache__[moduleId];
/******/ 			var e = new Error("Cannot find module '" + moduleId + "'");
/******/ 			e.code = 'MODULE_NOT_FOUND';
/******/ 			throw e;
/******/ 		}
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
// This entry needs to be wrapped in an IIFE because it needs to be isolated against other modules in the chunk.
(() => {
/*!************************************************!*\
  !*** ./assets/js/frontend/hotel-booking-v2.js ***!
  \************************************************/
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _utils_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../utils.js */ "./assets/js/utils.js");
/* harmony import */ var _flatpickr_locale_utils_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./flatpickr-locale-utils.js */ "./assets/js/frontend/flatpickr-locale-utils.js");
/** search api */


const urlCurrent = document.location.href;
const urlPageSearch = hotel_settings?.url_page_search;
const urlPageRooms = hotel_settings?.url_page_rooms;
let filterRooms = JSON.parse(window.localStorage.getItem('wphb_filter_rooms')) || {};
let firstLoad = true;
const hotelBookingSearchNode = document.querySelector('.hotel-booking-search');
const INTERNAL_DATE_FORMAT = hotel_settings?.internal_date_format || 'Y/m/d';
const FRONTEND_DATE_FORMAT = hotel_settings?.flatpickr_date_format || INTERNAL_DATE_FORMAT;
const wphbAddQueryArgs = (endpoint, args) => {
  const url = new URL(endpoint);
  Object.keys(args).forEach(arg => {
    url.searchParams.set(arg, args[arg]);
  });
  return url;
};
const removeFilterArgs = (url, args) => {
  const filters = ['min_price', 'max_price', 'rating', 'room_type'];
  [...filters].map(filter => {
    if (!args.hasOwnProperty(filter)) {
      url.searchParams.delete(filter);
    }
  });
  return url;
};
const searchRoomsPages = () => {
  const forms = document.querySelector('.wp-hotel-booking-search-rooms .hotel-booking-search form#hb-form-search-page');
  if (forms === null) {
    return;
  }
  requestSearchRoom(forms, filterRooms);
};
const requestSearchRoom = (forms, args, btn = false) => {
  const skeleton = document.querySelector('.wp-hotel-booking-search-rooms .hotel-booking-search ul.wphb-skeleton-animation');
  const wrapperResult = document.querySelector('.wp-hotel-booking-search-rooms .hotel-booking-search .detail__booking-rooms');
  const showNumber = document.querySelector('.wp-hotel-booking-search-rooms .sort-by-wrapper .show-number');
  const wpRestUrl = hotel_settings.wphb_rest_url;
  if (!wpRestUrl) {
    return;
  }
  if (Object.keys(args).length === 0) {
    const today = new Date();
    const tomorrow = new Date(new Date().getTime() + 24 * 60 * 60 * 1000);
    args.check_in_date = (0,_flatpickr_locale_utils_js__WEBPACK_IMPORTED_MODULE_1__.normalizeBookingDateInputValue)(`${today.getFullYear()}/${String(today.getMonth() + 1).padStart(2, '0')}/${String(today.getDate()).padStart(2, '0')}`, FRONTEND_DATE_FORMAT, INTERNAL_DATE_FORMAT);
    args.check_out_date = (0,_flatpickr_locale_utils_js__WEBPACK_IMPORTED_MODULE_1__.normalizeBookingDateInputValue)(`${tomorrow.getFullYear()}/${String(tomorrow.getMonth() + 1).padStart(2, '0')}/${String(tomorrow.getDate()).padStart(2, '0')}`, FRONTEND_DATE_FORMAT, INTERNAL_DATE_FORMAT);
    args.adults = null;
    args.max_child = null;
    args.paged = 1;

    //Filter - Price, rating, type
    const searchFilter = document.querySelector('#hotel-booking-search-filter');
    if (searchFilter) {
      const priceField = searchFilter.querySelector('.hb-price-field');
      const ratingField = searchFilter.querySelector('.hb-rating-field');
      const typeField = searchFilter.querySelector('.hb-type-field');
      if (priceField) {
        args.min_price = '';
        args.max_price = '';
      }
      if (ratingField) {
        args.rating = '';
      }
      if (typeField) {
        args.room_type = '';
      }
    }
  }
  const urlWphbSearch = wphbAddQueryArgs(wpRestUrl + 'wphb/v1/rooms/search-rooms', {
    ...args
  });
  wp.apiFetch({
    path: 'wphb/v1/rooms/search-rooms' + urlWphbSearch.search,
    method: 'GET'
  }).then(response => {
    if (btn) {
      btn.classList.remove('wphb_loading');
    }
    const {
      status,
      data,
      message
    } = response;
    if (firstLoad) {
      formSearchRooms(forms, skeleton, wrapperResult);
    }
    const paginationEle = document.querySelector('.rooms-pagination');
    if (paginationEle) {
      paginationEle.remove();
    }
    if (status === 'error') {
      throw new Error(message || 'Error');
    }
    wrapperResult.style.display = 'block';
    wrapperResult.innerHTML = data.content;
    if (showNumber) {
      showNumber.innerHTML = data.show_number;
    }
    const pagination = data.pagination;
    if (typeof pagination !== 'undefined') {
      const paginationHTML = new DOMParser().parseFromString(pagination, 'text/html');
      const paginationNewNode = paginationHTML.querySelector('.rooms-pagination');
      if (paginationNewNode) {
        wrapperResult.after(paginationNewNode);
        wphbPaginationRoom(forms, skeleton, wrapperResult);
      }
    }
  }).catch(error => {
    wrapperResult.innerHTML = '';
    const errorNode = document.querySelector('.wphb-message.error');
    if (errorNode) {
      errorNode.innerHTML = error.message || 'Error: Query wphb/v1/rooms/search-room';
    } else {
      wrapperResult.insertAdjacentHTML('beforeend', `<p class="wphb-message error" style="display:block">${error.message || 'Error: Query wphb/v1/rooms/search-room'}</p>`);
    }
    if (showNumber) {
      showNumber.innerHTML = '';
    }
  }).finally(() => {
    skeleton.style.display = 'none';
    // Save filter courses to Storage
    window.localStorage.setItem('wphb_filter_rooms', JSON.stringify(args));
    let urlPush = wphbAddQueryArgs(document.location, args);
    urlPush = removeFilterArgs(urlPush, args);

    //check is room extra not push url
    const url_string = urlPush.href;
    const url = new URL(url_string);
    const isRoomExtra = url.searchParams.get("is_page_room_extra");
    if (isRoomExtra != 'select-room-extra' && !firstLoad) {
      window.history.pushState('', '', urlPush);
      //update value checkin checkout to form search room when reload page
      const checkInDate = document.querySelector('.wp-hotel-booking-search-rooms .hotel-booking-search form#hb-form-search-page input[name="check_in_date"]');
      const checkOutDate = document.querySelector('.wp-hotel-booking-search-rooms .hotel-booking-search form#hb-form-search-page input[name="check_out_date"]');
      checkInDate.value = args.check_in_date;
      checkOutDate.value = args.check_out_date;
    }

    //form booking
    bookingRoomsPages(forms);
    firstLoad = false;
    const contentPageSearch = document.querySelector('.wp-hotel-booking-search-rooms .hotel-booking-search');
    if (contentPageSearch != null) {
      contentPageSearch.scrollIntoView({
        behavior: "smooth"
      });
    }
    //auto set quantity extra option when change select quantity before book room in page search
    toggleExtravalue();
  });
};
const formSearchRooms = (forms, skeleton, wrapperResult) => {
  if (forms === null) return;
  forms.addEventListener('submit', event => {
    event.preventDefault();
    const {
      checkInDate: checkinDate,
      checkOutDate: checkoutDate
    } = (0,_flatpickr_locale_utils_js__WEBPACK_IMPORTED_MODULE_1__.normalizeBookingDateFieldsForSubmit)(forms, FRONTEND_DATE_FORMAT, INTERNAL_DATE_FORMAT, {}, {
      writeBack: false
    });
    const countAdults = forms.querySelector('select[name="adults_capacity"]') ? forms.querySelector('select[name="adults_capacity"]').value : 0;
    const maxChild = forms.querySelector('select[name="max_child"]') ? forms.querySelector('select[name="max_child"]').value : 0;
    const paged = forms.querySelector('input[name="paged"]') ? forms.querySelector('input[name="paged"]').value : 1;
    const btn = forms.querySelector('button.wphb-button');
    btn && btn.classList.add('wphb_loading');
    if (checkinDate === '' || checkoutDate === '') {
      alert(' Please select check in and check out date and search again! ');
      btn && btn.classList.remove('wphb_loading');
      return;
    }
    wrapperResult.innerHTML = '';
    skeleton.style.display = 'block';
    filterRooms = {
      ...filterRooms,
      check_in_date: checkinDate,
      check_out_date: checkoutDate,
      adults: countAdults,
      max_child: maxChild,
      paged: paged
    };
    window.localStorage.setItem('wphb_filter_rooms', JSON.stringify(filterRooms));
    requestSearchRoom(forms, filterRooms, btn);
  });
};
const wphbPaginationRoom = (forms, skeleton, wrapperResult) => {
  const paginationEle = document.querySelectorAll('.wp-hotel-booking-search-rooms .rooms-pagination .page-numbers');
  paginationEle.length > 0 && paginationEle.forEach(ele => ele.addEventListener('click', event => {
    event.preventDefault();
    event.stopPropagation();
    wrapperResult.style.display = 'none';
    skeleton.style.display = 'block';
    let filterRooms = JSON.parse(window.localStorage.getItem('wphb_filter_rooms')) || {};
    const urlString = event.currentTarget.getAttribute('href');
    if (urlString) {
      const current = [...paginationEle].filter(el => el.classList.contains('current'));
      const paged = parseInt(event.currentTarget.textContent) || ele.classList.contains('next') && parseInt(current[0].textContent) + 1 || ele.classList.contains('prev') && parseInt(current[0].textContent) - 1;
      filterRooms.paged = paged;
      requestSearchRoom(forms, {
        ...filterRooms
      });
    }
  }));
};
/** end search api */

const addtocartElementor = () => {
  const formBookingel = document.querySelector('.hotel-booking-search-el form#hb-form-search-page');
  if (!formBookingel) {
    return;
  }
  bookingRoomsPages(formBookingel);
};
/** Booking room search page */

const bookingRoomsPages = formsCheck => {
  const formBooking = document.querySelectorAll('.wp-hotel-booking-search-rooms form.hb-page-search-room-results');
  if (formBooking.length == 0) return;
  const checkinDate = formsCheck.querySelector('input[name="check_in_date"]')?.value;
  const checkoutDate = formsCheck.querySelector('input[name="check_out_date"]')?.value;
  const formSearchPage = document.querySelector('#hb-form-search-page');
  let adults = 1,
    maxChild = 0;
  if (formSearchPage) {
    adults = formSearchPage.querySelector('select[name="adults_capacity"]') ? formSearchPage.querySelector('select[name="adults_capacity"]').value : 1;
    maxChild = formSearchPage.querySelector('select[name="max_child"]') ? formSearchPage.querySelector('select[name="max_child"]').value : 0;
  }
  const submit = async (form, btn = false, numRoom, roomID) => {
    const extraData = [];
    const hotelOption = form.querySelectorAll('input.hb_optional_quantity_selected');
    hotelOption && hotelOption.forEach(ele => {
      if (ele.checked) {
        const extraID = ele.dataset.id;
        const qty = parseInt(ele.parentElement?.nextElementSibling?.querySelector('input[class="hb_optional_quantity"]')?.value) || 1;
        if (extraID) {
          extraData.push({
            extraID,
            qty
          });
        }
      }
    });
    try {
      const response = await wp.apiFetch({
        path: 'wphb/v1/rooms/book-rooms',
        method: 'POST',
        data: {
          roomID,
          checkinDate,
          checkoutDate,
          numRoom,
          extraData,
          adults,
          maxChild
        }
      });
      const {
        status,
        data
      } = response;
      const redirect = data?.results?.redirect || '';
      const message = data?.results?.message || '';
      const hasExtra = data?.results?.has_extra || false;
      if (btn) {
        btn.classList.remove('wphb_loading');
      }
      if ('error' === status) {
        throw new Error(message);
      }
      if (!hasExtra) {
        window.location.href = redirect;
      } else {
        const htmlExtraOptions = data?.results?.extra_html || '';
        const addtocartWrap = form.querySelector('.hb_search_add_to_cart');
        if (addtocartWrap) {
          btn.style.display = 'none';
          addtocartWrap.insertAdjacentHTML('beforeend', htmlExtraOptions);
        } else {
          form.insertAdjacentHTML('beforeend', htmlExtraOptions);
        }
      }
    } catch (error) {
      alert(error);
    }
  };
  formBooking.forEach(function (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      const numRoom = form.querySelector('select[name="hb-num-of-rooms"]')?.value;
      const roomID = form.querySelector('input[name="room-id"]')?.value;
      const quantityBook = form.querySelector('select[name="hb-num-of-rooms"]')?.value;
      if (quantityBook == 0) {
        alert('Please select quantity room!');
        return;
      }
      if (checkinDate === '' || checkoutDate === '') {
        alert(' Please select check in and check out date and search again! ');
        return;
      }
      const btn = form.querySelector('button.hb_add_to_cart');
      btn && btn.classList.add('wphb_loading');
      submit(form, btn, numRoom, roomID);
    });
    form.addEventListener('click', e => {
      let target = e.target;
      if (target.classList.contains('add-extra-to-cart')) {
        target.classList.add('wphb_loading');
        const cartID = target.dataset.cartid;
        addExtraToCartNew(form, cartID, target);
      }
    });
  });
  const addExtraToCartNew = async (form, cartID, btn) => {
    const extraData = [];
    const hotelOption = form.querySelectorAll('input.hb_optional_quantity_selected');
    hotelOption && hotelOption.forEach(ele => {
      if (ele.checked) {
        const extraID = ele?.dataset.id || null;
        const qty = parseInt(ele.parentElement?.nextElementSibling?.querySelector(`input[name="hb_optional_quantity[${extraID}]"]`)?.value) || 1;
        if (extraID) {
          extraData.push({
            extraID,
            qty
          });
        }
      }
    });
    try {
      const response = await wp.apiFetch({
        path: 'wphb/v1/rooms/add-extra-cart',
        method: 'POST',
        data: {
          cartID,
          extraData
        }
      });
      const {
        status,
        data,
        message
      } = response;
      btn.classList.remove('wphb_loading');
      if ('error' === status) {
        throw new Error(message);
      }
      const redirect = data?.redirect || '';
      if ('success' === status && redirect) {
        window.location.href = redirect;
      }
    } catch (error) {
      alert(error);
    }
  };
};
const addExtraToCart = () => {
  const formExtra = document.querySelector('form.hb-select-extra-results');
  if (formExtra === null) return;
  const submit = async () => {
    const extraData = [];
    const cartID = formExtra.querySelector('input[name="cart_id"]').value;
    const hotelOption = formExtra.querySelectorAll('input.hb_optional_quantity_selected');
    hotelOption && hotelOption.forEach(ele => {
      if (ele.checked) {
        const extraID = ele?.dataset.id || null;
        const qty = parseInt(ele.parentElement?.nextElementSibling?.querySelector('input[class="hb_optional_quantity"]')?.value) || 1;
        if (extraID) {
          extraData.push({
            extraID,
            qty
          });
        }
      }
    });
    try {
      const response = await wp.apiFetch({
        path: 'wphb/v1/rooms/add-extra-cart',
        method: 'POST',
        data: {
          cartID,
          extraData
        }
      });
      const {
        status,
        redirect
      } = response;
      if ('success' === status && redirect) {
        window.location.href = redirect;
      }
    } catch (error) {
      alert(error.message && error.message);
    }
  };
  formExtra.addEventListener('submit', function (e) {
    e.preventDefault();
    const btn = formExtra.querySelector('button[type="submit"]');
    btn && btn.classList.add('wphb_loading');
    submit();
  });
};
/** End Booking search page */

/** search form */

const checkAvailableRooms = () => {
  //remove sidebar search in page search room_select
  if (hotel_settings?.is_page_search) {
    const sideBar = document.querySelector('.thim-widget-search-room');
    if (sideBar != null) {
      const FormSidebar = sideBar.querySelector('form#hb-form-search-page');
      if (FormSidebar != null) {
        FormSidebar.removeAttribute('id');
      }
      const searchResult = sideBar.querySelector('#hotel-booking-results');
      if (searchResult != null) {
        searchResult.remove();
      }
    }
  }
  const forms = document.querySelectorAll('form[name="hb-search-form"]:not(#hb-form-search-page)');
  forms.length > 0 && forms.forEach(form => {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      const {
        checkInDate: checkinDate,
        checkOutDate: checkoutDate
      } = (0,_flatpickr_locale_utils_js__WEBPACK_IMPORTED_MODULE_1__.normalizeBookingDateFieldsForSubmit)(form, FRONTEND_DATE_FORMAT, INTERNAL_DATE_FORMAT, {}, {
        writeBack: false
      });
      const countAdults = form.querySelector('[name="adults_capacity"]') ? form.querySelector('[name="adults_capacity"]').value : 0;
      const maxChild = form.querySelector('[name="max_child"]') ? form.querySelector('[name="max_child"]').value : 0;
      const paged = form.querySelector('input[name="paged"]') ? form.querySelector('input[name="paged"]').value : 1;
      const room_qty = form.querySelector('[name="number-of-rooms"]') ? form.querySelector('[name="number-of-rooms"]').value : 1;
      if (checkinDate === '' || checkoutDate === '') {
        alert(' Please select check in and check out date and search again! ');
        return;
      }
      const data = {
        check_in_date: checkinDate,
        check_out_date: checkoutDate,
        adults: countAdults,
        max_child: maxChild,
        paged: paged,
        room_qty
      };
      window.localStorage.setItem('wphb_filter_rooms', JSON.stringify(data));
      const urlPush = wphbAddQueryArgs(document.location, data);
      const urlString = urlPush.search;
      window.location.href = urlPageRooms + urlString;
    });
  });
};
/** End search form */

const processCheckout = () => {
  const form = document.getElementById('hb-cart-form');
  if (form === null) return;
  const btn = form.querySelector('a.hb_checkout');
  if (btn === null) return;
  btn.addEventListener('click', function (e) {
    e.preventDefault();
    if (hotel_settings?.checkout_page_url) {
      window.location.href = hotel_settings.checkout_page_url;
    } else {
      alert('Please set checkout page url in settings');
    }
  });
};

//auto set quantity extra option when change select quantity before book room in page search
const toggleExtravalue = () => {
  const select = document.querySelector('.hb-page-search-room-results select.number_room_select');
  if (select == null) return;
  select.addEventListener('change', function (e) {
    e.preventDefault();
    const optionExtras = document.querySelectorAll('.hb-page-search-room-results .hb_optional_quantity');
    if (optionExtras == null) return;
    optionExtras.forEach(function (extra) {
      extra.value = select.value;
    });
  });
};
const priceSlider = () => {
  const priceFields = document.querySelectorAll('.hb-price-field');
  if (!priceFields) {
    return;
  }
  for (let i = 0; i < priceFields.length; i++) {
    const priceField = priceFields[i];
    const minPrice = priceField.getAttribute('data-min');
    const maxPrice = priceField.getAttribute('data-max');
    let step = priceField.getAttribute('data-step');
    if (minPrice === '' || maxPrice === '' || step === '') {
      continue;
    }
    const minPriceNode = priceField.querySelector('.hb-min-price');
    const maxPriceNode = priceField.querySelector('.hb-max-price');
    const priceSliderNode = priceField.querySelector('.hb-price-range');
    const start = filterRooms.min_price || minPrice;
    const end = filterRooms.max_price || maxPrice;
    step = parseInt(step);
    noUiSlider.create(priceSliderNode, {
      start: [parseInt(start), parseInt(end)],
      connect: true,
      step,
      tooltips: false,
      range: {
        min: parseInt(minPrice),
        max: parseInt(maxPrice)
      }
    });
    priceSliderNode.noUiSlider.on('update', function (values, handle, unencoded) {
      let minValue = values[0],
        maxValue = values[1];
      if (isNaN(minValue)) {
        minValue = 0;
      }
      if (isNaN(maxValue)) {
        maxValue = 0;
      }
      minPriceNode.value = parseInt(minValue);
      maxPriceNode.value = parseInt(maxValue);
      priceField.querySelector('.min').innerHTML = _utils_js__WEBPACK_IMPORTED_MODULE_0__.wphbRenderPrice(minValue);
      priceField.querySelector('.max').innerHTML = _utils_js__WEBPACK_IMPORTED_MODULE_0__.wphbRenderPrice(maxValue);
    });
    const applyBtn = priceField.querySelector('button.apply');

    //apply btn click event
    if (applyBtn) {
      applyBtn.addEventListener('click', function (event) {
        event.preventDefault();
        const minPrice = minPriceNode.value;
        const maxPrice = maxPriceNode.value;
        filterRooms = {
          ...filterRooms,
          min_price: parseInt(minPrice),
          max_price: parseInt(maxPrice)
        };
        window.localStorage.setItem('wphb_filter_rooms', JSON.stringify(filterRooms));
        searchRoomsPages();
      });
    }
  }
};
const rating = () => {
  const ratingFields = document.querySelectorAll('.hb-rating-field');
  if (!ratingFields) {
    return;
  }
  for (let i = 0; i < ratingFields.length; i++) {
    const ratingField = ratingFields[i];
    const allInputs = ratingField.querySelectorAll('input[type="checkbox"]');
    const rating = filterRooms.rating || [];
    [...rating].map(value => {
      ratingField.querySelector(`input[name ="rating"][value ="${value}"]`).checked = true;
    });
    for (let i = 0; i < allInputs.length; i++) {
      const input = allInputs[i];
      input.addEventListener('change', function (event) {
        const allCheckedInput = ratingField.querySelectorAll('input[type="checkbox"]:checked');
        let value = [];
        [...allCheckedInput].map(checkedInput => {
          value.push(checkedInput.value);
        });
        filterRooms = {
          ...filterRooms,
          rating: value
        };
        window.localStorage.setItem('wphb_filter_rooms', JSON.stringify(filterRooms));
        searchRoomsPages();
      });
    }
  }
};
const roomType = () => {
  const roomTypeFields = document.querySelectorAll('.hb-type-field');
  if (!roomTypeFields) {
    return;
  }
  for (let i = 0; i < roomTypeFields.length; i++) {
    const roomTypeField = roomTypeFields[i];
    const allInputs = roomTypeField.querySelectorAll('input[type="checkbox"]');
    const roomTypesValue = filterRooms.room_type || [];
    [...roomTypesValue].map(value => {
      roomTypeField.querySelector(`input[name ="room_type"][value ="${value}"]`).checked = true;
    });
    for (let i = 0; i < allInputs.length; i++) {
      const input = allInputs[i];
      input.addEventListener('change', function (event) {
        const allCheckedInput = roomTypeField.querySelectorAll('input[type="checkbox"]:checked');
        let value = [];
        [...allCheckedInput].map(checkedInput => {
          value.push(checkedInput.value);
        });
        filterRooms = {
          ...filterRooms,
          room_type: value
        };
        window.localStorage.setItem('wphb_filter_rooms', JSON.stringify(filterRooms));
        searchRoomsPages();
      });
    }
  }
};
const clearFilter = () => {
  const filterForms = document.querySelectorAll('.search-filter-form');
  if (!filterForms) {
    return;
  }
  for (let i = 0; i < filterForms.length; i++) {
    const filterForm = filterForms[i];
    const clearFilter = filterForm.querySelector('.clear-filter button');
    clearFilter.addEventListener('click', function (event) {
      const priceField = document.querySelector('.hb-price-field');
      if (priceField) {
        const minPrice = priceField.getAttribute('data-min');
        const maxPrice = priceField.getAttribute('data-max');
        const priceSliderNode = priceField.querySelector('.hb-price-range');
        const start = minPrice;
        const end = maxPrice;
        priceSliderNode.noUiSlider.updateOptions({
          start: [parseInt(start), parseInt(end)]
        });
      }
      const ratingFields = filterForm.querySelectorAll('.hb-rating-field input');
      [...ratingFields].map(ratingField => {
        ratingField.checked = false;
      });
      const roomTypeFields = filterForm.querySelectorAll('.hb-type-field input');
      [...roomTypeFields].map(roomTypeField => {
        roomTypeField.checked = false;
      });
      if (filterRooms.hasOwnProperty('min_price')) {
        delete filterRooms['min_price'];
      }
      if (filterRooms.hasOwnProperty('max_price')) {
        delete filterRooms['max_price'];
      }
      if (filterRooms.hasOwnProperty('rating')) {
        delete filterRooms['rating'];
      }
      if (filterRooms.hasOwnProperty('room_type')) {
        delete filterRooms['room_type'];
      }
      const listItemNodes = document.querySelectorAll('.hb-selection-field .list-item');
      [...listItemNodes].map(listItemNode => {
        listItemNode.remove();
      });
      window.localStorage.setItem('wphb_filter_rooms', JSON.stringify(filterRooms));
      searchRoomsPages();
    });
  }
};
const hbFilterSelection = () => {
  const selectionWrapper = document.querySelector('.hb-selection-field');
  if (!selectionWrapper) {
    return;
  }
  const priceFields = document.querySelectorAll('.hb-price-field');
  if (priceFields.length) {
    for (let i = 0; i < priceFields.length; i++) {
      const priceField = priceFields[i];
      const priceSliderNode = priceField.querySelector('.hb-price-range');
      priceSliderNode.noUiSlider.on('update', function (values, handle, unencoded) {
        const minPrice = parseInt(values[0]);
        const maxPrice = parseInt(values[1]);
        changeSelectedField('price', minPrice + '-' + maxPrice, _utils_js__WEBPACK_IMPORTED_MODULE_0__.wphbRenderPrice(minPrice) + '-' + _utils_js__WEBPACK_IMPORTED_MODULE_0__.wphbRenderPrice(maxPrice));
      });
    }
  }
  const ratingFields = document.querySelectorAll('.hb-rating-field');
  if (ratingFields.length) {
    [...ratingFields].map(ratingField => {
      const allInputs = ratingField.querySelectorAll('input[type="checkbox"]');
      [...allInputs].map(ratingNode => {
        if (ratingNode.checked) {
          const value = ratingNode.value;
          const label = ratingNode.closest('label').querySelector('span').innerHTML.replace('-', ' ');
          changeSelectedField('rating', value, label);
        }
        ratingNode.addEventListener('change', function () {
          const value = this.value;
          const label = ratingNode.closest('label').querySelector('span').innerHTML.replace('-', ' ');
          changeSelectedField('rating', value, label);
        });
      });
    });
  }
  const roomTypeFields = document.querySelectorAll('.hb-type-field');
  if (roomTypeFields.length) {
    for (let i = 0; i < roomTypeFields.length; i++) {
      const roomTypeField = roomTypeFields[i];
      const allInputs = roomTypeField.querySelectorAll('input[type="checkbox"]');
      [...allInputs].map(roomTypeNode => {
        if (roomTypeNode.checked) {
          const value = roomTypeNode.value;
          const label = roomTypeNode.closest('label').querySelector('span').innerHTML.replace('-', ' ');
          changeSelectedField('room-type', value, label);
        }
        roomTypeNode.addEventListener('change', function () {
          const value = this.value;
          const label = roomTypeNode.closest('label').querySelector('span').innerHTML.replace('-', ' ');
          changeSelectedField('room-type', value, label);
        });
      });
    }
  }
};
const removeSelection = () => {
  document.addEventListener('click', function (event) {
    const target = event.target;
    if (!target.classList.contains('remove')) {
      return;
    }
    const selectionWrapper = target.closest('.hb-selection-field');
    if (!selectionWrapper) {
      return;
    }
    const listItem = target.closest('.list-item');
    const field = listItem.getAttribute('data-field');
    switch (field) {
      case 'room-type':
        resetRoomType(listItem.getAttribute('data-value'));
        break;
      case 'rating':
        resetRating(listItem.getAttribute('data-value'));
        break;
      case 'price':
        resetPrice();
        break;
      default:
        break;
    }
    if (listItem) {
      listItem.remove();
    }
  });
};
const resetRoomType = (value = 'all') => {
  const roomTypeFields = document.querySelectorAll('.hb-type-field');
  [...roomTypeFields].map(roomTypeField => {
    const roomTypeNodes = roomTypeField.querySelectorAll('input[type="checkbox"]');
    if (value === 'all') {
      [...roomTypeNodes].map(roomTypeNode => {
        roomTypeNode.checked = false;
      });
    } else {
      const input = roomTypeField.querySelector(`.room-type-list input[value="${value}"]`);
      input.checked = false;
    }
    let roomTypeVal = [];
    const allCheckedInput = roomTypeField.querySelectorAll('input[type="checkbox"]:checked');
    [...allCheckedInput].map(checkedInput => {
      roomTypeVal.push(checkedInput.value);
    });
    filterRooms = {
      ...filterRooms,
      room_type: roomTypeVal
    };
    window.localStorage.setItem('wphb_filter_rooms', JSON.stringify(filterRooms));
    searchRoomsPages();
  });
};
const resetRating = (value = 'all') => {
  const ratingFields = document.querySelectorAll('.hb-rating-field');
  [...ratingFields].map(ratingField => {
    const ratingNodes = ratingField.querySelectorAll('input[type="checkbox"]');
    if (value === 'all') {
      [...ratingNodes].map(ratingNode => {
        ratingNode.checked = false;
      });
    } else {
      const input = ratingField.querySelector(`.rating-list input[value="${value}"]`);
      input.checked = false;
    }
    let ratingVal = [];
    const allCheckedInput = ratingField.querySelectorAll('input[type="checkbox"]:checked');
    [...allCheckedInput].map(checkedInput => {
      ratingVal.push(checkedInput.value);
    });
    filterRooms = {
      ...filterRooms,
      rating: ratingVal
    };
    window.localStorage.setItem('wphb_filter_rooms', JSON.stringify(filterRooms));
    searchRoomsPages();
  });
};
const resetPrice = () => {
  const priceFields = document.querySelectorAll('.hb-price-field');
  if (priceFields.length) {
    for (let i = 0; i < priceFields.length; i++) {
      const priceField = priceFields[i];
      const priceSliderNode = priceField.querySelector('.hb-price-range');
      priceSliderNode.noUiSlider.updateOptions({
        start: [parseInt(priceField.getAttribute('data-min')), parseInt(priceField.getAttribute('data-max'))]
      });
    }
  }
  if (filterRooms.hasOwnProperty('min_price')) {
    delete filterRooms['min_price'];
  }
  if (filterRooms.hasOwnProperty('max_price')) {
    delete filterRooms['max_price'];
  }
  window.localStorage.setItem('wphb_filter_rooms', JSON.stringify(filterRooms));
  searchRoomsPages();
};
const changeSelectedField = (field, value, text) => {
  const listNode = document.querySelector('.hb-selection-field .list');
  let fieldNode = listNode.querySelector(`li[data-field="${field}"]`);
  if (field === 'rating' || field === 'room-type') {
    fieldNode = listNode.querySelector(`li[data-field="${field}"][data-value="${value}"]`);
  }
  if (fieldNode) {
    if (field === 'rating' || field === 'room-type') {
      fieldNode.remove();
    } else {
      if (value) {
        fieldNode.setAttribute('data-value', value);
        fieldNode.querySelector('.title').innerHTML = text;
      } else {
        fieldNode.remove();
      }
    }
  } else {
    const item = `<li class="list-item" data-field = "${field}" data-value="${value}">
            <span class="title">${text}</span>
            <svg class="remove" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path d="M12.5 3.5L3.5 12.5" stroke="#AAAFB6" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                <path d="M12.5 12.5L3.5 3.5" stroke="#AAAFB6" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
           </svg>
        </li>`;
    listNode.insertAdjacentHTML('beforeend', item);
  }
};
const sortBy = () => {
  const sortByWrapper = document.querySelector('.sort-by-wrapper');
  if (!sortByWrapper) {
    return;
  }
  const sortBy = filterRooms.sort_by || '';
  const listOptions = sortByWrapper.querySelectorAll('ul li');
  const toggle = sortByWrapper.querySelector('.toggle');
  [...listOptions].map(element => {
    if (element.getAttribute('data-value') === sortBy) {
      toggle.innerHTML = element.innerHTML;
      element.classList.add('active');
    } else {
      element.classList.remove('active');
    }
    element.addEventListener('click', function (event) {
      const value = element.getAttribute('data-value');
      filterRooms = {
        ...filterRooms,
        'sort_by': value
      };
      window.localStorage.setItem('wphb_filter_rooms', JSON.stringify(filterRooms));
      searchRoomsPages();
    });
  });
};
const initNumberInputs = () => {
  const numberFields = document.querySelectorAll('.hb-form-number-input');
  if (numberFields.length < 1) {
    return;
  }
  numberFields.forEach(field => {
    const input = field.querySelector('input[type="number"]');
    const dropdown = field.querySelector('.hb-form-field-list');
    const valueDisplay = field.querySelector('.hb-number-field-value');
    const btnUp = field.querySelector('.hb-goUp');
    const btnDown = field.querySelector('.hb-goDown');
    const minValue = parseInt(input.getAttribute('min')) || 0;

    // Update display and input value
    const updateDisplay = value => {
      currentValue = value;
      input.value = value;
      valueDisplay.textContent = value;
      // Disable down button if at minimum
      if (currentValue <= minValue) {
        btnDown.style.opacity = '0.5';
        btnDown.style.cursor = 'not-allowed';
      } else {
        btnDown.style.opacity = '1';
        btnDown.style.cursor = 'pointer';
      }
    };
    // Initialize value display
    let currentValue = parseInt(input.value) || minValue;
    updateDisplay(currentValue);

    // Toggle dropdown on input click
    input.addEventListener('click', e => {
      e.stopPropagation();

      // Close all other dropdowns
      document.querySelectorAll('.hb-form-field-list').forEach(dd => {
        if (dd !== dropdown) {
          dd.classList.remove('active');
        }
      });

      // Toggle current dropdown
      dropdown.classList.toggle('active');
    });

    // Increase value
    btnUp.addEventListener('click', e => {
      e.stopPropagation();
      currentValue++;
      updateDisplay(currentValue);
    });

    // Decrease value
    btnDown.addEventListener('click', e => {
      e.stopPropagation();
      if (currentValue > minValue) {
        currentValue--;
        updateDisplay(currentValue);
      }
    });
  });
};
const show_form_coupon = () => {
  const couponToggle = document.querySelector('.thim-hb-show-coupon-form');
  const couponFormWrapper = document.querySelector('.thim-hb-coupon-form-wrapper');
  if (couponToggle && couponFormWrapper) {
    couponToggle.addEventListener('click', function (e) {
      e.preventDefault();
      if (couponFormWrapper.style.display === 'none' || getComputedStyle(couponFormWrapper).display === 'none') {
        couponFormWrapper.style.display = 'block';
        couponToggle.textContent = couponToggle.dataset.hideText || 'Hide coupon form';
      } else {
        couponFormWrapper.style.display = 'none';
        couponToggle.textContent = couponToggle.dataset.showText || 'Click here to enter your code';
      }
    });
  }
};
// Close dropdown when clicking outside
document.addEventListener('click', e => {
  if (!e.target.closest('.hb-form-number')) {
    document.querySelectorAll('.hb-form-field-list').forEach(dropdown => {
      dropdown.classList.remove('active');
    });
  }
});
document.addEventListener('keyup', e => {
  let target = e.target;
  if (target.closest('.hb-form-number-input') && target.tagName === 'INPUT') {
    let container = target.closest('.hb-form-number-input');
    if (container.querySelector('.hb-number-field-value')) {
      container.querySelector('.hb-number-field-value').innerText = parseInt(target.value);
    }
  }
});
// Initialize on DOM ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initNumberInputs);
} else {
  initNumberInputs();
}
// Expose reinit function for dynamically added fields
window.hbReinitNumberInputs = initNumberInputs;
document.addEventListener('DOMContentLoaded', () => {
  searchRoomsPages(); //use in page search room
  addExtraToCart();
  addtocartElementor();
  checkAvailableRooms(); // use multi form search will redirect to page search room with data valid :
  processCheckout();
  show_form_coupon();
  if (hotelBookingSearchNode && hotel_settings && hotel_settings.is_page_search) {
    priceSlider();
    rating();
    roomType();
    hbFilterSelection();
    removeSelection();
    clearFilter();
    sortBy();
  }
});
})();

/******/ })()
;
//# sourceMappingURL=hotel-booking-v2.js.map