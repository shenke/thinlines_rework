#pragma strict

import System;
import HutongGames.PlayMaker;
import FsmPathfinding;
import Pathfinding;
import System.Linq;
import FsmConverter;


@ActionCategory("A Star")
@Tooltip("This action creates an exact replica of the first path, without them being related to each other.")


public class duplicatePath extends HutongGames.PlayMaker.FsmStateAction{
		@ActionSection("Input")
		@ObjectType(typeof(FsmPath))
		@Tooltip("Input Path")	
		public var InputPath : FsmObject;
		
		@ActionSection("Output")
		@ObjectType(typeof(FsmPath))
		@Tooltip("Save duplicate path to this")	
		public var OutputPath : FsmObject;
		
		
		public function Reset()
		{
			InputPath = FsmObject();
			OutputPath = FsmObject();
			
		}

      
		public function OnEnter() 
	  	{
			var mo : FsmPath = InputPath.Value as FsmPath;
			
			if( (typeof(mo) == null) || (mo.Value == null) || !OutputPath.UseVariable) {Debug.Log("Input Incomplete"); Finish(); return;} // also abort the action if there is no variable to save to.
			
					
			
			var a : ABPath  = (InputPath.Value as FsmPath).Value as ABPath;
			
			var b : ABPath = Pathfinding.PathPool.<Pathfinding.ABPath>.GetPath(); // I can't instantiate so there's nothing but the manual way left
			
			b.duration = a.duration;
			b.heuristicScale = a.heuristicScale;
			b.enabledTags = a.enabledTags;
			b.radius = a.radius;
			b.searchedNodes = a.searchedNodes;
			b.searchIterations = a.searchIterations;
			b.speed = a.speed;
			b.turnRadius = a.turnRadius;
			b.recycled = a.recycled;
			b.nnConstraint = a.nnConstraint;
			b.path = a.path;
			b.vectorPath = a.vectorPath;

			
			OutputPath.Value = SetPath(b);
			
			
			


			Finish();	
		}
		

	  
   	}
	

	//public function Reset(){
	//}

	//public function OnEnter(){
	//var doo : FsmPath = InputPath.Value;
	//}

