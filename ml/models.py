import json
import base64
from typing import Any
import boto3

from botocore.exceptions import ClientError


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