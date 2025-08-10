/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    // Enable modern image formats
    formats: ['image/avif', 'image/webp'],
    // Enable responsive images
    deviceSizes: [640, 750, 828, 1080, 1200, 1920],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    // Allow images from Supabase Storage
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'cixandvknhrzvbvhdwby.supabase.co',
        port: '',
        pathname: '/storage/v1/object/public/**',
      },
    ],
  },
  
  // Enable compression
  compress: true,
  
  // Modern compilation target for better performance
  compiler: {
    // Remove console.log in production
    removeConsole: process.env.NODE_ENV === 'production',
  },
  
  // Experimental features for performance
  experimental: {
    // Enable modern bundling optimizations
    optimizeCss: true,
  },
  
  // Bundle analyzer (only when needed)
  // webpack: (config, { buildId, dev, isServer, defaultLoaders, webpack }) => {
  //   if (process.env.ANALYZE) {
  //     const { BundleAnalyzerPlugin } = require('@next/bundle-analyzer');
  //     config.plugins.push(new BundleAnalyzerPlugin({
  //       analyzerMode: 'static',
  //       openAnalyzer: true,
  //     }));
  //   }
  //   return config;
  // },
};

export default nextConfig;
