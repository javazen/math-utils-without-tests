import {roundNumber} from './math-utils.js';

const TRACE = true;

let inputField, placesField, minField, maxField, roundBtn, roundedOutput, roundedWithinLimitsOutput;

// In the unlikely event this is run in a REALLY old browser that does not support console.log
if (!window.console) { window.console = { log: function(){} }; }

if (TRACE) console.log('index.js loaded');

document.addEventListener("DOMContentLoaded", function(event) {
  if (TRACE) console.log('DOMContentLoaded');
  inputField = document.getElementById("inputText");
  inputField.addEventListener('change', handleInput);
  placesField = document.getElementById("placesField");
  minField = document.getElementById("minField");
  maxField = document.getElementById("maxField");
  roundBtn = document.getElementById("Round");
  roundBtn.addEventListener('click', handleRound);
  roundedOutput = document.getElementById("roundedOutput");
  roundedWithinLimitsOutput = document.getElementById("roundedWithinLimitsOutput");
});

// when user changes the input text...
function handleInput() {
  let parsedText = parseFloat(this.value);
  let disable = isNaN(parsedText) || typeof parsedText !== 'number';
  roundBtn.disabled = disable;
}
  
  // when user clicks Round...
function handleRound() {
  let parsedText = parseFloat(inputField.value);
  let decimalPlaces = parseFloat(placesField.value);
  let minValue = parseFloat(minField.value);
  let maxValue = parseFloat(maxField.value);
  let rangeObj = {min:minValue, max:maxValue};

  try {
    let outputValue = roundNumber(parsedText, decimalPlaces);
    updateOutput(roundedOutput, outputValue);
  } catch (error) {
    updateOutput(roundedOutput, error.message);
  }

  if (minValue || maxValue) {
    try {
      let outputValuWithinLimits = roundNumber(parsedText, decimalPlaces, rangeObj);
      updateOutput(roundedWithinLimitsOutput, outputValuWithinLimits);
    } catch (error) {
      updateOutput(roundedWithinLimitsOutput, error.message);
    }
  } else {
    updateOutput(roundedWithinLimitsOutput, '');
  }
}

function updateOutput(field, str) {
  field.value = str;
}

