# EssView

## Wprowadzenie

EssView to asystent wspierający osoby niewidome i niedowidzące w wykonywaniu codziennych aktywności takich jak poruszanie się w przestrzeni miejskiej, czytanie tekstu czy poruszanie się po obiektach wewnętrznych.

video: https://youtu.be/gEEOMSeDv4E



## Wymagania

Upewnij się, że masz zainstalowane następujące oprogramowanie:

- Python 3.6 lub nowszy
- Git
- NodeJS

## Instalacja

Aby zainstalować projekt, wykonaj poniższe kroki:

1. **Pobierz niezbędne pakiet**

   ```bash
   cd backend/
   pip install flask_cors
   pip install -r requirements.txt
   pip install numpy opencv-python matplotlib
   pip install torch torchvision torchaudio
2. **Sklonuj repozytorium detectron2**

   ```bash
   git clone https://github.com/facebookresearch/detectron2.git
   python -m pip install --no-build-isolation -e detectron2

2. **Sklonuj repozytorium Depth-Anything-V2**

   ```bash
   git clone https://github.com/DepthAnything/Depth-Anything-V2
   mv Depth-Anything-V2 depth
   cd depth
   pip install -r requirements.txt
   mkdir checkpoints
   cd checkpoints
   wget https://huggingface.co/depth-anything/Depth-Anything-V2-Small/resolve/main/depth_anything_v2_vits.pth?download=true -O depth_anything_v2_vits.pth
## Uruchamianie Modelu na zdjęciu
1. Uruchamianie modelu na jednym zdjęciu --image sciezka --displayImage: True/False 

   ```bash
   cd backend/
   python run.py --image photos/yourphoto.jpg --displayImage False
## Uruchamianie Projektu
Aplikacje frontendowe domyślnie komunikują się z serwerem zewnętrznym. W razie chęci hostowania projektów
na własnej maszynie proszę wykonywać następujące kroki:
Możesz uruchomic projekt analizujac jedno zdjecie badź uruchomić cały serwer wraz z fronentem :

1.  ZMIANA ADRESÓW IP ZEWNETRZNEGO SERWERA NA LOKALNY 

2. **Uruchamianie aplikacji dla osoby niedowidzącej**

   ```bash
   cd MenteeApp
   npm install
   npm run web
3. **Uruchamianie aplikacji dla opiekuna osoby niedowdziącej**

   ```bash
   cd GuardianApp
   npm install
   npm run web
4. **Uruchamianie lokalnego serwer**
 
   ```bash
   cd backend
   python mainbackend.py
   

## Źródła
https://github.com/DepthAnything/Depth-Anything-V2

https://github.com/facebookresearch/detectron2

   
   
 
