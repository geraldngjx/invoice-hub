import json
import base64
import boto3

from botocore.exceptions import ClientError

from models import ParserModel

model = ParserModel()

def lambda_handler(event, context):
    try:
        body = event['body']
        body = json.loads(body)
        img_bytes_str = body['image']

        out = model(img_bytes_str)

        lambda_response = {
            'statusCode': 200,
            'body': out
        }
    except ClientError as err:
        error_message = "Couldn't analyze image. " + \
            err.response['Error']['Message']

        lambda_response = {
            'statusCode': 400,
            'body': {
                "Error": err.response['Error']['Code'],
                "ErrorMessage": error_message
            }
        }

    except ValueError as val_error:
        lambda_response = {
            'statusCode': 400,
            'body': {
                "Error": "ValueError",
                "ErrorMessage": format(val_error)
            }
        }

    return lambda_response
