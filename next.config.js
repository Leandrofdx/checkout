/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    optimizePackageImports: ['lucide-react'],
  },
  // Configurações para reduzir problemas de hidratação
  reactStrictMode: false, // Desabilita strict mode para reduzir warnings
  swcMinify: true,
  // Configuração para desenvolvimento
  ...(process.env.NODE_ENV === 'development' && {
    // Reduz warnings de hidratação em desenvolvimento
    onDemandEntries: {
      maxInactiveAge: 25 * 1000,
      pagesBufferLength: 2,
    },
  }),
}

module.exports = nextConfig 