import Image from "next/image";
import TransactionImg from "@/public/assets/3d-render-money-transfer-mobile-banking-online.jpg";
import InventoryImg from "@/public/assets/rag-doll-checking-wheelbarrow.jpg";
import ReportImg from "@/public/assets/Chart or graphs on sheet of paper 3D illustration.jpg";
import { FaBolt, FaBoxOpen, FaChartBar } from 'react-icons/fa'; // More relevant icons

const Features = () => {
    return (
        <section id="features" className="py-16 bg-soft">
            <div className="max-w-6xl mx-auto px-6 md:px-12 lg:px-16">
                <div className="text-center mb-12">
                    <h2 className="text-3xl md:text-4xl font-bold text-primary mb-4">
                        Unlock Powerful <span className="text-accent">Features</span>
                    </h2>
                    <p className="text-lg text-secondary">Elevate your business operations with our advanced POS system.</p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    <div className="bg-white rounded-xl shadow-md overflow-hidden transition-transform duration-300 hover:scale-105">
                        <div className="relative h-60 md:h-72">
                            <Image
                                src={TransactionImg}
                                alt="Fast transactions"
                                layout="fill"
                                objectFit="cover"
                                className="rounded-t-xl"
                            />
                        </div>
                        <div className="p-6">
                            <div className="flex items-center justify-center h-10 w-10 rounded-full bg-accent/20 text-accent mb-4 mx-auto">
                                <FaBolt className="text-xl" />
                            </div>
                            <h3 className="text-xl font-semibold text-primary mb-2 text-center">Lightning-Fast Transactions</h3>
                            <p className="text-secondary text-center">Process sales quickly and securely, keeping your customers happy.</p>
                        </div>
                    </div>

                    <div className="bg-white rounded-xl shadow-md overflow-hidden transition-transform duration-300 hover:scale-105">
                        <div className="relative h-60 md:h-72">
                            <Image
                                src={InventoryImg}
                                alt="Inventory management"
                                layout="fill"
                                objectFit="cover"
                                className="rounded-t-xl"
                            />
                        </div>
                        <div className="p-6">
                            <div className="flex items-center justify-center h-10 w-10 rounded-full bg-accent/20 text-accent mb-4 mx-auto">
                                <FaBoxOpen className="text-xl" />
                            </div>
                            <h3 className="text-xl font-semibold text-primary mb-2 text-center">Effortless Inventory Control</h3>
                            <p className="text-secondary text-center">Manage your stock levels efficiently and prevent shortages or overstocking.</p>
                        </div>
                    </div>

                    <div className="bg-white rounded-xl shadow-md overflow-hidden transition-transform duration-300 hover:scale-105">
                        <div className="relative h-60 md:h-72">
                            <Image
                                src={ReportImg}
                                alt="Analytics reports"
                                layout="fill"
                                objectFit="cover"
                                className="rounded-t-xl"
                            />
                        </div>
                        <div className="p-6">
                            <div className="flex items-center justify-center h-10 w-10 rounded-full bg-accent/20 text-accent mb-4 mx-auto">
                                <FaChartBar className="text-xl" />
                            </div>
                            <h3 className="text-xl font-semibold text-primary mb-2 text-center">Insightful Analytics & Reports</h3>
                            <p className="text-secondary text-center">Gain valuable insights into your sales trends and business performance.</p>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Features;