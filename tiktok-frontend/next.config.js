const getBackendUrl = () => {
  const url = process.env.NEXT_PUBLIC_BACKEND_URL;
  if (!url) {
    console.warn('NEXT_PUBLIC_BACKEND_URL is not set. Falling back to http://localhost:8080');
    return 'http://localhost:8080';
  }
  if (!url.startsWith('http://') && !url.startsWith('https://')) {
    console.warn(`Invalid NEXT_PUBLIC_BACKEND_URL: ${url}. It must start with http:// or https://`);
    return 'http://localhost:8080';
  }
  return url;
};

module.exports = {
  async rewrites() {
    const backendUrl = getBackendUrl();
    console.log(`Using backend URL: ${backendUrl}`);
    return [
      {
        source: '/api/:path*',
        destination: `${backendUrl}/:path*`,
      },
    ];
  },
  output: 'export',
};