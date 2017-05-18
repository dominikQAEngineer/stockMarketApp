function start(){
document.addEventListener("deviceready",onDeviceReady, false);
}
function onDeviceReady() {
	navigator.notification.beep(1);
}
function getIndecesValue(){
var url = "http://mybank.pl/gielda/"+document.querySelector('.stockName').value+".html";//Ustawienie url strony glownej
    $.ajax({
            type: "GET",//co ma funkcja robic - pobierac cos ze strony
            url: url, //adres strony podany powyzej
            dataType: "html", //pobiera kod html
            success: function (data) { //jezeli polaczyl sie z witryna, to do zmiennej "data" wrzuca to co pobral
            $("#status").val(JSON.stringify(data)); //sprawdzamy status tego co pobral
            data=$(data).find('.g_tab:nth-child(1) tr:nth-child(3) td b:nth-child(1)').text()//wyciagamy z tego co pobral wartosc indeksu
              console.log(data)
              console.log(typeof data) //te 2 linijki to tylko wrzucenie do loga servera info o tym co pobral i jakiego to typu
              document.querySelector(".stockInformation a#stockIndex").innerHTML = data;//wrzucamy do pliku html w miejsce selectora dana wartosc indeksu
            }
            ,
            error: function(xhr, textStatus, errorThrown) {//jakies tam informacje o ewentualnym bledzie
                    $("#status").val("Unavailable: " + textStatus);
                }
          });
}