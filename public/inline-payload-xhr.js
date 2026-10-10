(() => {
  const NativeXHR = window.XMLHttpRequest;
  const responseTypeDescriptor = Object.getOwnPropertyDescriptor(NativeXHR.prototype, 'responseType');
  const properties = ['readyState', 'status', 'statusText', 'response', 'responseText', 'responseURL'];

  function InlinePayloadXHR() {
    const xhr = new NativeXHR();
    const nativeOpen = xhr.open.bind(xhr);
    const nativeSend = xhr.send.bind(xhr);
    let inlineUrl = '';
    let inlineReadyState = 0;
    let inlineResponseType = '';
    let inlineResponse = null;
    let inlineResponseText = '';
    let inlineStatus = 0;

    Object.defineProperty(xhr, 'responseType', {
      configurable: true,
      get: () => inlineUrl ? inlineResponseType : responseTypeDescriptor.get.call(xhr),
      set: (value) => {
        inlineResponseType = value;
        if (!inlineUrl) responseTypeDescriptor.set.call(xhr, value);
      },
    });

    for (const property of properties) {
      let prototype = NativeXHR.prototype;
      while (prototype && !Object.getOwnPropertyDescriptor(prototype, property)) {
        prototype = Object.getPrototypeOf(prototype);
      }
      const descriptor = Object.getOwnPropertyDescriptor(prototype, property);
      Object.defineProperty(xhr, property, {
        configurable: true,
        get: () => {
          if (!inlineUrl) return descriptor.get.call(xhr);
          if (property === 'readyState') return inlineReadyState;
          if (property === 'status') return inlineStatus;
          if (property === 'statusText') return inlineStatus ? 'OK' : '';
          if (property === 'response') return inlineResponse;
          if (property === 'responseText') return inlineResponseText;
          return inlineUrl;
        },
      });
    }

    xhr.open = (method, url, ...options) => {
      inlineUrl = String(url).startsWith('eagler-inline-payload://') ? String(url) : '';
      if (!inlineUrl) return nativeOpen(method, url, ...options);
      inlineReadyState = 1;
      queueMicrotask(() => xhr.dispatchEvent(new Event('readystatechange')));
    };

    xhr.send = (body) => {
      if (!inlineUrl) return nativeSend(body);
      const url = inlineUrl;
      xhr.dispatchEvent(new Event('loadstart'));
      window.fetch(url).then((response) => response.arrayBuffer()).then((buffer) => {
        inlineStatus = 200;
        inlineReadyState = 4;
        if (inlineResponseType === 'arraybuffer') {
          inlineResponse = buffer;
        } else if (inlineResponseType === 'blob') {
          inlineResponse = new Blob([buffer], { type: 'application/octet-stream' });
        } else {
          inlineResponseText = new TextDecoder().decode(buffer);
          inlineResponse = inlineResponseType === 'json'
            ? JSON.parse(inlineResponseText)
            : inlineResponseText;
        }
        xhr.dispatchEvent(new Event('readystatechange'));
        xhr.dispatchEvent(new Event('load'));
        xhr.dispatchEvent(new Event('loadend'));
      }).catch((error) => {
        inlineReadyState = 4;
        xhr.dispatchEvent(new Event('readystatechange'));
        xhr.dispatchEvent(new Event('error'));
        xhr.dispatchEvent(new Event('loadend'));
        console.error(error);
      });
    };

    return xhr;
  }

  Object.setPrototypeOf(InlinePayloadXHR, NativeXHR);
  InlinePayloadXHR.prototype = NativeXHR.prototype;
  window.XMLHttpRequest = InlinePayloadXHR;
})();