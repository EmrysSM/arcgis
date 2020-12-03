import { subclass, property } from "esri/core/accessorSupport/decorators";
import Widget from "esri/widgets/Widget";
import { renderable, tsx } from "esri/widgets/support/widget";

const CSS = {
    base: "esri-hello-world",
    emphasis: "esri-hello-world--emphasis"
};

@subclass("esri.widgets.HelloWorld")
class HelloWorld extends Widget {
    constructor(params?: any) {
        super(params);
    }
}