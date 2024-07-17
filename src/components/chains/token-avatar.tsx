import React from 'react';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

type TokenAvatarProps = {
    logoURI: string | undefined;
    symbol: string | undefined;
    name: string | undefined;
};

const TokenAvatar: React.FC<TokenAvatarProps> = ({ logoURI, symbol, name }) => (
    <div className="flex items-center gap-2">
        <Avatar>
            <AvatarImage src={logoURI} alt={symbol} />
            <AvatarFallback>{symbol ? symbol[0] : "?"}</AvatarFallback>
        </Avatar>
        <div>
            <p className="font-semibold text-white text-sm md:text-base">{name || "Token"}</p>
            <p className="text-xs font-semibold text-gray-500 md:text-sm">{symbol || "Network"}</p>
        </div>
    </div>
);

export default TokenAvatar;