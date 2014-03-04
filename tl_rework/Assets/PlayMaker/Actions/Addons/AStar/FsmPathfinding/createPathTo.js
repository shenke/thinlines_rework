#pragma strict

import System;
import HutongGames.PlayMaker;
import FsmPathfinding;
import Pathfinding;


@ActionCategory("A Star")
@Tooltip("Using the Seeker component on a GameObject a path is calculated and then followed.")


public class createPathTo extends HutongGames.PlayMaker.FsmStateAction{

		@Tooltip("Uses this as the start Position. Also requires a seeker component to create the path. You can create one before calling this action and remove it right after this action is done if you want / if the gameObject is some generic thing.")
      	public var gameObject : FsmOwnerDefault;       
		
		@Tooltip("Target at the time of call.")
	  	public var target : FsmGameObject;
		
		@Tooltip("Target's position at the time of call. If Target not specified this position is used.")
	  	public var targetPosition : FsmVector3;
		
		@Tooltip("This is sent once the path is finished")
	  	public var PathComplete : FsmEvent;

		@ActionSection("Debug")
	  	
		@Tooltip("Print out debug messages.")
	  	public var LogEvents : FsmBool;
		
		@ActionSection("Output")
		@ObjectType(typeof(FsmPath))
		@Tooltip("Alternatively use a path directly. Overwrites everything else as a path, if set.")	
		public var OutputPath : FsmObject;

		private var path : Path;
      
      	private var go : GameObject;

		
		private var doo = new FsmPath();
		
		
    	public function Reset() 
	  	{
         	gameObject = null;
			target = new FsmGameObject();
			targetPosition = null;
			PathComplete = null;
			OutputPath = null;
      	}
		
		
		public function OnEnter() 
	  	{
		 	go = gameObject.OwnerOption == OwnerDefaultOption.UseOwner ? Owner : gameObject.GameObject.Value;

			if(!OutputPath.UseVariable) {Debug.Log("create Path : No variable to save path to"); Finish(); return;}
			
			if (target.Value != null)
			{
				targetPosition = target.Value.transform.position;
				
				if (LogEvents.Value)
					Debug.Log ("Target was specified, getting position.");
			}
	
		 	CalculatePath();
      	}
		
		
	  	public function CalculatePath() 
		{
			path = ABPath.Construct (go.transform.position , targetPosition.Value , OnPathComplete); // create path from current position to closest/first node
			AstarPath.StartPath (path); //make the actual vector3 path which we'll use lateron.
			if (LogEvents.Value)
					Debug.Log ("Start Position" + go.transform.position + "End Position" + targetPosition.Value);
			return;
	  	}
		
	  	public function OnPathComplete(p : Path) 
	  	{
			if (LogEvents.Value)
					Debug.Log ("Path Completed");
			doo = new FsmPath();
			doo.Value = p;
			OutputPath.Value = doo;
			
			Debug.Log((OutputPath.Value as FsmPath).Value);


			if (PathComplete != null) {
				Fsm.Event(PathComplete);}
			else{
				Finish();}
		}
      

	  
   	}
	

