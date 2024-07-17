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
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";


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
                        {type === 'src' ? (
                            <div className="flex items-center gap-2">
                                <Avatar>
                                    <AvatarImage src={src.logoURI} alt={src.symbol} />
                                    <AvatarFallback>{src.symbol[0] ?? "?"}</AvatarFallback>
                                </Avatar>
                                <div>
                                    <p className="font-semibold text-white text-sm md:text-base">{src.name ? src.name : "Token"}</p>
                                    <p className="text-xs font-semibold text-gray-500 md:text-sm">{src.symbol ? src.symbol : "Network"}</p>
                                </div>
                            </div>
                        ) : (
                            <div className="flex items-center gap-2">
                                <Avatar>
                                    <AvatarImage src={dst.logoURI} alt={dst.symbol} />
                                    <AvatarFallback>{dst.symbol[0] ?? "?"}</AvatarFallback>
                                </Avatar>
                                <div>
                                    <p className="font-semibold text-white text-sm md:text-base">{dst.name ? dst.name : "Token"}</p>
                                    <p className="text-xs font-semibold text-gray-500 md:text-sm">{dst.symbol ? dst.symbol : "Network"}</p>
                                </div>
                            </div>
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
                        <GetAllToken type={type} setOpen={setOpen} />
                    </div>
                </DialogContent>
            </Dialog>
        </>
    );
}