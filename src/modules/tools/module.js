"use strict"

import angular from "angular"

import ModuleController from "./controllers/module.js"
import CalculationService from "./services/calculations.js"

let moduleName = "tools"
let module = angular.module(moduleName, [])

module
  .controller("ToolsController", ModuleController)
  .service("CalculationService", CalculationService)

export default moduleName