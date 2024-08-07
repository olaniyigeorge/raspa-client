import { ActionFunctionArgs, json, LoaderFunctionArgs, redirect } from "@remix-run/node"
import { Form, isRouteErrorResponse, Link, useActionData, useLoaderData, useParams, useRouteError } from "@remix-run/react"
import { createBox } from "framer-motion";
import { useCurrentUserContext } from "~/api/auth";
import { fetchData, fetcherProps, getUrl } from "~/api/util";
import { akure_property } from "~/data";
import { currentToken } from "~/session.server";
import { DomWrapper } from "~/ui/dom-wrapper";
// import { loader } from "./property.$propID";



export default function PaymentPlanRent() {
    const params = useParams()
    const loaderData = useLoaderData<typeof loader>();
    const actionData = useActionData<typeof action>();

    const ctx = useCurrentUserContext();

    console.log(loaderData)

    if (ctx == null) {
      redirect('/explore')
    }

    let disablePay: boolean = loaderData.payment_id == null

    
    return <>


        <div className="w-full h-screen bg-purple-50 flex justify-center items-center ">
    

                <div className="w-full flex flex-col gap-2 py-2 border">
                    <Form  method="post" className="flex flex-col gap-2 ">
                        <input type='text' hidden name="ctx_id" defaultValue={`${ctx?.id}`} className="p-2 border" placeholder="Type in here" />
                        <input type='text' hidden name="ctx_email" defaultValue={`${ctx?.email}`} className="p-2 border" placeholder="Type in here" />
                        <input type='text' hidden name="price" defaultValue="09" className="p-2" placeholder="Type in here" />
                        <input type='text' hidden name="payment_id" defaultValue={`${loaderData.payment_id}`} className="p-2" placeholder="Type in here" /> 
                        <button type='submit' disabled={disablePay} className={`rounded-md font-medium py-1 px-2 ${!disablePay ? 'bg-purple-500 text-white' : 'bg-purple-200 text-gray-900'} text-gray-800 border`}> 
                        
                          Pay
                        
                        </button> 
                    </Form>  

                    <Link to="" className="rounded-md hidden py-1 px-2 bg-gray-200 text-gray-800  justify-center"> Pay in installments </Link>                  
                </div>

        </div>
    
    </>

}




export async function loader({request, params}: LoaderFunctionArgs) {
    console.log("Property rental loader")
    const token = await currentToken(request)
    const listing_id = params.propID

    const context_args: fetcherProps = {
        endpoint: getUrl('context'), 
        method: 'GET',
        token:  token
    }

    const ctx = await fetchData(context_args);

    const id = `${ctx.body.id}` 

    if (ctx.body.id==null) {
      return redirect(`/property/${listing_id}`)
    }
      
    
    console.log("endp: ", getUrl('get-create-rentals', `${ctx.body.id}/${listing_id}`))

    const create_rental_args: fetcherProps = {
        endpoint: getUrl('get-create-rentals', `${ctx.body.id}/${listing_id}`), 
        method: 'GET',  
    }
    const rental = await fetchData(create_rental_args);

    let payment_id: string | null
    if (rental.status == 200) {
      console.log("This payment: ", rental.body.payment)
      payment_id = rental.body.payment
    }
    else {
      console.log("Status: ", rental.status)
      console.log("Rental body: ", rental.body)
      payment_id = null
    }
    

    console.log("Rental; ", rental)


    
    
    return json({listing_id, payment_id})
}



export async function action({request,}: ActionFunctionArgs) {
    const currUrl = new URL(request.url)
    const form = await request.formData()
    
    const ctx_id = (form.get("ctx_id") || "").toString();
    const ctx_email = (form.get("ctx_email") || "").toString();
    const price = (form.get("price") || "").toString();
    const payment_id = (form.get("payment_id") || "").toString();
    
    console.log("ctx_id:", ctx_id)
    console.log("ctx_email:", ctx_email)
    console.log("Price: ", price)
    console.log("Payment: ", payment_id)

    const redirect_url = `/confirm-payment/${payment_id}`
    console.log("Re: ", redirect_url)
    const pay = {
                  tx_ref: payment_id,
                  amount: price,
                  currency: "NGN",
                  redirect_url: `/confirm-payment/${payment_id}`,
                  meta: {
                      consumer_id: ctx_id,
                      consumer_mac: ctx_email,
                  },
                  customer: {
                      email: ctx_email,
                      phonenumber: "080****4528",
                      name: ctx_email,
                  },
                  customizations: {
                      title: "Rent A Space, Akure",
                      logo: '/images/rasp-logo-purple.png'
                  }
              }
    console.log("Making payemnt with........ ", pay)

    // {
    //   "status": "success",
    //   "message": "Hosted Link",
    //   "data": {
    //     "link": "https://api.flutterwave.com/v3/hosted/pay/f524c1196ffda5556341"
    //   }
    // }

    // CHECK RESPONSE STATUS
    // IF STATUS IS SUCCESS
    // REDIRECT TO DATA.LINK ON A NEW PAGE
    //

    
    
    return redirect(pay.redirect_url)
  }



export function ErrorBoundary() {
    const error = useRouteError()
  
    console.log("Error: ", error)
    // when true, this is what used to go to `CatchBoundary`
    if (isRouteErrorResponse(error)) {
      const client: boolean = error.status >= 400 && error.status < 500
      const props = client ? { status: error.status } : {}

      return(
        <DomWrapper>
          <div className="flex h-full w-full text-gray-950 items-center justify-center">
            Oops!! Something happened on RentProperty.
          </div>
        </DomWrapper>
      )
    }
  
    return (
        <div className="flex h-full w-full text-red-600 items-center justify-center">
          Oops!! Something happened.
        </div>
    )
}