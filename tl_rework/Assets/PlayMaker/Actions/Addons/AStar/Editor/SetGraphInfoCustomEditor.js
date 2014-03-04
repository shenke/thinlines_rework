import HutongGames.PlayMaker;
import HutongGames.PlayMaker.Actions;
import HutongGames.PlayMakerEditor;



@CustomActionEditor(typeof(setGraphInfo))
public class SetGraphCustomEditor extends CustomActionEditor
{
	
    function OnGUI() : boolean
    {
	  	var aTarget : setGraphInfo = target as setGraphInfo;
		
		EditField("graphType");
		EditField("graph");
		EditField("drawGizmos");
		EditField("infoScreenOpen");
		EditField("open");
		EditField("initialPenalty");
		EditField("name");
		EditField("nodes");
		EditField("everyFrame");	
		
		if(aTarget.graphType == aTarget.GraphType.pointGraph){
			EditField("autoLinkNodes");
			EditField("limits");
			EditField("mask");
			EditField("maxDistance");
			EditField("raycast");
			EditField("recursive");
			EditField("searchTag");
			EditField("thickRaycast");
			EditField("thickRaycastRadius");
		}
		if(aTarget.graphType == aTarget.GraphType.gridGraph){
			EditField("size");
			EditField("scans");
			EditField("getNearestForceOverlap");

		}		

			
		return GUI.changed;
    }	

}