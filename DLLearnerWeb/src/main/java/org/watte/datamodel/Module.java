package org.watte.datamodel;

import java.util.ArrayList;

public class Module {

	private String moduleName;
    private ArrayList<Component> moduleComponents = new ArrayList<Component>();

    public String getModuleName() {
        return moduleName;
    }

    public void setModuleName(String moduleName) {
        this.moduleName = moduleName;
    }

    public ArrayList<Component> getModuleComponents() {
        return moduleComponents;
    }

    public void addModuleComponents(Component component) {
        this.moduleComponents.add(component);
    }

    public void setModuleComponents(ArrayList<Component> moduleComponents) {
        this.moduleComponents = moduleComponents;
    }
}
