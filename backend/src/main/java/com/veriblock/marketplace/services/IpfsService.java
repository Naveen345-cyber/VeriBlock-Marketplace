package com.veriblock.marketplace.services;

import io.ipfs.api.IPFS;
import io.ipfs.api.MerkleNode;
import io.ipfs.api.NamedStreamable;
import org.springframework.stereotype.Service;
import java.io.IOException;

@Service
public class IpfsService {

    private final IPFS ipfs = new IPFS("/ip4/127.0.0.1/tcp/5002");

    public String saveToIpfs(byte[] fileData) throws IOException {
        try {
            NamedStreamable.ByteArrayWrapper streamable = new NamedStreamable.ByteArrayWrapper(fileData);
            MerkleNode node = ipfs.add(streamable).get(0);
            return node.hash.toBase58();
        } catch (Exception e) {
            throw new IOException("IPFS Daemon error: " + e.getMessage());
        }
    }
}