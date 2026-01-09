import torch
print("CUDA dispo :", torch.cuda.is_available())
print("GPU count :", torch.cuda.device_count())
print("GPU name :", torch.cuda.get_device_name(0))