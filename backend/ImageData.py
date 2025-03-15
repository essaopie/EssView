from torch.ao.quantization.observer import ReuseInputObserver
import numpy as np


class ImageData:
    def __init__(self,image_array) -> None:

       self.image_height=image_array.shape[0]
       self.image_width=image_array.shape[1]
       self.x_firstVerticalLine=int(self.image_width/4)
       self.x_secondVerticalLine=self.x_firstVerticalLine*2
       self.x_thirdVerticalLine=self.x_firstVerticalLine*3
       self.x_imageCenterPoint=int(self.image_width/2)
       self.y_imageCenterPoint=int(self.image_height/2-100)
       self.y_horizontalLine=int((self.image_height/4)*3);

    def getFirstRectangleVertices(self):
        firstRectangle_vertices = np.array([[0, self.image_height],
                                             [self.x_firstVerticalLine, self.image_height],
                                             [self.x_firstVerticalLine,self.y_horizontalLine],
                                             [0,self.y_horizontalLine],
                                            ])
        return firstRectangle_vertices

    def getAnotherRectangleVertices(self):

        anotherRectangle_vertices = np.array([[self.x_firstVerticalLine, self.image_height],
                                              [self.x_secondVerticalLine, self.image_height],
                                              [self.x_secondVerticalLine,self.y_horizontalLine],
                                              [self.x_firstVerticalLine, self.y_horizontalLine],
                                              ])
        return anotherRectangle_vertices
    def getThirdRectangleVertices(self):
        thirdRectangle_vertices = np.array([[self.x_secondVerticalLine, self.image_height],
                                             [self.x_thirdVerticalLine, self.image_height],
                                            [self.x_thirdVerticalLine, self.y_horizontalLine],
                                             [self.x_secondVerticalLine, self.y_horizontalLine]
                                             ])
        return thirdRectangle_vertices
    def getFourthRectangleVertices(self):
        fourthRectangle_vertices = np.array([[self.x_thirdVerticalLine, self.image_height],
                                              [self.image_width, self.image_height],
                                              [self.image_width, self.y_horizontalLine],
                                             [self.x_thirdVerticalLine,self.y_horizontalLine],
                                            ])
        return fourthRectangle_vertices
    def getAllRectangleVertices(self):
        return[self.getFirstRectangleVertices(),self.getAnotherRectangleVertices(),self.getThirdRectangleVertices(),self.getFourthRectangleVertices()]
    def getTriangleVertices(self):
        return np.array([[self.x_firstVerticalLine, self.image_height], [self.x_thirdVerticalLine, self.image_height], [self.x_imageCenterPoint,self.y_imageCenterPoint]])
