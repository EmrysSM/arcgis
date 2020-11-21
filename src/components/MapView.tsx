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

      var trailheadsRenderer = {
        type: "simple",
        symbol: {
          type: "picture-marker",
          url: "http://static.arcgis.com/images/Symbols/NPS/npsPictograph_0231b.png",
          width: "18px",
          height: "18px"
        }
      };

      var trailheadsLabels = {
        symbol: {
          type: "text",
          color: "#FFFFFF",
          haloColor: "#5E8D74",
          haloSize: "2px",
          font: {
            size: "12px",
            family: "Noto Sans",
            style: "italic",
            weight: "normal"
          }
        },
        labelPlacement: "above-center",
        labelExpressionInfo: {
          expression: "$feature.TRL_NAME"
        }
      };

      var trailheadsLayer = new FeatureLayer({
        url:
          "https://services3.arcgis.com/GVgbJbqm8hXASVYi/arcgis/rest/services/Trailheads/FeatureServer/0",
        renderer: trailheadsRenderer,
        labelingInfo: [trailheadsLabels],
      });

      map.add(trailheadsLayer);

      var trailsRenderer = {
        type: "simple",
        symbol: {
          color: "#BA55D3",
          type: "simple-line",
          style: "solid"
        },
        visualVariables: [
          {
            type: "size",
            field: "ELEV_GAIN",
            minDataValue: 0,
            maxDataValue: 2300,
            minSize: "3px",
            maxSize: "7px"
          }
        ]
      };

      // Trails feature layer (lines)
      var trailsLayer = new FeatureLayer({
        url:
          "https://services3.arcgis.com/GVgbJbqm8hXASVYi/arcgis/rest/services/Trails/FeatureServer/0",
        renderer: trailsRenderer,
        opacity: 0.75
      });

      map.add(trailsLayer, 0);

      let bikeTrailsRenderer = {
        type: "simple",
        symbol: {
          type: "simple-line",
          style: "short-dot",
          color: "#FF91FF",
          width: "1px"
        }
      };

      let bikeTrails = new FeatureLayer({
        url:
          "https://services3.arcgis.com/GVgbJbqm8hXASVYi/arcgis/rest/services/Trails/FeatureServer/0",
        renderer: bikeTrailsRenderer,
        definitionExpression: "USE_BIKE = 'YES'"
      });

      map.add(bikeTrails, 1);

      function createFillSymbol(value: string, color: string) {
        return {
          value: value,
          symbol: {
            color: color,
            type: "simple-fill",
            style: "solid",
            outline: {
              style: "none",
            }
          },
          label: value
        };
      };

      let openSpacesRenderer = {
        type: "unique-value",
        field: "TYPE",
        uniqueValueInfos: [
          createFillSymbol("Natural Areas", "#9E559C"),
          createFillSymbol("Regional Open Space", "#A7C636"),
          createFillSymbol("Local Park", "#149ECE"),
          createFillSymbol("Regional Recreation Park", "#ED5151")
        ]
      };

      // Parks and open spaces (polygons)
      var parksLayer = new FeatureLayer({
        url:
          "https://services3.arcgis.com/GVgbJbqm8hXASVYi/arcgis/rest/services/Parks_and_Open_Space/FeatureServer/0",
        renderer: openSpacesRenderer,
        opacity: 0.2
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
