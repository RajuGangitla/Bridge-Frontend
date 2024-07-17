"use client"

import useQuoteStore from "@/store/quote-store";
import { Card } from "../ui/card"
import { Star } from "lucide-react";



interface IRouteCard {
    index: number
    route: any
}

export default function RouteCard({ index, route }: IRouteCard) {
    const { src, dst } = useQuoteStore();

    return (
        <>
            <Card key={index} className="w-full p-4 border-2 border-blue-900">
                <div className="flex items-center justify-between">
                    <span className="flex items-center gap-2 bg-blue-800 rounded-md p-2 text-blue-200 text-xs">
                        <Star size={16} />
                        {index === 0 ? "Best Price" : `#${index + 1}`}
                    </span>
                    <p className="text-sm font-semibold">
                        {route?.dstQuoteTokenAmount / Math.pow(10, route?.dstQuoteToken?.decimals || 1)}{" "}
                        {route?.dstQuoteToken?.symbol}
                    </p>
                </div>

                {/* srcSwapDescription */}
                {route?.srcSwapDescription && (
                    <div className="">
                        <p className="my-2 font-medium">
                            Swap {src.name} to {dst.name}
                        </p>
                        <p className="my-2 text-xs text-gray-300">
                            via {route?.srcSwapDescription?.provider} ({" "}
                            {route.srcSwapDescription?.dexNames?.map((dex: string, dexindex: number) => (
                                <span key={dexindex} className="text-xs">
                                    {dex}
                                </span>
                            ))}
                            )
                        </p>
                    </div>
                )}
                {/* bridgeDescription */}
                {route?.bridgeDescription && (
                    <div className="">
                        <p className="my-2 font-medium">Bridge</p>
                        <p className="my-2 text-xs text-gray-300">via {route?.bridgeDescription?.provider}</p>
                    </div>
                )}
                {/* dstSwapDescription */}
                {route?.dstSwapDescription && (
                    <div className="">
                        <p className="my-2 font-medium">
                            Swap {src.name} to {dst.name}
                        </p>
                        <p className="my-2 text-xs text-gray-300">
                            via {route?.dstSwapDescription?.provider} ({" "}
                            {route.dstSwapDescription?.dexNames?.map((dex: string, dexindex: number) => (
                                <span key={dexindex} className="text-xs">
                                    {dex}
                                </span>
                            ))}
                            )
                        </p>
                    </div>
                )}
            </Card>
        </>
    )
}