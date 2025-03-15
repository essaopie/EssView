import cv2
import torch
from depth.depth_anything_v2.dpt import DepthAnythingV2
def setupDepthModel():
    DEVICE = 'cuda' if torch.cuda.is_available() else 'mps' if torch.backends.mps.is_available() else 'cpu'
    
    model_configs = {
        'vits': {'encoder': 'vits', 'features': 64, 'out_channels': [48, 96, 192, 384]},
        'vitb': {'encoder': 'vitb', 'features': 128, 'out_channels': [96, 192, 384, 768]},
        'vitl': {'encoder': 'vitl', 'features': 256, 'out_channels': [256, 512, 1024, 1024]},
        'vitg': {'encoder': 'vitg', 'features': 384, 'out_channels': [1536, 1536, 1536, 1536]}
    }
    encoder = 'vits' # or 'vits', 'vitb', 'vitg'
    
    model = DepthAnythingV2(**model_configs[encoder])
    model.load_state_dict(torch.load(f'depth/checkpoints/depth_anything_v2_{encoder}.pth', map_location='cpu'))
    model = model.to(DEVICE).eval()
    return model
def evaluateDepth(image):
    model=setupDepthModel()
    depth = model.infer_image(image) # HxW raw depth map in numpy
    return depth
