import sys
from datetime import datetime
import pandas as pd
import numpy as np
from sklearn.linear_model import LinearRegression


def get_data(filename):
    return pd.read_csv(filename, index_col='Date', parse_dates=['Date'])


def pre_process(df):
    d_freq = df.loc[:, ['Adj Close']]
    # Drop missing values
    d_freq.fillna(value=-99999, inplace=True)
    X = d_freq.index.to_numpy()
    dates = np.reshape(X, (len(X), 1))
    y = d_freq['Adj Close'].to_numpy()
    prices = np.reshape(y, (len(y), 1))
    return dates, prices


def predict_linear(df, z):
    X, y = pre_process(df)
    clf_reg = LinearRegression(n_jobs=-1)
    clf_reg.fit(X, y)
    p_this_date = datetime.strptime(z, '%Y-%m-%d')
    predicted_price = clf_reg.predict(np.array([[29], [600]]))
    print("predicted price: {}".format(predicted_price))
    print("Estimated coefficient: {}".format(clf_reg.coef_))


if __name__ == '__main__':
    file_name = sys.argv[1]
    predict_type = sys.argv[2]
    predict_for = sys.argv[3]
    df = get_data(file_name)
    print(df.info())
    predict_linear(df, predict_for)
