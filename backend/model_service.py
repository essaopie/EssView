from ValidRoad import ValidRoad
import numpy as np
import matplotlib
import base64
import torch
import cv2
import base64
from PIL import Image
import io
from io import BytesIO
import base64
from io import BytesIO
from PIL import Image, ImageFile

def base64ToOpenCvIm(data):
    ImageFile.LOAD_TRUNCATED_IMAGES = True
    if ',' in data:
        data = data.split(",")[1]
    else:
        print("Błąd: Nagłówek nie został znaleziony w ciągu Base64.")
        exit(1)  
    while len(data) % 4 != 0:
        data += '='
    
    bytes_decoded = base64.b64decode(data)
    img = Image.open(BytesIO(bytes_decoded))
    img_np = np.array(img)
    
    opencv_image = cv2.cvtColor(img_np, cv2.COLOR_RGB2BGR)
    return opencv_image

def analyzeimage(baseData):
    im=base64ToOpenCvIm(baseData)
    valid=ValidRoad(im)
    results=valid.start()
    print(results)
    return results
