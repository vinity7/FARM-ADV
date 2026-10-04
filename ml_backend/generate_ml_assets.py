import pandas as pd
import numpy as np
import matplotlib.pyplot as plt
import seaborn as sns
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestClassifier
from sklearn.metrics import classification_report, confusion_matrix, f1_score, roc_auc_score
import pickle
import nbformat
from nbformat.v4 import new_notebook, new_code_cell, new_markdown_cell
import os

print("Creating Jupyter Notebook...")

nb = new_notebook()

nb.cells.extend([
    new_markdown_cell("# Crop Recommendation - EDA and Model Training"),
    new_code_cell("""import pandas as pd
import numpy as np
import matplotlib.pyplot as plt
import seaborn as sns
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestClassifier
from sklearn.metrics import classification_report, confusion_matrix, f1_score, roc_auc_score
import pickle"""),
    
    new_markdown_cell("## 1. Load the Data"),
    new_code_cell("""df = pd.read_csv('Crop_recommendation.csv')
print(f"Dataset shape: {df.shape}")
display(df.head())"""),
    
    new_markdown_cell("## 2. Exploratory Data Analysis (EDA)"),
    new_code_cell("""print("Checking for null values:")
print(df.isnull().sum())"""),
    new_code_cell("""plt.figure(figsize=(10, 8))
numeric_df = df.select_dtypes(include=[np.number])
sns.heatmap(numeric_df.corr(), annot=True, cmap='coolwarm')
plt.title("Feature Correlation Heatmap")
plt.show()"""),
    new_code_cell("""plt.figure(figsize=(15, 6))
sns.boxplot(x='label', y='N', data=df)
plt.xticks(rotation=90)
plt.title("Nitrogen Requirement by Crop")
plt.show()"""),
    
    new_markdown_cell("## 3. Data Preparation"),
    new_code_cell("""X = df.drop('label', axis=1)
y = df['label']

X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)
print(f"Training Data: {X_train.shape}, Testing Data: {X_test.shape}")"""),
    
    new_markdown_cell("## 4. Model Training"),
    new_code_cell("""model = RandomForestClassifier(n_estimators=100, random_state=42)
model.fit(X_train, y_train)
print("Random Forest Model Trained Successfully!")"""),
    
    new_markdown_cell("## 5. Model Evaluation"),
    new_code_cell("""y_pred = model.predict(X_test)
f1 = f1_score(y_test, y_pred, average='weighted')
print(f"Weighted F1-Score: {f1:.4f}")

cm = confusion_matrix(y_test, y_pred)
plt.figure(figsize=(12, 10))
sns.heatmap(cm, annot=True, fmt='d', cmap='Blues', xticklabels=model.classes_, yticklabels=model.classes_)
plt.title("Confusion Matrix")
plt.xlabel("Predicted Crop")
plt.ylabel("Actual Crop")
plt.show()

print("Classification Report:")
print(classification_report(y_test, y_pred))"""),
    
    new_markdown_cell("## 6. Save the Model"),
    new_code_cell("""with open('crop_model.pkl', 'wb') as file:
    pickle.dump(model, file)
print("Model saved as 'crop_model.pkl'!")""")
])

with open('Crop_Analysis_and_Training.ipynb', 'w') as f:
    nbformat.write(nb, f)

print("Notebook Crop_Analysis_and_Training.ipynb created!")

print("Now actually running the training process to generate the .pkl model for Step 3...")

# Actually run the training
df = pd.read_csv('Crop_recommendation.csv')
X = df.drop('label', axis=1)
y = df['label']
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)
model = RandomForestClassifier(n_estimators=100, random_state=42)
model.fit(X_train, y_train)
y_pred = model.predict(X_test)
f1 = f1_score(y_test, y_pred, average='weighted')
print(f"Trained model. Weighted F1-Score: {f1:.4f}")
with open('crop_model.pkl', 'wb') as file:
    pickle.dump(model, file)
print("crop_model.pkl generated successfully!")
