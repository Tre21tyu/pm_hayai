from flask import Flask, render_template
from waitress import serve
import webbrowser
import threading
import os
import sys

# Get the correct paths when running as an executable
def resource_path(relative_path):
    """Get absolute path to resource, works for dev and for PyInstaller"""
    base_path = getattr(sys, '_MEIPASS', os.path.dirname(os.path.abspath(__file__)))
    return os.path.join(base_path, relative_path)

# Initialize Flask with the correct template folder
template_folder = resource_path('templates')
static_folder = resource_path('static')
app = Flask(__name__, template_folder=template_folder, static_folder=static_folder)

@app.route('/')
def index():
    return render_template('index.html')  # Serves your HTML file

def open_browser():
    webbrowser.open("http://127.0.0.1:5000", new=2)  # Open the URL in a new window/tab

if __name__ == '__main__':
    # Open the web browser window once when the application starts
    threading.Thread(target=open_browser).start()

    # Serve the app using Waitress
    serve(app, host='127.0.0.1', port=5000)