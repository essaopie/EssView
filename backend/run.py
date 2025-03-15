import cv2
import argparse
from ValidRoad import ValidRoad

def passImage(image_path,displayImage):
    image = cv2.imread(image_path)

    if image is None:
        print(f"Nie można wczytać obrazu z {image_path}. Sprawdź ścieżkę.")
        return

    valid= ValidRoad(image,displayImage)
    results=valid.start()
    print(results)
    cv2.waitKey(0) 
    cv2.destroyAllWindows()

if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Pobierz obrazek i konwertuj do OpenCV.")
    parser.add_argument("--image", required=True, help="Ścieżka do obrazka do wczytania.")
    parser.add_argument("--displayImage", type=bool, default=False, help="Flaga, która przyjmuje wartość True lub False.")

    args = parser.parse_args()
    passImage(args.image,args.displayImage)

