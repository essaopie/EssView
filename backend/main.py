from ValidRoad import ValidRoad
import numpy as np
from EstimateDepth import evaluateDepth
import matplotlib
import torch
import cv2

for a in range(2,9):
    im = cv2.imread("photos/essa"+str(a)+".jpg")
    valid=ValidRoad(im)
    valid.start()
