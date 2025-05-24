import {toast as sonnerToast} from "sonner";

export const toast = ({style, message} : {style: string, message: string}) => {
    return sonnerToast.custom(() => (<Toasty style={style}>{message}</Toasty>), {duration: 4000})
}

const Toasty = ({style, children} : {style: string, children: React.ReactNode}) => {
    return (
        <div className={`rounded-lg px-5 py-2 ${style}`}>
                <span className="">{children}</span>
        </div>
    );
};