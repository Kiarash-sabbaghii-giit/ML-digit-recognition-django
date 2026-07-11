# Libraries

import os
import cv2
import numpy as np
from multiprocessing import Pool, cpu_count
from tqdm import tqdm
import time
import warnings
from sklearn.model_selection import train_test_split, cross_val_score, StratifiedKFold
from sklearn.preprocessing import StandardScaler
from sklearn.metrics import (
    accuracy_score, precision_score, recall_score, f1_score,
    confusion_matrix, classification_report, roc_auc_score
)
from sklearn.ensemble import RandomForestClassifier, AdaBoostClassifier
from sklearn.tree import DecisionTreeClassifier
from sklearn.neighbors import KNeighborsClassifier
from sklearn.linear_model import LogisticRegression
import pandas as pd
import seaborn as sns
import matplotlib.pyplot as plt
import joblib




warnings.filterwarnings('ignore')

# Data preprocessing


def process_image(args):
    img_path, label, target_size = args
    img = cv2.imread(img_path, cv2.IMREAD_GRAYSCALE)
    if img is not None:
        if img.shape != target_size:
            img = cv2.resize(img, target_size)
        return (img.flatten(), label)
    return None

def load_dataset_parallel(base_path, target_size=(28, 28)):
    tasks = []
    for label in range(10):
        folder = os.path.join(base_path, str(label))
        if os.path.exists(folder):
            for img_name in os.listdir(folder):
                img_path = os.path.join(folder, img_name)
                tasks.append((img_path, label, target_size))

    print(f"📊 تعداد کل تصاویر پیدا شده: {len(tasks)}")

    with Pool(processes=cpu_count()) as pool:
        results = list(tqdm(pool.imap(process_image, tasks), total=len(tasks)))

    results = [r for r in results if r is not None]
    if not results:
        return np.array([]), np.array([])

    data = np.array([r[0] for r in results])
    labels = np.array([r[1] for r in results])
    return data, labels

# Train model


def evaluate_model(name, model, X_train, X_test, y_train, y_test):

    print(f"\n{'=' * 60}")
    print(f"🔄 در حال آموزش {name}...")


    start_time = time.time()

    model.fit(X_train, y_train)

    y_pred = model.predict(X_test)


    train_time = time.time() - start_time

    acc = accuracy_score(y_test, y_pred)
    precision = precision_score(y_test, y_pred, average='weighted')
    recall = recall_score(y_test, y_pred, average='weighted')
    f1 = f1_score(y_test, y_pred, average='weighted')

    cv_scores = cross_val_score(model, X_train, y_train, cv=5, scoring='accuracy')

    cm = confusion_matrix(y_test, y_pred)

    print(f"✅ {name} - نتایج:")
    print(f"   📈 دقت (Accuracy):     {acc:.4f}")
    print(f"   📊 دقت وزنی (Precision): {precision:.4f}")
    print(f"   📊 فراخوانی (Recall):   {recall:.4f}")
    print(f"   📊 نمره F1:            {f1:.4f}")
    print(f"   🎯 CV Mean Accuracy:   {cv_scores.mean():.4f} (±{cv_scores.std():.4f})")
    print(f"   ⏱️  زمان آموزش:        {train_time:.2f} ثانیه")

    return {
        'model': name,
        'accuracy': acc,
        'precision': precision,
        'recall': recall,
        'f1_score': f1,
        'cv_mean': cv_scores.mean(),
        'cv_std': cv_scores.std(),
        'train_time': train_time,
        'confusion_matrix': cm,
        'y_pred': y_pred
    }


if __name__ == '__main__':
    print("🚀 شروع پروژه تشخیص اعداد...")

    X, y = load_dataset_parallel('dataset')

    if len(X) == 0:
        print("❌ خطا: هیچ دادهای بارگذاری نشد!")
        exit()

    print(f"\n✅ دیتا بارگذاری شد: {len(X)} تصویر")
    print(f"✅ شکل هر تصویر: {X[0].shape}")
    print(f"✅ توزیع کلاسها:")
    for i in range(10):
        print(f"   کلاس {i}: {np.sum(y == i)} تصویر")


    print("\n🔄 در حال نرمالسازی داده...")
    X = X / 255.0


    X_train, X_test, y_train, y_test = train_test_split(
        X, y, test_size=0.2, random_state=42, stratify=y
    )
    print(f"✅ داده تقسیم شد: {len(X_train)} برای آموزش، {len(X_test)} برای تست")

    models = {
        'KNN (k=5)': KNeighborsClassifier(n_neighbors=5, n_jobs=-1),
        'KNN (k=3)': KNeighborsClassifier(n_neighbors=3, n_jobs=-1),
        'KNN (k=7)': KNeighborsClassifier(n_neighbors=7, n_jobs=-1),
        'Decision Tree': DecisionTreeClassifier(random_state=42),
        'Random Forest (50)': RandomForestClassifier(n_estimators=50, random_state=42, n_jobs=-1),
        'Random Forest (100)': RandomForestClassifier(n_estimators=100, random_state=42, n_jobs=-1),
        'Random Forest (200)': RandomForestClassifier(n_estimators=200, random_state=42, n_jobs=-1),
        'Logistic Regression': LogisticRegression(max_iter=1000, random_state=42, n_jobs=-1),
        'AdaBoost (50)': AdaBoostClassifier(n_estimators=50, random_state=42),
        'AdaBoost (100)': AdaBoostClassifier(n_estimators=100, random_state=42),
    }


    results = []
    best_score = 0
    best_model_name = ""

    for name, model in models.items():
        result = evaluate_model(name, model, X_train, X_test, y_train, y_test)
        results.append(result)

        if result['accuracy'] > best_score:
            best_score = result['accuracy']
            best_model_name = name

    # ۶. نمایش جدول مقایسه
    print(f"\n{'=' * 60}")
    print("📊 جدول مقایسه همه مدلها:")
    print('=' * 60)

    df_results = pd.DataFrame(results)
    display_cols = ['model', 'accuracy', 'precision', 'recall', 'f1_score', 'cv_mean', 'train_time']
    print(df_results[display_cols].to_string(index=False))


    print(f"\n{'=' * 60}")
    print(f"🏆 بهترین مدل: {best_model_name}")
    print(f"🏆 دقت: {best_score:.4f}")
    print('=' * 60)


    best_result = [r for r in results if r['model'] == best_model_name][0]
    cm = best_result['confusion_matrix']

    plt.figure(figsize=(10, 8))
    sns.heatmap(cm, annot=True, fmt='d', cmap='Blues',
                xticklabels=range(10), yticklabels=range(10))
    plt.title(f'ماتریس درهمریختگی - {best_model_name}')
    plt.xlabel('پیشبینی شده')
    plt.ylabel('واقعی')
    plt.tight_layout()
    plt.savefig('confusion_matrix.png', dpi=300, bbox_inches='tight')
    print(f"✅ ماتریس درهمریختگی ذخیره شد: confusion_matrix.png")
    plt.show()


    plt.figure(figsize=(12, 6))
    models_name = [r['model'] for r in results]
    accuracies = [r['accuracy'] for r in results]

    bars = plt.barh(models_name, accuracies, color='skyblue')
    plt.xlabel('دقت')
    plt.title('مقایسه دقت مدلهای مختلف')
    plt.xlim(0, 1)

    for bar, acc in zip(bars, accuracies):
        plt.text(bar.get_width() + 0.01, bar.get_y() + bar.get_height() / 2,
                 f'{acc:.4f}', va='center')

    plt.tight_layout()
    plt.savefig('model_comparison.png', dpi=300, bbox_inches='tight')
    print(f"✅ نمودار مقایسه ذخیره شد: model_comparison.png")
    plt.show()

    best_model = models[best_model_name]
    joblib.dump(best_model, 'best_model.pkl')
    print(f"💾 بهترین مدل ذخیره شد: best_model.pkl")

    print("\n✅ پروژه با موفقیت کامل شد! 🎉")