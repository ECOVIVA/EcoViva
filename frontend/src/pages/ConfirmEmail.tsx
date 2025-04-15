import routes from "../services/API/routes";
import api from "../services/API/axios";
import { useEffect, useState } from "react";
import { Navigate, useParams } from "react-router-dom";
import { AxiosError } from "axios";

type RouteParams = {
    uidb64: string;
    token: string;
  };

const ConfirmEmail = () => {
    const [message, setMessage] = useState<string>('')
    const {uidb64, token} = useParams<RouteParams>()

    //@ts-ignore
    if (!uidb64 | !token){
        <Navigate to={'/'}/>
    }

    useEffect(() => {
        const confirmEmailApi = async() => {
            try{
                {/*@ts-ignore*/}
                const response = await api.get(routes.auth.confirm_email(uidb64, token))

                if (response.status === 200){
                    setMessage(response.data.message)
                }
            }
            catch(e){
                //@ts-ignore
                setMessage(String(e.response.data.detail))
            }
        }

        confirmEmailApi()
    })

    return(
        <div>
            <h1>
                {message}
            </h1>
        </div>
    )
}

export default ConfirmEmail;