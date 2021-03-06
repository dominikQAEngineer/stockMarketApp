var options = { frequency: 300 };  // Update every 0.3 seconds
var networkState = null;
var companyListArray = new Array();
var $companyList = {};
var multiSelectOptionString = '';
var url = "http://mybank.pl/gielda/indeks-mwig40.html";
//Function responsible for refresh current stock index after movement of device (not working on browser
function refreshMovement(acceleration) {
    var deviceManufacturer  = device.manufacturer;
    networkState = navigator.connection.type;
    if(acceleration.z<0 && deviceManufacturer!="unknown" && networkState != Connection.NONE){
        refreshAllData();
        setRefreshTime();
        alert('Odświeżono dane z dostępem do internetu, wszystko aktualne');
    }
    else if(acceleration.z<0 && deviceManufacturer!="unknown" && networkState === Connection.NONE){
        refreshAllData();
        setRefreshTime();
        alert('Odświeżono dane bez dostępu do internetu, dane są załadowane ze zmiennych lokalnych');
    }
}
function setRefreshTime() {
    var currentdate = new Date();
    var curHours = currentdate.getHours();
    var curMinutes = currentdate.getMinutes();
    var curSeconds = currentdate.getSeconds();
    if(curHours<10)
    curHours="0"+curHours;
    if(curMinutes<10)
    curMinutes="0"+curMinutes;
    if(curSeconds<10)
    curSeconds="0"+curSeconds;

    lastRefreshTime = curHours + ":" + curMinutes + ":" + curSeconds;
        document.querySelector("#lastRefreshSelectedCompany").innerHTML = lastRefreshTime;
        document.querySelector("#lastRefreshTimeWig40").innerHTML = lastRefreshTime;
        document.querySelector("#lastRefreshAllCompany").innerHTML = lastRefreshTime;
}
function refreshAll(){
    networkState = navigator.connection.type;
    refreshAllData();
    setRefreshTime();
    if(networkState != Connection.NONE){
        alert('Odświeżono dane z dostępem do internetu, wszystko aktualne');
    }
    else{
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
    networkState = navigator.connection.type;
    var watchID = navigator.accelerometer.watchAcceleration(refreshMovement, onError, options);
    loadCompanyListOnStart();
    if(networkState === Connection.NONE)
        alert('Dane zostały załadowane bez połączenia internetowego, ze zmiennych lokalnych - mogą być nieaktualne');

    setRefreshTime();
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
    window.localStorage.setItem("prefCompanySelected", JSON.stringify(prefCompanySelected));
    alert('Zapisano wybrane spółki');
}
function getWig40InfoFromPage(){
    $.ajax({
                async:false,
                type: "GET",
                url: url,
                dataType: "html",
                success: function (data) {
                        window.localStorage.setItem("wig40TimeLocal", $(data).find('.g_tab:nth-child(1) tr:nth-child(2) td b').text());
                        window.localStorage.setItem("wig40IndexLocal", $(data).find('.g_tab:nth-child(1) tr:nth-child(3) td b:nth-child(1)').text());
                        window.localStorage.setItem("wig40ColourLocal", $(data).find('.g_tab:nth-child(1) tr:nth-child(3) td:nth-child(2)').attr('class'));
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
    document.querySelector("#lastTimeFromPageWig40").innerHTML =  window.localStorage.getItem("wig40TimeLocal");
    if(window.localStorage.getItem("wig40ColourLocal")==='ta1 ziel')
       document.querySelector(".stockInformation a#wig40StockIndex").style.color = "green";
    else
       document.querySelector(".stockInformation a#wig40StockIndex").style.color = "red";
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

        $('#companyListSelect2').selectmenu();
        $('#companyListSelect2').selectmenu('refresh');
        $('#companyListSelect2').selectmenu('refresh', true);
}
function loadCompanyListOnStart(){
    networkState = navigator.connection.type;
    if(networkState != Connection.NONE){
        getWig40InfoFromPage();
        showWig40OnHtml();
        getCompanyListFromPage();
        showListOfCompanyOnPage();
        getDataForSelectedCompany();
    }
    else{
        showWig40OnHtml();
        showListOfCompanyOnPage();
    }
}
function refreshAllData(){
    networkState = navigator.connection.type;
    if(networkState != Connection.NONE){
        getWig40InfoFromPage();
        showWig40OnHtml();
        getDataForSelectedCompany();
        getSelectedCompanyInformation();
    }
    else{
        showWig40OnHtml();
    }
}
function getDataForSelectedCompany(){
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
                                           var aNazwa = document.createElement('a');
                                           var aObecnaWartosc = document.createElement('a');
                                           var aPoprzedniaWartosc = document.createElement('a');
                                           var aZmianaProcentowa = document.createElement('a');
                                           var aObrot = document.createElement('a');
                                           var aCzas = document.createElement('a');
                                           p.appendChild(document.createTextNode('Nazwa spółki: '));
                                           aNazwa.appendChild(document.createTextNode($(this).text()));
                                           p.appendChild(aNazwa);
                                           p.appendChild(document.createElement('br'));
                                           p.appendChild(document.createTextNode('Obecna wartość: '));
                                           aObecnaWartosc.appendChild(document.createTextNode($(data).find(".g_tab:nth-of-type(3) tr:nth-of-type("+$(this).val()+") td:nth-of-type(3) b").text()));
                                           if($(data).find(".g_tab:nth-of-type(3) tr:nth-of-type("+$(this).val()+") td:nth-of-type(3)").attr('class')==='ta1 ziel')
                                              aObecnaWartosc.style.color = "green";
                                           else
                                              aObecnaWartosc.style.color = "red";
                                           p.appendChild(aObecnaWartosc);
                                           p.appendChild(document.createElement('br'));
                                           p.appendChild(document.createTextNode('Poprzednia wartość: '));
                                           aPoprzedniaWartosc.appendChild(document.createTextNode($(data).find(".g_tab:nth-of-type(3) tr:nth-of-type("+$(this).val()+") td:nth-of-type(4)").text()));
                                           p.appendChild(aPoprzedniaWartosc);
                                           p.appendChild(document.createElement('br'));
                                           p.appendChild(document.createTextNode('Zmiana procentowa: '));
                                           aZmianaProcentowa.appendChild(document.createTextNode($(data).find(".g_tab:nth-of-type(3) tr:nth-of-type("+$(this).val()+") td:nth-of-type(5)").text()));
                                           p.appendChild(aZmianaProcentowa);
                                           p.appendChild(document.createElement('br'));
                                           p.appendChild(document.createTextNode('Obrót [PLN]: '));
                                           aObrot.appendChild(document.createTextNode($(data).find(".g_tab:nth-of-type(3) tr:nth-of-type("+$(this).val()+") td:nth-of-type(7)").text()));
                                           p.appendChild(aObrot);
                                           p.appendChild(document.createElement('br'));
                                           p.appendChild(document.createTextNode('Czas: '));
                                           aCzas.appendChild(document.createTextNode($(data).find(".g_tab:nth-of-type(3) tr:nth-of-type("+$(this).val()+") td:nth-of-type(2)").text()));
                                           p.appendChild(aCzas);
                                           p.appendChild(document.createElement('br'));
                                           insertDiv.appendChild(p);
                                       });
                      }
                      }).responseText;
}
function getDataForSelectedCompanyButton(){
networkState = navigator.connection.type;
    if($('#selectPrefCompany :selected').length && networkState != Connection.NONE){
        getDataForSelectedCompany();
    }
    else if($('#selectPrefCompany :selected').length && networkState === Connection.NONE){
        alert('Brak połączenia internetowego, dane nie mogą zostać pobrane.');
    }
    else{
        alert('Wybierz firmy, dla których chcesz pobrać dane');
    }

}
function getSelectedCompanyInformation(){
    networkState = navigator.connection.type;
    if( $("#companyListSelect2 option:selected").val()!=-1 && networkState != Connection.NONE){
    $.ajax({
                        async:false,
                        type: "GET",
                        url: url,
                        dataType: "html",
                        success: function (data) {
                          srcOfSelectedCompany = $(data).find(".g_tab tr:nth-of-type("+$("#companyListSelect2 option:selected").val()+") td:nth-of-type(1) a").attr('href');
                      }
                      }).responseText;
    $.ajax({
                        async:false,
                        type: "GET",
                        url: srcOfSelectedCompany,
                        dataType: "html",
                        success: function (data) {
                        if($(data).find('.fl .g_tab:nth-child(1) tr:nth-child(3) td:nth-child(2)').attr('class')==='ta1 ziel')
                            document.querySelector(".selectedCompanyIndexInfo2 a#currentIndexValue2").style.color = "green";
                        else
                            document.querySelector(".selectedCompanyIndexInfo2 a#currentIndexValue2").style.color = "red";

                               document.querySelector("#lastTimeFromPageAllCompany").innerHTML = $(data).find('.fl .g_tab:nth-child(1) tr:nth-child(2) td b').text();
                               document.querySelector(".selectedCompanyIndexInfo2 a#currentIndexValue2").innerHTML = $(data).find('.fl .g_tab:nth-child(1) tr:nth-child(3) td b:nth-child(1)').text();
                               document.querySelector(".selectedCompanyIndexInfo2 a#percentChangeForCompany").innerHTML = $(data).find('.fl .g_tab:nth-child(1) tr:nth-child(4) td span').text();
                               document.querySelector(".selectedCompanyIndexInfo2 a#pointChangeForCompany").innerHTML = $(data).find('.fl .g_tab:nth-child(1) tr:nth-child(5) td span').text();
                               document.querySelector(".selectedCompanyIndexInfo2 a#prevClosureForCompany").innerHTML = $(data).find('.fl .g_tab:nth-child(1) tr:nth-child(6) td:nth-child(2)').text();
                               document.querySelector(".selectedCompanyIndexInfo2 a#todayOpeninForCompany").innerHTML = $(data).find('.fl .g_tab:nth-child(1) tr:nth-child(7) td:nth-child(2)').text();
                               document.querySelector(".selectedCompanyIndexInfo2 a#dailyMinForCompany").innerHTML = $(data).find('.fl .g_tab:nth-child(1) tr:nth-child(8) td:nth-child(2)').text();
                               document.querySelector(".selectedCompanyIndexInfo2 a#dailyMaxForCompany").innerHTML = $(data).find('.fl .g_tab:nth-child(1) tr:nth-child(9) td:nth-child(2)').text();
                               document.querySelector(".selectedCompanyIndexInfo2 a#curAssetsForCompany").innerHTML = $(data).find('.fl .g_tab:nth-child(1) tr:nth-child(10) td:nth-child(2)').text();
                               document.querySelector(".selectedCompanyIndexInfo2 img#wykresWybranejSpolki").src =
                                $(data).find('#wykres_indeksu').attr('src');

                      }
                      }).responseText;
    }
    else if(networkState === Connection.NONE){
        alert('Aby pobrać dane dla wybranej spółki musisz być połączony z internetem');
    }
    else if($("#companyListSelect2 option:selected").val()===-1){
        alert('Wybierz spółkę, dla której mają być pobrane dane');
    }
}

function clearAllSelectedCompany(){
    $("#selectPrefCompany option").prop("selected", false);
    if ($("#selectPrefCompany option:selected").length) {
        alert("FAILED: did not unselect all #multiselect options");
    }
    $('#selectPrefCompany').selectmenu('refresh');
    $('#selectPrefCompany').selectmenu('refresh', true);
    alert('Wyczyszczono preferowane spółki');
}

function exitApp(){
    navigator.app.exitApp();
}