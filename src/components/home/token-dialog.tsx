"use client"

import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { getAllSupportedChainsApi } from "@/services/token"
import { ScrollArea } from "@/components/ui/scroll-area"
import { useState } from "react"
import GetAllToken from "../chains/get-token"
import { ChevronDown } from "lucide-react"
import { Chain } from "@/types/chain"
import useQuoteStore from "@/store/quote-store"
import { SRC_TYPE } from "@/constants/quote"
import TokenAvatar from "../chains/token-avatar"


interface ITokenDialog {
    type: "src" | "dst"
}

export default function TokenDialog({ type }: ITokenDialog) {
    const { src, dst, updateChain, selectedChain } = useQuoteStore();
    const [open, setOpen] = useState<boolean>(false);
    const { data: getAllSupportedChains, isLoading: isLoadinggetAllSupportedChains } = getAllSupportedChainsApi();

    return (
        <>
            <Dialog open={open} onOpenChange={setOpen}>
                <DialogTrigger asChild>
                    <div className="flex items-center justify-between gap-4 p-4 rounded-md bg-slate-800 cursor-pointer w-full md:w-auto">
                        {/* Token Avatar */}
                        {type === SRC_TYPE ? (
                            <TokenAvatar logoURI={src?.logoURI} symbol={src?.symbol} name={src?.name} />
                        ) : (
                            <TokenAvatar logoURI={dst?.logoURI} symbol={dst?.symbol} name={dst?.name} />
                        )}
                        <ChevronDown className="text-white" size={20} />
                    </div>
                </DialogTrigger>
                <DialogContent className="max-w-[600px] mx-auto p-6">
                    <DialogHeader>
                        <DialogTitle>Select Token</DialogTitle>
                        <DialogDescription>Select the chain to view its tokens.</DialogDescription>
                    </DialogHeader>
                    <ScrollArea className="h-[300px] rounded-md border p-4">
                        <div className="flex flex-wrap gap-4 py-2">
                            {/* Supported Chains */}
                            {getAllSupportedChains?.data?.supportedChains?.length > 0 &&
                                getAllSupportedChains?.data?.supportedChains?.map((chain: Chain) => (
                                    <button
                                        key={chain.chainId}
                                        onClick={() => updateChain(chain)}
                                        className={`flex items-center justify-center rounded-md w-28 h-28 p-4 bg-muted hover:bg-accent cursor-pointer transition ${chain.chainId === selectedChain.chainId ? "border-2 border-white" : ""}`}
                                    >
                                        <p className="capitalize text-xs text-center">{chain?.name}</p>
                                    </button>
                                ))}
                        </div>
                    </ScrollArea>
                    <div className="mt-4">
                        {/* All Tokens */}
                        <GetAllToken type={type} setOpen={setOpen} />
                    </div>
                </DialogContent>
            </Dialog>
        </>
    );
}