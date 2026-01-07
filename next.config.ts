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
              
              script-src
                'self'
                'unsafe-inline'
                https://js.stripe.com
                https://m.stripe.network
                https://*.stripe.com
                https://geoissuer.cardinalcommerce.com
                https://*.cardinalcommerce.com
                https://*.online-metrix.net;

              frame-src
                https://js.stripe.com
                https://hooks.stripe.com
                https://geoissuer.cardinalcommerce.com
                https://*.cardinalcommerce.com;

              connect-src
                'self'
                https://api.stripe.com
                https://stripe.com
                https://hooks.stripe.com
                https://m.stripe.com
                https://m.stripe.network
                https://r.stripe.com
                https://*.stripe.com
                https://*.online-metrix.net
                https://*.cardinalcommerce.com
                https://*.supabase.co;

              img-src
                'self'
                data:
                https://*.stripe.com;

              style-src
                'self'
                'unsafe-inline';
            `.replace(/\s{2,}/g, " ").trim(),
          },
        ],
      },
    ];
  },
};

module.exports = nextConfig;