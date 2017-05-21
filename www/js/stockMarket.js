var options = { frequency: 300 };  // Update every 0.3 seconds
var htmlOfPage = "";
//Function responsible for refresh current stock index after movement of device (not working on browser
function refreshMovement(acceleration) {
var deviceManufacturer  = device.manufacturer;
if(acceleration.z<0 && deviceManufacturer!="unknown")
getAllIndeces()
}
function onError() {
    alert('onError!');
}
function start(){
document.addEventListener("deviceready",onDeviceReady, false);
}
function onDeviceReady() {
    loadCompanyList()
	var watchID = navigator.accelerometer.watchAcceleration(refreshMovement, onError, options);
}
function loadCompanyList(){
var url = "http://mybank.pl/gielda/indeks-mwig40.html";
var $companyList = $('#companyListSelect');
    htmlOfPage =
    $.ajax({
                async:false,
                type: "GET",
                url: url,
                dataType: "html",
                success: function (data) {
                        document.querySelector(".stockInformation a#wig40StockIndex").innerHTML =
                        $(data).find('.g_tab:nth-child(1) tr:nth-child(3) td b:nth-child(1)').text();
              }
              }).responseText;
              $companyList.empty();
              $companyList.append('<option value="-1">Wybierz spolke</option>');
              htmlOfPage=$(htmlOfPage).find(".g_tab:nth-of-type(3)")
for(var i=3;i<=42;i++){
            $companyList.append('<option value="'+
            i+
            '">'+$(htmlOfPage).find("tr:nth-of-type("+i+") td:nth-of-type(1) b").text()+'</option>');
            }
}
function getAllIndeces(){
var url = "http://mybank.pl/gielda/indeks-mwig40.html";
var company ={companyName: "", measureTime: "", curIndex: "", prevIndex: "", percentChange: "", pointChange: "", curAssets: ""};
//    htmlOfPage =
//    $.ajax({
//                async:false,
//                type: "GET",
//                url: url,
//                dataType: "html",
//                success: function (data) {
//              document.querySelector(".stockInformation a#wig40StockIndex").innerHTML =
//              $(data).find('.g_tab:nth-child(1) tr:nth-child(3) td b:nth-child(1)').text();
//                }
////                error: function(xhr, textStatus, errorThrown) {
////                        $("#status").val("Unavailable: " + textStatus);
////                    }
//              }).responseText;
//              htmlOfPage=$(htmlOfPage).find(".g_tab:nth-of-type(3)")
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
function getSelectedCompanyInformation(){
    if( $("#companyListSelect option:selected").val()!=-1)
    document.querySelector(".selectedCompanyIndexInfo a#currentIndexValue").innerHTML =
    $(htmlOfPage).find("tr:nth-of-type("+$("#companyListSelect option:selected").val()+") td:nth-of-type(3) b").text()
}
