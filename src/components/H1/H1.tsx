type H1Props = {
  children: React.ReactNode;
};

export default function H1({ children }: H1Props) {
  return (
    <div className="">
      <div className="flex w-full justify-center">
        <h1 className="fixed top-4 z-40 flex w-fit text-base font-black text-primary-content">
          {children}
        </h1>
      </div>
      <div className="absolute left-0 top-6 w-full opacity-[0.15] blur-2xl">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          version="1.1"
          viewBox="0 0 700 300"
        >
          <defs>
            <linearGradient
              gradientTransform="rotate(-253, 0.5, 0.5)"
              x1="50%"
              y1="0%"
              x2="50%"
              y2="100%"
              id="gggrain-gradient2"
            >
              <stop
                stopColor="hsl(194, 83%, 49%)"
                stopOpacity="1"
                offset="-0%"
              ></stop>
              <stop
                stopColor="rgba(255,255,255,0)"
                stopOpacity="0"
                offset="100%"
              ></stop>
            </linearGradient>
            <linearGradient
              gradientTransform="rotate(253, 0.5, 0.5)"
              x1="50%"
              y1="0%"
              x2="50%"
              y2="100%"
              id="gggrain-gradient3"
            >
              <stop stopColor="hsl(227, 100%, 50%)" stopOpacity="1"></stop>
              <stop
                stopColor="rgba(255,255,255,0)"
                stopOpacity="0"
                offset="100%"
              ></stop>
            </linearGradient>
            <filter
              id="gggrain-filter"
              x="-20%"
              y="-20%"
              width="140%"
              height="140%"
              filterUnits="objectBoundingBox"
              primitiveUnits="userSpaceOnUse"
              colorInterpolationFilters="sRGB"
            >
              <feTurbulence
                type="fractalNoise"
                baseFrequency="0.85"
                numOctaves="2"
                seed="2"
                stitchTiles="stitch"
                x="0%"
                y="0%"
                width="100%"
                height="100%"
                result="turbulence"
              ></feTurbulence>
              <feColorMatrix
                type="saturate"
                values="0"
                x="0%"
                y="0%"
                width="100%"
                height="100%"
                in="turbulence"
                result="colormatrix"
              ></feColorMatrix>
              <feComponentTransfer
                x="0%"
                y="0%"
                width="100%"
                height="100%"
                in="colormatrix"
                result="componentTransfer"
              >
                <feFuncR type="linear" slope="3"></feFuncR>
                <feFuncG type="linear" slope="3"></feFuncG>
                <feFuncB type="linear" slope="3"></feFuncB>
              </feComponentTransfer>
              <feColorMatrix
                x="0%"
                y="0%"
                width="100%"
                height="100%"
                in="componentTransfer"
                result="colormatrix2"
                type="matrix"
                values="1 0 0 0 0
          0 1 0 0 0
          0 0 1 0 0
          0 0 0 21 -13"
              ></feColorMatrix>
            </filter>
          </defs>
          <g>
            <rect width="100%" height="100%" fill="hsl(0, 100%, 60%)"></rect>
            <rect
              width="100%"
              height="100%"
              fill="url(#gggrain-gradient3)"
            ></rect>
            <rect
              width="100%"
              height="100%"
              fill="url(#gggrain-gradient2)"
            ></rect>
            <rect
              width="100%"
              height="100%"
              fill="transparent"
              filter="url(#gggrain-filter)"
              opacity="0.36"
              style={{
                mixBlendMode: "soft-light",
              }}
            ></rect>
          </g>
        </svg>
      </div>
    </div>
  );
}
