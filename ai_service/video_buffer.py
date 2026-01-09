import numpy as np
from collections import deque

class VideoFrameBuffer:
    """Buffer pour accumuler 16 frames avant prédiction"""
    
    def __init__(self, max_frames=16):
        self.max_frames = max_frames
        self.buffer = deque(maxlen=max_frames)
    
    def add(self, frame):
        """Ajoute un frame au buffer"""
        self.buffer.append(frame)
    
    def is_ready(self):
        """Vérifie si le buffer est plein"""
        return len(self.buffer) == self.max_frames
    
    def get(self):
        """Retourne la séquence complète (time_steps, nodes, features)"""
        return np.array(list(self.buffer))
    
    def clear(self):
        """Vide le buffer"""
        self.buffer.clear()