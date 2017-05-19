function onSuccess(acceleration) {
//    alert('Acceleration X: ' + acceleration.x + '\n' +
//          'Acceleration Y: ' + acceleration.y + '\n' +
//          'Acceleration Z: ' + acceleration.z + '\n' +
//          'Timestamp: '      + acceleration.timestamp + '\n');
if(acceleration.z<0)
getIndecesValue()
}

function onError() {
    alert('onError!');
}

var options = { frequency: 300 };  // Update every 0.3 seconds


function start(){
document.addEventListener("deviceready",onSuccess, false);
//var watchID = navigator.accelerometer.watchAcceleration(onSuccess, onError, options); //Wykomentowany poniewaz browser sobie z tym nie radzi
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
              document.querySelector(".stockInformation a#stockIndex").innerHTML = data;//wrzucamy do pliku html w miejsce selectora dana wartosc indeksu
            }
            ,
            error: function(xhr, textStatus, errorThrown) {//jakies tam informacje o ewentualnym bledzie
                    $("#status").val("Unavailable: " + textStatus);
                }
          });
}
function getAllIndeces(){
var url = "http://mybank.pl/gielda/indeks-mwig40.html";
var company ={companyName: "", measureTime: "", curIndex: "", prevIndex: "", percentChange: "", pointChange: "", curAssets: ""};
    var htmlOfPage =
    $.ajax({
                async:false,
                type: "GET",
                url: url,
                dataType: "html",
//                success: function (data) {
//                $("#status").val(JSON.stringify(data));
//                data=$(data).find(".g_tab:nth-of-type(3)")
//                },
//                error: function(xhr, textStatus, errorThrown) {
//                        $("#status").val("Unavailable: " + textStatus);
//                    }
              }).responseText;
              htmlOfPage=$(htmlOfPage).find(".g_tab:nth-of-type(3)")
for(var i=3;i<=42;i++){
            company.companyName=  $(htmlOfPage).find("tr:nth-of-type("+i+") td:nth-of-type(1) b").text()
            company.measureTime=  $(htmlOfPage).find("tr:nth-of-type("+i+") td:nth-of-type(2)").text()
            company.curIndex=     $(htmlOfPage).find("tr:nth-of-type("+i+") td:nth-of-type(3) b").text()
            company.prevIndex=    $(htmlOfPage).find("tr:nth-of-type("+i+") td:nth-of-type(4)").text()
            company.percentChange=$(htmlOfPage).find("tr:nth-of-type("+i+") td:nth-of-type(5)").text()
            company.pointChange=  $(htmlOfPage).find("tr:nth-of-type("+i+") td:nth-of-type(6)").text()
            company.curAssets=    $(htmlOfPage).find("tr:nth-of-type("+i+") td:nth-of-type(7)").text()

             console.log("Nazwa spolki: %s, Czas pomiaru: %s, Aktualny Indeks %s, Poprzedni Indeks %s, Zmiana procentowa %s, Zmiana punktowa %s, Obrot %s",
             company.companyName, company.measureTime, company.curIndex, company.prevIndex, company.percentChange, company.pointChange, company.curAssets);
            }
}