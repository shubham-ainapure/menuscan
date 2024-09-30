import { useState } from "react"
import { TailSpin } from "react-loader-spinner";

function Button({type,name,loading}){
    
    return (
        <>
        <button type={type}>{loading ? <TailSpin color="#73c988" height='20' width='20' wrapperClass='spinner'/> : null }{name}</button>
        </>
    )
}
export default Button