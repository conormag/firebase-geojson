# firebase-geojson
An [RFC7946](https://tools.ietf.org/html/rfc7946)-compliant library to interchangeably convert between GeoJSON objects and Firestore documents.


## Functions

### geoToDoc()

```geoToDoc(GeoJsonObj, options)```

`options = {precision: <number>}`

-precision (optional) - number of decimal places to trim coordinate values to.