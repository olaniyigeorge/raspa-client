import { BookmarkIcon, InboxIcon, PaperAirplaneIcon, ServerIcon } from "@heroicons/react/24/outline";
import { json, LoaderFunctionArgs, redirect } from "@remix-run/node"
import { isRouteErrorResponse, Link, useLoaderData, useParams, useRouteError } from "@remix-run/react"
import { Component, useEffect, useState } from "react";
import { PropertyListing } from "~/api/interfaces";
import { fetchData, fetcherProps, getUrl } from "~/api/util";
import AmenityCard from "~/components/listings-ui/amenity-card";
import FeatureMiniCard, { SizeMiniCard } from "~/components/listings-ui/feature-mini";

import { DomWrapper } from "~/ui/dom-wrapper";


export default function ThisProperty() {
    const data = useLoaderData<typeof loader>();
    const [selectedLandMark, setSelectedLandMark] = useState('')
    const [id, setID] = useState('')
    const [listing, setListing] = useState<PropertyListing | null | undefined>()
    const [showFullDescription, setShowFullDescription] = useState<boolean>(false)
    
    useEffect(() => {
        setListing(data?.property)
        console.log("Listing: ", listing)
        
    }, []);
    const description = listing?.property?.description || "";
    const isLongDescription = description?.length > 120;
    console.log(id)

    return <div className="w-full gap-3 py-2 flex flex-col-reverse md:flex-row transition-all ease-in-out duration-300  container mx-auto justify-between ">
        <div className="w-full md:w-3/5  space-y-4 rounded-md">    
            <div className="w-full flex flex-col justify-between items-start gap-2 rounded-md h-[400px]">
                <div className="w-full border rounded-md h-4/5">
                    {
                        listing?.property?.propertyImages[0] ? (
                            <img src={`${listing?.property?.propertyImages[0].image}`} alt={`property image`} className="object-cover rounded-md w-full h-full "/>
                        )
                        :
                        <span className="flex w-full h-full justify-center bg-red-100 items-center">
                            <p className="text-gray-800 font-medium"> No Images </p> 
                        </span>
                    }   
                </div>
                <div className="flex gap-2 w-full h-1/5">
                    {
                        listing?.property?.propertyImages.map((im) => (
                        <div className="rounded-md flex justify-center items-center w-full h-full border" onClick={() => {}}>
                            <img src={`${im.image}`} alt={`property image`} className="object-cover text-gray-800 rounded-md w-full h-full text-xs "/>
                        </div>
                        ))
                    }
                </div>
            </div>

            <div className="space-y-3">
                <div className="flex gap-2 overflow-auto">
                    {
                        ['neighbouhood', 'market', 'schools', 'gyms', 'parks'].map((lm) => (
                        <button 
                            key={lm} 
                            className={`p-2 rounded-md  capitalize ${lm == selectedLandMark.toLowerCase() ? 'bg-purple-700 text-white' : 'text-gray-800 bg-gray-200'}  `} 
                            onClick={() => {setSelectedLandMark(lm)}}
                            > 
                            {lm} 
                        </button>
                        ))
                    }
                </div>

                <div className="w-full min-h-[200px] overflow-auto rounded-lg">
                    <iframe
                        width="600"
                        height="450"
                        className="border rounded-lg w-full h-full md:flex border-gray-300"
                        loading="lazy"
                        allowFullScreen
                        referrerPolicy="no-referrer-when-downgrade"
                        src={`https://www.google.com/maps/embed/v1/view?key=AIzaSyA7qx8ah0ZVIv43KxUPPspBRG1-fwY6jOU
                        &center=${listing?.property?.latitude},${listing?.property?.longitude}
                        &zoom=15`}
                    >
                    </iframe>
                </div>

            </div>
        </div>
        
        <div className="gap-2 w-full flex flex-col md:w-2/5 ">
            <div className="flex w-auto justify-between items-start rounded-md">
                <div className="">
                    <h1 className="text-2xl text-gray-800 font-bold">
                        {listing?.property?.name}
                    </h1>
                    <p className="font-medium text-gray-700">
                        {listing?.property?.address}
                    </p>
                </div>
                <div className="flex gap-2">
                    <button className="bg-gray-100 p-2 rounded">
                        <BookmarkIcon className="pointer-cursor rounded w-3 h-3 text-purple-700 font-bold" />
                    </button>
                    <button className="bg-gray-100 p-2 rounded">
                        <PaperAirplaneIcon className="pointer-cursor rounded w-3 h-3 text-purple-700 font-bold" />
                    </button>
                </div>
            </div>

            <div className="flex py-1 gap-2 rounded-md">
                {listing?.property?.features.map((f) => (

                        <FeatureMiniCard {...f} />

                    
                ))}
                <span className="flex gap-1 p-1 bg-gray-200 text-xs justify-around items-center text-gray-700 rounded-lg">
                    <ServerIcon className="w-3 h-3 text-gray-800 " />
                    
                    <span className="">
                        {listing?.property?.size} sqmtrs
                    </span>
            </span>
    
            </div>

            <div className="flex py-2 justify-between items-baseline w-full">
                <div className="">
                    <span className="flex font-medium items-baseline text-gray-900">
                        ₦<p className="font-bold text-purple-800 text-2xl"> {listing?.price}</p> <p>/year</p>
                    </span>
                </div>
                <div className="flex space-x-2">
                    <Link 
                        className="p-2 text-white rounded  bg-purple-700 font-medium"
                        to={
                            `/property/${listing?.id}/payment-plans/${
                                listing?.listing_type === "sale" ? "buy-now" : 
                                listing?.listing_type ==="rent"? "rent" : 
                                listing?.listing_type ==="invest"? "invest"
                                : ""}`
                            }
                    >
                        {
                                listing?.listing_type === "sale" ? "Buy" : 
                                listing?.listing_type ==="rent"? "Rent" : 
                                listing?.listing_type ==="invest"? "Invest": ""
                        }
                    </Link>
                    <Link to="" className="p-2 text-purple-900 rounded  bg-purple-100 font-medium">
                        View 3D Tour
                    </Link>
                </div>
            </div>

            
            <div className="w-full">
                <span className="flex justify-between items-center">
                    <h2 className="font-bold text-xl text-gray-800"> Overview</h2>
                    <p className="font-medium italic underline text-xs text-purple-700">{listing?.property?.manager?.display_name}</p>
                </span>
                
                <span className="text-wrap flex text-gray-700">
                    {isLongDescription ? (
                        !showFullDescription ? (
                            <p className="transition ease-in-out line-clamp-2 duration-2000">
                                {listing?.property?.description.slice(0, 100)}
                                <button
                                    className="text-sm text-purple-700"
                                    onClick={() => setShowFullDescription(true)}
                                >
                                    read more
                                </button>
                            </p>
                        ) : (
                            <p className="transition ease-in-out duration-2000">
                                {listing?.property?.description}
                                <button
                                    className="text-sm text-purple-700"
                                    onClick={() => setShowFullDescription(false)}
                                >
                                    hide
                                </button>
                            </p>
                        )
                    ) : (
                        <p className="transition ease-in-out duration-2000">
                            {description}
                        </p>
                    )}
                </span>
            </div>


            <div className="space-y-2">
                <h2 className="font-bold text-xl text-gray-800"> Property Amenities & Features</h2>
                <div className="grid w-full grid-cols-2 gap-3">
                    {
                        listing?.property?.amenities.map((num) => (
                            <AmenityCard {...num} />
                    ))}
                </div>
            </div>


            <div className="w-full h-[100px] rounded-lg bg-gray-100">
                <img src="/images/ad/promo1.png" className="w-full hover:object-cover h-full object-cover rounded-lg"/>
            </div>
        </div>
        
    </div>
} 




export async function loader({request, params}: LoaderFunctionArgs) {
    const id = params.propID
    let property : PropertyListing | null
    const args: fetcherProps = {
                                    endpoint: getUrl('listings', `${id}`),
                                    method: 'GET',  
                                } 
    console.log("FetchProps: ", args)
    const property_response = await fetchData(args);
    
    if (property_response.status !== 200) {
        property = null
        redirect('/explore')
    }
    else {
        property = property_response.body
    }

    return json({id, property})
}



export function ErrorBoundary() {
    const error = useRouteError()
  
    // when true, this is what used to go to `CatchBoundary`
    if (isRouteErrorResponse(error)) {
      const client: boolean = error.status >= 400 && error.status < 500
      const props = client ? { status: error.status } : {}
    //   const Component = client ? Errors['400'] : Errors['500']
  
      return (
        <DomWrapper>
          <div className="flex h-full w-full items-center justify-center">
            Oops! Something Happened.
          </div>
        </DomWrapper>
      )
    }
  
    return (
      <DomWrapper>
        <div className="flex h-full w-full text-gray-800 font-extrabold items-center justify-center">
          An Error Occured 
        </div>
      </DomWrapper>
    )
}