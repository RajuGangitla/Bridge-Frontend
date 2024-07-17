import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { getAllTokensApi } from "@/services/token";
import useQuoteStore, { TToken } from "@/store/quote-store";
import { Loader } from "lucide-react";
import React from "react";


interface IGetAllToken {
    type: "src" | "dst"
    setOpen: React.Dispatch<React.SetStateAction<boolean>>
}

export default function GetAllToken({ type, setOpen }: IGetAllToken) {
    const { updateToken, src, dst, selectedChain } = useQuoteStore()
    const { data: getAllTokens, isLoading, isRefetching } = getAllTokensApi(selectedChain?.chainId || 1);

    const handleUpdate = (token: TToken) => {
        updateToken(type, token)
        setOpen(false)
    }

    return (
        <>
            <p className="mb-2">On {selectedChain?.name}</p>
            <ScrollArea className="h-[200px] rounded-md border p-4">
                {isLoading || isRefetching ? (
                    <div className="h-full flex items-center justify-center">
                        <Loader className="animate-spin text-blue-500" size={24} />
                    </div>
                ) : (
                    <div className="flex flex-col gap-2 py-2">
                        {getAllTokens?.data?.recommendedTokens?.length > 0 ? (
                            getAllTokens?.data.recommendedTokens.map((token: any) => (
                                <div key={token.symbol} className={`flex items-center gap-2 rounded-md hover:bg-gray-700 p-2 transition     ${(type === "src" && src.name === token.name || type === "dst" && dst.name === token.name) ? "cursor-not-allowed" : "cursor-pointer"} `} onClick={() => handleUpdate(token)}>
                                    <Avatar>
                                        <AvatarImage src={token.logoURI} alt={token.symbol} />
                                        <AvatarFallback>{token.symbol[0]}</AvatarFallback>
                                    </Avatar>
                                    <div className="flex flex-col gap-1">
                                        <p className="text-sm font-semibold">{token.name}</p>
                                        <p className="text-xs text-gray-500">{token.symbol}</p>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <p className="text-center text-gray-500">No tokens found</p>
                        )}
                    </div>
                )}
            </ScrollArea>
        </>

    );
}