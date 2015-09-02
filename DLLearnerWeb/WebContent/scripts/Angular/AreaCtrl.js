angular.module('dllearner_frontend').controller('AreaCtrl', function($scope, $log, selectedComponents, componentsService) {

    // get textarea for configurations
    var configTextarea = document.getElementById("config_textarea");
    // CodeMirror Instance. Plain HTML-Textarea will be replaced
    var cmEditor = CodeMirror(function(elt) {
        configTextarea.parentNode.replaceChild(elt, configTextarea);
    }, {
        // show linenumbers
        lineNumbers: true,
        // syntax mode: JavaScript (for now)
        mode: 'ebnf',
        // ScrollbarStyle (refers to script 'simplescrollbars.js' and
        // 'simplescrollbars.css')
        scrollbarStyle: 'simple',
        //prevent CodeMirrors default Drop-Actions
        dragDrop: false,
        pollInterval: 1000
    });

    //Handling the synchro from editor to selection 
    cmEditor.on("change", function() {
        if (cmEditor.hasFocus()) {

            var allComponents = componentsService.getComponents();

            //this objects stores the mapping from user-created component-variables
            //to the corresponding component object.
            var userComponentMap = {};

            //get the number of lines inside the editor
            var lineCount = cmEditor.lineCount();
            //array for storing the lines in the editor
            var lines = [];
            //iterate over the number of lines, retrieve each line
            //and store it in 'lines'
            for (var i = 0; i < lineCount; i++) {
                lines.push(cmEditor.getLine(i));
            }

            for (var pos in lines) {
                var line = lines[pos];

                var tempComponent = null;

                //#################
                // Component Check
                //#################
                //.type found. Assuming, every initial component line
                //is declaring the component with .type
                //Trying to find a corresponding component.
                if (line.indexOf(".type") != -1) {
                    //extract variable name
                    var prefix = line.substring(0, line.indexOf(".type"));

                    var firstQuotation = line.indexOf("\"");
                    var secondQuotation = line.indexOf("\"", firstQuotation + 1);

                    //if the type is declared, try to find a corresponding component
                    if (firstQuotation != -1 && secondQuotation != -1) {
                        //iterate through all components
                        for (var posComp in allComponents) {
                            var currentComponent = allComponents[posComp];
                            //extract components type-declaration
                            var compType = extractComponentType(currentComponent.componentUsage);
                            //extract the components type, the user wrote.
                            var usersCompType = line.substring(firstQuotation + 1, secondQuotation);
                            //if the users component type was found
                            if (compType == usersCompType) {
                                tempComponent = currentComponent;
                                userComponentMap[prefix] = currentComponent;
                            }
                        }

                        if (tempComponent == null) {
                            //$log.debug("Unable to find users component '" + (line.substring(firstQuotation + 1, secondQuotation)) + "'");
                        } else {
                            //$log.debug("Found users component '" + tempComponent.componentName + "' with Prefix " + prefix);
                            //$log.debug(userComponentMap);
                        }
                    }
                }

                //#################
                // Attribue Check
                //#################
                //iterate over the component map.
                //where the users prefix is the key, and the component object the value.
                for (var userPrefix in userComponentMap) {
                    var compObject = userComponentMap[userPrefix];

                    var variableName = userPrefix + ".";
                    var variableNamePosition = line.indexOf(variableName);
                    //if variableNamePosition is not -1, we'll add the length of variableName, so
                    //it marks the start of attributes name.
                    if (variableNamePosition != -1) {
                        variableNamePosition += variableName.length;
                    }

                    //get the index of the end of attribute declaration. 
                    //E.g ks.fileName<HERE> = "father.owl"
                    // OR ks.fileName<HERE>="father.owl"
                    var positionAttributeEnd = line.indexOf(" =");
                    if (positionAttributeEnd == -1) {
                        positionAttributeEnd = line.indexOf("=");
                    }
                    //storing the user typed attribute name.
                    var attribute = null;
                    //if the start and end markers for attribute name were found
                    if (variableNamePosition != -1 && positionAttributeEnd != -1) {
                        //save the attribute name.
                        attribute = line.substring(variableNamePosition, positionAttributeEnd);
                    }

                    //if the attribute following the prefix is not 'type'
                    if (attribute != null && attribute != "type") {

                        var firstQuotation = line.indexOf("\"");
                        var secondQuotation = line.indexOf("\"", firstQuotation + 1);

                        if (firstQuotation != -1 && secondQuotation != -1) {
                            var attributeValue = line.substring(firstQuotation + 1, secondQuotation);

                            $log.debug("For component '" + compObject.componentName + "'");
                            $log.debug("Found attribute value '" + attributeValue + "' for attribute '" + attribute + "'");
                        }
                    }
                }
            }
        }
    });



    initializeDropArea();
});

function extractComponentType(componentUsage) {
    var firstQuotation = componentUsage.indexOf("\"");
    var secondQuotation = componentUsage.indexOf("\"", firstQuotation + 1);

    var typeDeclaration = componentUsage.substring(firstQuotation + 1, secondQuotation);

    return typeDeclaration;
}

function initializeDropArea() {
    $("#configurationDrop").on("drop", function(event) {
        event.preventDefault();
        event.stopPropagation();
        console.log("drop");
    });

    $("#configurationDrop").on("dragover", function(event) {
        console.log("dragover");
    });
}
