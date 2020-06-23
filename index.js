const { GeoPoint } = require('@google-cloud/firestore');

function geoPointToPoint(geoPoint) {
  return [geoPoint.getLongitude(), geoPoint.getLatitude()];
}

function nestedArrayToObjectArray(nested, fn = null) {
  return nested.reduce((acc,val,i) => {
    acc[i] = fn ? val.map(fn) : val;
    return acc;
  }, {});
}

exports.docToGeo = (doc) => {
  return doc;
}

exports.geoToDoc = (geojson, opts = {}) => {
  let doc = {};
  const geoCoords = geojson.geometry.coordinates;

  function pointToGeoPoint(point) {
    // the point is reversed as GeoJSON=[lng,lat] and GeoPoint=[lat,lng]
    return opts.precision ? new GeoPoint(...point.reverse().map(p => 1 * p.toFixed(opts.precision))) 
      : new GeoPoint(...point);
  }

  if (geojson.properties) doc.properties = geojson.properties; 

  if (geojson.geometry) {
    doc.geometry = {
      coordinates: [],
      type: geojson.geometry.type,
    };

    switch (geojson.geometry.type) {
      case 'Point':
        doc.geometry.coordinates = pointToGeoPoint(geoCoords);
        break;

      case 'MultiPoint':
      case 'LineString':
        doc.geometry.coordinates = geoCoords.map(p => pointToGeoPoint(p));

      case 'Polygon':
      case 'MultiLineString':
        doc.geometry.coordinates = nestedArrayToObjectArray(geoCoords, pointToGeoPoint)
        break;

      case 'MultiPolygon':
        let polygons = nestedArrayToObjectArray(geoCoords);
        for (const polygon in polygons) {
          doc.geometry.coordinates[polygon] = nestedArrayToObjectArray(polygons[polygon], pointToGeoPoint)
        }
        break;

      default:

    }
  }

  return doc;
}

