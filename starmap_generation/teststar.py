from astroquery.vizier import Vizier

# Create a Vizier instance to access the HD Catalogue
vizier = Vizier(columns=["HD", "Bmag", "Vmag", "Teff", "Radius", "BP_RP"], row_limit=500)

# Query the HD Catalogue, selecting the 500 brightest stars based on Vmag
result = vizier.query_constraints(catalog="III/135A", Vmag="<7.0")  # Modify the Vmag limit as needed

# Convert the result to a Pandas DataFrame
hd_stars = result[0].to_pandas()

# Optionally, filter out any stars with missing data
hd_stars_filtered = hd_stars.dropna(subset=['BP_RP', 'Teff', 'Radius'])

# Display the relevant columns
print(hd_stars_filtered[['HD', 'BP_RP', 'Teff', 'Radius']])
