import cv2
import mediapipe as mp
import csv
import os
import time

label = input("Enter label (A, B, C...): ").upper()

WAIT_TIME = 10        # seconds before starting
CAPTURE_INTERVAL = 1
# seconds between captures
TOTAL_SAMPLES = 10    # n
mp_hands = mp.solutions.hands
hands = mp_hands.Hands(
    static_image_mode=False,
    max_num_hands=1,
    min_detection_confidence=0.7,
    min_tracking_confidence=0.7
)

mp_draw = mp.solutions.drawing_utils

cap = cv2.VideoCapture(0)

os.makedirs("dataset", exist_ok=True)
file = open(f"dataset/{label}.csv", "a", newline="")
writer = csv.writer(file)

start_time = time.time()
saved_count = 0
last_capture_time = 0

print(f"WAITING {WAIT_TIME} SECONDS… GET READY FOR LETTER {label}")

while True:
    ret, frame = cap.read()
    if not ret:
        break

    frame = cv2.flip(frame, 1)
    rgb = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
    result = hands.process(rgb)

    landmarks = None

    if result.multi_hand_landmarks:
        for hand in result.multi_hand_landmarks:
            mp_draw.draw_landmarks(
                frame, hand, mp_hands.HAND_CONNECTIONS
            )

            landmarks = []
            for lm in hand.landmark:
                landmarks.extend([lm.x, lm.y, lm.z])

    elapsed = int(time.time() - start_time)

    # ---------- WAITING TIMER ----------
    if elapsed < WAIT_TIME:
        cv2.putText(
            frame,
            f"WAITING: {WAIT_TIME - elapsed}s",
            (30, 60),
            cv2.FONT_HERSHEY_SIMPLEX,
            1.2,
            (0, 0, 255),
            3
        )

    # ---------- AUTO CAPTURE ----------
    else:
        cv2.putText(
            frame,
            f"CAPTURING {saved_count+1}/{TOTAL_SAMPLES}",
            (30, 60),
            cv2.FONT_HERSHEY_SIMPLEX,
            1.2,
            (0, 255, 0),
            3
        )

        if (
            landmarks is not None
            and time.time() - last_capture_time >= CAPTURE_INTERVAL
            and saved_count < TOTAL_SAMPLES
        ):
            writer.writerow(landmarks)
            file.flush()
            saved_count += 1
            last_capture_time = time.time()
            print(f"LANDMARK {saved_count} SAVED")

    cv2.putText(
        frame,
        f"Label: {label}",
        (30, 110),
        cv2.FONT_HERSHEY_SIMPLEX,
        1,
        (255, 255, 255),
        2
    )

    cv2.imshow("Auto Landmark Collection", frame)

    if saved_count >= TOTAL_SAMPLES:
        break

    if cv2.waitKey(1) & 0xFF == ord('q'):
        break

cap.release()
file.close()
cv2.destroyAllWindows()

print("DONE ✔ CSV SAVED SUCCESSFULLY")
