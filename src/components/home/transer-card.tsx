"use client"

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
import { Skeleton } from "../ui/skeleton";
import { ArrowDownUp } from "lucide-react";
import { DST_TYPE, SRC_TYPE } from "@/constants/quote";


export default function TransferCard({ isLoading }: { isLoading: boolean }) {
    const { src, dst, updateField, swap } = useQuoteStore();

    return (
        <>
            <Card className="w-full md:w-[550px] ">
                <CardHeader>
                    <CardTitle className="">Transfer</CardTitle>
                    <CardDescription>
                        Use it for conversion of your crypto currencies.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="relative grid w-full items-center gap-4">

                        {/* From  */}
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
                                    <Label className="text-xs">=${src.usdValue ? src.usdValue : 0}</Label>
                                )}
                            </div>
                            <TokenDialog type={SRC_TYPE} />
                        </div>

                        {/* To  */}
                        <div className="flex items-center justify-between gap-4 px-4 py-2 border rounded-md">
                            <div className="flex flex-col gap-2 w-full md:w-auto">
                                <Label className="">To (Quote)</Label>
                                {isLoading ? (
                                    <Skeleton className="h-8 w-[100px]" />
                                ) : (
                                    <Label className=" font-semibold text-lg ">
                                        {dst.amount ? dst.amount : 0}
                                    </Label>
                                )}
                                {isLoading ? (
                                    <Skeleton className="h-6 w-[150px]" />
                                ) : (
                                    <Label className=" text-xs">=${dst.usdValue ? dst.usdValue : 0}</Label>
                                )}
                            </div>

                            <TokenDialog type={DST_TYPE} />
                        </div>

                        <ArrowDownUp
                            onClick={swap}
                            className="absolute text-blue-500 bg-muted cursor-pointer rounded-full p-1 top-[50%] left-[50%]"
                            size={24}
                        />
                    </div>
                </CardContent>
            </Card>
        </>
    )
}