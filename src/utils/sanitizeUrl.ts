const removeProtocol = (url: string) => {
  return url.replace('https', '').replace('http', '');
};

const removeParams = (url: string) => {
  return url.split('?')[0];
};

export const sanitizeUrl = (url: string) => {
  const sanitizer = {
    url: '',
    setUrl(url: string) {
      this.url = url;
      return this;
    },
    removeParams() {
      this.url = removeParams(this.url);
      return this;
    },
    removeProtocol() {
      this.url = removeProtocol(this.url);
      return this;
    },
    getUrl() {
      return this.url;
    },
  };

  return sanitizer.setUrl(url).removeParams().removeProtocol().getUrl();
};
