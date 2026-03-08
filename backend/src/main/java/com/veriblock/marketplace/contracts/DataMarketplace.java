package com.veriblock.marketplace.contracts;

import org.web3j.abi.TypeReference;
import org.web3j.abi.datatypes.Function;
import org.web3j.abi.datatypes.Type;
import org.web3j.crypto.Credentials;
import org.web3j.protocol.Web3j;
import org.web3j.protocol.core.RemoteFunctionCall;
import org.web3j.protocol.core.methods.response.TransactionReceipt;
import org.web3j.tx.Contract;
import org.web3j.tx.gas.ContractGasProvider;

import java.util.Arrays;
import java.util.Collections;


public class DataMarketplace extends Contract {
    
    // Copy the hex string from your .bin file and paste it between the quotes here
    public static final String BINARY = "PASTE_YOUR_BIN_HEX_HERE";

    protected DataMarketplace(String contractAddress, Web3j web3j, Credentials credentials, ContractGasProvider gasProvider) {
        super(BINARY, contractAddress, web3j, credentials, gasProvider);
    }

    @SuppressWarnings("rawtypes")
    public RemoteFunctionCall<TransactionReceipt> listData(String _hash, java.math.BigInteger _price) {
        final Function function = new Function(
                "listData", 
                Arrays.<Type>asList(
                    new org.web3j.abi.datatypes.Utf8String(_hash), 
                    new org.web3j.abi.datatypes.generated.Uint256(_price)
                ), 
                Collections.<TypeReference<?>>emptyList()
        );
        return executeRemoteCallTransaction(function);
    }

    public static DataMarketplace load(String contractAddress, Web3j web3j, Credentials credentials, ContractGasProvider gasProvider) {
        return new DataMarketplace(contractAddress, web3j, credentials, gasProvider);
    }
}