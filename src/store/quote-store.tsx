import { Chain } from "@/types/chain";
import { create } from "zustand";

export type TToken = {
    address: string;
    symbol: string;
    name: string;
    chainId: number;
    decimals: number;
    logoURI: string;
    amount: number;
    usdValue: number;
};

type TQuoteState = {
    src: TToken;
    dst: TToken;
    selectedChain: Chain;
    updateField: <K extends keyof TToken>(type: "src" | "dst", key: K, value: TToken[K]) => void;
    swap: () => void;
    updateToken: (type: "src" | "dst", token: TToken) => void;
    updateChain: (chain: Chain) => void;
};

const useQuoteStore = create<TQuoteState>((set) => ({
    src: {
        address: "",
        symbol: "",
        name: "",
        chainId: 0,
        decimals: 0,
        logoURI: "",
        amount: 0,
        usdValue: 0
    },
    dst: {
        address: "",
        symbol: "",
        name: "",
        chainId: 0,
        decimals: 0,
        logoURI: "",
        amount: 0,
        usdValue: 0
    },
    selectedChain: {
        chainId: 1,
        name: "ETHEREUM"
    },
    updateField: (type, key, value) => set((state) => ({
        [type]: {
            ...state[type],
            [key]: value
        }
    })),
    swap: () => set((state) => ({
        src: { ...state.dst, amount: state.dst.amount },
        dst: state.src
    })),
    updateToken: (type, token) => set((state) => {
        if (type === "src" && state.dst.symbol === token.symbol) {
            return {
                src: token,
                dst: {
                    address: "",
                    symbol: "",
                    name: "",
                    chainId: 0,
                    decimals: 0,
                    logoURI: "",
                    amount: 0,
                    usdValue: 0
                }
            };
        } else if (type === "dst" && state.src.symbol === token.symbol) {
            return {
                src: {
                    address: "",
                    symbol: "",
                    name: "",
                    chainId: 0,
                    decimals: 0,
                    logoURI: "",
                    amount: 0,
                    usdValue: 0
                },
                dst: token
            };
        } else {
            return {
                [type]: token
            };
        }
    }),
    updateChain: (chain) => set({
        selectedChain: chain
    })
}));

export default useQuoteStore;