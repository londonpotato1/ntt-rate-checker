/**
 * NTT Rate Limit Checker
 * Wormhole Native Token Transfer rate limit checker
 */

// ============== Configuration ==============

// Wormhole Chain IDs
const WORMHOLE_CHAIN_IDS = {
    ethereum: 2,
    bsc: 4,
    polygon: 5,
    avalanche: 6,
    arbitrum: 23,
    optimism: 24,
    base: 30,
    solana: 1,
    creditcoin: 40,
    hyperevm: 45,
};

// Chain display names
const CHAIN_NAMES = {
    ethereum: 'Ethereum',
    bsc: 'BSC',
    base: 'Base',
    arbitrum: 'Arbitrum',
    optimism: 'Optimism',
    polygon: 'Polygon',
    avalanche: 'Avalanche',
    solana: 'Solana',
    creditcoin: 'CreditCoin',
    hyperevm: 'HyperEVM',
};

// RPC URLs (public endpoints)
const RPC_URLS = {
    ethereum: 'https://eth.llamarpc.com',
    bsc: 'https://bsc-dataseed.binance.org',
    base: 'https://mainnet.base.org',
    arbitrum: 'https://arb1.arbitrum.io/rpc',
    optimism: 'https://mainnet.optimism.io',
    polygon: 'https://polygon-rpc.com',
    avalanche: 'https://api.avax.network/ext/bc/C/rpc',
};

// Token Presets - NTT Manager addresses per chain (from Wormhole NTT config API)
const TOKEN_PRESETS = {
    // Major tokens
    W: {
        name: 'Wormhole',
        decimals: 18,
        chains: {
            ethereum: '0xc072B1AEf336eDde59A049699Ef4e8Fa9D594A48',
            arbitrum: '0x5333d0AcA64a450Add6FeF76D6D1375F726CB484',
            base: '0x5333d0AcA64a450Add6FeF76D6D1375F726CB484',
            optimism: '0x1a4F1a790f23Ffb9772966cB6F36dCd658033e13',
        },
        sourceChains: ['ethereum', 'arbitrum', 'base', 'optimism', 'solana'],
    },
    HYPE: {
        name: 'Hyperliquid',
        decimals: 18,
        chains: {
            base: '0x2DE7Ae79810eAE1E3c369f8880A149e248514627',
        },
        sourceChains: ['hyperevm', 'solana'],
    },
    AVAIL: {
        name: 'Avail',
        decimals: 18,
        chains: {
            ethereum: '0x2E65520ff593b583A2e5895174eF7F40F78a90BD',
            base: '0x4b3d190ca333a1414376Dd565ACBa58350A36d67',
            bsc: '0xD7c5A24b84546A08c49b9F52457754Fa235a1A1c',
        },
        sourceChains: ['ethereum', 'base', 'bsc', 'solana'],
    },
    
    // DeFi / Staking
    osETH: {
        name: 'StakeWise osETH',
        decimals: 18,
        chains: {
            ethereum: '0x896b78fd7e465fb22e80c34ff8f1c5f62fa2c009',
            arbitrum: '0x485F6Ac6a3B97690910C1546842FfE0629582aD3',
        },
        sourceChains: ['ethereum', 'arbitrum'],
    },
    wstETH: {
        name: 'Lido wstETH',
        decimals: 18,
        chains: {
            ethereum: '0xb948a93827d68a82F6513Ad178964Da487fe2BD9',
            bsc: '0x6981F5621691CBfE3DdD524dE71076b79F0A0278',
        },
        sourceChains: ['ethereum', 'bsc'],
    },
    ETHFI: {
        name: 'EtherFi',
        decimals: 18,
        chains: {
            ethereum: '0x344169Cc4abE9459e77bD99D13AA8589b55b6174',
            arbitrum: '0x90A82462258F79780498151EF6f663f1D4BE4E3b',
            base: '0xE87797A1aFb329216811dfA22C87380128CA17d8',
        },
        sourceChains: ['ethereum', 'arbitrum', 'base', 'solana'],
    },
    JitoSOL: {
        name: 'Jito SOL',
        decimals: 9,
        chains: {
            arbitrum: '0x02f5FB92F3794C535b1523183A417fB9efbB4f5d',
        },
        sourceChains: ['solana'],
    },
    
    // Stablecoins
    USDS: {
        name: 'Sky USDS',
        decimals: 18,
        chains: {
            ethereum: '0x7d4958454a3f520bDA8be764d06591B054B0bf33',
        },
        sourceChains: ['solana'],
    },
    sUSD: {
        name: 'Synthetix sUSD',
        decimals: 18,
        chains: {
            base: '0x45B146F08Ea81A8bDEdd67A59fBBf88881cE07B5',
        },
        sourceChains: ['solana'],
    },
    ZeUSD: {
        name: 'ZeUSD',
        decimals: 18,
        chains: {
            ethereum: '0x9086dd96b6906D794fD4581feD972fD275Ea0548',
        },
        sourceChains: ['solana'],
    },
    mUSD: {
        name: 'Mezo USD',
        decimals: 18,
        chains: {
            ethereum: '0x5293158bf7a81ED05418DA497a80F7e6Dbf4477E',
        },
        sourceChains: ['mezo'],
    },
    
    // Layer 2 / Infra
    Layer3: {
        name: 'Layer3',
        decimals: 18,
        chains: {
            ethereum: '0x7926D63FEb9b950908b297cC995B6853bCA21847',
            base: '0xBC51f76178a56811fdfe95D3897E6aC2B11DbB62',
            optimism: '0xBC51f76178a56811fdfe95D3897E6aC2B11DbB62',
            polygon: '0xBC51f76178a56811fdfe95D3897E6aC2B11DbB62',
            arbitrum: '0xBC51f76178a56811fdfe95D3897E6aC2B11DbB62',
            bsc: '0xBC51f76178a56811fdfe95D3897E6aC2B11DbB62',
        },
        sourceChains: ['ethereum', 'base', 'optimism', 'polygon', 'arbitrum', 'bsc', 'solana'],
    },
    VaultCraft: {
        name: 'VaultCraft',
        decimals: 18,
        chains: {
            ethereum: '0xBfdc5171Cf63acE266aF9cA06DAD6301Ef6455d3',
            arbitrum: '0x0fa98307C08a4A832291767600ABaDb02209DF3f',
            optimism: '0xDafC709d84f5FE09546fD054220EA59b47517379',
            base: '0xDafC709d84f5FE09546fD054220EA59b47517379',
            avalanche: '0x30F64191353Db3f2135CAb366039c916BE38B598',
        },
        sourceChains: ['ethereum', 'arbitrum', 'optimism', 'base', 'avalanche'],
    },
    RedStone: {
        name: 'RedStone',
        decimals: 18,
        chains: {
            ethereum: '0xE9315adF65c8BD4d21d9ba03B4a25B7C8C8500D7',
            base: '0x84b4ECc4B936d677b23369708A6577F29206E982',
        },
        sourceChains: ['ethereum', 'base', 'solana'],
    },
    
    // Gaming / Social
    XBorg: {
        name: 'XBorg',
        decimals: 18,
        chains: {
            ethereum: '0xa4489105efa4b029485d6bd3A4f52131baAE4B1B',
            arbitrum: '0x7135766F279b9A50F7A7199cfF1be284521a0409',
        },
        sourceChains: ['ethereum', 'arbitrum', 'solana'],
    },
    Ponke: {
        name: 'Ponke',
        decimals: 9,
        chains: {
            ethereum: '0x043b92BDFB8d9c4e7aea18789CB09Df8D67Ff48B',
            base: '0x73D9Ea755E32caF3e204B24EF4cCCabBB3087AcD',
        },
        sourceChains: ['ethereum', 'base', 'solana'],
    },
    Cheese: {
        name: 'Cheese',
        decimals: 9,
        chains: {
            arbitrum: '0xfC843c4B402634a8Fc02137AAa7942474e043d72',
        },
        sourceChains: ['solana'],
    },
    DOOD: {
        name: 'Doodles',
        decimals: 18,
        chains: {
            bsc: '0x2D23A8a011Cb34F2A55b2aF0d46ed218FE78Aa86',
        },
        sourceChains: ['solana'],
    },
    
    // DeSci / Bio
    BioProtocol: {
        name: 'BioProtocol',
        decimals: 18,
        chains: {
            ethereum: '0x1783E7d1F498321D7E15044d769621E1beDc7F4C',
            base: '0x9AfEbcA0d37661167AFD24481C39eBE2Ead89571',
        },
        sourceChains: ['ethereum', 'base', 'solana'],
    },
    VitaDAO: {
        name: 'VitaDAO',
        decimals: 18,
        chains: {
            ethereum: '0xB6C8c3050A3BFC9b58D7306d37cA0C2C8BFA865a',
            base: '0x8F754a8aD98aBEF04e8ba3740E532299AbDC1AE4',
        },
        sourceChains: ['ethereum', 'base', 'solana'],
    },
    QBio: {
        name: 'QBio',
        decimals: 18,
        chains: {
            ethereum: '0xD56541B73402519Ffc6CA32596ed2A1179752184',
        },
        sourceChains: ['solana'],
    },
    ValleyDAO: {
        name: 'ValleyDAO',
        decimals: 18,
        chains: {
            ethereum: '0x24E85C241766E1e009388cdCe3B70096d2Fd6892',
        },
        sourceChains: ['solana'],
    },
    
    // AI / Data
    GoPlus: {
        name: 'GoPlus Security',
        decimals: 18,
        chains: {
            base: '0xc42562bf114B73F676edC39626f4Ca68966B9e53',
        },
        sourceChains: ['solana'],
    },
    TracyAI: {
        name: 'Tracy AI',
        decimals: 18,
        chains: {
            bsc: '0x1F5AA4D820074Fd624691AaEb61Cff1Eadbf8E8B',
        },
        sourceChains: ['solana'],
    },
    
    // Infrastructure
    WCT: {
        name: 'WalletConnect',
        decimals: 18,
        chains: {
            ethereum: '0x164Be303480f542336bE0bBe0432A13b85e6FD1b',
            optimism: '0x164Be303480f542336bE0bBe0432A13b85e6FD1b',
            base: '0x164Be303480f542336bE0bBe0432A13b85e6FD1b',
        },
        sourceChains: ['ethereum', 'optimism', 'base', 'solana'],
    },
    Portal: {
        name: 'Portal',
        decimals: 18,
        chains: {
            ethereum: '0x4Da71EA6853ED228c1b9E1CdB0A1f2dc7f542927',
        },
        sourceChains: ['solana'],
    },
    IoTeX: {
        name: 'IoTeX',
        decimals: 18,
        chains: {
            ethereum: '0xeef759AA47F63ce6bcee44E1FED86517cDeD571F',
        },
        sourceChains: ['solana'],
    },
    Powerledger: {
        name: 'Powerledger',
        decimals: 6,
        chains: {
            ethereum: '0xeAb33741052F89C5f33E928B2D35337342a9E760',
        },
        sourceChains: ['solana'],
    },
    SQD: {
        name: 'Subsquid',
        decimals: 18,
        chains: {
            arbitrum: '0x37DCb4E443a06A3FE0E7098519C1d81181E5322B',
            bsc: '0x37DCb4E443a06A3FE0E7098519C1d81181E5322B',
        },
        sourceChains: ['arbitrum', 'bsc'],
    },
    
    // Wrapped Native
    wSOL: {
        name: 'Wrapped SOL',
        decimals: 9,
        chains: {
            avalanche: '0xB02cdc3e2a0f3a8742EaC2958a2f3fCD8aDdAD1C',
        },
        sourceChains: ['solana'],
    },
    wPOL: {
        name: 'Wrapped POL',
        decimals: 18,
        chains: {
            polygon: '0xE43EE1FabC4dcf4C2F060214f0a73c4E3AFC76a7',
        },
        sourceChains: ['solana'],
    },
    AVAX: {
        name: 'Wrapped AVAX',
        decimals: 18,
        chains: {
            avalanche: '0x32E64FA64a917C1E8dbe6ABeA8d821C45aae813C',
        },
        sourceChains: ['solana'],
    },
    
    // Hashkey / BTC
    cgETH: {
        name: 'Hashkey cgETH',
        decimals: 18,
        chains: {
            ethereum: '0xf6B2bDE31538e7B62Af61e2cbF2FEf9292fcC789',
            base: '0x0A4BE3Db775Da63ceA7713f78A338D9656E69D5D',
            arbitrum: '0x0A4BE3Db775Da63ceA7713f78A338D9656E69D5D',
            optimism: '0xFbf8bF9f50BEfDB87dd3eCC4D1ddf97F9b51CF46',
        },
        sourceChains: ['ethereum', 'base', 'arbitrum', 'optimism'],
    },
    clBTC: {
        name: 'Hashkey clBTC',
        decimals: 8,
        chains: {
            ethereum: '0x64E4b81023621CB08f5aC305c2dD6eDaaD717834',
            base: '0x429410525068b694160d686Eacf72Ce12B665991',
            arbitrum: '0xFc7f31805ec6F1884AbfD0ED72AB7DA752512DAe',
            optimism: '0x40bb93251cc4691812B5C298dF0c359cBF058424',
        },
        sourceChains: ['ethereum', 'base', 'arbitrum', 'optimism'],
    },
    
    // Others
    Renzo: {
        name: 'Renzo',
        decimals: 18,
        chains: {
            ethereum: '0x4ba5ea226da36466EA7EbCf018df66a615D27c7c',
        },
        sourceChains: ['solana'],
    },
    Swissborg: {
        name: 'SwissBorg',
        decimals: 18,
        chains: {
            ethereum: '0x66a28B080918184851774a89aB94850a41f6a1e5',
        },
        sourceChains: ['solana'],
    },
    Agora: {
        name: 'Agora',
        decimals: 18,
        chains: {
            ethereum: '0xCD024C7eB854f6799A343828773cB3A8107d17d4',
        },
        sourceChains: ['solana'],
    },
    WeatherXM: {
        name: 'WeatherXM',
        decimals: 18,
        chains: {
            ethereum: '0xd24afd8eca7b51bcf3c0e6b3ca94c301b121ccce',
        },
        sourceChains: ['solana'],
    },
    HoudiniSwap: {
        name: 'HoudiniSwap',
        decimals: 18,
        chains: {
            ethereum: '0xfBcCAc20483dA7c53BC95EC3e1AC4d26b5860b7a',
        },
        sourceChains: ['solana'],
    },
    stAvail: {
        name: 'Staked Avail',
        decimals: 18,
        chains: {
            ethereum: '0x71C4259648E5e6502C3cd29fB9aa818EF0142DD2',
            base: '0x931c9E3a44A48F5b80D7B4aBB25E28AB12D1Ad2A',
        },
        sourceChains: ['ethereum', 'base'],
    },
    CreatorBid: {
        name: 'CreatorBid',
        decimals: 18,
        chains: {
            bsc: '0xC5103069C3a0b52cddea0f565a4589d54452114C',
            base: '0xC5103069C3a0b52cddea0f565a4589d54452114C',
        },
        sourceChains: ['bsc', 'base'],
    },
    Lingo: {
        name: 'Lingo',
        decimals: 18,
        chains: {
            base: '0x7c91bAca69ad289eC5De46B0b36287770a1Ea91e',
        },
        sourceChains: ['solana'],
    },
    BrazilianDigital: {
        name: 'Brazilian Digital',
        decimals: 18,
        chains: {
            base: '0x8469783eDd405210a5438a4568eA4D0dbcC9CF7f',
            avalanche: '0x8469783eDd405210a5438a4568eA4D0dbcC9CF7f',
            polygon: '0x8469783eDd405210a5438a4568eA4D0dbcC9CF7f',
        },
        sourceChains: ['base', 'avalanche', 'polygon'],
    },
    BXDN: {
        name: 'BlockDAG',
        decimals: 18,
        chains: {
            ethereum: '0x2b6EDB94dF814a95103373Ffcad0e47f19EDb96F',
            bsc: '0x2b6EDB94dF814a95103373Ffcad0e47f19EDb96F',
        },
        sourceChains: ['ethereum', 'bsc'],
    },
    ROAM: {
        name: 'Roam',
        decimals: 18,
        chains: {
            bsc: '0x6A066a8bF5F76dBD15A304Ca5B1e1247320794EF',
        },
        sourceChains: ['solana'],
    },
    INFOFI: {
        name: 'InfoFi',
        decimals: 18,
        chains: {
            bsc: '0x1edA0E8FdC0999dfC96f96502c3658910c8A219a',
        },
        sourceChains: ['solana'],
    },
    BALL: {
        name: 'Ball',
        decimals: 18,
        chains: {
            ethereum: '0x014aC741D094651EbF952c340F8A72f131Edb71e',
        },
        sourceChains: ['solana'],
    },
    EDEN: {
        name: 'Eden',
        decimals: 18,
        chains: {
            base: '0xABe39a08075C44b56Ab7423c2AA1bab78f68bcdF',
        },
        sourceChains: ['solana'],
    },
    FASH: {
        name: 'FASH',
        decimals: 18,
        chains: {
            ethereum: '0x433b9580954818D27cD4BC89D3614Bb703562a69',
            optimism: '0xCEb971C173115Baf5076691cFDc9f72B727f6736',
        },
        sourceChains: ['ethereum', 'optimism'],
    },
    NEIRO: {
        name: 'Neiro',
        decimals: 9,
        chains: {
            ethereum: '0x4Bf5133e429A113F2d4d2bD20CcbEBa2A20fE2D4',
        },
        sourceChains: ['hyperevm'],
    },
    deJTRSY: {
        name: 'deJTRSY',
        decimals: 18,
        chains: {
            ethereum: '0xA1D871eB727eAf5408fAF927c3F80b3D8325B1aC',
        },
        sourceChains: ['solana'],
    },
    deJAAA: {
        name: 'deJAAA',
        decimals: 18,
        chains: {
            ethereum: '0x490b0d0eF365cB949B9E9f5656b9301048d2b474',
        },
        sourceChains: ['solana'],
    },
    UIUI: {
        name: 'UIUI',
        decimals: 18,
        chains: {
            ethereum: '0x2097370E6277F9159267098116dD1Cf620b25D3b',
            base: '0x2097370E6277F9159267098116dD1Cf620b25D3b',
        },
        sourceChains: ['ethereum', 'base'],
    },
    NEURON: {
        name: 'CerebrumDAO',
        decimals: 18,
        chains: {
            ethereum: '0x8461ADa5A8F4C7f6E165bFb7798452dDB4C419D4',
        },
        sourceChains: ['solana'],
    },
    SPACE: {
        name: 'Spacecoin',
        decimals: 18,
        chains: {
            ethereum: '0x24C7c7783e97387Fc72c2a834A0aeD7c50AA0a14',
            bsc: '0xCCEf0DE883B8E44277A938fB49B2DE8b83d5D00e',
        },
        sourceChains: ['ethereum', 'bsc', 'creditcoin'],
    },
};

// NTT Manager ABI
const NTT_MANAGER_ABI = [
    "function rateLimitDuration() view returns (uint64)",
    "function getOutboundLimitParams() view returns (tuple(uint64 limit, uint64 currentCapacity, uint64 lastTxTimestamp))",
    "function getCurrentOutboundCapacity() view returns (uint256)",
    "function getInboundLimitParams(uint16 chainId) view returns (tuple(uint64 limit, uint64 currentCapacity, uint64 lastTxTimestamp))",
    "function getCurrentInboundCapacity(uint16 chainId) view returns (uint256)",
    "function token() view returns (address)",
    "function tokenDecimals() view returns (uint8)",
];

// ============== Helper Functions ==============

// Safe BigInt to Number conversion - handles all edge cases
function toNumber(val) {
    if (val === null || val === undefined) return 0;
    if (typeof val === 'number') return val;
    if (typeof val === 'bigint') {
        // BigInt can't be directly converted if too large, but Number() works
        return Number(val);
    }
    // Handle ethers.js Result objects or other wrapped values
    if (val.toString) {
        return Number(val.toString());
    }
    return Number(String(val));
}

// Safe BigInt conversion - handles ethers v6 return values
function toBigInt(val) {
    if (val === null || val === undefined) return 0n;
    if (typeof val === 'bigint') return val;
    
    try {
        // Handle various input types
        if (typeof val === 'number') {
            return BigInt(Math.floor(val));
        }
        // Handle ethers.js Result objects or strings
        const str = val.toString ? val.toString() : String(val);
        // Remove decimals if any and convert
        return BigInt(str.split('.')[0]);
    } catch (e) {
        console.error('toBigInt error:', e, 'val:', val, 'type:', typeof val);
        return 0n;
    }
}

// Safe integer for use with string methods (padStart, etc.)
function toInt(val) {
    const num = toNumber(val);
    return Math.floor(num);
}

function formatAmount(amount, decimals = 18) {
    try {
        const amt = toBigInt(amount);
        // CRITICAL: decimals must be a plain Number for BigInt exponentiation and padStart
        const dec = toInt(decimals);
        
        if (dec <= 0) {
            // No decimals, just format the whole number
            const value = toNumber(amt);
            if (value >= 1e9) return `${(value / 1e9).toFixed(2)}B`;
            if (value >= 1e6) return `${(value / 1e6).toFixed(2)}M`;
            if (value >= 1e3) return `${(value / 1e3).toFixed(2)}K`;
            return value.toFixed(2);
        }
        
        const divisor = 10n ** BigInt(dec);
        const wholePart = amt / divisor;
        const fractionalPart = amt % divisor;
        
        // Convert to string first to avoid BigInt issues with padStart
        const fractionalStr = fractionalPart.toString().padStart(dec, '0').slice(0, 4);
        const wholeNum = Number(wholePart.toString());
        const fracNum = Number(fractionalStr) / 10000;
        const value = wholeNum + fracNum;
        
        if (value >= 1e9) return `${(value / 1e9).toFixed(2)}B`;
        if (value >= 1e6) return `${(value / 1e6).toFixed(2)}M`;
        if (value >= 1e3) return `${(value / 1e3).toFixed(2)}K`;
        return value.toFixed(2);
    } catch (e) {
        console.error('formatAmount error:', e, 'amount:', amount, 'decimals:', decimals);
        return '0';
    }
}

function getStatus(remaining, capacity) {
    try {
        const rem = toBigInt(remaining);
        const cap = toBigInt(capacity);
        if (cap === 0n) return { text: 'UNLIMITED', class: 'status-ok', percent: 100 };
        
        // Calculate percent using BigInt math, then convert result to Number
        const percentBigInt = (rem * 100n) / cap;
        let percent = Number(percentBigInt.toString());
        
        // Cap at 100% (can happen if remaining > capacity due to refill)
        if (percent > 100) percent = 100;
        
        if (percent <= 5) return { text: 'CRITICAL', class: 'status-critical', percent };
        if (percent <= 30) return { text: 'LOW', class: 'status-low', percent };
        return { text: 'OK', class: 'status-ok', percent };
    } catch (e) {
        console.error('getStatus error:', e);
        return { text: 'ERROR', class: 'status-low', percent: 0 };
    }
}

function formatDuration(seconds) {
    const secs = toInt(seconds);
    const hours = secs / 3600;
    if (hours >= 24) return `${(hours / 24).toFixed(1)} days`;
    return `${hours.toFixed(1)} hours`;
}

// ============== Main Logic ==============

class NTTRateChecker {
    constructor() {
        this.tokenSelect = document.getElementById('tokenPreset');
        this.chainSelect = document.getElementById('chainSelect');
        this.customAddressDiv = document.getElementById('customAddressDiv');
        this.customAddressInput = document.getElementById('customAddress');
        this.checkBtn = document.getElementById('checkBtn');
        this.loadingDiv = document.getElementById('loadingDiv');
        this.resultsDiv = document.getElementById('resultsDiv');
        this.errorDiv = document.getElementById('errorDiv');
        
        this.setupEventListeners();
    }
    
    setupEventListeners() {
        this.tokenSelect.addEventListener('change', () => {
            if (this.tokenSelect.value === 'custom') {
                this.customAddressDiv.classList.remove('hidden');
            } else {
                this.customAddressDiv.classList.add('hidden');
            }
        });
        
        this.checkBtn.addEventListener('click', () => this.checkRateLimits());
    }
    
    showError(msg) {
        this.loadingDiv.classList.add('hidden');
        this.resultsDiv.classList.add('hidden');
        this.errorDiv.classList.remove('hidden');
        document.getElementById('errorMsg').textContent = msg;
    }
    
    showLoading() {
        this.loadingDiv.classList.remove('hidden');
        this.resultsDiv.classList.add('hidden');
        this.errorDiv.classList.add('hidden');
    }
    
    showResults() {
        this.loadingDiv.classList.add('hidden');
        this.resultsDiv.classList.remove('hidden');
        this.errorDiv.classList.add('hidden');
    }
    
    async checkRateLimits() {
        const tokenKey = this.tokenSelect.value;
        const chain = this.chainSelect.value;
        
        if (!tokenKey) {
            this.showError('Please select a token');
            return;
        }
        
        if (!RPC_URLS[chain]) {
            this.showError(`RPC not configured for ${chain}`);
            return;
        }
        
        let contractAddress;
        let tokenConfig;
        
        if (tokenKey === 'custom') {
            contractAddress = this.customAddressInput.value.trim();
            if (!contractAddress || !contractAddress.startsWith('0x')) {
                this.showError('Please enter a valid contract address');
                return;
            }
            tokenConfig = {
                name: 'Custom Token',
                decimals: 18,
                sourceChains: Object.keys(WORMHOLE_CHAIN_IDS).filter(c => c !== chain),
            };
        } else {
            tokenConfig = TOKEN_PRESETS[tokenKey];
            contractAddress = tokenConfig?.chains?.[chain];
            
            if (!contractAddress) {
                this.showError(`${tokenKey} not configured for ${CHAIN_NAMES[chain]}`);
                return;
            }
        }
        
        this.showLoading();
        
        try {
            const provider = new ethers.JsonRpcProvider(RPC_URLS[chain]);
            const contract = new ethers.Contract(contractAddress, NTT_MANAGER_ABI, provider);
            
            // Get token decimals - MUST be integer
            let decimals = toInt(tokenConfig.decimals) || 18;
            try {
                const d = await contract.tokenDecimals();
                decimals = toInt(d);
                console.log('Token decimals:', decimals);
            } catch (e) {
                console.log('Using default decimals:', decimals);
            }
            
            // Get rate limit duration
            let durationSec = 86400; // Default 24h
            try {
                const d = await contract.rateLimitDuration();
                durationSec = toInt(d); // Must be integer for later BigInt division
                console.log('Duration:', durationSec, 'seconds');
            } catch (e) {
                console.log('Using default duration:', e.message);
            }
            
            // Get outbound capacity
            let outboundCapacity = 'UNLIMITED';
            try {
                const outboundParams = await contract.getOutboundLimitParams();
                console.log('Outbound params:', outboundParams);
                const limit = toBigInt(outboundParams[0]);
                if (limit > 0n) {
                    const currentOutbound = await contract.getCurrentOutboundCapacity();
                    outboundCapacity = formatAmount(currentOutbound, toInt(decimals));
                }
            } catch (e) {
                console.log('Outbound unlimited or error:', e.message);
            }
            
            // Get inbound capacities for each source chain
            const inboundResults = [];
            const debugInfo = [];
            
            for (const sourceChain of tokenConfig.sourceChains) {
                if (sourceChain === chain) continue;
                
                const sourceChainId = WORMHOLE_CHAIN_IDS[sourceChain];
                if (!sourceChainId) {
                    debugInfo.push(`${sourceChain}: No chain ID`);
                    continue;
                }
                
                try {
                    console.log(`[${sourceChain}] Fetching inbound for chain ID ${sourceChainId}...`);
                    
                    // Get rate limit params and current capacity
                    const inboundParams = await contract.getInboundLimitParams(sourceChainId);
                    const currentInbound = await contract.getCurrentInboundCapacity(sourceChainId);
                    
                    // Extract trimmed limit (uint64, 8 decimals max precision)
                    const limitTrimmed = toBigInt(inboundParams[0]);
                    
                    // Skip if limit is 0 (not configured)
                    if (limitTrimmed === 0n) {
                        debugInfo.push(`${sourceChain} (ID:${sourceChainId}): limit=0`);
                        continue;
                    }
                    
                    // NTT uses "trimmed" amounts - values are scaled down to fit uint64
                    // For tokens with >8 decimals, we need to scale up the limit
                    // Trimming factor = 10^(decimals - 8) for decimals > 8
                    const TRIMMED_DECIMALS = 8;
                    let limit = limitTrimmed;
                    if (decimals > TRIMMED_DECIMALS) {
                        const scaleFactor = 10n ** BigInt(decimals - TRIMMED_DECIMALS);
                        limit = limitTrimmed * scaleFactor;
                    }
                    
                    // Current capacity is already in full token decimals
                    const remaining = toBigInt(currentInbound);
                    
                    console.log(`[${sourceChain}] limitTrimmed=${limitTrimmed}, limit(scaled)=${limit}, remaining=${remaining}`);
                    
                    // Calculate refill rate per hour (also need to scale)
                    const durationBigInt = BigInt(durationSec > 0 ? durationSec : 86400);
                    const refillPerHour = (limit * 3600n) / durationBigInt;
                    
                    // Calculate used amount (can't be negative)
                    const used = limit > remaining ? limit - remaining : 0n;
                    
                    inboundResults.push({
                        chain: sourceChain,
                        chainName: CHAIN_NAMES[sourceChain] || sourceChain,
                        remaining: remaining,
                        used: used,
                        capacity: limit,
                        status: getStatus(remaining, limit),
                        refillPerHour: refillPerHour,
                        decimals: toInt(decimals),
                    });
                    
                } catch (e) {
                    console.error(`[${sourceChain}] ERROR:`, e);
                    debugInfo.push(`${sourceChain} (ID:${sourceChainId}): ${e.message?.slice(0, 60) || 'error'}`);
                }
            }
            
            // Update UI
            document.getElementById('tokenSymbol').textContent = tokenKey === 'custom' ? 'Token' : tokenKey;
            document.getElementById('chainName').textContent = CHAIN_NAMES[chain];
            document.getElementById('contractAddr').textContent = contractAddress;
            document.getElementById('outboundCapacity').textContent = outboundCapacity;
            document.getElementById('duration').textContent = `${toInt(durationSec)}s (${formatDuration(durationSec)})`;
            
            // Render inbound results
            const inboundDiv = document.getElementById('inboundResults');
            if (inboundResults.length === 0) {
                const debugHtml = debugInfo.length > 0 
                    ? `<p class="text-gray-600 text-sm mt-2">Debug: ${debugInfo.join(' | ')}</p>` 
                    : '';
                inboundDiv.innerHTML = `<p class="text-gray-500">No inbound rate limits configured</p>${debugHtml}`;
            } else {
                inboundDiv.innerHTML = inboundResults.map(r => {
                    const dec = toInt(r.decimals);
                    return `
                    <div class="bg-gray-800/50 rounded-lg p-4 border border-gray-700">
                        <div class="flex justify-between items-center mb-2">
                            <span class="font-semibold text-white">From: ${r.chainName}</span>
                            <span class="${r.status.class} font-bold">${r.status.text}</span>
                        </div>
                        <div class="text-center my-4">
                            <p class="text-gray-400 text-sm">Remaining Capacity:</p>
                            <p class="text-2xl font-bold ${r.status.class}">${formatAmount(r.remaining, dec)}</p>
                        </div>
                        <div class="text-sm text-gray-400 space-y-1">
                            <p>Used: ${formatAmount(r.used, dec)} | ${r.status.percent}% remaining</p>
                            <p>Max: ${formatAmount(r.capacity, dec)} | Refill: ~${formatAmount(r.refillPerHour, dec)}/hr</p>
                        </div>
                    </div>
                `}).join('');
            }
            
            // Calculate overall refill rate
            let totalRefillPerHour = 0n;
            for (const r of inboundResults) {
                totalRefillPerHour = totalRefillPerHour + toBigInt(r.refillPerHour);
            }
            const refillRateOverall = totalRefillPerHour > 0n 
                ? formatAmount(totalRefillPerHour, toInt(decimals))
                : 'N/A';
            document.getElementById('refillRate').textContent = `~${refillRateOverall}/hour`;
            
            this.showResults();
            
        } catch (error) {
            console.error('Error:', error);
            this.showError(`Failed to fetch rate limits: ${error.message}`);
        }
    }
}

// Initialize on load
document.addEventListener('DOMContentLoaded', () => {
    new NTTRateChecker();
});
