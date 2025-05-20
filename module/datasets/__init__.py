from pandas import read_csv

def amazon_sample():
    return read_csv("./categorization/data_sample.csv")

def amazon_full():
    return read_csv("./categorization/data.csv")