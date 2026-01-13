import { ENV } from "@/utils/env"

function buildPublicUrl(): string {
  if (ENV.NODE_ENV === "production") {
    return "https://www.doodles.sh"
  }

  if (ENV.TUNNEL_SUBDOMAIN) {
    return `https://doodles-${ENV.TUNNEL_SUBDOMAIN}.851.dev`
  }

  return `http://localhost:${ENV.PORT}`
}

const URLS = {
  prod: "https://www.doodles.sh",
  public: buildPublicUrl,
  home: "/",
  doodle: ({ params }: { params: { id: string } }) => `/doodles/${params.id}`,
  purchaseSuccess: "/?purchase=success",
  purchaseCancel: "/?purchase=cancel",
  auth: {
    callback: "/auth/callback",
  },
  api: {
    checkout: "/api/checkout",
    doodles: "/api/doodles",
    doodleStatus: ({ params }: { params: { id: string } }) => `/api/doodles/${params.id}/status`,
    generate3d: ({ params }: { params: { id: string } }) => `/api/doodles/${params.id}/generate-3d`,
    userCredits: "/api/user-credits",
    webhooks: {
      lightbox: "/api/webhooks/lightbox",
      stripe: "/api/webhooks/stripe",
    },
  },
}

export { buildPublicUrl, URLS }
