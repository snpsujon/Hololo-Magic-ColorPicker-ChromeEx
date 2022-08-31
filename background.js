chrome.runtime.onInstalled.addListener(()=>{
    chrome.contextMenus.create({
        id:"text",
        title:"You Have Been Hacked",
        type:'normal',
        contexts:['all']
    });
});
chrome.contextMenus.onClicked.addListener(function(info,tab){
    chrome.tabs.query({active:true,currentWindow:true},function(tabs){
        const msg = "Clicked";
        console.log(msg);
        chrome.storage.sync.set({msg});
        chrome.tabs.sendMessage(tabs[0].id,{"message":msg});
        
    });
    
});


