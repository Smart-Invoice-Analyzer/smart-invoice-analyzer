from pandas import read_csv

def amazon(rows=None):
    if rows:
        match rows:
            case 11:
                return read_csv("./datasets/df_11k.csv")
            case 22:
                return read_csv("./datasets/df_22k.csv")
            case 55:
                return read_csv("./datasets/df_55k.csv")
            case 110:
                return read_csv("./datasets/df_110k.csv")
            case 220:
                return read_csv("./datasets/df_220k.csv")
            case 550:
                return read_csv("./datasets/df_550k.csv")
            case _:
                return None
    else:
        return read_csv("./datasets/data.csv")
    
def amazon_summarized(rows=55):
    if rows:
        match rows:
            case 11:
                return read_csv("./datasets/summarized/df_11k_summarized.csv")
            case 22:
                return read_csv("./datasets/summarized/df_22k_summarized.csv")
            case 55:
                return read_csv("./datasets/summarized/df_55k_summarized.csv")
            case _:
                return None
    else:
        return None
    
def sample(df, percentage:float):
    from sklearn.model_selection import train_test_split
    _, df_sample = train_test_split(df, 
                                test_size=percentage, 
                                stratify=df['main_category'], 
                                random_state=42)
    return df_sample