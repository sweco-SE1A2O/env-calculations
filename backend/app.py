import os
from flask import Flask, request, jsonify, send_from_directory
from flask_cors import CORS
from calculations import monte_carlo_simulation, create_histogram, plot_avsankning_vs_avstand, plot_median_vs_avstand

# Flask-konfiguration
app = Flask(__name__, static_folder='frontend', static_url_path='')
CORS(app)  # Lägg till detta för att aktivera CORS

# Route för att serva React-frontendens filer
@app.route('/')
@app.route('/<path:path>')
def serve_frontend(path=''):
    if path != "" and os.path.exists(os.path.join(app.static_folder, path)):
        return send_from_directory(app.static_folder, path)
    else:
        return send_from_directory(app.static_folder, 'index.html')
    
@app.route('/api/monte_carlo', methods=['POST'])
def monte_carlo():
    data = request.get_json()
    iterations = data.get('iterations')
    K_min = data.get('K_min')
    K_max = data.get('K_max')
    W_min = data.get('W_min')
    W_max = data.get('W_max')
    H0_min = data.get('H0_min')
    H0_max = data.get('H0_max')
    hs = data.get('hs')
    srp = data.get('srp')
    L = data.get('L')
    lower_percentile = data.get('lower_percentile', 10)  # Standardvärde
    upper_percentile = data.get('upper_percentile', 90)   # Standardvärde

    results = monte_carlo_simulation(iterations, K_min, K_max, W_min, W_max, H0_min, H0_max, hs, srp, L, lower_percentile, upper_percentile)

    # Strukturera resultaten för att matcha frontend-förväntningarna
    return jsonify({
        "paverkanavstand": {
        "min": results['stats_paverkanavstand'][0],
        "lower_percentile": results['stats_paverkanavstand'][1],
        "median": results['stats_paverkanavstand'][2],
        "upper_percentile": results['stats_paverkanavstand'][3],
        "max": results['stats_paverkanavstand'][4],
    },
    "influensavstand": {
        "min": results['stats_influensavstand'][0],
        "lower_percentile": results['stats_influensavstand'][1],
        "median": results['stats_influensavstand'][2],
        "upper_percentile": results['stats_influensavstand'][3],
        "max": results['stats_influensavstand'][4],
    },
    "ensidigt_inflode": {
        "min": results['stats_ensidigt_inflode'][0],
        "lower_percentile": results['stats_ensidigt_inflode'][1],
        "median": results['stats_ensidigt_inflode'][2],
        "upper_percentile": results['stats_ensidigt_inflode'][3],
        "max": results['stats_ensidigt_inflode'][4],
    },
    })

@app.route('/api/monte_carlo_histogram', methods=['POST'])
def monte_carlo_histogram():
    data = request.get_json()
    iterations = data.get('iterations')
    K_min = data.get('K_min')
    K_max = data.get('K_max')
    W_min = data.get('W_min')
    W_max = data.get('W_max')
    H0_min = data.get('H0_min')
    H0_max = data.get('H0_max')
    hs = data.get('hs')
    srp = data.get('srp')
    L = data.get('L')
    lower_percentile = data.get('lower_percentile', 10)  # Standardvärde
    upper_percentile = data.get('upper_percentile', 90)  # Standardvärde

    results = monte_carlo_simulation(iterations, K_min, K_max, W_min, W_max, H0_min, H0_max, hs, srp, L, lower_percentile, upper_percentile)

    # Generera histogram och skicka explicit in `upper_percentile`
    histogram_base64 = create_histogram(
        results["results_first"],
        results["results_second"],
        results["stats_influensavstand"],
        results["stats_paverkanavstand"],
        srp,
        upper_percentile,
        lower_percentile
    )

    return jsonify({
        "histogram": histogram_base64
    })

@app.route('/api/monte_carlo_plot', methods=['POST'])
def monte_carlo_line_chart():

    data = request.get_json()
    iterations = data.get('iterations')
    K_min = data.get('K_min')
    K_max = data.get('K_max')
    W_min = data.get('W_min')
    W_max = data.get('W_max')
    H0_min = data.get('H0_min')
    H0_max = data.get('H0_max')
    hs = data.get('hs')
    srp = data.get('srp')
    L = data.get('L')
    lower_percentile = data.get('lower_percentile', 10)  # Standardvärde
    upper_percentile = data.get('upper_percentile', 90)  # Standardvärde

    line_chart_base64 = plot_avsankning_vs_avstand(
        iterations, K_min, K_max, W_min, W_max, H0_min, H0_max, hs, srp, L, lower_percentile, upper_percentile
    )

    return jsonify({
        "line_chart": line_chart_base64
    })

@app.route('/api/median_vs_avstand_plot', methods=['POST'])
def median_vs_avstand_plot():
    data = request.get_json()
    iterations = data.get('iterations')
    K_min = data.get('K_min')
    K_max = data.get('K_max')
    W_min = data.get('W_min')
    W_max = data.get('W_max')
    H0_min = data.get('H0_min')
    H0_max = data.get('H0_max')
    hs = data.get('hs')
    srp = data.get('srp')
    L = data.get('L')
    sakerhetsfaktor = data.get('sakerhetsfaktor')

    plot_base64 = plot_median_vs_avstand(
        iterations, K_min, K_max, W_min, W_max, H0_min, H0_max, hs, srp, L, sakerhetsfaktor
    )

    return jsonify({
        "median_vs_avstand_plot": plot_base64
    })

if __name__ == '__main__':
    port = int(os.getenv("PORT", 5000))
    app.run(host='0.0.0.0', port=port, debug=True)