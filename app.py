from flask import Flask, render_template
from waitress import serve
import webbrowser
import threading

app = Flask(__name__)

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
