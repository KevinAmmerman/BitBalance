export interface BitcoinPrice {
    [key: string]: number; 
}


// export interface BitcoinTimestampsAndPrices {
//     [key: string]: [time: number, price: number]; 
// }

export interface BitcoinTimestampsAndPrices {
    EUR: any;
    time: number; 
    price: number; 
}