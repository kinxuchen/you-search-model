chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'changeModel' && request.payload.value && request.payload.name) {
    if (request.payload.storageLocation === 'cookie') {
      console.log('修改 cookie', request.payload)
      chrome.cookies.get({
        name: request.payload.name,
        url: request.payload.url
      }).then(async oldModel => {
        if (oldModel && oldModel.value !== request.payload.value) {
          await chrome.cookies.remove({
            name: request.payload.name,
            url: request.payload.url
          })
          await chrome.cookies.set({
            url: request.payload.url,
            name: request.payload.name,
            value: request.payload.value,
            domain: request.payload.domain,
            expirationDate: 9999999999,
            secure: true
          })
          sendResponse({
            action: 'changeModel',
            payload: true,
          })
        } else {
          sendResponse({
            action: 'changeModel',
            payload: false,
          })
        }
      })
    }
    if (request.payload.storageLocation === 'localstorage') {
      console.log('修改 localstorage', request.payload)
      chrome.storage.local.set({
        [request.payload.name]: request.payload.value
      })
      sendResponse({
        action: 'changeModel',
        payload: true,
      })
    }
  }
  return true;
});
