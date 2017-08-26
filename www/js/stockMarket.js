var options = { frequency: 300 };  // Update every 0.3 seconds
var htmlOfPage = "";
var wig40IndexLocal = "";
var $companyList = {};
var url = "http://mybank.pl/gielda/indeks-mwig40.html";

//Function responsible for refresh current stock index after movement of device (not working on browser
function refreshMovement(acceleration) {
    var deviceManufacturer  = device.manufacturer;
    if(acceleration.z<0 && deviceManufacturer!="unknown")
        loadCompanyList();
    }
function onError() {
    alert('There is some kind of problem with accelerator!');
}
function start(){
    document.addEventListener("deviceready",onDeviceReady, false);
}
function onDeviceReady() {
    var networkState = navigator.connection.type;
    if(networkState != Connection.NONE){
        loadCompanyList();
	    var watchID = navigator.accelerometer.watchAcceleration(refreshMovement, onError, options);
    }
    else{
    alert('There is no internet connection, after connect, click refresh button');
    }
}
function loadCompanyList(){
$companyList = $('#companyListSelect2');
    htmlOfPage =
    $.ajax({
                async:false,
                type: "GET",
                url: url,
                dataType: "html",
                success: function (data) {
//                        document.querySelector(".stockInformation a#wig40StockIndex").innerHTML =
                        wig40IndexLocal =
                        $(data).find('.g_tab:nth-child(1) tr:nth-child(3) td b:nth-child(1)').text();

              }
              }).responseText;
              window.localStorage.setItem("wig40IndexLocal", wig40IndexLocal);
              document.querySelector(".stockInformation a#wig40StockIndex").innerHTML =  window.localStorage.getItem("wig40IndexLocal");

              $companyList.empty();
              $companyList.append('<option value="-1">Wybierz spolke</option>');
              htmlOfPage=$(htmlOfPage).find(".g_tab:nth-of-type(3)")
    var listOfCompanyStorage = new Array();
    for(var i=3;i<=42;i++){
                listOfCompanyStorage.push($(htmlOfPage).find("tr:nth-of-type("+i+") td:nth-of-type(1) b").text());
                }

    window.localStorage.setItem("listOfCompanyStorage", JSON.stringify(listOfCompanyStorage));
    var retrieveInfo = window.localStorage.getItem("listOfCompanyStorage");
    var parsedInfo = JSON.parse(retrieveInfo);
    for(var i=0;i<40;i++){
            $companyList.append('<option value="'+(i+3)+'">'+parsedInfo[i]+'</option>');
            }
//// Without localStorage:
//    for(var i=3;i<=42;i++){
//            $companyList.append('<option value="'+
//            i+
//            '">'+$(htmlOfPage).find("tr:nth-of-type("+i+") td:nth-of-type(1) b").text()+'</option>');
//            }
}
function getAllIndeces(){
    var allCompanyInfoStorage = new Array();
    for(var i=3;i<=42;i++){
        // new object every time, Calling push will not copy your object, because JavaScript Objects are passed by reference: you're pushing the same Object as every array entry.
        var company ={companyName: "", measureTime: "", curIndex: "", prevIndex: "", percentChange: "", pointChange: "", curAssets: ""};
            company.companyName=  $(htmlOfPage).find("tr:nth-of-type("+i+") td:nth-of-type(1) b").text()
            company.measureTime=  $(htmlOfPage).find("tr:nth-of-type("+i+") td:nth-of-type(2)").text()
            company.curIndex=     $(htmlOfPage).find("tr:nth-of-type("+i+") td:nth-of-type(3) b").text()
            company.prevIndex=    $(htmlOfPage).find("tr:nth-of-type("+i+") td:nth-of-type(4)").text()
            company.percentChange=$(htmlOfPage).find("tr:nth-of-type("+i+") td:nth-of-type(5)").text()
            company.pointChange=  $(htmlOfPage).find("tr:nth-of-type("+i+") td:nth-of-type(6)").text()
            company.curAssets=    $(htmlOfPage).find("tr:nth-of-type("+i+") td:nth-of-type(7)").text()
            allCompanyInfoStorage.push(company)
    }
    window.localStorage.setItem("allCompanyInfoStorage", JSON.stringify(allCompanyInfoStorage));
}
function getSelectedCompanyInformation(){
    if( $("#companyListSelect2 option:selected").val()!=-1){
        document.querySelector(".selectedCompanyIndexInfo2 a#currentIndexValue2").innerHTML =
        $(htmlOfPage).find("tr:nth-of-type("+$("#companyListSelect2 option:selected").val()+") td:nth-of-type(3) b").text();

        srcOfSelectedCompany = $(htmlOfPage).find("tr:nth-of-type("+$("#companyListSelect2 option:selected").val()+") td:nth-of-type(1) a").attr('href');
        $.ajax({
                        async:false,
                        type: "GET",
                        url: srcOfSelectedCompany,
                        dataType: "html",
                        success: function (data) {
                               document.querySelector(".selectedCompanyIndexInfo2 img#wykresWybranejSpolki").src =
                                $(data).find('#wykres_indeksu').attr('src');
                      }
                      }).responseText;

    }
}