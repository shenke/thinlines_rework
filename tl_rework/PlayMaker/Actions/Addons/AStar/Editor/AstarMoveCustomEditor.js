import HutongGames.PlayMaker;
import HutongGames.PlayMaker.Actions;
import HutongGames.PlayMakerEditor;

 

@CustomActionEditor(typeof(MoveTo))
public class AstarMoveCustomEditor extends CustomActionEditor
{
	
    function OnGUI() : boolean
    {

	
	  	var aTarget : MoveTo = target as MoveTo;
		
		EditField("targetObjectHelper");
		
		EditField("moveMode");
		if(aTarget.moveMode == aTarget.MoveMode.flee || aTarget.moveMode == aTarget.MoveMode.fleeContinuously || aTarget.moveMode == aTarget.MoveMode.randomPath)
			EditField("length");
		if(aTarget.moveMode == aTarget.MoveMode.follow || aTarget.moveMode == aTarget.MoveMode.followTo || aTarget.moveMode == aTarget.MoveMode.fleeContinuously)
			EditField("updateInterval");	
		if(aTarget.moveMode == aTarget.MoveMode.shadow || aTarget.moveMode == aTarget.MoveMode.shadowTo)
			EditField("shadowUpdateDistance");	
		
		EditField("actor");
		if(aTarget.moveMode == aTarget.MoveMode.followPath){
			EditField("inputPath");
			EditField("updatePath");
				
		}
		if(aTarget.moveMode != aTarget.MoveMode.followPath && aTarget.moveMode != aTarget.MoveMode.randomPath)
		{
			EditField("target");
			EditField("targetPosition");
		}
		EditField("controllerType");
		EditField("auto");
		if(aTarget.moveMode == aTarget.MoveMode.followPath){
			EditField("startAtStart");
			EditField("connectPath");
		}
		EditField("ignoreY");
		EditField("speed");
		
		EditField("smoothTurns");
		if(aTarget.smoothTurns.Value)
			EditField("turnRadius");
		EditField("costDependendSpeed");
		if(!aTarget.smoothTurns.Value)
			EditField("nextWaypointDistance");
		
		EditField("finishDistanceMode");
		if(aTarget.moveMode != aTarget.MoveMode.follow && aTarget.moveMode != aTarget.MoveMode.fleeContinuously)
			EditField ("endOfPathEvent");
		EditField("finishDistance");
		
		if(!(aTarget.moveMode == aTarget.MoveMode.flee || aTarget.moveMode == aTarget.MoveMode.fleeContinuously || aTarget.moveMode == aTarget.MoveMode.randomPath))
		EditField("exactFinish");
		
		EditField("failedEvent");
		
		if(aTarget.moveMode != aTarget.MoveMode.follow && aTarget.moveMode != aTarget.MoveMode.fleeContinuously){
			EditField("failureTolerance");
		}

		EditField ("directionOut");
		
		
		EditField("OutputPath");
		EditField("outputSpeed");
		
		
		EditField("LogEvents");
		EditField ("drawGizmos");

		if(aTarget.drawGizmos)
			EditField("gizmosColor");	
		
		return GUI.changed;
    }	

}