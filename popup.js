document.addEventListener('DOMContentLoaded', () => {

  const select = document.querySelector('#select');
  const result = document.querySelector('#result');

  // 當使用者選取語言時
  select.addEventListener('change', (event) => {
    const language = select.value;

    // 抓取當前網址
    chrome.tabs.getSelected((tab) => {
      const tablink = tab.url;

      // 準備需要傳遞給 OCR API 的參數
      const formData = new FormData();
      formData.append('url', tablink);
      formData.append('language', language);
      formData.append('apikey', 'your-api-key');

      const url = 'https://api.ocr.space/parse/image';

      // 對 OCR API 發送請求
      fetch(url, {
        method: 'POST',
        body: formData

      // 用 json() 解讀回傳的資訊
      }).then(response => response.json())
        .then((jsonData) => {

          // 存取我們需要的資訊
          const parsedResults = jsonData['ParsedResults'];
          const errorMessage = jsonData['ErrorMessage'];

          // 如果回傳的結果不是空的
          if (parsedResults != null) {

            // 獲得每一個結果的詳細內容
            parsedResults.forEach((value) => {
              let exitCode = value['FileParseExitCode'];
              let parsedText = value['ParsedText'];
              let errorMessage = value['ErrorMessage'];

              // 如果分析回來的文字是空的，用 -1 表示
              if (parsedText === '') {
                exitCode = -1;
              }

              // 分析回來的情況 1 表示成功，其他情況顯示錯誤訊息
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

          // 其他錯誤情況
          } else {
            result.innerHTML = 'Error: ' + errorMessage;
          }

        // 如果打 API 有錯誤，則將錯誤印在 console 上
        }).catch((err) => {
          console.log('Error:', err);
      })
    });
  });
});
