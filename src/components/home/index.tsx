"use client";

import useQuoteStore from "@/store/quote-store";
import { buildTransactionApi, raiseQuoteApi } from "@/services/token";
import { useCallback, useEffect, useState } from "react";
import debounce from "lodash/debounce";
import { Skeleton } from "@/components/ui/skeleton";
import { padDecimals } from "@/utils/padZeroes";
import { ScrollArea } from "../ui/scroll-area";
import { Button } from "../ui/button";
import { TransactionData } from "@/types/chain";
import TransferCard from "./transer-card";
import RouteCard from "./route-card";

export default function Home() {
    const { src, dst, updateField, swap } = useQuoteStore();
    const [response, setResponse] = useState<any>();
    const { mutate: buildTransaction, isLoading: isLoadingbuildTransaction } =
        buildTransactionApi();
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
            receiver: "",
        };
        if (response?.routes?.[0]?.bridgeDescription?.bridgeProvider) {
            data.bridgeProvider =
                response?.routes?.[0]?.bridgeDescription?.bridgeProvider;
        }
        if (response?.routes?.[0]?.bridgeDescription?.srcBridgeTokenAddress) {
            data.srcBridgeTokenAddress =
                response?.routes?.[0]?.bridgeDescription?.srcBridgeTokenAddress;
        }
        if (response?.routes?.[0]?.bridgeDescription?.dstBridgeTokenAddress) {
            data.dstBridgeTokenAddress =
                response?.routes?.[0]?.bridgeDescription?.dstBridgeTokenAddress;
        }
        if (response?.routes?.[0]?.srcSwapDescription?.provider) {
            data.srcSwapProvider =
                response?.routes?.[0]?.srcSwapDescription?.provider;
        }
        if (response?.routes?.[0]?.dstSwapDescription?.provider) {
            data.dstSwapProvider =
                response?.routes?.[0]?.dstSwapDescription?.provider;
        }
        buildTransaction(data);
        console.log(data, "data");
    };

    useEffect(() => {
        if (
            src.amount !== undefined &&
            src.amount !== null &&
            src.amount !== 0 &&
            src.chainId !== undefined &&
            src.address !== "" &&
            dst.chainId !== undefined &&
            dst.address !== ""
        ) {
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
                <div className="flex flex-col sm:flex-row items-start gap-4 w-full lg:w-[80%]">
                    <div className="">
                        {/* Transer Card */}
                        <TransferCard isLoading={isLoading} />

                        {/* Bridge Fee */}
                        {response?.routes?.[0]?.bridgeDescription && (
                            <div className="flex items-center justify-between p-2">
                                <p className="text-sm">Bridge Fee</p>
                                <p className="text-sm">
                                    {response?.routes?.[0]?.bridgeDescription?.bridgeFeeAmount /
                                        Math.pow(
                                            10,
                                            response?.routes?.[0]?.bridgeDescription?.bridgeFeeToken
                                                ?.decimals || 1
                                        )}{" "}
                                    {
                                        response?.routes?.[0]?.bridgeDescription?.bridgeFeeToken
                                            ?.symbol
                                    }
                                </p>
                            </div>
                        )}

                        {/* Build Transaction */}
                        {response?.routes?.length > 0 && (
                            <Button
                                disabled={isLoadingbuildTransaction}
                                onClick={() => handleTransaction(response)}
                                className="w-full my-2 items-center justify-center bg-blue-800 rounded-md p-2 text-gray-300 text-lg font-semibold hover:bg-blue-600"
                            >
                                Build Transaction
                            </Button>
                        )}
                    </div>

                    {isLoading ? (
                        <div className="flex flex-col gap-2">
                            <Skeleton className="h-48 w-full lg:w-[350px]" />
                            <Skeleton className="h-48 w-full lg:w-[350px]" />
                        </div>
                    ) : (
                        <>
                            {response?.routes?.length > 0 && (
                                <>
                                    {/* Show Routes from quote api */}
                                    <ScrollArea className="w-full lg:w-[350px] h-[400px] overflow-y-auto">
                                        <div className=" space-y-2">
                                            {response?.routes?.map((route: any, index: number) => (
                                                <>
                                                    <RouteCard route={route} index={index} />
                                                </>
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
