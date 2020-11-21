import React, { useEffect, useRef } from "react";
import { loadModules } from "esri-loader";

const WebMapView = () => {
  const mapRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    // lazy load the required ArcGIS API for JavaScript modules and CSS
    loadModules(
      [
        "esri/Map",
        "esri/views/MapView",
        "esri/widgets/BasemapToggle",
        "esri/widgets/LayerList",
        "esri/layers/FeatureLayer",
      ],
      { css: true }
    ).then(([ArcGISMap, MapView, BasemapToggle, LayerList, FeatureLayer]) => {
      const map = new ArcGISMap({
        basemap: "topo-vector",
      });

      // load the map view at the ref's DOM node
      const view = new MapView({
        container: mapRef.current,
        map: map,
        center: [-84.388, 33.749],
        zoom: 11,
      });

      const toggle = new BasemapToggle({
        view: view,
        nextBasemap: "satellite",
      });

      view.ui.add(toggle, "bottom-right");

      var layerList = new LayerList({
        view: view,
      });
      // Adds widget below other elements in the top left corner of the view
      view.ui.add(layerList, {
        position: "top-left",
      });

      var trailheadsLayer = new FeatureLayer({
        url:
          "https://services3.arcgis.com/GVgbJbqm8hXASVYi/arcgis/rest/services/Trailheads/FeatureServer/0",
      });

      map.add(trailheadsLayer);

      // Trails feature layer (lines)
      var trailsLayer = new FeatureLayer({
        url:
          "https://services3.arcgis.com/GVgbJbqm8hXASVYi/arcgis/rest/services/Trails/FeatureServer/0",
      });

      map.add(trailsLayer, 0);

      // Parks and open spaces (polygons)
      var parksLayer = new FeatureLayer({
        url:
          "https://services3.arcgis.com/GVgbJbqm8hXASVYi/arcgis/rest/services/Parks_and_Open_Space/FeatureServer/0",
      });

      map.add(parksLayer, 0);

      return () => {
        if (view) {
          // destroy the map view
          view.destroy();
        }
      };
    });
  });

  return <div className="webmap" ref={mapRef} />;
};

export default WebMapView;
