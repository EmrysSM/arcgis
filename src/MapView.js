import React, { useEffect, useRef } from 'react';
import { loadModules } from 'esri-loader';

const WebMapView = () => {
    const mapRef = useRef();

    useEffect(
      () => {
        // lazy load the required ArcGIS API for JavaScript modules and CSS
        loadModules(['esri/Map', 'esri/views/MapView', 'esri/widgets/BasemapToggle', 'esri/widgets/LayerList', 'esri/layers/FeatureLayer'], { css: true })
        .then(([ArcGISMap, MapView, BasemapToggle, LayerList, FeatureLayer]) => {
          const map = new ArcGISMap({
            basemap: 'topo-vector'
          });

          // load the map view at the ref's DOM node
          const view = new MapView({
            container: mapRef.current,
            map: map,
            center: [-84.388, 33.749],
            zoom: 11
          });

          const toggle = new BasemapToggle({
            view: view,
            nextBasemap: "satellite",
          });

          view.ui.add(toggle, "bottom-right");

          var layerList = new LayerList({
            view: view
          });
          // Adds widget below other elements in the top left corner of the view
          view.ui.add(layerList, {
            position: "top-left"
          });

          var trailheadsLayer = new FeatureLayer({
            url:
              "https://services3.arcgis.com/GVgbJbqm8hXASVYi/arcgis/rest/services/Trailheads/FeatureServer/0"
          });
          
          map.add(trailheadsLayer);

          return () => {
            if (view) {
              // destroy the map view
              view.destroy();
            }
          };
        });
      }
    );

    return <div className="webmap" ref={mapRef} />;
};

export default WebMapView;