from astropy.coordinates import SkyCoord
from astropy import units as u

# Function to adjust star view relative to the planet's position
def star_view_from_planet(star_params, planet_coords):
    # Extract star parameters
    ra_star = star_params['RA']
    dec_star = star_params['Dec']
    distance_star = star_params['Distance']
    size_star = star_params['Size']
    color_star = star_params['Color']
    
    # Extract planet coordinates (RA, Dec, Distance)
    ra_planet, dec_planet, distance_planet = planet_coords
    
    # Create SkyCoord objects for the star and planet
    star_coord = SkyCoord(ra=ra_star * u.deg, dec=dec_star * u.deg, distance=distance_star * u.pc, frame='icrs')
    planet_coord = SkyCoord(ra=ra_planet * u.deg, dec=dec_planet * u.deg, distance=distance_planet * u.pc, frame='icrs')
    
    # Convert to Cartesian coordinates
    star_cartesian = star_coord.cartesian
    planet_cartesian = planet_coord.cartesian
    
    # Calculate relative position of the star as viewed from the planet
    relative_position = star_cartesian - planet_cartesian
    
    # Convert relative position back to spherical coordinates (SkyCoord)
    relative_skycoord = SkyCoord(relative_position, frame='icrs')
    
    # Return the adjusted star coordinates, size, and color
    return {
        'Coordinates': relative_skycoord,
        'RA': relative_skycoord.ra.deg,
        'Dec': relative_skycoord.dec.deg,
        'Size': size_star,
        'Color': color_star
    }