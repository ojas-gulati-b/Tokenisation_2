function init(){
    onChangeCardMaster('all-online', 'desktop'); onChangeCardMaster('all-online', 'mobile');
    onChangeCardMaster('all-international', 'desktop'); onChangeCardMaster('all-international', 'mobile');
    disableApplyButton('card');
    inputFocus('.limit-input');
}

init();