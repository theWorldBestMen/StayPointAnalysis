# import numpy as np
# import json
# import geog
# import shapely.geometry
# p = shapely.geometry.Point([-90.0667, 29.9500])
# 
# n_points = 20
# d = 10 * 1000  # meters
# angles = np.linspace(0, 360, n_points)
# polygon = geog.propagate(p, angles, d)
# print(json.dumps(shapely.geometry.mapping(shapely.geometry.Polygon(polygon))))
# print(polygon)

import pandas as pd
import numpy as np

df = pd.read_csv('../pg_trigger/location_data/30-CYR.csv')
# new_df = df['devicetime']
# 
new_df = df['devicetime']
print(new_df.head())
new_df.set_index('devicetime')
# new_df = new_df.set_index(new_df['devicetime'])
# print(new_df.resample('W-MON').sum())

# idx = pd.date_range('2021-12-30',periods=10,freq='min')
# df = pd.DataFrame(index=idx, data=[0,1,2,3,4,5,6,7,8,9],columns=['col'])
# print(df)
# print(df.resample(rule='3T').sum())

