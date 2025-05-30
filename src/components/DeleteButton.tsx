// import { useNavigate } from "@tanstack/react-router";
export const DeleteButton = ({
    size,
    styles,
    event,
}: {
    size: number;
    styles: string;
    event: () => void;
}) => {
    // const navigate = useNavigate();

    return (
        <button className={styles} onClick={event}>
            <svg
                version="1.1"
                xmlns="http://www.w3.org/2000/svg"
                width={size}
                height={size}
                viewBox="493.5,266.5,110,110"
            >
                <g
                    id="document"
                    strokeWidth="0"
                    strokeLinecap="butt"
                    strokeLinejoin="miter"
                    strokeMiterlimit="10"
                    strokeDasharray=""
                    strokeDashoffset="0"
                    fontFamily="none"
                    fontWeight="none"
                    fontSize="none"
                    textAnchor="none"
                >
                    <rect
                        x="3140.45455"
                        y="1211.36364"
                        transform="scale(0.15714,0.22)"
                        id="Shape 1 1"
                        vectorEffect="non-scaling-stroke"
                    />
                </g>
                <g
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeDashoffset="0"
                >
                    <g id="stage">
                        <g id="layer1 1">
                            <path
                                d="M530.85942,356.50159v-51.62872h41.6997v51.52798z"
                                id="Path 1"
                            />
                            <path d="M552.28263,318.13648v33.5043" id="Path 1" />
                            <path d="M543.88493,318.13648v33.5043" id="Path 1" />
                            <path d="M559.53362,318.13648v33.5043" id="Path 1" />
                            <path
                                d="M530.85942,305.69258c-0.16321,-0.26721 -0.24787,-0.54095 -0.24787,-0.81971c0,-2.94415 9.44578,-5.33086 21.09772,-5.33086c11.65195,0 21.09772,2.38671 21.09772,5.33086c0,0.27874 -0.08467,0.5525 -0.24787,0.81971c-1.56054,2.555 -10.30109,4.51115 -20.84985,4.51115c-10.54876,0 -19.28931,-1.95616 -20.84985,-4.51115z"
                                id="Path 1"              
                            />
                            <path
                                d="M526.99843,299.96332l-0.62718,2.33336c-0.20632,-0.66738 0.08483,-1.417 0.62718,-2.33336z"
                                id="Path 1"
                            />
                            <path
                                d="M526.90801,299.89208c1.69662,-2.86672 6.73622,-6.66812 13.1139,-9.62877c6.7301,-3.12425 12.92278,-4.3711 15.64124,-3.36979l1.92001,0.76878l2.09371,1.26963l1.3539,0.82101c1.3487,0.10911 2.21953,0.51753 2.47137,1.25174c0.0889,0.25918 0.09747,0.54969 0.03094,0.86743c-0.63617,3.03834 -8.1395,8.56871 -17.94801,13.04798c-9.8085,4.47929 -18.55957,6.37187 -20.82544,4.65881c-0.23697,-0.17916 -0.403,-0.39773 -0.49191,-0.65692c-0.25631,-0.74726 0.15506,-1.75476 1.10906,-2.92539l0.37047,-1.37834z"
                                id="Path 1"
                            />
                            <path d="" id="Path 1" fill="transparent" />
                            <path
                                d="M534.05344,289.75448l3.4456,-2.48803l4.18002,-0.76803l0.73442,1.72l-3.4456,2.48803l-4.18002,0.76803z"
                                id="Path 1"
                            />
                        </g>
                    </g>
                </g>
            </svg>
        </button>
    );
};
