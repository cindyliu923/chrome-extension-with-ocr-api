$(document).ready(function(){
  $("#select").change(function(){
    const language = $("#select").val();

    chrome.tabs.getSelected(null,function(tab) {
      const tablink = tab.url;
      const formData = new FormData();
      formData.append("url", tablink);
      formData.append("language", language);
      formData.append("apikey", "your-api-key");
      formData.append("isOverlayRequired", true);

      $.ajax({
        url: "https://api.ocr.space/parse/image",
        data: formData,
        dataType: 'json',
        cache: false,
        contentType: false,
        processData: false,
        type: 'POST',
        success: function (ocrParsedResult) {

          const parsedResults = ocrParsedResult["ParsedResults"];
          const errorMessage = ocrParsedResult["ErrorMessage"];

          if (parsedResults!= null) {
            $.each(parsedResults, function (index, value) {
              let exitCode = value["FileParseExitCode"];
              let parsedText = value["ParsedText"];
              let errorMessage = value["ParsedTextFileName"];
              let pageText = "";

              if (parsedText === "") {
                exitCode = -1;
              }

              switch (+exitCode) {
                case -1:
                  pageText = "Error: parsed text is blank"
                  $("#result").text(pageText);
                  break;
                case 1:
                  pageText = parsedText;
                  $("#result").text(pageText);
                  break;
                default:
                  pageText = "Error: " + errorMessage;
                  $("#result").text(pageText);
                  break;
              }
            });
          } else {
            $("#result").text("Error: " + errorMessage);
          }
        }
      });
    });
  });
});
