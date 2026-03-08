package com.veriblock.marketplace.services;

import org.web3j.crypto.Credentials;
import org.web3j.protocol.Web3j;
import org.web3j.protocol.core.methods.response.TransactionReceipt;
import org.web3j.protocol.http.HttpService;
import org.web3j.tx.gas.DefaultGasProvider;
import org.web3j.tx.gas.StaticGasProvider;
import org.web3j.tx.RawTransactionManager;
import org.web3j.tx.TransactionManager;
import org.web3j.abi.FunctionEncoder;
import org.web3j.abi.datatypes.Address;
import org.web3j.abi.datatypes.Function;
import org.web3j.abi.datatypes.generated.Uint256;
import org.springframework.stereotype.Service;
import java.math.BigInteger;
import java.util.Arrays;
import java.util.Collections;
import java.util.Map;

import com.veriblock.marketplace.contracts.DataMarketplace;

@Service
public class BlockchainService {

    private final Web3j web3j = Web3j.build(new HttpService("http://127.0.0.1:7545"));
    
    // Updated with your latest HP 15s Ganache Key
    private final String privateKey = "0x1205916ac4bc3350313026f1900dfaaf108d0c888202fe5eb3658744ceb2670d"; 
    private final Credentials credentials = Credentials.create(privateKey);
    private final TransactionManager txManager = new RawTransactionManager(web3j, credentials);

    private final String STABLECOIN_ADDRESS = "0xd91889673FBFC25dcE87A95eA4c7a0d4DD57A01b";
    private final String MARKETPLACE_ADDRESS = "0x4E01A56e94Ab6AFa069aaa36dDDE1b5f5a615175";

    private final BigInteger CUSTOM_GAS_LIMIT = BigInteger.valueOf(6000000);
    private final StaticGasProvider gasProvider = new StaticGasProvider(DefaultGasProvider.GAS_PRICE, CUSTOM_GAS_LIMIT);

    // FIXED: Renamed to match MarketplaceController call
    public Map<String, String> uploadToBlockchain(String ipfsCid, double priceInINR) throws Exception {
        
        BigInteger amount = BigInteger.valueOf((long) (priceInINR * 1e18));

        // --- STEP 1: ENCODE & SEND APPROVAL ---
        Function approveFunc = new Function(
                "approve",
                Arrays.asList(new Address(MARKETPLACE_ADDRESS), new Uint256(amount)),
                Collections.emptyList());
        
        String encodedApprove = FunctionEncoder.encode(approveFunc);
        
        System.out.println("Step 1: Sending Approval to Stablecoin...");
        txManager.sendTransaction(
                DefaultGasProvider.GAS_PRICE,
                CUSTOM_GAS_LIMIT,
                STABLECOIN_ADDRESS,
                encodedApprove,
                BigInteger.ZERO);

        // --- STEP 2: LIST ON MARKETPLACE ---
        DataMarketplace marketplace = DataMarketplace.load(
                MARKETPLACE_ADDRESS, web3j, credentials, gasProvider);
        
        System.out.println("Step 2: Listing Mall Data on Marketplace for CID: " + ipfsCid);
        TransactionReceipt listReceipt = marketplace.listData(ipfsCid, amount).send();

        // FIXED: Return Map to satisfy Controller's bcResult.get("transactionHash")
        return Map.of(
            "transactionHash", listReceipt.getTransactionHash(),
            "status", "SUCCESS"
        );
    }
}