import pandas as pd
import matplotlib.pyplot as plt
import module

df = module.datasets.amazon_full()
print(df)

counts = df['main_category'].value_counts()
plt.pie(counts, labels=counts.index, autopct='%1.1f%%', startangle=150)
plt.title('Pie Chart of Main Category Counts: Amazon Sample 1m rows')
plt.show()