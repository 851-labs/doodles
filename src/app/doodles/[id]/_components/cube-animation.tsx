"use client"

function CubeAnimation() {
  return (
    <div className="flex items-center justify-center opacity-50">
      <div
        className="relative h-10 w-10"
        style={{
          transformStyle: "preserve-3d",
          animation: "cube-rotate 8s linear infinite",
        }}
      >
        <div className="absolute h-10 w-10 border border-current" style={{ transform: "translateZ(20px)" }} />
        <div className="absolute h-10 w-10 border border-current" style={{ transform: "translateZ(-20px)" }} />
        <div
          className="absolute h-10 w-10 border border-current"
          style={{ transform: "rotateY(90deg) translateZ(20px)" }}
        />
        <div
          className="absolute h-10 w-10 border border-current"
          style={{ transform: "rotateY(90deg) translateZ(-20px)" }}
        />
        <div
          className="absolute h-10 w-10 border border-current"
          style={{ transform: "rotateX(90deg) translateZ(20px)" }}
        />
        <div
          className="absolute h-10 w-10 border border-current"
          style={{ transform: "rotateX(90deg) translateZ(-20px)" }}
        />
      </div>
    </div>
  )
}

export { CubeAnimation }
