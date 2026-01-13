import { createImgproxyUrl } from "@851-labs/utils/imgproxy"

function getDoodleOpenGraphImageUrl(src: string): string {
  return createImgproxyUrl({
    src,
    options: {
      extend: {
        extend: 1,
        gravity: { type: "ce" },
      },
      width: 1200,
      height: 570,
      padding: { top: 30, right: 0, bottom: 30, left: 0 },
      format: "jpg",
    },
  })
}

export { getDoodleOpenGraphImageUrl }
