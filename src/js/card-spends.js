var changesMadeCard = false;

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

function cancelChangesCard(){
    if(!changesMadeCard){
        window.location = 'tkn-card-wallet-dashboard.html';
    }else {
        openExitWithoutSaveModal();
    }
}


// 
 function enableApplyButtonCard(screen){
    changesMadeCard = true;
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

function disableApplyButtonCard(screen){
    var buttons = document.querySelectorAll('.tkn-button-group.' + screen + ' .apply-digital');
    for(var i=0; i<buttons.length; i++){
        buttons[i].setAttribute("disabled", true);
    }
    /* var cancelLinks = document.querySelectorAll('.tkn-button-group.' + screen + ' .cancel-changes');
    for(var i=0; i<cancelLinks.length; i++){
        cancelLinks[i].classList.add('tkn-disabled');
        cancelLinks[i].setAttribute("disabled", true);
    } */
}

function init(){
    onChangeCardMaster('all-online', 'desktop'); onChangeCardMaster('all-online', 'mobile');
    onChangeCardMaster('all-international', 'desktop'); onChangeCardMaster('all-international', 'mobile');
    disableApplyButtonCard('card');
    inputFocus('.limit-input');
}

init();