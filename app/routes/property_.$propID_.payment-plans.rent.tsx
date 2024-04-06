import { LoaderFunctionArgs } from "@remix-run/node"
import { useParams } from "@remix-run/react"

export default function PaymentPlanRent() {
    const params = useParams()

    return <>

        <div className="w-full h-screen flex justify-center items-center ">
            <div className="bg-green-500 w-1/2 h-[500px] rounded-lg ">
                <p className="p-10 text-white"> Rent {params.propID}</p>
            </div>
        </div>

    
    </>

}



export async function loader({request,}: LoaderFunctionArgs) {


    return {}
}