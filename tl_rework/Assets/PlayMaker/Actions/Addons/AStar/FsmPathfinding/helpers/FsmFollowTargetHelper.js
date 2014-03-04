#pragma strict

import System;
import HutongGames.PlayMaker;
import FsmPathfinding;
import Pathfinding;


public class FsmFollowTargetHelper extends MonoBehaviour{  

		@Tooltip ("Stop the running temporarily. Use the set property action.")
		public var stop : boolean;
		
	  	@Tooltip("Target at the time of call.")
	  	public var target : GameObject;
		
		@Tooltip("Target's position at the time of call. If Target not specified this position is used. If target specified, this is the offset")
	  	public var targetPosition : Vector3;
		
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
	
		@Tooltip ("Should the action finish once it reaches the target? (This would automatically call the FINISH event if there is no other active action in the state.)")
		public var finishOnEnd : boolean;
		
		public var noStepBack : boolean;

		public var costDependendSpeed : float;
			
		/*@Tooltip("WIP : Uses the offset to calculate a new InputPath, then checks if every node connection and node is walkable, if not extends the InputPath to make sure the InputPath is possible. ")
		public var subcalc : FsmBool; */
		
		//Add an optional offset
		public var offset : Vector3;
		
		@Tooltip("This defines the number of frames between each path update.")
		public var GoUpdate = 5;
		
		public var directionOut : Vector3;
		
		@Tooltip("The generated path")	
		public var OutputPath : FsmPath;

	  	
		//Print out debug messages.
	  	public var LogEvents : boolean;
		
		public var drawGizmos = true;

		public var gizmosColor : Color;
		

	  	private var controller : CharacterController;
		private var controller2 : RVOController;
	  //	private var seeker : Seeker;
		private var direction : Vector3 ;
		
	  	public var currentWaypoint : int = 0;
		private var doo : FsmPath;
		private var nextPos : Vector3;
		private var dist : float;
		private var a : float = 1/0f;
		private var path : Path;
		private var p : Path;
		private var pUpdate = 0;
	
		
		
		public function CalculatePath()
		{
			if(target == null )
				var pos = targetPosition;
			else
				pos = target.transform.position + targetPosition;
			p = ABPath.Construct (go.transform.position , pos , OnPathComplete); // create path from current position to closest/first node
			AstarPath.StartPath (p); //make the actual vector3 path which we'll use lateron.
			pUpdate = 0;
		}
			
		public function OnPathComplete() {
			doo = new FsmPath(); // this needs to be an instance even if the actual path is the same.
			doo.Value = p;
			OutputPath = doo;
			path = p;// this distinction makes it work with the previous path until the new one is finished
			currentWaypoint = 0; // new path, then it obviously has to start back at 0;
			if(noStepBack) currentWaypoint += 1;
			Update();//start Update again to avoid any problems whatsoever, especially when stopping and resuming the script.
			}
		
	  
		public function Start() 
	  	{

			controller = go.GetComponent(CharacterController);

			controller2 = go.GetComponent(RVOController);
			if (controller == null && controller2 == null) {
				if(AstarPath.active.HasPro)
				controller2 = go.AddComponent(RVOController);
				else controller = go.AddComponent(CharacterController);
			}

			CalculatePath();
			
      	}
		
		

	  
	 	public function Update()
	 	{
			if(stop) return;
			if ((path == null || !(path.GetState() >= PathState.Returned))){ // only continue if path is valid
			return;
			}
			
			if (pUpdate >= GoUpdate) {CalculatePath();}
			pUpdate += 1; // count one frame on
			
			if (currentWaypoint >= (path.vectorPath).Count) 
			{
				if (finishOnEnd) {
					InputPath = null;
					Destroy(go.GetComponent(FsmFollowTargetHelper));
				}
				return;
			}
			
			nextPos = path.vectorPath[currentWaypoint];
			// Direction to the next waypoint.
			direction = (nextPos - go.transform.position).normalized;
			directionOut = direction;
			
			if (ignoreY){
				direction.y = 0;
				directionOut.y = 0;
				directionOut = directionOut.normalized;
				direction = direction.normalized;
			}
			
			direction *= (1/Math.Exp(costDependendSpeed * path.path[currentWaypoint].penalty)  ) * speed * Time.fixedDeltaTime;
			
			if (controller2 != null) {
			controller2.Move(direction);
			controller2.maxSpeed = (1/Math.Exp(costDependendSpeed * path.path[currentWaypoint].penalty)  ) * speed; }
			else controller.SimpleMove(direction);
			
			// Check if we are close enough to the next waypoint.
			dist = Vector3.Distance(go.transform.position, nextPos);
			if ( dist < nextWaypointDistance) 
			{	
				if (currentWaypoint >= (path.vectorPath).Count - 1) 
				{
					if (dist >= finishDistance){return;}
				}
				// Proceed to follow the next waypoint.
				currentWaypoint++;
				return;
			}
		}
		
		public function OnDrawGizmos () {
			if (path.path == null || !drawGizmos) {
				return;
			}
			
			
			Gizmos.color = gizmosColor;
			
			if (path.vectorPath != null) {
				for (var i=0;i<path.vectorPath.Count()-1;i++) {
					Gizmos.DrawLine (path.vectorPath[i],path.vectorPath[i+1]);
				}
			}
		}
	}

