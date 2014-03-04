#pragma strict

import System;
import HutongGames.PlayMaker;
import FsmPathfinding;
import Pathfinding;


public class FsmMoveOnPath extends MonoBehaviour{

		@Tooltip ("Stop the running temporarily. Use the set property action.")
		public var stop : boolean;
		
		//move this gameObject.
	  	//@CheckForComponent(typeof(Seeker))
      	public var go : GameObject;    
		
		//Move along this InputPath	
		public var InputPath : Path;

	  	//Required movement speed.
	  	public var speed : float;
	  
		
		//Stop this distance away from your goal.
	  	public var finishDistance : float;
		
	  	//If the distance to the target is less than this, it's finished.
	  	public var nextWaypointDistance : float;
		
	  	//If the final position of the InputPath is more than this amount away from where it's supposed to be, the failure event is sent. A high value and still failure means the object can't even get close to the target.
	  	public var failureTolerance : float;
		
		//Moves only on the X and Z axis. Useful for walking on meshes above the grid
	  	public var ignoreY : boolean;
	
		public var costDependendSpeed : float;
		
		/*@Tooltip("WIP : Uses the offset to calculate a new InputPath, then checks if every node connection and node is walkable, if not extends the InputPath to make sure the InputPath is possible. ")
		public var subcalc : FsmBool; */
		
		//Add an optional offset
		public var offset : Vector3;

		public var directionOut : Vector3;

	  	
		//Print out debug messages.
	  	public var LogEvents : boolean;
		
		public var drawGizmos = true;

		private var controller2 : RVOController;
	  	private var controller : CharacterController;
	  //	private var seeker : Seeker;
		private var direction : Vector3 ;
		
	  	public var currentWaypoint : int = 0;
		private var doo : FsmPath;
		private var nextPos : Vector3;
		private var dist : float;
		private var a : float = 1/0f;
	
		
		public function UpdatePath()
		{
			if (InputPath == null) {
				var moo = go.GetComponent(FsmMoveOnPath);
				Destroy(moo);
			}
			return;
		}
		
	  
		public function Start() 
	  	{
		 	
		 	controller = go.GetComponent(CharacterController);
			controller2 = go.GetComponent(RVOController);
			if (controller == null && controller2 == null) {
				if(AstarPath.active.HasPro){
				controller2 = go.AddComponent(RVOController);
				controller2.Move(new Vector3(0,0,0));}
				else controller = go.AddComponent(CharacterController);
			}
			
			UpdatePath();
			
      	}
		

	  
	 	public function Update()
	 	{
			if(stop) return;
			UpdatePath();
			
			//nextWaypointDistance = Vector3.Distance(go.transform.position,nextPos);
			// If there is no InputPath yet.
			if (InputPath == null) return;
			if (currentWaypoint >= (InputPath.vectorPath).Count) 
			{
				InputPath = null;
				if (controller2 != null) //NVO controller needs to be set to 0/0/0 , else it continues running.
					controller2.Move(new Vector3(0,0,0));
				Destroy(go.GetComponent(FsmMoveOnPath));
				return;
			}
			nextPos = InputPath.vectorPath[currentWaypoint];
			// Direction to the next waypoint.
			direction = (nextPos - go.transform.position).normalized;
			directionOut = direction;
			
			if (ignoreY){
				direction.y = 0;
				direction = direction.normalized;
			}
			
			direction *= (1/Math.Exp(costDependendSpeed * InputPath.path[currentWaypoint].penalty)  ) * speed * Time.fixedDeltaTime;
			
			if (controller2 != null) {
			controller2.Move(direction);
			controller2.maxSpeed = (1/Math.Exp(costDependendSpeed * InputPath.path[currentWaypoint].penalty)  ) * speed; }
			else controller.SimpleMove(direction);
			
			// Check if we are close enough to the next waypoint.
			dist = Vector3.Distance(go.transform.position, nextPos);
			if ( dist < nextWaypointDistance) 
			{	//Debug.Log(doo.Value.vectorPath[currentWaypoint]);
				if (currentWaypoint >= (InputPath.vectorPath).Count - 1) 
				{
					if (dist >= finishDistance){return;}
				}
				// Proceed to follow the next waypoint.
				currentWaypoint++;
				return;
			}
		}
		
		public function OnDrawGizmos () {
				if (InputPath.path == null || !drawGizmos) {
					return;
				}
				
				
				Gizmos.color = new Color (0,1F,0,1F);
				
				if (InputPath.vectorPath != null) {
					for (var i=0;i<InputPath.vectorPath.Count()-1;i++) {
						Gizmos.DrawLine (InputPath.vectorPath[i],InputPath.vectorPath[i+1]);
					}
				}
			}
	}

