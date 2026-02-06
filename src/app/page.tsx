import { Suspense } from "react"

import { DoodleGenerator } from "@/app/_components/doodle-generator"

const PLACEHOLDER_EXAMPLES = [
  "cat playing guitar",
  "dog riding skateboard",
  "robot cooking pancakes",
  "penguin reading a book",
  "astronaut on the moon",
  "dragon eating pizza",
  "owl wearing glasses",
  "frog on a lily pad",
  "bear drinking coffee",
  "unicorn jumping rope",
  "shark surfing a wave",
  "elephant painting",
  "monkey doing yoga",
  "fox with a balloon",
  "bunny on a bicycle",
  "pirate with a parrot",
  "wizard casting a spell",
  "dinosaur playing tennis",
  "sloth hanging from tree",
  "koala eating ice cream",
  "octopus juggling",
  "giraffe in a hot tub",
  "hedgehog with headphones",
  "llama wearing a scarf",
  "raccoon stealing cookies",
  "hippo doing ballet",
  "panda on a swing",
  "snail racing a turtle",
  "mouse flying a kite",
  "walrus playing drums",
  "crab with sunglasses",
  "squirrel with an acorn",
  "seal balancing a ball",
  "flamingo on rollerskates",
  "whale blowing bubbles",
  "tiger in a hammock",
  "beaver building a dam",
  "parrot on a pirate ship",
  "deer with fairy wings",
  "otter holding hands",
]

function getRandomPlaceholder() {
  const randomIndex = Math.floor(Math.random() * PLACEHOLDER_EXAMPLES.length)
  return PLACEHOLDER_EXAMPLES[randomIndex] ?? "cat playing guitar"
}

function HomePage() {
  return (
    <Suspense fallback={null}>
      <DoodleGenerator placeholderExample={getRandomPlaceholder()} />
    </Suspense>
  )
}

export const runtime = "edge"

export { HomePage as default }
