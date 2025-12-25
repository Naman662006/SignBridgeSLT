import cv2
import mediapipe as mp
import numpy as np
import tensorflow as tf
import pickle

# ----------------------------
# LOAD MODEL
# ----------------------------
model = tf.keras.models.load_model("sign_language_model.h5")

# ----------------------------
# LOAD LABELS (IMPORTANT)
# ----------------------------
# Recreate same label order used during training
labels = sorted([ "A","B","C","D","E","F","G","H","I","J",
    "K","L","M","N","O","P","Q","R","S","T",
    "U","V","W","X","Y","Z"])  # CHANGE based on your dataset

# ----------------------------
# MEDIAPIPE SETUP
# ----------------------------
mp_hands = mp.solutions.hands
hands = mp_hands.Hands(
    max_num_hands=1,
    min_detection_confidence=0.7,
    min_tracking_confidence=0.7
)
mp_draw = mp.solutions.drawing_utils

cap = cv2.VideoCapture(0)

print("Press Q to quit")

while True:
    ret, frame = cap.read()
    if not ret:
        break

    frame = cv2.flip(frame, 1)
    rgb = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
    result = hands.process(rgb)

    if result.multi_hand_landmarks:
        for hand in result.multi_hand_landmarks:
            landmarks = []
            for lm in hand.landmark:
                landmarks.extend([lm.x, lm.y, lm.z])


            data = np.array(landmarks).reshape(1, -1)

            prediction = model.predict(data)
            class_id = np.argmax(prediction)
            label = labels[class_id]

            cv2.putText(
                frame,
                f"Prediction: {label}",
                (10, 40),
                cv2.FONT_HERSHEY_SIMPLEX,
                1,
                (0, 255, 0),
                2
            )

            mp_draw.draw_landmarks(
                frame,
                hand,
                mp_hands.HAND_CONNECTIONS
            )

    cv2.imshow("Sign Language Test", frame)

    if cv2.waitKey(1) & 0xFF == ord("q"):
        break

cap.release()
cv2.destroyAllWindows()
