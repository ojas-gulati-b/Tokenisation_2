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
    var tabToActive = '.tkn-manage-limits-screen #' + tabID;
    getElement(tabToActive).classList.add('active');
    event.currentTarget.className += ' active';
}

function openExitWithoutSaveModal() {
    $('#tkn-exit-without-save-modal').addClass('show');
}

function closeModal(){
    $('#tkn-exit-without-save-modal').removeClass('show');
}

function exitWithoutSave(){
    $('#tkn-exit-without-save-modal').removeClass('show');
    window.location = 'tkn-card-wallet-dashboard.html';
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
            slaveSections[i].classList.add('tkn-disabled');
            slaveSections[i].querySelector('.heading-text').classList.add('tkn-gray');
            slaveSections[i].querySelector('.switch').classList.add('tkn-gray');
            slaveSections[i].querySelector('.switch-disclaimer').classList.add('show');
            if (slaveToggle.type == 'checkbox')
                slaveToggle.checked = false;
        }
        getElement('.tkn-tab-card .'+umbrellaClass+' .master .sub-text').classList.add('tkn-gray');
        getElement('.tkn-tab-card .'+umbrellaClass+' .master .heading-text').classList.add('tkn-gray');
    }else{
        for (var i = 0; i < slaveSections.length; i++) {
            var slaveToggle = slaveSections[i].querySelector('.slave-toggle');
            slaveSections[i].classList.remove('tkn-disabled');
            slaveSections[i].querySelector('.heading-text').classList.remove('tkn-gray');
            slaveSections[i].querySelector('.switch').classList.remove('tkn-gray');
            slaveSections[i].querySelector('.switch-disclaimer').classList.remove('show');

            if (slaveToggle.type == 'checkbox')
                slaveToggle.checked = true;
        }
        getElement('.tkn-tab-card .'+umbrellaClass+' .master .sub-text').classList.remove('tkn-gray');
        getElement('.tkn-tab-card .'+umbrellaClass+' .master .heading-text').classList.remove('tkn-gray');
    }
}   

function onChangeSlave(event, selector, umbrellaClass){
    var checkBoxParent = getElement('.'+selector), checkBox = event.currentTarget,
        slaveSections = document.querySelectorAll('.'+umbrellaClass+' .slave'),
        masterToggle = getElement('.'+umbrellaClass+' .master-toggle');
    if (checkBox.checked){
        checkBoxParent.querySelector('.heading-text').classList.remove('tkn-gray');
        if(!masterToggle.checked){
            masterToggle.checked = true;
            getElement('.'+umbrellaClass+' .master .sub-text').classList.remove('tkn-gray');
            getElement('.'+umbrellaClass+' .master .heading-text').classList.remove('tkn-gray');
        }
    }else{
        checkBoxParent.querySelector('.heading-text').classList.add('tkn-gray');
        // if all slaves are toggled off then turn master off
        var slaves = document.querySelectorAll('.'+umbrellaClass+' .slave .slave-toggle'), every = 0;

        /* for (var i=0; i<slaves.length; i++){
            if (slaves[i].type == 'checkbox' && !slaves[i].checked){
                every += 1;
            }
        }
        if(every == slaves.length){
            masterToggle.checked = false;
            getElement('.'+umbrellaClass+' .master .sub-text').classList.add('tkn-gray');
            getElement('.'+umbrellaClass+' .master .heading-text').classList.add('tkn-gray');

            for (var i = 0; i < slaveSections.length; i++) {
                var slaveToggle = slaveSections[i].querySelector('.slave-toggle');
                slaveSections[i].querySelector('.heading-text').classList.add('tkn-gray');
            }
        } */
        
        
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
    var internationalDiscElements= document.querySelectorAll('#digital-spends .international-off-disc');
    limitLabel.innerHTML = limit;
    if(toggleStatus){
        disclaimer.innerHTML = 'Disabling international spends will affect your max limits for non-PIN based Contactless POS transactions';
        for(var i=0; i<internationalDiscElements.length; i++){
            internationalDiscElements[i].classList.add('tkn-hidden')
        }
    }
    else{
        disclaimer.innerHTML = 'Turn on International Spends to use these services outside India. Enabling international spends will affect your max limits for non-PIN based Contactless POS transactions';
        for(var i=0; i<internationalDiscElements.length; i++){
            internationalDiscElements[i].classList.remove('tkn-hidden')
        }
    }
        
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
    var limitCountInputs = document.querySelectorAll('#digital-spends .limit-count input'), valid = true;
    for(var i=0; i<limitCountInputs.length; i++){
        if(!limitCountInputs[i].checkValidity()){
            valid = false;
            $(limitCountInputs[i]).parent('div').css('border-color','salmon');

        }
    }
    /* limitCountInputs.forEach(input => {
            if(!input.checkValidity())
                valid = false;
                
        }); */
    if(valid)
    window.location='tkn-changes-successful.html';

}


// 
 function enableApplyButton(screen){
    changesMade = true;
    var buttons = document.querySelectorAll('.tkn-button-group.' + screen + ' .apply-digital');
    for(var i=0; i<buttons.length; i++){
        buttons[i].removeAttribute("disabled");
    }
    var cancelLinks = document.querySelectorAll('.tkn-button-group.' + screen + ' .cancel-changes');
    for(var i=0; i<cancelLinks.length; i++){
        cancelLinks[i].classList.remove('tkn-disabled');
        cancelLinks[i].removeAttribute("disabled");
    }
}

function disableApplyButton(screen){
    var buttons = document.querySelectorAll('.tkn-button-group.' + screen + ' .apply-digital');
    for(var i=0; i<buttons.length; i++){
        buttons[i].setAttribute("disabled", true);
    }
    var cancelLinks = document.querySelectorAll('.tkn-button-group.' + screen + ' .cancel-changes');
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
/* function init(){
    onChangeCardMaster('all-online', 'desktop'); onChangeCardMaster('all-online', 'mobile');
    onChangeCardMaster('all-international', 'desktop'); onChangeCardMaster('all-international', 'mobile');
    disableApplyButton('card');
    inputFocus('.limit-input');

}

init();
 */