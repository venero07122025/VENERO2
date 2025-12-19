import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          {
            key: "Content-Security-Policy",
            value: `
              default-src 'self';
              script-src 'self' 'unsafe-inline' https://js.stripe.com;
              style-src 'self' 'unsafe-inline';
              img-src 'self' data: https://*.stripe.com;
              frame-src https://js.stripe.com https://hooks.stripe.com;
              connect-src
                'self'
                https://api.stripe.com
                https://stripe.com
                https://hooks.stripe.com
                https://m.stripe.com
                https://m.stripe.network
                https://r.stripe.com
                https://*.supabase.co;
            `.replace(/\s{2,}/g, " ").trim(),
          },
        ],
      },
    ];
  },
};

module.exports = nextConfig;