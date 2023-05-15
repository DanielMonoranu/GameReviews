import { toast } from "react-toastify";


const notify = (props: errorProps) =>
    props.type === "success" ? toast.success(props.message[0], {
        position: "top-center",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "colored",
    }) :
        toast.error(props.message[0], {
            position: "top-center",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "colored",
        });

export default notify;
interface errorProps {
    message: string[];
    type: string;
}