import numpy as np
from sklearn.preprocessing import StandardScaler
import pickle

with open('scaler.pkl', 'rb') as f:
    scaler = pickle.load(f)

def preprocess_input(data):
    return [[
        data['weather_code'], data['apparent_temperature_mean'], data['sunset'], data['rain_sum'],
        data['snowfall_sum'], data['precipitation_hours'],
        data['wind_gusts_10m_max'], data['wind_direction_10m_dominant'], data['et0_fao_evapotranspiration']
    ]]
    
