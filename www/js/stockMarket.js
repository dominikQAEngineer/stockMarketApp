var options = { frequency: 300 };  // Update every 0.3 seconds
var htmlOfPage = "";
var companyListArray = new Array();
var $companyList = {};
var multiSelectOptionString = '';
var url = "http://mybank.pl/gielda/indeks-mwig40.html";
//Function responsible for refresh current stock index after movement of device (not working on browser
function refreshMovement(acceleration) {
    var deviceManufacturer  = device.manufacturer;
    var networkState = navigator.connection.type;
    if(acceleration.z<0 && deviceManufacturer!="unknown" && networkState != Connection.NONE){
    loadCompanyList();
    alert('Odświeżono dane z dostępem do internetu, wszystko aktualne');
    }
    else if(acceleration.z<0 && deviceManufacturer!="unknown" && networkState === Connection.NONE){
    loadCompanyListWithoutInternet();
    alert('Odświeżono dane bez dostępu do internetu, dane są załadowane ze zmiennych lokalnych');
    }
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
        loadCompanyListWithoutInternet();
        var watchID = navigator.accelerometer.watchAcceleration(refreshMovement, onError, options);
        alert('Dane zostały załadowane bez połączenia internetowego, ze zmiennych lokalnych - mogą być nieaktualne');
    }
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
function getWig40InfoFromPage(){
    $.ajax({
                async:false,
                type: "GET",
                url: url,
                dataType: "html",
                success: function (data) {
                        window.localStorage.setItem("wig40IndexLocal", $(data).find('.g_tab:nth-child(1) tr:nth-child(3) td b:nth-child(1)').text());
                        window.localStorage.setItem("wig40percentChangeLocal", $(data).find('.g_tab:nth-child(1) tr:nth-child(4) td span').text());
                        window.localStorage.setItem("wig40pointChangeLocal", $(data).find('.g_tab:nth-child(1) tr:nth-child(5) td span').text());
                        window.localStorage.setItem("wig40prevClosureLocal", $(data).find('.g_tab:nth-child(1) tr:nth-child(6) td:nth-child(2)').text());
                        window.localStorage.setItem("wig40TodayOpeningLocal", $(data).find('.g_tab:nth-child(1) tr:nth-child(7) td:nth-child(2)').text());
                        window.localStorage.setItem("wig40DailyMinLocal", $(data).find('.g_tab:nth-child(1) tr:nth-child(8) td:nth-child(2)').text());
                        window.localStorage.setItem("wig40DailyMaxLocal", $(data).find('.g_tab:nth-child(1) tr:nth-child(9) td:nth-child(2)').text());
                        window.localStorage.setItem("wig40CurAssetsLocal", $(data).find('.g_tab:nth-child(1) tr:nth-child(10) td:nth-child(2)').text());
                        window.localStorage.setItem("wig40ImgSrcLocal", $(data).find('#wykres_indeksu').attr('src'));
              }
              }).responseText;
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
function getCompanyListFromPage(){
    var listOfCompanyAjax = "";
    $.ajax({
                    async:false,
                    type: "GET",
                    url: url,
                    dataType: "html",
                    success: function (data) {
                           listOfCompanyAjax = $(data).find(".g_tab:nth-of-type(3)");
                  }
                  }).responseText;

     for(var i=3;i<=42;i++){
           companyListArray.push($(listOfCompanyAjax).find("tr:nth-of-type("+i+") td:nth-of-type(1) b").text());
     }

        window.localStorage.setItem("listOfCompanyStorage", JSON.stringify(companyListArray));


        var retrieveListOfCompany = window.localStorage.getItem("listOfCompanyStorage");
        var parsedListOfCompany = JSON.parse(retrieveListOfCompany);


}
function showListOfCompanyOnPage(){
    $companyList = $('#companyListSelect2');
    $companyList.empty();
    $companyList.append('<option value="-1">Wybierz spolke</option>');
    var retrieveListOfCompany = window.localStorage.getItem("listOfCompanyStorage");
    var parsedListOfCompany = JSON.parse(retrieveListOfCompany);
    var retrieveSelectedCompanyInfo = window.localStorage.getItem("prefCompanySelected");
    var parsedSelectedCompanyInfo = JSON.parse(retrieveSelectedCompanyInfo);
    multiSelectOptionString = '<option>Wybierz elementy</option>';
        for(var i=0;i<40;i++){
                $companyList.append('<option value="'+(i+3)+'">'+parsedListOfCompany[i]+'</option>');
                        if(parsedSelectedCompanyInfo != undefined || parsedSelectedCompanyInfo != null){
                            if(parsedSelectedCompanyInfo[i] === "true")
                            multiSelectOptionString += '<option value="'+(i+3)+'" selected="selected">'+parsedListOfCompany[i]+'</option>';
                            else
                            multiSelectOptionString += '<option value="'+(i+3)+'">'+parsedListOfCompany[i]+'</option>';
                        }
                        else{
                            multiSelectOptionString += '<option value="'+(i+3)+'">'+parsedListOfCompany[i]+'</option>';
                        }
                }
        $('#selectPrefCompany').empty().append(multiSelectOptionString);
        $('#selectPrefCompany').selectmenu();
        $('#selectPrefCompany').selectmenu('refresh');
        $('#selectPrefCompany').selectmenu('refresh', true);
}

function loadCompanyListWithoutInternet(){
    showWig40OnHtml();
    showListOfCompanyOnPage();
}
function loadCompanyList(){
    getWig40InfoFromPage();
    showWig40OnHtml();
    getCompanyListFromPage();
    showListOfCompanyOnPage();
}
function getDataForSelectedCompany(){
    var networkState = navigator.connection.type;
    if(networkState != Connection.NONE){
    var insertDiv = document.getElementById('basicInfoForSelected');
    while (insertDiv.firstChild) {
        insertDiv.removeChild(insertDiv.firstChild);
    }
    $.ajax({
                        async:false,
                        type: "GET",
                        url: url,
                        dataType: "html",
                        success: function (data) {
                               listOfCompanyAjax = $(data).find(".g_tab:nth-of-type(3)");
                               $('#selectPrefCompany :selected').each(function(){
                                           var p = document.createElement('p');
                                           p.appendChild(document.createTextNode('Nazwa spółki: '+$(this).text()));
                                           p.appendChild(document.createElement('br'));
                                           p.appendChild(document.createTextNode('Obecna wartość: '+$(data).find(".g_tab:nth-of-type(3) tr:nth-of-type("+$(this).val()+") td:nth-of-type(3) b").text()));
                                           p.appendChild(document.createElement('br'));
                                           p.appendChild(document.createTextNode('Poprzednia wartość: '+$(data).find(".g_tab:nth-of-type(3) tr:nth-of-type("+$(this).val()+") td:nth-of-type(4)").text()));
                                           p.appendChild(document.createElement('br'));
                                           p.appendChild(document.createTextNode('Zmiana procentowa: '+$(data).find(".g_tab:nth-of-type(3) tr:nth-of-type("+$(this).val()+") td:nth-of-type(5)").text()));
                                           p.appendChild(document.createElement('br'));
                                           p.appendChild(document.createTextNode('Obrót [PLN]: '+$(data).find(".g_tab:nth-of-type(3) tr:nth-of-type("+$(this).val()+") td:nth-of-type(7)").text()));
                                           p.appendChild(document.createElement('br'));
                                           insertDiv.appendChild(p);
                                       });
                      }
                      }).responseText;

    }
    else{

    }
}
//function getAllIndeces(){
//    var allCompanyInfoStorage = new Array();
//    for(var i=3;i<=42;i++){
//        // new object every time, Calling push will not copy your object, because JavaScript Objects are passed by reference: you're pushing the same Object as every array entry.
//        var company ={companyName: "", measureTime: "", curIndex: "", prevIndex: "", percentChange: "", pointChange: "", curAssets: ""};
//            company.companyName=  $(htmlOfPage).find("tr:nth-of-type("+i+") td:nth-of-type(1) b").text()
//            company.measureTime=  $(htmlOfPage).find("tr:nth-of-type("+i+") td:nth-of-type(2)").text()
//            company.curIndex=     $(htmlOfPage).find("tr:nth-of-type("+i+") td:nth-of-type(3) b").text()
//            company.prevIndex=    $(htmlOfPage).find("tr:nth-of-type("+i+") td:nth-of-type(4)").text()
//            company.percentChange=$(htmlOfPage).find("tr:nth-of-type("+i+") td:nth-of-type(5)").text()
//            company.pointChange=  $(htmlOfPage).find("tr:nth-of-type("+i+") td:nth-of-type(6)").text()
//            company.curAssets=    $(htmlOfPage).find("tr:nth-of-type("+i+") td:nth-of-type(7)").text()
//            allCompanyInfoStorage.push(company);
//    }
//    window.localStorage.setItem("allCompanyInfoStorage", JSON.stringify(allCompanyInfoStorage));
//}
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

function clearAllSelectedCompany(){
    $("#selectPrefCompany option").prop("selected", false);
    if ($("#selectPrefCompany option:selected").length) {
        alert("FAILED: did not unselect all #multiselect options");
    }
}

function exitApp(){
    navigator.app.exitApp();
}