/**
 * Range Slider Code
 */

/** Initialize the sliders */
/* var slider1 = document.getElementById('range-slider-1');
noUiSlider.create(slider1, {
    start: [50000, 250000],
    connect: [true, true, false],
    step: 1,
    orientation: 'horizontal', // 'horizontal' or 'vertical'
    range: {
        'min': 0,
        'max': 500000
    },
    pips: {
        mode: 'count',
        values: 5,
        density: 20
    }
}); */

var sliderNonPin = document.getElementById('range-slider-non-pin');
noUiSlider.create(sliderNonPin, {
    start: 0,
    connect: 'lower',
    step: 100,
    orientation: 'horizontal', // 'horizontal' or 'vertical'
    range: {
        'min': sliderMinValueNonPin,
        'max': sliderMaxValueNonPin
    },
    pips: {
        mode: 'count',
        values: 4,
        density: 25
    }
});

// Steps for pin transactions are 1000 so starting from 1000 ending till 4000
var sliderPin = document.getElementById('range-slider-pin');
noUiSlider.create(sliderPin, {
    start: 0,
    connect: 'lower',
    step: 1000,
    orientation: 'horizontal', // 'horizontal' or 'vertical'
    range: {
        'min': sliderMinValuePin,
        'max': sliderMaxValuePin
    },
    pips: {
        mode: 'count',
        values: 4,
        density: 25
    }
});

/** Linking sliders with input fields */
var inputFieldNonPin = document.getElementById('new-limit-non-pin');

//update input field on slider update
sliderNonPin.noUiSlider.on('update', function (values, handle) {
    var value = values[handle];
    /* if (handle) { // i.e. if handle with index 1 comes up
        inputField1.value = Math.round(value);
    } */
    inputFieldNonPin.value = Math.round(value);
    enableApplyButton('digital');
});

// update slider when user clicks outside the box after entering the value
inputFieldNonPin.addEventListener('change', function () {
    /* slider1.noUiSlider.set([null, this.value]); */
    sliderNonPin.noUiSlider.set(this.value);
});

// update the slider after user presses enter key after entering the value
inputFieldNonPin.addEventListener('keydown', function (e) {

    if(e.which == 13){
        sliderNonPin.noUiSlider.set(this.value);
    }

});

var inputFieldPin = document.getElementById('new-limit-pin');

//update input field on slider update
sliderPin.noUiSlider.on('update', function (values, handle) {
    var value = values[handle];
    /* if (handle) {
        inputField2.value = Math.round(value);
    } */
    inputFieldPin.value = Math.round(value);
    enableApplyButton('digital');
});

// update slider when user clicks outside the box after entering the value
inputFieldPin.addEventListener('change', function () {
    /* slider2.noUiSlider.set([null, this.value]); */
    sliderPin.noUiSlider.set(this.value);
});

// update the slider after user presses enter key after entering the value
inputFieldPin.addEventListener('keydown', function (e) {
    if(e.which == 13){
        sliderPin.noUiSlider.set(this.value);
    }
});

// Disable the pseudo handle
/* var origins = document.getElementsByClassName('noUi-origin');
origins[0].setAttribute('disabled', true); */

function init(){
    onChangeDigitalMaster('non-pin', true);
    onChangeDigitalMaster('pin', true);
    disableApplyButton('digital');
    inputFocus('.limit-input');

}

init();
