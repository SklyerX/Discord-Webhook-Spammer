
let counter = 0;

const params = new URLSearchParams(window.location.search);

$(document).ready(_ => {
  if (params.get("url") != null) {
    $("input")[0].value = params.get("url");
  }
  if (params.get("msg") != null) {
    $("input")[1].value = params.get("msg");
  }
});

let save = _ => {
  window.location.reload(true);
}

let url;
let msg;
let rate;
let cooldown;

let submit = _ => {
  url = $("input")[0].value;
  msg = $("input")[1].value;
  rate = $("input")[2].value;
  cooldown = $("input")[3].value;

  if (!url.length) {
    return alert('Please enter URL\nلطفا لینک را وارد کنید');
  }
  if (!url.startsWith("https://discord.com/api/webhooks/")) {
    return alert('URL is not a webhook link\nآدرس وارد شده لینک وبهوک نمیباشد');
  }
  if (!msg.length) {
    return alert('Please fill in all parts\nلطفا تمام قسمت هارا پر کنید');
  }

  if (url) {
    if (msg) {
      log("SYS", "Attempting to send '" + msg + "' to '" + url + "' every " + rate + "ms")
      send();
      document.body.classList.toggle("h");
    }
  }

}

let send = _ => {
  $("button")[1].disabled = true;

  $.ajax({
    type: "POST",
    url: url,
    async: true,
    data: { content: msg },
    complete: e => {
      if (e.status == 204) {
        counter++;
        log(e.status, "Webhook Spammer | Sent " + counter.toLocaleString() + " messages");
        setTimeout(send, rate);
      } else if (e.status == 429) {
        log(e.status, "Webhook Spammer | You are being rate-limited");
        log("SYS", "Taking a " + cooldown + "ms break...");
        setTimeout(send, cooldown);
      } else {
        if (e.status == 404) log(e.status, "Webhook not found !");
        if (e.status == 0) log(e.status, "AJAX request failed");
        log("SYS", "Reattempting...");
        setTimeout(send, rate);
      }
    }
  });
}
let logtext = [];
let log = (code, log) => {
  let day = new Date().toString().split(" ")[4];
  logtext.unshift("<span>" + day + "</span> => [" + code + "] " + log);
  if (logtext.length > 50) logtext.pop();
  $("code").html(logtext.join("<br>"));
}


if (window.location.protocol == "http:") {
  var restOfUrl = window.location.href.substr(5);
  window.location = "https:" + restOfUrl;
}
