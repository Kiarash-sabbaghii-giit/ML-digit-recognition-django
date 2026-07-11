# 🤖 Django ML Digit Recognition

<div align="center">

## 🚀 Live Demo

<p align="center">
  <img src="demo.gif" alt="Project Demo" width="900">
</p>


---

![Python](https://img.shields.io/badge/Python-3.10+-3776AB?style=for-the-badge&logo=python&logoColor=white)
![Django](https://img.shields.io/badge/Django-4.2+-092E20?style=for-the-badge&logo=django&logoColor=white)
![License](https://img.shields.io/badge/License-MIT-green?style=for-the-badge)
![PRs](https://img.shields.io/badge/PRs-Welcome-brightgreen?style=for-the-badge)

# 🎯 Machine Learning Digit Recognition

*A modern handwritten digit recognition web application powered by Django and Machine Learning.*

</div>

---

# 🤖 About

This project is a modern handwritten digit recognition system built with **Django** and **Scikit-learn**. Users can upload handwritten digit images through an intuitive interface and receive real-time predictions from multiple machine learning models.

The application focuses on speed, accuracy, and user experience while demonstrating practical integration between Machine Learning and modern web development.

---

# ✨ Features

| Feature | Description |
|----------|-------------|
| 🎨 Drag & Drop Upload | Upload images with an intuitive interface |
| ⚡ Real-time Prediction | Instant digit recognition |
| 📊 Confidence Bars | Visual prediction confidence |
| 📜 Prediction History | View previous predictions |
| 📁 Export Reports | Export prediction history |
| 🌙 Dark / Light Theme | User-friendly interface |
| 🤖 Multiple ML Models | Compare different algorithms |
| 🚀 Responsive Design | Works across devices |

---

# 🛠️ Tech Stack

| Category | Technology |
|----------|------------|
| Backend | Django 4.2+ |
| Language | Python 3.10+ |
| Machine Learning | Scikit-learn |
| Frontend | HTML, CSS, JavaScript |
| Animation | GSAP |
| Background Effects | Particles.js |
| Styling | Bootstrap |
| Database | SQLite |

---

# 📊 Machine Learning Models

The application includes multiple trained models for comparison.

| Model | Status |
|--------|--------|
| ✅ Random Forest | Best Model |
| K-Nearest Neighbors | Supported |
| Decision Tree | Supported |
| Logistic Regression | Supported |
| AdaBoost | Supported |

---

# 📈 Model Performance

| Metric | Value |
|--------|-------|
| Accuracy | **97.8%** |
| Response Time | **<100 ms** |
| Training Images | **50,000+** |
| Best Model | Random Forest |

---

# ⚙️ Getting Started

## Clone Repository

```bash
git clone https://github.com/yourusername/django-digit-recognition.git

cd django-digit-recognition

---

Create Virtual Environment

python -m venv venv

Activate it:

Windows

venv\Scripts\activate

Linux / macOS

source venv/bin/activate

---

Install Dependencies

pip install -r requirements.txt

---

Run Migrations

python manage.py migrate

---

Start Development Server

python manage.py runserver

Open:

http://127.0.0.1:8000/

---

📂 Project Structure

DigitRecognition/
│
├── digitrecognition/
│   ├── settings.py
│   ├── urls.py
│   └── views.py
│
├── templates/
├── static/
│   ├── css/
│   ├── js/
│   └── images/
│
├── ml_models/
│   ├── random_forest.pkl
│   ├── knn.pkl
│   ├── decision_tree.pkl
│   ├── logistic_regression.pkl
│   └── adaboost.pkl
│
├── media/
├── manage.py
└── requirements.txt

---

⚡ How It Works

1. User uploads a handwritten digit.
2. Image preprocessing is performed.
3. Features are extracted.
4. Selected ML model predicts the digit.
5. Confidence scores are calculated.
6. Results are displayed instantly.
7. Prediction is saved into history.
8. Reports can be exported.

---

🎨 UI Highlights

- Modern dashboard
- Responsive layout
- Animated transitions using GSAP
- Interactive confidence bars
- Dark & Light mode
- Smooth drag-and-drop upload
- Clean typography
- Particle background effects

---

🚀 Future Improvements

- CNN Deep Learning Model
- REST API
- User Authentication
- Model Retraining
- Cloud Deployment
- Docker Support
- Batch Image Prediction
- Mobile Optimization

---

🤝 Contributing

Contributions are welcome.

1. Fork the repository.
2. Create a feature branch.

git checkout -b feature/my-feature

3. Commit your changes.

git commit -m "Add new feature"

4. Push your branch.

git push origin feature/my-feature

5. Open a Pull Request.

---

📄 License

This project is licensed under the MIT License.

Feel free to use, modify, and distribute this project for educational and commercial purposes.

---

🙌 Acknowledgements

Special thanks to:

- Django
- Scikit-learn
- GSAP
- Particles.js
- Open Source Community

---

<div align="center">⭐ If you found this project helpful, consider giving it a star!

Made with ❤️ using Django & Machine Learning.

</div>
```
