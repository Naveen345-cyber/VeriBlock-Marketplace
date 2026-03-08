package com.veriblock.marketplace;

import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import org.springframework.http.*;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import org.springframework.web.multipart.MultipartFile;

@Service
public class AiService {
    // Port 8000 is where your uvicorn app.py is running
    private final String AI_URL = "http://127.0.0.1:8000/process-data";

    public String analyzeData(MultipartFile file) {
        try {
            RestTemplate restTemplate = new RestTemplate();
            
            // Prepare the file as a 'multipart' request
            MultiValueMap<String, Object> body = new LinkedMultiValueMap<>();
            body.add("file", file.getResource());

            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.MULTIPART_FORM_DATA);

            HttpEntity<MultiValueMap<String, Object>> requestEntity = new HttpEntity<>(body, headers);

            // Execute the call to Python and get the Price/Quality results
            return restTemplate.postForObject(AI_URL, requestEntity, String.class);
        } catch (Exception e) {
            return "AI Connection Error: " + e.getMessage();
        }
    }
}
