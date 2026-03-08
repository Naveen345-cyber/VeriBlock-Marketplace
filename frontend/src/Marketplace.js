import React, { useState } from 'react';
import axios from 'axios';
import { Upload, CheckCircle, Database, ShieldCheck, ShoppingCart, Download, ExternalLink } from 'lucide-react';

const Marketplace = () => {
    // --- STATE MANAGEMENT ---
    const [file, setFile] = useState(null);
    const [loading, setLoading] = useState(false);
    const [txData, setTxData] = useState(null);
    const [purchasedIds, setPurchasedIds] = useState([]);
    
    // Initial demo data for the Marketplace Feed
    const [listings, setListings] = useState([
        { id: 'demo-1', name: "Ludhiana Mall Traffic Data", price: "12.5", cid: "QmXoyp..." }
    ]);

    // --- SELLER LOGIC: UPLOAD TO BLOCKCHAIN ---
    const handleUpload = async () => {
        if (!file) return alert("Please select the Mall Data file first!");
        setLoading(true);

        const formData = new FormData();
        formData.append('file', file);
        formData.append('price', 15.0); // Default demo price

        try {
            // Hits your working Spring Boot backend
            const res = await axios.post('http://localhost:8080/api/marketplace/upload', formData);
            setTxData(res.data);
            
            // Add the real uploaded data to the Buyer Feed
            setListings([
                { 
                    id: res.data.transactionHash, 
                    name: file.name, 
                    price: "15.0", 
                    cid: res.data.ipfsHash 
                },
                ...listings
            ]);
        } catch (err) {
            alert("Blockchain Error: Ensure Spring Boot & Ganache are active!");
        } finally {
            setLoading(false);
        }
    };

    // --- BUYER LOGIC: STABLECOIN PURCHASE ---
    const handleBuy = (id) => {
        // Simulates the ERC20 'transferFrom' interaction
        alert("Processing VeriINR Stablecoin Payment...");
        
        setTimeout(() => {
            setPurchasedIds([...purchasedIds, id]);
            alert("Transaction Confirmed! Access to CID granted via Smart Contract.");
        }, 1500);
    };
    const copyToClipboard = (text, label) => {
    navigator.clipboard.writeText(text);
    alert(`${label} copied to clipboard!`);
};


    return (
        <div className="min-h-screen bg-[#0f172a] text-white flex flex-col items-center py-12 px-4 gap-12">
            {/* Background Aesthetic Blur */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0 pointer-events-none">
                <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-blue-500/10 blur-[120px] rounded-full"></div>
                <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-emerald-500/10 blur-[120px] rounded-full"></div>
            </div>

            {/* --- SELLER SECTION --- */}
            <div className="relative z-10 w-full max-w-lg bg-white/5 backdrop-blur-xl border border-white/10 p-8 rounded-3xl shadow-2xl">
                <div className="flex items-center gap-3 mb-8">
                    <div className="p-2 bg-blue-600 rounded-lg"><Database size={24} /></div>
                    <div>
                        <h2 className="text-2xl font-bold tracking-tight">VeriBlock <span className="text-blue-400 font-extrabold">PRO</span></h2>
                        <p className="text-[10px] text-slate-400 uppercase tracking-widest font-bold">Seller Portal</p>
                    </div>
                </div>

                {!txData ? (
                    <div className="space-y-6">
                        <div className="relative border-2 border-dashed border-slate-700 rounded-2xl p-10 text-center hover:border-blue-500 transition-all group cursor-pointer bg-black/20">
                            <input type="file" className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" onChange={(e) => setFile(e.target.files[0])}/>
                            <Upload className="mx-auto mb-4 text-slate-500 group-hover:text-blue-400" size={40} />
                            <p className="text-slate-300 font-medium">{file ? file.name : "Select Mall Data CSV"}</p>
                            <p className="text-[10px] text-slate-500 mt-2 italic text-blue-200">Format: Mall_Traffic_March2026.csv</p>
                        </div>
                        <button onClick={handleUpload} disabled={loading} className="w-full py-4 rounded-xl font-bold bg-blue-600 hover:bg-blue-500 shadow-lg shadow-blue-600/30 transition-all flex justify-center items-center gap-2">
                            {loading ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div> : "🚀 Deploy to Blockchain"}
                        </button>
                    </div>
                ) : (
                    <div className="space-y-6 animate-in fade-in zoom-in duration-500">
                        <div className="bg-emerald-500/10 border border-emerald-500/30 p-6 rounded-2xl text-center">
                            <CheckCircle className="mx-auto mb-3 text-emerald-400" size={48} />
                            <h3 className="text-emerald-400 font-bold text-xl">On-Chain Listing Successful</h3>
                            <p className="text-[10px] text-slate-400 mt-1 uppercase">Block Mined on Ganache</p>
                        </div>
                        
                        {/* Transaction Hash with Copy Button */}
                        <div className="p-4 bg-black/30 rounded-xl border border-white/5">
                            <p className="text-[9px] text-slate-500 uppercase font-black mb-1">Transaction Hash</p>
                            <div className="flex items-center justify-between gap-2">
                                <p className="text-[11px] font-mono text-blue-300 truncate">{txData.transactionHash}</p>
                                <button 
                                    onClick={() => copyToClipboard(txData.transactionHash, "Transaction Hash")}
                                    className="px-2 py-1 bg-blue-600/20 hover:bg-blue-600/40 border border-blue-500/30 rounded text-[9px] font-bold uppercase transition-all"
                                >
                                    Copy
                                </button>
                            </div>
                        </div>

                        {/* IPFS CID with Copy Button */}
                        <div className="p-4 bg-black/30 rounded-xl border border-white/5">
                            <p className="text-[9px] text-slate-500 uppercase font-black mb-1">IPFS Storage CID</p>
                            <div className="flex items-center justify-between gap-2">
                                <p className="text-[11px] font-mono text-emerald-300 truncate">{txData.ipfsHash}</p>
                                <button 
                                    onClick={() => copyToClipboard(txData.ipfsHash, "IPFS CID")}
                                    className="px-2 py-1 bg-emerald-600/20 hover:bg-emerald-600/40 border border-emerald-500/30 rounded text-[9px] font-bold uppercase transition-all"
                                >
                                    Copy
                                </button>
                            </div>
                        </div>

                        <button onClick={() => setTxData(null)} className="w-full py-2 text-slate-400 text-xs hover:text-white transition-colors underline">Upload Next Dataset</button>
                    </div>
                )}
            </div>

            {/* --- BUYER SECTION --- */}
            <div className="relative z-10 w-full max-w-5xl bg-white/5 backdrop-blur-xl border border-white/10 p-8 rounded-3xl shadow-2xl">
                <div className="flex justify-between items-center mb-8">
                    <div className="flex items-center gap-3">
                        <ShoppingCart className="text-emerald-400" size={24} />
                        <h3 className="text-xl font-bold">Decentralized Marketplace Feed</h3>
                    </div>
                    <div className="flex items-center gap-2 bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/20">
                        <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
                        <span className="text-[10px] text-emerald-400 font-bold uppercase">Network: Ganache (7545)</span>
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="border-b border-white/10 text-slate-500 text-[11px] uppercase tracking-widest">
                                <th className="pb-4">Dataset</th>
                                <th className="pb-4">Price (V-INR)</th>
                                <th className="pb-4">Storage (CID)</th>
                                <th className="pb-4 text-right">Verification</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                            {listings.map((item) => (
                                <tr key={item.id} className="text-sm group hover:bg-white/[0.02] transition-colors">
                                    <td className="py-4 font-semibold text-slate-200">{item.name}</td>
                                    <td className="py-4 text-emerald-400 font-bold">{item.price} <span className="text-[10px]">V-INR</span></td>
                                    <td className="py-4 font-mono text-slate-500 text-[10px] max-w-[150px] truncate">{item.cid}</td>
                                    <td className="py-4 text-right">
                                        {purchasedIds.includes(item.id) ? (
                                            <a 
                                                href={`https://ipfs.io/ipfs/${item.cid}`} 
                                                target="_blank" rel="noreferrer"
                                                className="bg-emerald-600 hover:bg-emerald-500 px-4 py-2 rounded-lg text-xs font-bold text-white no-underline flex items-center gap-2 float-right"
                                            >
                                                <Download size={14} /> Download File
                                            </a>
                                        ) : (
                                            <button 
                                                onClick={() => handleBuy(item.id)}
                                                className="bg-white/10 hover:bg-blue-600 px-5 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-2 float-right border border-white/10 hover:border-blue-400"
                                            >
                                                <ExternalLink size={14} /> Buy Access
                                            </button>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                <div className="mt-8 pt-6 border-t border-white/5 flex justify-end gap-6 opacity-40">
                    <div className="flex items-center gap-1 text-[10px] font-bold"><ShieldCheck size={12} /> VERI-INR SECURED</div>
                    <div className="flex items-center gap-1 text-[10px] font-bold uppercase tracking-tighter"><ExternalLink size={12} /> IPFS PROTECTED</div>
                </div>
            </div>
        </div>
    );
};

export default Marketplace;