
import sys
import modal

app = modal.App("Image-Diffusion")

@app.function()
def test(i):
  if i%2==0:
    print("Bravo! it is Even: ", i)
  else:
    print("Swoosh! it is Odd: ", i, file=sys.stderr)
  return i*i

@app.local_entrypoint()
def main():
  print(test.local(1000))
  total=0
  for num in test.map(range(1000)):
    total+=num
  print(total)