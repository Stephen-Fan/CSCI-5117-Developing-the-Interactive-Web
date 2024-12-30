from flask import Flask, request, render_template, redirect, url_for, jsonify
from survey_app.models import db, SurveyResponse
from survey_app.config import Config
from collections import Counter, defaultdict
from datetime import datetime
from dotenv import load_dotenv
from flask_migrate import Migrate


load_dotenv()

app = Flask(__name__)
app.config.from_object(Config)
DATABASE_URL = app.config.get('SQLALCHEMY_DATABASE_URI')

db.init_app(app)                # initialize the db
migrate = Migrate(app, db)

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/thanks')
def thanks():
    return render_template('thanks.html')

@app.route('/decline')
def decline():
    return render_template('decline.html')

@app.route('/survey', methods=['GET', 'POST'])
def survey():
    if request.method == 'POST':
        first_name = request.form['fname']
        last_name = request.form['lname']
        radio_option = request.form['radio_option']
        select_option = request.form['select_option']
        checkbox_value = 'checkbox' in request.form
        optional_text = request.form.get('optional_text', '')
        
        
        if not first_name or not last_name or not radio_option or not select_option:
            # flash("All required fields must be filled out!", "error")
            return redirect(url_for('survey'))
        
        response = SurveyResponse(
            first_name=first_name,
            last_name=last_name,
            radio_option=radio_option,
            select_option=select_option,
            checkbox_value=checkbox_value,
            optional_text=optional_text
        )
        
        db.session.add(response)
        db.session.commit()
        
        return redirect(url_for('thanks'))
    
    return render_template('survey.html')

@app.route('/api/results', methods=['GET'])
def api_results():
    reverse = request.args.get('reverse', 'false').lower() == 'true'
    query = SurveyResponse.query.order_by(SurveyResponse.id.desc() if reverse else SurveyResponse.id)
    return jsonify([response.as_dict() for response in query.all()])

@app.route('/admin/summary')
def admin_summary():
    responses = SurveyResponse.query.all()
    choice_counts = Counter([response.radio_option for response in responses])
    select_counts = Counter([response.select_option for response in responses])

    # Count the number of responses per day
    date_format = "%Y-%m-%d"
    responses_per_day = defaultdict(int)
    for response in responses:
        specific_date = response.timestamp.strftime(date_format)
        responses_per_day[specific_date] += 1

    date_labels  = sorted(responses_per_day.keys())
    responses_per_day_values = [responses_per_day[date] for date in date_labels]

    return render_template(
        'summary.html',
        responses=responses,  # List of all survey responses
        choice_counts=choice_counts,
        select_counts=select_counts,
        date_labels=date_labels ,  # Dates for time series chart
        responses_per_day_values=responses_per_day_values   # Number of responses per day
    )

if __name__ == "__main__":
    with app.app_context():
        db.create_all()
    
    app.run(debug=True)