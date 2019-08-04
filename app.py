import os
import math
import numpy as np
import pandas as pd
import datetime as dt
import pytz 
import sqlalchemy
from sqlalchemy.ext.automap import automap_base
from sqlalchemy.orm import Session
from sqlalchemy import create_engine, func, inspect, desc
from flask_cors import CORS
from flask import (
    Flask,
    render_template,
    jsonify,
    redirect)

from flask_sqlalchemy import SQLAlchemy
import requests

app = Flask(__name__)
CORS(app)

app.config['SQLALCHEMY_DATABASE_URI'] = "sqlite:///db/scores.sqlite"

db = SQLAlchemy(app)

class Scores(db.Model):
    __tablename__= 'scores'

    id = db.Column(db.Text, primary_key=True)
    Name = db.Column(db.Text)
    Raw = db.Column(db.Text)
    Handicap = db.Column(db.Text)
    Adjusted = db.Column(db.Text)
    time = db.Column(db.Text)   
    course_id = db.Column(db.Text)

    def __repr__(self):
        return '<scores %r>' % (self.name)

@app.before_first_request
def setup():
    print("set up")
    # db.drop_all()
    db.create_all()
    

@app.route("/")
def home():
    """Render Home Page."""
    return render_template("base.html")

@app.route("/stats/<player1>/<player2>")
def stats_data(player1, player2):
    """Return stats"""
    player1_name = player1.replace('_',' ')
    player2_name = player2.replace('_',' ')
    results1 = db.session.query(Scores.Name, Scores.Raw, Scores.Handicap, Scores.Adjusted,
    Scores.time, Scores.course_id).\
    filter_by(Name = player1_name).\
    limit(20000).all()

    results2 = db.session.query(Scores.Name, Scores.Raw, Scores.Handicap, Scores.Adjusted,
    Scores.time, Scores.course_id).\
    filter_by(Name = player2_name).\
    limit(20000).all()

    print(results1, results2)

    

    results = [results1, results2]
    
    return jsonify(results)

@app.route("/weather/<course>/<date>")
def weather_data(course, date):
    """Return weather prediction"""
    course = int(course)
    course_info_df = pd.read_csv('static/data/course_data.csv')
    course_lat = course_info_df.loc[course_info_df.course == course,'lat'].values[0]
    course_lon = course_info_df.loc[course_info_df.course == course,'lon'].values[0]
    # First get the forecast -- API recall returns entire day's worth of data
    API_Key = os.environ['DARKSKY_KEY']
    base_url = 'https://api.darksky.net/forecast/'
    course_lat = str(course_lat)
    course_lon = str(course_lon) 
    url = base_url + API_Key + '/' + course_lat + ',' + course_lon + ',' + date + 'T12:00:00?exclude=current,flags'
    # Forecast will be a list of dictionaries 
    forecast = requests.get(url).json()
    list_1 = []

    list_1.append(forecast['hourly']['data'][10]['windBearing'])
    list_1.append(forecast['hourly']['data'][10]['windGust'])
    list_1.append(forecast['hourly']['data'][10]['precipIntensity'])
    # return(jsonify(forecast['hourly']['data'][10]['windGust']))
    return(jsonify(list_1))

@app.route("/score_model/<player1>/<player2>/<course>/<date>")
def model_data(player1, player2, course, date):
    """Return score prediction"""

    def is_dst_USPacific(date):
        """Check whether Daylight Savings Time is in effect in the US Pacific timezone 
        for given date in YYYY-MM-DD format, using 5 AM as a test time (do not use for times before 3 AM)"""
        game_date = dt.date.fromisoformat(date)
        dst_test_time = dt.datetime.combine(game_date, dt.time.fromisoformat('05:00:00'))
        # Localize time to US Pacific and compute numbers of hours it is offset from UTC.  If 7, then DST is in effect.
        dst_in_effect = False
        check_UTC_offset = (pytz.timezone('US/Pacific').localize(dst_test_time).utcoffset().seconds / 3600 - 24) * -1
        if check_UTC_offset == 7.0:
            dst_in_effect = True
        return dst_in_effect

    # Convert input as needed
    try:
        course = int(course)
    except ValueError:
        course = 0

    # Import course data 
    course_info_df = pd.read_csv('static/data/course_data.csv')
    course_lat = course_info_df.loc[course_info_df.course == course,'lat'].values[0]
    course_lon = course_info_df.loc[course_info_df.course == course,'lon'].values[0]
    # First get the forecast -- API recall returns entire day's worth of data
    API_Key = os.environ['CYAN_KEY']
    base_url = 'https://api.darksky.net/forecast/'
    course_lat = str(course_lat)
    course_lon = str(course_lon) 
    url = base_url + API_Key + '/' + course_lat + ',' + course_lon + ',' + date + 'T12:00:00?exclude=current,flags'
    # Forecast will be a list of dictionaries 
    forecast = requests.get(url).json()

    # To decode the dictionaries, we need the UTC timestamp for midnight on the date
    # Note that both Dark Skies and Python use timezone-unaware indexing 
    time_offset = dt.datetime.fromisoformat(date).timestamp()
    # Search for hours 6 to 21 (6AM to 9PM) using timestamp as key
    start_time = int(time_offset + 3600 * 6)
    end_time = int(time_offset + 3600 * 22)
   
    times_list = [tstamp for tstamp in range(start_time, end_time, 3600)]
    # Retrieve weights to go with each time 
    if is_dst_USPacific(date):
        weights_list = course_info_df.loc[(course_info_df.course == course) & \
            ((course_info_df.dst == 'yes') | (course_info_df.dst == 'all'))].values[0][4:]
    else:
         weights_list = course_info_df.loc[(course_info_df.course == course) & \
            ((course_info_df.dst == 'yes') | (course_info_df.dst == 'all'))].values[0][4:]      
    # Retrieve weather data to go with each time
    # First create lists with default "missing" values (-99)
    temperature_list = [-99 for _ in range(16)]
    wind_speed_list = [-99 for _ in range(16)]
    wind_gust_list = [-99 for _ in range(16)]
    wind_dir_list = [-99 for _ in range(16)]
    precip_list = [-99 for _ in range(16)]
    # Now work through the forecast data, adding info at the right places if found
    for wx_dict in forecast['hourly']['data']:
        try:
            hour_of_day = int((int(wx_dict['time']) - time_offset)/ 3600)
            if (hour_of_day < 6) or (hour_of_day) > 21:
                continue   #Skip this wx_dict if an invalid hour is found
        except (ValueError, KeyError):
                continue   #Skip this wx_dict if the time is not a number or not present
        try:
            forecast_temperature = float(wx_dict['temperature'])
        except (ValueError, KeyError):
            forecast_temperature = -99
        try:
            forecast_wind_speed = float(wx_dict['windSpeed'])
        except (ValueError, KeyError):
            forecast_wind_speed = -99       
        try:
            forecast_wind_gust = float(wx_dict['windGust'])
        except (ValueError, KeyError):
            forecast_wind_gust = -99
        try:
            forecast_wind_dir = float(wx_dict['windBearing'])
        except (ValueError, KeyError):
            forecast_wind_dir = -99      
        try:
            forecast_precip = float(wx_dict['precipIntensity'])
        except (ValueError, KeyError):
            forecast_precip = -99
        wx_data_index = hour_of_day - 6
        temperature_list[wx_data_index] = forecast_temperature
        wind_speed_list[wx_data_index] = forecast_wind_speed
        wind_gust_list[wx_data_index] = forecast_wind_gust
        wind_dir_list[wx_data_index] = forecast_wind_dir
        precip_list[wx_data_index] = forecast_precip
    # End of for loop

    # Now compute the weighted average weather conditions from the list
    # In these cases, we use a custom method to properly handle missing values
    # Note that the sum of contributing weights can be different for each variable
    weighted_T, weighted_w_spd, weighted_w_gust, weighted_w_dir, weighted_precip = \
        (0 for _ in range(5))
    n_weighted_T, n_weighted_w_spd, n_weighted_w_gust, n_weighted_w_dir, n_weighted_precip = \
        (0 for _ in range(5))
    for ix in range(16):
        if temperature_list[ix] > -99:
            weighted_T += temperature_list[ix] * weights_list[ix]
            n_weighted_T += weights_list[ix]
        if wind_speed_list[ix] >= 0:
            weighted_w_spd += wind_speed_list[ix] * weights_list[ix]
            n_weighted_w_spd += weights_list[ix]           
        if wind_gust_list[ix] >= 0:
            weighted_w_gust += wind_gust_list[ix] * weights_list[ix]
            n_weighted_w_gust += weights_list[ix]    
        if wind_dir_list[ix] >= 0:
            weighted_w_dir += wind_dir_list[ix] * weights_list[ix]
            n_weighted_w_dir += weights_list[ix]    
        if precip_list[ix] >= 0:
            weighted_precip += precip_list[ix] * weights_list[ix]
            n_weighted_precip += weights_list[ix]    

    if(n_weighted_T > 0):
        weighted_T /= n_weighted_T
    else:
        weighted_T = 60    # Special case:  we want a non-zero default value
    if(n_weighted_w_spd > 0):
        weighted_w_spd /= n_weighted_w_spd
    if(n_weighted_w_gust > 0):
        weighted_w_gust /= n_weighted_w_gust
    if(n_weighted_w_dir > 0):
        weighted_w_dir /= n_weighted_w_dir
    if(n_weighted_precip > 0):
        weighted_precip /= n_weighted_precip

    # Now do the special computation for wind direction variation
    weighted_dirvar = 0
    n_weighted_dirvar = 0
    for ix,wind_dir in enumerate(wind_dir_list):
        if wind_dir >= 0:
            dir_diff = wind_dir - weighted_w_dir
            if dir_diff > 180:
                dir_diff = wind_dir - 360 - weighted_w_dir
            if dir_diff < -180:
                dif_diff = wind_dir - weighted_w_dir + 360
            weighted_dirvar += dir_diff * dir_diff * weights_list[ix]
            n_weighted_dirvar += weights_list[ix]
    if n_weighted_dirvar > 0:
        weighted_dirvar /= n_weighted_dirvar

    # Generate prediction based on model

    model_df =  pd.read_csv('static/data/score_model.csv')
    player1_ns = player1.replace('_',' ')
    player2_ns = player2.replace('_',' ')
    player1_data = model_df.loc[(model_df['player'] == player1_ns) & (model_df['course_id'] == course)]
    player2_data = model_df.loc[(model_df['player'] == player2_ns) & (model_df['course_id'] == course)]
    player1_ngames = player1_data.mean()['n_values']
    player2_ngames = player2_data.mean()['n_values']
    player1_score = player1_data.mean()['intercept'] + \
        player1_data.mean()['cumgame_coeff'] * (player1_ngames + 1) +\
        player1_data.mean()['T_coeff'] * weighted_T +\
        player1_data.mean()['wspd_coeff'] * weighted_w_spd +\
        player1_data.mean()['wgust_coeff'] * weighted_w_gust +\
        player1_data.mean()['dirvar_coeff'] * weighted_dirvar +\
        player1_data.mean()['precip_coeff'] * weighted_precip 
    player2_score = player2_data.mean()['intercept'] + \
        player2_data.mean()['cumgame_coeff'] * (player2_ngames + 1) +\
        player2_data.mean()['T_coeff'] * weighted_T +\
        player2_data.mean()['wspd_coeff'] * weighted_w_spd +\
        player2_data.mean()['wgust_coeff'] * weighted_w_gust +\
        player2_data.mean()['dirvar_coeff'] * weighted_dirvar +\
        player2_data.mean()['precip_coeff'] * weighted_precip 
    player1_var = player1_data.mean()['mse']
    player2_var = player2_data.mean()['mse']
    score_diff = player2_score - player1_score
    score_var = player1_var + player2_var
    score_se = np.sqrt(score_var)
    score_z = score_diff / score_se
    odds = (1.0 + math.erf(score_z / np.sqrt(2.0))) / 2.0
    if np.isnan(player1_score):
        player1_score = 0
    if np.isnan(player2_score):
        player2_score = 0
    if np.isnan(odds):
        odds = 0.5
    list2 = []
    list2.append(player1_score)
    list2.append(player2_score)
    list2.append(odds)

    return(jsonify(list2))

@app.route("/players")
def list_players():
    """Returns list of players in format last, first alphabetized by last"""

    results = db.session.query(Scores.Name).\
    limit(20000).all()

    names_list = [result[0] for result in results]
    # Reduce to unique names 
    names_list = list(set(names_list))
    alphalast = [name.split()[-1] + ", " + name.split()[0] for name in names_list]
    alphalast = sorted(alphalast)
    return (jsonify(alphalast))


if __name__ == '__main__':
    app.run(debug=True)

