package org.watte.datamodel;

public class Option {


    private String optionName;
    private String optionDescription;
    private String optionRequired;
    private String optionType;
    private String optionDefaultValue;
    private String optionUsage;




    public String getOptionName() {
        return optionName;
    }

    public void setOptionName(String optionName) {
        this.optionName = optionName;
    }

    public String getOptionDescription() {
        return optionDescription;
    }

    public void setOptionDescription(String optionDescription) {
        this.optionDescription = optionDescription;
    }
    
    public String getOptionRequired() {
    	return optionRequired;
    }
    
    public void setOptionRequired(String optionRequired) {
    	this.optionRequired = optionRequired;
    }

    public String getOptionType() {
        return optionType;
    }

    public void setOptionType(String optionType) {
        this.optionType = optionType;
    }

    public String getOptionDefaultValue() {
        return optionDefaultValue;
    }

    public void setOptionDefaultValue(String optionDefaultValue) {
        this.optionDefaultValue = optionDefaultValue;
    }

    public String getOptionUsage() {
        return optionUsage;
    }

    public void setOptionUsage(String optionUsage) {
        this.optionUsage = optionUsage;
    }
}
