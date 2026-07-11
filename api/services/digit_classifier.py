import numpy as np
import cv2
import joblib
from PIL import Image
import io
import os


class DigitClassifier:
    def __init__(self):
        # مسیر مدل رو درست تنظیم کن
        model_path = os.path.join(
            os.path.dirname(__file__),
            'best_model.pkl'
        )

        if not os.path.exists(model_path):
            raise FileNotFoundError(f"مدل در مسیر {model_path} پیدا نشد!")

        self.model = joblib.load(model_path)
        self.target_size = (28, 28)
        print(f"✅ مدل از {model_path} بارگذاری شد!")

    def preprocess_image(self, image_file):
        """پردازش عکس آپلود شده دقیقاً مثل زمان آموزش"""
        # خوندن عکس با PIL
        img = Image.open(image_file)

        # تبدیل به grayscale
        img = img.convert('L')

        # ریسایز به 28x28
        img = img.resize(self.target_size, Image.Resampling.LANCZOS)

        # تبدیل به آرایه numpy
        img_array = np.array(img, dtype=np.float32)

        # اینورت کردن (اگر پس‌زمینه سفید و عدد سیاه بود)
        # اینجا رو بسته به دیتاست خودت تنظیم کن
        if np.mean(img_array) > 127:
            img_array = 255 - img_array

        # نرمال‌سازی مثل زمان آموزش (دقیقاً همون کاری که با X انجام دادی)
        img_array = img_array / 255.0

        # flatten کردن
        img_array = img_array.flatten().reshape(1, -1)

        return img_array

    def predict(self, image_file):
        """پیش‌بینی عدد"""
        processed_img = self.preprocess_image(image_file)
        prediction = self.model.predict(processed_img)

        # اگه مدل probability داره
        try:
            probabilities = self.model.predict_proba(processed_img)[0]
            confidence = float(max(probabilities))
            all_probs = probabilities.tolist()
        except:
            # اگه مدل probability نداره (مثلاً Decision Tree)
            confidence = 1.0
            all_probs = [0.0] * 10
            all_probs[prediction[0]] = 1.0

        return {
            'digit': int(prediction[0]),
            'confidence': confidence,
            'all_probabilities': all_probs
        }


# ایجاد یه نمونه واحد (Singleton)
classifier = DigitClassifier()

# تست سریع (اختیاری)
if __name__ == '__main__':
    print("✅ سرویس تشخیص اعداد آماده است!")