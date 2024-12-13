import numpy as np
import matplotlib.pyplot as plt
import io
import base64
import matplotlib
matplotlib.use('Agg')

def calculate_first(K, W, H0, hs):
    """Calculate the influence distance R."""
    return np.sqrt((K * ((H0**2) - (hs**2))) / ((W / 1000) / (365 * 86400)))

def calculate_second(K, W, H0, hs, srp, R):
    """Calculate the impact distance rp, with check for negative values."""
    inside_sqrt = (R**2) - (((H0 - srp)**2) - (hs**2)) * K / (W / (1000 * 365 * 86400))
    if inside_sqrt < 0:
        return np.nan
    return R - np.sqrt(inside_sqrt)

def calculate_third(W, L, R):
    """Calculate the inflow Q."""
    return W * L * R / (1000 * 365 * 86400)

def calculate_statistics(results, lower_percentile, higher_percentile):
    """Calculate statistics: min, lower percentile, median, higher percentile, max."""
    results = np.array(results)
    results = results[~np.isnan(results)]  # Remove NaNs

    if results.size == 0:
        return np.nan, np.nan, np.nan, np.nan, np.nan  # Return NaNs if no valid results

    min_val = np.min(results)
    lower_val = np.percentile(results, lower_percentile)
    median_val = np.median(results)
    higher_val = np.percentile(results, higher_percentile)
    max_val = np.max(results)

    return min_val, lower_val, median_val, higher_val, max_val

def monte_carlo_simulation(iterations, K_min, K_max, W_min, W_max, H0_min, H0_max, hs, srp, L, lower_percentile=10, higher_percentile=90):
    """Run a Monte Carlo simulation and return statistics for the results."""
    results_first = []
    results_second = []
    results_third = []

    for _ in range(iterations):
        K = np.random.lognormal(mean=np.log((K_min * K_max)**0.5), sigma=(np.log(K_max) - np.log(K_min)) / (2 * 1.96))
        W = np.random.normal(loc=(W_min + W_max) / 2, scale=(W_max - W_min) / 2 / 1.96)
        H0 = np.random.normal(loc=(H0_min + H0_max) / 2, scale=(H0_max - H0_min) / 2 / 1.96)

        result_first = calculate_first(K, W, H0, hs)
        result_second = calculate_second(K, W, H0, hs, srp, result_first)
        result_third = calculate_third(W, L, result_first)

        results_first.append(result_first)
        results_second.append(result_second)
        results_third.append(result_third)

    # Convert results to NumPy arrays and filter out NaNs
    results_first = np.array(results_first)
    results_second = np.array(results_second)
    results_third = np.array(results_third)

    valid_results_first = results_first[~np.isnan(results_first)]
    valid_results_second = results_second[~np.isnan(results_second)]

    # Calculate statistics for each result set
    stats_first = calculate_statistics(valid_results_first, lower_percentile, higher_percentile)  # Influensavstånd
    stats_second = calculate_statistics(valid_results_second, lower_percentile, higher_percentile)  # Påverkanavstånd
    stats_third = calculate_statistics(results_third[~np.isnan(results_third)], lower_percentile, higher_percentile)  # Ensidigt inflöde
    

    return {
        "stats_influensavstand": stats_first,  # Influensavstånd statistics
        "stats_paverkanavstand": stats_second,  # Påverkanavstånd statistics
        "stats_ensidigt_inflode": stats_third,  # Ensidigt inflöde statistics
        "percentiles_influens": stats_first,
        "percentiles_paverkan": stats_second,
        "results_first": results_first,
        "results_second": results_second,
    }

def plot_avsankning_vs_avstand(iterations, K_min, K_max, W_min, W_max, H0_min, H0_max, hs, specific_srp, L, ned_perc, ov_perc):
    srp_values = np.linspace(0, H0_max - hs, 50)  # Avsänkningsvärden
    percentile10_values = []
    median_values = []
    percentile90_values = []

    for srp in srp_values:
        simulation_results = monte_carlo_simulation(iterations, K_min, K_max, W_min, W_max, H0_min, H0_max, hs, srp, L)
        results_second = simulation_results["results_second"]
        results_second_clean = results_second[~np.isnan(results_second)]
        percentile10_values.append(np.percentile(results_second_clean, ned_perc))
        median_values.append(np.median(results_second_clean))
        percentile90_values.append(np.percentile(results_second_clean, ov_perc))

    plt.figure(figsize=(14, 6), dpi=200)
    plt.plot(percentile10_values, srp_values, '#E59100', label=f'{ned_perc}-percentil')
    plt.plot(median_values, srp_values, '#1C9671', label='Median')
    plt.plot(percentile90_values, srp_values, '#CE353A', label=f'{ov_perc}-percentil')

    plt.axhline(y=specific_srp, color='#8297B0', linestyle='--', linewidth=2, label=f'Påverkansområde = {specific_srp} m')

    plt.xlabel('Avstånd [m]')
    plt.ylabel('Avsänkning [m]')
    plt.title('Avstånd vs. avsänkning')
    plt.gca().invert_yaxis()
    plt.ylim(top=0)
    plt.xlim(left=0)
    plt.legend()
    plt.tight_layout()

    buffer = io.BytesIO()
    plt.savefig(buffer, format='png')
    buffer.seek(0)
    base64_image = base64.b64encode(buffer.read()).decode('utf-8')
    buffer.close()
    plt.close()

    return base64_image


def create_histogram(results1, results2, stats1, stats2, srp_value, upper_percentile, lower_percentile):
    plt.figure(figsize=(14, 6), dpi=200)
    plt.hist(results1, bins=50, alpha=0.5, color='#BC7A00', label='Influensavståndet')
    plt.hist(results2, bins=50, alpha=0.5, color='#0078B5', label='Påverkansområdet')

    # Markera percentiler och median för influensavståndet
    plt.axvline(x=stats1[1], color='#EF9A53', linestyle=':', linewidth=2, alpha=0.6, label=f'{lower_percentile}%-percentil (influens)')
    plt.axvline(x=stats1[2], color='#D87E34', linestyle='--', linewidth=2, alpha=0.6, label='Median (influens)')
    plt.axvline(x=stats1[3], color='#BC631A', linestyle='-.', linewidth=2, alpha=0.6, label=f'{upper_percentile}%-percentil (influens)')

    # Markera percentiler och median för påverkanavståndet
    plt.axvline(x=stats2[1], color='#4088BC', linestyle=':', linewidth=2, alpha=0.5, label=f'{lower_percentile}%-percentil (påverkan)')
    plt.axvline(x=stats2[2], color='#2771A5', linestyle='--', linewidth=2, alpha=0.5, label='Median (påverkan)')
    plt.axvline(x=stats2[3], color='#155D91', linestyle='-.', linewidth=2, alpha=0.5, label=f'{upper_percentile}%-percentil (påverkan)')

    plt.title(f'Monte Carlo-simulering för influens och påverkan ({srp_value} m)')
    plt.xlabel('Avstånd [m]')
    plt.ylabel('Antal')
    plt.legend()
    plt.tight_layout()


    # Spara histogrammet som en byte-ström
    buffer = io.BytesIO()
    plt.savefig(buffer, format='png', bbox_inches='tight')
    buffer.seek(0)
    base64_image = base64.b64encode(buffer.read()).decode('utf-8')
    buffer.close()

    plt.close()
    return base64_image

def plot_median_vs_avstand(iterations, K_min, K_max, W_min, W_max, H0_min, H0_max, hs, specific_srp, L, sak_faktor):
    srp_values = np.linspace(0, H0_max - hs, 50)
    median_values = []
    median_sak_values = []

    for srp in srp_values:
        simulation_results = monte_carlo_simulation(iterations, K_min, K_max, W_min, W_max, H0_min, H0_max, hs, srp, L)
        results_second = simulation_results["results_second"]
        results_second_clean = results_second[~np.isnan(results_second)]
        median_value = np.median(results_second_clean)
        median_values.append(median_value)
        median_sak_values.append(median_value * sak_faktor)

    plt.figure(figsize=(14, 6), dpi=200)
    plt.plot(median_values, srp_values, '#1C9671', label='Avsänkning')
    plt.plot(median_sak_values, srp_values, 'purple', label=f'Avsänkning med säkerhetsfaktorn {sak_faktor}')

    plt.axhline(y=specific_srp, color='#8297B0', linestyle='--', linewidth=2, label=f'Påverkansområde = {specific_srp} m')
    plt.title('Avstånd vs. avsänkning')
    plt.xlabel('Avstånd [m]')
    plt.ylabel('Avsänkning [m]')
    plt.gca().invert_yaxis()
    plt.ylim(top=0)
    plt.xlim(left=0)
    plt.legend()

    buffer = io.BytesIO()
    plt.savefig(buffer, format='png')
    buffer.seek(0)
    base64_image = base64.b64encode(buffer.read()).decode('utf-8')
    buffer.close()
    plt.close()

    return base64_image