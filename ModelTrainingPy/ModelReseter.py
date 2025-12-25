import tensorflow as tf
from tensorflow.keras import backend as K

def reset_model_weights(model):
    for layer in model.layers:
        if hasattr(layer, "kernel_initializer"):
            layer.kernel.assign(layer.kernel_initializer(tf.shape(layer.kernel)))
        if hasattr(layer, "bias_initializer"):
            layer.bias.assign(layer.bias_initializer(tf.shape(layer.bias)))

# Example usage
model = tf.keras.models.load_model("sign_language_model.h5")
reset_model_weights(model)
