import math
from astroquery.vizier import Vizier
import astropy.units as u
from astropy.coordinates import SkyCoord
import numpy as np
import json

# Configure Vizier to show all columns and increase row limit
Vizier.ROW_LIMIT = 100000
Vizier.columns = ['Vmag','*']

# Query the HIPPARCOS catalog
catalog = "I/239/hip_main"
result = Vizier.query_constraints(
    catalog=catalog,
    Vmag="<6",
    order="Vmag"
)

hipparcos_data = result[0]

# Define metadata structure
metadata = '''[
{"name": "id", "datatype": "long", "xtype": null, "arraysize": null, "description": "Unique source identifier (unique within a particular Data Release)", "unit": null, "ucd": "meta.id", "utype": null},
{"name": "ra", "datatype": "double", "xtype": null, "arraysize": null, "description": "Right ascension", "unit": "deg", "ucd": "pos.eq.ra;meta.main", "utype": "stc:AstroCoords.Position3D.Value3.C1"},
{"name": "dec", "datatype": "double", "xtype": null, "arraysize": null, "description": "Declination", "unit": "deg", "ucd": "pos.eq.dec;meta.main", "utype": "stc:AstroCoords.Position3D.Value3.C2"},
{"name": "parallax", "datatype": "double", "xtype": null, "arraysize": null, "description": null, "unit": null, "ucd": null, "utype": null},
{"name": "dist", "datatype": "float", "xtype": null, "arraysize": null, "description": "Distance from GSP-Phot Aeneas best library using BP\/RP spectra", "unit": "pc", "ucd": "pos.distance;pos.eq", "utype": null},
{"name": "magnitude", "datatype": "float", "xtype": null, "arraysize": null, "description": "G-band mean magnitude", "unit": "mag", "ucd": "phot.mag;em.opt", "utype": null},
{"name": "bp_rp_color", "datatype": "float", "xtype": null, "arraysize": null, "description": "BP - RP colour", "unit": "mag", "ucd": "phot.color;em.opt.B;em.opt.R", "utype": null}
]'''

# Process star data
data = []
data_str = ""
for star in hipparcos_data:
    if star['Plx'] > 0:
        distance = 1000 / star['Plx']  # Convert milliarcseconds to parsecs
    else:
        continue
        
    # Calculate approximate temperature from B-V color index
    if 'B-V' in star.columns and star['B-V'] is not None:
        temp = 4600 * (1/(0.92 * star['B-V'] + 1.7) + 1/(0.92 * star['B-V'] + 0.62))
    else:
        temp = None
    star_entry = [
        int(star['HIP']),  # id
        float(star['RAICRS']),  # ra
        float(star['DEICRS']),  # dec
        float(star['Plx']),  # parallax
        float(distance),  # dist
        float(star['Vmag']),  # magnitude
        float(star['B-V']),  # bp_rp_color (using B-V)
        float(temp) # temperature
    ]
    bad = False
    for i in star_entry:
        if (i is None or math.isnan(i)):
            bad = True
    if bad == False:
        data.append(star_entry)
        data_str += str(star_entry)+',\n'

# Create the final JSON structure
output = '''{"metadata":\n'''+metadata+''',
"data": 
[
'''+data_str[:-2]+'''
]
}'''


# Save it to a .json file
with open("src/app/sky/star_data/brightest_stars.json", "w") as f:
    f.write(output)