const nextConfig = {
    async rewrites() {
        return [
            {
                source: "/api/:path*", // Menangkap semua request yang diawali dengan /api/
                destination: "http://localhost:3001/:path*", // Meneruskan ke backend
            },
        ];
    },
};

export default nextConfig;
