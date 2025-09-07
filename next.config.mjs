/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    serverComponentsExternalPackages: ['mongoose'],
  },
  images: {
    domains: [
      'res.cloudinary.com', // Your existing Cloudinary domain
      'img.clerk.com', // Clerk user avatars
      'images.clerk.dev', // Clerk development images
    ],
  },
};

export default nextConfig;
