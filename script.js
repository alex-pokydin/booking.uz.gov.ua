// ЗАМЕНИТЬ ЭТО
var url = 'https://booking.uz.gov.ua/ru/?from=2208001&to=2214140&date=2019-04-12&time=00%3A00&url=train-list';
var email = 'some-name@gmail.com';
///////////////

function doTrigger() {
  var url_cmp = UrlComponents( url );
    
  var options = {
    'method' : 'post',
    'payload' : url_cmp[10],
  };
  
  var response = UrlFetchApp.fetch('https://booking.uz.gov.ua/ru/train_search/', options);
  var str = response.getContentText();
  var json = JSON.parse(str);
  
  var txt = "<table border='1'>";
  
  if(json.data && !json.data.warning && json.data.list){
    for (x in json.data.list) {
      for (y in json.data.list[x]) {
        txt += "<tr><td>" + x + "</td><td>" + y + "=" + JSON.stringify(json.data.list[x][y]) + "</td></tr>";
      }
    }
    
    MailApp.sendEmail({
      to: email,
      subject: "BOOKING UZ",
      htmlBody: txt,
    });
  } 
  
  txt += "</table>"; 
  
  return txt;
}

function doGet() {
  var t = HtmlService.createTemplateFromFile("Index");
  t.data = doTrigger();
  
  return t.evaluate().setSandboxMode(HtmlService.SandboxMode.IFRAME);
}

function UrlComponents(url) {
  const _urlMatchPattern = /^((http[s]?):\/)?\/?([^:\/\s]+)(:([^\/]*))?((\/\w+)*\/)([\w\-\.]+[^#?\s]+)(\?([^#]*))?(#(.*))?$/mi;

  if (!_urlMatchPattern.test(url))
    return new Array();

  var urlMatches = url.match(_urlMatchPattern);

  return urlMatches;
}
