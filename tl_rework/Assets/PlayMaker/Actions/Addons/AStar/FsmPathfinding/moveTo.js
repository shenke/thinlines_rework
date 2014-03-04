#pragma strict 

import System;
import HutongGames.PlayMaker;
import FsmPathfinding;
import Pathfinding;


@ActionCategory("A Star")
@Tooltip("move an object from its' current position directly to the target position or gameObject")


public class MoveTo extends HutongGames.PlayMaker.FsmStateAction{

	//	public var targetObjectHelper : GameObject;
		@Tooltip("What kind of movement do you want? Depending on the mode new settings will appear. Move To moves to the position of the target at the time of call. Follow To updates until it reaches the target, then finishes. Follow keeps following indefinitely. And Follow Path uses a path input.")
		public var moveMode : MoveMode;
		
		@Tooltip("The length of the path in GScore(pro users : just multiply your unity distance with the distance between each node(the node size on grid graphs) ) to flee/randomly walk on. If you use flee continuously, make sure to turn this to as low as possible, to save performance. All features that involve this attribute are noticably faster in the pro version.")
		public var length : FsmFloat = 10f;
		
		@Tooltip("How many frames should the script wait between updating the path towards the target.")
		public var updateInterval : FsmInt = 0;
		
		@Tooltip("Updates the shadowPath if the target or targetPosition moved more than this distance from the endwaypoint of the current path. If you're using a gridgraph, you might want to set this to the same thing as the node size :) ")
		public var shadowUpdateDistance : FsmFloat = 1f;

		@Tooltip("Uses this as the start Position and moves this gameObject")
      	public var actor : FsmOwnerDefault;    
		
		@ObjectType(typeof(FsmPath))
		@Tooltip("If the path is unequal null , move along this path. Else use the target or target position")	
		public var inputPath : FsmObject;
		
		@Tooltip("should changes on the inputPath update the path this action takes?")
		public var updatePath : boolean = false;
		
	  	@Tooltip("Target at the time of call.")
	  	public var target : FsmGameObject;
		
		@Tooltip("Target's position at the time of call. If Target not specified this position is used. If target specified, this is the offset")
	  	public var targetPosition : FsmVector3;
		
		@Tooltip("What type of controller would you like to use? The RVO controller is a pro only feature. If you choose <available> it will use whatever is already on your actor. If you choose none, you can use the direction output to controle it yourself")
		public var controllerType : ControllerType = ControllerType.available;
		
	  	@Tooltip("Required movement speed.")
	  	public var speed : FsmFloat;
		
		@Tooltip("Should the actor move exactly along the path or should it smoothly interpolate from one node to the next? The radius of each turn depends on the turnRadius")
		public var smoothTurns : FsmBool;
		
		@Tooltip("turnradius in worldunits")
		public var turnRadius : FsmFloat = 0.5;
	  
	  	@Tooltip("This is sent once the actor arrives at the target.")
	  	public var endOfPathEvent : FsmEvent;
	  
	  	@Tooltip("The event that is sent when the path is unreachable.")
	  	public var failedEvent : FsmEvent;
	  
	  	@Tooltip("If the distance to the target is less than this, it's finished.")
	  	public var nextWaypointDistance : FsmFloat;
		
		@Tooltip("if set to absolute, the action will send the finished event once the distance between the actor and the target is less than finishDistance. Using absoluteEndnode it will send Finish once the distance between the last node on the path and the Actor is less than finishDistance. If set to relative, it will send the finish event if the distance along the path is less than finishDistance. If set to last it will go to the second to last node on the path and only then starts checking whether the distance to the last node is less than the finishDistance. Use last on simple movement actions, as it is by far the cheapest. Use relative only when you must, as it can be a tad expensive if your finishDistance is very high.")
		public var finishDistanceMode : FinishDistance = FinishDistance.absolute;
		
		@Tooltip("Stop this distance away from your goal.")
	  	public var finishDistance : FsmFloat;
	  
		@Tooltip("Turn this on to add the target position (or the target object position, if it exists) as the last waypoint. Use this if your target is an empty or a position on the floor to move precisely to that position (and not to the closest node nearby)")
		public var exactFinish : FsmBool;
	  
	  	@Tooltip("If the final position of the path is more than this amount away from where it's supposed to be, the failure event is sent. A high value and still failure means the object can't even get close to the target.")
	  	public var failureTolerance : FsmFloat;
		
		@Tooltip("Moves only on the X and Z axis. Useful for walking on meshes above the grid")
	  	public var ignoreY : FsmBool;
		
		@Tooltip("Should the actor follow even if the action or state is no longer active? If true, this also immediatly fires the endOfPathEvent")
		public var auto : FsmBool;
		
		@Tooltip("set this to a positive value to make the actor walk more slowly if it's walking on a node that has a cost value assigned to it. Set to 0 to turn it off.")
		public var costDependendSpeed : FsmFloat;
		
		@Tooltip("If true, starts at the first node of the path. If false, starts at the closest node. Not needed if the state is picked up in the same or close to the same position you left it when first using the action.")
		public var startAtStart : FsmBool;
	
		@Tooltip("should the action calculate addidtional nodes to connect the current position to the first/nearest node of the path?")
		public var connectPath : FsmBool;
		@ActionSection("Output")

		public var directionOut : FsmVector3;
		
		@ObjectType(typeof(FsmPath))
		@Tooltip("The generated path")	
		public var OutputPath : FsmObject;
		
		
		@Tooltip("The real speed of the actor, with the node costs taken into account")	
		public var outputSpeed : FsmFloat;
		
		@ActionSection("Debug")
	  	
		@Tooltip("Print out debug messages.")
	  	public var LogEvents : FsmBool;
		public var drawGizmos = true;
		public var gizmosColor : FsmColor;

		private var path : Path;
      
      	private var go : GameObject;
		
		private var controller2 : RVOController;
	  	private var controller : CharacterController;
		private var rigidbody : Rigidbody;
	  //	private var seeker : Seeker;
		private var direction : Vector3 ;
		
		private var prevPosition : Vector3;
		private var prevTarget : Vector3;
		
	  	private var currentWaypoint : int = 1;
		private var doo : FsmPath;
		private var nextPos : Vector3;
		private var dist : float;
		private var a : float = 1/0f;
		private var done : boolean = true;
		private var p : Path;
		private var frame : int = 0;
		private var nextDirection : Vector3;
		private var firstFrame : boolean = true;
		private var pathLoading : boolean = false; // this is true whenever the follow mode already waits for the next path. This is important whenever the path creation takes more frames than what the update interval is.
		
		private var time : float = 0f;
	
	enum ControllerType {
	characterController,
	rvoController,
	rigidbody,
	rigidbodyVelocity,
	transform,
	available,
	none,

	}
	enum FinishDistance {
	absoluteEndnode,
	absolute,
	relative,
	last,

	}	
	
	enum MoveMode {
	moveTo,
	followTo,
	follow,
	shadowTo,
	shadow,
	followPath,
	flee,
	fleeContinuously,
	randomPath,
	}	
		
     	public function Reset() 
	  	{
         	actor = null;
			inputPath = null;
			target = null;
			targetPosition = null;
			speed = 200f;
			endOfPathEvent = null;
			failedEvent = null;
			nextWaypointDistance = 1f;
			finishDistance = 1f;
			failureTolerance = 3f;
			length = 10f;
			ignoreY = true;
			auto = false;
			directionOut = null;
			OutputPath = null;
			costDependendSpeed = 0f;
      	}
		
		
		public function OnEnter() 
	  	{
			if(moveMode == MoveMode.followPath){
				path = GetPath(inputPath);
				if(path == null){
					if(LogEvents.Value)Debug.Log("Astar Follow Path failed. The path is null");
					Fsm.Event(failedEvent); Finish(); return;
				}
				else if(path.vectorPath.Count == 0)
				{
					if(LogEvents.Value)Debug.Log("Astar Follow Path failed. The path contains no nodes");
					Fsm.Event(failedEvent); Finish(); return;				
				}
			}
			
			currentWaypoint = 0;
		 	go = actor.OwnerOption == OwnerDefaultOption.UseOwner ? Owner : actor.GameObject.Value;
			if( go == null) {
				if(LogEvents.Value)Debug.Log("Astar Move To failed. The actor is null");
				Fsm.Event(failedEvent); Finish(); return;
			}//finish the action if any of the requirements are not met
			
		 	controller = go.GetComponent(CharacterController);
			controller2 = go.GetComponent(RVOController);
			rigidbody = go.GetComponent(Rigidbody);
			

			if(controllerType == ControllerType.characterController && controller == null)
					controller = go.AddComponent(CharacterController);
			
			else if(controllerType == ControllerType.rvoController && controller2 == null){
				if(AstarPath.active.HasPro)
				{
					controller2 = go.AddComponent(RVOController);
					controller2.Move(new Vector3(0,0,0));
				}
				else 
				{
					controllerType = ControllerType.characterController;//free version can't use RVOControllers
					if(controller == null)
						controller = go.AddComponent(CharacterController);
				}
			}
			
			else if(controllerType == ControllerType.rigidbody && rigidbody == null)
			{
					rigidbody = go.AddComponent(Rigidbody);
					rigidbody.drag = 0.5;
					rigidbody.freezeRotation = true;
			}
			
			else if(controllerType == ControllerType.rigidbodyVelocity && rigidbody == null)
			{
					rigidbody = go.AddComponent(Rigidbody);
					rigidbody.freezeRotation = true;
			}	
			
			if(moveMode != MoveMode.followPath)
				CalculatePath();
			
			if(moveMode == MoveMode.followPath && !startAtStart.Value){
				currentWaypoint = getClosest();
			}
			
			
			if(moveMode == MoveMode.followPath && connectPath.Value){
				done = false;
				ConnectPathX();
			}
			

      	}
		
		public function ConnectPathX(){// connects the current position to the closest position on the path
			p = ABPath.Construct (go.transform.position , path.vectorPath[currentWaypoint] , FinishConnectionX); // create path from current position to closest/first node
			AstarPath.StartPath (p); //make the actual vector3 path which we'll use lateron.
			return;
		}  
		
		public function FinishConnectionX(){
			path.path.InsertRange(currentWaypoint,p.path);// node path, necessary if you want to run modifiers on top of it lateron I think
			path.vectorPath.InsertRange(currentWaypoint,p.vectorPath);// concat lists by adding everything at the currentWaypoint index . That way nothing before this needs to be reset
			doo = new FsmPath();
			doo.Value = path;
			OutputPath.Value = doo;			
			return;
		}
		
		public function getClosest(){
			a =  1/0f;
			var x : int = 1;
			var o = 1f;
			
			 for (var i : int = 0; i < (path.vectorPath).Count; i++)
				{
					o = (path.vectorPath[i] - go.transform.position).sqrMagnitude;
					if(o < a) {
						a = o;
						x = i;
					}
				}
				return x;
		}
		
		public function UpdateCurrentWaypoint(){// checks if the next waypoint is more suited to being the current waypoint
		
			var x : boolean = false;
			var y : boolean = false;
			var z : boolean = false;
			var dir = path.vectorPath[currentWaypoint+1] - path.vectorPath[currentWaypoint];
			if(dir.x<=0) x = true;
			if(dir.y<=0) y = true;
			if(dir.z<=0) z = true;
			var actorDir = go.transform.position - path.vectorPath[currentWaypoint + 1];
			if((x ? (actorDir.x<=0) : (actorDir.x>0))&&(y ? (actorDir.y<=0) : (actorDir.y>0))&&(z ? (actorDir.z<=0) : (actorDir.z>0))){
				currentWaypoint++;
			}
		}
		
		public function CalculatePath()
		{
			if(moveMode != MoveMode.follow && moveMode != MoveMode.followTo && moveMode != MoveMode.fleeContinuously)
				path = null; // do this to avoid instant finishing if the action had been called before and if the actor didn't move
			if (target.Value != null)
				var targetPos = target.Value.transform.position + targetPosition.Value;
			else
				targetPos = targetPosition.Value;
			if(path != null && path.vectorPath.Count > 0 && (moveMode == MoveMode.follow || moveMode == MoveMode.followTo))	
				p = ABPath.Construct (nextPos , targetPos , OnPathComplete); // create path from next waypoint (to avoid jitter due to sudden direction change on path update) to closest/first node
			else if(moveMode != MoveMode.fleeContinuously && moveMode != MoveMode.flee && moveMode != MoveMode.randomPath )
				p = ABPath.Construct (go.transform.position , targetPos , OnPathComplete); // create path from current position to closest/first node
			
			else if(moveMode == MoveMode.fleeContinuously || moveMode == MoveMode.flee ) {
				if(AstarPath.active.HasPro)
					p = FleePath.Construct (go.transform.position , targetPos , length.Value*1000f, OnPathComplete); // create path from current position to closest/first node
				else
					p = ABPath.Construct (go.transform.position , go.transform.position + (go.transform.position - targetPos).normalized * length.Value, OnPathComplete);
			}
			else if (moveMode == MoveMode.randomPath)
				if(AstarPath.active.HasPro)
					p = RandomPath.Construct (go.transform.position, length.Value*1000f , OnPathComplete); // create path from current position to closest/first node
				else // random direction! This is just a cheap immitation of the real randompath!
					p = ABPath.Construct (go.transform.position , go.transform.position + new Vector3(UnityEngine.Random.Range(-1f,1f), 0f, UnityEngine.Random.Range(-1f,1f)).normalized * length.Value, OnPathComplete);
			AstarPath.StartPath (p); //make the actual vector3 path which we'll use lateron.
			
			time = Time.time;
			return;
		}
			
		public function OnPathComplete() {
			if (go == null) {Finish(); return; }
			doo = new FsmPath(); // this needs to be an instance even if the actual path is the same.
			//if(path != null)
				//path.Release(path);
			path = p;
			currentWaypoint = 1;
			if(moveMode == MoveMode.followPath)
				currentWaypoint = 0;// used to be getClosest() + 1;
			else if(moveMode == MoveMode.follow || moveMode == MoveMode.followTo || moveMode == MoveMode.fleeContinuously)
				currentWaypoint = (path.vectorPath.Count >= 2 && (path.vectorPath[0]-go.transform.position).sqrMagnitude <= (path.vectorPath[1]-go.transform.position).sqrMagnitude) ? 0 : 1;
			doo.Value = path;
			OutputPath.Value = doo;
			if (LogEvents.Value)
				Debug.Log(" Time needed to create path : " + (Time.time - time));
			pathLoading = false;
			if(exactFinish.Value)
				path.vectorPath.Add(target.Value == null ? targetPosition.Value : target.Value.transform.position);
			return;
		}
		
		public function ShadowExtendPath(){
			if((target.Value != null && (target.Value.transform.position - path.vectorPath[path.vectorPath.Count - 1]).sqrMagnitude >= shadowUpdateDistance.Value * shadowUpdateDistance.Value)){
				path.vectorPath.Add(target.Value.transform.position);
				path.path.Add(AstarPath.active.GetNearest(target.Value.transform.position).node);
			}
			else if((target.Value == null && (targetPosition.Value - path.vectorPath[path.vectorPath.Count - 1]).sqrMagnitude >= shadowUpdateDistance.Value * shadowUpdateDistance.Value)){
				path.vectorPath.Add(targetPosition.Value);
				path.path.Add(AstarPath.active.GetNearest(targetPosition.Value).node);
			}
		}
		
		public function Auto() {
			var moo = go.GetComponent(FsmMoveOnPath);
			if(moo == null) {
				moo = go.AddComponent(FsmMoveOnPath);
			}
			moo.go = go;
			moo.InputPath = path;
			moo.speed = speed.Value;
			moo.finishDistance = finishDistance.Value;
			moo.nextWaypointDistance = nextWaypointDistance.Value;
			moo.failureTolerance = failureTolerance.Value;
			moo.ignoreY = ignoreY.Value;
			//moo.offset = offset.Value;
			moo.LogEvents = LogEvents.Value;
			moo.currentWaypoint = currentWaypoint;
			moo.costDependendSpeed = costDependendSpeed.Value;
			
		}
		
		function Move() {
			// previous path is not cleared on reload. That's why it's finishing and why there's no error !!!!!!
			if(controllerType == ControllerType.rvoController || (controllerType == ControllerType.available && controller2 != null))
			{
				if (controller2 != null) 
				{
					controller2.Move(direction);
					controller2.maxSpeed = (direction).magnitude; 
				}
				else
				{
					if(LogEvents.Value)
						Debug.Log("Astar Move To failed. The controller was removed");
					Fsm.Event(failedEvent); Finish(); return;
				}
			}
			
			if(controllerType == ControllerType.characterController || (controllerType == ControllerType.available && controller != null))
			{
				if (controller != null) 
				{
					controller.SimpleMove(direction);
				}
				else
				{
					if(LogEvents.Value)
						Debug.Log("Astar Move To failed. The controller was removed");
					Fsm.Event(failedEvent); Finish(); return;
				}
			}
			if(controllerType == ControllerType.rigidbody || controllerType == ControllerType.rigidbodyVelocity){
				if (controllerType == ControllerType.rigidbody && rigidbody != null) 
				{
					rigidbody.AddForce(direction*Time.deltaTime*100*rigidbody.mass);
				}
				
				else if ((controllerType == ControllerType.rigidbodyVelocity || controllerType == ControllerType.available) && rigidbody != null) 
				{
					if(ignoreY.Value)
						rigidbody.velocity = Vector3(direction.x,rigidbody.velocity.y,direction.z)*110;
					else
						rigidbody.velocity = direction*Time.deltaTime*110;
					rigidbody.WakeUp();
				}
				else
				{
					if(LogEvents.Value)
						Debug.Log("Astar Move To failed. The rigidbody controller was removed");
					Fsm.Event(failedEvent); Finish(); return;
				}
			}
			
			if(controllerType == ControllerType.transform || (controllerType == ControllerType.available && controller2 == null && controller == null && rigidbody == null))
			{
				go.transform.position += direction * Time.deltaTime;
			}
			
		}
	 	public function OnUpdate()
	 	{	
			if(updatePath && moveMode == MoveMode.followPath)
			{
				path = GetPath(inputPath);
			}
			if (path == null || path.vectorPath.Count == 0){ // only continue if path is valid
				return;
			}
			if(!pathLoading && ((moveMode == MoveMode.follow || moveMode == MoveMode.followTo || moveMode == MoveMode.fleeContinuously) && frame >= Math.Max(1,updateInterval.Value)) )
			{
				CalculatePath();
				pathLoading = true;
				frame = 0;
			}
			else frame += 1;
			
			if(moveMode == MoveMode.shadow || moveMode == MoveMode.shadowTo ) {
				ShadowExtendPath();
			}
			
			if(auto.Value)
			{
				Auto();
				if (endOfPathEvent != null) {
					Fsm.Event(endOfPathEvent);
				}
				Finish();
			}
			
			if (currentWaypoint >= (path.vectorPath).Count) 
			{
				currentWaypoint = path.vectorPath.Count-1;
			}
			
			if ((finishDistanceMode == FinishDistance.absolute && (
				(target.Value != null && (target.Value.transform.position - go.transform.position).sqrMagnitude <= finishDistance.Value*finishDistance.Value) 
				|| (ignoreY.Value && target.Value != null && (Vector3(target.Value.transform.position.x,go.transform.position.y,target.Value.transform.position.z) - go.transform.position).sqrMagnitude <= finishDistance.Value*finishDistance.Value) 
				|| (target.Value == null && Vector3.Distance(go.transform.position,targetPosition.Value) <= finishDistance.Value))
				) ||
				(finishDistanceMode == FinishDistance.absoluteEndnode  && (
				(!ignoreY.Value && Vector3.Distance(go.transform.position,path.vectorPath[path.vectorPath.Count-1])<=finishDistance.Value) 
				|| (ignoreY.Value && Vector3.Distance(new Vector3(go.transform.position.x,path.vectorPath[path.vectorPath.Count-1].y,go.transform.position.z),path.vectorPath[path.vectorPath.Count-1])<=finishDistance.Value)))
			   )
			{ 
				Debug.Log("Finish");
				if(moveMode != MoveMode.follow && moveMode != MoveMode.shadow && moveMode != MoveMode.fleeContinuously){
					if (LogEvents.Value)
						Debug.Log ("End Of path reached.");
					if (controller2 != null && controllerType == ControllerType.rvoController) //RVO controller needs to be set to 0/0/0 , else it continues running.
						controller2.Move(new Vector3(0,0,0));	
					if(rigidbody != null && (controllerType == ControllerType.rigidbody || controllerType == ControllerType.rigidbodyVelocity))
						rigidbody.velocity = Vector3(0,rigidbody.velocity.y,0);
					if(endOfPathEvent != null)
						Fsm.Event(endOfPathEvent);
					Finish();return;
				}
				else return;
			}
			
			else if(finishDistanceMode == FinishDistance.relative  )
			{
				var i = currentWaypoint;
				var leng : float = 0;
				while(i<path.vectorPath.Count-1)
				{
					leng+= Vector3.Distance(path.vectorPath[currentWaypoint], path.vectorPath[currentWaypoint+1]);
					if(leng>finishDistance.Value) // if the distance is still too far to finish, break to save performance
						break;
				}
				if(leng<= finishDistance.Value)
				{
					if(moveMode != MoveMode.follow && moveMode != MoveMode.shadow && moveMode != MoveMode.fleeContinuously){
						if (LogEvents.Value)
							Debug.Log ("End Of path reached.");
						if (controller2 != null && controllerType == ControllerType.rvoController) //RVO controller needs to be set to 0/0/0 , else it continues running.
							controller2.Move(new Vector3(0,0,0));	
						if(rigidbody != null &&(controllerType == ControllerType.rigidbody || controllerType == ControllerType.rigidbodyVelocity))
							rigidbody.velocity = Vector3(0,rigidbody.velocity.y,0);
							
						Fsm.Event(endOfPathEvent);Finish();return;
					}
					else return;
				}
			
			}
			

			// Check if we are close enough to the next waypoint.
			if(ignoreY.Value) {
				var distVec = nextPos - go.transform.position ;
				distVec.y = 0;
				dist = distVec.magnitude;
			}
			else{
				dist = Vector3.Distance(go.transform.position, nextPos);
			}
			if ( dist < nextWaypointDistance.Value && !smoothTurns.Value) 
			{	
				if (finishDistanceMode == FinishDistance.last && currentWaypoint >= (path.vectorPath).Count - 1) 
				{
				if(moveMode != MoveMode.follow && moveMode != MoveMode.shadow && moveMode != MoveMode.fleeContinuously){
						if (LogEvents.Value)
							Debug.Log ("End Of path reached.");
						if (controller2 != null && controllerType == ControllerType.rvoController) //RVO controller needs to be set to 0/0/0 , else it continues running.
							controller2.Move(new Vector3(0,0,0));	
						if(rigidbody != null &&(controllerType == ControllerType.rigidbody || controllerType == ControllerType.rigidbodyVelocity))
							rigidbody.velocity = Vector3(0,rigidbody.velocity.y,0);
							
						Fsm.Event(endOfPathEvent);Finish();return;
					}
				}
				// Proceed to follow the next waypoint.
				currentWaypoint++;
				currentWaypoint = Math.Min(currentWaypoint,path.vectorPath.Count-1);
			}

			nextPos = path.vectorPath[currentWaypoint];
			// Direction to the next waypoint.
			if(!smoothTurns.Value){
				direction = (nextPos - go.transform.position).normalized;
			}
			//test

			else {
				var turnDistance : float = 0f;
				var targetPos : Vector3 = prevTarget;
				if(frame == 1){
					if(firstFrame)
						targetPos = go.transform.position; // keep targetPos on update 
						currentWaypoint = 1;
					path.vectorPath[0] = targetPos;
				}
				currentWaypoint = Math.Min(currentWaypoint,path.vectorPath.Count-2);
				var deltaPos : float;
				
				if( frame == 1) {
					deltaPos = turnRadius.Value - (targetPos - go.transform.position).magnitude;
				}			
				else deltaPos = (go.transform.position - prevPosition).magnitude;
				
				
				if(deltaPos*deltaPos > (path.vectorPath[currentWaypoint+1]-targetPos).sqrMagnitude){
					while (deltaPos*deltaPos > (path.vectorPath[currentWaypoint+1]-targetPos).sqrMagnitude) {
						currentWaypoint++;
						currentWaypoint = Math.Min(currentWaypoint, path.vectorPath.Count - 2);
						targetPos = path.vectorPath[currentWaypoint];
						deltaPos -= (path.vectorPath[currentWaypoint]-targetPos).magnitude;
					}
				}
				
				if ((targetPos-go.transform.position).sqrMagnitude < turnRadius.Value*turnRadius.Value){
					targetPos += ((path.vectorPath[currentWaypoint+1]-targetPos).normalized) * deltaPos *1.5f ;
					}
				 
			//	targetObjectHelper.transform.position = targetPos;
				prevPosition = go.transform.position;
				prevTarget = targetPos;
				direction = (targetPos - go.transform.position).normalized;

			}

			directionOut.Value = direction;
			
				if (ignoreY.Value){
				direction.y = 0;
				directionOut.Value.y = 0;
				directionOut.Value = directionOut.Value.normalized;
				direction = direction.normalized;
			}
			outputSpeed.Value = (1/Math.Exp(costDependendSpeed.Value * path.path[Math.Min(currentWaypoint,path.path.Count-1)].penalty)  ) * speed.Value;
			direction *= outputSpeed.Value; // 1/e^x for exponentially slower speed, but never 0 or negative or more than 1. Math classes were good for something afterall :D
			
			Move();
			
			firstFrame = false;
			
			
			if (drawGizmos && path != null && path.path != null && path.vectorPath != null) {
				for (i=0;i<path.vectorPath.Count()-1;i++) {
					Debug.DrawLine (path.vectorPath[i] ,path.vectorPath[i+1],gizmosColor.Value);
				}
			}
			
			return;
		}
		
		public function OnExit() {
			if (controller2 != null)
			controller2.maxSpeed = 0;
		}
		
	}

