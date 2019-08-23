/** Global Variables */
let nonPinCountLimit = 5;
let selectedCardID = '';
let carouselLoaded = false;
let changesMade = false

function getElement(selector) {
    return document.querySelector(selector);
}
function goToScreen(screen) {
    let prevScreen, nextScreen;
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
        /* getElement('#tab-content-form').reset(); */
    }
    else if (screen === 'applied-changes-screen') {
        let limitCountInputs = document.querySelectorAll('#digital-spends .limit-count input'), valid = true;
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
        //$('.card-carousel-screen-2').slick();
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
    
}
function switchTab(event, tabID) {
    const tabs = document.querySelectorAll(`.tkn-manage-limits-screen .tab-content .content`),
        tabLinks = document.querySelectorAll(`.tkn-manage-limits-screen .tabs-header .tkn-tabs .tkn-tab`);
    tabs.forEach(element => {
        element.classList.remove('active')
    });
    tabLinks.forEach(element => {
        element.classList.remove('active')
    });
    const tabToActive = `.tkn-manage-limits-screen #${tabID}`;
    getElement(tabToActive).classList.add('active');
    event.currentTarget.className += ' active';
}

function openExitWithoutSaveModal() {
    $('#submit-dispute-modal').addClass('show');
}

function closeModal(){
    $('#submit-dispute-modal').removeClass('show')
}

function onExitWithoutSave(){
    changesMade = false; // Reset the changes made flag
    goToScreen('cards-screen');
    window.location.hash='';
    disableApplyButton();

}

function selectCard(event, parent) {
    //var all =  document.querySelectorAll('.card-radio-image');
    document.querySelectorAll('.card-radio-image').forEach(element => {
        element.src = './assets/images/card-select.png';
    });
    //let element = event.currentTarget.querySelector('.card-radio-image');
    let cardIndex;
    if(event.currentTarget.dataset.slickIndex !== undefined){
        cardIndex = Number(event.currentTarget.dataset.slickIndex)
        selectedCardID = cardIndex+1;
    }
    
    
    if( parent == 'cards-list'){
        goToScreen('card-limits');
        $('.card-carousel-screen-2').slick('slickGoTo', cardIndex);
        getElement('.card-carousel-screen-2 .slick-dots').style.top = '50%';
        getElement('.tkn-after-card-selection .tkn-scrollable-div').style.top = '64%';
        getElement('.dummy-div').style.display = 'block';
    }
    
    if(cardIndex !== undefined){
        getElement(`#card-limits .tkn-cards .card-${selectedCardID} .card-radio-image`).src = './assets/images/card-selected.png';
        getElement(`#cards-list .tkn-cards .card-${selectedCardID} .card-radio-image`).src = './assets/images/card-selected.png';
        getElement('.dummy-div').style.display = 'block';
        getElement('.card-carousel-screen-2 .slick-dots').style.top = '50%';
        getElement('.tkn-after-card-selection .tkn-scrollable-div').style.top = '64%';
    }else{
        event.currentTarget.querySelector('.card-radio-image').src = './assets/images/card-selected.png';
        goToScreen('card-limits');
    }
}

function scrollDown(){
    event.currentTarget.style.display = 'none';
    getElement('.card-carousel-screen-2 .slick-dots').style.top = '91%';
    getElement('.tkn-after-card-selection .tkn-scrollable-div').style.top = '104%';
}

/**
 * Establish master slave relationship between card spends switches
 */

function onChangeCardMaster(umbrellaClass) {
    const slaveSelector = `.${umbrellaClass} .slave`, masterToggleSelector = ` .${umbrellaClass} .master-toggle`;
    const masterToggle = getElement(masterToggleSelector);
    let slaveSections = document.querySelectorAll(slaveSelector);
    if (masterToggle.type == 'checkbox' && masterToggle.checked === false){
        for (var i = 0; i < slaveSections.length; i++) {
            const slaveToggle = slaveSections[i].querySelector('.slave-toggle');
            slaveSections[i].classList.add('disabled', 'gray');
            if (slaveToggle.type == 'checkbox')
                slaveToggle.checked = false;
        }
        getElement(`.${umbrellaClass} .master .sbi-subheading`).classList.add('gray');
    }else{
        for (var i = 0; i < slaveSections.length; i++) {
            const slaveToggle = slaveSections[i].querySelector('.slave-toggle');
            slaveSections[i].classList.remove('disabled', 'gray');
            if (slaveToggle.type == 'checkbox')
                slaveToggle.checked = true;
        }
        getElement(`.${umbrellaClass} .master .sbi-subheading`).classList.remove('gray');
    }
}	

function onChangeSlave(event, selector, umbrellaClass){
    const checkBoxParent = getElement(`.${selector}`), checkBox = event.currentTarget,
        slaveSections = document.querySelectorAll(`.${umbrellaClass} .slave`);
    if (checkBox.checked){
        checkBoxParent.classList.remove('gray');
    }else{
        checkBoxParent.classList.add('gray');
        // if all slaves are toggled off then turn master off
        const slaves = document.querySelectorAll(`.${umbrellaClass} .slave .slave-toggle`);
        let masterToggle = getElement(`.${umbrellaClass} .master-toggle`), every = 0;

        slaves.forEach(slave => {
            if (slave.type == 'checkbox' && !slave.checked)
                every += 1;
        });
        //allSlavesOff = slaves.every(slave => slave.type == 'checkbox' && !slave.checked);
        if(every == slaves.length){
            masterToggle.checked = false;
            getElement(`.${umbrellaClass} .master .sbi-subheading`).classList.add('gray');

            for (var i = 0; i < slaveSections.length; i++) {
                const slaveToggle = slaveSections[i].querySelector('.slave-toggle');
                slaveSections[i].classList.add('disabled', 'gray');
            }
        }
        
        
    }
}

function onChangeDigitalMaster(umbrellaClass){
    const section = getElement(`.${umbrellaClass}`), toggle = getElement(`.${umbrellaClass} .master-toggle`);
    let sectionToDisable1 = section.querySelector('.limit-amount'), sectionToDisable2 = section.querySelector('.limit-count');
    if(!toggle.checked){
        section.classList.add('tkn-gray');
        sectionToDisable1.classList.add('tkn-disabled', 'tkn-gray');
        sectionToDisable2.classList.add('tkn-disabled', 'tkn-gray');
    }else{
        section.classList.remove('tkn-gray');
        sectionToDisable1.classList.remove('tkn-disabled', 'tkn-gray');
        sectionToDisable2.classList.remove('tkn-disabled', 'tkn-gray');
    }
}

function changeNonPinCountLimit(event){
    const toggleStatus = event.currentTarget.checked;
    if(toggleStatus){
        nonPinCountLimit = 10;
        changeViewOnLimitChange('non-pin', 10, toggleStatus);
    } else{
        nonPinCountLimit = 5;
        changeViewOnLimitChange('non-pin', 5, toggleStatus);
    }
        
}

function changeViewOnLimitChange(umbrellaClass, limit, toggleStatus){
    const limitLabel = getElement(`.${umbrellaClass} .limit-count .new .input-label .count`);
    const disclaimer = getElement(`#digital-spends .disclaimer span`);
    limitLabel.innerHTML = limit;
    if(toggleStatus)
        disclaimer.innerHTML = 'Disabling international spends will affect your max limits for non-PIN based Contactless POS transactions';
    else
        disclaimer.innerHTML = 'Enabling international spends will affect your max limits for non-PIN based Contactless POS transactions';
}

function isNumber(event){
    const charCode = event.which || event.keyCode;
    return (charCode >= 48 && charCode <= 57)
}

function validateInputMax(event, max){
    const inputValue = event.currentTarget.value;
    return inputValue <= max;
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

var slider1 = document.getElementById('range-slider-1');
noUiSlider.create(slider1, {
    start: 0,
    connect: 'lower',
    step: 1,
    orientation: 'horizontal', // 'horizontal' or 'vertical'
    range: {
        'min': 500,
        'max': 2000
    },
    pips: {
        mode: 'count',
        values: 4,
        density: 25
    }
});

var slider2 = document.getElementById('range-slider-2');
noUiSlider.create(slider2, {
    start: 0,
    connect: 'lower',
    step: 100,
    orientation: 'horizontal', // 'horizontal' or 'vertical'
    range: {
        'min': 500,
        'max': 2000
    },
    pips: {
        mode: 'count',
        values: 4,
        density: 25
    }
});

/** Linking sliders with input fields */
const inputField1 = document.getElementById('new-limit-1');

//update input field on slider update
slider1.noUiSlider.on('update', function (values, handle) {
    const value = values[handle];
    /* if (handle) { // i.e. if handle with index 1 comes up
        inputField1.value = Math.round(value);
    } */
    inputField1.value = Math.round(value);
    enableApplyButton();
});

// update slider when user clicks outside the box after entering the value
inputField1.addEventListener('change', function () {
    /* slider1.noUiSlider.set([null, this.value]); */
    slider1.noUiSlider.set(this.value);
});

// update the slider after user presses enter key after entering the value
inputField1.addEventListener('keydown', function (e) {

    if(e.which == 13){
        slider1.noUiSlider.set(this.value);
    }

});

const inputField2 = document.getElementById('new-limit-2');

//update input field on slider update
slider2.noUiSlider.on('update', function (values, handle) {
    const value = values[handle];
    /* if (handle) {
        inputField2.value = Math.round(value);
    } */
    inputField2.value = Math.round(value);
    enableApplyButton();
});

// update slider when user clicks outside the box after entering the value
inputField2.addEventListener('change', function () {
    /* slider2.noUiSlider.set([null, this.value]); */
    slider2.noUiSlider.set(this.value);
});

// update the slider after user presses enter key after entering the value
inputField2.addEventListener('keydown', function (e) {
    if(e.which == 13){
        slider2.noUiSlider.set(this.value);
    }
});

// Disable the pseudo handle
/* var origins = document.getElementsByClassName('noUi-origin');
origins[0].setAttribute('disabled', true); */

// 
/* function enableApplyButton(){
    changesMade = true;
    const buttons = document.querySelectorAll('.apply-digital');
    buttons.forEach(button => {
        button.removeAttribute("disabled");
    });

    const cancelLinks = document.querySelectorAll('.cancel-changes');
    cancelLinks.forEach(link => {
        link.classList.remove('tkn-disabled', 'tkn-gray');
    });
}

function disableApplyButton(){
    const buttons = document.querySelectorAll('.apply-digital');
    buttons.forEach(button => {
        button.setAttribute("disabled", true);
    });

    const cancelLinks = document.querySelectorAll('.cancel-changes');
    cancelLinks.forEach(link => {
        link.classList.add('tkn-disabled', 'tkn-gray');
    });
} */

/**
 * Card carousel code
 */
function initializeCarousel(carousel, options){
    carousel = `.${carousel}`;
    //$(document).ready(function(){
    $(carousel).slick(options);
      //});
}

/**
 * Select menu code
 */
function showSelectMenu(){
    const options = getElement('.tkn-card-selection-dropdown .all-options').querySelectorAll('.option');
    const selectedValue = getElement('.tkn-card-selection-dropdown .selected-option #selectedValue').innerHTML;

    getElement('.tkn-card-selection-dropdown .all-options').style.display = 'block';
    
    options.forEach(option => {
        if(option.querySelector('.value').innerHTML === selectedValue){
            option.querySelector('img').classList.remove('hidden');
            option.querySelector('img').classList.add('selected');
        }
        else
            option.querySelector('img').classList.add('hidden');
    });
}

function selectCardOption(event){
    const selectedOption = event.currentTarget;
    let valueSelected = selectedOption.querySelector('.value').innerHTML; // Value on selecting the card option
    
    
    getElement('.tkn-card-selection-dropdown .selected-option #selectedValue').innerHTML = valueSelected;
    getElement('.tkn-card-selection-dropdown .all-options').style.display = 'none';
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
    onChangeDigitalMaster('non-pin', 'desktop'); onChangeDigitalMaster('non-pin', 'mobile');
    onChangeDigitalMaster('pin', 'desktop'); onChangeDigitalMaster('pin', 'mobile');
    disableApplyButton();
    inputFocus('.limit-input');
    const carousel1Options = {
        dots: false,
        centerMode: true,
        arrows: false,
        /* centerPadding: '40px', */
        slidesToShow: 1,
        slidesToScroll: 3,
        initialSlide: 1,
        infinite: false,
        variableWidth: true,
    };

    /* $(document).ready(function(){
        initializeCarousel('card-carousel-screen-1', carousel1Options);
        changesMade = false; // Setting pristine state for inputs
    }); */

    (function () {
        $(document).mouseup(function (e) {
            var container = $('.all-options');
            // if the target of the click isn't the container nor a descendant of the container
            if (!container.is(e.target) && container.has(e.target).length === 0) {
                container.hide();
            }
        });
    }());

      
}

init();