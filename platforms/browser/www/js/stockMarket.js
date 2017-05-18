function start(){
var url = "http://mybank.pl/gielda/indeks-wig20.html";
    $.ajax({
            type: "GET",
            url: url,
            dataType: "html",
            success: function (data) {
            $("#status").val(JSON.stringify(data));
            data=$(data).find('.g_tab:nth-child(1) tr:nth-child(3) td b:nth-child(1)').text()
              console.log(data)
              console.log(typeof data)
            }
            ,
            error: function(xhr, textStatus, errorThrown) {
                    $("#status").val("Unavailable: " + textStatus);
                }
          });
}