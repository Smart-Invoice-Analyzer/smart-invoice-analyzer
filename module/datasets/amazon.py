from pandas import read_csv

__all__ = ["amazon_sample"]

def amazon_sample():
    return read_csv("./categorization/data_sample.csv")