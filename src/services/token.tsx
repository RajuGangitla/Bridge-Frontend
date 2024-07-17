import { toast } from "@/components/ui/use-toast";
import api from "@/lib/api";
import { TToken } from "@/store/quote-store";
import { roundToDecimals } from "@/utils/roundToDecimals";
import React from "react";
import { useMutation, useQuery, useQueryClient } from "react-query";


export const raiseQuoteApi = (updateField: (<K extends keyof TToken>(type: "src" | "dst", key: K, value: TToken[K]) => void), setResponse: React.Dispatch<React.SetStateAction<any>>) => {
    const queryclient = useQueryClient()
    return useMutation((data: any) => api.post(`/quotes`, data), {
        onSuccess: async (res) => {
            console.log(res?.data?.routes?.[0]?.dst_quote_token_amount)
            if (res?.data?.errorCode) {
                toast({
                    title: res?.data?.errorMsg,
                })
            }
            setResponse(res?.data)
            const dstAmount = res?.data?.routes?.[0]?.dstQuoteTokenAmount / (Math.pow(10, res?.data?.routes?.[0]?.dstQuoteToken?.decimals || 1));
            const roundedDstAmount = roundToDecimals(dstAmount, 2);

            const dstUsdValue = res?.data?.routes?.[0]?.dstQuoteTokenUsdValue;
            const roundedDstUsdValue = roundToDecimals(dstUsdValue, 2);

            const srcUsdValue = res?.data?.routes?.[0]?.srcQuoteTokenUsdValue;
            const roundedSrcUsdValue = roundToDecimals(srcUsdValue, 2);

            updateField('dst', 'amount', roundedDstAmount);
            updateField('dst', 'usdValue', roundedDstUsdValue);
            updateField('src', 'usdValue', roundedSrcUsdValue);
        },
        onError: ({ response }) => {
            toast({
                title: response?.data?.message,
            })
        },
    });
};

export const getAllTokensApi = (selectedChain: number | undefined) =>
    useQuery(
        ["getAllTokens", selectedChain],
        async () =>
            await api.get(`/tokens?chainId=${selectedChain}`),
        {
            refetchOnMount: false,
            refetchOnReconnect: false,
            refetchOnWindowFocus: false,
            enabled: selectedChain ? true : false,
            keepPreviousData: true,
        }
    );


export const getAllSupportedChainsApi = () =>
    useQuery(
        ["getAllSupportedChains",],
        async () =>
            await api.get("/chains"),
        {
            refetchOnMount: false,
            refetchOnReconnect: false,
            refetchOnWindowFocus: false,
            keepPreviousData: true,
        }
    );

export const buildTransactionApi = () => {
    const queryclient = useQueryClient()
    return useMutation((data: any) => api.post(`/transaction`, data), {
        onSuccess: async (res) => {
            if (res?.data?.errorCode) {
                toast({
                    title: res?.data?.errorMsg,
                })
            }
        },
        onError: ({ response }) => {
            toast({
                title: response?.data?.message,
            })
        },
    });
};