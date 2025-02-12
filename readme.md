# A simple map of Vienna in the Shadowrun Universe (ca. 2054)

This map is built from a single GeoJson file containing all map information and displayed via [OpenLayers](https://openlayers.org/) and [Vite](https://vitejs.dev/).

Live example:

[<img src="https://raw.githubusercontent.com/jonovotny/sr-vienna-2054/refs/heads/main/images/vienna2050-promo.jpg" width="500px" align="center">](https://jonovotny.github.io/sr-vienna-2054/)

To run it, install [npm](https://docs.npmjs.com/downloading-and-installing-node-js-and-npm), check out this repository, and run:
cd <check-out directory>
npm install
npm start
This should start a local webserver to view the map at http://localhost:5173.

# Controls

Once on the map you can use the layer control to toggle the visibility of the city border, the (condensed) districts, neighborhoods and points of interest within the districts, and finally, the security ratings for each area (which are turned off by default). Clicking on any map feature will create a popup with more information. This text is either paraphrased from the source, or made up by me, the source indicator in the bottom left of the popup should tell you where I got the data from. You can also view my personal comments on specific areas with the toggle button on the right (most of the homebrew areas include a justification there).

# Data-Sources

Most of the information on this map was inspired by the second edition book "Walzer, Punks und schwarzes ICE", which covers Vienna extensively.

However, I have made the following changes:

* I have adjusted some of the borders of the map found on page 155 to align with currently existing district and state borders. Even though data was lost in the crash, district boundaries are often physically marked in Austria, so annexing entire districts of the surrounding would make more sense to me.
* That map also indicates that Vienna's airport is now part of the city, so I extended the southeastern border to actually include it (since it is a bit farther away than indicated on the WP&SI map and is included in the map of 2080 in Datapuls Österreich).
* Even though the source book indicates that Vienna still has 23 districts in 2050, I consolidated them into 12 larger ones based on my own knowledge of the city. On the same basis I added security ratings to districts and smaller neighborhoods. This is completely homebrew (but hopefully reasonable).
* From the source it is unclear where the border of extrateritorial area Transdanubien should be. It started out as the entire city area northeast of the Danube, but Vienna expanded afterwards. I have decided to treat this additional area as a district of Vienna and not as part of Transdanubien in 2054. However, the "Datapuls Österreich" source book shows that the area has been taken over by the year 2080.
* I added some homebrew traffic infrastructure that would have likely developed in response to the Vereinigte Wohnparks and Transdanubien being blocked for through traffic. This includes: 
  * The Lobautunnel, which is a real and highly-controversial infrastructure project to build a tunnel under a natural reserve. It connects Transdanubien to the Vienna airport and would definitely have been realized by megacorps.
  * A new bridge at the northwestern end of Transdanubien, to avoid disconnecting Vienna from the entirety of north-eastern Austria.
* There is a small homebrew neighborhood in the Groß-Enzersdorf area, which is part of my campaign :P

# Geojson Properties
I decided to add a few data entries to each location in the geojson file. Here are the details:

> "properties": {
> 
> > "name": "EMC Werk Aspern", -> The name of the feature, used as title of the popup box
> > 
> > "source": "homebrew", -> Reference to the source material if there is one (e.g. SR2e WP&SI p.123)
> > 
> > "type": "neighborhood", -> The general type of this feature, this defines on which map layer it will be placed
> > 
> > "spec": "corp", -> The specific type difining the visual style (e.g. which icon to use in point features)
> > 
> > "details": { -> The detail text for the popup box in german and english
> > 
> > > "de": "Nachdem Opel [...]",
> > >
> > > "en": "After Opel's [...]"
> > 
> > },
> > 
> > "security": "AA", -> The (optional) security rating of polygon features (generates an extra feature on the security ratings layer)
> > 
> > "securityDetails": { -> The detail text for the security layer popup box in german and english
> > 
> > > "de": "Zusätzlich zu [...]",
> > > "en": "In addition to [...]"
> > 
> > },
> > 
> > "comment": "All your base are belong [...]" -> optional author comment
> 
> }

# Why not just use Google Maps?

Doing this in javascript gives me much more control over the visual style (e.g. new visually matching street features) and it also allows me to create certain map features automatically, e.g. non-overlapping security zones.

# How to edit the data?

Currently, this map viewer does not include ways to change or add areas. It's on my TODO list, but I won't make any promises.
In the meantime I recommend [GeoJson.io](https://geojson.io) and [Vector](https://vector.rocks/) as online editing tools to edit the "maps/Sr-Vienna-2054.geojson" file.

# Legal Disclaimer
The Topps Company, Inc. has sole ownership of the names, logo, artwork, marks, photographs, sounds, audio, video and/or any proprietary material used in connection with the game Shadowrun. The Topps Company, Inc. has granted permission to sr-vienna-2054 to use such names, logos, artwork, marks and/or any proprietary materials for promotional and informational purposes on its website but does not endorse, and is not affiliated with sr-vienna-2054 in any official capacity whatsoever.