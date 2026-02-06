"use client"

const DOODLE_PATH = {
  d: "M10,75 Q30,20 60,50 T100,30 Q130,60 150,40 T180,70 Q160,100 130,80 T90,110 Q60,90 40,120 T20,100 Q50,70 80,90 T120,60 Q150,30 170,50 T190,80 Q170,120 140,100 T100,130 Q70,110 50,140 T30,110 Q60,80 90,100 T130,70 Q160,40 180,60 T190,30 Q160,10 130,30 T90,10 Q60,30 40,10 T20,40 Q50,70 80,50 T120,80 Q150,110 170,90 T190,120 Q160,140 130,120 T90,140 Q60,120 40,140",
  length: 2000,
  segmentLength: 75,
}

function SketchAnimation() {
  return (
    <svg
      className="absolute inset-0 h-full w-full opacity-40 blur-sm"
      viewBox="0 0 200 150"
      preserveAspectRatio="xMidYMid slice"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d={DOODLE_PATH.d}
        stroke="currentColor"
        strokeWidth="1"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="text-black dark:text-white"
        style={{
          strokeDasharray: `${DOODLE_PATH.segmentLength} ${DOODLE_PATH.length}`,
          animation: "sketch-draw 25s linear infinite",
        }}
      />
    </svg>
  )
}

export { SketchAnimation }
