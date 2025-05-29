import { useNavigate } from "@tanstack/react-router";
export const TicketsButton = ({size, strokeWidth, styles} : { size: number, strokeWidth: number, styles: string}) => {
    const navigate = useNavigate();

    return (
        <div className={styles}>
            <svg
            onClick={() => navigate({ to: "/tickets" })}
            version="1.1"
            xmlns="http://www.w3.org/2000/svg"
            xmlnsXlink="http://www.w3.org/1999/xlink"
            viewBox="494,267,110,110"
            width={size}
            height={size}
            className={`btn h-max w-max cursor-pointer border-none bg-transparent hover:bg-transparent`}
        >
            <g id="document" fillOpacity="0" fill="#ffffff" fillRule="nonzero" stroke="#000000">
                <rect
                    x="3143.63636"
                    y="1213.63636"
                    transform="scale(0.15714,0.22)"
                    width="700"
                    height="500"
                    id="Shape 1 1"
                    className="fill-primary hover:fill-secondary"
                />
            </g>
            <g fillOpacity="0" fill="#000000" fillRule="nonzero" strokeWidth={strokeWidth}>
                <g id="stage">
                    <g id="layer1 1">
                        <path
                            d="M504.6475,296.34689l44.3525,-25.65311l44.3525,25.65311v51.30621l-44.3525,25.65311l-44.3525,-25.65311z"
                            id="Path 1"
                        />
                        <path
                            d="M553.88694,313.83787c0,-13.53977 -2.18796,-24.51593 -4.88694,-24.51593c-2.69898,0 -4.88694,10.97616 -4.88694,24.51593c0,13.53977 2.18796,24.51593 4.88694,24.51593c2.69898,0 4.88694,-10.97616 4.88694,-24.51593z"
                            id="Path 1"
                        />
                        <path
                            d="M553.02103,349.3798c0,-2.92615 -1.80028,-5.29827 -4.02103,-5.29827c-2.22075,0 -4.02103,2.37212 -4.02103,5.29827c0,2.92615 1.80028,5.29827 4.02103,5.29827c2.22075,0 4.02103,-2.37212 4.02103,-5.29827z"
                            id="Path 1"
                        />
                    </g>
                </g>
            </g>
        </svg>
        </div>
        
    );
};
