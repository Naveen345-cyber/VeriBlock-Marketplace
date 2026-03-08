package com.veriblock.marketplace.controllers;

import com.veriblock.marketplace.services.BlockchainService;
import com.veriblock.marketplace.services.IpfsService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/marketplace")
@CrossOrigin(origins = "*") 
public class MarketplaceController {

    @Autowired
    private IpfsService ipfsService;

    @Autowired
    private BlockchainService blockchainService;

    @PostMapping("/upload")
    public ResponseEntity<?> uploadData(
            @RequestParam("file") MultipartFile file,
            @RequestParam("price") double price) {
        try {
            // 1. Upload to IPFS
            String ipfsHash = ipfsService.saveToIpfs(file.getBytes());
            
            // 2. CALLING SERVICE: String and double
            Map<String, String> bcResult = blockchainService.uploadToBlockchain(ipfsHash, price);

            Map<String, String> response = new HashMap<>();
            response.put("ipfsHash", ipfsHash);
            response.put("transactionHash", bcResult.get("transactionHash"));
            response.put("status", "Success");

            return ResponseEntity.ok(response);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(500).body("Error: " + e.getMessage());
        }
    }
}