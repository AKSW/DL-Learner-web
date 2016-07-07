var app = angular.module("dllEditor", ["dllModules"]);

app.service("EditorService", ["$timeout", "$log", "ModulesService", "UserComponentsService", function($timeout, $log, ModulesService, UCS) {

    /*
        List of all components.
     */
    var Components = [];

    /*
        List of last known user selected components.
        Used for event chaining.
     */
    var selectedComponents = [];

    /*
        A list of callbacks to be executed when the editor content changes.
     */
    var subscribers = [];


    /**
     * Function executes every saved callback with editor's content as parameter.
     * 
     * @param  {String} content The editor's current configuration content.
     */
    var notifySubscribers = function(content) {
        for (var pos in subscribers) {
            subscribers[pos](content);
        }
    };


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

                // extract the components type, the user wrote.
                var usersCompType = line.substring(firstQuotation + 1, secondQuotation);

                // If the users component type was found, return the found component object.
                if (currentComponent.shortName == usersCompType) return currentComponent;
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

        // If we're unable to find the 
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
        attribute = line.substring(variableNamePosition, positionAttributeEnd).trim();

        // If we're unable to parse the attribute name, or the attribute's name is "type", we'll skip.
        if (!attribute || attribute === "type") return;

        /*
            Check for attributes value.
         */
        var valueStart = line.indexOf("=") + 1;

        // When the value is not typed yet, we'll skip.
        if (valueStart == -1) return;

        // Extract the attributes value. Cut of leading and trailing whitespaces.
        attributeValue = line.substring(valueStart).trim();

        // If there's no attribute value yet, we'll skip.
        if (!attributeValue) return;

        // TODO: Remove " or ' from attributeValue

        // When we found an attribute and an attributeValue, 
        // return an object containing those two values.
        return {
            attributeName: attribute,
            attributeValue: attributeValue
        };
    };


    /**
     * Function parses the configuration currently present in the editor
     * and returns a set of components with applied options.
     * 
     * @param  {string} configuration   The editor's current text, respectively the configuration.
     * 
     * @return {Array}                  List of components
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

            // Skip comments
            if (line.indexOf("//") == 0) continue;

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
                    component.componentVariable = prefix;
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

                    $log.debug(attribute);
                    $log.debug(compObject);

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

        var userComponents = [];
        for (var idx in userComponentMap) {
            userComponents.push(userComponentMap[idx]);
        }

        $log.debug(userComponents);

        selectedComponents = userComponents;

        // Because the configuration parsing is triggered by the javascript native event "onChange",
        // it is not part of the Angular digest-cycle. Therefore the update of usercomponents
        // needs to be wraped in an Angular timeout function, which will be part of the digest-cycle.
        $timeout(function() {
            UCS.setComponents(userComponents);
        });
    };


    /**
     * This function will create a text-configuration for a given set of components and options.
     * 
     * @param  {Array}  selectedComponents An array of user selected components with options.
     */
    var createConfiguration = function(selectedComponents) {

        // The text to be inserted into the editor.
        var content = "";

        for (var compIdx in selectedComponents) {
            var curComp = selectedComponents[compIdx];

            // Add a comment above each component area with the name of the component.
            content += "//" + curComp.componentName;

            // Start with component declaration. componentVariable can be the default or 
            // an user selected value
            content += curComp.componentVariable + '.type = "' + curComp.shortName + '"\n';

            for (var optIdx in curComp.componentOptions) {
                var curOption = curComp.componentOptions[optIdx];

                // If the avaiable option has no value set, it will not be part of the configuration.
                if (!curOption.optionValue) continue;

                // Add the component variable, the option name and the option value.
                content += curComp.componentVariable + "." + curOption.optionName + ' = ' + curOption.optionValue + "\n";
            }

            content += "\n\n";
        }

        return content;
    };


    /*
        Register a callback for when the modules arrived, therefor the components arrived.
     */
    ModulesService.getData(function(data) {

        Components = data.components;
    });

    UCS.onNewComponents(function(newComponents) {
        if (JSON.stringify(newComponents) === JSON.stringify(selectedComponents)) return;

        var content = createConfiguration(newComponents);
        notifySubscribers(content);
    });

    return {
        parseConfiguration: parseConfiguration,
        subscribe: function(cb) {
            subscribers.push(cb);
        }
    };

}]);

/**
 * This directive initializes and shows the CodeMirror-Texteditor.
 */
app.directive("dllConfigurationEditor", [function() {

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


        EditorService.subscribe(function(content) {

            if (!cmEditor) {
                $log.warn("Editor Service notified dllEditor, but no CodeMirror instance is avaiable.");
                return;
            }

            cmEditor.setValue(content);
        });


        initializeCodeMirror();
    }];

    return {
        restrict: 'E',
        scope: {},
        templateUrl: '../../views/partials/dll-editor-template.htm',
        controller: controller
    };

}]);
