export const ShieldSVG = ({styles, stylesOutline, stylesInline }: {styles?: string, stylesOutline?: string, stylesInline?: string }) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      version="1.1"
      viewBox="292.5 73.5 512 512"
      className={` ${styles ?? ""}`}
      style={{ width: "100%", height: "100%" }}
    >
      <g
        fill="none"
        fillRule="nonzero"
        strokeWidth="none"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeMiterlimit="10"
        fontFamily="none"
        fontWeight="none"
        fontSize="none"
      >
        <g id="stage">
          <g id="layer1-1">
            <path
              d="M337.6427,158.05276c0,0 96.33283,43.90897 210.8573,-69.74115c114.52446,113.65014 210.8573,69.74115 210.8573,69.74115c33.38465,305.34796 -204.81469,411.10344 -209.43109,413.40471c-0.09809,0.0489 -0.03944,0.06093 -0.20597,-0.03684c-6.04474,-3.5491 -245.4622,-108.01989 -212.07754,-413.36787z"
              id="Path-7824-1"
              strokeWidth="15"
              className={`${stylesOutline}`}
            />
            <path
              d="M362.26355,189.33849c0,0 85.08139,36.59048 186.22971,-58.11708c101.14832,94.70759 186.22971,58.11708 186.22971,58.11708c29.48541,254.4543 -180.89287,342.58305 -184.97008,344.50077c-0.08664,0.04076 -0.03484,0.05079 -0.18192,-0.0307c-5.33872,-2.95756 -216.79285,-90.01574 -187.30744,-344.47006z"
              id="Path-264-1"
              strokeWidth="5"
              className={`${stylesInline}`}
            />
          </g>
        </g>
      </g>
    </svg>
  );
};
