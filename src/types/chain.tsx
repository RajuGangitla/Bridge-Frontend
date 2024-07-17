export interface Chain {
    chainId: number
    name: string
}

export interface TransactionData {
    srcChainId: number;
    srcQuoteTokenAddress: string;
    srcQuoteTokenAmount: string;
    dstChainId: number;
    dstQuoteTokenAddress: string;
    slippage: number;
    bridgeProvider?: string;
    srcBridgeTokenAddress?: string;
    dstBridgeTokenAddress?: string;
    srcSwapProvider?: string;
    dstSwapProvider?: string;
    receiver: string
}
