var options = { frequency: 300 };  // Update every 0.3 seconds
var htmlOfPage = "";
var wig40IndexLocal = "";
var wig40percentChangeLocal = "";
var wig40pointChangeLocal = "";
var wig40prevClosureLocal = "";
var wig40TodayOpeningLocal = "";
var wig40DailyMinLocal = "";
var wig40DailyMaxLocal = "";
var wig40CurAssetsLocal = "";
var wig40ImgSrcLocal = "";
var $companyList = {};
var multiSelectOptionString = '<option>Wybierz elementy</option>';
var url = "http://mybank.pl/gielda/indeks-mwig40.html";
//Function responsible for refresh current stock index after movement of device (not working on browser
function refreshMovement(acceleration) {
    var deviceManufacturer  = device.manufacturer;
    var networkState = navigator.connection.type;
    if(acceleration.z<0 && deviceManufacturer!="unknown" && networkState != Connection.NONE)
        loadCompanyList();
    else if(networkState === Connection.NONE)
    alert('There is no internet connection, connect to internet');

}
function onError() {
    alert('There is some kind of problem with accelerator!');
}
function start(){
    document.addEventListener("deviceready",onDeviceReady, false);
}

function saveSelectedCompanyList(){
    var prefCompanyList = document.getElementById("selectPrefCompany");
    var prefCompanySelected = new Array();
    for(var i=0; i < 41 ; i++){
        if(prefCompanyList.options[i].selected)
            prefCompanySelected.push('true');
        else
            prefCompanySelected.push('false');
    }
    console.log(prefCompanySelected);
    window.localStorage.setItem("prefCompanySelected", JSON.stringify(prefCompanySelected));
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
function setWig40LocalStorage(){
              window.localStorage.setItem("wig40IndexLocal", wig40IndexLocal);
              window.localStorage.setItem("wig40percentChangeLocal", wig40percentChangeLocal);
              window.localStorage.setItem("wig40pointChangeLocal", wig40pointChangeLocal);
              window.localStorage.setItem("wig40prevClosureLocal", wig40prevClosureLocal);
              window.localStorage.setItem("wig40TodayOpeningLocal", wig40TodayOpeningLocal);
              window.localStorage.setItem("wig40DailyMinLocal", wig40DailyMinLocal);
              window.localStorage.setItem("wig40DailyMaxLocal", wig40DailyMaxLocal);
              window.localStorage.setItem("wig40CurAssetsLocal", wig40CurAssetsLocal);
              window.localStorage.setItem("wig40ImgSrcLocal", wig40ImgSrcLocal);
}
function showWig40OnHtml(){
document.querySelector(".stockInformation a#wig40StockIndex").innerHTML =  window.localStorage.getItem("wig40IndexLocal");
document.querySelector("#percentChangeWig40").innerHTML =  window.localStorage.getItem("wig40percentChangeLocal");
document.querySelector("#pointChangeWig40").innerHTML =  window.localStorage.getItem("wig40pointChangeLocal");
document.querySelector("#prevClosureWig40").innerHTML =  window.localStorage.getItem("wig40prevClosureLocal");
document.querySelector("#todayOpeningWig40").innerHTML =  window.localStorage.getItem("wig40TodayOpeningLocal");
document.querySelector("#dailyMinWig40").innerHTML =  window.localStorage.getItem("wig40DailyMinLocal");
document.querySelector("#dailyMaxWig40").innerHTML =  window.localStorage.getItem("wig40DailyMaxLocal");
document.querySelector("#curAssetsWig40").innerHTML =  window.localStorage.getItem("wig40CurAssetsLocal");
document.querySelector("img#ogolnyWykresWig40").src = window.localStorage.getItem("wig40ImgSrcLocal");
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
                        wig40IndexLocal = $(data).find('.g_tab:nth-child(1) tr:nth-child(3) td b:nth-child(1)').text();
                        wig40percentChangeLocal = $(data).find('.g_tab:nth-child(1) tr:nth-child(4) td span').text();
                        wig40pointChangeLocal = $(data).find('.g_tab:nth-child(1) tr:nth-child(5) td span').text();
                        wig40prevClosureLocal = $(data).find('.g_tab:nth-child(1) tr:nth-child(6) td:nth-child(2)').text();
                        wig40TodayOpeningLocal = $(data).find('.g_tab:nth-child(1) tr:nth-child(7) td:nth-child(2)').text();
                        wig40DailyMinLocal = $(data).find('.g_tab:nth-child(1) tr:nth-child(8) td:nth-child(2)').text();
                        wig40DailyMaxLocal = $(data).find('.g_tab:nth-child(1) tr:nth-child(9) td:nth-child(2)').text();
                        wig40CurAssetsLocal = $(data).find('.g_tab:nth-child(1) tr:nth-child(10) td:nth-child(2)').text();
                        wig40ImgSrcLocal = $(data).find('#wykres_indeksu').attr('src');
              }
              }).responseText;
              setWig40LocalStorage();
              showWig40OnHtml();


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
    var retrieveSelectedCompanyInfo = window.localStorage.getItem("prefCompanySelected");
    var parsedSelectedCompanyInfo = JSON.parse(retrieveSelectedCompanyInfo);

    for(var i=0;i<40;i++){
            $companyList.append('<option value="'+(i+3)+'">'+parsedInfo[i]+'</option>');
                    if(parsedSelectedCompanyInfo != undefined || parsedSelectedCompanyInfo != null){
                        if(parsedSelectedCompanyInfo[i] === "true")
                        multiSelectOptionString += '<option value="'+(i+3)+'" selected="selected">'+parsedInfo[i]+'</option>';
                        else
                        multiSelectOptionString += '<option value="'+(i+3)+'">'+parsedInfo[i]+'</option>';
                    }
                    else{
                        multiSelectOptionString += '<option value="'+(i+3)+'">'+parsedInfo[i]+'</option>';
                    }
            }
    $('#selectPrefCompany').empty().append(multiSelectOptionString);
    $('#selectPrefCompany').selectmenu('refresh');
    $('#selectPrefCompany').selectmenu('refresh', true);
//    document.querySelector("#checkMultiselectOptions").innerHTML =  multiSelectOptionString;
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