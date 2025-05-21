from googletrans import Translator
import asyncio
from module.datasets import amazon_sample
import time

# Measure the time taken to run the script
start_time = time.time()

# Step 1: Load the CSV file
starting_row = 3000
rows = 5000
batch_size = 2500
sleep_time = 60
df = amazon_sample()[starting_row:starting_row+rows]

# Step 2: Bulk translate the 'name' column to Azerbaijani using googletrans API in batches with async sleep

translator = Translator()
names = df["name"].tolist()
translated_texts = []

async def bulk_translate():
  for i in range(0, len(names), batch_size):
    # Calculate time taken for translation
    start_time = time.time()
    # Translate the current batch
    batch = names[i:i+batch_size]
    print("Sending request for translation.")
    translated_batch = await translator.translate(batch, src="en", dest="az")
    # Ensure translated_batch is always a list
    if not isinstance(translated_batch, list):
      translated_batch = [translated_batch]
    translated_texts.extend([t.text for t in translated_batch])
    print("Batch translation time for batch {}:".format((i // batch_size)+1))
    print("--- %s seconds ---" % (time.time() - start_time))
    # If there's more than one batch remaining (i.e., i + batch_size < len(names)), then the code will sleep.
    # If this is the last batch (i.e., i + batch_size == len(names)), then the code does not sleep.
    if i + batch_size < len(names):
      print(f"Putting sleep for {sleep_time} seconds to avoid API restrictions...")
      await asyncio.sleep(sleep_time)
    

asyncio.run(bulk_translate())

df['name'] = translated_texts

# Print the time taken for translation
print(f"Translation time for {len(names)} rows:")
print("--- %s seconds ---" % (time.time() - start_time))

print(f"Batch size: {batch_size}")

# Step 3: Save the translated data to a new CSV
df.to_csv('translated_file_sample.csv', index=False)