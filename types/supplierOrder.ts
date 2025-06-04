interface SupplierOrder {
    id: string;
    supplierid: string;
    purchaseDate: Date;
    products: Array<{
        productid: string;
        purchasePrice: number;
        purchaseStock: number;
    }>;
    paymentmethod: string;
    advancedpayment: number;
    totalamount: number;
    duepayment: number;
    status: string;
}
