document.addEventListener('DOMContentLoaded', () => {

  const select = document.querySelector('#select');
  const result = document.querySelector('#result');

  select.addEventListener('change', (event) => {
    const language = select.value;

    chrome.tabs.getSelected((tab) => {
      const tablink = tab.url;
      const formData = new FormData();
      formData.append('url', tablink);
      formData.append('language', language);
      formData.append('apikey', 'your-api-key');

      const url = 'https://api.ocr.space/parse/image';
      fetch(url, {
        method: 'POST',
        body: formData
      }).then((response) => {
          return response.json();
        }).then((jsonData) => {
          const parsedResults = jsonData['ParsedResults'];
          const errorMessage = jsonData['ErrorMessage'];

          if (parsedResults != null) {
            parsedResults.forEach((value) => {
              let exitCode = value['FileParseExitCode'];
              let parsedText = value['ParsedText'];
              let errorMessage = value['ErrorMessage'];

              if (parsedText === '') {
                exitCode = -1;
              }

              switch (+exitCode) {
                case -1:
                  result.innerHTML = 'Error: parsed text is blank';
                  break;
                case 1:
                  result.innerHTML += parsedText;
                  break;
                default:
                  result.innerHTML = 'Error: ' + errorMessage;
                  break;
              }
            });
          } else {
            result.innerHTML = 'Error: ' + errorMessage;
          }

        }).catch((err) => {
          console.log('Error:', err);
      })
    });
  });
});
