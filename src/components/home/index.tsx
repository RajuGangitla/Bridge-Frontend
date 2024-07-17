"use client";

import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import TokenDialog from "./token-dialog";
import useQuoteStore from "@/store/quote-store";
import { buildTransactionApi, raiseQuoteApi } from "@/services/token";
import { useCallback, useEffect, useState } from "react";
import debounce from "lodash/debounce";
import { Skeleton } from "@/components/ui/skeleton";
import { padDecimals } from "@/utils/padZeroes";
import { ArrowDownUp, Star } from "lucide-react";
import { ScrollArea } from "../ui/scroll-area";
import { Button } from "../ui/button";
import { TransactionData } from "@/types/chain";

export default function Home() {
    const { src, dst, updateField, swap, selectedChain } = useQuoteStore();
    const [response, setResponse] = useState<any>();
    const { mutate: buildTransaction, isLoading: isLoadingbuildTransaction } = buildTransactionApi()
    const { mutate: raiseQuote, isLoading } = raiseQuoteApi(
        updateField,
        setResponse
    );

    const debounceRaiseQuote = useCallback(
        debounce((formdata) => {
            raiseQuote(formdata);
        }, 500), // Adjust the debounce delay as needed (500ms in this case)
        []
    );

    const handleTransaction = (response: any) => {
        let data: TransactionData = {
            srcChainId: src.chainId,
            srcQuoteTokenAddress: src.address,
            srcQuoteTokenAmount: padDecimals(src.amount, src.decimals),
            dstChainId: dst.chainId,
            dstQuoteTokenAddress: dst.address,
            slippage: 1,
            receiver: ""
        }
        if (response?.routes?.[0]?.bridgeDescription?.bridgeProvider) {
            data.bridgeProvider = response?.routes?.[0]?.bridgeDescription?.bridgeProvider
        }
        if (response?.routes?.[0]?.bridgeDescription?.srcBridgeTokenAddress) {
            data.srcBridgeTokenAddress = response?.routes?.[0]?.bridgeDescription?.srcBridgeTokenAddress
        }
        if (response?.routes?.[0]?.bridgeDescription?.dstBridgeTokenAddress) {
            data.dstBridgeTokenAddress = response?.routes?.[0]?.bridgeDescription?.dstBridgeTokenAddress
        }
        if (response?.routes?.[0]?.srcSwapDescription?.provider) {
            data.srcSwapProvider = response?.routes?.[0]?.srcSwapDescription?.provider
        }
        if (response?.routes?.[0]?.dstSwapDescription?.provider) {
            data.dstSwapProvider = response?.routes?.[0]?.dstSwapDescription?.provider
        }
        buildTransaction(data)
        console.log(data, "data")
    }

    useEffect(() => {
        if (src.amount !== undefined && src.amount !== null && src.amount !== 0) {
            let formdata = {
                srcChainId: src.chainId,
                srcQuoteTokenAddress: src.address,
                srcQuoteTokenAmount: padDecimals(src.amount, src.decimals),
                dstChainId: dst.chainId,
                dstQuoteTokenAddress: dst.address,
                slippage: 1,
                commissionRate: 0,
            };
            debounceRaiseQuote(formdata);
        }
    }, [src.amount, swap, debounceRaiseQuote]);

    return (
        <>
            <div className="h-screen flex items-center justify-center p-4">
                <div className="flex flex-col sm:flex-row items-start gap-4 w-full md:w-[80%]">
                    <div className="">
                        <Card className="w-full md:w-[550px] ">
                            <CardHeader>
                                <CardTitle className="">Transfer</CardTitle>
                                <CardDescription>
                                    Deploy your new project in one-click.
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="relative grid w-full items-center gap-4">
                                    <div className="flex items-center justify-between gap-4 px-4 py-2 border rounded-md">
                                        <div className="flex flex-col gap-2 w-full md:w-auto">
                                            <Label>From</Label>
                                            <input
                                                value={src.amount}
                                                onChange={(e) =>
                                                    updateField("src", "amount", Number(e.target.value))
                                                }
                                                placeholder="0.0"
                                                type="number"
                                                className="border-none focus:ring-0 focus:border-transparent focus:outline-none focus:shadow-none p-0 text-lg bg-background"
                                            />
                                            {isLoading ? (
                                                <Skeleton className="h-6 w-full md:w-[240px]" />
                                            ) : (
                                                <Label className="text-xs">=${src.usdValue}</Label>
                                            )}
                                        </div>
                                        <TokenDialog type={"src"} />
                                    </div>

                                    <div className="flex items-center justify-between gap-4 px-4 py-2 border rounded-md">
                                        <div className="flex flex-col gap-2 w-full md:w-auto">
                                            <Label className="">To (Quote)</Label>
                                            {isLoading ? (
                                                <Skeleton className="h-8 w-[100px]" />
                                            ) : (
                                                <Label className=" font-semibold text-lg ">
                                                    {dst.amount}
                                                </Label>
                                            )}
                                            {isLoading ? (
                                                <Skeleton className="h-6 w-[150px]" />
                                            ) : (
                                                <Label className=" text-xs">=${dst.usdValue}</Label>
                                            )}
                                        </div>

                                        <TokenDialog type={"dst"} />
                                    </div>

                                    <ArrowDownUp
                                        onClick={swap}
                                        className="absolute text-blue-500 bg-muted cursor-pointer rounded-full p-1 top-[50%] left-[50%]"
                                        size={24}
                                    />
                                </div>
                            </CardContent>
                        </Card>
                        {
                            response?.routes?.[0]?.bridgeDescription &&
                            <div className="flex items-center justify-between p-2">
                                <p>Bridge Fee</p>
                                <p>{response?.routes?.[0]?.bridgeDescription?.bridgeFeeAmount / Math.pow(
                                    10,
                                    response?.routes?.[0]?.bridgeDescription?.bridgeFeeToken?.decimals || 1
                                )} {response?.routes?.[0]?.bridgeDescription?.bridgeFeeToken?.symbol}</p>
                            </div>
                        }
                        {
                            response?.routes?.length > 0 && <Button onClick={() => handleTransaction(response)} className="w-full my-2 items-center justify-center bg-blue-800 rounded-md p-2 text-blue-300 text-lg font-semibold hover:bg-blue-600">
                                Build Transaction
                            </Button>
                        }
                    </div>

                    {isLoading ? (
                        <div className="flex flex-col gap-2">
                            <Skeleton className="h-48 w-full md:w-[350px]" />
                            <Skeleton className="h-48 w-full md:w-[350px]" />
                        </div>
                    ) : (
                        <>
                            {response?.routes?.length > 0 && (
                                <>
                                    <ScrollArea className="w-full md:w-[350px] h-[400px] overflow-y-auto">
                                        <div className=" space-y-2">
                                            {response?.routes?.map((route: any, index: number) => (
                                                <Card key={index} className="w-full p-4 border-2 border-blue-900">
                                                    <div className="flex items-center justify-between">
                                                        <span className="flex items-center gap-2 bg-blue-800 rounded-md p-2 text-blue-300 text-xs">
                                                            <Star size={16} />
                                                            {index === 0 ? "Best Price" : `#${index + 1}`}
                                                        </span>
                                                        <p className="text-sm font-semibold">
                                                            {route?.dstQuoteTokenAmount / Math.pow(10, route?.dstQuoteToken?.decimals || 1)}{" "}
                                                            {route?.dstQuoteToken?.symbol}
                                                        </p>
                                                    </div>
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
                                                    {route?.bridgeDescription && (
                                                        <div className="">
                                                            <p className="my-2 font-medium">Bridge</p>
                                                            <p className="my-2 text-xs text-gray-300">via {route?.bridgeDescription?.provider}</p>
                                                        </div>
                                                    )}
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
                                            ))}
                                        </div>

                                    </ScrollArea>
                                </>
                            )}
                        </>
                    )}
                </div>
            </div>
        </>
    );
}
