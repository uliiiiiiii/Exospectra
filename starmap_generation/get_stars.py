import time
from astroquery.gaia import Gaia

def getStars(output_file="stars_data.txt"):
    # Set the row limit before launching the job
    LIMIT = 200000
    MAGNITUDE_LIMIT = 60
    Gaia.ROW_LIMIT = LIMIT  # Adjust this to the number of stars you need
    # Launch the query
    # job = Gaia.launch_job(query, dump_to_file=True, output_format='json')
    job = Gaia.launch_job(
        f"SELECT TOP {LIMIT}"
        " g.source_id AS id,"
        " g.ra AS ra,"
        " g.dec AS dec,"
        " 1 / g.distance_gspphot AS parallax,"
        " g.distance_gspphot AS dist,"
        # " IF_THEN_ELSE('g.distance_gspphot IS NOT NULL AND g.parallax IS NOT NULL', g.distance_gspphot, 1 / g.parallax) AS dist"
        " g.phot_g_mean_mag AS magnitude,"
        " g.bp_rp AS bp_rp_color,"
        " g.teff_gspphot AS temperature"
        " FROM gaiadr3.gaia_source AS g"
        " WHERE"
        f" g.phot_g_mean_mag < {MAGNITUDE_LIMIT}"
        " AND g.bp_rp IS NOT NULL"
        " AND g.phot_g_mean_mag IS NOT NULL"
        " AND g.distance_gspphot IS NOT NULL"
        " ORDER BY g.distance_gspphot ASC",
    dump_to_file=True, 
    output_format='json', 
    output_file='src/app/sky/star_data/stars.json')
    job = Gaia.launch_job(
        f"SELECT TOP {LIMIT}"
        " g.source_id AS id,"
        " g.ra AS ra,"
        " g.dec AS dec,"
        " g.parallax / 1000 AS parallax,"
        " 1000 / g.parallax AS dist,"
        " g.phot_g_mean_mag AS magnitude,"
        " g.bp_rp AS bp_rp_color,"
        " g.teff_gspphot AS temperature"
        " FROM gaiadr3.gaia_source AS g"
        " WHERE"        
        f" g.phot_g_mean_mag < {MAGNITUDE_LIMIT}"
        " AND g.bp_rp IS NOT NULL"
        " AND g.phot_g_mean_mag IS NOT NULL"
        " AND g.distance_gspphot IS NULL"
        " AND g.parallax IS NOT NULL"
        " ORDER BY g.parallax DESC",
    dump_to_file=True, 
    output_format='json', 
    output_file='src/app/sky/star_data/stars2.json')
    job = Gaia.launch_job(
        f"SELECT TOP {LIMIT}"
        " g.source_id AS id,"
        " g.ra AS ra,"
        " g.dec AS dec,"
        " 1 / g.distance_gspphot AS parallax,"
        " g.distance_gspphot AS dist,"
        # " IF_THEN_ELSE('g.distance_gspphot IS NOT NULL AND g.parallax IS NOT NULL', g.distance_gspphot, 1 / g.parallax) AS dist"
        " g.phot_g_mean_mag AS magnitude,"
        " g.bp_rp AS bp_rp_color,"
        " g.teff_gspphot AS temperature"
        " FROM gaiadr3.gaia_source AS g"
        " WHERE"
        f" g.phot_g_mean_mag < {MAGNITUDE_LIMIT}"
        " AND g.bp_rp IS NOT NULL"
        " AND g.phot_g_mean_mag IS NOT NULL"
        " AND g.distance_gspphot IS NOT NULL"
        " AND g.parallax IS NOT NULL"
        " ORDER BY g.phot_g_mean_mag ASC",
    dump_to_file=True, 
    output_format='json', 
    output_file='src/app/sky/star_data/stars3.json')
    job = Gaia.launch_job(
        f"SELECT TOP {LIMIT}"
        " g.source_id AS id,"
        " g.ra AS ra,"
        " g.dec AS dec,"
        " g.parallax / 1000 AS parallax,"
        " 1000 / g.parallax AS dist,"
        " g.phot_g_mean_mag AS magnitude,"
        " g.bp_rp AS bp_rp_color,"
        " g.teff_gspphot AS temperature"
        " FROM gaiadr3.gaia_source AS g"
        " WHERE"
        f" g.phot_g_mean_mag < {MAGNITUDE_LIMIT}"
        " AND g.bp_rp IS NOT NULL"
        " AND g.phot_g_mean_mag IS NOT NULL"
        " AND g.distance_gspphot IS NULL"
        " AND g.parallax IS NOT NULL"
        " ORDER BY g.phot_g_mean_mag ASC",
    dump_to_file=True, 
    output_format='json', 
    output_file='src/app/sky/star_data/stars4.json')
    # results = job.get_results()

    # # Convert results to a pandas DataFrame
    # stars_df = results.to_pandas()

    # # Write the DataFrame to a space-separated txt file
    # stars_df.to_csv(output_file, sep=' ', index=False, header=True)

    # print(f"Data saved to {output_file}")
    # print(f"Length {len(stars_df)}")
    # return stars_df

t1 = time.time()
# Example usage
getStars("starmap_generation/stars_data_by_stuff.txt")

t2 = time.time()
print(f"Time:{t2-t1}")