/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        remotePatterns: [
            {
                hostname: 'scontent-sea1-1.xx.fbcdn.net',
                protocol: 'https',
                
            }
        ]
    }
}

module.exports = nextConfig