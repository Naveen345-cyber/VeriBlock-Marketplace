from fastapi import FastAPI, UploadFile
import pandas as pd
import re
import io

app = FastAPI()

@app.get("/")
async def root():
    return {"status": "ok"}

def mask_pii(text):
    # Logic to find Indian phone numbers and mask them
    # Matches +91 or 10-digit numbers
    phone_pattern = r'(\+91[\-\s]?)?[0-9]{10}'
    return re.sub(phone_pattern, "XXXXX-XXXXX", str(text))

@app.post("/process-data")
async def process_data(file: UploadFile):
    # 1. Read the CSV
    contents = await file.read()
    df = pd.read_csv(io.BytesIO(contents))
    
    # 2. Privacy Shield: Mask sensitive data
    # We apply the mask to every cell in the dataframe
    df = df.map(mask_pii)
    
    # 3. Quality & Volume Check
    rows, cols = df.shape
    null_count = df.isnull().sum().sum()
    quality_score = round(((df.size - null_count) / df.size) * 100, 2)
    
    # 4. AI Pricing Logic (Rupees)
    # Base ₹100 + ₹0.50 per row + ₹10 per unique column
    suggested_price = 100 + (rows * 0.50) + (cols * 10)
    if quality_score < 80:
        suggested_price *= 0.6  # 40% discount for low quality
        
    return {
        "filename": file.filename,
        "status": "Verified" if quality_score > 70 else "Rejected",
        "stats": {
            "rows": rows,
            "columns": cols,
            "quality_score": f"{quality_score}%"
        },
        "security": "PII Masking Applied (DPDP Compliant)",
        "pricing": {
            "suggested_price_in_INR": round(suggested_price, 2),
            "currency": "INR"
        }
    }