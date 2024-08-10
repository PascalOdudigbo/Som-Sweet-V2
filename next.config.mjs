/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: true,
    // Defining acceptable image URL details for the project
    images: {
        remotePatterns: [
            {
                protocol: 'https',
                hostname: 'images.pexels.com',
                pathname: '**'
            },
            {
                protocol: 'https',
                hostname: 'images.unsplash.com',
                pathname: '**'
            },
            {
                protocol: 'https',
                hostname: 'res.cloudinary.com',
                pathname: '**'
            }
        ]
    },
};

export default nextConfig;
