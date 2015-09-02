/**
 * 
 */
var app = angular.module('dllearner_frontend', []);

//Storing components, the user selected.
app.service('selectedComponentsService', function($rootScope, $log) {
    var selectedComponents = [];

    return {
        getComponents: function() {
            return selectedComponents;
        },
        addComponent: function(component) {
            selectedComponents.push(component);
        },
        setComponents: function(components) {
           
            selectedComponents = components;
            //sending broadcast, that the components have changed.
            //ToolboxCtrl will react on it.
            $rootScope.$broadcast('selectedComponentsChanged', components);
        }
    }
});

//Storing all avaiable components.
app.service('componentsService', function() {
    var components = [];

    return {
        getComponents: function() {
            return components;
        },
        addComponent: function(component) {
            components.push(component);
        }
    }
});

//Angular itself does not provide a object-oriented class functionality.
//There exists a workaround using factories.
app.factory('ComponentFactory', function() {

    /**
     * Pseudo-Constructor.
     * componentName, componentUsage, componentVariable are Strings, whereas componentVariable can be empty/null.
     * componentOptions is an Array of componentOptions-Objects.
     */
    function ComponentFactory(componentName, componentUsage, componentOptions, componentVariable) {
        this.componentName = componentName;
        this.componentUsage = componentUsage;
        this.componentOptions = componentOptions;
        if (componentVariable != null) {
            this.componentVariable = componentVariable;
        }
    }

    ComponentFactory.build = function(data) {
        return new ComponentFactory(
            data.componentName,
            data.componentUsage,
            data.componentOptions,
            data.componentVariable
        );
    }

    return ComponentFactory;

});

app.factory('ComponentOptionsFactory', function() {

    function ComponentOptionsFactory(optionName, optionDescription, optionType, optionRequired, optionDefault, optionUsage) {
        this.optionName = optionName;
        this.optionDescription = optionDescription;
        this.optionType = optionType;
        this.optionRequired = optionRequired;
        this.optionDefault = optionDefault;
        this.optionUsage = optionUsage;
    }

    return ComponentOptionsFactory;

});


//add an keylistener to close module_canvas when ESC is pressed
$(document).keyup(function(event) {
    if (event.which == 27) {
        $("#module_canvas").hide(0);
    }
});
