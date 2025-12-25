import pandas as pd
import numpy as np
import glob
import tensorflow as tf
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import LabelEncoder

# ----------------------------
# LOAD DATA
# ----------------------------
X = []
y = []

for file in glob.glob("dataset/*.csv"):
    label = file.split("/")[-1].replace(".csv", "")
    data = pd.read_csv(file, header=None)

    X.extend(data.values)
    y.extend([label] * len(data))

X = np.array(X)

encoder = LabelEncoder()
y = encoder.fit_transform(y)

print("Labels:", encoder.classes_)

# ----------------------------
# TRAIN / TEST SPLIT
# ----------------------------
X_train, X_test, y_train, y_test = train_test_split(
    X, y, test_size=0.2, random_state=42
)

# ----------------------------
# BUILD MODEL
# ----------------------------
model = tf.keras.Sequential([
    tf.keras.layers.Dense(128, activation="relu", input_shape=(63,)),
    tf.keras.layers.Dense(64, activation="relu"),
    tf.keras.layers.Dense(len(np.unique(y)), activation="softmax")
])

model.compile(
    optimizer="adam",
    loss="sparse_categorical_crossentropy",
    metrics=["accuracy"]
)

# ----------------------------
# TRAIN MODEL
# ----------------------------
model.fit(
    X_train,
    y_train,
    epochs=30,
    validation_data=(X_test, y_test)
)

# ----------------------------
# SAVE MODEL
# ----------------------------
model.save("sign_language_model.h5")

print("Model saved as sign_language_model.h5")
