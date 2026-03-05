import type { NextConfig } from 'next';

// ここに作成したリポジトリ名を設定してください
const repoName = 'sho800-3d-demo';

const nextConfig: NextConfig = {
    // 静的エクスポートを有効化
    output: 'export',

    // プロジェクトサイトのURL（/リポジトリ名）に対応させる
    basePath: `/${repoName}`,
    assetPrefix: `/${repoName}`,

    images: {
        // 静的エクスポートではNext.jsの画像最適化APIが使えないため無効化
        unoptimized: true,
    },
};

export default nextConfig;