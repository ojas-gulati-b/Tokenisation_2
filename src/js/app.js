/** Global Variables */
var nonPinCountLimit = 5, pinCountLimit = 99, selectedCardID = '', carouselLoaded = false, changesMade = false;

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

/**
 * 
 * This function is not in use in UI anymore after removal of spends tabs
 */
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
 * 
 * This function is not in use in UI anymore after removal of spends tabs
 */
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

/**
 * 
 * This function is not in use in UI anymore after removal of spends tabs
 */
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