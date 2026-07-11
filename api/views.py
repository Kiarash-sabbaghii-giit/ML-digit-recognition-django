from django.shortcuts import render
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_http_methods
from PIL import Image
import numpy as np
import joblib
import os
import logging

logger = logging.getLogger(__name__)


def load_model():
    model_path = os.path.join(os.path.dirname(__file__), 'best_model.pkl')
    if os.path.exists(model_path):
        try:
            return joblib.load(model_path)
        except Exception as e:
            logger.error(f"Model load error: {e}")
    return None


model = load_model()


def home(request):
    return render(request, 'index.html')


def about(request):
    return render(request, 'about.html')


def history(request):
    return render(request, 'history.html')


@csrf_exempt
@require_http_methods(["POST"])
def predict(request):
    try:
        if 'image' not in request.FILES:
            return JsonResponse({'success': False, 'error': 'No image provided'}, status=400)

        image_file = request.FILES['image']

        if not image_file.content_type.startswith('image/'):
            return JsonResponse({'success': False, 'error': 'File must be an image'}, status=400)

        if image_file.size > 5 * 1024 * 1024:
            return JsonResponse({'success': False, 'error': 'Image too large (max 5MB)'}, status=400)

        img = Image.open(image_file)
        img = img.convert('L')
        img = img.resize((28, 28))
        img_array = np.array(img, dtype=np.float32)

        if np.mean(img_array) > 127:
            img_array = 255 - img_array

        img_array = img_array / 255.0
        img_array = img_array.flatten().reshape(1, -1)

        if model is None:
            return JsonResponse({'success': False, 'error': 'Model not loaded'}, status=500)

        prediction = model.predict(img_array)[0]

        try:
            probabilities = model.predict_proba(img_array)[0]
            confidence = float(max(probabilities))
            all_probs = probabilities.tolist()
        except:
            confidence = 1.0
            all_probs = [0.0] * 10
            all_probs[int(prediction)] = 1.0

        return JsonResponse({
            'success': True,
            'digit': int(prediction),
            'confidence': confidence,
            'all_probabilities': all_probs
        })

    except Exception as e:
        logger.error(f"Prediction error: {str(e)}")
        return JsonResponse({'success': False, 'error': str(e)}, status=500)