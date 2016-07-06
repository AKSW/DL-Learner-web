var app = angular.module("dllEditor", ["dllModules"]);

app.service("EditorService", ["$log", "ModulesService", function($log, ModulesService) {

    /*
        List of all components.
     */
    var Components = [];

    /**
     * Function will return the short name of a given component.
     * Currently this is done by using the componentUsage text. But later this should be done by using 
     * the components shortname, and if this fails, the component actual name.
     * @param  {Object} component A component object
     * @return {String}           The name/type/short-name of this component
     */
    function extractComponentType(component) {
        var componentUsage = component.componentUsage;
        var firstQuotation = componentUsage.indexOf("\"");
        var secondQuotation = componentUsage.indexOf("\"", firstQuotation + 1);

        var typeDeclaration = componentUsage.substring(firstQuotation + 1, secondQuotation);

        return typeDeclaration;
    }

    /**
     * Function tries to find a component object by a declared .type value.
     * E.g. ks.type = "KB File" will find the component with name "KB File"
     * @param  {String} line        A line of the configuration
     * @return {Object|false}       A component object or false, if no component with this type as name is found.
     */
    var getComponentByType = function(line) {
        // Create a copy of the components-list.
        var allComponents = angular.copy(Components);

        // Look for the two quotations containing the component.type declaration.
        var firstQuotation = line.indexOf("\"", line.indexOf(".type"));
        var secondQuotation = line.indexOf("\"", firstQuotation + 1);

        // If the component type is declared, try to find a corresponding component
        if (firstQuotation != -1 && secondQuotation != -1) {

            // Iterate through all components
            for (var posComp in allComponents) {
                var currentComponent = allComponents[posComp];

                // extract components type-declaration
                var compType = extractComponentType(currentComponent);

                // extract the components type, the user wrote.
                var usersCompType = line.substring(firstQuotation + 1, secondQuotation);

                // If the users component type was found, return the found component object.
                if (compType == usersCompType) return currentComponent;
            }
        }

        // When everythings falling apart, false will be returned 
        return false;
    };


    /**
     * Function tries to parse an attribute.
     * E.g. "kb.fileName = 'hans.owl'". Attribute 'fileName' has the value 'hans.owl'.
     * 
     * @param  {String} line                A line of the configuration
     * 
     * @param  {String} userPrefix          The variable name the user gave this component
     * 
     * @return {Object|undefined}           An object containing 'attributeName' and 'attributeValue', or undefined, when no 
     *                                      attribute could be parsed.
     */
    var parseAttribute = function(line, userPrefix) {

        var variableName = userPrefix + ".";
        var variableNamePosition = line.indexOf(variableName);

        //If we're unable to find the 
        if (variableNamePosition === -1) return;

        // We'll add the length of variableName, so
        // it marks the start of attributes name.
        variableNamePosition += variableName.length;

        // get the index of the end of attribute declaration. 
        // E.g ks.fileName<HERE> = "father.owl"
        // OR ks.fileName<HERE>="father.owl"
        var positionAttributeEnd = line.indexOf(" =");
        if (positionAttributeEnd == -1) positionAttributeEnd = line.indexOf("=");

        // If the positionAttributeEnd is still -1, the user has not typed it yet.
        if (positionAttributeEnd == -1) return;

        // storing the user typed attribute name.
        var attribute;
        // storing the user typed attribute value
        var attributeValue;

        // Save the attribute name. So, with 'ks.fileName = "hans"' the attribute will be 'fileName'.
        attribute = line.substring(variableNamePosition, positionAttributeEnd);

        // If we're unable to parse the attribute name, or the attribute's name is "type", we'll skip.
        if (!attribute || attribute === "type") return;

        /*
            Check for attributes value.
         */
        var valueStart = line.indexOf("=", positionAttributeEnd) + 1;
        var valueEnd = line.length;


        // When the value is not typed yet, we'll skip.
        if (valueStart == -1) return;

        // Extract the attributes value. Cut of leading and trailing whitespaces.
        attributeValue = line.substring(valueStart + 1, valueEnd).trim();

        // If there's no attribute value yet, we'll skip.
        if (!attributeValue) return;

        //TODO: Remove " or ' from attributeValue

        //When we found an attribute and an attributeValue, the for-loop is
        //exited by returning an object containing those two values.
        return {
            attributeName: attribute,
            attributeValue: attributeValue
        };

    };


    /**
     * Function parses the configuration currently present in the editor
     * and returns a set of components with applied options.
     * @param  {string} configuration The editor's current text, respectively the configuration.
     * @return {Array}               List of components
     */
    var parseConfiguration = function(configuration) {

        // For easier parsing, the text will be converted into an array.
        // Each entry stands for a line.
        var lines = configuration.split("\n");
        $log.debug(lines);

        // This objects stores the mapping from user-created component-variables
        // to the corresponding component object.
        var userComponentMap = {};

        for (var pos in lines) {
            var line = lines[pos];
            /*
                Component Check. 
                Assuming, every initial component line
                is declaring the component with '.type'
             */
            if (line.indexOf(".type") != -1) {
                // Extract the variable name, the user gave this component.
                var prefix = line.substring(0, line.indexOf(".type"));

                // Try to get a component by the users ".type" declaration.
                // If a component was found, the variable prefix is saved.
                var component = getComponentByType(line);
                if (component) {
                    //TODO: I dont think both are necessary.
                    component.componentvariable = prefix;
                    userComponentMap[prefix] = component;
                }
            } else {
                /*
                    Attribute Check.
                 */
                for (var userPrefix in userComponentMap) {
                    var compObject = userComponentMap[userPrefix];
                    var attribute = parseAttribute(line, userPrefix);

                    if (!attribute) continue;

                    // Update components option fields.
                    // First, find the right option
                    for (var idxOption in compObject.componentOptions) {

                        if (compObject.componentOptions[idxOption].optionName == attribute.attributeName) {
                            // When we found the right option, set the value.
                            compObject.componentOptions[idxOption].optionValue = attribute.attributeValue;
                        }
                    }
                }
            }
        }

        //asdasd
        var userComponents = [];

        for (var idx in userComponentMap) {
            userComponents.push(userComponentMap[idx]);
        }

        $log.debug(userComponentMap);
    };


    /*
        Register a callback for when the modules arrived, therefor the components arrived.
     */
    ModulesService.getData(function(data) {

        Components = data.components;
    });

    return {
        parseConfiguration: parseConfiguration
    };

}]);

/**
 * This directive initializes and shows the CodeMirror-Texteditor.
 */
app.directive("dllEditor", [function() {

    var controller = ["$scope", "$log", "EditorService", function($scope, $log, EditorService) {

        /*
            Variable holds the instance of CodeMirror
         */
        var cmEditor;

        var onChangeCodeMirror = function() {
            // Avoid a synchronization from editor to toolbox when the user is 
            // currently working in the toolbox.
            if (!cmEditor.hasFocus()) return;

            // The current content of the editor
            var configuration = cmEditor.getValue();

            // Let the EditorService parse the configuration and do further handling.
            EditorService.parseConfiguration(configuration);

            //selectedComponentsService.setComponents(userComponents);
        };

        var initializeCodeMirror = function() {

            // get the editors default textarea which will be replaced by a CodeMirror-Instance
            var configTextarea = document.getElementById("dll-editor");

            // Initialize CodeMirror
            cmEditor = CodeMirror(function(elt) {
                configTextarea.parentNode.replaceChild(elt, configTextarea);
            }, {
                // show linenumbers
                lineNumbers: true,
                // syntax mode: JavaScript (for now)
                mode: 'ebnf',
                // ScrollbarStyle (refers to script 'simplescrollbars.js' and 'simplescrollbars.css')
                scrollbarStyle: 'simple',
                // prevent CodeMirrors default Drop-Actions
                dragDrop: false,
                // enable autocomplete.
                // TODO wirte own hint-logic
                //extraKeys: {"Ctrl-Space": "autocomplete"},
                pollInterval: 1000
            });

            //Handling the synchro from editor to toolbox, when the editor's content changes.
            cmEditor.on("change", function() {
                onChangeCodeMirror();
            });
        };

        initializeCodeMirror();
    }];

    return {
        restrict: 'E',
        scope: {},
        templateUrl: '../../views/partials/dll-editor-template.htm',
        controller: controller
    };

}]);
