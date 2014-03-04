import HutongGames.PlayMaker;
import HutongGames.PlayMaker.Actions;
import HutongGames.PlayMakerEditor;



@CustomActionEditor(typeof(getGraphInfo))
public class GetGraphCustomEditor extends CustomActionEditor
{
	
    function OnGUI() : boolean
    {
	  	var aTarget : getGraphInfo = target as getGraphInfo;
		
		EditField("graphType");
		EditField("graph");
		EditField("guid");
		EditField("drawGizmos");
		EditField("infoScreenOpen");
		EditField("open");
		EditField("initialPenalty");
		EditField("name");
		EditField("nodes");
		EditField("everyFrame");	
		
		if(aTarget.graphType == aTarget.GraphType.pointGraph){
			EditField("root");
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