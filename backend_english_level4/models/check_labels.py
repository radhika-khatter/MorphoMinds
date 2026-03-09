from data_loader import get_dataloader

train_dir = "./dataset/processed/train"

loader, dataset = get_dataloader(train_dir, train=True)

print("Total classes:", len(dataset.classes))
print("First 10 class mappings:")

for i, cls in enumerate(dataset.classes[:10]):
    print(i, "->", cls)

print("\nLast 10 class mappings:")
for i, cls in enumerate(dataset.classes[-10:], start=len(dataset.classes)-10):
    print(i, "->", cls)
