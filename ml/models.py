import base64
import boto3
import json
import os
import openai

from botocore.exceptions import ClientError
from pydantic import BaseModel, Field
from typing import Optional


class OCRModel:
    """
    This class is responsible for the OCR model.
    """

    def __init__(self) -> None:
        self.textract_client = boto3.client('textract')


    def __call__(self, image: str) -> str:
        """
        This is the main method of the class. It analyzes the image and returns the text.

        Parameters:
            image (str): The image to be analyzed in base64 raw string format.

        Returns:
            str: The text from the image.
        """
            
        blocks = self.analyze_image(image)
        text = self.reconstruct_text(blocks)

        return text
    

    def analyze_image(self, image: str) -> list:
        """
        This method analyzes the image and returns the response from AWS Textract.

        Parameters:
            image (str): The image to be analyzed in base64 raw string format.

        Returns:
            list: The response from AWS Textract as a list of blocks
        """

        img_bytes = image.encode('utf-8')  # because it is sent as raw stirng

        img_b64decoded = base64.b64decode(img_bytes)

        # Analyze the document
        response = self.textract_client.detect_document_text(Document={'Bytes': img_b64decoded})
        blocks = response['Blocks'] # list of blocks (dicts)

        return blocks
    
    
    def reconstruct_text(self, blocks: list) -> str:
        """
        This method reconstructs the text from the blocks.

        Parameters:
            blocks (list): The list of blocks from AWS Textract.

        Returns:
            str: The reconstructed text.
        """

        items = {}

        for item in blocks:
            if item['BlockType'] != "LINE":
                continue
            top = item['Geometry']['BoundingBox']['Top']
            nearest_top = None
            for grouped_top in items.keys():
                if abs(top - grouped_top) <= 0.01: # 1% of the image height
                    nearest_top = grouped_top
                    break
            if nearest_top is not None:
                items[nearest_top].append(item)
            else:
                items[top] = [item]

        for top, item in items.items():
            items[top] = sorted(item, key=lambda x: x['Geometry']['BoundingBox']['Left'])

        sorted_text = []
        for top, item in sorted(items.items()):
            line_text = ' '.join([word['Text'] for word in item])
            sorted_text.append(line_text)

        return '\n'.join(sorted_text)
    

class Item(BaseModel):
    """
    The details of an item involved in a transaction
    """
    item_description: str = Field(..., description="The description of the item involved in the transaction")
    item_quantity: Optional[str] = Field(..., description="The quantity of the item involved in the transaction")
    item_price: str = Field(..., description="The price of the item involved in the transaction")
    item_total: str = Field(..., description="The total price of the item involved in the transaction")
    tax_amount: Optional[str] = Field(..., description="The amount of tax due on the item involved in the transaction")

class InvoiceDetails(BaseModel):
    """
    The core details of an invoice
    """
    bill_from: Optional[str] = Field(..., description="The name of the company sending the invoice")
    bill_to: Optional[str] = Field(..., description="The name of the company receiving the invoice")
    invoice_date: str = Field(..., description="The date the invoice was issued")
    invoice_number: Optional[str] = Field(..., description="The invoice number")
    transaction_description: str = Field(..., description="A short summarised description of the transaction")
    amount_due: str = Field(..., description="The amount due on the invoice")
    tax_amount: Optional[str] = Field(..., description="The amount of tax due on the invoice")
    grand_total: str = Field(..., description="The total amount due on the invoice that includes tax and any tips")
    items : list[Item] = Field(..., description="The list of items involved in the transaction")

class ParserModel:

    def __init__(self) -> dict:
        self.ocr_model = OCRModel()
        openai.api_key = os.environ['OPENAI_API_KEY']

    def __call__(self, image: str) -> str:
        """
        This is the main method of the class. It analyzes the image and returns the details as a structured json.

        Parameters:
            image (str): The image to be analyzed in base64 raw string format.

        Returns:
            dict: The details of the invoice as a structured json.
        """
            
        text = self.ocr_model(image)

        SYSTEM_PROMPT = "Assistant is an invoice and receipt parser. Assistant's job is to look at the extracted text from an invoice or a receipt and output the key details of the invoice. Assistant NEVER makes up details and returns '' when unsure."

        messages = [
            {"role": "system", "content": SYSTEM_PROMPT},
            {"role": "user",  "content": "Details:\n"+ text},
        ]

        functions = [
            {
                "name": "get_invoice_details",
                "description": "Get the details of an invoice",
                "parameters":  InvoiceDetails.schema(),
                "required" : ["invoice_date", "amount_due", "grand_total", "transaction_description", "items"],
            }
        ]

        ans = self.get_answer(messages, functions, "get_invoice_details")

        return json.loads(ans)


    def get_answer(self, messages: list, functions: list, name: str):
        res = openai.ChatCompletion.create(
                    model="gpt-3.5-turbo-0613", 
                    messages=messages,
                    temperature=0,
                    functions = functions,
                    function_call={"name": name}

        )
        return res.choices[0]['message']['function_call']['arguments']