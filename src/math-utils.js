const TRACE = true;
const DEBUG_ROUNDNUMBER = true;

const ERROR_GENERAL = 'error setting up roundNumber()';
const ERROR_VALUE = 'invalid value';
const ERROR_NONINTEGER_DIGITS = 'roundNumber with non-integer decimalDigits - did you mean to call roundNumberFromStep?';
const ERROR_DECIMAL_DIGITS = 'invalid decimalDigits';
const ERROR_VALUE_LESS_THAN_MIN = 'valueLessThanMin';
const ERROR_VALUE_GREATER_THAN_MAX = 'valueGreaterThanMax';
const ERROR_INVALID_RANGE = 'invalidRange';

// In the unlikely event this is run in a REALLY old browser that does not support console.log
if (!window.console) { window.console = { log: function(){} }; }

if (TRACE) console.log('math-utils loaded');

export function roundNumber(value, decimalDigits, range) {
  if (DEBUG_ROUNDNUMBER) console.log(`roundNumber( value=${value} decimalDigits=${decimalDigits})`);

  // check for bad initial conditions
  // if needed we could return the whole obj, with obj.value = value
	const obj = roundNumberSetup(value, decimalDigits, range);
	if (obj.status) {
    if (DEBUG_ROUNDNUMBER) console.log(ERROR_GENERAL);
    throw new Error(obj.status);
  }
	
  let retval = roundNumberSimple(value, decimalDigits);
	const min = obj.min;
	const max = obj.max;
  if ( (min && retval < min) || (max && retval > max) ) {
    // here if the difference between min and max is too small - to keep within the
    // limits we need an additional digit of precision - do this recursively until 
    // we have enough precision that retval is within the range
    if (DEBUG_ROUNDNUMBER) console.log('roundNumber problem: min= ' + min + ' retval= ' + retval + ' max= ' + max);
    retval = roundNumber(value, decimalDigits+1, {min:min, max:max});
  }

  return retval;
}

// returns obj with fields status, min, max
function roundNumberSetup(value, decimalDigits, range) {
	const obj = {status:''};
	
    // non-integer value for decimalDigits makes no sense in this function
	if (!Number.isInteger(decimalDigits)) {
		if (DEBUG_ROUNDNUMBER) console.log(ERROR_NONINTEGER_DIGITS);
    obj.status = ERROR_DECIMAL_DIGITS;
	}

	// We can't do anything with non-numeric, NaN or infinite values
  if (!Number.isFinite(value)) obj.status = ERROR_VALUE;

	// We can't do anything without a (non-negative) decimalDigits specifier
  if (!Number.isFinite(decimalDigits) || (decimalDigits < 0)) obj.status = ERROR_DECIMAL_DIGITS;

  if (obj.status) return obj; // hopelessly bad input


  // if defined, range is {min:min, max:max} where min, max are each
  // either undefined or a finite number
  let min = (range === undefined) ? undefined : range.min;
  let max = (range === undefined) ? undefined : range.max;
  if (!Number.isFinite(min)) min = undefined;
  if (!Number.isFinite(max)) max = undefined;
	obj.min = min;
	obj.max = max;

  // if there is a range, make sure value is within it
  if (min && value < min) obj.status = ERROR_VALUE_LESS_THAN_MIN;
  if (max && value > max) obj.status = ERROR_VALUE_GREATER_THAN_MAX;
  if (min && max && min > max) obj.status = ERROR_INVALID_RANGE;
	
	return obj;
}

function roundNumberSimple(value, decimalDigits) {
	const multiplier = Math.pow(10, decimalDigits);
  const retval = Math.round(value * multiplier) / multiplier;
  return retval;
}
