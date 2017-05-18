function start(){
document.addEventListener("deviceready",onDeviceReady, false);
}
function onDeviceReady() {
	navigator.notification.beep(1);
}
function getIndecesValue(){
var url = "http://mybank.pl/gielda/"+document.querySelector('.stockName').value+".html";
    $.ajax({
            type: "GET",
            url: url,
            dataType: "html",
            success: function (data) {
            $("#status").val(JSON.stringify(data));
            data=$(data).find('.g_tab:nth-child(1) tr:nth-child(3) td b:nth-child(1)').text()
              console.log(data)
              console.log(typeof data)
              document.querySelector(".stockInformation a#stockIndex").innerHTML = data;
            }
            ,
            error: function(xhr, textStatus, errorThrown) {
                    $("#status").val("Unavailable: " + textStatus);
                }
          });
}