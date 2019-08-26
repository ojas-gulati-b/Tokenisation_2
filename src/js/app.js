/** Global Variables */
var nonPinCountLimit = 5, pinCountLimit = 99, selectedCardID = '', carouselLoaded = false, changesMade = false;
// Slider values (min/max) 
// Set the min and max for each slider in these vars
var sliderMinValueNonPin = 500, sliderMaxValueNonPin = 2000, sliderMinValuePin = 1000, sliderMaxValuePin = 4000;

function getElement(selector) {
    return document.querySelector(selector);
}
/* function goToScreen(screen) {
    var prevScreen, nextScreen;
    if (screen === 'card-limits') {
        prevScreen = getElement('#cards-list');
        nextScreen = getElement('#card-limits');
    }
    else if (screen === 'cards-list') {
        prevScreen = getElement('#card-limits');
        nextScreen = getElement('#cards-list');
    }
        
    else if (screen === 'manage-limits') {
        prevScreen = getElement('#cards-screen');
        nextScreen = getElement('#manage-limits-screen');
    }
    else if (screen === "cards-screen") {
        if(changesMade){
            window.location.hash = 'exitWithoutSave'
            return;
        }
        prevScreen = getElement('#manage-limits-screen');
        nextScreen = getElement('#cards-screen');
        const formElements = document.querySelectorAll('#tab-content-form input');
        formElements.forEach(element => {
            if(element.type == 'checkbox')
                element.checked = element.defaultChecked;
            else
                element.value = element.defaultValue;
        })
    }
    else if (screen === 'applied-changes-screen') {
        var limitCountInputs = document.querySelectorAll('#digital-spends .limit-count input'), valid = true;
        limitCountInputs.forEach(input => {
            if(!input.checkValidity())
                valid = false;
        });
        if (!valid) return;
        prevScreen = getElement('#manage-limits-screen');
        nextScreen = getElement('#applied-changes-screen');
    }
    else if (screen === 'exit-without-save-screen') {
        prevScreen = getElement('#manage-limits-screen');
        nextScreen = getElement('#exit-without-save-screen');
    }
    else if (screen === 'applied-changes-screen-from-exit') {
        prevScreen = getElement('#exit-without-save-screen');
        nextScreen = getElement('#applied-changes-screen');
    }
    else if (screen === 'cards-screen-from-exit') {
        prevScreen = getElement('#exit-without-save-screen');
        nextScreen = getElement('#cards-screen');
    }
    prevScreen.classList.add('hidden');
    nextScreen.classList.remove('hidden');
    if(screen === 'card-limits' && !carouselLoaded){
        initializeCarousel('card-carousel-screen-2', {
            dots: true,
            centerMode: true,
            arrows: false,
            slidesToShow: 1,
            slidesToScroll: 3,
            initialSlide: 1,
            infinite: false,
            variableWidth: true,
            focusOnSelect: true
        });
        carouselLoaded = true;
    }
    if(selectedCardID){
        $('.card-carousel-screen-1').slick('slickGoTo', selectedCardID-1);
    }
    
} */
function switchTab(event, tabID) {
    var tabs = document.querySelectorAll('.tkn-manage-limits-screen .tab-content .content'),
        tabLinks = document.querySelectorAll('.tkn-manage-limits-screen .tabs-header .tkn-tabs .tkn-tab');
    
    for (var i=0; i<tabs.length; i++){
        tabs[i].classList.remove('active')
    }
    /* tabs.forEach(element => {
        element.classList.remove('active')
    }); */
    for (var i=0; i<tabLinks.length; i++){
        tabLinks[i].classList.remove('active')
    }
    /* tabLinks.forEach(element => {
        element.classList.remove('active')
    }); */
    var tabToActive = '.tkn-manage-limits-screen ' + tabID;
    getElement(tabToActive).classList.add('active');
    event.currentTarget.className += ' active';
}

function openExitWithoutSaveModal() {
    $('#tkn-exit-without-save-modal').addClass('show');
}

function closeModal(){
    $('#tkn-exit-without-save-modal').removeClass('show')
}

/**
 * Establish master slave relationship between card spends switches
 */

function onChangeCardMaster(umbrellaClass) {
    var slaveSelector = '.tkn-tab-card .'+umbrellaClass+ ' .slave', masterToggleSelector = '.tkn-tab-card .'+umbrellaClass+' .master-toggle';
    var masterToggle = getElement(masterToggleSelector);
    var slaveSections = document.querySelectorAll(slaveSelector);
    if (masterToggle.type == 'checkbox' && masterToggle.checked === false){
        for (var i = 0; i < slaveSections.length; i++) {
            var slaveToggle = slaveSections[i].querySelector('.slave-toggle');
            slaveSections[i].classList.add('tkn-disabled', 'tkn-gray');
            if (slaveToggle.type == 'checkbox')
                slaveToggle.checked = false;
        }
        getElement('.tkn-tab-card .'+umbrellaClass+' .master .sub-text').classList.add('tkn-gray');
    }else{
        for (var i = 0; i < slaveSections.length; i++) {
            var slaveToggle = slaveSections[i].querySelector('.slave-toggle');
            slaveSections[i].classList.remove('tkn-disabled', 'tkn-gray');
            if (slaveToggle.type == 'checkbox')
                slaveToggle.checked = true;
        }
        getElement('.tkn-tab-card .'+umbrellaClass+' .master .sub-text').classList.remove('tkn-gray');
    }
}   

function onChangeSlave(event, selector, umbrellaClass){
    var checkBoxParent = getElement('.'+selector), checkBox = event.currentTarget,
        slaveSections = document.querySelectorAll('.'+umbrellaClass+' .slave');
    if (checkBox.checked){
        checkBoxParent.classList.remove('tkn-gray');
    }else{
        checkBoxParent.classList.add('tkn-gray');
        // if all slaves are toggled off then turn master off
        var slaves = document.querySelectorAll('.'+umbrellaClass+' .slave .slave-toggle');
        var masterToggle = getElement('.'+umbrellaClass+' .master-toggle'), every = 0;

        for (var i=0; i<slaves.length; i++){
            if (slaves[i].type == 'checkbox' && !slaves[i].checked){
                every += 1;
            }
        }
        if(every == slaves.length){
            masterToggle.checked = false;
            getElement('.'+umbrellaClass+' .master .sub-text').classList.add('tkn-gray');

            for (var i = 0; i < slaveSections.length; i++) {
                var slaveToggle = slaveSections[i].querySelector('.slave-toggle');
                slaveSections[i].classList.add('tkn-disabled', 'tkn-gray');
            }
        }
        
        
    }
}

function onChangeDigitalMaster(umbrellaClass, initialFire){
    var section = getElement('.'+umbrellaClass), toggle = getElement('.'+umbrellaClass+' .master-toggle');
    var sectionToDisable1 = section.querySelector('.limit-amount'), sectionToDisable2 = section.querySelector('.limit-count');
    if(!toggle.checked){
        section.classList.add('tkn-gray');
        sectionToDisable1.classList.add('tkn-disabled', 'tkn-gray');
        sectionToDisable2.classList.add('tkn-disabled', 'tkn-gray');
    }else{
        section.classList.remove('tkn-gray');
        sectionToDisable1.classList.remove('tkn-disabled', 'tkn-gray');
        sectionToDisable2.classList.remove('tkn-disabled', 'tkn-gray');

        // Slider and the input values should come to their max values when the swutch ios turned off and on
        var sliderInput = getElement('#tab-content-form #digital-spends .'+umbrellaClass+' #new-limit-'+umbrellaClass);
        var countInput = getElement('#tab-content-form #digital-spends .'+umbrellaClass+' .limit-count .new .limit .limit-input');
        if(!initialFire){
            if(umbrellaClass == 'non-pin'){
                //if non-pin
                sliderNonPin.noUiSlider.set(sliderMaxValueNonPin);
                sliderInput.value = sliderMaxValueNonPin;
                countInput.value = nonPinCountLimit;
            }else{
                // if pin
                sliderPin.noUiSlider.set(sliderMaxValuePin);
                sliderInput.value = sliderMaxValuePin;
                countInput.value = pinCountLimit;
            }
        }
            
    }
}

function changeNonPinCountLimit(event){
    var toggleStatus = event.currentTarget.checked;
    if(toggleStatus){
        nonPinCountLimit = 10;
        changeViewOnLimitChange('non-pin', 10, toggleStatus);
    } else{
        nonPinCountLimit = 5;
        changeViewOnLimitChange('non-pin', 5, toggleStatus);
    }
        
}

function changeViewOnLimitChange(umbrellaClass, limit, toggleStatus){
    var limitLabel = getElement('.'+umbrellaClass+' .limit-count .new .input-label .count');
    var disclaimer = getElement('#digital-spends .disclaimer span');
    limitLabel.innerHTML = limit;
    if(toggleStatus)
        disclaimer.innerHTML = 'Disabling international spends will affect your max limits for non-PIN based Contactless POS transactions';
    else
        disclaimer.innerHTML = 'Enabling international spends will affect your max limits for non-PIN based Contactless POS transactions';
}

function isNumber(event){
    var charCode = event.which || event.keyCode;
    return (charCode >= 48 && charCode <= 57)
}

function validateInputMax(event, max){
    var inputValue = event.currentTarget.value;
    return inputValue <= max;
}

function applyChanges(){
    /* var limitCountInputs = document.querySelectorAll('#digital-spends .limit-count input'), valid = true;
    limitCountInputs.forEach(input => {
            if(!input.checkValidity())
                valid = false;
        });
    if(valid) */
    window.location='tkn-changes-successful.html';

}


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
    enableApplyButton();
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
    enableApplyButton();
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

// 
 function enableApplyButton(){
    changesMade = true;
    var buttons = document.querySelectorAll('.apply-digital');
    for(var i=0; i<buttons.length; i++){
        buttons[i].removeAttribute("disabled");
    }
    var cancelLinks = document.querySelectorAll('.cancel-changes');
    for(var i=0; i<cancelLinks.length; i++){
        cancelLinks[i].classList.remove('tkn-disabled');
        cancelLinks[i].removeAttribute("disabled");
    }
}

function disableApplyButton(){
    var buttons = document.querySelectorAll('.apply-digital');
    for(var i=0; i<buttons.length; i++){
        buttons[i].setAttribute("disabled", true);
    }
    var cancelLinks = document.querySelectorAll('.cancel-changes');
    for(var i=0; i<cancelLinks.length; i++){
        cancelLinks[i].classList.add('tkn-disabled');
        cancelLinks[i].setAttribute("disabled", true);
    }
}

/**
 * Handle input focus functionanlity
 */

 function inputFocus(selector){
    $(selector).focus(
        function(){
            $(this).parent('div').css('border-color','#0095d9');
        }).blur(
        function(){
            $(this).parent('div').css('border-color','#e6e6e6');
        });
 }

// Run on Initialization
function init(){
    onChangeCardMaster('all-online', 'desktop'); onChangeCardMaster('all-online', 'mobile');
    onChangeCardMaster('all-international', 'desktop'); onChangeCardMaster('all-international', 'mobile');
    onChangeDigitalMaster('non-pin', true);
    onChangeDigitalMaster('pin', true);
    disableApplyButton();
    inputFocus('.limit-input');

}

init();
