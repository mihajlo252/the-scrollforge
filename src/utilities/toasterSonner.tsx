import {toast as sonnerToast} from "sonner";

export const toast = ({style, message} : {style: string, message: string}) => {
    return sonnerToast.custom(() => (<Toasty style={style}>{message}</Toasty>), {duration: 4000})
}

const Toasty = ({style, children} : {style: string, children: React.ReactNode}) => {
    return (
        <div className={`frame full ${style ?? ""}`} style={{ padding: "0.75rem 1.25rem" }}>
                <span className="text-content">{children}</span>
        </div>
    );
};