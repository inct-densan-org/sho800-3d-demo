import type { NextConfig } from 'next';

const basePath = process.env.NEXT_PUBLIC_BASE_PATH || '';

const nextConfig: NextConfig = {
    // 静的エクスポートを有効化
    output: 'export',

    // プロジェクトサイトのURL（/リポジトリ名）に対応させる
    basePath: basePath,
    assetPrefix: basePath,

    images: {
        // 静的エクスポートではNext.jsの画像最適化APIが使えないため無効化
        unoptimized: true,
    },
};

export default nextConfig;