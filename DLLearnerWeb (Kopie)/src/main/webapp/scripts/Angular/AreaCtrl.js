angular.module('dllearner_frontend').controller('AreaCtrl', function($scope, $log, selectedComponentsService, componentsService) {

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
        //enable autocomplete.
        //TODO wirte own hint-logic
        //extraKeys: {"Ctrl-Space": "autocomplete"},
        pollInterval: 1000
    });

    
    //Handling the synchro from editor to selection 
    cmEditor.on("change", function() {
        if (cmEditor.hasFocus()) {

            //avoid having references.
            var allComponents = angular.copy(componentsService.getComponents());

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

                //TODO Relict?
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
                                //apply the variable name.
                                currentComponent.componentVariable = prefix;
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
                    //storing the user typed attribute value
                    var attributeValue = null;

                    //if the start and end markers for attribute name were found
                    if (variableNamePosition != -1 && positionAttributeEnd != -1) {
                        //save the attribute name.
                        attribute = line.substring(variableNamePosition, positionAttributeEnd);
                    }

                    //if the attribute following the prefix is not 'type'
                    if (attribute != null && attribute != "type") {

                        //this would be just the check for String-values.
                        //TODO: Numbers, Booleans, Arrays
                        var firstQuotation = line.indexOf("\"");
                        var secondQuotation = line.indexOf("\"", firstQuotation + 1);

                        if (firstQuotation != -1 && secondQuotation != -1) {
                            attributeValue = line.substring(firstQuotation + 1, secondQuotation);
                        }

                        //when no quotation marks have been found, its probably a number or boolean.
                        if (firstQuotation == -1 && secondQuotation == -1) {
                            //ensure, that the user can write "ks.test = abc" or
                            //"ks.test =abc". The space between equalsign and value 
                            //would be prettier, but it is not necessary.
                            var positionAttributeValueStart = line.indexOf("= ");

                            if (positionAttributeValueStart == -1) {
                                positionAttributeValueStart = line.indexOf("=");
                            } else {
                                positionAttributeValueStart += 2;
                            }

                            if (positionAttributeValueStart == -1) {
                                positionAttributeValueStart += 1;
                            }
                            //end ensurance.

                            if (positionAttributeValueStart != -1) {
                                attributeValue = line.substring(positionAttributeValueStart);
                            }

                        }

                        //if an attribute value has been found, apply it.
                        if (attributeValue != null) {

                            //update components option fields
                            //first, find the right option
                            for (var posOpt in compObject.componentOptions) {

                                if (compObject.componentOptions[posOpt].optionName == attribute) {
                                    //when we find the right option, set the value.
                                    compObject.componentOptions[posOpt].optionValue = attributeValue;
                                }
                            }
                        }
                    }
                }
            }

            //asdasd
            var userComponents = [];

            for (var pos in userComponentMap) {
                userComponents.push(userComponentMap[pos]);
            }

            selectedComponentsService.setComponents(userComponents);

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
