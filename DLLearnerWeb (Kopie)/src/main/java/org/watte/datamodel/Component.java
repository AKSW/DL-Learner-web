package org.watte.datamodel;

import java.util.ArrayList;

public class Component {


    private String componentName;
    private String componentUsage;
    private ArrayList<Option> componentOptions = new ArrayList<Option>();

    public String getComponentName() {
        return componentName;
    }

    public void setComponentName(String componentName) {
        this.componentName = componentName;
    }

    public String getComponentUsage() {
        return componentUsage;
    }

    public void setComponentUsage(String componentUsage) {
        this.componentUsage = componentUsage;
    }

    public ArrayList<Option> getComponentOptions() {
        return componentOptions;
    }

    public void addComponentOptions(Option option) {
        this.componentOptions.add(option);
    }

    public void setComponentOptions(ArrayList<Option> componentOptions) {
        this.componentOptions = componentOptions;
    }
}
