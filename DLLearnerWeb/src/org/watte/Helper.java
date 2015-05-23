package org.watte;

public class Helper {

	/**
	 * Inside the configuration the name of the corresponding knowledge source is set.
	 * This method extract this name and returns it, because we use it as name for the configuration file.
	 * (e.g. "father")
	 * @param confContent String: configuration content
	 * @return String configuration name
	 */
	public static String getConfigurationName(String confContent) {
		String ksDefinition = getKSDefinition(confContent);
		
		String configurationName = ksDefinition.substring(0, ksDefinition.indexOf("."));
		
		return configurationName;
	}
	
	/**
	 * Returns the ks.fileName section of the configuration. (e.g. "father.owl")
	 * @param confContent String: configuration content
	 * @return String ks.fileName value.
	 */
	private static String getKSDefinition(String confContent) {
		String ksDefinition = "";
		
		int positionOfKSDefinition = confContent.indexOf("ks.fileName");
		int firstQuotationMark = confContent.indexOf("\"", positionOfKSDefinition);
		int secondQuotationMark = confContent.indexOf("\"", firstQuotationMark+1);
		
		ksDefinition = confContent.substring(firstQuotationMark+1, secondQuotationMark);
		
		return ksDefinition;
	}
	
	/**
	 * Returns the name of the knowledge source file, descriped inside the configuration
	 * @param confContent String: configuration content
	 * @return String Name of knowledge source file. (e.g. father.owl)
	 */
	public static String getKnowledgeFileName(String confContent) {
		String ksName = "";
		
		ksName = getKSDefinition(confContent);
		
		return ksName;
	}
}
