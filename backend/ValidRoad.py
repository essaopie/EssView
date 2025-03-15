from numpy._core.numeric import array_equal
from detectron2 import model_zoo
from detectron2.engine import DefaultPredictor
from detectron2.config import get_cfg
from detectron2.utils.visualizer import Visualizer
from detectron2.data import MetadataCatalog, DatasetCatalog
from matplotlib.path import Path
from EstimateDepth import evaluateDepth
import torch
import matplotlib.pyplot as plt
from matplotlib.colors import ListedColormap
import numpy as np
import  cv2
from ImageData import ImageData
class ValidRoad:
    def __init__(self,image,displayPhoto) -> None:
        self.displayPhoto=displayPhoto
        self.image=image
        self.intializeModel()
        self.evaluateResults()
        self.panoptic_seg_np=self.panoptic_seg.cpu().numpy()

    def intializeModel(self):
        self.cfg = get_cfg()
        self.cfg.merge_from_file(model_zoo.get_config_file("COCO-PanopticSegmentation/panoptic_fpn_R_50_3x.yaml"))
        self.cfg.MODEL.WEIGHTS = model_zoo.get_checkpoint_url("COCO-PanopticSegmentation/panoptic_fpn_R_50_3x.yaml")


    def evaluateResults(self):
        predictor = DefaultPredictor(self.cfg)
        self.metadata = MetadataCatalog.get(self.cfg.DATASETS.TRAIN[0])
        self.panoptic_seg, self.segments_info = predictor(self.image)["panoptic_seg"]

    def createTriangleMask(self,image_data):
        triangle_vertices = image_data.getTriangleVertices()
        triangle_path = Path(triangle_vertices)
        x = np.arange(0, image_data.image_width)
        y = np.arange(0, image_data.image_height)
        xx, yy = np.meshgrid(x, y)
        self.points = np.vstack((xx.ravel(), yy.ravel())).T
        inside = triangle_path.contains_points(self.points)
        triangle_mask = inside.reshape(self.panoptic_seg_np.shape)
        return triangle_mask

    def checkTheBiggestThingInsideMask(self,mask,array_to_check):
        values_inside_Mask=array_to_check[mask]
        unique_colors, counts = np.unique(values_inside_Mask, axis=0, return_counts=True)
        count_ofPixels=values_inside_Mask.shape[0]
        the_biggest_object= -1
        the_biggest_objectSurface=-1
        for object_id,occurrance in zip(unique_colors,counts):
            percentage_occurrence=int((occurrance/count_ofPixels)*100)
            result = [item for item in self.segments_info if item["id"] == object_id]
            if(not object_id==0 and  result[0]['isthing']):
                if(percentage_occurrence>the_biggest_objectSurface and not percentage_occurrence==0):
                    the_biggest_object=result[0]
                    the_biggest_objectSurface=percentage_occurrence
        return the_biggest_object,the_biggest_objectSurface
    def detectThingsOnsides(self,leftMask,rightMask):
        left_biggest_object,essa=self.checkTheBiggestThingInsideMask(leftMask,self.panoptic_seg_np)
        right_biggest_object,essa=self.checkTheBiggestThingInsideMask(rightMask,self.panoptic_seg_np)
        thingsOnSides=[]
        if(not left_biggest_object==-1):
            leftThingCategory=self.metadata.thing_classes[left_biggest_object["category_id"]]
            thingsOnSides.append({"side":"left","object":leftThingCategory,"danger":self.estimateDanger(leftThingCategory)})
        if(not right_biggest_object==-1):
            right_biggest_object=self.metadata.thing_classes[right_biggest_object["category_id"]]
            thingsOnSides.append({"side":"right","object":right_biggest_object,"danger":self.estimateDanger(right_biggest_object)})
        return thingsOnSides

    def classDistanceV2(self,the_biggest_object):
        if(not the_biggest_object==-1):
            objectName=self.metadata.thing_classes[the_biggest_object["category_id"]]
            depth_array=evaluateDepth(self.image)
            results_array=depth_array[self.panoptic_seg_np==the_biggest_object["id"]]
            distance=np.mean(results_array)
            return distance
        else:
            print("nie ma nic przed tobą")
            return None



    def personDistanceV1(self,the_biggest_object,the_biggest_objectSurface):
        distance="daleko"
        if(not the_biggest_object==-1):
            if(the_biggest_objectSurface<5):
                distance="daleko"
            elif(the_biggest_objectSurface<15):
                distance="niedaleko"
            elif(the_biggest_objectSurface<50):
                distance="blisko"
            elif(the_biggest_objectSurface>50):
                distance="bardzo blisko"

            biggest_objectName=self.metadata.thing_classes[the_biggest_object["category_id"]]
            print("masz "+distance+" do "+biggest_objectName)
        else:
            print("nie masz nic przed sobą")

    def createMask(self,vertices):
        path = Path(vertices)
        insidee = path.contains_points(self.points)
        mask = insidee.reshape(self.panoptic_seg_np.shape)
        return mask

    def checkValidSurfacesInsideMask(self,mask,image_array):
        value_inside_mask=image_array[mask]
        unique_colors, counts = np.unique(value_inside_mask, axis=0, return_counts=True)
        count_ofPixels=value_inside_mask.shape[0]
        info_arr=[]
        self.objects_name=[]

        for object_id,occurrance in zip(unique_colors,counts):

            percentage_occurrence=(occurrance/count_ofPixels)*100
            if(not object_id==0):
                result = [item for item in self.segments_info if item["id"] == object_id][0]
                object_catID=result["category_id"]

            #chodnik 44 ulica 21 trawa 46 drzewa 37
                if(not result["isthing"] and object_catID in {44,21,46,37}):
                    name=self.metadata.stuff_classes[object_catID]
                    info_arr.append([name,round(percentage_occurrence,2),{"cat":object_catID}])
                elif(result["isthing"]):
                    name=self.metadata.thing_classes[object_catID]
                    self.objects_name.append(name)




        return info_arr



    def CollectEveryMaskSurfaceStats(self,image_data,image_array):
        vertices_array=image_data.getAllRectangleVertices()
        rectangles_info_array=[]
        for a in vertices_array:
            info_array= self.checkValidSurfacesInsideMask(self.createMask(a),image_array)
            rectangles_info_array.append(info_array)
        return rectangles_info_array


    def analyzeResults(self,info_array):

        surfaces=[]

        for a in range(4):

            surfaces.append(self.checkSurfacesInsideBox(info_array[a]))
        if(surfaces[1]=="pavement" and surfaces[2]=="pavement"):
            return ("You are walking on pavement")

        elif(surfaces[1]=="pavement" and surfaces[2]=="road"):
            if(surfaces[0]=="pavement"):
                return ("On your right is the road, move a little to the left")
            elif(surfaces[0]=="road"):
                return ("Take a few steps to the left")

        elif(surfaces[1]=="road" and surfaces[2]=="pavement"):
            if(surfaces[3]=="pavement"):
                return ("On your left is the road, move a little to the right!")
            elif(surfaces[3]=="road"):
                return ("Take a few steps to the left")
        else:
            return ("Step back! the road is in front of you")


    def checkSurfacesInsideBox(self,box):
        pavement_occurance=0
        road_occurance=0
        grass_occurance=0
        most='none'
        for box_object in box:
            if(box_object[0]=="pavement"):
                pavement_occurance=box_object[1]
            elif(box_object[0]=="road"):
                road_occurance=box_object[1]
            elif(box_object[0]=="grass"):
                grass_occurance=box_object[1]
        if(pavement_occurance>road_occurance and pavement_occurance>grass_occurance):
            most='pavement'
        elif(pavement_occurance<road_occurance and road_occurance>grass_occurance):
            most='road'
        elif(pavement_occurance<grass_occurance and road_occurance<grass_occurance):
            most='grass'

        return most
    def createDistanceLabel(self,the_biggest_object,distance):
        x2=0
        y2=0
        for x in range(0,self.panoptic_seg_np.shape[1]):
            for y in range(0,self.panoptic_seg_np.shape[0]):
                if(self.panoptic_seg_np[y][x]==the_biggest_object["id"]):
                    x2=x
                    y2=y
                    break;
        self.out=self.Visualizer.draw_text("Distance: "+str(round(distance,3)), (x2,y2), font_size=10, color='pink')

    def visualize(self,the_biggest_object=None,distance=None):
        self.Visualizer = Visualizer(self.image[:, :, ::-1], MetadataCatalog.get(self.cfg.DATASETS.TRAIN[0]), scale=1.2)
        if(not (the_biggest_object is None and distance is None) and not(the_biggest_object==-1)):
            self.createDistanceLabel(the_biggest_object,distance)
        else:
            self.out = self.Visualizer.draw_panoptic_seg_predictions(self.panoptic_seg.to("cpu"), self.segments_info)
        main_image_array=self.out.get_image()[:, :, ::-1]
        plt.imshow(main_image_array)
        plt.axis('off')  # Ukryj osie
        plt.show()
        del main_image_array
        del self.out
    def estimateDanger(self,name):

        outdoor_objects = {
        'person': 'small',
        'bicycle': 'small',
        'car': 'medium',
        'motorcycle': 'medium',
        'bus': 'medium',
        'train': 'danger',
        'truck': 'medium',
        'boat': 'medium',
        'traffic light': 'small',
        'fire hydrant': 'small',
        'stop sign': 'small',
        'parking meter': 'small',
        'bench': 'small',
        'bird': 'small',
        'cat': 'small',
        'dog': 'small',
        'horse': 'medium',
        'sheep': 'small',
        'cow': 'small',
        'elephant': 'danger',
        'bear': 'danger',
        'zebra': 'small',
        'giraffe': 'small',
        }
        if name in outdoor_objects:
            return outdoor_objects[name]
        return "none"
    def createRoadMessage(self,danger,objectname,distance):
        print("xd")
        return {
        "ObjectsInfront":{
                "object":objectname,
                "distance":distance,
                "danger":danger
                }
            }

    def start(self):
        finalAnswerList=[]
        image_data=ImageData(self.panoptic_seg_np)
        triangle_mask=self.createTriangleMask(image_data)
        the_biggest_object,the_biggest_objectSurface = self.checkTheBiggestThingInsideMask(triangle_mask,self.panoptic_seg_np)
        triangle_danger="none"
        triangle_name="none"
        triangle_distance=self.classDistanceV2(the_biggest_object)
        if triangle_distance is None:
            triangle_distance="none"
        else:
            triangle_distance=round(triangle_distance,2)
        if(not the_biggest_object==-1):
            triangle_name=self.metadata.thing_classes[the_biggest_object["category_id"]]
            triangle_danger=self.estimateDanger(triangle_name)

        results_array=self.CollectEveryMaskSurfaceStats(image_data,self.panoptic_seg_np)
        leftMask=self.createMask(image_data.getFirstRectangleVertices())
        rightMask=self.createMask(image_data.getFourthRectangleVertices())
        #obiekty po bokach
        objectsOnSides=self.detectThingsOnsides(leftMask,rightMask)
        validRoad=self.analyzeResults(results_array)
        results={
            "ValidRoad":validRoad,
        }
        finalAnswerList.append(results)
        triangleresults={
            "ObjectsInfront":{
                "object":triangle_name,
                "distance":float(triangle_distance),
                "danger":triangle_danger
            }
        }
        finalAnswerList.append(triangleresults)
        if(len(objectsOnSides)==1):
            if objectsOnSides[0]["side"]=="right":
                rightObjectName=objectsOnSides[0]["object"]
                rightObjectDanger=self.estimateDanger(rightObjectName)
                finalAnswerList.append({
                    "ObjectsOnLeft":"none"
                }
                )
                finalAnswerList.append({
                    "ObjectsOnRight":{
                        "object":rightObjectName,
                        "danger":rightObjectDanger
                    }
                })

            elif objectsOnSides[0]["side"]=="left":
                leftObjectName=objectsOnSides[0]["object"]
                leftObjectDanger= self.estimateDanger(leftObjectName)
                finalAnswerList.append({
                    "ObjectsOnRight":"none"
                }
                )
                finalAnswerList.append({
                    "ObjectsOnLeft":{
                        "object":leftObjectName,
                        "danger":leftObjectDanger
                    }
                })
        elif(len(objectsOnSides)==2):
                rightObjectName=objectsOnSides[0]["object"]
                rightObjectDanger=self.estimateDanger(rightObjectName)
                leftObjectName=objectsOnSides[0]["object"]
                leftObjectDanger= self.estimateDanger(leftObjectName)
                finalAnswerList.append({
                    "ObjectsOnRight":{
                        "object":rightObjectName,
                        "danger":rightObjectDanger
                    }
                })
                finalAnswerList.append({
                    "ObjectsOnLeft":{
                        "object":leftObjectName,
                        "danger":leftObjectDanger
                    }
                })
        elif(len(objectsOnSides)==0):
                finalAnswerList.append({
                    "ObjectsOnLeft":"none"
                }
                )
                finalAnswerList.append({
                    "ObjectsOnRight":"none"
                }
                )


        if self.displayPhoto:
            self.visualize(the_biggest_object,triangle_distance)
            v = Visualizer(self.image[:, :, ::-1], MetadataCatalog.get(self.cfg.DATASETS.TRAIN[0]), scale=1.2)
            out = v.draw_panoptic_seg_predictions(self.panoptic_seg.to("cpu"), self.segments_info)

        del image_data
        del self.panoptic_seg
        del self.panoptic_seg_np
        return finalAnswerList
'''
#LINIE POMOCNICZE
def helpLines(self):

valid_road_array[y_imageCenterPoint,x_imageCenterPoint]=4



for x1 in range(image_width):
    valid_road_array[y_horizontalLine,x1]=3
for y in range(image_height):
    valid_road_array[y, x_firstVerticalLine] = 3
    valid_road_array[y, x_secondVerticalLine] = 3
    valid_road_array[y, x_thirdVerticalLine] = 3


for y in range(y_imageCenterPoint,y_imageCenterPoint+8):
    valid_road_array[y,x_imageCenterPoint-1]=4
    valid_road_array[y,x_imageCenterPoint]=4
for y in range(y_imageCenterPoint-8,y_imageCenterPoint):
    valid_road_array[y,x_imageCenterPoint-1]=4
    valid_road_array[y,x_imageCenterPoint]=4
for x in range(x_imageCenterPoint,x_imageCenterPoint+8):
    valid_road_array[y-1,x]=4
    valid_road_array[y,x]=4
for x in range(x_imageCenterPoint-8,x_imageCenterPoint):
    valid_road_array[y-1,x]=4
    valid_road_array[y,x]=4
'''
